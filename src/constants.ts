import { NetworkData } from "./types";

export const PROVIDERS: { [x: string]: "TestNet" | "MainNet" } = {
  TESTNET: "TestNet",
  MAINNET: "MainNet",
};

export const NETWORKS: Record<string, NetworkData> = {
  ALGO: { name: "Algorand", abbr: "ALGO", decimals: 6 },
  ETH: { name: "Ethereum", abbr: "ETH", decimals: 18 },
};
