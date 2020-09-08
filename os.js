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

    async boot(config){
      await this.ocean.create(config);
      config['dependencies']['dolphin'] = this.ocean.dolphin;
      this.bee.start(config);

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

    commitNow(){
      this.bee.config.commitNow();
    }


    async importChannel(channelName,folders,parentFolderId,inviteToken,importFolderStructure){

      if(importFolderStructure == 1 && folders.length > 0){
          //see if folders exist starting at parentFolderId
          console.log(parentFolderId);
          let chfl = this.bee.config.getChannelFolderList();
          for(let i=0; i<folders.length;i++){
            let newFolder = { data: { name: folders[i], kind:"dir", items: 0 }, id: uuidv4(),expanded: true, children: [] };

            if(parentFolderId == ""){
              //check if exist at top level
              let exists = false;
              for (let i2=0;i2<chfl.length;i2++){
                if(chfl[i2]['data']['name'] == newFolder['data']['name']){
                  exists = true;
                  if(typeof chfl[i2]['id'] == 'undefined'){
                    chfl[i2]['id'] = uuidv4();
                  }
                  parentFolderId = chfl[i2]['id'];
                  this.pFICache = parentFolderId;
                }
              }
              if(!exists){
                parentFolderId = newFolder['id'];
                this.pFICache = parentFolderId;
                chfl.push(newFolder);
              }
            }
            else{
              chfl = this.bee.config.parseFolderStructureAndPushItem(chfl, parentFolderId, newFolder, true);
              if(typeof this.pFICache != 'undefined' && this.pFICache != null){
                parentFolderId = this.pFICache;
              }
           }


          }
          this.pFICache = null;
         this.bee.config.setChannelFolderList(chfl);
      }

      console.log(parentFolderId);
      await this.addChannel(channelName, parentFolderId);
      this.ocean.dolphin.addInviteToken(channelName,inviteToken);
      return true;
    }
   async createChannel(channelNameDirty, parentFolderId = ""){
     let channelNameClean = await this.ocean.dolphin.createChannel(channelNameDirty);
     this.bee.config.addToChannelFolderList(channelNameClean, parentFolderId);
     return channelNameClean;
   }
   async addChannel(channelNameClean, parentFolderId = ""){
     try{
       await this.ocean.dolphin.addChannel(channelNameClean);
     }catch(e){}
     this.bee.config.addToChannelFolderList(channelNameClean, parentFolderId);
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
