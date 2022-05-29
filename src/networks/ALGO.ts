import { ReachToken, AccountAssetData } from "../types";
import {
  fetchAccount,
  fetchAssetById,
  getProviderEnv,
  searchForTransactions,
  searchAssetsByName,
  fetchAssets,
} from "./ALGO.indexer";

export const AlgoInterface = {
  fetchAccount: getAccount,
  fetchAssetById,
  searchAssetsByName,
  getProviderEnv,
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
async function loadAssets(addr: string, limit = 10): Promise<AccountAssetData> {
  // Legacy data
  const length = 0;
  const appsCount = { length, description: `${length} apps fetched` };
  const updates = { appsCount, assets: [] as (ReachToken | null)[] };

  const assets = await fetchAssets(addr, limit);
  if (assets.length) {
    // Fetch asset metadata
    const meta: Promise<ReachToken | null>[] = [];
    assets.forEach((a: any) =>
      meta.push(fetchAssetById(a["asset-id"], a.amount))
    );
    const resolved = await Promise.all(meta);
    updates.assets = resolved;
  } else updates.assets = [];
  return updates;
}
