# reachduck 🦆

Front-end helper functions for your DApp.\
Can optionally be paired with (unaffiliated) [reach `stdlib`](https://www.npmjs.com/package/@reach-sh/stdlib) for more functionality (see below).

## CAVEAT EMPTOR
### 1. This library is *extremely* in Alpha-status. 
It was hacked together as a convenience, and the documentation is a courtesy. Proceed only if you know exactly what you are doing. 

### 2. You *may* need `@reach-sh/stdlib`
This package works without reach. If you need the latter, you will need to separately [install it](https://www.npmjs.com/package/@reach-sh/stdlib) in your project, and provide it to this package when necessary, and as described below. 


## Methods
All methods below are available as individual imports.

### 1. Working with Blockchain networks
You can use a predictable API for doing some common things with the underlying chain (except signing transactions). The `ConnectorInterface` (shown below) doesn't depend on an `stdlib` instance, and looks the same regardless of what network you're working with. 

#### Blockchain Functions
Use `createConnectorAPI` to access an object with the following [**helper methods**](#connectorinterface).
```typescript
/** 
 * Returns a `ConnectorInterface` w/ additional chain-specific helpers. 
 * Note: not all `network` options are accepted by all chains. Defaults
 * to "ALGO" + "TestNet" if no values are provided.
 */
function createConnectorAPI(
    chain?: "ALGO" | "ETH",
    network?: "TestNet" | "BetaNet" | "MainNet"
): ConnectorInterface;
```
##### Example

You can see the methods on [`ConnectorInterface` here](#connectorinterface)
```typescript
import { createConnectorAPI } from "@jackcom/reachduck"

// More chains will be supported in the future
const algorand: ConnectorInterface = createConnectorAPI("ALGO"/* , "TestNet | BetaNet | MainNet" */);
const assets: Record<string, any> = await algorand.loadAssets("ADR2SOFN...");

// In the future you can also do
const ethereum: ConnectorInterface = createConnectorAPI("ETH");
const assets: Record<string, any> = await ethereum.loadAssets("0x9f32d4...");
```

### 2. Working with Stdlib 
#### Stdlib API Functions
```typescript
/* 
 * Initialize your `stdlib` instance. Call this EARLY before your code needs 
 * the `stdlib` instance. You only need to use this once. 
 */
function loadReach(
    loadStdlibFn: (args: any) => ReachStdLib,
    chain?: string,
    network?: "TestNet" | "MainNet"
): boolean;

/* Returns your configured `stdlib` instance. Ensure you have called `loadReach( loadStdlib )` at least once before using this function. */
function createReachAPI(): ReachStdLib;

/* Accept a token (or skip if already accepted) and return a boolean */
function inlineAssetOptIn(acc: ReachAccount, tokenId: any): Promise<boolean>;

/* 
* Convert a string into a chain-specific contract representation. Will attempt 
* to format for the currently-configured `stdlib` instance.
*/
function parseAddress(ctc: any): any;
    
/* Convenience: convert `val` into atomic units */
function parseCurrency(val: any, dec?: number | undefined): any;
    
/* Set current consensus network. Will trigger window reload */
function setCurrentNetwork(network: string): string;
    
/* Fetch token metadata and balance for `acc` (if available) */
function tokenMetadata(token: any, acc: ReachAccount): Promise<ReachToken>;

/** Opt-in in to assets */
function optInToAsset(acc: T.ReachAccount, tokenId: any): Promise<boolean>;
```
##### Example

```typescript
import { loadStdlib } from "@reach-sh/stdlib"
import { 
    connectUser,
    createReachAPI,
    loadReach, 
    useWebWallet
} from "@jackcom/reachduck"

// Use `loadReach` where you would use `loadStdlib( ... )`
// Note: you'll only want to use this function once!
loadReach(loadStdlib/* , "ETH" | "ALGO" */);

// configure stdlib to use web wallet fallback. Currently
// defaults to `MyAlgo` for Algorand
useWebWallet(); 
```

The library has loaded your `stdlib` instance: no wallet fallback is set.
Now use `createReachAPI` access the `stdlib` instance anywhere in your code:

```typescript
const stdlib = createReachAPI()

// You can create an account using `stdlib`
const acc = await stdlib.createAccount()

// or attempt toconnect a user and get back a predictable object.
// userdata.account will be a `networkAccount` instance from stdlib
const userdata = await connectUser(); 
console.log(userdata); 
    // -> { account: { ... }, address: "XXX...", balance: "...", ...   }
```

### Session Management
**Note:** Session management depends on an `stdlib` instance. Make sure you have a version of the Reach JS standard library no older than `0.1.8-rc.3`.
```typescript
/** 
 * Check if a previous user session (address or WalletConnect) exists.
 * When `exists` is true, you can call `reconnectUser( addr )` using the
 * `addr` value returned from this function. */
function checkSessionExists(): { exists: boolean; isWCSession: boolean; addr: string | null;};

/** 
 * Begin a session with a user's wallet of choice. Make sure to call 
 * `useWebWallet` or `useWalletConnect` before calling this function, 
 * as it will get the user to authenticate using a wallet (and will
 * error if a fallback isn't found.) */
function connectUser(): Promise<ConnectedUserData>;

/* Clean up current user session and reload window. Call LAST in your app */
function disconnectUser(): void;

/* Restart last user session. */
function reconnectUser(addr?: string |  undefined): Promise<ConnectedUserData>;
    
/* Set wallet fallback to `WalletConnect`. Make sure to call this once before using `connectUser` */
function useWalletConnect(): void;
    
/* Set wallet fallback to web wallet. Make sure to call this once before using `connectUser` */
function useWebWallet(): void;
```

### General Utilities/Helpers
```typescript
/** App Migration helper: check if your app version has changed */
function checkVersionChanged(currentVersion: string | number, APP_VERSION_KEY?: string): string;

/** App Migration helper: set your current app version */
function setAppVersion(version: string | number, APP_VERSION_KEY?: string): string;

/* Copy text to clipboard */
function copyToClipboard(val: string): Promise<void>;

/* Convenience over `stdlib.formatAddress` */
function formatAddress(acc: ReachAccount): string;

/* 
 * UI-friendly currency formatting. Takes the `decimal` places of the currency, and
 * an `abbr` boolean which, when true, will abbreviate the formatted value
 */
function formatCurrency(amount: any, decimals?: number | undefined, abbr?: boolean): string;

/* Builtin JS locale currency formatter (returns comma-delineated string) */
function formatCurrencyLocale(val: number): string;

/* Abbreviated number formatting (e.g. `1000` -> `1K`) */
function formatNumberShort(val: number, decimalPlaces?: number): string;

/* Extract a value from a `Maybe` value, or provide a fallback */
function fromMaybe(mVal: [val: "Some" | "None", v: any], format?: (v: any) => any, fallback?: any): any;

/* Get the current stdlib instance's `connector` (blockchain) */
function getBlockchain(): string;

/* Get current chain network. (e.g `"TestNet" | "MainNet"` on Algorand) */
function getBlockchainNetwork(): string;

/* Assert `path` represents an image file */
function isImageFile(path: string): boolean;

/* Assert `path` represents a video file */
function isVideoFile(path: string): boolean;

/* List all networks currently supported by this library */
function listSupportedNetworks(): NetworkData[];

/* Doesn't do anything */
function noOp(): null;

/** Store user current network selection for App in `localStorage` */
function selectBlockchain(network: string): string;
/**
 * Set network provider preference `MainNet` or `TestNet`.
 * ⚠️ WARNING: Optionally triggers window reload */
function selectBlockchainNetwork(prov: NetworkProvider, reload = false): string;

/* trims empty bytes from a decoded Byte string */
function trimByteString(str: string): string;

/* Shrink an address to `radius`...`radius`-length string */
function truncateString(acct: string, radius = 6): string;
```

## Types

### `ConnectedUserData`
```typescript
/* Response object from 'connectUser' and 'reconnectUser' */
type ConnectedUserData = {
    account: ReachAccount;
    address: string;
    balance: string;
} & Record<string, any>;
```

### `ConnectorInterface`
Returned from `createConnectorAPI()`
```typescript
type ConnectorInterface {
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

### `NetworkProvider`
```typescript
type NetworkProvider = "TestNet" | "BetaNet" | "MainNet"
```

## Development
This is a typescript project. It depends on `Algosdk` and `WalletConnect`.

To create a production build:

```sh
npm run build
```

## Testing

To run unit tests:

```sh
npm test
```
There are limited tests, and most are currently centered on the utility helpers.

## Credits

Made with [createapp.dev](https://createapp.dev/)
