import * as Ipfs from 'ipfs';
const { v4: uuidv4 } = require('uuid');
import { Subject } from "rxjs";
import { DolphinInstance }  from '@questnetwork/quest-dolphin-js';

export class Ocean {
    constructor() {
      let uVar;
      this.ipfsId = uVar;
      this.ipfsNodeReady = false;
      this.ipfsNodeReadySub = new Subject();
      this.oceanIsReady = false;
      this.ipfsNode = uVar;
      this.dolphin = uVar;
      this.swarmPeersSub = new Subject();



    }


    delay(t, val = "") {
       return new Promise(function(resolve) {
           setTimeout(function() {
               resolve(val);
           }, t);
       });
    }


    async create(config){
      console.log("Waiting for IPFS...");
      try{
        let repoId = uuidv4();
        // let repoId = uuidv4();

        let ipfsEmptyConfig = {
        repo: 'anoon-repo-'+repoId,
        config: {
          Addresses: {
            Swarm: config['ipfs']['swarm'],
            API: '',
            Gateway: ''
          },
        EXPERIMENTAL: {
             pubsub: true
           }
        }};

        this.ipfsNode = await Ipfs.create(ipfsEmptyConfig);
        const version = await this.ipfsNode.version();
        console.log("IPFS v"+version.version+" created!");
        console.log("Filesystem Online: "+this.ipfsNode.isOnline());
        this.ipfsId = await this.ipfsNode.id();
        console.log("Our IPFS ID is:"+this.ipfsId.id);
      }catch(error){
        console.log("couldn't start IPFS");
        console.warn(error);
        throw('IPFS Fail');
      }

      console.log('About to check...');

      while(!this.ipfsNodeReady){
        //check peers
        console.log('Checking for peers...');
        await this.getPeers()
        await this.delay(2000);
      }

      this.dolphin = new DolphinInstance(this.ipfsNode);
      this.dolphin.setIpfsId(this.ipfsId);
      this.oceanIsReady = true;

      setInterval( () => {
        this.getPeers();
      },30000);

      return true;
    }
    getIpfsId(){
      return this.ipfsId;
    }
    async getPeers(){
      if(typeof(this.ipfsNode != 'undefined')){
        let peers = await this.ipfsNode.swarm.peers();
        this.swarmPeersSub.next(peers.length);
        if(peers.length > 0){
          console.log("Swarm is:");
          console.log(peers);
          this.setIpfsNodeReady(true);
          return peers;
        }
      }
      return false;
    }

    isReady(){
      return this.oceanIsReady;
    }


    setIpfsNodeReady(value) {
      this.ipfsNodeReady = value;
      this.ipfsNodeReadySub.next(true);
      // localStorage.setItem('isLoggedIn', value ? "true" : "false");
    }
    getIpfsNodeReady(){
      return ipfsNodeReady;
    }

    isInArray(value, array) {
     return array.indexOf(value) > -1;
   }

  }
