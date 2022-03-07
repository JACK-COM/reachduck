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

### `NetworkInterface`
Returned from `createConnectorAPI()`
```typescript
type NetworkInterface {
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
**Note:** only use `BetaNet` with stdlib on Algorand; it will likely throw an error\
for others. 
```typescript
type NetworkProvider = "TestNet" | "BetaNet" | "MainNet"
```

