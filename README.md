# Quest OS JS
>Quantum Scare: Currently Quest Network PubSub uses elliptic curve cryptopgraphy for signatures, but we are already looking at quantum safe algorithms.

## Lead Maintainer

[StationedInTheField](https://github.com/StationedInTheField)

## Description

Unified API for the QuestNetwork dStack.

## Installation & Usage

``npm install @questnetwork/quest-os-js@0.9.2``


JavaScript/NodeJS
```
import { qOS } from '@questnetwork/quest-os-js'
// configure with a bootstrap swarm peer, for testing you can use:
let config = {
  ipfs: { swarm: "/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star" },
  dev: true
};
// boot the operating system
qOS.boot().then( () => {
  //the operating system is online, build the future
})
```

TypeScript/Angular Service
```
import { Injectable } from '@angular/core';
import { qOS }  from '@questnetwork/quest-ocean-js';
import * as swarmJson from '../swarm.json';

@Injectable({
  providedIn: 'root'
})
export class QuestOSService {
  public os;
  ready = false;
  constructor() {
    let config = {
      ipfs: {
        swarm: swarmJson['ipfs']['swarm']
      },
      dev: swarmJson['ipfs']['dev']
    };
    this.os = qOS;
    this.os.boot(config).then(() => { this.ready = true; });
  }
}
```

Unfortunately nobody is working on a detailed API documentation yet, until then check out the source in [Quest Network Messenger](https://github.com/QuestNetwork/quest-messenger-js) 0.9.2+ to see how to use the OS.

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
