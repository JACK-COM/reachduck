import { ReachAccount } from "./types";
import { createConnectorAPI } from "./networks/index.networks";
import { formatAtomicUnits, getStorage, isBrowser } from "./utils/helpers";
import { createReachAPI } from "./reach/reachlib-core";

export type ConnectUserOpts = {
  fetchAssets?: boolean;
  fetchBalance?: boolean;
  initialAssetsLimit?: number;
};
const DEFAULT_CONNECT_OPTS: ConnectUserOpts = {
  fetchAssets: true,
  fetchBalance: true,
  initialAssetsLimit: 10
};

/** Connect user Wallet */
export async function connectUser(connectOpts?: ConnectUserOpts) {
  const { getDefaultAccount } = createReachAPI();
  const opts = connectOpts || DEFAULT_CONNECT_OPTS;
  try {
    const account: ReachAccount = await getDefaultAccount();
    return hydrateUser(account, opts);
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
  const storage = getStorage();
  const [wc, myalgo]: any[] = [
    storage.getItem("walletconnect"),
    storage.getItem("user")
  ];

  if (Array.isArray(wc?.accounts)) addr = wc.accounts[0];
  if (myalgo) addr = myalgo;

  return {
    exists: [myalgo, wc].some((val) => Boolean(val)),
    isWCSession: Boolean(wc),
    addr
  };
}

/** Disconnect user session */
export function disconnectUser() {
  const storage = getStorage();
  storage.removeItem("user");
  storage.removeItem("walletconnect");
  if (isBrowser()) window?.location.reload();
}

/** Reconnect user session */
export async function reconnectUser(
  persisted?: string | null,
  connectOpts?: ConnectUserOpts
) {
  const stdlib = createReachAPI();
  const addr = persisted || checkSessionExists().addr;
  const opts = connectOpts || DEFAULT_CONNECT_OPTS;
  const acc = addr
    ? await stdlib.connectAccount({ addr })
    : await stdlib.getDefaultAccount();
  return hydrateUser(acc, opts);
}

export type ConnectedUserData = {
  account: ReachAccount;
  address: string;
  balance: string;
} & Record<string, any>;

/** HELPER | Restart user session */
async function hydrateUser(
  acc: ReachAccount,
  opts: ConnectUserOpts
): Promise<ConnectedUserData> {
  const { fetchAssets, fetchBalance, initialAssetsLimit = 10 } = opts;
  const { balanceOf, formatAddress } = createReachAPI();
  const chain = createConnectorAPI();
  const address = formatAddress(acc);
  const [bigBal, assets] = await Promise.all([
    fetchBalance ? formatAtomicUnits(await balanceOf(acc), chain.decimals) : 0,
    fetchAssets ? chain.loadAssets(address, initialAssetsLimit) : []
  ]);

  persistUser(address);

  // Notify user
  return { account: acc, address, balance: bigBal, ...assets };
}

/** HELPER | persist user session details */
async function persistUser(addr: string) {
  const storage = getStorage();
  if (storage.getItem("walletconnect")) return;
  storage.setItem("user", addr);
}
