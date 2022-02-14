import { Indexer } from "algosdk";
import { ReachToken } from "../types";

type TxnSearchOpts = {
  amount?: number;
  minRound?: number;
  note?: string;
};
type AlgoProviderNetwork = "MainNet" | "TestNet" | "BetaNet";
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

/** @private Algorand Indexer instance (for querying the chain) */
const networks: AlgoProviderNetwork[] = ["TestNet", "BetaNet", "MainNet"];
const TK = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
let indexer: Indexer;
let network: AlgoProviderNetwork = "TestNet";
let reachProviderEnv: AlgoProviderEnv;

/**
 * @description Get Algo indexer client instance
 * @returns Algo Indexer client
 */
export function useIndexerClient(): Indexer {
  if (!indexer) {
    resetProvider();
    const { ALGO_INDEXER_SERVER } = getProviderEnv(network);
    const ixURL = new URL(ALGO_INDEXER_SERVER);
    indexer = new Indexer(TK, ALGO_INDEXER_SERVER, ixURL.port);
  }

  return indexer;
}

/**
 * Lookup an Algorand account by its address
 * @param addr Account address
 * @returns Algorand account information
 */
export async function fetchAccount(addr: string) {
  const Indexer = useIndexerClient();
  const result: any = await Indexer.lookupAccountByID(addr)
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
): Promise<ReachToken> {
  try {
    const Indexer = useIndexerClient();
    const data = await Indexer.lookupAssetByID(assetId).do();
    return formatAssetMetadata(data?.asset, balance);
  } catch (error: any) {
    return {} as ReachToken;
  }
}

/** Generate a `providerEnv` for stdlib */
export function getProviderEnv(
  providerNetwork: AlgoProviderNetwork = "TestNet"
): AlgoProviderEnv {
  const valid = networks.includes(providerNetwork)
    ? providerNetwork
    : networks[0];
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
    return assetInfo?.assets;
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
 * Search for assets called `assetName`
 * @param assetName Name target
 * @returns List of assets roughly matching name
 */
function formatAssetMetadata(
  asset: any = { params: {} },
  amount: number
): ReachToken {
  const { index: id, params } = asset;

  return {
    id,
    amount,
    decimals: params.decimals,
    name: params.name || `(${id})`,
    symbol: params['unit-name'] || `#${id}`,
    supply: params.total,
    url: params.url,
    verified: params.verified || false,
  };
}

/** Store initial provider settings */
function resetProvider(prov: AlgoProviderNetwork = "TestNet") {
  const key = prov.toLowerCase();
  network = prov;
  reachProviderEnv = {
    ALGO_SERVER: "https://testnet.algoexplorerapi.io",
    // ALGO_SERVER: `https://node.${key}.algoexplorerapi.io`,
    ALGO_PORT: "",
    ALGO_TOKEN: TK,
    ALGO_INDEXER_SERVER: `https://algoindexer.${key}.algoexplorerapi.io`,
    ALGO_INDEXER_PORT: "",
    ALGO_INDEXER_TOKEN: TK,
    REACH_ISOLATED_NETWORK: "no",
  };
}
