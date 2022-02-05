/**
 * @jest-environment jsdom
 */
import * as H from "./helpers";

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

describe("Helpers → fromMaybe", () => {
  const { fromMaybe } = H;
  const isNone: H.Maybe = ["None", null];
  const isSome: H.Maybe = ["Some", 1];

  it("Unwraps a `Maybe` value", () => {
    expect(fromMaybe(isNone)).toStrictEqual(null);
    expect(fromMaybe(isSome)).toStrictEqual(1);
  });

  it("Applies a formatter if provided", () => {
    const fmt = (v: number) => v + 1;
    expect(fromMaybe(isSome, fmt)).toStrictEqual(2);
    expect(fromMaybe(isSome)).toStrictEqual(1);
  });

  it("Returns a fallback if provided", () => {
    const fb = 88;
    expect(fromMaybe(isNone, undefined, fb)).toStrictEqual(fb);
    expect(fromMaybe(isNone, undefined)).toStrictEqual(null);
    expect(fromMaybe(isSome, undefined)).toStrictEqual(1);
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
