import * as T from "../types";
import { createConnectorAPI, NETWORKS } from "../networks/index.networks";
import { trimByteString, formatNumberShort, isNetworkToken } from "../utils/helpers";
import { getBlockchain } from "../storage";
import { createReachAPI } from "./reachlib-core";

/**
 * @reach_helper Check if an account has opted in to a token. Probably `noOp` outside Algorand */
export async function checkHasToken(acc: T.ReachAccount, token: any) {
  return (await acc.tokenAccepted(token)) || Promise.resolve(false);
}

/**
 * @reach_helper Format address for `networkAccount` instance */
export function formatAddress(acc: T.ReachAccount | string) {
  return createReachAPI().formatAddress(acc);
}

/**
 * @reach_helper Optionally-abbreviated currency formatter (e.g. `fn(1000)` -> `1000` || `1K` ). Expects `amt` to be in atomic unit for network */
export function formatCurrency(amt: any, decs?: number, abbr = false): string {
  const { formatWithDecimals } = createReachAPI();
  const decimals = parseNetworkDecimals(
    Number(decs || NETWORKS[getBlockchain()].decimals)
  );
  const reachFmt = formatWithDecimals(amt, decimals);
  return abbr ? formatNumberShort(reachFmt) : reachFmt;
}

/**
 * @reach_helper Optionally opt-in in to assets */
export async function optInToAsset(acc: T.ReachAccount, tokenId: any) {
  if (await acc.tokenAccepted(tokenId)) return Promise.resolve(true);

  return acc
    .tokenAccept(tokenId)
    .then(() => true)
    .catch(() => false);
}

/**
 * Create a user-friendly address from an encoded value.
 * @param ctc string|number contract address
 * @returns {string|number} `number` on Algorand; otherwise `string`
 */
export function parseAddress(ctc: any): string | number {
  const { isBigNumber, bigNumberToNumber } = createReachAPI();
  const addr = isBigNumber(ctc) ? bigNumberToNumber(ctc) : ctc;
  if (getBlockchain() === "ALGO") return parseInt(addr);

  const pit = addr.toString().trim().replace(/\0.*$/g, "");
  return pit.startsWith("0x") ? pit : `0x${pit}`;
}

/** @reach_helper Convert `val` to atomic units for the current network */
export function parseCurrency(val: any, dec?: number) {
  const safeDec =
    dec === undefined || dec === null
      ? NETWORKS[getBlockchain()].decimals
      : dec;
  const decimals = parseNetworkDecimals(Number(safeDec));
  return createReachAPI().parseCurrency(val, decimals);
}

/** @reach_helper Create a "network token" representing the current chain */
export function makeNetworkToken(chain?: T.ChainSymbol): T.ReachToken {
  const name = chain || getBlockchain();
  return {
    id: "0",
    name,
    symbol: name,
    url: "",
    decimals: NETWORKS[name].decimals as number,
    supply: "0",
    verified: true,
    verificationTier: "trusted"
  };
}

/**
 * @reach_helper Get token data and `acc`'s balance of token (if available) */
export async function tokenMetadata(
  tokenId: any,
  acc: T.ReachAccount
): Promise<T.ReachToken> {
  const { balanceOf } = createReachAPI();
  const networkToken = isNetworkToken(tokenId)
  const onAlgo = getBlockchain() === "ALGO"
  const fetchBalance = () => {
    const fn = networkToken ? balanceOf(acc) : balanceOf(acc, tokenId)
    return onAlgo ? withTimeout(fn) : Promise.resolve(0);
  };
  const fetchToken = () => {
    if (networkToken) return makeNetworkToken();

    if (onAlgo) {
      const chain = createConnectorAPI();
      return withTimeout(chain.fetchAssetById(tokenId), null);
    }

    return acc.tokenMetadata(tokenId);
  };
  const [metadata, bal] = await Promise.all([fetchToken(), fetchBalance()]);
  if (!metadata) throw new Error(`Token "${tokenId}" not found`);

  return formatReachToken(tokenId, bal, metadata);
}

/* INTERNAL */

// HELPER | cancel request if it takes too long
export async function withTimeout<T>(
  request: Promise<T> | (() => Promise<T>),
  fallback = null,
  timeout = 3500
): Promise<T | null> {
  return new Promise(async (resolve) => {
    const call = typeof request === "function";
    const cancel = () => resolve(fallback);
    setTimeout(cancel, timeout);
    const d = call ? await request() : await request;

    resolve(d);
  });
}

/**
 * @internal
 * Format token metadata from `tokenMetadata` API request */
function formatReachToken(tokenId: any, amount: any, data: any): T.ReachToken {
  const id = parseAddress(tokenId);
  const fallbackName = `Asset #${id}`;
  const symbol = data.symbol ? trimByteString(data.symbol) : `#${id}`;

  return {
    id: parseAddress(tokenId),
    name: trimByteString(data.name) || fallbackName,
    symbol,
    url: trimByteString(data.url),
    amount,
    supply: data.supply,
    decimals: data.decimals,
    verified: data.verified || false
  };
}

/**
 * @internal
 * @param decimals
 */
function parseNetworkDecimals(decimals?: number) {
  if (decimals === undefined || decimals === null) {
    const key = getBlockchain();
    return NETWORKS[key].decimals || 0;
  }

  return decimals;
}
