import * as Lib from "./reachlib-api";
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

  it("Defaults stdlib to the blockchain environment", () => {
    const spy = jest.spyOn(Storage, "selectBlockchain");
    Lib.loadReach(loadStdlib);

    expect(spy).toHaveBeenCalledWith("ETH");
    expect(Storage.getBlockchain()).toBe("ETH");
    spy.mockClear();
  });
});
