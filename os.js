import * as Ipfs from 'ipfs';
const { v4: uuidv4 } = require('uuid');
import { Subject } from "rxjs";
import { Ocean }  from '@questnetwork/quest-ocean-js';

export class OperatingSystem {
    constructor() {
      // let uVar;
      // this.ipfsId = uVar;
      // this.ipfsNodeReady = false;
      // this.ipfsNodeReadySub = new Subject();
      // this.oceanIsReady = false;
      // this.ipfsNode = uVar;
      // this.dolphin = uVar;
      // this.swarmPeersSub = new Subject();
      //


    }

    delay(t, val = "") {
       return new Promise(function(resolve) {
           setTimeout(function() {
               resolve(val);
           }, t);
       });
    }

    async boot(){

    }


  }
