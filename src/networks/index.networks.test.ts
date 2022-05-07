import { clearBlockchain, getBlockchainNetwork } from "../storage";
import { createConnectorAPI } from "./index.networks";

describe("Connector API Tests", () => {
  it("Creates an API for connecting to a specific chain's TestNet", () => {
    const ethConnector = createConnectorAPI("ETH");
    expect(ethConnector.chain).toBe("ETH");
    expect(getBlockchainNetwork()).toBe("TestNet");
    clearBlockchain();
  });

  it("Creates an API for a specific chain and provider", () => {
    const ethConnector = createConnectorAPI("ETH", "TestNet");
    expect(ethConnector.chain).toBe("ETH");
    expect(getBlockchainNetwork()).toBe("TestNet");
    clearBlockchain();
  });

  it("Only supports BetaNet on Algorand", () => {
    let api = createConnectorAPI("ETH", "BetaNet");
    expect(api.chain).toBe("ETH");
    expect(getBlockchainNetwork()).toBe("TestNet");

    api = createConnectorAPI("ALGO", "BetaNet");
    expect(api.chain).toBe("ALGO");
    expect(getBlockchainNetwork()).toBe("BetaNet");
    clearBlockchain();
  });

  it("Defaults API to Algorand", () => {
    const algo = createConnectorAPI();
    expect(algo.chain).toBe("ALGO");
    expect(getBlockchainNetwork()).toBe("TestNet");
    clearBlockchain();
  });
});
