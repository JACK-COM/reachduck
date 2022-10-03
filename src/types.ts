import { loadStdlib } from "@reach-sh/stdlib";

export type APIFn<T extends any> = {
  [fn in keyof T]: T[fn] extends (...a: any[]) => Promise<unknown>
    ? (...a: any[]) => Promise<any>
    : CtcFnGroup<T[fn]>;
};

export type SafeAPIFn<T extends any> = {
  [fn in keyof T]: T[fn] extends (...a: any[]) => Promise<unknown>
    ? (...a: any[]) => Promise<Maybe<any>>
    : {
        [k in keyof T[fn]]: (...a: any[]) => Maybe<any> | Promise<Maybe<any>>;
      };
};

export type BackendModule = Record<string, any>;

/** Reach StdLib instance */
export type BigNumber = any;

export type ChainSymbol = string & ("ETH" | "ALGO");

/** Reach Contract `API` Function(s) */
export type CtcFn = { (...args: any[]): any | Promise<any> };

/** Reach Contract `View` member */
export type CtcLabeledFunc<T extends any> =
  | CtcFnGroup<T>
  | { [fnName: string]: CtcFn };

/** Reach Contract Method (function) grouping */
export type CtcFnGroup<T> = {
  [k in keyof T]: CtcFn;
};

/** Reach contract View representation */
type CtcViewGroup<T extends BackendModule> = ReturnType<
  T["_getViews"]
>["infos"];

/** Reach contract View Function representation */
export type CtcViewFn<T extends Record<string, any>> = T extends {
  decode: (...a: any[]) => Promise<unknown>;
}
  ? (...a: any[]) => Promise<Maybe<UnwrapPromise<ReturnType<T["decode"]>>>>
  : {
      [k in keyof T]: CtcViewFn<T[k]>;
    };

/** Contract `View` that is safe-wrapped as a `Maybe` */
export type ContractView<T extends BackendModule> = {
  [k in keyof CtcViewGroup<T>]: CtcViewFn<CtcViewGroup<T>[k]>;
};

/** Contract `View` that errors if not found */
export type UnsafeContractView<T extends BackendModule> = {
  [k in keyof CtcViewGroup<T>]: CtcViewFn<CtcViewGroup<T>[k]> | Error;
};

export type AccountAssetData = {
  /** (Algorand) number of smart contracts created by account  */
  appsCount: {
    /** (Algorand) smart contracts count description */
    description: string;
    /** (Algorand) smart contracts count  */
    length: number;
  };
  /** Standardized list of blockchain assets  owned by account */
  assets: (ReachToken | null)[];
};

/** Unpack a promise to use its value as a type */
type UnwrapPromise<T> = T extends Promise<infer A> ? A : T;

/** An interact function */
export type InteractFn<T extends BackendModule> = {
  [fn in keyof T]: {
    <A>(interact: A, ctcInfo?: string | number | BigNumber): any;
  };
};

/** `NetworkData` describes single network data-item (for e.g. Ethereum) */
export type NetworkData = {
  name: string;
  abbr: ChainSymbol;
  active?: boolean;
  decimals: number;
};

// "CFX"
// "CFX-browser"
// "CFX-devnet"
// "CFX-live"

/** Blockchain network instance */
export type NetworkProvider = (
  | "TestNet"
  | "BetaNet"
  | "MainNet"
  | "ALGO-browser"
  | "ALGO-devnet"
  | "ALGO-live"
  | "ETH-browser"
  | "ETH-devnet"
  | "ETH-live"
) &
  string;

export type NetworksMap = Record<ChainSymbol, NetworkData>;

export type ReachToken = {
  id: number | string;
  name: string;
  amount?: number | any;
  decimals: number;
  supply: string | number;
  symbol: string | ChainSymbol;
  url: string;
  verified?: boolean;
  verificationTier?: "trusted" | "verified" | "suspicious" | "unverified";
};

/** A reach-connected Network Account representation */
export type ReachAccount = { [x: string]: any } & {
  networkAccount: { addr?: string; address?: string; [x: string]: any };
  /** @deprecated - Use `reachAccount.contract(backend)` instead */
  attach<T extends BackendModule>(
    backend: T,
    contractInfo: any | Promise<any>
  ): ReachContract<T>;
  /** @deprecated - Use `reachAccount.contract(backend)` instead */
  deploy<T extends BackendModule>(backend: T | Promise<any>): ReachContract<T>;
  contract<T extends BackendModule>(
    backend: T,
    contractInfo?: any
  ): ReachContract<T>;
  getAddress(): string;
  setDebugLabel(label: string): ReachAccount;
  tokenAccept(tokenId: string | number): Promise<void>;
  tokenAccepted(tokenId: string | number): Promise<boolean>;
  tokenMetadata(tokenId: string | number): Promise<{ [x: string]: any }>;
  stdlib: ReachStdLib;
};

