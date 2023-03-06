import { Maybe } from "../types";

export const noOp = () => null;

/** Check if running in a browser or cli context */
export const isBrowser = new Function(
  "try { return this === window } catch(e) { return false; }"
);

/** In-memory `localStorage` fallback object for non-browser contexts */
let STORE: Storage;
/** In-memory `localStorage` fallback object for non-browser contexts */
export function getStorage() {
  if (!STORE) {
    STORE = isBrowser() ? window?.localStorage : createMemoryStorage();
  }

  return STORE;
}

/** Create a key-value stub for localStorage */
function createMemoryStorage(): Storage {
  let data: Record<string, any> = {};

  return {
    clear: () => (data = {}),

    getItem: (key: string) => data[key] || null,

    key(keyIndex: number) {
      return Object.keys(data)[keyIndex] || null;
    },

    get length() {
      return Object.keys(data).length;
    },

    removeItem(key: string) {
      delete data[key];
    },

    setItem(key: string, value: any) {
      data[key] = value;
    }
  };
}

// Generate a number abbreviation
export function abbrevNumber(numOfGroups: number) {
  if (Number.isNaN(numOfGroups) || !numOfGroups) return "";
  const ab = ["K", "M", "B", "T", "Qa", "Qi", "Si", "Se", "O", "N", "D"];
  if (numOfGroups >= ab.length) return "!";
  return ab[numOfGroups - 1];
}

/** Copy `val` to user's keyboard */
export async function copyToClipboard(val: string) {
  return navigator?.clipboard?.writeText(val);
}

/** App Migration helper: check if your app version has changed */
export function checkVersionChanged(
  currentVersion: string | number,
  APP_VERSION_KEY = "app-version"
) {
  const storage = getStorage();
  const lastVersion = storage.getItem(APP_VERSION_KEY);
  return currentVersion !== lastVersion;
}

/** App Migration helper: set your current app version */
export function setAppVersion(
  version: string | number,
  APP_VERSION_KEY = "app-version"
) {
  getStorage().setItem(APP_VERSION_KEY, version.toString());
  return version;
}

/** Create a `Maybe` value that resolves to `null` */
export function asMaybeNone(): Maybe<null> {
  return ["None", null];
}

/** Wrap `val` as a `Maybe` value-type */
export function asMaybe<T extends any>(val?: T): Maybe<T> {
  // Treat `0` as a truthy value
  if (val === 0) return ["Some", val];
  if (!val || isNone(val)) return ["None", null];
  return ["Some", val as T];
}

/** @untestable Reads and returns an input argument from command line args */
export function fromArgs(k: string, fallback = "") {
  const args = process?.argv || [];
  const key = `${k.replace(/=$/, "")}=`;
  const arg = args.find((a) => a.startsWith(key)) || key;
  return arg.replace(key, "") || fallback;
}

/** Resolve a `Maybe` value. When `mVal[0]` is `"Some"`, `mVal[1]` has a value */
export function fromMaybe<T>(
  mVal: Maybe<T>,
  format = (v: T) => v,
  fallback?: any
): T | null {
  if (isNone(mVal)) return fallback || mVal[1];
  const fmt = mVal[1] === null ? mVal[1] : (format(mVal[1]) as T);
  return fmt;
}

/** Format currency in user locale (e.g. `fn(1000) -> 1,000) */
export function formatCurrencyLocale(
  val: number,
  locale?: string,
  currency?: string
) {
  const intlFmt =
    locale && currency
      ? Intl.NumberFormat(locale, { style: "currency", currency })
      : Intl.NumberFormat(locale);
  return intlFmt.format(val);
}

