![Completion](https://img.shields.io/badge/completion-12%25-orange) ![Help Wanted](https://img.shields.io/badge/%20-help--wanted-%23159818) ![Version 0.9.3](https://img.shields.io/badge/version-v0.9.3-green) ![Version 0.9.3](https://img.shields.io/badge/version-v0.9.4-blue) ![Sponsors](https://img.shields.io/badge/sponsors-0-red)

# Quest OS JS 

## Lead Maintainer

[StationedInTheField](https://github.com/StationedInTheField)

## Description
Unified API for the QuestNetwork dStack. Use with our example app: [qDesk](https://github.com/QuestNetwork/qDesk).

Main strategy is to create a Quest Network / IPFS / Ethereum interface that even kids can easily understand.

Check out our [QD Messages Module](https://github.com/QuestNetwork/qd-messages-ts) and the [Awesome Quest Network](https://github.com/QuestNetwork/awesome) list for more examples.

## Security 

![Completion 1.0.0](https://img.shields.io/badge/OAEP-4096%20Bit-green) ![EC](https://img.shields.io/badge/EC-P&#8208;521-green) ![AES](https://img.shields.io/badge/AES-256%20Bit-yellow)

[Quest OS](https://github.com/QuestNetwork/quest-os-js) uses [4096 Bit RSA-OAEP](https://en.wikipedia.org/wiki/RSA_(cryptosystem)#Operation) encryption, [256 Bit AES-CBC](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard) encryption and [NIST P-521 EC](https://en.wikipedia.org/wiki/Elliptic-curve_cryptography#Fast_reduction_(NIST_curves)) signatures.


## Installation & Usage

``npm install @questnetwork/quest-os-js@0.9.3``

**OR**  

```
git clone https://github.com/QuestNetwork/quest-os-js && cd quest-os-js && git checkout 0.9.3 && cd ..
```

## API


### async boot(config)

Boots the operating system. The GitHub branches master/0.9.2/0.9.3+ boot with:

JavaScript/NodeJS
```
import { qOS } from '@questnetwork/quest-os-js'
// configure with a bootstrap swarm peer, for testing you can use:
let config = {
  ipfs: {
        Swarm: [<swarm star peer ip>,<swarm star peer ip>],
        API: '',
        Gateway: ''
  },
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
        Swarm: swarmJson['ipfs']['Swarm'],
        API: '',
        Gateway: ''
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

### isReady()

Returns true once boot is complete, otherwise returns false.

```
if(<os>.isReady()){
  console.log("Ready To Sign In");
};
```


### onReady()

Returns a Subject that pushes next when boot is complete

```
if(<os>.onReady().subsribe( () => {
  console.log("Ready To Sign In");
});
```


### reboot()

Reboots the entire system

```
<os>.reboot();
```

### utilities.engine.detect()
Returns a string 'node', 'electron' or 'browser'

```
if(<os>.utilities.engine.detect() == 'node'){
  console.log("Hello Universe");
};
```

### enableSaveLock() 
[![Bee](https://img.shields.io/badge/process-Bee-yellow)](https://github.com/QuestNetwork/quest-bee-js)

Locks the system from saving any changes
```
<os>.enableSaveLock();
```

### disableSaveLock() 
[![Bee](https://img.shields.io/badge/process-Bee-yellow)](https://github.com/QuestNetwork/quest-bee-js)

Unlocks the system from saving changes and saves changes normally
```
<os>.disableSaveLock();
```


### setStorageLocation(location)
[![Bee](https://img.shields.io/badge/process-Bee-yellow)](https://github.com/QuestNetwork/quest-bee-js)

Sets the storage location for the app. Normally Quest OS does this automatically and you do not need to call this function.
Possible locations are: `"Download"`,`"LocalStorage"` or `"ConfigFile"`

```
<os>.setStorageLocation("LocalStorage");
```

### getStorageLocation(location)
[![Bee](https://img.shields.io/badge/process-Bee-yellow)](https://github.com/QuestNetwork/quest-bee-js)

Returns a string with the current storage location

```
<os>.getStorageLocation();
```

### signIn(config = {})
[![Bee](https://img.shields.io/badge/process-Bee-yellow)](https://github.com/QuestNetwork/quest-bee-js)

Activates Accounts. Empty config creates a new account
```
<os>.signIn({});
```
### signOut()
[![Bee](https://img.shields.io/badge/process-Bee-yellow)](https://github.com/QuestNetwork/quest-bee-js)

Deactivates Accounts And Restarts The Interface On The Web, Closes The Current Window In Electron
```
<os>.signOut();
```

### onSignIn()
[![Bee](https://img.shields.io/badge/process-Bee-yellow)](https://github.com/QuestNetwork/quest-bee-js)

Returns a subscribable Subject that fires when the account is signed in.
```
<os>.onSignIn().subscribe( () => {
  console.log("Hello Universe");
});
```

### isSignedIn()
[![Bee](https://img.shields.io/badge/process-Bee-yellow)](https://github.com/QuestNetwork/quest-bee-js)

Returns a boolean true or false
```
if(<os>.isSignedIn()){
  console.log("Hello Universe");
};
```

### async channel.create(dirtyChannelName, parentFolderId = "")
[![Bee](https://img.shields.io/badge/process-Bee-yellow)](https://github.com/QuestNetwork/quest-bee-js) [![Ocean](https://img.shields.io/badge/process-Ocean-blue)](https://github.com/QuestNetwork/quest-ocean-js)

Returns the clean channel name
```
let claenChannelName = await <os>.channel.create('propaganda');
```

### channel.remove(cleanChannelName)
[![Bee](https://img.shields.io/badge/process-Bee-yellow)](https://github.com/QuestNetwork/quest-bee-js) [![Ocean](https://img.shields.io/badge/process-Ocean-blue)](https://github.com/QuestNetwork/quest-ocean-js)

Removes a channel
```
<os>.channel.remove('propaganda----1234');
```

### channel.listen(cleanChannelName)
[![Ocean](https://img.shields.io/badge/process-Ocean-blue)](https://github.com/QuestNetwork/quest-ocean-js)

Returns a Subject that forwards non-system channel messages.
```
<os>.channel.listen('propaganda----1234').subscribe( msg ){
  console.log(msg);
}
```

### async channel.publish(cleanChannelName, message, type = 'CHANNEL_MESSAGE')
[![Ocean](https://img.shields.io/badge/process-Ocean-blue)](https://github.com/QuestNetwork/quest-ocean-js)

Returns a Subject that forwards non-system channel messages.
```
await <os>.channel.publish('propaganda----1234',"Hello Universe");
```

### channel.challenge.enable(cleanChannelName)  
[![Ocean](https://img.shields.io/badge/process-Ocean-blue)](https://github.com/QuestNetwork/quest-ocean-js)

Opens the channel to everyone who can solve the Captcha provided by [Quest Image Captcha JS](https://github.com/QuestNetwork/quest-image-captcha-js)
```
<os>.channel.challenge.enable('propaganda----1234');
```

### channel.challenge.disable(cleanChannelName)
[![Ocean](https://img.shields.io/badge/process-Ocean-blue)](https://github.com/QuestNetwork/quest-ocean-js)

Closes the channel to invite only participation
```
<os>.channel.challenge.disable('propaganda----1234');
```

### channel.challenge.isEnabled(cleanChannelName)  
[![Ocean](https://img.shields.io/badge/process-Ocean-blue)](https://github.com/QuestNetwork/quest-ocean-js)

```
if(<os>.isEnabled()){
  console.log("Hello Universe");
};
```

### channel.invite.create(cleanChannelName,newInviteCodeMax, exportFolders = false)  
[![Bee](https://img.shields.io/badge/process-Bee-yellow)](https://github.com/QuestNetwork/quest-bee-js) [![Ocean](https://img.shields.io/badge/process-Ocean-blue)](https://github.com/QuestNetwork/quest-ocean-js)

Creates a new channel invite, specify max uses of this invite code and whether or not to include your folder structure.
```
<os>.channel.invite.create('propaganda----1234',5,true);
```

### channel.invite.remove(cleanChannelName,link)
[![Bee](https://img.shields.io/badge/process-Bee-yellow)](https://github.com/QuestNetwork/quest-bee-js) [![Ocean](https://img.shields.io/badge/process-Ocean-blue)](https://github.com/QuestNetwork/quest-ocean-js)

Removes a channel invite
```
<os>.channel.invite.remove('propaganda----1234',"5448495320495320414e2045585452454d454c59204c4f4e4720414e4420494e56414c494420494e5649544520434f4445");
```

### channel.invite.get(channel)
[![Ocean](https://img.shields.io/badge/process-Ocean-blue)](https://github.com/QuestNetwork/quest-ocean-js)

Gets all invites for a channel
```
let invites = <os>.channel.invite.get('propaganda----1234');
```


### channel.invite.get(channel)
[![Ocean](https://img.shields.io/badge/process-Ocean-blue)](https://github.com/QuestNetwork/quest-ocean-js)

Gets all invites for a channel
```
let invites = <os>.channel.invite.get('propaganda----1234');
```

### social.togglePrivacy(profilePubKey = 'NoProfileSelected')
[![Social](https://img.shields.io/badge/process-Social-green)](https://github.com/QuestNetwork/quest-social-js) [![Bee](https://img.shields.io/badge/process-Bee-yellow)](https://github.com/QuestNetwork/quest-bee-js) [![Ocean](https://img.shields.io/badge/process-Ocean-blue)](https://github.com/QuestNetwork/quest-ocean-js) 

Toggles your profile's visibility between private and public, not giving a pubKey will automatically select your first profile. 
In private mode you have to manually share your profile with everyone you want to see your details. In Public mode all the members of the channels you're in can see your profile.

```
<os>.social.togglePrivacy();
```

### social.isPublic(socialPubKey = 'NoProfileSelected')
[![Social](https://img.shields.io/badge/process-Social-green)](https://github.com/QuestNetwork/quest-social-js) [![Bee](https://img.shields.io/badge/process-Bee-yellow)](https://github.com/QuestNetwork/quest-bee-js) [![Ocean](https://img.shields.io/badge/process-Ocean-blue)](https://github.com/QuestNetwork/quest-ocean-js) 

Checks if a profile has public visibility, not giving a pubKey will automatically select your first profile. 

```
if(<os>.social.isPublic(socialPubKey)){
  console.log("Hello Universe");
};
```

### social.isFavoite(socialPubKey)
[![Social](https://img.shields.io/badge/process-Social-green)](https://github.com/QuestNetwork/quest-social-js) [![Bee](https://img.shields.io/badge/process-Bee-yellow)](https://github.com/QuestNetwork/quest-bee-js) [![Ocean](https://img.shields.io/badge/process-Ocean-blue)](https://github.com/QuestNetwork/quest-ocean-js) 

Checks if a profile is in our favorites, returns boolean true or false.

```
if(<os>.social.isFavoite(socialPubKey)){
  console.log("Hello Universe");
};
```

### social.isRequestedFavoite(socialPubKey)
[![Social](https://img.shields.io/badge/process-Social-green)](https://github.com/QuestNetwork/quest-social-js) [![Bee](https://img.shields.io/badge/process-Bee-yellow)](https://github.com/QuestNetwork/quest-bee-js) [![Ocean](https://img.shields.io/badge/process-Ocean-blue)](https://github.com/QuestNetwork/quest-ocean-js) 

Checks if a profile is a requested favorite, returns boolean true or false.

```
if(<os>.social.isRequestedFavoite(socialPubKey)){
  console.log("Hello Universe");
};
```

**Unfortunately nobody is working on a detailed API documentation yet, until then check out the source in [qDesk Messages](https://github.com/QuestNetwork/quest-messenger-js) 0.9.3+ to see how to use the OS.**

We recommend to use our [quest-cli](https://github.com/QuestNetwork/quest-cli) to test and build the package. It allows you to bootstrap your Quest Network apps with the same peers and settings.

Pro Tip: Put a file in your `/bin` that runs the quest-cli like so `node /path/to/quest-cli/index.js` from any folder on your system. It's much nicer!

## Features

**0.9.2**
- Encrypted P2P Channels
- API for high level IPFS functionality
- Saves Config
- [Quest Ocean JS](https://github.com/QuestNetwork/quest-ocean-js)
- [Quest Bee JS](https://github.com/QuestNetwork/quest-bee-js)


**0.9.3**
- [Quest Social JS](https://github.com/QuestNetwork/quest-social-js)
- Documentation Extended
- Easier Access
- Offer "LocalStorage" As A Storage Container On The Web To Stay Signed In

## Roadmap

**0.9.4**
- Democratically block or mute peers
- Faux requests. Send request in channel, wait for response, deliver response as if it was an http request. 

## Support Us
Please consider supporting us, so that we can build a non-profit for this project (ツ)

| Ethereum| Bitcoin |
|---|---|
| `0xBC2A050E7B87610Bc29657e7e7901DdBA6f2D34E` | `bc1qujrqa3s34r5h0exgmmcuf8ejhyydm8wwja4fmq`   |
|  <img src="doc/images/eth-qr.png" >   | <img src="doc/images/btc-qr.png" > |


## License
GNU Affero GPLv3
