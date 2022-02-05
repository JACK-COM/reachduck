import * as T from "./types";
import { loadInterface } from "./networks/index.networks";
import { trimByteString, formatNumberShort } from "./utils/helpers";
import { NETWORKS, PROVIDERS } from "./constants";

type LoadStdlibFn = { (args: any): any };

/** `StdLib` instance */
const NETWORK_STORAGE_KEY = "active-chain";
const NETWORK_PROVIDER_KEY = "active-prov";
const UNINSTANTIATED = `
QUACK! ReachStdlib is not instantiated. See "@jackcom/reachduck" docs for info.
`;
let reach: T.ReachStdLib;
let connectorInterface: T.ConnectorInterface;

/** Generate an interface for querying an underlying blockchain */
export function createConnectorAPI() {
  // Instantiate Reach object
  if (!connectorInterface) throw new Error(UNINSTANTIATED);
  return connectorInterface;
}

/** Global default reach object */
export function createReachAPI() {
  if (!reach) throw new Error(UNINSTANTIATED);
  return reach;
}

/** Check if an account has opted in to a token. Probably `noOp` outside Algorand */
export async function checkHasToken(acc: T.ReachAccount, token: any) {
  return (await acc.tokenAccepted(token)) || Promise.resolve(false);
}

/** Format address for `networkAccount` instance */
export function formatAddress(acc: T.ReachAccount) {
  return createReachAPI().formatAddress(acc.getAddress());
}

/** Optionally-abbreviated currency formatter (e.g. `fn(1000)` -> `1000` || `1K` ) */
export function formatCurrency(amt: any, decs?: number, abbr = false): string {
  const { connector, formatWithDecimals, lt } = createReachAPI();
  const d = isNaN(Number(decs)) ? NETWORKS[connector].decimals || 1 : decs;
  const reachFmt = formatWithDecimals(amt, d);

  return abbr === true && lt(amt, Number.MAX_SAFE_INTEGER)
    ? formatNumberShort(Number(reachFmt))
    : reachFmt;
}

/** Determine whether app is running on `MainNet` or `TestNet` (default) */
export function getBlockchainNetwork() {
  return (
    localStorage.getItem(NETWORK_PROVIDER_KEY) ||
    selectBlockchainNetwork(PROVIDERS.TESTNET)
  );
}

/**
 * Get last user-saved (or default) network for App. Sets the default
 * to `Algorand` if this is the user's first time in the application.
 */
export function getBlockchain(): string {
  const defaultNetwork = NETWORKS.ALGO.abbr;
  const stored = localStorage.getItem(NETWORK_STORAGE_KEY);
  return stored || selectBlockchain(defaultNetwork);
}

/** Optionally opt-in in to assets */
export async function optInToAsset(acc: T.ReachAccount, tokenId: any) {
  if (await acc.tokenAccepted(tokenId)) return true;

  return acc
    .tokenAccept(tokenId)
    .then(() => true)
    .catch(() => false);
}

/** Get a UI-friendly list of Networks */
export function listSupportedNetworks(): T.NetworkData[] {
  const activeNetwork = getBlockchain();

  return Object.values(NETWORKS).map((val) => ({
    ...val,
    active: val.abbr === activeNetwork,
  }));
}

/** Initialize the stdlib instance */
export function loadReach(loadStdlibFn: LoadStdlibFn) {
  // Instantiate Reach object
  reach = loadStdlibFn({ REACH_CONNECTOR_MODE: getBlockchain() });
  connectorInterface = loadInterface(reach.connector);
  return true;
}

/**
 * Parses a contract address for Algorand or other chains
 * @param {string|number} addr string|number contract address
 * @returns string|number contract address
 */
export function parseAddress(ctc: any) {
  const { isBigNumber, bigNumberToNumber } = createReachAPI();
  const addr = isBigNumber(ctc) ? bigNumberToNumber(ctc) : ctc;
  if (reach.connector === "ALGO") return parseInt(addr);

  const pit = addr.toString().trim().replace(/\0.*$/g, "");
  return pit.startsWith("0x") ? pit : `0x${pit}`;
}

/** Convert `val` to atomic units for the current network */
export function parseCurrency(val: any, dec?: number) {
  const { connector, parseCurrency: parse } = createReachAPI();
  const decimals = isNaN(Number(dec)) ? NETWORKS[connector].decimals || 0 : dec;
  return parse(val, decimals);
}

/** Store user current network selection for App */
export function selectBlockchain(network: string): string {
  localStorage.setItem(NETWORK_STORAGE_KEY, network);
  return network;
}

/**
 * Set network provider preference `MainNet` or `TestNet`.
 * ⚠️ WARNING: Triggers window reload */
export function selectBlockchainNetwork(
  prov: T.NetworkProvider,
  reload = false
): string {
  localStorage.setItem(NETWORK_PROVIDER_KEY, prov);
  if (reload) window.location.reload();
  return prov;
}

/** Get token data and `acc`'s balance of token (if available) */
export async function tokenMetadata(
  token: any,
  acc: T.ReachAccount
): Promise<T.ReachToken> {
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

  return formatTokenMetadata(token, bal, metadata);
}

/* HELPERS */

/** Format token metadata from `tokenMetadata` API request */
function formatTokenMetadata(
  tokenId: any,
  amount: any,
  data: any
): T.ReachToken {
  const id = parseAddress(tokenId);
  const fallbackName = `Asset #${id}`;
  const fallbackSymbol = `#${id}`;

  return {
    id: parseAddress(tokenId),
    name: trimByteString(data.name) || fallbackName,
    symbol: trimByteString((data.symbol || fallbackSymbol).toUpperCase()),
    url: trimByteString(data.url),
    amount,
    supply: data.supply,
    decimals: data.decimals,
    verified: data.verified || false,
  };
}
