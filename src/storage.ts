import { ChainSymbol } from ".";
import * as T from "./types";

type Provider = "TestNet" | "MainNet";
const PROVIDERS: { [name: string]: Provider } = {
  TESTNET: "TestNet",
  MAINNET: "MainNet",
};

const NETWORK_STORAGE_KEY = "rd-chain";
const NETWORK_PROVIDER_KEY = "rd-prov";
export const isBrowser = new Function(
  "try { return this === window } catch(e) { return false; }"
);
export const STORAGE: Storage = isBrowser()
  ? window.localStorage
  : createMemoryStorage();

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
export function getBlockchain(): ChainSymbol {
  const stored = STORAGE.getItem(NETWORK_STORAGE_KEY);
  return (stored as ChainSymbol) ?? selectBlockchain("ALGO");
}

/** Store user current network selection for App */
export function selectBlockchain(network: ChainSymbol): ChainSymbol {
  STORAGE.setItem(NETWORK_STORAGE_KEY, network);
  return STORAGE.getItem(NETWORK_STORAGE_KEY) as ChainSymbol;
}

/**
 * Set network provider preference `MainNet` or `TestNet`.
 * ⚠️ WARNING: Triggers window reload */
export function selectBlockchainNetwork(
  prov: T.NetworkProvider,
  reload = false
): string {
  const valid: T.NetworkProvider[] = ["TestNet", "BetaNet", "MainNet"];
  if (!valid.includes(prov))
    throw new Error(
      `Invalid provider selection: expected one of "TestNet", "BetaNet", "MainNet"; got "${prov}"`
    );

  STORAGE.setItem(NETWORK_PROVIDER_KEY, prov);
  if (reload && isBrowser()) window.location.reload();
  return prov;
}

function createMemoryStorage(): Storage {
  let data: Record<string, any> = {};

  return {
    clear: () => (data = {}),

    getItem: (key: string) => data[key] || null,

    key(keyIndex: number) {
      return Object.keys(data)[keyIndex] || null;
    },

    get length() {
      return Object.keys(data).length;
    },

    removeItem(key: string) {
      delete data[key];
    },

    setItem(key: string, value: any) {
      data[key] = value;
    },
  };
}
