import { Subject } from "rxjs";
import { InviteManager }  from './inviteManager.js';

export class ChannelManager {

  constructor(bee,dolphin){
    this.invite = new InviteManager(bee,dolphin);
    this.bee = bee;
    this.dolphin = dolphin;
    this.selectedChannelSub = new Subject();
  }

  selectChannel(v){
    if(typeof v == 'undefined'){
      return false;
    }

    this.dolphin.selectChannel(v);
    this.bee.config.setSelectedChannel(v);
    this.selectedChannelSub.next(v);
    this.bee.config.commit();
  }

  getSelectedChannel(v){
    let channel = "NoChannelSelected";
    console.log( this.bee.config.getSelectedChannel() );
    if( typeof this.bee.config.getSelectedChannel()  != 'undefined'  && this.bee.config.getSelectedChannel() != "NoChannelSelected" ){
      channel = this.bee.config.getSelectedChannel();
    }
    else if(typeof this.dolphin.getSelectedChannel()  != 'undefined'  && this.dolphin.getSelectedChannel() != "NoChannelSelected" ){
      channel = this.dolphin.getSelectedChannel();
    }
    return channel;
  }

  onSelectChannel(){
    return this.selectedChannelSub;
  }
  listen(ch){
    return this.dolphin.listen(ch);
  }

  async import(channelName,folders,parentFolderId,inviteToken,importFolderStructure){
    if(typeof parentFolderId == 'undefined'){parentFolderId = ""}
    if(importFolderStructure == 1 && folders.length > 0){
        //see if folders exist starting at parentFolderId
        console.log(parentFolderId);
        let chfl = this.bee.config.getChannelFolderList();
        for(let i=0; i<folders.length;i++){
          let newFolder = { id: uuidv4(), data: { name: folders[i], kind:"dir", items: 0 }, expanded: true, children: [] };
          chfl = this.bee.config.parseFolderStructureAndPushItem(chfl, parentFolderId, newFolder, true);
          parentFolderId = this.bee.config.getParseAndImportParentIdCache();
        }

        this.bee.config.setChannelFolderList(chfl);
        await this.add(channelName, parentFolderId);
        this.dolphin.addInviteToken(channelName,inviteToken);
    }
    else{
      console.log(parentFolderId);
      await this.add(channelName, parentFolderId);
      this.dolphin.addInviteToken(channelName,inviteToken);
    }

    return true;
  }
 async create(channelNameDirty, parentFolderId = ""){
   let channelNameClean = await this.dolphin.createChannel(channelNameDirty);
   this.bee.config.addToChannelFolderList(channelNameClean, parentFolderId);
   this.bee.config.commitNow();
   return channelNameClean;
 }
 async add(channelNameClean, parentFolderId = ""){
   try{
     await this.dolphin.addChannel(channelNameClean);
   }catch(e){}
   this.bee.config.addToChannelFolderList(channelNameClean, parentFolderId);
   this.bee.config.commitNow();
   return channelNameClean;
 }
 remove(channel){
   //remove from channelNameList
   let channelNameList = this.dolphin.getChannelNameList().filter(e => e != channel);
   this.dolphin.setChannelNameList(channelNameList);
   //remove from channelFolderList
   let chfl = this.bee.config.getChannelFolderList();
   chfl = this.bee.config.parseFolderStructureAndRemoveItem(chfl, channel);
   this.bee.config.setChannelFolderList(chfl);
   this.bee.config.commitNow();
 }

 async publish(channel, message, type = 'CHANNEL_MESSAGE'){
  await this.dolphin.publishChannelMessage(channel, message, type = 'CHANNEL_MESSAGE');
}



}