export type ReachContract<T extends BackendModule> = {
  /** Get contract address */
  getInfo(): Promise<any>;
  /** Get deployed contract address */
  getContractAddress(): Promise<string | number>;
  /** Reach Contract `API` member */
  a: APIFn<T["_APIs"]>;
  /** Reach Contract `API` member (error if api not found) */
  apis: APIFn<T["_APIs"]>;
  /** Reach Contract `API` member (always returns `Maybe` values) */
  safeApis: APIFn<T["_APIs"]>;
  /** Reach Contract `Participant` member */
  p: InteractFn<T["_Participants"]>;
  /** Reach Contract `Participant` member */
  participants: InteractFn<T["_Participants"]>;
  /** Reach Contract `View` member */
  v: ContractView<T>;
  /** Reach Contract `View` member */
  views: ContractView<T>;
  /** Reach Contract `Events` member */
  e: ReachEventStream<ReturnType<T["_getEvents"]>>;
  /** Reach Contract `Events` member */
  events: ReachEventStream<ReturnType<T["_getEvents"]>>;
  /** @deprecated Get contract `Views`. Use `ctc.views` or `ctc.v` */
  getViews(): CtcLabeledFunc<any>;
};

/** `ReachEvent` is an `Event` emitted from a contract `EventStream` */
export type ReachEvent<T extends any> = { when: any; what: T };

/** `ReachEvent` is an `Event` emitted from a contract `EventStream` */
export type ReachEventStream<T> = {
  [k in keyof T]: {
    /** Emit the next event in queue */
    next<A = T[k]>(): Promise<ReachEvent<A>>;
    /** Move queue pointer to (and return events after) block-time `t` */
    seek(t: BigNumber): void;
    /** Move queue pointer to (and return events after) block-time `now` */
    seekNow(): Promise<void>;
    /** Report the last `block time` when an event was emitted */
    lastTime(): Promise<BigNumber>;
    /** Handle all events emitted by this stream */
    monitor<A = T[k]>(handler: (e: ReachEvent<A>) => void): Promise<void>;
  };
};

