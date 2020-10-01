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

   post(postObj){
    return new Promise( () => {
      //post to all channels we have with this person
      postObj['type'] = "REQUEST";
      let channelPubKeyList = await this.identity.getChannelPubKeyListForSocialPubKey(signedObj['pubKey']);

      for(let object of channelPubKeyList){
      //listen for response on all channels we have with this person
      this.channel.listen(object['channel']).subscribe( () => {
        //if this is the response to out request , do action.....



        //unsubscribe....
      });

      //publish our request object
      // this.channel.publish();

      //close connection after timeeout
      timeout_ms = 30000;
      setTimeout( () => {
        resolve(false);
      },timeout_ms)
    });
  }

  listen(path){
    //forward pubsub subject with valid requests for path
  }

  res(respondObj){
    //post response object to channel
    return true;
  }

}
