import { Subject } from "rxjs";

export class Channels {

  constructor(bee,dolphin){
    this.bee = bee;
    this.dolphin = dolphin;
    this.selectedChannelSub = new Subject();
  }

  selectChannel(v){
    if(typeof v == 'undefined'){
      return false;
    }
    
    this.dolphin.selectChannel(v);
    this.bee.config.setSelectedChannel(v);
    this.selectedChannelSub.next(v);
    this.bee.config.commit();
  }

  getSelectedChannel(v){
    let channel = "NoChannelSelected";
    if(this.bee.config.getSelectedChannel() != "NoChannelSelected" && typeof this.bee.config.getSelectedChannel()  != 'undefined' ){
      channel = this.bee.config.getSelectedChannel();
    }
    else if(this.dolphin.getSelectedChannel() != "NoChannelSelected" && typeof this.dolphin.getSelectedChannel()  != 'undefined' ){
      channel = this.dolphin.getSelectedChannel();
    }
    return channel;
  }

  onSelectChannel(){
    return this.selectedChannelSub;
  }


}
