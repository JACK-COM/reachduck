import { getBlockchain } from "../storage";
import { NetworkData, ReachToken } from "../types";
import { noOp } from "../utils/helpers";
import ALGO from "./ALGO";

const returnList = () => [];

const NOOP_INTERFACE: ConnectorInterface = {
  disconnectUser: noOp,
  fetchAccount: noOp,
  fetchAssetById: noOp,
  getProviderEnv: noOp,
  getWalletConnectClientOpts: noOp,
  getWebWalletClientOpts: noOp,
  loadAssets: noOp,
  searchAssetsByName: returnList,
  searchForTransactions: returnList,
};

const CHAINS = {
  ALGO,
  ETH: NOOP_INTERFACE,
};
export type ChainSymbol = keyof typeof CHAINS;
export type NetworksMap = Record<ChainSymbol, NetworkData>;

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
 * Generate an interface for talking to an underlying blockchain,
 * Returns an API for interacting with configured `stdlib` instance. It
 * will determine the current connector and pull in the relevant interface
 * for fetching account data etc. for that chain. */
export function createConnectorAPI(
  chain?: string | ChainSymbol
): ConnectorInterface {
  const key = (chain || getBlockchain()) as ChainSymbol;
  if (CHAINS[key]) return CHAINS[key] as ConnectorInterface;
  return NOOP_INTERFACE;
}
