import { ConnectorInterface, NetworkData } from "../types";
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

export const NETWORKS: NetworksMap = {
  ALGO: { name: "Algorand", abbr: "ALGO", decimals: 6 },
  ETH: { name: "Ethereum", abbr: "ETH", decimals: 18 },
};

/**
 * Returns an API for interacting with configured `stdlib` instance. It
 * will determine the current connector and pull in the relevant interface
 * for fetching account data etc. for that chain.
 */
export function loadInterface(chain: string | ChainSymbol): ConnectorInterface {
  const key = chain as ChainSymbol;
  if (CHAINS[key]) return CHAINS[key] as ConnectorInterface;
  return NOOP_INTERFACE;
}
