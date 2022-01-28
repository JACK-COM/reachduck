import { ReachAccount } from "./reach-types";
import {
  createReachAPI,
  createConnectorAPI,
  formatCurrency,
  getProviderEnv,
} from "./reachlib-api";

/** Configure stdlib wallet fallback */
function setLibFallback(opts: any) {
  const { walletFallback, setWalletFallback } = createReachAPI();
  const providerEnv = getProviderEnv();

  setWalletFallback(walletFallback({ ...opts, providerEnv }));
}

/** Configure `stdlib` to fallback to chain's web wallet provider */
export function useWebWallet() {
  const chain = createConnectorAPI();
  localStorage.removeItem("walletconnect");
  return setLibFallback(chain.getWebWalletClientOpts());
}

/** Configure `stdlib` to fallback to `WalletConnect` as wallet provider */
export function useWalletConnect() {
  const chain = createConnectorAPI();
  localStorage.removeItem("user");
  return setLibFallback(chain.getWalletConnectClientOpts());
}

/** Connect user Wallet */
export async function connectUser() {
  const { getDefaultAccount } = createReachAPI();
  try {
    const account: ReachAccount = await getDefaultAccount();
    return hydrateUser(account);
  } catch (e: any) {
    throw e;
  }
}

/** Assert that user (web wallet or `WalletConnect`) session exists */
export function checkSessionExists(): {
  exists: boolean;
  isWCSession: boolean;
  addr: string | null;
} {
  let addr = null;
  const [wc, myalgo]: any[] = [
    localStorage.getItem("walletconnect"),
    localStorage.getItem("user"),
  ];

  if (Array.isArray(wc?.accounts)) addr = wc.accounts[0];
  if (myalgo) addr = myalgo;

  return {
    exists: [myalgo, wc].some((val) => Boolean(val)),
    isWCSession: Boolean(wc),
    addr,
  };
}

/** Disconnect user session */
export function disconnectUser() {
  const chain = createConnectorAPI();
  chain.disconnectUser();
  localStorage.removeItem("user");
  localStorage.removeItem("walletconnect");
  window.location.reload();
}

/** Reconnect user session */
export async function reconnectUser(addr?: string | null) {
  const reach = createReachAPI();
  if (addr) {
    useWebWallet();
    return hydrateUser(await reach.connectAccount({ addr }));
  } else {
    useWalletConnect();
    return hydrateUser(await reach.getDefaultAccount());
  }
}

export type ConnectedUserData = {
  account: ReachAccount;
  address: string;
  balance: string;
  loading: boolean;
} & Record<string, any>;

/** HELPER | Restart user session */
async function hydrateUser(account: ReachAccount): Promise<ConnectedUserData> {
  const reach = createReachAPI();
  const connectorInterface = createConnectorAPI();
  const address = reach.formatAddress(account.getAddress());
  const [bigBal, assetUpdates] = await Promise.all([
    reach.balanceOf(account),
    connectorInterface.loadAssets(account),
  ]);

  persistUser(address);

  // Notify user
  return {
    account,
    address,
    balance: formatCurrency(bigBal),
    loading: false,
    ...assetUpdates,
  };
}

/** HELPER | persist user session details */
async function persistUser(addr: string) {
  if (localStorage.getItem("walletconnect")) return;
  localStorage.setItem("user", addr);
}
