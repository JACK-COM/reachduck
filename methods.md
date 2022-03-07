# Methods
All methods below are available as individual imports.

## Contents
* [checkSessionExists](#checkSessionExists)
* [checkVersionChanged](#checkVersionChanged)
* [connectUser](#connectUser)
* [copyToClipboard](#copyToClipboard)
* [createConnectorAPI](#createConnectorAPI)
* [createReachAPI](#createReachAPI)
* [disconnectUser](#disconnectUser)
* [formatAddress](#formatAddress)
* [formatCurrency](#formatCurrency)
* [formatCurrencyLocale](#formatCurrencyLocale)
* [formatNumberShort](#formatNumberShort)
* [fromMaybe](#fromMaybe)
* [getBlockchain](#getBlockchain)
* [getBlockchainNetwork](#getBlockchainNetwork)
* [inlineAssetOptIn](#inlineAssetOptIn)
* [isImageFile](#isImageFile)
* [isVideoFile](#isVideoFile)
* [loadReach](#loadReach)
* [optInToAsset](#optInToAsset)
* [parseAddress](#parseAddress)
* [parseCurrency](#parseCurrency)
* [reconnectUser](#reconnectUser)
* [selectBlockchain](#selectBlockchain)
* [selectBlockchainNetwork](#selectBlockchainNetwork)
* [setAppVersion](#setAppVersion)
* [tokenMetadata](#tokenMetadata)
* [trimByteString](#trimByteString)
* [truncateString](#truncateString)
* [useWalletConnect](#useWalletConnect)
* [useWebWallet](#useWebWallet)

---

## 1. Blockchain networks

#### `createConnectorAPI` 
Returns a `NetworkInterface` with the following [**helper methods**]().\
Note: `BetaNet` **network** option is only accepted by Algorand. Values default to `ALGO` and `TestNet` if none are provided.
```typescript
function createConnectorAPI(
    chain?: "ALGO" | "ETH",
    network?: "TestNet" | "BetaNet" | "MainNet"
): {
    /** Clear any user session details (usually for `WalletConnect`) */
    disconnectUser(): void;
    
    /** Fetch account details from network */
    fetchAccount(acc: string | any): any | Promise<any>;
    
    /** Fetch an asset/token by its ID from the chain's block explorer */
    fetchAssetById(assetId: number): any;
    
    /** Returns a blockchain-specific configuration for `stdlib` */
    getProviderEnv(network?: string): void;
    
    /** Fetch account assets from network */
    loadAssets(acc: string | any): any | Promise<ReachToken[]>;
    
    /** Get a `WalletConnect` client instance */
    getWalletConnectClientOpts(): any;
    
    /**
     * Get an object with a key containing a wallet fallback for `stdlib`.
     * Defaults to `MyAlgoConnect` on Algorand.
     */
    getWebWalletClientOpts(): any;
    
    /** Search for an asset/token by its name. Returns a list */
    searchAssetsByName(assetName: string): any;
    
    /** Search for transactions for this `addr` */
    searchForTransactions(addr: string, opts?: any): any;
}
```

---

## 2. Working with Stdlib 
#### `loadReach`
Initialize your `stdlib` instance. Call this when you would use `loadStdlib`. You only need to use this once. 
```typescript
function loadReach(
    loadStdlibFn: (args: any) => ReachStdLib,
    chain?: string,
    network?: "TestNet" | "MainNet"
): boolean;
```

#### `createReachAPI`
Returns your configured `stdlib` instance. Use after you have called `loadReach( loadStdlib )` at least once. 
```typescript
function createReachAPI(): ReachStdLib;
```

#### `inlineAssetOptIn`
Accept a token (or skip if already accepted) and return a boolean 
```typescript
function inlineAssetOptIn(acc: ReachAccount, tokenId: any): Promise<boolean>;
```
#### `parseAddress`
Convert a string into a chain-specific contract representation. Will attempt to format for the currently-configured `stdlib` instance.
```typescript
function parseAddress(ctc: any): any;
```

#### `parseCurrency`
Convenience: convert `val` into atomic units 
```typescript
function parseCurrency(val: any, dec?: number | undefined): any;
```
    
#### `selectBlockchain`
Set current consensus network. May trigger window reload 
```typescript
function selectBlockchain(network: string): string;
```

#### `selectBlockchain`
Set network provider preference `MainNet` or `TestNet` (or `BetaNet` on Algo). Will
trigger window reload.
```typescript
function selectBlockchain(network: string): string;
```
    
#### `tokenMetadata`
Fetch token metadata and balance for `acc` (if available) 
```typescript
function tokenMetadata(token: any, acc: ReachAccount): Promise<ReachToken>;
```

#### `optInToAsset`
Opt-in in to assets 
```typescript
function optInToAsset(acc: T.ReachAccount, tokenId: any): Promise<boolean>;
```

---

## 2. Session Management
**Note:** Session management depends on an `stdlib` instance. Make sure you have a version of the Reach JS standard library no older than `0.1.8-rc.3`.
#### `checkSessionExists`
Check if a previous user session (address or WalletConnect) exists.
When `exists` is true, you can call `reconnectUser( addr )` using the
`addr` value returned from this function. 
```typescript
function checkSessionExists(): { exists: boolean; isWCSession: boolean; addr: string | null;};
```
#### `connectUser`
Begin a session with a user's wallet of choice. Make sure to call 
`useWebWallet` or `useWalletConnect` before calling this function, 
as it will get the user to authenticate using a wallet (and will
error if a fallback isn't found.) 
```typescript
function connectUser(): Promise<ConnectedUserData>;
```
#### `disconnectUser`
 Clean up current user session and reload window. Call LAST in your app 
```typescript
function disconnectUser(): void;
```

#### `reconnectUser`
Restart last user session.
```typescript
function reconnectUser(addr?: string |  undefined): Promise<ConnectedUserData>;
```

#### `useWalletConnect`
Set wallet fallback to `WalletConnect`. Make sure to call this once before using `connectUser` 
```typescript
function useWalletConnect(): void;
```
#### `useWebWallet`
Set wallet fallback to web wallet. Make sure to call this once before using `connectUser`
```typescript
function useWebWallet(): void;
```

---

## 4. General Utilities/Helpers

#### `checkVersionChanged`
App Migration helper: check if your app version has changed 
```typescript
function checkVersionChanged(currentVersion: string | number, APP_VERSION_KEY?: string): string;
```

#### `setAppVersion`
App Migration helper: set your current app version

```typescript
function setAppVersion(version: string | number, APP_VERSION_KEY?: string): string;
```

#### `copyToClipboard`
Copy text to clipboard 
```typescript
function copyToClipboard(val: string): Promise<void>;
```

#### `formatAddress`
Convenience over `stdlib.formatAddress` 
```typescript
function formatAddress(acc: ReachAccount): string;
```

#### `formatCurrency`
UI-friendly currency formatting. Takes the `decimal` places of the currency, and
an `abbr` boolean which, when true, will abbreviate the formatted value

```typescript
function formatCurrency(amount: any, decimals?: number | undefined, abbr?: boolean): string;
```

#### `formatCurrencyLocale`
Builtin JS locale currency formatter (returns comma-delineated string) 
```typescript
function formatCurrencyLocale(val: number): string;
```

#### `formatNumberShort`
Abbreviated number formatting (e.g. `1000` -> `1K`) 
```typescript
function formatNumberShort(val: number, decimalPlaces?: number): string;
```

#### `fromMaybe`
Extract a value from a `Maybe` value, or provide a fallback 
```typescript
function fromMaybe(mVal: [val: "Some" | "None", v: any], format?: (v: any) => any, fallback?: any): any;
```

#### `getBlockchain`
Get the current stdlib instance's `connector` (blockchain)
```typescript
function getBlockchain(): string;
```

#### `getBlockchainNetwork`
Get current chain network. (e.g `"TestNet" | "MainNet"` on Algorand) 
```typescript
function getBlockchainNetwork(): string;
```
#### `isImageFile`
Assert `path` represents an image file 
```typescript
function isImageFile(path: string): boolean;
```

#### `isVideoFile`
Assert `path` represents a video file 
```typescript
function isVideoFile(path: string): boolean;
```
#### `listSupportedNetworks`
```typescript
/* List all networks currently supported by this library */
function listSupportedNetworks(): NetworkData[];
```

#### `noOp`
```typescript
/* Doesn't do anything */
function noOp(): null;
```
#### `selectBlockchain`
Store user current network selection for App in `localStorage`.
⚠️ WARNING: May trigger window reload if library is in a browser context 
```typescript
function selectBlockchain(network: string): string;
```

#### `selectBlockchainNetwork`
Set network provider preference `MainNet` or `TestNet`.\
⚠️ WARNING: Optionally triggers window reload 
```typescript
function selectBlockchainNetwork(prov: NetworkProvider, reload = false): string;
```
#### `trimByteString`
Trims empty bytes from a decoded Byte string 
```typescript
function trimByteString(str: string): string;
```

#### `truncateString`
Shrink an address to `radius`...`radius`-length string. Default would be
(WXWXWXWXWXWXWXWXWXWXWXWXWXWXWXWX) => "WXWXWX...WXWXWX" 
```typescript
function truncateString(acct: string, radius = 6): string;
```
