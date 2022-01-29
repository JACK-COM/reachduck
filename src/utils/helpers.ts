export const noOp = () => null;

/** Copy `val` to user's keyboard */
export async function copyToClipboard(val: string) {
  return navigator.clipboard.writeText(val);
}

/**
 * Unwrap a `Maybe` value. When `mVal[0]` is `"Some"`, `mVal[1]` has a value
 */
export function fromMaybe(
  mVal: [val: "Some" | "None", v: any],
  format = (v: any) => v,
  fallback?: any
): any | null {
  return mVal[0] === "Some" ? format(mVal[1]) : fallback || mVal[1];
}

/** Format a numerical value as currency (by user locale) */
export function intlFormatCurrency(val: number) {
  const intlFmt = Intl.NumberFormat();
  return intlFmt.format(val);
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
 * Strip `\0000` characters from byte string
 * @param {stringn} str String with empty `\0000` characters to remove
 * @returns
 */
export function trimByteString(str: string): string {
  return str && str.replace(/\0/g, "");
}

/**
 * Truncates Account string to `XXXX...XXXX`
 * @param {string} acct Account string
 * @returns {string}
 */
export function truncateAccountString(acct: string, radius = 6): string {
  const { length } = acct;
  const start = acct.substring(0, radius);
  return `${start}...${acct.substring(length - radius, length)}`;
}
