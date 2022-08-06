import { Indexer } from "algosdk";
import { formatCurrency, parseCurrency } from "../reachlib-api";
import { getBlockchainNetwork } from "../storage";
import { ReachToken, NetworkProvider } from "../types";
import { trimByteString } from "../utils/helpers";

type TxnSearchOpts = {
  amount?: number;
  minRound?: number;
  note?: string;
};
type AlgoProviderEnv = {
  ALGO_INDEXER_PORT?: string;
  ALGO_INDEXER_SERVER: string;
  ALGO_INDEXER_TOKEN?: string;
  ALGO_NODE_WRITE_ONLY?: string;
  ALGO_PORT?: string;
  ALGO_SERVER: string;
  ALGO_TOKEN?: string;
  REACH_ISOLATED_NETWORK?: string;
};
type TokenRaw = {
  index: number;
  params: Record<string, any>;
};

/** @private Algorand Indexer instance (for querying the chain) */
const networks: NetworkProvider[] = ["TestNet", "BetaNet", "MainNet"];
const TOKEN = "";
let indexer: Indexer;
let network: NetworkProvider = "TestNet";
let reachProviderEnv: AlgoProviderEnv;

/**
 * @description Get Algo indexer client instance
 * @returns Algo Indexer client
 */
export function useIndexerClient(): Indexer {
  if (!indexer) {
    resetProvider(getBlockchainNetwork() as NetworkProvider);
    const { ALGO_INDEXER_SERVER } = getProviderEnv(network);
    const ixURL = new URL(ALGO_INDEXER_SERVER);
    indexer = new Indexer(TOKEN, ALGO_INDEXER_SERVER, ixURL.port);
  }

  return indexer;
}

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

/** Generate a `providerEnv` for stdlib */
export function getProviderEnv(
  net: NetworkProvider = "TestNet"
): AlgoProviderEnv {
  const valid = networks.includes(net) ? net : networks[0];
  if (!reachProviderEnv) resetProvider(valid);
  return reachProviderEnv;
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
    return assetInfo?.assets.map((data: TokenRaw) => formatAssetMetadata(data));
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
  addr: string,
  opts: TxnSearchOpts = {}
): Promise<any> {
  try {
    const Indexer = useIndexerClient();
    const { amount, minRound, note } = opts;
    let searchQuery = Indexer.searchForTransactions().address(addr);

    if (note) {
      const enc = new TextEncoder();
      const noteenc = enc.encode(note);
      searchQuery = searchQuery.notePrefix(noteenc);
    }

    if (amount) {
      searchQuery = searchQuery
        .currencyGreaterThan(amount - 1)
        .currencyLessThan(amount + 1);
    }

    if (minRound) {
      searchQuery = searchQuery.minRound(Math.max(minRound, 0));
    }

    const searchResults = await searchQuery.do();
    return searchResults;
  } catch (error) {
    return [];
  }
}

function fallbackAcct(e: any) {
  console.warn("Could not fetch ALGO account", e);
  const emptyAcct = { assets: [], "created-apps": [] };
  return { account: emptyAcct };
}

/**
 * @internal Create a `ReachToken` object from asset metadata
 * @param asset Asset data
 * @param amount User balance of asset (if available). Defaults to `0`
 * @returns List of assets roughly matching name
 */
export function formatAssetMetadata(
  asset: TokenRaw = { index: -1, params: {} },
  amount: number = 0
): ReachToken {
  const { index: id, params } = asset;

  return {
    id,
    amount: formatCurrency(amount, params.decimals),
    decimals: params.decimals,
    name: assetName({ ...params, id }),
    symbol: assetSymbol({ ...params, id }),
    supply: params.total,
    url: params.url,
    verified: params.verified || false,
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

/** Store initial provider settings */
function resetProvider(prov: NetworkProvider = "TestNet") {
  const key = prov.toLowerCase();
  network = prov;
  reachProviderEnv = {
    // Switched to AlgoNode (Free: 50 req/s per IP),
    ALGO_SERVER: `https://${key}-api.algonode.cloud`,
    ALGO_PORT: "",
    ALGO_TOKEN: TOKEN,
    ALGO_INDEXER_SERVER: `https://${key}-idx.algonode.cloud`,
    ALGO_INDEXER_PORT: "",
    ALGO_INDEXER_TOKEN: TOKEN,
    REACH_ISOLATED_NETWORK: "no",
  };
}
