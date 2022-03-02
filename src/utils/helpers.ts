export const noOp = () => null;

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
  const lastVersion = localStorage.getItem(APP_VERSION_KEY);
  return currentVersion !== lastVersion;
}

/** App Migration helper: set your current app version */
export function setAppVersion(
  version: string | number,
  APP_VERSION_KEY = "app-version"
) {
  localStorage.setItem(APP_VERSION_KEY, version.toString());
  return version;
}

/**
 * Unwrap a `Maybe` value. When `mVal[0]` is `"Some"`, `mVal[1]` has a value
 */
export type Maybe = [val: "Some" | "None", v?: any | null];
export function fromMaybe(
  mVal: Maybe,
  format = (v: any) => v,
  fallback?: any
): any | null {
  return mVal[0] === "Some" ? format(mVal[1]) : fallback || mVal[1];
}

/** Format currency in user locale (e.g. `fn(1000) -> 1,000) */
export function formatCurrencyLocale(val: number, locale?: any) {
  const intlFmt = Intl.NumberFormat(locale);
  return intlFmt.format(val);
}

/** Abbreviated currency formatter (e.g. `fn(1000)` -> `1K` ) */
export function formatNumberShort(val: number | bigint, decimalPlaces = 2) {
  return formatUnsafeNumber(val.toString(), decimalPlaces);
}

/**
 * Abbreviate arbitrarily large numbers or number strings. Falls back to
 * `formatNumberShort` if the value is small enough.
 */
export function formatUnsafeNumber(val: string | number, round = 2) {
  if (isNaN(Number(val))) return "";

  const parts = val.toString().split(".");
  const ints = parts[0].length;
  if (!ints) return Number(val).toFixed(3);

  // Get number of vals before first 'comma'
  const abbrLength = ints % 3 || ints;
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

/** Assert that `path` represents an Image file */
export function isImageFile(path: string) {
  return /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(path);
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

/**
 * Shortens string to `XXXX...XXXX`, with `XXX` padding determined by optional `pad` parameter
 */
export function truncateString(str: string, pad = 6): string {
  const { length } = str;
  const start = str.substring(0, pad);
  return `${start}...${str.substring(length - pad, length)}`;
}

/** Generates a string with the decimal value of the parsed number in `parts` */
function getDecimals(parts: Intl.NumberFormatPart[], places = 2) {
  if (!places) return "";

  const ints: Intl.NumberFormatPart[] = [];
  const fractions: Intl.NumberFormatPart[] = [];
  parts.forEach((part) => {
    const { type } = part;
    if (type === "integer") ints.push(part);
    else if (type === "fraction") fractions.push(part);
  });

  if (ints.length > 1) return trimDecimals(ints[1].value.substring(0, places));
  if (fractions.length) return trimDecimals(fractions[0].value);
  return "";
}

function trimDecimals(val: string) {
  if (val.replace(/0*/, "") === "") return "";
  return `.${val.replace(/0$/, "")}`;
}
