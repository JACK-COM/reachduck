import { ReachToken, AccountAssetData } from "../types";
import { getProviderEnv } from "./ALGO.shared";
import {
  fetchAccount,
  fetchAssetById,
  searchForTransactions,
  searchAssetsByName,
  fetchAssets
} from "./ALGO.indexer";
import { generateAccount } from "./ALGO.shared";

export * from "./ALGO.shared";

export const AlgoInterface = {
  createAccount: generateAccount,
  /** Fetch account details (assets) */
  fetchAccount: async function _fetchAccount(address: string): Promise<any> {
    const { account } = await fetchAccount(address);
    return account;
  },
  fetchAssetById,
  getProviderEnv,
  /** Load account assets */
  loadAssets: async function loadAssets_(
    addr: string,
    limit = 10
  ): Promise<AccountAssetData> {
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
  },
  searchAssetsByName,
  searchForTransactions
};

export default AlgoInterface;
