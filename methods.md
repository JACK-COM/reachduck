# Methods
All methods below are available as individual imports.

- [Methods](#methods)
  - [1. Working with Blockchain networks](#1-working-with-blockchain-networks)
  - [2. Working with Stdlib](#2-working-with-stdlib)
  - [3. Session Management](#3-session-management)
      - [`checkSessionExists`](#checksessionexists)
      - [`connectUser`](#connectuser)
      - [`disconnectUser`](#disconnectuser)
      - [`reconnectUser`](#reconnectuser)
  - [4. General Utilities/Helpers](#4-general-utilitieshelpers)
      - [`checkVersionChanged`](#checkversionchanged)
      - [`setAppVersion`](#setappversion)
      - [`copyToClipboard`](#copytoclipboard)
      - [`formatAddress`](#formataddress)
      - [`formatCurrency`](#formatcurrency)
      - [`formatCurrencyLocale`](#formatcurrencylocale)
      - [`formatNumberShort`](#formatnumbershort)
      - [`fromMaybe`](#frommaybe)
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

## 1. Working with Blockchain networks

This documentation has moved [here](./blockchain_functions.md)

## 2. Working with Stdlib 

This documentation has moved [here](./stdlib_functions.md)

## 3. Session Management
**Note:** Session management depends on an `stdlib` instance. Make sure you have a version of the Reach JS standard library no older than `0.1.8-rc.3`.
#### `checkSessionExists`
Check if a previous user session (address or WalletConnect) exists.
When `exists` is true, you can call `reconnectUser( addr )` using the
`addr` value returned from this function. 
```typescript
function checkSessionExists(): { exists: boolean; isWCSession: boolean; addr: string | null;};
```
#### `connectUser`
Begin a session with a user's wallet of choice. Make sure to configure `stdlib` to 
use either `MyAlgo` or `WalletConnect` before calling this function, as it will get 
the user to authenticate using a wallet (and will error if a fallback isn't found.) 
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

---

## 4. General Utilities/Helpers
