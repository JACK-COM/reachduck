## 1. Blockchain networks
General blockchain utility helpers
- [1. Blockchain networks](#1-blockchain-networks)
    - [`createConnectorAPI`](#createconnectorapi)
      - [`NetworkInterface.disconnectUser`](#networkinterfacedisconnectuser)
      - [`NetworkInterface.fetchAccount`](#networkinterfacefetchaccount)
      - [`NetworkInterface.fetchAssetById`](#networkinterfacefetchassetbyid)
      - [`NetworkInterface.getProviderEnv`](#networkinterfacegetproviderenv)
      - [`NetworkInterface.loadAssets`](#networkinterfaceloadassets)
        - [Parameters](#parameters)
      - [`NetworkInterface.getWalletConnectClientOpts`](#networkinterfacegetwalletconnectclientopts)
      - [`NetworkInterface.getWebWalletClientOpts`](#networkinterfacegetwebwalletclientopts)
      - [`NetworkInterface.searchAssetsByName`](#networkinterfacesearchassetsbyname)
      - [`NetworkInterface.searchForTransactions`](#networkinterfacesearchfortransactions)
  
#### `createConnectorAPI` 
Returns a `ConnectorAPI` with the following helper methods.\
Note: `BetaNet` **network** option is only accepted by Algorand. Values default to `ALGO` and `TestNet` if none are provided.
```typescript
function createConnectorAPI(
    chain?: "ALGO" | "ETH",
    network?: "TestNet" | "BetaNet" | "MainNet"
): NetworkInterface
```


##### `NetworkInterface.disconnectUser`
Clear any additional user session details (usually for `WalletConnect`) 
```typescript
NetworkInterface.disconnectUser(): void;
```
    

##### `NetworkInterface.fetchAccount`  
 Fetch account details from network
```typescript
NetworkInterface.fetchAccount(acc: string | any): any | Promise<any>;
```
    

##### `NetworkInterface.fetchAssetById`   
 Fetch an asset/token by its ID from the chain's block explorer 
```typescript
NetworkInterface.fetchAssetById(assetId: number): any;
```
    
##### `NetworkInterface.getProviderEnv`    
 Returns a blockchain-specific configuration for `stdlib` */
```typescript
NetworkInterface.getProviderEnv(network?: string): void;
```

##### `NetworkInterface.loadAssets`  
 Fetch account assets from network 
```typescript
NetworkInterface.loadAssets(
    address: string,
    limit?: number, // max number of assets to fetch; default 10
    assets?: number, // max number of assets to fetch; default 10
): any | Promise<ReachToken[]>;
```

###### Parameters
- `limit?`: **number**; max number of assets to fetch (default `10`)
- `assets?`: **number**; List of asset ids to fetch. Not supported on all networks.
    

##### `NetworkInterface.getWalletConnectClientOpts`  
Get a `WalletConnect` client instance 
```typescript
NetworkInterface.getWalletConnectClientOpts(): any;
```
    
    

##### `NetworkInterface.getWebWalletClientOpts`  
Get an object with a key containing a wallet fallback for `stdlib`. Defaults to `MyAlgoConnect` on Algorand.
```typescript
NetworkInterface.getWebWalletClientOpts(): any;
```
    

##### `NetworkInterface.searchAssetsByName`
Search for an asset/token by its name. Returns a list 
```typescript
NetworkInterface.searchAssetsByName(assetName: string): any;
```
    

##### `NetworkInterface.searchForTransactions` 
Search for transactions for this `addr` 
```typescript
NetworkInterface.searchForTransactions(addr: string, opts?: any): any;
```

---

