import MyAlgoConnect from "@randlabs/myalgo-connect";
import { formatAddress, tokenMetadata } from "../reachlib-api";
import { ReachAccount } from "reach-types";
import { getAccount } from "./ALGO.indexer";
import { disconnectWC, createWCClient } from "./ALGO.WalletConnect";

export const AlgoInterface = {
  disconnectUser: disconnectWC,
  fetchAccount,
  getWalletConnectClientOpts: () => ({
    WalletConnect: function () {
      return createWCClient();
    },
  }),
  getWebWalletClientOpts,
  loadAssets,
};

const emptyAcct = { assets: [], "created-apps": [] };

/** Fetch account details (assets) */
async function fetchAccount(address: string): Promise<any> {
  const { account } = await getAccount(address);
  return account;
}

function fallbackAcct(e: any) {
  console.warn("Could not fetch account", e);
  return emptyAcct;
}

/** Load account assets */
async function loadAssets(acc: ReachAccount) {
  const res = await fetchAccount(formatAddress(acc)).catch(fallbackAcct);
  const { assets = [], "created-apps": apps = [] } = res || emptyAcct;
  const { length } = apps;
  const appsCount: any = { length };
  const plural = appsCount.length === 1 ? "app" : "apps";
  appsCount.description = `${length} ${plural} created`;
  const updates: any = { appsCount };

  if (assets.length) {
    const meta = assets.map((a: any) => tokenMetadata(a["asset-id"], acc));
    updates.allAssets = await Promise.all(meta);
  } else updates.allAssets = [];

  return updates;
}

/** Enable `MyAlgoConnect` use by stdlib */
function getWebWalletClientOpts() {
  return { MyAlgoConnect };
}
