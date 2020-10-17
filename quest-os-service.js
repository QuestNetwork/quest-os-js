
import { qOS }  from './index.js';
import * as swarmJson from '../qDesk/src/app/swarm.json';
import  packageJson from './package.json';
const version = packageJson.version;

class QuestOSService {
  //

  constructor() {
    let uVar;
    this.os = uVar;
    this.ready = false;
    this.config = {
      ipfs: swarmJson['ipfs'],
      version: version,
      dev: swarmJson['dev']
    };

    this.os = qOS;
  }
  async boot(){
        try{
        await this.os.boot(this.config);
        this.ready = true;
      }
      catch(e){
        throw(e);
      }
  }

  isReady(){
    return this.ready;
  }
}


async function start(){
  const q = new QuestOSService();
  await q.boot();
}


start();
