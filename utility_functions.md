# Utility Functions
General helper/utility functions. Most functions do not require `stdlib` or other dependencies.

- [Utility Functions](#utility-functions)
  - [`checkVersionChanged`](#checkversionchanged)
  - [`setAppVersion`](#setappversion)
  - [`copyToClipboard`](#copytoclipboard)
  - [`formatAddress`](#formataddress)
  - [`formatCurrency`](#formatcurrency)
  - [`formatCurrencyLocale`](#formatcurrencylocale)
  - [`formatNumberShort`](#formatnumbershort)
  - [`asMaybe`](#asmaybe)
  - [`asMaybeNone`](#asmaybenone)
  - [`fromMaybe`](#frommaybe)
  - [`isMaybe`](#ismaybe)
  - [`isSome`](#issome)
  - [`isNone`](#isnone)
  - [`getBlockchain`](#getblockchain)
  - [`getBlockchainNetwork`](#getblockchainnetwork)
  - [`isImageFile`](#isimagefile)
  - [`isVideoFile`](#isvideofile)
  - [`listSupportedNetworks`](#listsupportednetworks)
  - [`noOp`](#noop)
  - [`selectBlockchain`](#selectblockchain)
  - [`selectBlockchainNetwork`](#selectblockchainnetwork)
  - [`trimByteString`](#trimbytestring)
  - [`truncateString`](#truncatestring)
- [Site Menu](#site-menu)

---

## `checkVersionChanged`
App Migration helper: check if your app version has changed 
```typescript
function checkVersionChanged(currentVersion: string | number, APP_VERSION_KEY?: string): string;
```

[top](#utility-functions)

---

## `setAppVersion`
App Migration helper: set your current app version

```typescript
function setAppVersion(version: string | number, APP_VERSION_KEY?: string): string;
```

[top](#utility-functions)

---

## `copyToClipboard`
Copy text to clipboard 
```typescript
function copyToClipboard(val: string): Promise<void>;
```

[top](#utility-functions)

---

## `formatAddress`
**Requires `stdlib`**. Convenience over `stdlib.formatAddress` 
```typescript
function formatAddress(acc: ReachAccount): string;
```

[top](#utility-functions)

---

## `formatCurrency`
**Requires `stdlib`**. UI-friendly currency formatting. Takes the `decimal` places of the currency, and
an `abbr` boolean which, when true, will abbreviate the formatted value

```typescript
function formatCurrency(amount: any, decimals?: number | undefined, abbr?: boolean): string;
```

[top](#utility-functions)

---

## `formatCurrencyLocale`
Builtin JS locale currency formatter (returns comma-delineated string) 
```typescript
function formatCurrencyLocale(val: number): string;
```

[top](#utility-functions)

---

## `formatNumberShort`
Abbreviated number formatting (e.g. `1000` -> `1K`) 
```typescript
function formatNumberShort(val: number, decimalPlaces?: number): string;
```

[top](#utility-functions)

---

## `asMaybe`
Convert a value into a `Maybe` value-type
```typescript
function asMaybe<T>(val: T): Maybe<T>;
```

[top](#utility-functions)

---

## `asMaybeNone`
Generate a falsy (`null`) `Maybe` value
```typescript
function asMaybeNone(): Maybe<T>;
```

[top](#utility-functions)

---

## `fromMaybe`
Extract a value from a `Maybe` value, or provide a fallback 
```typescript
function fromMaybe<T>(mVal: Maybe<T>, format?: (v: T) => any, fallback?: any): any;
```

[top](#utility-functions)

---

## `isMaybe`
Assert a value is a `Maybe` value
```typescript
function isMaybe(mVal: any): boolean;
```

[top](#utility-functions)

---

## `isSome`
Assert a value is a `Maybe` type that resolves to a defined value
```typescript
function isSome(mVal: any): boolean;
```

---

## `isNone`
Assert a value is a `Maybe` type that resolves to null
```typescript
function isNone(mVal: any): boolean;
```

[top](#utility-functions)

---

## `getBlockchain`
Get the current stdlib instance's `connector` (blockchain)
```typescript
function getBlockchain(): string;
```

[top](#utility-functions)

---

## `getBlockchainNetwork`
Get current chain network. (e.g `"TestNet" | "MainNet"` on Algorand) 
```typescript
function getBlockchainNetwork(): string;
```

[top](#utility-functions)

---

## `isImageFile`
Assert `path` represents an image file 
```typescript
function isImageFile(path: string): boolean;
```

[top](#utility-functions)

---

## `isVideoFile`
Assert `path` represents a video file 
```typescript
function isVideoFile(path: string): boolean;
```

[top](#utility-functions)

---

## `listSupportedNetworks`
```typescript
/* List all networks currently supported by this library */
function listSupportedNetworks(): NetworkData[];
```

[top](#utility-functions)

---

## `noOp`
Doesn't do anything. Useful when you need a function stub.
```typescript
function noOp(): null;
```

---
    
## `selectBlockchain`
Set current consensus network (e.g. Algorand or Ethereum). May trigger window reload. Requires an `stdlib` instance.\
This will affect what `createConnectorAPI` returns, if you call the latter without arguments.\
This function may trigger window reload if a second argument is specified.
```typescript
function selectBlockchain(network: string, reload?: boolean): string;
```

[top](#utility-functions)

---

## `selectBlockchainNetwork`
Set network provider preference `MainNet` or `TestNet` (or `BetaNet` on Algo). `BetaNet` is only supported on Algorand.\
This function may trigger window reload if a second argument is specified.
```typescript
function selectBlockchainNetwork(network: "MainNet" | "TestNet" | "BetaNet", reload?: boolean): string;
```

[top](#utility-functions)

---

## `trimByteString`
Trims empty bytes (`\0...`) from a string 
```typescript
function trimByteString(str: string): string;
```

[top](#utility-functions)

---

## `truncateString`
Shrink an address to `radius`...`radius`-length string. Default would be
(WXWXWXWXWXWXWXWXWXWXWXWXWXWXWXWX) => "WXWXWX...WXWXWX" 
```typescript
function truncateString(acct: string, radius = 6): string;
```


---

# Site Menu
* [Home](/index.md)
* [Methods](/methods.md)
  * [Blockchain Helpers](/blockchain_functions.md)
  * [General Helpers](/utility_functions.md)
* [Types](/types.md)
* [Examples](/examples.md)

---

[top](#utility-functions)
