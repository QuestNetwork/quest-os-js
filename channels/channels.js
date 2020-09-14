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
    console.log( this.bee.config.getSelectedChannel() );
    if( typeof this.bee.config.getSelectedChannel()  != 'undefined'  && this.bee.config.getSelectedChannel() != "NoChannelSelected" ){
      channel = this.bee.config.getSelectedChannel();
    }
    else if(typeof this.dolphin.getSelectedChannel()  != 'undefined'  && this.dolphin.getSelectedChannel() != "NoChannelSelected" ){
      channel = this.dolphin.getSelectedChannel();
    }
    return channel;
  }

  onSelectChannel(){
    return this.selectedChannelSub;
  }


}
