import { Indexer, Algodv2, ABIContract, ABIContractParams } from "algosdk";
import { NetworkProviderALGO } from "../types";
import { getBlockchainNetwork } from "../storage";

export { generateAccount } from "algosdk";
export type ServerPort = string | number;
export type ProviderEnvALGO = {
  ALGO_INDEXER_PORT?: ServerPort;
  ALGO_INDEXER_SERVER: string;
  ALGO_INDEXER_TOKEN?: string;
  ALGO_NODE_WRITE_ONLY?: string;
  ALGO_PORT?: ServerPort;
  ALGO_SERVER: string;
  ALGO_TOKEN?: string;
  REACH_ISOLATED_NETWORK?: string;
};

/** @private Algorand Indexer instance (for querying the chain) */
const networks: NetworkProviderALGO[] = ["TestNet", "BetaNet", "MainNet"];
let indexer: Indexer;
let algod: Algodv2;
let network: NetworkProviderALGO = "TestNet";
let reachProviderEnv: ProviderEnvALGO;
let SERVER_TOKEN = "";
let INDEXER_TOKEN = "";

/** @description Generate a `providerEnv` */
export function getProviderEnv(net?: NetworkProviderALGO): ProviderEnvALGO {
  if (!reachProviderEnv) resetProvider(net || networks[0]);
  if (!net) return reachProviderEnv;

  const temp = providerForEnv(net);
  return temp.ALGO_SERVER !== reachProviderEnv.ALGO_SERVER
    ? temp
    : reachProviderEnv;
}

export type InitALGOOpts = ProviderEnvALGO & { network?: NetworkProviderALGO };
/** @description Set up initial environment for Indexer and Algod clients */
export function initEnvironmentWithOpts(opts?: InitALGOOpts) {
  reachProviderEnv = { ...providerForEnv(opts?.network), ...opts };
  network = opts?.network || (getBlockchainNetwork() as NetworkProviderALGO);
  SERVER_TOKEN = opts?.ALGO_TOKEN || "";
  INDEXER_TOKEN = opts?.ALGO_INDEXER_TOKEN || "";
}

/** @description Get a contract representation from the contract's ABI JSON */
export function contractFromABI<T extends ABIContractParams>(contractJSON: T) {
  return new ABIContract(contractJSON);
}

/** @description Get Algod (Algo Daemon) client instance */
export function useAlgoD(): Algodv2 {
  protectUninitialized();

  if (!algod) {
    const { ALGO_SERVER } = getProviderEnv();
    const { port } = new URL(ALGO_SERVER);
    algod = new Algodv2(SERVER_TOKEN || "", ALGO_SERVER, port);
  }
  return algod;
}

/** @description Get Algo indexer client instance */
export function useIndexerClient(): Indexer {
  protectUninitialized();

  if (!indexer) {
    const { ALGO_INDEXER_SERVER } = getProviderEnv();
    const { port } = new URL(ALGO_INDEXER_SERVER);
    indexer = new Indexer(INDEXER_TOKEN || "", ALGO_INDEXER_SERVER, port);
  }
  return indexer;
}

/** @description Store initial provider settings */
function resetProvider(prov: NetworkProviderALGO) {
  const net = prov || (getBlockchainNetwork() as NetworkProviderALGO);
  initEnvironmentWithOpts(providerForEnv(net));
}

/** @description Ensure environment is initialized before use */
function protectUninitialized() {
  if (!reachProviderEnv) {
    const net = getBlockchainNetwork() as NetworkProviderALGO;
    initEnvironmentWithOpts(providerForEnv(net));
  }
}

/** @description Generate environment variables for a blockchain config */
function providerForEnv(
  key: NetworkProviderALGO = getBlockchainNetwork() as NetworkProviderALGO
) {
  const k = key.toLowerCase();
  return {
    // Switched to AlgoNode (Free: 50 req/s per IP),
    ALGO_SERVER: `https://${k}-api.algonode.cloud`,
    ALGO_PORT: 443,
    ALGO_TOKEN: SERVER_TOKEN,
    ALGO_INDEXER_SERVER: `https://${k}-idx.algonode.cloud`,
    ALGO_INDEXER_PORT: 443,
    ALGO_INDEXER_TOKEN: INDEXER_TOKEN,
    REACH_ISOLATED_NETWORK: "no",
    network
  };
}
