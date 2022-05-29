import { Maybe } from "../types";
import * as H from "./helpers";

const localStorage = H.getStorage();

describe("Helpers → checkVersionChanged", () => {
  it("returns true when a value doesn't match in localStorage", () => {
    const newV = "2";
    localStorage.setItem("k", newV);
    expect(localStorage.getItem("k")).toStrictEqual(newV);
    expect(H.checkVersionChanged("1", "k")).toStrictEqual(true);
    localStorage.removeItem("k");
  });

  it("returns false when a value matches in localStorage", () => {
    const oldV = "1";
    localStorage.setItem("k", oldV);
    expect(localStorage.getItem("k")).toStrictEqual(oldV);
    expect(H.checkVersionChanged(oldV, "k")).toStrictEqual(false);
    localStorage.removeItem("k");
  });
});

describe("Helpers → `Maybe` values", () => {
  const { asMaybe, fromMaybe, isMaybe } = H;
  const none = H.asMaybeNone();
  const maybeNone = asMaybe();
  const maybeSome = asMaybe(1);

  function AssertTruthyMaybe<T>(val: Maybe<T>, comparison: T) {
    // Type check
    expect(isMaybe(val)).toStrictEqual(true);
    expect(H.isSome(val)).toStrictEqual(true);
    expect(H.isNone(val)).toStrictEqual(false);
    // Value check
    expect(val[0]).toStrictEqual("Some");
    expect(JSON.stringify(val[1])).toStrictEqual(JSON.stringify(comparison));
  }

  function AssertFalsyMaybe<T>(val: Maybe<T>) {
    // Type check
    expect(isMaybe(val)).toStrictEqual(true);
    expect(H.isSome(val)).toStrictEqual(false);
    expect(H.isNone(val)).toStrictEqual(true);
    // Value check
    expect(val[0]).toStrictEqual("None");
    expect(val[1]).toStrictEqual(null);
  }

  it("Detects a `Maybe` value", () => {
    expect(isMaybe(maybeNone)).toStrictEqual(true);
    expect(isMaybe(maybeSome)).toStrictEqual(true);
    expect(isMaybe([maybeSome])).toStrictEqual(false);
    expect(isMaybe([])).toStrictEqual(false);
    expect(isMaybe([1])).toStrictEqual(false);
    expect(isMaybe([1, 2])).toStrictEqual(false);
    expect(isMaybe([1, "true"])).toStrictEqual(false);
    expect(isMaybe(["some", 1])).toStrictEqual(false);
    expect(isMaybe("some")).toStrictEqual(false);
  });

  it("Creates a falsy `Maybe` value", () => {
    AssertFalsyMaybe(none);
  });

  it("Wraps a `Maybe` value", () => {
    AssertFalsyMaybe(maybeNone);
    AssertTruthyMaybe(maybeSome, 1);
  });

  it("Unwraps a `Maybe` value", () => {
    AssertFalsyMaybe(maybeNone);
    expect(fromMaybe(maybeNone)).toStrictEqual(null);

    AssertTruthyMaybe(maybeSome, 1);
    expect(fromMaybe(maybeSome)).toStrictEqual(1);
  });

  it("Applies a formatter if provided", () => {
    const fmt = (v: number) => v + 1;
    expect(fromMaybe(maybeSome, fmt)).toStrictEqual(2);
    expect(fromMaybe(maybeSome)).toStrictEqual(1);
  });

  it("Returns a fallback if provided", () => {
    const fb = 88;
    expect(fromMaybe(maybeNone, undefined, fb)).toStrictEqual(fb);
    expect(fromMaybe(maybeNone, undefined)).toStrictEqual(null);
    expect(fromMaybe(maybeSome, undefined)).toStrictEqual(1);
  });
});

