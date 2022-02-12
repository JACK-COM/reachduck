import MyAlgoConnect from "@randlabs/myalgo-connect";
import { ConnectorInterface, getBlockchainNetwork } from "..";
import {
  fetchAccount,
  fetchAssetById,
  getProviderEnv,
  searchForTransactions,
  searchAssetsByName,
} from "./ALGO.indexer";
import { disconnectWC, createWCClient } from "./ALGO.WalletConnect";

export const AlgoInterface: ConnectorInterface = {
  disconnectUser: disconnectWC,
  fetchAccount: getAccount,
  fetchAssetById,
  searchAssetsByName,
  getProviderEnv,
  getWalletConnectClientOpts,
  getWebWalletClientOpts,
  loadAssets,
  searchForTransactions,
};

export default AlgoInterface;

/** Fetch account details (assets) */
async function getAccount(address: string): Promise<any> {
  const { account } = await fetchAccount(address);
  return account;
}

/** Load account assets */
async function loadAssets(addr: string) {
  const res = await fetchAccount(addr);
  const { assets = [], "created-apps": apps = [] } = res;
  const { length } = apps;
  const appsCount: any = { length };
  const plural = appsCount.length === 1 ? "app" : "apps";
  appsCount.description = `${length} ${plural} created`;
  const updates: any = { appsCount };

  if (assets.length) {
    const meta = assets.map((a: any) =>
      fetchAssetById(a["asset-id"], a.amount)
    );
    updates.assets = await Promise.all(meta);
  } else updates.assets = [];

  return updates;
}

function getWalletConnectClientOpts() {
  return {
    WalletConnect: function () {
      return createWCClient();
    },
  };
}

/** Enable `MyAlgoConnect` use by stdlib */
function getWebWalletClientOpts() {
  return {
    MyAlgoConnect,
  };
}
