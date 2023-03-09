
# Change Log
All notable changes to `reachduck` will be documented here.
 
The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).
 
## [0.6.0] - 2023-03-05
### Changed
- ❌ REVERTS internal `unsafeAllowMultipleStdlibs` call, although feature support remains.\
Users must now call this in their own code before using the functionality as before. 
- ✅ `@reach-sh/stdlib` dependency is no longer required
  - You will still need to install it for session features (`connectUser`, `disconnectUser`) 
- ✅ Improved `algosdk` support (current `@2.1.0`)
- `createConnectorAPI` return object changed: 
  - replaces `chain` property with `abbr`
  - Adds `decimals`
  - All other properties unchanged.
- INTERNAL: adds `cli/` folder to root directory for manually testing library features

---

## [0.4.6] - 2022-09-25
 
### Added
- Store and re-use multiple **stdlib** instances by supplying a key
- New utility functions 
 - `makeNetworkToken`
 - `trimDecimals`
 - `trimTrailingZeros`

### Fixed
- `algosdk` dependency locked to `1.18.0`



---


## [0.4.5] - 2022-08-07
 
### Added
- Enabled multiple **stdlib** instances

### Fixed
- `algosdk` dependency locked to `1.18.0`


 
## [0.4.3] - 2022-08-06
 
### Added
- New **Changelog** document 
- `attachReach( stdlib: ReachStdlib )`\
  Connect `reachduck` to your existing `stdlib` instance.
   
### Changed
- You can now create multiple `stdlib` instances that are separte from the global one:
  - Pass `true` as the fourth argument into `loadReach`. 
  - Set `uniqueInstance` to `true` in `ReachEnvOpts` (second parameter of `loadReachWithOpts`) 


### Fixed
- `ReachStdlib` typedef is more expanded, and should include more(-accurate) code suggestions. 
