# Blockchain Helpers
🦆  General blockchain utility helpers
- [Blockchain Helpers](#blockchain-helpers)
  - [`createConnectorAPI`](#createconnectorapi)
    - [`NetworkInterface.chain`](#networkinterfacechain)
    - [`NetworkInterface.fetchAccount`](#networkinterfacefetchaccount)
    - [`NetworkInterface.fetchAssetById`](#networkinterfacefetchassetbyid)
    - [`NetworkInterface.getProviderEnv`](#networkinterfacegetproviderenv)
    - [`NetworkInterface.loadAssets`](#networkinterfaceloadassets)
      - [Parameters](#parameters)
    - [`NetworkInterface.getWalletConnectClientOpts`](#networkinterfacegetwalletconnectclientopts)
    - [`NetworkInterface.getWebWalletClientOpts`](#networkinterfacegetwebwalletclientopts)
    - [`NetworkInterface.searchAssetsByName`](#networkinterfacesearchassetsbyname)
    - [`NetworkInterface.searchForTransactions`](#networkinterfacesearchfortransactions)
  - [Site Menu](#site-menu)
  
---

## `createConnectorAPI` 
Returns a `ConnectorAPI` with the following helper methods.\
Note: `BetaNet` **network** option is only accepted by Algorand. Values default to `ALGO` and `TestNet` if none are provided.
```typescript
function createConnectorAPI(
    chain?: "ALGO" | "ETH",
    network?: "TestNet" | "BetaNet" | "MainNet"
): NetworkInterface
```

[top](#blockchain-networks)

---

### `NetworkInterface.chain` 
Returns the network to which the current `ConnectorAPI` is configured.\
Note: Values default to `ALGO` and `TestNet` if none are provided on init.
```typescript
NetworkInterface.chain?: "ALGO" | "ETH" | ...
```
[top](#blockchain-networks)

---

### `NetworkInterface.fetchAccount`  
 Fetch account details from network
```typescript
NetworkInterface.fetchAccount(acc: string | any): any | Promise<any>;
```
    
[top](#blockchain-networks)

---

### `NetworkInterface.fetchAssetById`   
 Fetch an asset/token by its ID from the chain's block explorer. If an asset balance is provided, it will be returned in the full formatted response. 
```typescript
NetworkInterface.
  fetchAssetById(
    assetId: number,
    assetBalance?: number
  ): Promise<ReachToken | null>;
```

[top](#blockchain-networks)

---

### `NetworkInterface.getProviderEnv`    
 Returns a blockchain-specific configuration that can be used for `stdlib`, or to derive properties like the indexer URL for the current blockchain network.
```typescript
NetworkInterface.getProviderEnv(network?: string): void;
```

[top](#blockchain-networks)

---

### `NetworkInterface.loadAssets`  
 Fetch account assets from network .
```typescript
NetworkInterface.loadAssets(
    address: string,
    limit?: number, // max number of assets to fetch; default 10
    assets?: number, // list of assets to fetch (not supported on all)
): any | Promise<ReachToken[]>;
```

#### Parameters
- `limit?`: **number**; max number of assets to fetch (default `10`)
- `assets?`: **number**; List of asset ids to fetch. Not supported on all networks.

[top](#blockchain-networks)

---

### `NetworkInterface.getWalletConnectClientOpts`  
Get a `WalletConnect` client instance 
```typescript
NetworkInterface.getWalletConnectClientOpts(): any;
```
    
[top](#blockchain-networks)

---

### `NetworkInterface.getWebWalletClientOpts`  
Get an object with a key containing a wallet fallback for `stdlib`. Defaults to `MyAlgoConnect` on Algorand.
```typescript
NetworkInterface.getWebWalletClientOpts(): any;
```
[top](#blockchain-networks)

---

### `NetworkInterface.searchAssetsByName`
Search for an asset/token by its name. Returns a list 
```typescript
NetworkInterface.searchAssetsByName(assetName: string): any;
```
[top](#blockchain-networks)

---

### `NetworkInterface.searchForTransactions` 
Search for transactions for this `addr` 
```typescript
NetworkInterface.searchForTransactions(addr: string, opts?: any): any;
```
[top](#blockchain-networks)

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

---

[top](#blockchain-networks)