const { v4: uuidv4 } = require('uuid');
import { Subject } from "rxjs";

export class ChallengeManager {

      constructor(dolphin){
        this.dolphin = dolphin;
      }

      enable(ch){
        this.dolphin.setChallengeFlag(ch,1);
      }
      disable(ch){
        this.dolphin.setChallengeFlag(ch,0);
      }
      isEnabled(ch){
        return this.dolphin.getChallengeFlag(this.selectedChannel);
      }

}
