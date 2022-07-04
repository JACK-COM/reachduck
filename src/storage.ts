import { getStorage, isBrowser } from "./utils/helpers";
import * as T from "./types";

/** @internal */
const NETWORK_STORAGE_KEY = "rd-chain";
/** @internal */
const NETWORK_PROVIDER_KEY = "rd-prov";

/** Remove locally-stored blockchain and provider data */
export function clearBlockchain() {
  const storage = getStorage();
  storage.removeItem(NETWORK_STORAGE_KEY);
  storage.removeItem(NETWORK_PROVIDER_KEY);
}

/** Determine whether app is running on `MainNet` or `TestNet` (default) */
export function getBlockchainNetwork(): string & T.NetworkProvider {
  const stored =
    getStorage().getItem(NETWORK_PROVIDER_KEY) ||
    selectBlockchainNetwork("TestNet");
  return stored as T.NetworkProvider;
}

/**
 * Get last user-saved (or default) network for App. Sets the default
 * to `Algorand` if this is the user's first time in the application.
 */
export function getBlockchain(): T.ChainSymbol {
  const stored = getStorage().getItem(NETWORK_STORAGE_KEY);
  return (stored as T.ChainSymbol) ?? selectBlockchain("ALGO");
}

/** Store user current network selection for App */
export function selectBlockchain(
  network: T.ChainSymbol,
  reload = false
): T.ChainSymbol {
  const storage = getStorage();
  storage.setItem(NETWORK_STORAGE_KEY, network);
  if (reload && isBrowser()) window?.location.reload();
  return storage.getItem(NETWORK_STORAGE_KEY) as T.ChainSymbol;
}

/**
 * Set network provider preference `MainNet` or `TestNet`.
 * ⚠️ WARNING: Triggers window reload */
export function validateProvider(prov: string) {
  /** @internal */
  const valid: T.NetworkProvider[] = [
    "TestNet",
    "BetaNet",
    "MainNet",
    "ALGO-browser",
    "ALGO-devnet",
    "ALGO-live",
    "ETH-browser",
    "ETH-devnet",
    "ETH-live"
  ];
  return valid.includes(prov as T.NetworkProvider);
}

/**
 * Set network provider preference `MainNet` or `TestNet`.
 * ⚠️ WARNING: Triggers window reload */
export function selectBlockchainNetwork(
  prov: T.NetworkProvider,
  reload = false
): string {
  if (!validateProvider(prov))
    throw new Error(`Invalid provider selection: got "${prov}"`);

  getStorage().setItem(NETWORK_PROVIDER_KEY, prov);
  if (reload && isBrowser()) window.location.reload();
  return prov;
}
