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

export type ProviderEnv = { REACH_ISOLATED_NETWORK?: string };
export type AlgoProviderEnv = Partial<{
  ALGO_INDEXER_PORT: string;
  ALGO_INDEXER_SERVER: string;
  ALGO_INDEXER_TOKEN: string;
  ALGO_NODE_WRITE_ONLY: string;
  ALGO_PORT: string;
  ALGO_SERVER: string;
  ALGO_TOKEN: string;
}> &
  ProviderEnv;

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

const TK = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const defaultProviderEnv = (n: NetworkProvider) => {
  const networks: NetworkProvider[] = ["TestNet", "BetaNet", "MainNet"];
  const net = (networks.includes(n) ? n : networks[0]).toLowerCase();
  return {
    ALGO_SERVER: "https://node.testnet.algoexplorerapi.io",
    ALGO_PORT: "",
    ALGO_TOKEN: TK,
    ALGO_INDEXER_SERVER: `https://algoindexer.${net}.algoexplorerapi.io`,
    ALGO_INDEXER_PORT: "",
    ALGO_INDEXER_TOKEN: TK,
    REACH_ISOLATED_NETWORK: "no",
  };
};

function getProviderEnv(
  reach: ReachStdLib,
  net: NetworkProvider = "TestNet"
): AlgoProviderEnv {
  return reach.providerEnvByName(net) || defaultProviderEnv(net);
}

/** Load account assets */
async function loadAssets(acc: ReachAccount) {
  const res = await fetchAccount(formatAddress(acc));
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
  return { MyAlgoConnect };
}
