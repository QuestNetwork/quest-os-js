// import { Subject } from "rxjs";
// import { InviteManager }  from './inviteManager.js';
// import { ChallengeManager }  from './challengeManager.js';
const { v4: uuidv4 } = require('uuid');

export class RequestManager {

  load(config){
    this.dolphin = config['dependencies']['dolphin'];
    this.channel = config['dependencies']['channel'];
    this.identity = config['dependencies']['identity'];
  }

  async post(postObj){
    //post to all channels we have with this person
    postObj['type'] = "REQUEST";
    let channelPubKeyList = await this.identity.getChannelPubKeyListForSocialPubKey(signedObj['pubKey']);

    // for(let pK of pubKeys){
    // TO DO qOS Faux Requestst

    //listen for response on all channels we have with this person


    // return res;

    //wait 30 sec
    //if mo response time out

    
    //time out
    //unsubscribe
    return false;
  }

  listen(path){
    //forward pubsub subject with valid requests for path
    return this.dolphin.reqListen(path);
  }

  res(respondObj){
    //post response object to channel
    return true;
  }

}
