import * as Lib from "./reachlib-core";
import * as Storage from "./storage";
import { loadStdlib } from "@reach-sh/stdlib";
import { createConnectorAPI } from ".";

describe("ReachLib tests", () => {
  it("Throws an error when stdlib isn't instantiated", () => {
    expect(() => Lib.createReachAPI()).toThrow();
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

  it("Detects a devnet provider", () => {
    expect(Lib.isDevnetProvider("Hello")).toBe(false);
    expect(Lib.isDevnetProvider("Algo")).toBe(false);
    expect(Lib.isDevnetProvider("devnet")).toBe(false);
    expect(Lib.isDevnetProvider("ALGO-devnet")).toBe(true);
    expect(Lib.isDevnetProvider("ALGO-live")).toBe(true);
    expect(Lib.isDevnetProvider("ETH-browser")).toBe(true);
    expect(Lib.isDevnetProvider("CFX-trousers")).toBe(false);
    expect(Lib.isDevnetProvider("CFX-magellan")).toBe(false);
    expect(Lib.isDevnetProvider("-devnet")).toBe(false);
  });

  it("Defaults stdlib to the blockchain environment", () => {
    const spy = jest.spyOn(Storage, "selectBlockchain");
    Lib.loadReach(loadStdlib);

    expect(spy).toHaveBeenCalledWith("ETH");
    expect(Storage.getBlockchain()).toBe("ETH");
    spy.mockClear();
  });

  it("Creates a unique stdlib instance", () => {
    const u = Lib.loadReach(loadStdlib, "ALGO", "TestNet", true);
    const main = Lib.loadReach(loadStdlib, "ETH", "TestNet", true);

    expect(u.connector).not.toStrictEqual(main.connector);
    expect(u.connector).toStrictEqual("ALGO");
    expect(main.connector).toStrictEqual("ETH");
  });

  it("Stores unique stdlib instances", () => {
    const opts: Lib.ReachEnvOpts = { network: "TestNet", uniqueInstance: true };
    const algoOpts: Lib.ReachEnvOpts = { ...opts, chain: "ALGO", instanceKey: '0-1-11' };
    const ethOpts: Lib.ReachEnvOpts = {...opts, chain: "ETH", instanceKey: '0-1-12'}
    Lib.loadReachWithOpts(loadStdlib, algoOpts);
    Lib.loadReachWithOpts(loadStdlib, ethOpts);

    const u = Lib.createReachAPI("0-1-11");
    const main = Lib.createReachAPI("0-1-12");

    expect(u.connector).not.toStrictEqual(main.connector);
    expect(u.connector).toStrictEqual("ALGO");
    expect(main.connector).toStrictEqual("ETH");
  });
});
