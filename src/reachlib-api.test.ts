import * as Lib from "./reachlib-api";
import * as Storage from "./storage";
import { loadStdlib } from "@reach-sh/stdlib";
import { createConnectorAPI } from ".";
import { createReachAPI, loadReach } from "./reachlib-core";

describe("ReachLib tests | Pre-instantiate", () => {
  it("Throws an error when stdlib isn't instantiated", () => {
    expect(() => createReachAPI()).toThrow();
  });

  it("Creates a connector-api to match local storage", () => {
    expect(Storage.getBlockchain()).toBe("ALGO");
    expect(Storage.getBlockchainNetwork()).toBe("TestNet");

    Storage.selectBlockchain("ALGO");
    let conn = createConnectorAPI();
    expect(conn.chain).toStrictEqual("ALGO");

    Storage.selectBlockchain("ETH");
    conn = createConnectorAPI();
    expect(conn.chain).toStrictEqual("ETH");
  });
});

describe("ReachLib tests | Post-instantiate", () => {
  beforeAll(() => {
    loadReach(loadStdlib, "ALGO", "TestNet");
  });

  it("Checks whether a user is opted-in to a token", async () => {
    expect.assertions(1);
    const acc = await createReachAPI().createAccount();
    const hasToken = await Lib.checkHasToken(acc, 26674964);
    expect(hasToken).toBe(false);
  });

  it("Formats an address", () => {
    const ad = `0x91E9C59FAb613F0F71587Cdaa02903c8584af599`;
    const ex = `SHU4LH5LME7Q64KYPTNKAKIDZBMEV5MZAAAAAAAAAAAAAAAAAAACJT26LI`;
    const formatted = Lib.formatAddress(ad);
    expect(formatted).not.toStrictEqual(ad);
    expect(formatted).toStrictEqual(ex);
  });

  it("Formats a currency value from atomic units", () => {
    const raw = createReachAPI().bigNumberify(1000000);
    const def = Lib.formatCurrency(raw, undefined);
    const f1 = Lib.formatCurrency(raw, 1);
    const f2 = Lib.formatCurrency(raw, 2);
    const f3 = Lib.formatCurrency(raw, 3);
    const f4 = Lib.formatCurrency(raw, 4);
    const f5 = Lib.formatCurrency(raw, 5);

    expect(f1).toStrictEqual("100000");
    expect(f2).toStrictEqual("10000");
    expect(f3).toStrictEqual("1000");
    expect(f4).toStrictEqual("100");
    expect(f5).toStrictEqual("10");
    expect(def).toStrictEqual("1");
  });

  it("Truncates a currency value from atomic units", () => {
    const raw = createReachAPI().bigNumberify(1000000);
    const def = Lib.formatCurrency(raw, undefined);
    const f1 = Lib.formatCurrency(raw, 1, true);
    const f2 = Lib.formatCurrency(raw, 2, true);
    const f3 = Lib.formatCurrency(raw, 3, true);
    const f4 = Lib.formatCurrency(raw, 4, true);
    const f5 = Lib.formatCurrency(raw, 5, true);

    expect(f1).toStrictEqual("100K");
    expect(f2).toStrictEqual("10K");
    expect(f3).toStrictEqual("1K");
    expect(f4).toStrictEqual("100");
    expect(f5).toStrictEqual("10");
    expect(def).toStrictEqual("1");
  });

  it("Fetches token metadata", async () => {
    expect.assertions(3);
    const garId = 26674964;
    const acc = await createReachAPI().createAccount();
    const gar = await Lib.tokenMetadata(garId, acc);
    expect(gar.id).toBe(garId);
    expect(gar.name).toBe("gar");
    expect(gar.symbol).toBe("gar");
  });
});
