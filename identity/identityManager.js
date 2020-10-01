// import { Subject } from "rxjs";
// import { InviteManager }  from './inviteManager.js';
// import { ChallengeManager }  from './challengeManager.js';
const { v4: uuidv4 } = require('uuid');

export class IdentityManager {

  load(config){
    this.dolphin = config['dependencies']['dolphin'];
    this.bee = config['dependencies']['bee'];
  }


}
