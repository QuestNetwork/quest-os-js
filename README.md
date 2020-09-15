![Completion](https://img.shields.io/badge/completion-8%25-orange) ![Help Wanted](https://img.shields.io/badge/%20-help--wanted-%23159818) ![Version 0.9.3](https://img.shields.io/badge/version-v0.9.2-green) ![Version 0.9.3](https://img.shields.io/badge/version-v0.9.3-blue) ![Sponsors](https://img.shields.io/badge/sponsors-0-red)

# Quest OS JS
>Quantum Scare: Currently Quest Network PubSub uses elliptic curve cryptopgraphy for signatures, but we are already looking at post quantum algorithms.

## Lead Maintainer

[StationedInTheField](https://github.com/StationedInTheField)

## Description

Unified API for the QuestNetwork dStack. Use with our window platform: [qDesk](https://github.com/QuestNetwork/qDesk)

Check out our [Quest Messenger](https://github.com/QuestNetwork/quest-messenger-js) and the [Awesome Quest Network](https://github.com/QuestNetwork/awesome) list for more examples.

## Security 

![Completion 1.0.0](https://img.shields.io/badge/OAEP-4096%20Bit-green) ![EC](https://img.shields.io/badge/EC-P&#8208;521-green) ![AES](https://img.shields.io/badge/AES-256%20Bit-yellow)

[Quest OS](https://github.com/QuestNetwork/quest-os-js) uses [4096 Bit RSA-OAEP](https://en.wikipedia.org/wiki/RSA_(cryptosystem)#Operation) encryption, [256 Bit AES-CBC](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard) encryption and [NIST P-521 EC](https://en.wikipedia.org/wiki/Elliptic-curve_cryptography#Fast_reduction_(NIST_curves)) signatures by default.

## Installation & Usage

``npm install @questnetwork/quest-os-js@0.9.2`` or  ``git clone https://github.com/QuestNetwork/quest-os-js``

## API


### async boot(config)

Boots the operating system. The GitHub branches master/0.9.2/0.9.3+ boot with:

JavaScript/NodeJS
```
import { qOS } from '@questnetwork/quest-os-js'
// configure with a bootstrap swarm peer, for testing you can use:
let config = {
  ipfs: { swarm: [<swarm star peer ip>,<swarm star peer ip>] },
  version: <version>
  dev: <true/false>
};
// boot the operating system
qOS.boot().then( () => {
  //the operating system is online, build the future
})
```

TypeScript/Angular Service
```
import { Injectable } from '@angular/core';
import { qOS }  from '@questnetwork/quest-os-js';
import * as swarmJson from '../swarm.json';
import  packageJson from '../../../package.json';
const version = packageJson.version;

@Injectable({
  providedIn: 'root'
})
export class QuestOSService {
  public os;
  ready = false;
  config;
  constructor() {
    this.config = {
      ipfs: {
        swarm: swarmJson['ipfs']['swarm']
      },
      version: version,
      dev: swarmJson['dev']
    };
    this.os = qOS;
  }
  async boot(){
      try{
        await this.os.boot(this.config);
        this.ready = true;
      }
      catch(e){
        throw(e);
      }
  }
}
  
```



The NPM package of 0.9.2 currently unfortunately expects: 

```
import { ElectronService } from 'ngx-electron';
import { saveAs } from 'file-saver';
config = {
      ipfs: {
        swarm: [<swarm star peer ip>,<swarm star peer ip>]
      },
      dev: <true/false>,
      version: <version>,
      dependencies: {
        electronService: ElectronService,
        saveAs: saveAs
      }
    };
```

### signIn(config = {})  ![Version 0.9.3](https://img.shields.io/badge/process-Bee-yellow)
Activates Accounts. Empty config creates a new account
```
<os>.signIn({});
```
### signOut() ![Version 0.9.3](https://img.shields.io/badge/process-Bee-yellow)
Deactivates Accounts And Restarts The Interface On The Web, Closes The Current Window In Electron
```
<os>.signOut();
```

### onSignIn() ![Version 0.9.3](https://img.shields.io/badge/process-Bee-yellow)
Returns a subscribable Subject that fires when the account is signed in.
```
<os>.onSignIn().subscribe( () => {
  console.log("Hello Universe");
});
```

**Unfortunately nobody is working on a detailed API documentation yet, until then check out the source in [Quest Network Messenger](https://github.com/QuestNetwork/quest-messenger-js) 0.9.2+ to see how to use the OS.**

We recommend to use our [quest-cli](https://github.com/QuestNetwork/quest-cli) to test and build the package. It allows you to bootstrap your Quest Network apps with the same peers and settings.

Pro Tip: Put a file in your `/bin` that runs the quest-cli like so `node /path/to/quest-cli/index.js` from any folder on your system. It's much nicer!

## Features

**0.9.2**
- Basic functionality


## Support Us
This project is a lot of work and unfortunately we need to eat food (ツ)

| Ethereum| Bitcoin |
|---|---|
| `0xBC2A050E7B87610Bc29657e7e7901DdBA6f2D34E` | `bc1qujrqa3s34r5h0exgmmcuf8ejhyydm8wwja4fmq`   |
|  <img src="doc/images/eth-qr.png" >   | <img src="doc/images/btc-qr.png" > |


## License
GNU Affero GPLv3
