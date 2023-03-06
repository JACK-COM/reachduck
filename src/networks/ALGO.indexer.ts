import { ReachToken, TxnSearchOpts } from "../types";
import { formatAtomicUnits, trimByteString } from "../utils/helpers";
import { useIndexerClient } from "./ALGO.shared";

export type TokenRawALGO = {
  index: number;
  params: Record<string, any>;
};

/**
 * Lookup an Algorand account by its address
 * @param addr Account address
 * @returns Algorand account information
 */
export async function fetchAssets(addr: string, limit = 10): Promise<any[]> {
  const Indexer = useIndexerClient();
  const result: any = await Indexer.lookupAccountAssets(addr)
    .includeAll(false)
    .limit(limit)
    .do()
    .catch(() => ({ assets: [] }));
  return result.assets;
}

/**
 * Lookup an Algorand account by its address
 * @param addr Account address
 * @returns Algorand account information
 */
export async function fetchAccount(addr: string) {
  const Indexer = useIndexerClient();
  const result: any = await Indexer.lookupAccountByID(addr)
    .includeAll(false)
    .exclude("all")
    .do()
    .catch(fallbackAcct);
  return result.account;
}

/**
 * Get asset given its `id`
 * @param assetId Asset id
 * @returns Asset object
 */
export async function fetchAssetById(
  assetId: number,
  balance = 0
): Promise<ReachToken | null> {
  try {
    const Indexer = useIndexerClient();
    const data = await Indexer.lookupAssetByID(assetId).do();
    if (data.asset) return formatAssetMetadata(data?.asset, balance);
    return null;
  } catch (error: any) {
    return null;
  }
}

/**
 * Search for assets called `assetName`
 * @param name Name target
 * @returns List of assets roughly matching name
 */
export async function searchAssetsByName(name: string): Promise<any[]> {
  try {
    const Indexer = useIndexerClient();
    const assetInfo = await Indexer.searchForAssets().name(name).do();
    return assetInfo?.assets.map((data: TokenRawALGO) =>
      formatAssetMetadata(data)
    );
  } catch (error) {
    return [];
  }
}

/**
 * Search for transactions for `addr`
 * @param addr Account address
 * @param opts Additional search params
 * @param opts.amount Search txns that spent this amount
 * @param opts.minRound Minimum block round to search
 * @param opts.note Txn note
 * @returns Search results
 */
export async function searchForTransactions(
  opts: TxnSearchOpts = {}
): Promise<any> {
  const Indexer = useIndexerClient();
  let searchQuery = Indexer.searchForTransactions();
  const {
    address: addr,
    amount,
    minRound,
    note,
    afterDate,
    beforeDate,
    addressRole,
    nextToken
  } = opts;

  if (addr) {
    searchQuery = searchQuery.address(addr);
    if (addressRole) searchQuery = searchQuery.addressRole(addressRole);
  }
  if (minRound) searchQuery = searchQuery.minRound(Math.max(minRound, 0));
  if (afterDate) searchQuery = searchQuery.afterTime(afterDate);
  if (beforeDate) searchQuery = searchQuery.beforeTime(beforeDate);
  if (nextToken) searchQuery = searchQuery.nextToken(nextToken);
  if (amount) {
    searchQuery = searchQuery
      .currencyGreaterThan(amount - 1)
      .currencyLessThan(amount + 1);
  }
  if (note) {
    const noteenc = new TextEncoder().encode(note);
    searchQuery = searchQuery.notePrefix(noteenc);
  }

  try {
    // Let error fall to "catch"
    const results = await searchQuery.do();
    return results;
  } catch (error) {
    console.log("Search for Txns error:", error);
    return { transactions: [] };
  }
}

/**
 * @internal Create a `ReachToken` object from asset metadata
 * @param asset Asset data
 * @param amount User balance of asset (if available). Defaults to `0`
 * @returns List of assets roughly matching name
 */
export function formatAssetMetadata(
  asset: TokenRawALGO = { index: -1, params: {} },
  amount: number = 0
): ReachToken {
  const { index: id, params } = asset;

  return {
    id,
    amount: formatAtomicUnits(amount, params.decimals),
    decimals: params.decimals,
    name: assetName({ ...params, id }),
    symbol: assetSymbol({ ...params, id }),
    supply: params.total,
    url: params.url,
    verified: params.verified || false
  };
}

function assetName(data: any) {
  const fallback = `Unnamed (${assetSymbol(data)})`;
  if (data.name) return data.name;
  if (data["name-b64"]) return decodeB64String(data["name-b64"]) || fallback;
  return fallback;
}

function assetSymbol(data: any) {
  const fallback = `#${data.id}`;
  if (data["unit-name"]) return data["unit-name"];
  if (data["unit-name-b64"])
    return decodeB64String(data["unit-name-b64"]) || fallback;
  return fallback;
}

function decodeB64String(st: string) {
  return trimByteString(Buffer.from(st, "base64").toString("utf8"));
}

function fallbackAcct(e: any) {
  console.warn("Could not fetch ALGO account", e);
  const emptyAcct = { assets: [], "created-apps": [] };
  return { account: emptyAcct };
}
