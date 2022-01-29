/**
 * @file INDEX
 * Main/lib entry point
 */

import {
  ReachToken,
  ReachAccount,
  ReachStdLib,
  NetworkData,
} from "./src/types";
import { ConnectorInterface } from "./src/networks/index.networks";

declare type ConnectedUserData = {
  account: ReachAccount;
  address: string;
  balance: string;
} & Record<string, any>;

declare const reachduck: {
  createReachAPI(): ReachStdLib;
  loadReach(loadStdlibFn: (args: any) => ReachStdLib): boolean;
  createConnectorAPI(): ConnectorInterface;
  getProviderEnv(): any;
  formatCurrency(
    amount: any,
    decimals?: number | undefined,
    abbr?: boolean
  ): string;
  formatCurrencyShort(val: number, decimalPlaces?: number): string;
  parseCurrency(val: any, dec?: number | undefined): any;
  inlineAssetOptIn(acc: ReachAccount, tokenId: any): Promise<boolean>;
  formatAddress(acc: ReachAccount): string;
  listSupportedNetworks(): NetworkData[];
  getNetworkProvider(): string;
  setNetworkProvider(prov: "MainNet" | "TestNet"): "MainNet" | "TestNet";
  parseContractAddress(ctc: any): any;
  tokenMetadata(token: any, acc: ReachAccount): Promise<ReachToken>;
  getCurrentNetwork(): string;
  setCurrentNetwork(network: string): string;
  useWebWallet(): void;
  useWalletConnect(): void;
  connectUser(): Promise<ConnectedUserData>;
  checkSessionExists(): {
    exists: boolean;
    isWCSession: boolean;
    addr: string | null;
  };
  disconnectUser(): void;
  reconnectUser(addr?: string | null | undefined): Promise<ConnectedUserData>;
  copyToClipboard(val: string): Promise<void>;
  fromMaybe(
    mVal: [val: "Some" | "None", v: any],
    format?: (v: any) => any,
    fallback?: any
  ): any;
  intlFormatCurrency(val: number): string;
  isImageFile(path: string): boolean;
  isVideoFile(path: string): boolean;
  trimByteString(str: string): string;
  truncateAccountString(acct: string, radius?: number): string;
  noOp: () => null;
  PROVIDERS: {
    [x: string]: "MainNet" | "TestNet";
  };
  NETWORKS: Record<string, NetworkData>;
};

export default reachduck;
