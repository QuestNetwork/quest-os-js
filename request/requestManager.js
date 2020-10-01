// import { Subject } from "rxjs";
// import { InviteManager }  from './inviteManager.js';
// import { ChallengeManager }  from './challengeManager.js';
const { v4: uuidv4 } = require('uuid');

export class RequestManager {

  constructor(){
    this.listenSub = {};
  }

  load(config){
    this.dolphin = config['dependencies']['dolphin'];
    this.channel = config['dependencies']['channel'];
    this.identity = config['dependencies']['identity'];
  }

  post(postObj){
    return new Promise( async () => {
      //post to all channels we have with this person
      postObj['type'] = "REQUEST";
      let channelPubKeyList = await this.identity.getChannelPubKeyListForSocialPubKey(signedObj['pubKey']);

      for(let object of channelPubKeyList){
        //listen for response on all channels we have with this person
        let postSub = this.channel.listen(object['channel']);
        postSub.subscribe( (responseObject) => {
          //if this is the response to out request , do action.....
          if(responseObject['type'] == "RESPONSE" && responseObject['path'] == postObj['path']){
            //unsubscribe and resolve
            postSub.unsubscribe();
            resolve(responseObject);
          }
        });

        //publish our request object
        postObj['type'] = "REQUEST";
        postObj['channel'] = object['channel'];

        this.channel.publish(postObj);
      }
      //close connection after timeeout
      timeout_ms = 30000;
      setTimeout( () => {
        postSub.unsubscribe();
        resolve(false);
      },timeout_ms);
    });
  }


  listenWorker(channel){
    this.channel.listen(channel).subscribe((request) => {
      if(request['type'] == "REQUEST" && request['path'] == path){
        //unsubscribe and resolve
        listenSub.next(request)
      }
    }
  }

  listen(path){
    let channelNameList = await this.dolphin.getChannelNameList();
    for(let channel of channelNameList){
      listenSub[path] = this.listenWorker(channel);
    }
    return listenSub[path];
  }

  async res(respondObj){
    respondObj['type'] = "RESPONSE";
    let channelNameList = await this.dolphin.getChannelNameList();
    for(let channel of channelNameList){
      respondObj['channel'] = channel;
      this.channel.publish(respondObj);
    }
    return true;
  }

}
