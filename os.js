import * as Ipfs from 'ipfs';
const { v4: uuidv4 } = require('uuid');
import { Subject } from "rxjs";
import { Ocean }  from '@questnetwork/quest-ocean-js';
import { BeeSwarmInstance }  from '@questnetwork/quest-bee-js';

export class OperatingSystem {
    constructor() {
      let uVar;
      this.ocean = Ocean;
      this.ready = false;
      this.isReadySub = new Subject();
      this.bee = new BeeSwarmInstance();
    }

    delay(t, val = "") {
       return new Promise(function(resolve) {
           setTimeout(function() {
               resolve(val);
           }, t);
       });
    }

    isSignedIn(){
      return this.bee.config.isSignedIn();
    }

    async boot(config){
      await this.ocean.create(config);
      config['dependencies']['dolphin'] = this.ocean.dolphin;
      await this.bee.start(config);

      this.ocean.dolphin.commitNowSub.subscribe( (value) => {
        this.bee.config.commitNow();
      });

      this.ocean.dolphin.commitSub.subscribe( (value) => {
        this.bee.config.commit();
      });


      this.ocean.dolphin.selectedChannelSub.subscribe( (value) => {
        this.bee.config.selectChannel(value);
      });

      this.ready = true;
      this.isReadySub.next(true);
      return true;
    }

    isReady(){
      return this.ready;
    }

    commit(){
      this.bee.config.commit();
    }
    commitNow(){
      this.bee.config.commitNow();
    }


    async importChannel(channelName,folders,parentFolderId,inviteToken,importFolderStructure){
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
          await this.addChannel(channelName, parentFolderId);
          this.ocean.dolphin.addInviteToken(channelName,inviteToken);
      }
      else{
        console.log(parentFolderId);
        await this.addChannel(channelName, parentFolderId);
        this.ocean.dolphin.addInviteToken(channelName,inviteToken);
      }

      return true;
    }
   async createChannel(channelNameDirty, parentFolderId = ""){
     let channelNameClean = await this.ocean.dolphin.createChannel(channelNameDirty);
     this.bee.config.addToChannelFolderList(channelNameClean, parentFolderId);
     this.commitNow();
     return channelNameClean;
   }
   async addChannel(channelNameClean, parentFolderId = ""){
     try{
       await this.ocean.dolphin.addChannel(channelNameClean);
     }catch(e){}
     this.bee.config.addToChannelFolderList(channelNameClean, parentFolderId);
     this.commitNow();
     return channelNameClean;
   }
   removeChannel(channel){
     //remove from channelNameList
     let channelNameList = this.ocean.dolphin.getChannelNameList().filter(e => e != channel);
     this.ocean.dolphin.setChannelNameList(channelNameList);
     //remove from channelFolderList
     let chfl = this.bee.config.getChannelFolderList();
     chfl = this.bee.config.parseFolderStructureAndRemoveItem(chfl, channel);
     this.bee.config.setChannelFolderList(chfl);
     this.commitNow();
   }
   createInvite(channel,newInviteCodeMax, importFolders = false){
     let code = uuidv4();
     let link = ""
     if(importFolders){
       //traverse folders and find this channel in the tree
       let pathArray = this.bee.config.parseFolderStructureAndGetPath(this.bee.config.getChannelFolderList(), channel);
       if(pathArray.length > 0){
         link = pathArray.join("/////") + "/////" + channel + ":" + code;
       }
       else{
         link = channel + ":" + code;
       }
       console.log(pathArray);
     }
     else{
         link = channel + ":" + code;
     }

     link = Buffer.from(link,'utf8').toString('hex');
     this.ocean.dolphin.addInviteCode(channel,link,code,newInviteCodeMax);
     this.commitNow();
     return link;
   }





  }
