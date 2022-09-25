# Stdlib Helpers
🦆 Utility functions for working with `stdlib`.

- [Stdlib Helpers](#stdlib-helpers)
  - [`attachReach`](#attachreach)
    - [Example](#example)
  - [`loadReach`](#loadreach)
  - [`loadReachWithOpts`](#loadreachwithopts)
    - [Parameters](#parameters)
  - [`createReachAPI`](#createreachapi)
  - [`inlineAssetOptIn`](#inlineassetoptin)
  - [`parseAddress`](#parseaddress)
  - [`parseCurrency`](#parsecurrency)
  - [`tokenMetadata`](#tokenmetadata)
  - [`optInToAsset`](#optintoasset)
  - [Multiple stdlib instances](#multiple-stdlib-instances)
- [Session management](#session-management)
  - [`checkSessionExists`](#checksessionexists)
  - [`connectUser`](#connectuser)
    - [Parameters](#parameters-1)
  - [`disconnectUser`](#disconnectuser)
  - [`reconnectUser`](#reconnectuser)
    - [Parameters](#parameters-2)
  - [Site Menu](#site-menu)



---
> **Important!** This section requires you to 
> - separately install `@reach-sh/stdlib` (minimum version **0.1.10-rc.6** as of this documentation) and 
> - call `loadReach` or `loadReachWithOpts` with that library's `loadStlib` function 
  >
>prior to calling or using `createReachAPI` anywhere in your code. Disregarding some or all of the above will result in very violent dev-environment errors.

[top](#stdlib-helpers)

---

## `attachReach`
Useful when you want *even MOAR* control over how you create an `stdlib` instance.\
You can instantiate reach with `loadStdlib`, and supply the result to this function. This allows you to still use `reachduck` helpers. 

### Example 
This will throw an error because it requires stdlib,  which hasn't been instantiated internally:
```typescript
import { formatAddress } from '@jackcom/reachduck'
import { loadStdlib } from '@reach-sh/stdlib'

const stdlib = loadStdlib("ALGO");
stdlib.setProviderByEnv(process.env);
const acc = await stdlib.createAccount();
const addr = formatAddress( someAddress ); // error: QUACK!
```

To fix it, pass in your stdlib instance:
```typescript
import { formatAddress, attachReach } from '@jackcom/reachduck'

const stdlib = loadStdlib("ALGO");
stdlib.setProviderByEnv(process.env);

// Supply your instance ref to reachduck so you can access it with 'createReachAPI'
attachReach(stdlib);

const acc = await stdlib.createAccount();
const addr = formatAddress( someAddress ); // this works fine

// in another file: 
const otherFileStdlib = createReachAPI(); // returns 'stdlib' above
```

**Optional:** if you are doing multi-chain stuff, you can supply a key, which can be used to
retrieve the instance via `createReachAPI`:
```typescript
attachReach(stdlib, 'algo');

// later:
const algoStdlib = createReachAPI('algo');
```
[top](#stdlib-helpers)

---


## `loadReach`
Initialize your `stdlib` instance. Call this when you would use `loadStdlib`. You only need to use this once.\
This is the a preferred way to load `stdlib` if you are not in a browser or `window` context (e.g. command line, NodeJS app, AWS Lambda, etc) and want to quickly get started. 
```typescript
function loadReach(
    loadStdlibFn: (args: any) => ReachStdLib,
    chain?: string,
    network?: "TestNet" | "MainNet",
    uniqueInstance = false
): boolean;
```
Pass `true` as the last argument to get a unique stdlib instance. 

[top](#stdlib-helpers)

---

## `loadReachWithOpts`
Initialize your `stdlib` instance with environment opts.  
```typescript
function loadReachWithOpts(
    loadStdlibFn: (args: any) => ReachStdLib,
    opts?: {
      chain?: T.ChainSymbol & string;
      network?: T.NetworkProvider & string;
      providerEnv?: any;
      showReachContractWarnings?: boolean
      walletFallback?: {
        MyAlgoConnect?: any;
        WalletConnect?: any;
      };
    }
): boolean;
```
### Parameters 
* `opts.providerEnv` can be used to specify properties for an alternative Algorand node. The library defaults to [algonode](https://algonode.io/) when no override is provided.
* `opts.walletFallback` can be used when you are in a browser context want to use either `MyAlgoConnect` or `WalletConnect`.\
 This property must contain only one key; it should be the same object you pass into `stdlib.walletFallback( opts )`.
* When `opts.showReachContractWarnings` is `true`, it will show additional warning messages generated in your `stdlib` contract. These are typically messages you will have seen when compiling your contracts. 
  * This value defaults `false`. Set it to `true` if you want to see those messages in the console. 
 

[top](#stdlib-helpers)

---

## `createReachAPI`
Returns your configured `stdlib` instance. Use after you have called `loadReach( loadStdlib )` at least once. 
```typescript
function createReachAPI(): ReachStdLib;
```

[top](#stdlib-helpers)

---

## `inlineAssetOptIn`
Accept a token (or skip if already accepted) and return a boolean. Requires an `stdlib` instance. 
```typescript
function inlineAssetOptIn(acc: ReachAccount, tokenId: any): Promise<boolean>;
```
[top](#stdlib-helpers)

---

## `parseAddress`
Convert a string into a chain-specific contract representation. Will attempt to format for the currently-configured `stdlib` instance.
```typescript
function parseAddress(ctc: any): any;
```

[top](#stdlib-helpers)

---

## `parseCurrency`
Convenience: convert `val` into atomic units. Requires an `stdlib` instance.
```typescript
function parseCurrency(val: any, dec?: number | undefined): any;
```

[top](#stdlib-helpers)

---

## `tokenMetadata`
Fetch token metadata and balance for `acc` (if available) 
```typescript
function tokenMetadata(token: any, acc: ReachAccount): Promise<ReachToken>;
```

[top](#stdlib-helpers)

---

## `optInToAsset`
Opt-in in to assets 
```typescript
function optInToAsset(acc: T.ReachAccount, tokenId: any): Promise<boolean>;
```

[top](#stdlib-helpers)

---

## Multiple stdlib instances
`reachduck` now supports multiple stdlib instances. 
```typescript
const ethLib = loadReach(loadStdlib, "ETH", "TestNet", true)
const otherLib = loadReach(loadStdlib, "ALGO", "TestNet", true)
```

This is preferred if you want to use the instances once, or plan to track them yourself.\
If you want to re-use multiple instances with `createReachAPI`, use `loadReachWithOpts` with an `instanceKey`:
```typescript


// Default library
loadReach(loadStdlib, "ALGO", "TestNet")

// Example: store-it-yourself library. This cannot be retrieved via `createReachAPI`
// so we immediately store the return-value from `loadReach`.
const oneTimeLib = loadReach(loadStdlib, "ALGO", "TestNet", true)

// Create and store a second Algorand stdlib instance using a newer version of stdlib.
// [See the Examples page for a note on installing multiple reach versions locally]
loadReachWithOpts(loadStdlib2,  {
  chain: "ALGO", 
  network: "TestNet", 
  uniqueInstance: true,
  instanceKey: 'algoLatest'
})

// Create an stdlib version configured for Ethereum
loadReachWithOpts(loadStdlib, {
  chain: "ETH", 
  network: "TestNet", 
  uniqueInstance: true,
  instanceKey: 'ethLib'
})

const algoLatestLib = createReachAPI('algoLatest')
const ethLib = createReachAPI('ethLib')
const mainLib = createReachAPI()
```

**Note:** You will still need a global reference if you want to use `reachduck`'s helpers.\
You can use `attachReach` or use `loadReach` again for this:
```typescript
const mainLib = attachReach(otherLib); 
// OR mainLib = loadReach(loadStdlib, ... )
```
[top](#stdlib-helpers)

---

# Session management

**Note:** Session management depends on an `stdlib` instance. Make sure you have a version of the Reach JS standard library no older than `0.1.10-rc.6`.
## `checkSessionExists`
Check if a previous user session (address or WalletConnect) exists.
When `exists` is true, you can call `reconnectUser( addr )` using the
`addr` value returned from this function. 
```typescript
function checkSessionExists(): { exists: boolean; isWCSession: boolean; addr: string | null;};
```

[top](#stdlib-helpers)

---

## `connectUser`
Begin a session with a user's wallet of choice. Make sure to configure `stdlib` to 
use either `MyAlgo` or `WalletConnect` before calling this function, as it will get 
the user to authenticate using a wallet (and will error if a fallback isn't found.) 
```typescript
function connectUser(opts?: ConnectUserOpts): Promise<ConnectedUserData>;

type ConnectUserOpts = {
  fetchAssets?: boolean;
  fetchBalance?: boolean;
  initialAssetsLimit?: number;
}
```

### Parameters
- `opts: ConnectUserOpts`: Additional connection options 
  - `opts.fetchAssets?: boolean` fetch assets when true (default maximum 10)
  - `opts.fetchBalance?: boolean` fetch account balance when true
  - `opts.initialAssetsLimit?: number` maximum number of assets to fetch when specified

[top](#stdlib-helpers)

---

## `disconnectUser`
 Clean up current user session and reload window. Call LAST in your app 
```typescript
function disconnectUser(): void;
```



[top](#stdlib-helpers)

---

## `reconnectUser`
Restart last user session.
```typescript
function reconnectUser(
  addr?: string,
  opts?: ConnectUserOpts
): Promise<ConnectedUserData>;

type ConnectUserOpts = {
  fetchAssets?: boolean;
  fetchBalance?: boolean;
  initialAssetsLimit?: number;
}
```

### Parameters
- `opts: ConnectUserOpts`: Additional connection options 
  - `opts.fetchAssets?: boolean` fetch assets when true (default maximum 10)
  - `opts.fetchBalance?: boolean` fetch account balance when true
  - `opts.initialAssetsLimit?: number` maximum number of assets to fetch when specified


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

[top](#stdlib-helpers)