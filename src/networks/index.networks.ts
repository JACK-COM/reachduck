import { ReachStdLib, ConnectorInterface } from "../types";
import { noOp } from "../utils/helpers";
import { AlgoInterface } from "./ALGO";

type Connector = string;

const DEFAULT_INTERFACE: ConnectorInterface = {
  disconnectUser: noOp,
  fetchAccount: noOp,
  getProviderEnv: noOp,
  getWalletConnectClientOpts: noOp,
  getWebWalletClientOpts: noOp,
  loadAssets: noOp,
};
const CHAINS: Record<Connector, ConnectorInterface> = {
  ALGO: AlgoInterface,
};

/**
 * Returns an API for interacting with configured `stdlib` instance. It
 * will determine the current connector and pull in the relevant interface
 * for fetching account data etc. for that chain.
 */
export function loadInterface(chain: string): ConnectorInterface {
  if (CHAINS[chain]) return CHAINS[chain];
  return DEFAULT_INTERFACE;
}
