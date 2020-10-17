const { v4: uuidv4 } = require('uuid');
import { Subject } from "rxjs";

export class InviteManager {

      constructor(bee,dolphin){
        this.bee = bee;
        this.dolphin = dolphin;
      }

      create(channel,newInviteCodeMax, importFolders = false){
        let code = uuidv4();
        let link = ""
        if(importFolders){
          //traverse folders and find this channel in the tree
          let pathArray = this.bee.config.parseFolderStructureAndGetPath(this.bee.config.getChannelFolderList(), channel);
          if(pathArray.length > 0){
            link = pathArray.join("/////") + "/////" + channel + ":" + code;
          }
          else{
            link = channel + ":" + code;
          }
          console.log(pathArray);
        }
        else{
            link = channel + ":" + code;
        }

        link = Buffer.from(link,'utf8').toString('hex');
        this.dolphin.addInviteCode(channel,link,code,newInviteCodeMax);
        this.bee.config.commitNow();
        return link;
      }

      remove(channel,link){
        this.dolphin.removeInviteCode(channel,link);
        this.bee.config.commitNow();
      }

      get(channel){
        this.dolphin.getInviteCodes(this.selectedChannel)['items'];
      }


}