describe("Helpers → Number helpers", () => {
  const { formatNumberShort, formatCurrencyLocale, abbrevNumber } = H;

  it("Abbreviates by the number of groups in the value", () => {
    // Number with '1' group (e.g. 1,234 = value(1), group(234))
    expect(abbrevNumber(1)).toStrictEqual("K");
    expect(abbrevNumber(2)).toStrictEqual("M");
    expect(abbrevNumber(3)).toStrictEqual("B");
    expect(abbrevNumber(4)).toStrictEqual("T");
    expect(abbrevNumber(5)).toStrictEqual("Qa");
    expect(abbrevNumber(6)).toStrictEqual("Qi");
    expect(abbrevNumber(7)).toStrictEqual("Si");
    expect(abbrevNumber(8)).toStrictEqual("Se");
  });

  it("Truncates a number", () => {
    expect(formatNumberShort(1)).toStrictEqual("1");
    expect(formatNumberShort(100)).toStrictEqual("100");
    expect(formatNumberShort(10000)).toStrictEqual("10K");
    expect(formatNumberShort("199968399000000")).toStrictEqual("199.96T");
    let lg: number | bigint | string = 1_550_000;
    expect(formatNumberShort(lg)).toStrictEqual("1.55M");
    expect(formatNumberShort(lg, 1)).toStrictEqual("1.5M");
    lg *= 1000;
    expect(formatNumberShort(lg)).toStrictEqual("1.55B");
    lg = BigInt(lg) * BigInt(1000000);
    expect(formatNumberShort(lg)).toStrictEqual("1.55Qa");
    lg = BigInt(lg) * BigInt(1000000);
    expect(formatNumberShort(lg)).toStrictEqual("1.55Si");
    lg = BigInt(lg) * BigInt(1000);
    expect(formatNumberShort(lg)).toStrictEqual("1.55Se");
    lg = BigInt(lg) * BigInt(lg);
    expect(formatNumberShort(lg)).toStrictEqual("2.4!");

    expect(formatNumberShort(".12345")).toStrictEqual("0.12");
    expect(formatNumberShort("1.2345")).toStrictEqual("1.23");
    expect(formatNumberShort("12.345")).toStrictEqual("12.35");
    expect(formatNumberShort("12345")).toStrictEqual("12.34K");
    expect(formatNumberShort("1")).toStrictEqual("1");
    expect(formatNumberShort("1.1")).toStrictEqual("1.1");
    expect(formatNumberShort("100")).toStrictEqual("100");
    expect(formatNumberShort("100.1")).toStrictEqual("100.1");
    expect(formatNumberShort("10000")).toStrictEqual("10K");
    expect(formatNumberShort("10000.5959")).toStrictEqual("10K");
    lg = 1_550_000;
    expect(formatNumberShort(lg)).toStrictEqual("1.55M");
    expect(formatNumberShort(lg, 1)).toStrictEqual("1.5M");
    lg *= 1000;
    lg = lg.toString();
    expect(formatNumberShort(lg)).toStrictEqual("1.55B");
    lg = BigInt(lg) * BigInt(1000000);
    expect(formatNumberShort(lg)).toStrictEqual("1.55Qa");
    lg = BigInt(lg) * BigInt(1000000);
    expect(formatNumberShort(lg)).toStrictEqual("1.55Si");
    lg = BigInt(lg) * BigInt(1000);
    expect(formatNumberShort(lg)).toStrictEqual("1.55Se");
    lg = BigInt(lg) * BigInt(lg);
    expect(formatNumberShort(lg)).toStrictEqual("2.4!");
  });

  it("Formats currency when currency and locale are provided", () => {
    const num = 1000;
    const locale = "de";
    const currency = "EUR";
    expect(formatCurrencyLocale(num)).toStrictEqual("1,000");
    expect(formatCurrencyLocale(num, locale)).toStrictEqual("1.000");
    expect(formatCurrencyLocale(num, locale, currency)).not.toBe("1.000");
  });

  it("Identifies a network token", () => {
    expect(H.isNetworkToken(123)).toBe(false);
    expect(H.isNetworkToken("123")).toBe(false);
    expect(H.isNetworkToken()).toBe(false);
    expect(H.isNetworkToken("0")).toBe(true);
    expect(H.isNetworkToken(0)).toBe(true);
    expect(H.isNetworkToken(null)).toBe(true);
  });
});

describe("Helpers → String helpers", () => {
  const { isImageFile, isVideoFile, trimByteString, truncateString } = H;
  const vid1 = `some-video.mp4`;
  const vid2 = `some-video.mpg`;
  const vid3 = `some-video.mov`;
  const vid4 = `some-video.wmv`;
  const jam = `some-jam.mp3`;
  const vids = [vid1, vid2, vid3, vid4];

  it("trimByteString -> removes empty byte characters", () => {
    const unfmt1 = `Hello\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000`;
    const unfmt2 = `Hello\u0000\u0000\u0000 World\u0000\u0000\u0000\u0000`;
    const fmt = trimByteString(unfmt1);
    const fmt2 = trimByteString(unfmt2);
    expect(fmt).toStrictEqual("Hello");
    expect(fmt2).toStrictEqual("Hello World");
    expect(fmt).not.toStrictEqual(unfmt1);
    expect(fmt2).not.toStrictEqual(unfmt2);
  });

  it("truncateAccountString -> trims a string to any length", () => {
    const full = `abcdefghijklmnopqrstuvwxyz`;
    expect(truncateString(full)).toStrictEqual(`abcdef...uvwxyz`);
    expect(truncateString(full, 2)).toStrictEqual(`ab...yz`);
    expect(truncateString(full, 4)).toStrictEqual(`abcd...wxyz`);
  });

  it("isImageFile -> Can identify image files", () => {
    expect(isImageFile(`some-img.jpg`)).toStrictEqual(true);
    expect(isImageFile(`some-img.png`)).toStrictEqual(true);
    expect(isImageFile(`some-img.bmp`)).toStrictEqual(true);
    expect(isImageFile(`some-img.webp`)).toStrictEqual(true);
    expect(isImageFile(jam)).toStrictEqual(false);
  });

  it("isVideoFile -> Can identify video files", () => {
    vids.forEach((img) => {
      expect(isImageFile(img)).toStrictEqual(false);
      expect(isVideoFile(img)).toStrictEqual(true);
    });
    expect(isVideoFile(jam)).toStrictEqual(false);
  });
});
