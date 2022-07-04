/**
 * @jest-environment jsdom
 */
import {
  getBlockchain,
  getBlockchainNetwork,
  selectBlockchain,
  selectBlockchainNetwork
} from "./storage";

describe("Storage tests", () => {
  it("Defaults blockchain selection to Algorand", () => {
    expect(getBlockchain()).toBe("ALGO");
  });

  it("Defaults Blockchain network selection to 'TestNet'", () => {
    expect(getBlockchainNetwork()).toBe("TestNet");
  });

  it("Updates blockchain on selection", () => {
    expect(getBlockchain()).toBe("ALGO");

    selectBlockchain("ETH");
    expect(getBlockchain()).toBe("ETH");

    selectBlockchain("ALGO");
    expect(getBlockchain()).toBe("ALGO");
  });

  it("Updates Blockchain network on selection", () => {
    expect(getBlockchainNetwork()).toBe("TestNet");

    selectBlockchainNetwork("MainNet");
    expect(getBlockchainNetwork()).toBe("MainNet");

    selectBlockchainNetwork("TestNet");
    expect(getBlockchainNetwork()).toBe("TestNet");

    selectBlockchainNetwork("BetaNet");
    expect(getBlockchainNetwork()).toBe("BetaNet");

    // cleanup
    selectBlockchainNetwork("TestNet");
  });

  it("Requires Blockchain network selection to be one of TestNet, BetaNet, MainNet", () => {
    expect(getBlockchainNetwork()).toBe("TestNet");

    const badNet: any = "NotANet";
    expect(() => selectBlockchainNetwork(badNet)).toThrow(
      `Invalid provider selection: got "${badNet}"`
    );
  });
});
