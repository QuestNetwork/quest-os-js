import { QRCode} from './qr/qr.js';

export class Utilities {
  constructor(){
    this.qr = new QRCode();
  }



  inArray(array,value) {
    return array.indexOf(value) > -1;
  }
}
