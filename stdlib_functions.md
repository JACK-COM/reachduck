# Stdlib Helpers
🦆 Utility functions for working with `stdlib`.

- [Stdlib Helpers](#stdlib-helpers)
  - [`loadReach`](#loadreach)
  - [`loadReachWithOpts`](#loadreachwithopts)
    - [Parameters](#parameters)
  - [`createReachAPI`](#createreachapi)
  - [`inlineAssetOptIn`](#inlineassetoptin)
  - [`parseAddress`](#parseaddress)
  - [`parseCurrency`](#parsecurrency)
  - [`tokenMetadata`](#tokenmetadata)
  - [`optInToAsset`](#optintoasset)


---
> **Important!** This section requires you to 
> - separately install `@reach-sh/stdlib` (minimum version **0.1.10-rc.6** as of this documentation) and 
> - call `loadReach` or `loadReachWithOpts` with that library's `loadStlib` function 
  >
>prior to calling or using `createReachAPI` anywhere in your code. Disregarding some or all of the above will result in very violent dev-environment errors.

---

## `loadReach`
Initialize your `stdlib` instance. Call this when you would use `loadStdlib`. You only need to use this once.\
This is the a preferred way to load `stdlib` if you are not in a browser or `window` context (e.g. command line, NodeJS app, AWS Lambda, etc) and want to quickly get started. 
```typescript
function loadReach(
    loadStdlibFn: (args: any) => ReachStdLib,
    chain?: string,
    network?: "TestNet" | "MainNet"
): boolean;
```

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
 

---

## `createReachAPI`
Returns your configured `stdlib` instance. Use after you have called `loadReach( loadStdlib )` at least once. 
```typescript
function createReachAPI(): ReachStdLib;
```

---

## `inlineAssetOptIn`
Accept a token (or skip if already accepted) and return a boolean. Requires an `stdlib` instance. 
```typescript
function inlineAssetOptIn(acc: ReachAccount, tokenId: any): Promise<boolean>;
```
---

## `parseAddress`
Convert a string into a chain-specific contract representation. Will attempt to format for the currently-configured `stdlib` instance.
```typescript
function parseAddress(ctc: any): any;
```

---

## `parseCurrency`
Convenience: convert `val` into atomic units. Requires an `stdlib` instance.
```typescript
function parseCurrency(val: any, dec?: number | undefined): any;
```

---

## `tokenMetadata`
Fetch token metadata and balance for `acc` (if available) 
```typescript
function tokenMetadata(token: any, acc: ReachAccount): Promise<ReachToken>;
```

---

## `optInToAsset`
Opt-in in to assets 
```typescript
function optInToAsset(acc: T.ReachAccount, tokenId: any): Promise<boolean>;
```

---
