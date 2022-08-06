
# Change Log
All notable changes to `reachduck` will be documented here.
 
The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).
 
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