/** Format arbitrarily large numbers or number strings. (e.g. `fn(1000)` -> `1K` ) */
export function formatNumberShort(val: string | number | bigint, round = 2) {
  if (isNaN(Number(val))) return "";

  const parts = val.toString().split(".");
  const ints = parts[0].length;

  if (!ints || ints <= 3)
    return trimTrailingChar(parseFloat(val.toString()).toFixed(round));

  // Get number of vals before first 'comma'
  const abbrLength = ints % 3 || 3;
  const abbr = parts[0].substring(0, abbrLength) || parts[0];
  const rest = parts[0].substring(abbrLength);
  const restDecs = rest.substring(0, round);
  const grouper = new RegExp(/[0-9]{3}/g);
  const groups = [];
  const i = rest.matchAll(grouper);
  let n = i.next();
  if (!n.done) {
    do {
      groups.push(n.value[0]);
      n = i.next();
    } while (!n.done);
  }

  let decimals = trimDecimals(restDecs);
  if (abbrLength === ints) decimals = trimDecimals(parts[1] || restDecs);
  const out = `${abbr}${decimals}${abbrevNumber(groups.length)}`;

  return out;
}

/**
 * Format an atomic currency value
 * @param amt number to format
 * @param decs number of decimal digits on the right
 * @returns formatted value
 * @example formatAtomicUnits('1.00'); // => '1'
 */
export function formatAtomicUnits(
  amt: number | string | bigint,
  decs: number = 6
): string {
  const splitValue = decs;
  if (!(Number.isInteger(decs) || 0 < decs)) {
    throw Error(`Invalid decimal value "${decs}"`);
  }

  const aStr = amt.toString();
  if (aStr.includes(".")) {
    const nVal = Number(aStr) / 10 ** decs;
    return trimTrailingChar(nVal.toFixed(decs));
  }

  const split = Math.max(aStr.length - splitValue, 0);
  const left = trimLeadingChar(aStr.slice(0, split)) || "0";
  if (decs === 0) return left;

  const padLeading = (str: string, chr: string, length: number) =>
    `${chr.repeat(Math.max(length - str.length, 0))}${str}`;
  const rSliced = padLeading(aStr.slice(split), "0", splitValue).slice(0, decs);
  const right = trimTrailingChar(rSliced);

  return right ? `${left}.${right}` : left;
}

/** Assert that `path` represents an Image file */
export function isImageFile(path: string) {
  return /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(path);
}

/** Assert that `val` represents a falsy `Maybe` value */
export function isNone(val: any = null) {
  return isMaybe(val) && val[0] === "None" && val[1] === null;
}

/** Assert that `val` represents a truthy `Maybe` value */
export function isSome(val: any = null) {
  return isMaybe(val) && val[0] === "Some";
}

/** Assert that `val` represents a `Maybe` value */
export function isMaybe(val: any = null) {
  const isValidArray = Array.isArray(val) && val.length === 2;
  const hasSomeOrNone = isValidArray && ["Some", "None"].includes(val[0]);
  return isValidArray && hasSomeOrNone;
}

/** Assert that `tokenId` represents a network token id */
export function isNetworkToken(tokenId: string | number | null = "") {
  return [0, "0", null].includes(tokenId);
}

/** Assert that `path` represents a Video file */
export function isVideoFile(path: string) {
  return /\.(mov|mp4|mpe?g|mkv|avi|webm|wmv)$/i.test(path);
}

/**
 * Strip `\u0000` characters from byte string
 * @param {stringn} str String with empty `\0000` characters to remove
 * @returns
 */
export function trimByteString(str: string = ""): string {
  return str.replace(/\0/g, "");
}

/** Shortens string to `XXXX...XXXX`; padding determined by optional `pad` parameter */
export function truncateString(str: string, pad = 6): string {
  const { length } = str;
  const start = str.substring(0, pad);
  return `${start}...${str.substring(length - pad, length)}`;
}

/** Helper: trim decimals from numeric string */
export function trimDecimals(val: string) {
  if (val.replace(/0*/, "") === "") return "";
  return `.${trimTrailingChar(val)}`;
}

/**
 * Helper: trim leading character (usually zeros) from string
 * @example trimLeadingZeros('001'); // => '1'
 */
export function trimLeadingChar(val: string, ch: string | number = 0) {
  const target = new RegExp("\\b" + ch + "*");
  return val.replace(target, "").replace(/\.$/, "");
}

/**
 * Helper: trim trailing character (usually zeros) from string
 * @example trimTrailingZeros('1.00'); // => '1'
 */
export function trimTrailingChar(val: string, ch: string | number = 0) {
  const target = new RegExp(ch + "*$\\b");
  return val.replace(target, "").replace(/\.$/, "");
}
