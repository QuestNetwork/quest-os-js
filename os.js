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
      this.signedInSub = new Subject();
      this.signedIn = false;
      this.ipfsBootstrapPeersFromConfig = [];
      var userAgent = navigator.userAgent.toLowerCase();
      if (userAgent.indexOf(' electron/') > -1) {
        this.isElectronFlag = true;
      }
      else{
        this.isElectronFlag = false;
      }
      this.saveLockStatusSub = new Subject();

    }

    delay(t, val = "") {
       return new Promise(function(resolve) {
           setTimeout(function() {
               resolve(val);
           }, t);
       });
    }

    isSignedIn(){
      return this.isSignedIn();
    }
    hasConfigFile(){
      return this.bee.config.hasConfigFile();
    }

    async boot(config){
      if(typeof config['ipfs']['swarm'] != 'undefined'){
        this.ipfsBootstrapPeersFromConfig = config['ipfs']['swarm'];
      }
      try{
        await this.ocean.create(config);
      }
      catch(e){
        console.log(e);
        if(e == 'Transport (WebRTCStar) could not listen on any available address'){
          throw(e);
        }
      }
      config['dependencies']['dolphin'] = this.ocean.dolphin;
      await this.bee.start(config);


      this.bee.config.saveLockStatusSub.subscribe( (value) => {
        if(value){
          this.enableSaveLock();
        }
        else{
          this.disableSaveLock();
        }
        this.saveLockStatusSub.next(value);

      });

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
    onReady(){
      return this.isReadySub;
    }
    getIpfsBootstrapPeers(){
      //check swarm peer list
      let peers = this.ipfsBootstrapPeersFromConfig;
      console.log(peers);
      //try to load from file
      let peersAfterStart = this.bee.config.getIpfsBootstrapPeers();
      console.log(peersAfterStart);
      if(typeof peersAfterStart != 'undefined' && peersAfterStart.length > 0){
        peers = peersAfterStart;
      }
      //check additional peers added from loaded config data
      return peers;
    }

    commit(){
      this.bee.config.commit();
    }
    commitNow(){
      this.bee.config.commitNow();
    }
    enableSaveLock(){
      this.bee.config.setSaveLock(true);
      // this.saveLockStatusSub.next(true);
    }
    disableSaveLock(){
      this.bee.config.setSaveLock(false);
      // this.saveLockStatusSub.next(false);
    }
    getSaveLock(){
      return this.bee.config.getSaveLock();
    }
    saveLockStatus(){
      return this.saveLockStatusSub;
    }

    enableAutoSave(){
      this.bee.config.setAutoSave(true);
      // this.saveLockStatusSub.next(true);
    }
    disableAutoSave(){
      this.bee.config.setAutoSave(false);
      // this.saveLockStatusSub.next(false);
    }
    getAutoSave(){
      return this.bee.config.getAutoSave();
    }
    getAutoSaveInterval(){
      return this.bee.config.getAutoSaveInterval();
    }
    setAutoSaveInterval(v){
       this.bee.config.setAutoSaveInterval(v);
    }
    autoSaveStatus(){
      return this.saveLockStatusSub;
    }


    signIn(config = {}){
      this.bee.config.readConfig(config);
      this.signedIn = true;
      this.signedInSub.next(true);
    }
    signOut(){
      try{
        this.bee.config.deleteConfig();
      }
      catch(e){}

      this.signedIn = false;
      if(this.isElectron()){
      let a = this.bee.config.electron.remote.getCurrentWindow();
      a.close();
      }
      else{
        window.location.reload();
      }

    }
    onSignIn(){
      return this.signedInSub;
    }
    isSignedIn(){
      return this.signedIn;
    }
    exportConfig(){
      this.bee.config.commitNow({ export: true });
    }

    isElectron(){
      return this.isElectronFlag;
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
