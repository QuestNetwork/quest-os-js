import { Subject } from "rxjs";
import { InviteManager }  from './inviteManager.js';
import { ChallengeManager }  from './challengeManager.js';
const { v4: uuidv4 } = require('uuid');

export class ChannelManager {

  constructor(){
    let uVar;
    this.bee = uVar;
    this.dolphin = uVar;

  }

  sayHi(channel){
    this.dolphin.sayHi(channel);
    return true;
  }

  load(config){
    this.invite = new InviteManager(config['dependencies']['bee'],config['dependencies']['dolphin']);
    this.challenge = new ChallengeManager(config['dependencies']['dolphin']);
    this.bee = config['dependencies']['bee'];
    this.dolphin = config['dependencies']['dolphin'];
    this.selectedChannelSub = new Subject();
  }

  select(v){
    if(typeof v == 'undefined'){
      return false;
    }
    if(v == "NoChannelSelected"){
      this.bee.config.setSelectedChannel(v);
      this.selectedChannelSub.next(v);
      this.bee.config.commit();
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
        let chfl;

        console.log('QUEST OS: Adding Channel...',channelName);
        if(channelName.indexOf('qprivatedch') > -1){
           chfl = this.bee.config.getFavoriteFolderList();
        }else{
           chfl = this.bee.config.getChannelFolderList();
        }

        for(let i=0; i<folders.length;i++){
          let newFolder = { id: uuidv4(), data: { name: folders[i], kind:"dir", items: 0 }, expanded: true, children: [] };
          chfl = this.bee.config.parseFolderStructureAndPushItem(chfl, parentFolderId, newFolder, true);
          parentFolderId = this.bee.config.getParseAndImportParentIdCache();
        }


        if(channelName.indexOf('qprivatedch') > -1){
          this.bee.config.setFavoriteFolderList(chfl);
        }else{
          this.bee.config.setChannelFolderList(chfl);
        }

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
 async create(channelNameDirty, parentFolderId = "",isFavorite = false){
   let channelNameClean = await this.dolphin.createChannel(channelNameDirty);
   if(isFavorite){
     this.bee.config.addToFavoriteFolderList(channelNameClean, parentFolderId);
   }
   else{
      this.bee.config.addToChannelFolderList(channelNameClean, parentFolderId);
    }
   this.bee.config.commitNow();
   return channelNameClean;
 }
 async add(channelNameClean, parentFolderId = ""){
   try{
     await this.dolphin.addChannel(channelNameClean);
   }catch(e){}


   if(channelNameClean.indexOf('qprivatedch') > -1){
     this.bee.config.addToFavoriteFolderList(channelNameClean, parentFolderId);
   }else{
     this.bee.config.addToChannelFolderList(channelNameClean, parentFolderId);
   }

   this.bee.config.commitNow();
   return channelNameClean;
 }
 removeFromNameList(channelName){
  this.dolphin.setChannelNameList(this.dolphin.getChannelNameList().filter(e => e != channelName));
 }

 isPeerOnline(channelPubKey){
   return this.dolphin.isOnline(channelPubKey);
 }

 remove(channel){
   //remove from channelNameList




   let channelNameList = this.dolphin.getChannelNameList().filter(e => e != channel);
   this.dolphin.setChannelNameList(channelNameList);
   //remove from channelFolderList

    if(channel.indexOf('qprivatedch') > -1){
       try{
       let chfl = this.bee.config.getFavoriteFolderList();
       chfl = this.bee.config.parseFolderStructureAndRemoveItem(chfl, channel);
       this.bee.config.setFavoriteFolderList(chfl);
      }catch(e){console.log(e)}
   }
   else{
     try{
     let chfl = this.bee.config.getChannelFolderList();
     chfl = this.bee.config.parseFolderStructureAndRemoveItem(chfl, channel);
     this.bee.config.setChannelFolderList(chfl);
      }catch(e){console.log(e)}
   }

 //
 // try{
 //  let chfl = this.bee.config.getFavoriteFolderList();
 //   chfl = this.bee.config.parseFolderStructureAndRemoveItem(chfl, channel);
 //   this.bee.config.setFavoriteFolderList(chfl);
 // }catch(e){console.log(e)}


   this.bee.config.commitNow();
 }

 async publish(channel, messageOrpubObj, type = 'CHANNEL_MESSAGE'){

   if(typeof messageOrpubObj == 'object' && messageOrpubObj['channel'] == 'undefined'){
     messageOrpubObj['channel'] = channel;
   }

   if(typeof messageOrpubObj == 'object' && messageOrpubObj['type'] == 'undefined'){
     messageOrpubObj['type'] = type;
   }

  await this.dolphin.publish(channel, messageOrpubObj, type);
}

  getParticipantFolders(channel){
    return this.bee.comb.get('/messages/channel/'+channel+'/folders');
  }
  setParticipantFolders(channel,folders){
     this.bee.comb.set('/messages/channel/'+channel+'/folders', folders);
    return true;
  }


  find(pubKey){
    let chNameList = this.dolphin.getChannelNameList().filter(e => e.indexOf(pubKey) > -1);
    return chNameList[0];
  }




}
