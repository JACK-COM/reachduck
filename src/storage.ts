import * as T from "./types";

const PROVIDERS: { [x: string]: "TestNet" | "MainNet" } = {
  TESTNET: "TestNet",
  MAINNET: "MainNet",
};

const NETWORK_STORAGE_KEY = "active-chain";
const NETWORK_PROVIDER_KEY = "active-prov";
const noop = () => null;
const STORAGE: Storage = window
  ? window.localStorage
  : {
      clear: noop,
      getItem: noop,
      key: noop,
      length: 0,
      removeItem: noop,
      setItem: noop,
    };

/** Determine whether app is running on `MainNet` or `TestNet` (default) */
export function getBlockchainNetwork() {
  return (
    STORAGE.getItem(NETWORK_PROVIDER_KEY) ||
    selectBlockchainNetwork(PROVIDERS.TESTNET)
  );
}

/**
 * Get last user-saved (or default) network for App. Sets the default
 * to `Algorand` if this is the user's first time in the application.
 */
export function getBlockchain(): string {
  const stored = STORAGE.getItem(NETWORK_STORAGE_KEY);
  return stored || selectBlockchain("ALGO");
}

/** Store user current network selection for App */
export function selectBlockchain(network: string): string {
  STORAGE.setItem(NETWORK_STORAGE_KEY, network);
  return network;
}

/**
 * Set network provider preference `MainNet` or `TestNet`.
 * ⚠️ WARNING: Triggers window reload */
export function selectBlockchainNetwork(
  prov: T.NetworkProvider,
  reload = false
): string {
  STORAGE.setItem(NETWORK_PROVIDER_KEY, prov);
  if (reload) window.location.reload();
  return prov;
}
