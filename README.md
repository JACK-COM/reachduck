# reachduck 🦆

Front-end helper functions for your reach `stdlib` instance.\

## Important Information
### 1. This library is *extremely* in Alpha-status. 
It contains no tests, and was hacked together as a convenience. If you choose it, it is presumed you know exactly what you are doing. 

### 2. You will also need `@reach-sh/stdlib`
This package works *with* the reach standard library. You will need to separately [install that dependency](https://www.npmjs.com/package/@reach-sh/stdlib). 

## Use


```typescript
import { loadStdlib } from "@reach-sh/stdlib"
import reachduck from "@jackcom/reachduck"

// Initialize stdlib instance and prep for additional config
// This only needs to be called once (before you use stdlib)
reachduck.loadReach(loadStdlib)

// You can now call 'createReachAPI' anywhere
const stdlib = reachduck.createReachAPI()
const acc = await stdlib.createAccount()

// But you can also do things like
await reachduck.connectUser(); 
reachduck.checkSessionExists()
reachduck.isImageFile('path/to/some.mp4'); // false 
```

## API
The library contains a single `reachduck` export. All methods listed below are available on this object.

### Working with Stdlib and chains
```typescript
    /* Initialize your `stdlib` instance. Call this FIRST!! */
    loadReach(loadStdlibFn: (args: any) => ReachStdLib): boolean;

    /* Returns your configured `stdlib` instance */
    createReachAPI(): ReachStdLib;

    /* Returns a `ConnectorInterface` w/ additional chain-specific helpers */
    createConnectorAPI(): ConnectorInterface;

    type ConnectorInterface {
        /** Clear any user session details (usually for `WalletConnect`) */
        disconnectUser(): void;
        
        /** Fetch account details from network */
        fetchAccount(acc: string | any): any | Promise<any>;
        
        /** Fetch account assets from network */
        loadAssets(acc: string | any): any | Promise<any>;
        
        /** Get an object with a key containing a `WalletConnect` client instance */
        getWalletConnectClientOpts(): any;
        
        /**
         * Get an object with a key containing a wallet fallback for `stdlib`.
         * Defaults to `MyAlgoConnect`
         */
        getWebWalletClientOpts(): any;
    };
```

### Session stuff
```typescript
    /* Check if a previous user session (address or WalletConnect) exists */
    checkSessionExists(): { exists: boolean; isWCSession: boolean; addr: string | null;};
    
    /* Begin a session with a user's wallet of choice */
    connectUser(): Promise<ConnectedUserData>;
    
    /* Clean up current user session and reload window. Call LAST in your app */
    disconnectUser(): void;
    
    /* Restart last user session. */
    reconnectUser(addr?: string |  undefined): Promise<ConnectedUserData>;

    
    /* Response object */
    type ConnectedUserData = {
        account: ReachAccount;
        address: string;
        balance: string;
    } & Record<string, any>;
```

### Everything else
```typescript
    /* Accept a token (or skip if already accepted) */
    inlineAssetOptIn(acc: ReachAccount, tokenId: any): Promise<boolean>;
    
    /* Convenience: convert `val` into atomic units */
    parseCurrency(val: any, dec?: number | undefined): any;
    
    /* Set current consensus network. Will trigger window reload */
    setCurrentNetwork(network: string): string;
    
    /* Fetch token metadata and balance for `acc` (if available) */
    tokenMetadata(token: any, acc: ReachAccount): Promise<ReachToken>;
    
    /* ALGORAND | set wallet fallback to `WalletConnect` */
    useWalletConnect(): void;
    
    /* ALGORAND | set wallet fallback to web wallet (currently `MyAlgo`) */
    useWebWallet(): void;
```

### Utilities and UI Helpers
```typescript
    /* Copy text to clipboard */
    copyToClipboard(val: string): Promise<void>;
    
    /* Convenience over `stdlib.formatAddress` */
    formatAddress(acc: ReachAccount): string;
    
    /* UI-friendly currency formatting */
    formatCurrency(amount: any, decimals?: number | undefined, abbr?: boolean): string;
    
    /* UI-friendly currency formatting with large num abbreviation */
    formatCurrencyShort(val: number, decimalPlaces?: number): string;
    
    /* Extract a value from a `Maybe` value, or provide a fallback */
    fromMaybe(mVal: [val: "Some" | "None", v: any], format?: (v: any) => any, fallback?: any): any;
    
    /* Get the current stdlib instance's `connector` (blockchain) */
    getCurrentNetwork(): string;
    
    /* Get current chain network  */
    getNetworkProvider(): "TestNet" | "MainNet";
    
    /* Builtin JS locale currency formatter */
    intlFormatCurrency(val: number): string;
    
    /* Assert `path` represents an image file */
    isImageFile(path: string): boolean;
    
    /* Assert `path` represents a video file */
    isVideoFile(path: string): boolean;
    
    /* List all networks currently supported by this library */
    listSupportedNetworks(): NetworkData[];
    
    /* Doesn't do anything */
    noOp(): null;
    
    /* Convert a string into a chain-specific contract representation */
    parseContractAddress(ctc: any): any;
    
    /* trims empty bytes from a decoded Byte string */
    trimByteString(str: string): string;
    
    /* Shrink an address to `radius`...`radius`-length string */
    truncateAccountString(acct: string, radius = 6): string;
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
No tests currently.

## Credits

Made with [createapp.dev](https://createapp.dev/)
