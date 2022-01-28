import { noOp } from "../utils/helpers";
import { AlgoInterface } from "./ALGO";

type Connector = string;

export type ConnectorInterface = {
  /** Clear any user session details (usually for `WalletConnect`) */
  disconnectUser(): void;
  /** Fetch account details from network */
  fetchAccount(acc: string | any): any | Promise<any>;
  /** Fetch account assets from network */
  loadAssets(acc: string | any): any | Promise<any>;
  /** Get a `WalletConnect` client instance */
  getWalletConnectClientOpts(): any;
  /**
   * Get an object with a key containing a wallet fallback for `stdlib`.
   * Defaults to `MyAlgoConnect`
   */
  getWebWalletClientOpts(): any;
};

const DEFAULT_INTERFACE: ConnectorInterface = {
  disconnectUser: noOp,
  fetchAccount: noOp,
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
