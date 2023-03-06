import { ChainSymbol, NetworkProvider, ReachduckStdLib } from "../types";
import {
  getBlockchain,
  getBlockchainNetwork,
  selectBlockchain,
  selectBlockchainNetwork,
  validateProvider
} from "../storage";
import { createConnectorAPI } from "../networks/index.networks";

export type LoadStdlibFn = { (args: any): any };

export type ReachEnvOpts = {
  /** Blockchain to run this on */
  chain?: ChainSymbol & string;
  /** Blockchain Network (TestNet | MainNet | [ BetaNet = Algorand only] ) */
  network?: NetworkProvider & string;
  /** Optional override to provider environment */
  providerEnv?: any;
  /** Show contract compilation warnings */
  showReachContractWarnings?: boolean;
  /** When true, returns uniquely-configured `stdlib` (separate from global `reach`) */
  uniqueInstance?: boolean;
  /** When supplied, this unique `stdlib` instance will be saved to memory alongside others */
  instanceKey?: string;
  /** Optional wallet fallback options */
  walletFallback?: {
    /** Randlabs `MyAlgoConnect` export  */
    MyAlgoConnect?: any;
    /** Function that returns `WalletConnect` instance */
    WalletConnect?: any;
    /** Function that returns `PeraWallet` instance */
    PeraConnect?: any;
  };
};

/** @internal `StdLib` instance */
export let reach: ReachduckStdLib;
export let stdlibMap: Map<string, ReachduckStdLib> = new Map();

/** @internal Error message for uninstantiated `stdlib` */
const UNINSTANTIATED = `
QUACK! ReachStdlib is not instantiated. See "@jackcom/reachduck" docs for info.
`;
/** @internal Allow multiple `StdLib` instances */
let multiStdlibEnabled = false;

/** Global default reach object */
export function createReachAPI(key?: string) {
  if (key) {
    const instance = stdlibMap.get(key);
    if (instance) return instance;
    const msg = UNINSTANTIATED.replace(`ReachStdLib`, `ReachStdLib-${key}`);
    throw new Error(msg);
  }

  if (reach) return reach;

  throw new Error(UNINSTANTIATED);
}

/**
 * Use an existing reach instance from your project. Helpful if you want to
 * control how you load the library while taking advantage of `reachduck`'s
 * helper functions. You can optionally store this instance for use later (e.g.
 * if it uses a different version of `stdlib` than the rest of your project)
 */
export function attachReach(instance: ReachduckStdLib | any, key?: string) {
  if (key) stdlibMap.set(key, instance);
  else reach = instance;
  return instance;
}

/**
 * @reach_helper Initialize the stdlib instance. Note: If you want to use
 * a wallet fallback (any browser or other client wallet), use `loadReachWithOpts`
 * insrtead
 */
export function loadReach(
  loadStdlibFn: LoadStdlibFn,
  chain: ChainSymbol = getBlockchain(),
  network: NetworkProvider = getBlockchainNetwork(),
  uniqueInstance = false
): ReturnType<typeof loadStdlibFn> & ReachduckStdLib {
  if (reach?.connector && !uniqueInstance)
    return reach as ReturnType<typeof loadStdlibFn> & ReachduckStdLib;
  checkMultiStdlib(uniqueInstance);

  // Instantiate Reach object
  void reachEnvironment(chain, network);
  let instance: ReachduckStdLib;
  if (isDevnetProvider(network)) {
    instance = loadStdlibFn(network);
  } else {
    instance = loadStdlibFn(chain);
    if (chain === "ALGO") instance.setProviderByName(network);
  }

  if (uniqueInstance)
    return instance as ReturnType<typeof loadStdlibFn> & ReachduckStdLib;

  reach = instance;
  return reach as ReturnType<typeof loadStdlibFn> & ReachduckStdLib;
}

/**
 * @reach_helper Initialize the stdlib instance with an environment override and
 * (optional) wallet fallback.
 */
export function loadReachWithOpts(
  loadStdlibFn: LoadStdlibFn,
  opts: ReachEnvOpts
): ReturnType<typeof loadStdlibFn> & ReachduckStdLib {
  // Exit if reach instantiated and user isn't creating a unique instance
  if (reach?.connector && !opts.uniqueInstance) return reach;
  checkMultiStdlib(opts.uniqueInstance || false);

  // Instantiate Reach object
  const { chain = "ALGO", network = "TestNet" } = opts;
  const REACH_CONNECTOR_MODE = chain || getBlockchain();

  // Override `stdlib` load style if devnet provider
  if (isDevnetProvider(network)) return loadReach(loadStdlibFn, chain, network);
  if (
    typeof opts.providerEnv === "string" &&
    isDevnetProvider(opts.providerEnv)
  ) {
    return loadReach(loadStdlibFn, chain, opts.providerEnv as any);
  }

  const providerEnv = {
    ...reachEnvironment(REACH_CONNECTOR_MODE, network),
    ...(opts.providerEnv || {})
  };
  const stdlibOpts: any = { REACH_CONNECTOR_MODE };
  if (!opts.showReachContractWarnings) stdlibOpts.REACH_NO_WARN = "Y";
  let lib = loadStdlibFn(stdlibOpts);
  if (opts.walletFallback) {
    lib.setWalletFallback(
      lib.walletFallback({ ...opts.walletFallback, providerEnv })
    );
  } else if (Object.keys(providerEnv).length) {
    lib.setProviderByEnv(providerEnv);
  }

  if (opts.uniqueInstance) {
    return opts.instanceKey ? attachReach(lib, opts.instanceKey) : lib;
  }

  reach = lib;
  return reach;
}

/** @internal */
export function checkMultiStdlib(uniqueReq: boolean) {
  if (uniqueReq && !multiStdlibEnabled) {
    multiStdlibEnabled = true;
  }
}

/**
 * @internal
 * Store environment variables for `stdlib` instance, and create
 * a `connectorAPI` for talking to the selected blockchain
 */
export function reachEnvironment(
  chain: ChainSymbol & string,
  network: NetworkProvider & string,
  providerEnv?: any
) {
  void selectBlockchain(chain);
  void selectBlockchainNetwork(network);

  if (providerEnv) return providerEnv;

  const connector = createConnectorAPI(chain);
  return connector.getProviderEnv(network);
}

/**
 * Assert that `prov` represents a DevNet provider. If true,
 * `prov` will be the only argument used to load `stdlib`
 * @param prov Network provider value to check
 */
export function isDevnetProvider(prov: string) {
  const devnets = /(-browser|-live|-devnet)$/;
  return validateProvider(prov) && devnets.test(prov);
}
