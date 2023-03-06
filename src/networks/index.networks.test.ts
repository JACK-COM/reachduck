import { clearBlockchain, getBlockchainNetwork } from "../storage";
import { createConnectorAPI } from "./index.networks";
import * as Storage from "../storage";

describe("Connector API Tests", () => {
  it("Creates a connector-api to match local storage", () => {
    expect(Storage.getBlockchain()).toBe("ALGO");
    expect(Storage.getBlockchainNetwork()).toBe("TestNet");

    Storage.selectBlockchain("ALGO");
    let conn = createConnectorAPI();
    expect(conn.abbr).toStrictEqual("ALGO");

    Storage.selectBlockchain("ETH");
    conn = createConnectorAPI();
    expect(conn.abbr).toStrictEqual("ETH");
  });

  it("Creates an API for connecting to a specific chain's TestNet", () => {
    const ethConnector = createConnectorAPI("ETH");
    expect(ethConnector.abbr).toBe("ETH");
    expect(getBlockchainNetwork()).toBe("TestNet");
    clearBlockchain();
  });

  it("Creates an API for a specific chain and provider", () => {
    const ethConnector = createConnectorAPI("ETH", "TestNet");
    expect(ethConnector.abbr).toBe("ETH");
    expect(getBlockchainNetwork()).toBe("TestNet");
    clearBlockchain();
  });

  it("Only supports BetaNet on Algorand", () => {
    let api = createConnectorAPI("ETH", "BetaNet");
    expect(api.abbr).toBe("ETH");
    expect(getBlockchainNetwork()).toBe("TestNet");

    api = createConnectorAPI("ALGO", "BetaNet");
    expect(api.abbr).toBe("ALGO");
    expect(getBlockchainNetwork()).toBe("BetaNet");
    clearBlockchain();
  });

  it("Defaults API to Algorand", () => {
    const algo = createConnectorAPI();
    expect(algo.abbr).toBe("ALGO");
    expect(getBlockchainNetwork()).toBe("TestNet");
    clearBlockchain();
  });
});
