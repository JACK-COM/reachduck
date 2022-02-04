import MyAlgoConnect from "@randlabs/myalgo-connect";
import { formatAddress, tokenMetadata } from "../reachlib-api";
import {
  NetworkProvider,
  ConnectorInterface,
  ReachAccount,
  ReachStdLib,
} from "../types";
import {
  fetchAccount,
  searchForTransactions,
  fetchAssetById,
  searchAssetsByName,
} from "./ALGO.indexer";
import { disconnectWC, createWCClient } from "./ALGO.WalletConnect";

export type AlgoProviderEnv = Partial<{
  ALGO_INDEXER_PORT: string;
  ALGO_INDEXER_SERVER: string;
  ALGO_INDEXER_TOKEN: string;
  ALGO_NODE_WRITE_ONLY: string;
  ALGO_PORT: string;
  ALGO_SERVER: string;
  ALGO_TOKEN: string;
}>;

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

const emptyAcct = { assets: [], "created-apps": [] };

/** Fetch account details (assets) */
async function getAccount(address: string): Promise<any> {
  const { account } = await fetchAccount(address);
  return account;
}

function getProviderEnv(
  stdlib: ReachStdLib,
  network: NetworkProvider = "TestNet"
): AlgoProviderEnv {
  const pe = stdlib.providerEnvByName("ALGO");
  const networks: NetworkProvider[] = ["TestNet", "MainNet", "BetaNet"];
  const net = networks.includes(network) ? network.toLowerCase() : "TestNet";
  pe.ALGO_INDEXER_SERVER = `https://algoindexer.${net}.algoexplorerapi.io`;
  return pe;
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
  return { MyAlgoConnect };
}
