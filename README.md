# reachduck 🦆

Front-end helper functions for your DApp. Currently supports Ethereum (limited) and Algorand.\
Can optionally be paired with (unaffiliated) [reach `stdlib`](https://www.npmjs.com/package/@reach-sh/stdlib) for more functionality.

A [changelog](https://github.com/JACK-COM/reachduck/blob/main/CHANGELOG.md) was introduced in `0.4.3`, and *should* better cover any interesting or disruptive changes made to the library.

### You *may* need `@reach-sh/stdlib` for some things
> If you want to use features like user session management (connecting a wallet), you will need to separately [install `@reach-sh/stdlib`](https://www.npmjs.com/package/@reach-sh/stdlib) in your project, and provide it to this package when necessary. `@jackcom/reachduck@^0.4.5` allows you to instantiate and use multiple `stdlib` instances. 


## Breaking Change Notes
> Version `0.2.0` drops support for `WalletConnect` and `MyAlgo` wrappers.\
> This removes both `useWebWallet()` and `useWalletConnect()` exports from the `reachduck` library. Please continue to rely on `stdlib` as shown in their documentation.

---
## Documentation
Documentation has moved to a dedicated [**Github pages site**](https://jack-com.github.io/reachduck/). Please report any issues or missing documentation by creating a [**github issue**](https://github.com/JACK-COM/reachduck/issues) in the repo. 

## Methods
All methods below are available as individual imports.

### 1. Working with Blockchain networks
You can use a predictable API for doing some common things with the underlying chain (except signing transactions). The `NetworkInterface` (shown below) doesn't depend on an `stdlib` instance, and looks the same regardless of what network you're working with. 

#### Blockchain Functions
Use `createConnectorAPI` to access an object with the following helper methods.
```typescript
/** 
 * Returns a `NetworkInterface` w/ additional chain-specific helpers. 
 * Note: not all `network` options are accepted by all chains. Defaults
 * to "ALGO" + "TestNet" if no values are provided.
 */
function createConnectorAPI(
    chain?: "ALGO" | "ETH",
    network?: "TestNet" | "BetaNet" | "MainNet"
): NetworkInterface;
```
#### `NetworkInterface`
Returned from `createConnectorAPI()`
```typescript
type NetworkInterface {
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

### 2. Working with Stdlib 
#### Stdlib API Functions
```typescript
/* 
 * Initialize your `stdlib` instance. Call this EARLY before your code needs 
 * the `stdlib` instance. You only need to use this once. 
 */
function loadReach(
    loadStdlibFn: ((args: any) => ReachStdLib),
    chain?: string,
    network?: "TestNet" | "MainNet"
): ReachStdLib;

/** 
 * Initialize your `stdlib` instance with additional options 
 * like a wallet fallback. Can use in place of `loadReach`
 */
function loadReachWithOpts(
  loadStdlibFn: LoadStdlibFn,
  opts: {
    chain?: ChainSymbol & string; 
    network?: "TestNet" | "MainNet";
    providerEnv?: any;
    showReachContractWarnings?: boolean;
    uniqueInstance?: boolean;
    instanceKey?: string;
    walletFallback?: {
        MyAlgoConnect?: any;
        WalletConnect?: any;
        PeraConnect?: any;
    };
    }
): ReachStdLib;

/** 
 * Attach an existing `stdlib` instance to `reachduck`. Use when you have 
 * already called `loadStdlib` but want reachduck helper functions. 
 * Add a `key` to attach and re-use multiple `stdlib` instances */
function attachReach(instance: ReachStdLib, key?: string): ReachStdLib;

/**
 * Returns your configured `stdlib` instance. Supply a `key` if you are 
 * using multiple instances. Throws an error if no instance is found.
 */
function createReachAPI(key?: string): ReachStdLib;

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

### Session Management
**Note:** Session management depends on an `stdlib` instance. Make sure your standard library 
is at least `0.1.8-rc.3` or newer.
```typescript
/** 
 * Check if a previous user session (address or WalletConnect) exists.
 * When `exists` is true, you can call `reconnectUser( addr )` using the
 * `addr` value returned from this function. */
function checkSessionExists(): { exists: boolean; isWCSession: boolean; addr: string | null;};

/** 
 * Begin a session with a user's wallet of choice. Make sure to configure 
 * stdlib to use either MyAlgo or WalletConnect before calling this function, 
 * as it will get the user to authenticate using a wallet (and will
 * error if a fallback isn't found.) */
function connectUser(): Promise<ConnectedUserData>;

/* Clean up current user session and reload window. Call LAST in your app */
function disconnectUser(): void;

/* Restart last user session. */
function reconnectUser(addr?: string |  undefined): Promise<ConnectedUserData>;
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

/** 
 * Create a "dummy" Token object for the specified network. If `chain` is not
 * specified, it will fallback to the current `reachduck` global configuration.
 */
function makeNetworkToken(chain?: ChainSymbol): ReachToken;

/* Doesn't do anything */
function noOp(): null;

/** 
 * Store user current network selection for App in `localStorage`.
 * ⚠️ WARNING: May trigger window reload if library is in a browser context */
function selectBlockchain(network: string): string;
/**
 * Set network provider preference `MainNet` or `TestNet`.
 * ⚠️ WARNING: Optionally triggers window reload */
function selectBlockchainNetwork(prov: NetworkProvider, reload = false): string;

/* Trims empty bytes from a decoded Byte string */
function trimByteString(str: string): string;

/**
 * Shrink an address to `radius`...`radius`-length string. Default would be
 * (WXWXWXWXWXWXWXWXWXWXWXWXWXWXWXWX) => "WXWXWX...WXWXWX" */
function truncateString(acct: string, radius = 6): string;
```


## Development
This is a typescript project. It depends on a subset of `Algosdk` and `WalletConnect`.

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