/** StdLib Helper Interface */
export type ReachStdLib =
  | ReturnType<typeof loadStdlib>
  & ({
      /** Current network for stdlib instance */
      connector: string;
      /** An object with a single key whose value maps to a function that returns a random number. */
      hasRandom: { random: () => BigNumber };
      /** An object with a single key whose value maps to `console.log`. Copy into any participant that needs logging. */
      hasConsoleLogger: { log: (...a: any) => void };
      /** Get balance of `account` (optional: balance of `token` in account) */
      balanceOf: (
        acc: ReachAccount,
        token?: number | string
      ) => Promise<BigNumber>;
      /** Transfer funds between two accounts (optionally specify a token address) */
      transfer: (
        from: ReachAccount,
        to: ReachAccount,
        val?: BigNumber,
        token?: number | string
      ) => Promise<unknown>;
      /** Connect account address or `networkAccount` instance */
      connectAccount: (networkAccount: any) => Promise<ReachAccount>;
      /** Create an `account` from the supplied secret key */
      newAccountFromSecret: (secret: any) => Promise<ReachAccount>;
      /** Create an `account` from the supplied mnemonic */
      newAccountFromMnemonic: (phrase: string) => Promise<ReachAccount>;
      /** Get the selected `account` from the currently-connected network wallet */
      getDefaultAccount: () => Promise<ReachAccount>;
      /** Create an account on the current network */
      createAccount: () => Promise<ReachAccount>;
      /** Get faucet for test funds (if available) */
      getFaucet: () => Promise<ReachAccount>;
      /** Check if a test account is on `devnet` */
      canFundFromFaucet: () => Promise<boolean>;
      /** Fund a `devnet` account */
      fundFromFaucet: (acc: ReachAccount, balance: BigNumber) => Promise<void>;
      /** Spawn a test account on `devnet` */
      newTestAccount: (balance: BigNumber) => Promise<ReachAccount>;
      /** Spawn multiple test accounts on `devnet` */
      newTestAccounts: (
        /** Number of test accounts to spawn */
        num: number,
        /** Amount of tokens to allocate each account */
        balance: BigNumber
      ) => Promise<Array<ReachAccount>>;
      /** Get current block number */
      getNetworkTime: () => Promise<BigNumber>;
      /** Get current block number in `seconds` (to convert to Unix timestamp) */
      getNetworkSecs: () => Promise<BigNumber>;
      /** Takes a block number (from the past) and converts it to `seconds` */
      getTimeSecs(networkTime: any): Promise<BigNumber>;
      /** Return `t` and disconnect from a contract promise */
      disconnect<T>(t: T): void;
      /** Call `f` and wait for a call to `disconnect()` inside `f` */
      withDisconnect<T>(f: () => Promise<T>): Promise<T>;
      /** Wait for `delta` number of blocks before proceeding */
      wait: (delta: BigNumber) => Promise<BigNumber>;
      /** Like `wait`, but takes (and ends after) a future `block time` */
      waitUntilTime: (time: BigNumber) => Promise<BigNumber>;
      /** Like `wait`, but takes (and ends after) `seconds` instead of block count */
      waitUntilSecs: (secs: BigNumber) => Promise<BigNumber>;
      /** Confirm that `backend` byte code matches contract `ctcInfo` */
      verifyContract: (ctcInfo: any, backend: BackendModule) => Promise<any>;
      /** Display name of the standard unit of currency for the network */
      standardUnit: string;
      /** Display name of the atomic (smallest) unit of currency for the network */
      atomicUnit: string;
      /** Returns the minimum balance of an empty `acc` on the current network */
      minimumBalance: BigNumber;
      /** Returns the minimum balance `acc` can have */
      minimumBalanceOf(acc: ReachAccount): Promise<BigNumber>;
      /** Format a currency value into its atomic units */
      formatCurrency(amt: BigNumber, decimals: number): string;
      /** Format an address into a canonical representation */
      formatAddress(acc: ReachAccount | string): string;
      /** Attempt to extract mnemonic from `acc` if it is exposed. */
      unsafeGetMnemonic(acc: ReachAccount): string;
      /** 
   * @version 0.1.10
   * - `withDisconnect` calls the given function `f` such that any calls to `disconnect` within `f` will cause `withDisconnect` to return immediately. `withDisconnect` returns the value passed to `disconnect`.
   * Example
   * ```typescript
   * await stdlib.withDisconnect(() => ctcAlice.participants.Alice({
        ready: () => stdlib.disconnect(null) // 'withDisconnect' returns null
      }));
   * ``` */
      withDisconnect<T>(f: () => Promise<T>): Promise<T>;
      /** 
   * @version 0.1.10
   * - `disconnect` causes the surrounding call to `withDisconnect` to immediately return `t`. `disconnect` must be called from within a function passed to `withDisconnect`, otherwise an exception will be thrown. 
   * Example
   * ```typescript
   * await stdlib.withDisconnect(() => ctcAlice.participants.Alice({
        ready: () => stdlib.disconnect(null) // 'withDisconnect' returns null
      }));
   * ```
  */
      disconnect(t: any): void;
      /** Launches a non-network token `name` with symbol `sym`. Launched on the network by the acc that calls it */
      launchToken(
        /** Token creator (and reserve) */
        acc: ReachAccount,
        /** Token name */
        name: string,
        /** Token symbol (max 8-chars) */
        sym: string,
        /** Additional options */
        opts?: {
          /** Supply decimals (default is same as network token) */
          decimals?: number;
          /** Supply amount (default is largest amount network can handle) */
          supply?: number;
          /** Project or project logo url */
          url?: string;
          /** Hash of additional token metadata */
          metadataHash?: string;
          /** @Algorand Address that can claw back holdings of the token. The default is no clawback address. */
          clawback?: string;
          /** @Algorand Optional encoded note about the transaction */
          note?: Uint8Array;
        }
      ): any;
      formatWithDecimals: (
        atomicUnits: number,
        tokenDecimals?: number
      ) => string;
      /** Convert `amt` into atomic units (e.g. dollars expressed as cents) */
      parseCurrency: (amt: any, decimals?: number) => any;
      /**
       * @version 0.1.8-rc-6
       * - Allows for the installation of a custom hook to observe signing requests. */
      setSigningMonitor(
        h: (evt: any, pre: Promise<any>, post: Promise<any>) => void
      ): void;
      /**
       * @version 0.1.8-rc-6
       * - Make http requests at least `ms` milliseconds apart. Not supported on all networks */
      setMinMillisBetweenRequests(ms: number): void;
      // bigNumberToNumber: (amt: any) => number;
    } & { [x: string]: any });

/** A safe-wrapped value that may or may not exist. */
export type Maybe<T> = ["Some", T] | ["None", null];

export type TxnSearchOpts = {
  address?: string;
  addressRole?: string & ("sender" | "receiver" | "freeze-target");
  amount?: number;
  minRound?: number;
  maxRound?: number;
  note?: string;
  afterDate?: string;
  beforeDate?: string;
};