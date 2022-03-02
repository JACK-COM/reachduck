import { NetworkProvider, selectBlockchainNetwork } from "..";
import { getBlockchain } from "../storage";
import { NetworkData, ReachToken, ChainSymbol, NetworksMap } from "../types";
import ALGO from "./ALGO";

const NOOP = (connector: string): ConnectorInterface => {
  const unimplementedList = () => [];
  const unImplemented = (name: string) => {
    console.log(`Unimplemented ${connector} method "${name}"`);
  };

  return {
    disconnectUser: () => unImplemented("disconnectUser"),
    fetchAccount: () => unImplemented("fetchAccount"),
    fetchAssetById: () => unImplemented("fetchAssetById"),
    getProviderEnv: () => unImplemented("getProviderEnv"),
    getWalletConnectClientOpts: () =>
      unImplemented("getWalletConnectClientOpts"),
    getWebWalletClientOpts: () => unImplemented("getWebWalletClientOpts"),
    loadAssets: () => unImplemented("loadAssets"),
    searchAssetsByName: unimplementedList,
    searchForTransactions: unimplementedList,
  };
};

const CHAINS = {
  ALGO,
  ETH: NOOP("ETH"),
};

/** Interface for blockchain-specific helpers */
export type ConnectorInterface = {
  /** Clear any user session details (usually for `WalletConnect`) */
  disconnectUser(): void;
  /** Fetch account details from network */
  fetchAccount(acc: string | any): any | Promise<any>;
  /** Fetch an asset/token by its ID from the chain's block explorer */
  fetchAssetById(assetId: number): any;
  /** Returns a blockchain-specific configuration for `stdlib` */
  getProviderEnv(network?: ChainSymbol | string): void;
  /** Fetch account assets from network */
  loadAssets(acc: string | any): any | Promise<ReachToken[]>;
  /** Get a `WalletConnect` client instance */
  getWalletConnectClientOpts(): any;
  /**
   * Get an object with a key containing a wallet fallback for `stdlib`.
   * Defaults to `MyAlgoConnect` on Algorand.
   */
  getWebWalletClientOpts(): any;
  /** Search for an asset/token by its name. Returns a list of results */
  searchAssetsByName(assetName: string): any;
  /** Search for transactions for this `addr` */
  searchForTransactions(addr: string, opts?: any): any;
};

export const NETWORKS: NetworksMap = {
  ALGO: { name: "Algorand", abbr: "ALGO", decimals: 6 },
  ETH: { name: "Ethereum", abbr: "ETH", decimals: 18 },
};

/** Get a UI-friendly list of supported Networks */
export function listSupportedNetworks(): NetworkData[] {
  const activeNetwork = getBlockchain();

  return Object.values(NETWORKS).map((val) => ({
    ...val,
    active: val.abbr === activeNetwork,
  }));
}

/**
 * Returns a `ConnectorInterface` w/ additional chain-specific helpers.
 * Note: not all `network` options are accepted by all chains. Defaults
 * to "ALGO" + "TestNet" if no values are provided.
 */
export function createConnectorAPI(
  chain?: string | ChainSymbol,
  network?: NetworkProvider
): ConnectorInterface {
  const key = (chain || getBlockchain()) as ChainSymbol;
  if (!CHAINS[key]) return NOOP(key);
  if (network) selectBlockchainNetwork(network);
  return CHAINS[key] as ConnectorInterface;
}

export function isSupportedNetwork(key: ChainSymbol) {
  return Boolean(CHAINS[key]);
}
