# Reach Helpers

## What is it?
A folder with some basic helpers and a global pub-sub Reach state manager.

## How do I use it?
This section contains a few individual components that can be imported and used independently: 

* `useReach()`:\
  A function that returns the current global `stdLib` instance. The instance will be created only the first time this function is called.

* `getCurrentNetwork()`:\
  A function that returns the current `reach.connector` property. This represents the network to which your `stdLib` instance is connected/configured

* `getNetworkProvider()`:\
  A function that returns either `TestNet` or `MainNet`: only relevant when `stdLib` is configured to Algorand.

## Additional Resources
  [📚] [*RaphsDucks*](https://www.npmjs.com/package/@jackcom/raphsducks)\
  A lightweight redux-like global state manager. You can create additional instances (e.g. to separate global UI state values from Reach values). View the [library API](https://www.npmjs.com/package/@jackcom/raphsducks#reference) to learn how to use it.
