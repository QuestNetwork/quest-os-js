import * as Ipfs from 'ipfs';
const { v4: uuidv4 } = require('uuid');
import { Subject } from "rxjs";
import { Ocean }  from '@questnetwork/quest-ocean-js';

export class OperatingSystem {
    constructor() {
      let uVar;
      this.ocean = Ocean;
      this.isReady = false;
      this.isReadySub = new Subject();
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
      this.isReady = true;
      this.isReadySub.next(true);
      return true;
    }


  }
