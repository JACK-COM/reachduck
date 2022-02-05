import { ConnectorInterface, NetworkData } from "../types";
import { noOp } from "../utils/helpers";
import ALGO from "./ALGO";

type Connector = string;
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

const CHAINS: Record<Connector, ConnectorInterface> = {
  ALGO,
};

/**
 * Returns an API for interacting with configured `stdlib` instance. It
 * will determine the current connector and pull in the relevant interface
 * for fetching account data etc. for that chain.
 */
export function loadInterface(chain: string): ConnectorInterface {
  if (CHAINS[chain]) return CHAINS[chain];
  return NOOP_INTERFACE;
}

export const NETWORKS: Record<string, NetworkData> = {
  ALGO: { name: "Algorand", abbr: "ALGO", decimals: 6 },
  ETH: { name: "Ethereum", abbr: "ETH", decimals: 18 },
};
