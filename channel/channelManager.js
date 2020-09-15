import { Subject } from "rxjs";
import { InviteManager }  from './inviteManager.js';
import { ChallengeManager }  from './challengeManager.js';

export class ChannelManager {

  constructor(){
    let uVar;
    this.bee = uVar;
    this.dolphin = uVar;

  }

  load(config){
    this.invite = new InviteManager(config['dependencies']['bee'],config['dependencies']['dolphin']);
    this.challenge = new ChallengeManager(config['dependencies']['dolphin']);
    this.bee = config['dependencies']['bee'];
    this.dolphin = config['dependencies']['dolphin'];
    this.selectedChannelSub = new Subject();
  }

  select(v){
    if(typeof v == 'undefined' || v == "NoChannelSelected"){
      return false;
    }
    this.bee.config.setSelectedChannel(v);
    this.selectedChannelSub.next(v);
    this.bee.config.commit();
  }
  getSelected(v){
    let defaultCh = "NoChannelSelected";
    if( typeof this.bee.config.getSelectedChannel()  != 'undefined'  && this.bee.config.getSelectedChannel() != "NoChannelSelected" ){
      return this.bee.config.getSelectedChannel();
    }
    return defaultCh;
  }

  onSelect(){
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
