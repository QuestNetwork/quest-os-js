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

      this.bee.start({ electronService: config['dependencies']['electronService'], version: config['version']);

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





   async createChannel(channelNameDirty, parentFolderId = ""){
     let channelNameClean = await this.ocean.dolphin.createChannel(channelNameDirty);
     this.bee.config.addToChannelFolderList(channelNameClean, parentFolderId);
     return channelNameClean;
   }
   async addChannel(channelNameClean, parentFolderId = ""){
     try{
       await this.dolphin.addChannel(channelNameClean);
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




  }
