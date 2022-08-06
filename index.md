# reachduck 🦆

Front-end helper functions for your DApp.\
Can optionally be paired with (unaffiliated) [reach `stdlib`](https://www.npmjs.com/package/@reach-sh/stdlib) for more functionality (see below).

## CAVEAT EMPTOR
### 1. This library is in development. 
It has not yet appeared in production (as far as I know), and the documentation may rarely lag behind changes. The API is mostly stable, but may need to adapt as `stdlib` is updated. Proceed with caution. 

### 2. You *may* need `@reach-sh/stdlib` for some things
If you want to use features like user session management (connecting a wallet), you will need to separately [install `@reach-sh/stdlib`](https://www.npmjs.com/package/@reach-sh/stdlib) in your project, and provide it to this package when necessary. You will only need to initialize `stdlib` once with `reachduck`.

### 3. The most exemplary efforts have been put forth. 
Nonetheless, there *may be* errors. And bug-fixes may take time, since this is a solo project.

A [changelog](https://github.com/JACK-COM/reachduck/blob/main/CHANGELOG.md) was introduced in `0.4.3`, and *should* better cover any interesting or disruptive changes made to the library.


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
