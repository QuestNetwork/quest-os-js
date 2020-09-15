import * as Ipfs from 'ipfs';
const { v4: uuidv4 } = require('uuid');
import { Subject } from "rxjs";
import { Ocean }  from '@questnetwork/quest-ocean-js';
import { BeeSwarmInstance }  from '@questnetwork/quest-bee-js';
import { ElectronService } from 'ngx-electron';
import { saveAs } from  'file-saver';

import { Utilities }  from './utilities/utilities.js';
import { ChannelManager }  from './channel/channelManager.js';


export class OperatingSystem {
    constructor() {
      let uVar;
      this.ocean = Ocean;
      this.channel = new ChannelManager();
      this.ready = false;
      this.utilities = new Utilities();
      this.isReadySub = new Subject();
      this.bee = new BeeSwarmInstance();
      this.signedInSub = new Subject();
      this.signedIn = false;
      this.ipfsBootstrapPeersFromConfig = [];
      this.configCache = {};
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
      if(typeof config['dependencies'] == 'undefined'){
        config['dependencies'] = {};
      }
      config['dependencies']['electronService'] = new ElectronService();
      config['dependencies']['saveAs'] = saveAs;

      this.configCache = config;
      if(typeof config['ipfs']['swarm'] != 'undefined'){
        this.ipfsBootstrapPeersFromConfig = config['ipfs']['swarm'];
      }

      try{
        config['ipfs']['swarm'] = this.getIpfsBootstrapPeers();
      }
      catch(e){console.log(e);}

      if(typeof config['boot'] == 'undefined' ||  typeof config['boot']['processes'] == 'undefined' || (typeof config['boot']['processes'] != 'undefined' && config['boot']['processes'].indexOf('ocean') > -1)){
        try{
          await this.ocean.create(config);
          config['dependencies']['dolphin'] = this.ocean.dolphin;
          this.ocean.dolphin.commitNowSub.subscribe( (value) => {
            this.bee.config.commitNow();
          });

          this.ocean.dolphin.commitSub.subscribe( (value) => {
            this.bee.config.commit();
          });
        }
        catch(e){
          console.log(e);
          if(e == 'Transport (WebRTCStar) could not listen on any available address'){
            throw(e);
          }
        }
      }

      if(typeof config['boot'] == 'undefined' || typeof config['boot']['processes'] == 'undefined' || (typeof config['boot']['processes'] != 'undefined' && config['boot']['processes'].indexOf('bee') > -1)){
          try{
            await this.bee.start(config);
            config['dependencies']['bee'] = this.bee;
            this.bee.config.saveLockStatusSub.subscribe( (value) => {
              if(value){
                this.enableSaveLock();
              }
              else{
                this.disableSaveLock();
              }
              this.saveLockStatusSub.next(value);

            });
          }catch(e){
            throw(e);
          }
      }

      if(typeof config['boot'] == 'undefined' ||  typeof config['boot']['processes'] == 'undefined' || (typeof config['boot']['processes'] != 'undefined' && config['boot']['processes'].indexOf('ocean') > -1 && config['boot']['processes'].indexOf('bee') > -1)){
        this.channel.load(config);
      }


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
    reboot(){
      if(this.isElectron()){
        this.configCache['dependencies']['electronService'].remote.getCurrentWindow().close();
      }
      else{
        window.location.reload();
      }
    }

    setIpfsBootstrapPeers(peers){
      console.log('OS: Setting Peers',peers);
      if(this.isElectron){
        let fs =   this.configCache['dependencies']['electronService'].remote.require('fs');
        let configPath =  this.configCache['dependencies']['electronService'].remote.app.getPath('userData');
        configPath = configPath + "/swarm.peers";
        try{
          fs.writeFileSync(configPath, JSON.stringify({ swarm: peers}),{encoding:'utf8',flag:'w'})
        }catch(e){console.log(e);}
      }
       this.bee.config.setIpfsBootstrapPeers(peers);
    }
    getIpfsBootstrapPeers(){
      //check swarm peer list
      if(this.isElectron){
        try{
          let fs =   this.configCache['dependencies']['electronService'].remote.require('fs');
          let configPath = this.configCache['dependencies']['electronService'].remote.app.getPath('userData');
          configPath = configPath + "/swarm.peers";
          let filePeers = fs.readFileSync(configPath).toString('utf8');
          console.log('OS:',filePeers);
          let diskPeers;
          if(typeof filePeers == 'string'){
            diskPeers = JSON.parse(filePeers);
          }
          else{
            diskPeers = filePeers;
          }
          this.bee.config.setIpfsBootstrapPeers(diskPeers['swarm']);
          return diskPeers['swarm'];

        }catch(e){console.log(e);}
      }

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
        let locArr = window.location.href.split('/');
        locArr.pop();
        locArr.push('signin');
        window.location.href = locArr.join('/');
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


    setStorageLocation(v){
      console.log(v);
      this.bee.config.setStorageLocation(v);
    }
    getStorageLocation(){
      return this.bee.config.getStorageLocation();
    }



  }
