const QRCodeLib = require('qrcode');

export class QRCode {

  generate(text){
       return new Promise(function(resolve) {
    console.log(text);

      let dataUrl = QRCodeLib.toDataURL(text, function (err, url) {
        console.log(url);
        resolve(url);
    });

   });
  }

}
