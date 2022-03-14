export type APIFn<T extends BackendModule> = {
  [fn in keyof T]: (...args: any[]) => Promise<any>;
} & {
  [fnGroup in keyof T]: CtcLabeledFunc<any>;
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

export type InteractFn<T extends BackendModule> = {
  [fn in keyof T]: (interact: any, ctcInfo?: string | number) => any;
};

export type LibFallbackOpts = { providerEnv?: any } & Record<string, any>;

/** `NetworkData` describes single network data-item (for e.g. Ethereum) */
export type NetworkData = {
  name: string;
  abbr: ChainSymbol;
  active?: boolean;
  decimals?: number;
};

export type NetworkProvider = ("TestNet" | "BetaNet" | "MainNet") & string;

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
};

/** A reach-connected Network Account representation */
export type ReachAccount = { [x: string]: any } & {
  networkAccount: { provider?: string; addr?: string; address?: string; [x: string]: any };
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
  /** Reach Contract `API` member */
  apis: APIFn<T["_APIs"]>;
  /** Reach Contract `Participant` member */
  p: InteractFn<T["_Participants"]>;
  /** Reach Contract `Participant` member */
  participants: InteractFn<T["_Participants"]>;
  /** Reach Contract `View` member */
  v: CtcLabeledFunc<any>;
  /** Reach Contract `View` member */
  views: CtcLabeledFunc<any>;
  /** Reach Contract `Events` member */
  e: ReachEventStream;
  /** Reach Contract `Events` member */
  events: ReachEventStream;
  /** @deprecated Get contract `Views`. Use `ctc.views` or `ctc.v` */
  getViews(): CtcLabeledFunc<any>;
};

/** `ReachEvent` is an `Event` emitted from a contract `EventStream` */
export type ReachEvent<T extends any> = { when: any; what: T };

/** `ReachEvent` is an `Event` emitted from a contract `EventStream` */
export type ReachEventStream = {
  [name: string]: {
    next(): Promise<ReachEvent<any>>;
    seek(t: BigNumber): void;
    seekNow(): Promise<void>;
    lastTime(): Promise<BigNumber>;
    monitor(handler: (e: ReachEvent<any>) => void): Promise<void>;
  };
};

/** StdLib Helper Interface */
export type ReachStdLib = {
  connector: string;
  hasRandom: { random: () => BigNumber };
  hasConsoleLogger: { log: (...a: any) => void };
  balanceOf: (acc: ReachAccount, token?: number | string) => Promise<BigNumber>;
  transfer: (
    from: ReachAccount,
    to: ReachAccount,
    val?: BigNumber,
    token?: number | string
  ) => Promise<unknown>;
  connectAccount: (networkAccount: any) => Promise<ReachAccount>;
  newAccountFromSecret: (secret: string) => Promise<ReachAccount>;
  newAccountFromMnemonic: (phrase: string) => Promise<ReachAccount>;
  getDefaultAccount: () => Promise<ReachAccount>;
  createAccount: () => Promise<ReachAccount>;
  getFaucet: () => Promise<ReachAccount>;
  canFundFromFaucet: () => Promise<boolean>;
  fundFromFaucet: (acc: ReachAccount, balance: BigNumber) => Promise<void>;
  newTestAccount: (balance: BigNumber) => Promise<ReachAccount>;
  newTestAccounts: (
    num: number,
    balance: BigNumber
  ) => Promise<Array<ReachAccount>>;
  getNetworkTime: () => Promise<BigNumber>;
  waitUntilTime: (time: BigNumber) => Promise<BigNumber>;
  wait: (delta: BigNumber) => Promise<BigNumber>;
  getNetworkSecs: () => Promise<BigNumber>;
  waitUntilSecs: (secs: BigNumber) => Promise<BigNumber>;
  verifyContract: (ctcInfo: any, backend: BackendModule) => Promise<any>;
  /** @description the display name of the standard unit of currency for the network */
  standardUnit: string;
  /** @description the display name of the atomic (smallest) unit of currency for the network */
  atomicUnit: string;
  minimumBalance: BigNumber;
  formatCurrency: (amt: BigNumber, decimals: number) => string;
  formatAddress: (acc: ReachAccount | string) => string;
  unsafeGetMnemonic: (acc: ReachAccount) => string;
  launchToken: (
    acc: ReachAccount,
    name: string,
    sym: string,
    opts?: any
  ) => any;
  formatWithDecimals: (atomicUnits: number, tokenDecimals?: number) => string;
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
} & { [x: string]: any };
