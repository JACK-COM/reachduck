import { NetworkProvider, selectBlockchainNetwork } from "..";
import { getBlockchain } from "../storage";
import { NetworkData, ReachToken, ChainSymbol, TxnSearchOpts } from "../types";
import ALGO from "./ALGO";

const CHAINS: Record<ChainSymbol, NetworkInterface> = {
  ALGO: makeAPI("ALGO", ALGO),
  ETH: makeAPI("ETH", {
    getProviderEnv() {
      return {};
    }
  })
};

/** Interface for blockchain-specific helpers */
export type NetworkInterface = {
  /** Create a new network account */
  createAccount(): any | Promise<any>;
  /** Fetch account details from network */
  fetchAccount(acc: string | any): any | Promise<any>;
  /** Fetch an asset/token by its ID from the chain's block explorer */
  fetchAssetById(
    assetId: number,
    assetBalance?: number
  ): Promise<ReachToken | null>;
  /** Returns a blockchain-specific configuration for `stdlib` */
  getProviderEnv(provider?: NetworkProvider & string): any;
  /** Fetch account assets from network. May optionally takes a list of assets addresses */
  loadAssets(
    account: string | any,
    limit?: number,
    assets?: string[]
  ): any | Promise<ReachToken[]>;
  /** Search for an asset/token by its name. Returns a list of results */
  searchAssetsByName(assetName: string): any;
  /** Search for transactions for this `addr` */
  searchForTransactions(opts?: TxnSearchOpts): any;
} & NetworkData;

export type NetworksMap = Record<ChainSymbol, NetworkData>;

export const NETWORKS: NetworksMap = {
  ALGO: { name: "Algorand", abbr: "ALGO", decimals: 6 },
  ETH: { name: "Ethereum", abbr: "ETH", decimals: 18 }
};

/** Get a UI-friendly list of supported Networks */
export function listSupportedNetworks(): NetworkData[] {
  const activeNetwork = getBlockchain();

  return Object.values(NETWORKS).map((val) => ({
    ...val,
    active: val.abbr === activeNetwork
  }));
}

/**
 * Returns a `NetworkInterface` w/ additional chain-specific helpers.
 * Note: not all `network` options are accepted by all chains. Defaults
 * to "ALGO" + "TestNet" if no values are provided.
 */
export function createConnectorAPI(
  chain?: string & ChainSymbol,
  network?: NetworkProvider
): NetworkInterface {
  const key = (chain || getBlockchain()) as ChainSymbol;
  if (!CHAINS[key]) return makeAPI(key);
  if (network) {
    const net = network === "BetaNet" && chain !== "ALGO" ? "TestNet" : network;
    selectBlockchainNetwork(net);
  }
  return CHAINS[key];
}

export function isSupportedNetwork(key: ChainSymbol) {
  return Boolean(CHAINS[key]);
}

function getNet(): NetworksMap {
  return {
    ALGO: { name: "Algorand", abbr: "ALGO", decimals: 6 },
    ETH: { name: "Ethereum", abbr: "ETH", decimals: 18 }
  };
}

/**
 * Create a default `ConnectorInterface` object that can be overridden
 * with chain-specific functions
 */
function makeAPI(
  chain: string & ChainSymbol,
  overrides: Partial<NetworkInterface> = {}
): NetworkInterface {
  const emptyList = () => [];
  const unImpl = (m: string) => console.log(`Unsupported ${chain} call "${m}"`);

  return {
    ...getNet()[chain],
    createAccount: () => unImpl("create account"),
    fetchAccount: () => unImpl("fetchAccount"),
    fetchAssetById: async () => {
      unImpl("fetch-asset-by-id");
      return null;
    },
    getProviderEnv: () => ({}),
    loadAssets: () => unImpl("load assets"),
    searchAssetsByName: emptyList,
    searchForTransactions: emptyList,

    // override with any custom implementation
    ...overrides
  };
}
