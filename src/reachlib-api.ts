import { NetworkData, ReachAccount, ReachStdLib, ReachToken } from "./types";
import { loadInterface, ConnectorInterface } from "./networks/index.networks";
import { trimByteString } from "./utils/helpers";
import { NETWORKS, PROVIDERS } from "./constants";

/** `StdLib` instance */
const NETWORK_STORAGE_KEY = "active-chain";
const NETWORK_PROVIDER_KEY = "active-prov";
let reach: ReachStdLib;
let connectorInterface: ConnectorInterface;

/** Global default reach object */
export function createReachAPI() {
  if (!reach) throw new Error("ReachStdlib is not instantiated");
  return reach;
}

type LoadStdlibFn = { (args: any): ReachStdLib };

export function loadReach(loadStdlibFn: LoadStdlibFn) {
  // Instantiate Reach object
  reach = loadStdlibFn({ REACH_CONNECTOR_MODE: getCurrentNetwork() });
  connectorInterface = loadInterface(reach.connector);
  return true;
}

export function createConnectorAPI() {
  // Instantiate Reach object
  if (!connectorInterface) throw new Error("ReachStdlib is not instantiated");
  return connectorInterface;
}

/** Returns Configured Provider Environment (with e.g. AlgoIndexer and
 * AlgoDaemon urls etc) */
export function getProviderEnv() {
  const pe = createReachAPI().providerEnvByName(getNetworkProvider());
  pe.ALGO_INDEXER_SERVER = "https://algoindexer.testnet.algoexplorerapi.io";
  return pe;
}

export function formatCurrency(
  amount: any,
  decimals?: number,
  abbr = false
): string {
  const { connector, formatWithDecimals, lt } = createReachAPI();
  const defaultDecs = NETWORKS[connector].decimals || 1;
  const reachFmt = isNaN(Number(decimals))
    ? formatWithDecimals(amount, defaultDecs)
    : formatWithDecimals(amount, decimals);

  return abbr && lt(amount, Number.MAX_SAFE_INTEGER)
    ? formatCurrencyShort(Number(reachFmt))
    : reachFmt;
}

export function formatCurrencyShort(val: number, decimalPlaces = 2) {
  // Generate a number abbreviation
  const numberAbbr = (grpCount: number) => {
    if (Number.isNaN(grpCount) || !grpCount) return "";
    // This should return e1[N]
    if (grpCount >= 4) return "!";

    const abbrs = ["", "K", "M", "B", "T"];
    return abbrs[grpCount];
  };

  const parts = Intl.NumberFormat().formatToParts(val);
  const groups = parts.filter((p) => p.type === "group").length;
  const int = parts[0].value;
  // Note: can dig into parts to generate decimals (e.g. 10.1K)
  return `${int}${getDecimals(parts, decimalPlaces)}${numberAbbr(groups)}`;
}

function getDecimals(parts: Intl.NumberFormatPart[], places = 2) {
  if (!places) return "";

  const ints: Intl.NumberFormatPart[] = [];
  const fractions: Intl.NumberFormatPart[] = [];
  parts.forEach((part) => {
    const { type } = part;
    if (type === "integer") ints.push(part);
    else if (type === "fraction") fractions.push(part);
  });

  let abbr = "";
  if (ints.length > 1) {
    const d = ints[1].value;
    abbr = d.substring(0, places);
  } else if (fractions.length) abbr = fractions[0].value;

  if (abbr.replaceAll("0", "") === "") return "";
  return `.${abbr}`;
}

/** Convert `val` to atomic units for the current network */
export function parseCurrency(val: any, dec?: number) {
  const { connector, parseCurrency: parse } = createReachAPI();
  const decimals = isNaN(Number(dec)) ? NETWORKS[connector].decimals || 0 : dec;
  return parse(val, decimals);
}

/** Optionally opt-in in to assets */
export async function inlineAssetOptIn(acc: ReachAccount, tokenId: any) {
  if (await acc.tokenAccepted(tokenId)) return true;

  return acc
    .tokenAccept(tokenId)
    .then(() => true)
    .catch(() => false);
}

/** Format address for `networkAccount` instance */
export function formatAddress(acc: ReachAccount) {
  return createReachAPI().formatAddress(acc.getAddress());
}

function formatTokenMetadata(tokenId: any, amount: any, data: any): ReachToken {
  const id = parseContractAddress(tokenId);
  const fallbackName = `Asset #${id}`;
  const fallbackSymbol = `#${id}`;
  const { isBigNumber, bigNumberToNumber } = createReachAPI();
  const shrink = (v: any) => {
    try {
      return isBigNumber(v) ? bigNumberToNumber(v) : v;
    } catch (error) {
      return 0;
    }
  };

  return {
    id: parseContractAddress(tokenId),
    name: trimByteString(data.name) || fallbackName,
    symbol: trimByteString((data.symbol || fallbackSymbol).toUpperCase()),
    url: trimByteString(data.url),
    amount: shrink(amount),
    supply: shrink(data.supply),
    decimals: shrink(data.decimals),
  };
}

/** Get a UI-friendly list of Networks */
export function listSupportedNetworks(): NetworkData[] {
  const activeNetwork = getCurrentNetwork();

  return Object.values(NETWORKS).map((val) => ({
    ...val,
    active: val.abbr === activeNetwork,
  }));
}

/** Determine whether app is running on `MainNet` or `TestNet` (default) */
export function getNetworkProvider() {
  return (
    localStorage.getItem(NETWORK_PROVIDER_KEY) ||
    setNetworkProvider(PROVIDERS.TESTNET)
  );
}

/** Set network provider preference `MainNet` or `TestNet` */
export function setNetworkProvider(prov: "MainNet" | "TestNet") {
  localStorage.setItem(NETWORK_PROVIDER_KEY, prov);
  return prov;
}

/**
 * Parses a contract address for Algorand or other chains
 * @param {string|number} addr string|number contract address
 * @returns string|number contract address
 */
export function parseContractAddress(ctc: any) {
  const { isBigNumber, bigNumberToNumber } = createReachAPI();
  const addr = isBigNumber(ctc) ? bigNumberToNumber(ctc) : ctc;
  if (reach.connector === "ALGO") return parseInt(addr);

  const pit = addr.toString().trim().replace(/\0.*$/g, "");
  return pit.startsWith("0x") ? pit : `0x${pit}`;
}

export async function tokenMetadata(
  token: any,
  acc: ReachAccount
): Promise<ReachToken> {
  const { balanceOf } = createReachAPI();
  const fetchToken = () =>
    acc
      .tokenMetadata(token)
      .then((md: any) => formatTokenMetadata(token, 0, md))
      .catch(() => undefined);

  const [metadata, bal] = await Promise.all([
    fetchToken(),
    balanceOf(acc, token).catch(() => 0),
  ]);

  if (!metadata) throw new Error("Token not found");

  return metadata?.id
    ? { ...metadata, amount: bal }
    : formatTokenMetadata(token, bal, metadata);
}

/**
 * Get last user-saved (or default) network for App. Sets the default
 * to `Algorand` if this is the user's first time in the application.
 */
export function getCurrentNetwork(): string {
  const defaultNetwork = NETWORKS.ALGO.abbr;
  const stored = localStorage.getItem(NETWORK_STORAGE_KEY);
  return stored || setCurrentNetwork(defaultNetwork);
}

/** Store user network selection for App */
export function setCurrentNetwork(network: string): string {
  localStorage.setItem(NETWORK_STORAGE_KEY, network);
  return network;
}
