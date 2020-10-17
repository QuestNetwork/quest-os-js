// import { Subject } from "rxjs";
// import { InviteManager }  from './inviteManager.js';
// import { ChallengeManager }  from './challengeManager.js';
const { v4: uuidv4 } = require('uuid');

export class IdentityManager {

  load(config){
    this.dolphin = config['dependencies']['dolphin'];
    this.bee = config['dependencies']['bee'];
  }


  getChannelPubKeyListForSocialPubKey(socialPubKey){
    //search social links
    results = [];

    let links = this.bee.comb.get('/social/links');
    console.log('Social: Links Found',links);
    let linkChPubKeys = Object.keys(links)
    let channelNameList = this.dolphin.getChannelNameList();
    for(let chPubKey of linkChPubKeys){
      for(let channel of channelNameList){
        if(links[chPubKey] == socialPubKey){
          results.push({channel: channel, channelPubKey: chPubKey});
        }
      }
    }
    return results;
  }


}
