# Examples

Some example code for how to use `reachduck`.\
[Return home](/index.md).


- [Examples](#examples)
  - [**Reach Standard Library:** Creating an **stdlib** instance](#reach-standard-library-creating-an-stdlib-instance)
  - [**Reach Standard Library:** Re-using multiple **stdlib** instances](#reach-standard-library-re-using-multiple-stdlib-instances)
  - [**Reach Standard Library:** Using configured instance](#reach-standard-library-using-configured-instance)
  - [**Session Management:** Connecting a user (requires `stdlib`)](#session-management-connecting-a-user-requires-stdlib)
  - [**Session Management:** Check if session active, or selected wallet provider](#session-management-check-if-session-active-or-selected-wallet-provider)
  - [**User Management:** Fetch assets](#user-management-fetch-assets)
  - [Site Menu](#site-menu)


---

## **Reach Standard Library:** Creating an **stdlib** instance
Use `loadReach` where you would use `loadStdlib( ... )`. You'll only want to call this function once! 
```typescript
import { loadStdlib } from "@reach-sh/stdlib"

const stdlib = loadReach(loadStdlib/* , "ETH" | "ALGO" */);

// Now you can use it as you normally would
const account = await stdlib.createAccount()
```

[top](#examples)

---

## **Reach Standard Library:** Re-using multiple **stdlib** instances
`reachduck@0.4.6` enabled multiple versions of `stdlib`, which means `reachduck` can store and reuse uniquely-configured reach instances.\
An example is provided below. 
```typescript
import { loadReachWithOpts } from "@jackcom/reachduck"
import { loadStdlib } from "@reach-sh/stdlib"

// you can install an aliased reach standard library like this:
// npm install reach-latest@npm:@reach-sh/stdlib@some_version_number_here
import { loadStdlib as loadLatest } from "reach-latest"

const algo = loadReachWithOpts(loadStdlib, {
  chain: "ALGO", 
  uniqueInstance: true,
  instanceKey: 'algo'
});
const eth = loadReachWithOpts(loadLatest,  {
  chain: "ETH", 
  uniqueInstance: true,
  instanceKey: 'eth'
})

// Now you can use them as you normally would
const algoAccount = await algo.createAccount()
const ethAccount = await eth.createAccount()

```

And you can retrieve them with `createReachAPI`:
```typescript
// some-other-file.js

const ethLib = createReachAPI('eth'); // returns eth standard library instance
const algoLib = createReachAPI('algo'); // returns algo standard library instance
```

[top](#examples)

---

## **Reach Standard Library:** Using configured instance 

If you want to access the reach `stdlib` after initializing it, use `createReachAPI`.\
Starting from `0.4.6`, you can store and retrieve multiple instances of stdlib (see [here](#reach-standard-library-re-using-multiple-stdlib-instances)).

Note that `createReachAPI` will throw an error if your app didn't previously call `loadReach` or `loadReachWithOpts`.
```typescript
import { createReachAPI } from "@jackcom/reachduck"

const stdlib = createReachAPI() // non-blocking operation
const acc = await stdlib.createAccount()
```

[top](#examples)

---

## **Session Management:** Connecting a user (requires `stdlib`)

This is tailored for DApps that need to connect a user's wallet.\
On Algorand, you will need to call one of two functions before you can connect, so the library knows what Wallet Provider to call on. 
```typescript
import { 
    connectUser,
    disconnectUser,
    useWebWallet // or "useWalletConnect",
} from "@jackcom/reachduck"

// Algorand: trigger MyAlgoWallet. You can have a button trigger it as long as
// this (or "useWalletConnect") is called once before `connectUser`.
// Ethereum will trigger the default provider (usually MetaMask)

useWebWallet(); // or useWalletConnect() to trigger modal

const { account, address, balance } = await connectUser();

// When you're done: call this to clear localStorage (and/or end your 
// wallet-connect session)
disconnectUser(); 
```
[top](#examples)

---

## **Session Management:** Check if session active, or selected wallet provider
There is a quick-and-dirty way to see if a user is connected when your application loads. Although this does not require it, you cannot create a user session without `stdlib`.
```typescript
import { checkSessionExists } from "@jackcom/reachduck"

const { exists, isWCSession, addr } = checkSessionExists();

console.log(exists); // true | false
console.log(addr); // "XXXX ..."
console.log(isWCSession); // if "true", user connected with WalletConnect
```
[top](#examples)

---

## **User Management:** Fetch assets
This only works on Algorand, since "assets" in Ethereum are usually smart contracts.
```typescript
import { createConnectorAPI } from "@jackcom/reachduck"

// const algo = createConnectorAPI(); This is the default
// But for a little more control you can try:
const algoTestnet = createConnectorAPI("ALGO", "TestNet");
const address = 'XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA';
const assets = await algoTestnet.loadAssets(address, 15);
```

Note that this returns the raw indexer response (i.e. different result than what you would get from `fetchAssetById`). 


[top](#examples)

---

## Site Menu
* [Home](/index.md)
* [Functions](/methods.md)
  * [General Helpers](./utility_functions.md)
  * [Blockchain Helpers](./blockchain_functions.md)
  * [Session Management](./stdlib_functions.md#session-management)
  * [Stdlib Helpers](./stdlib_functions.md)
* [Type Definitions (non-exhaustive)](/types.md)
* [Code examples](/examples.md)

[top](#examples)

---


[top](#examples)
