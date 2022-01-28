import createState from "@jackcom/raphsducks";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "algorand-walletconnect-qrcode-modal";

const WCState = createState({
  connected: false,
  client: null as null | ALGOWCCLient,
});

export function createWCClient() {
  const newClient = new ALGOWCCLient();
  WCState.client(newClient);
  return newClient;
}

export function getWCClient() {
  const { client } = WCState.getState();
  return client;
}

export function disconnectWC() {
  const { client } = WCState.getState();
  if (!client) return;
  client.wc.killSession();
  WCState.reset();
}

export class Signal {
  p: Promise<boolean>;
  r: (a: boolean) => void;

  constructor() {
    this.r = (a) => {
      void a;
      throw new Error(`signal never initialized`);
    };
    const me = this;
    this.p = new Promise((resolve) => {
      me.r = resolve;
    });
  }
  wait() {
    return this.p;
  }
  notify() {
    this.r(true);
  }
}

export class ALGOWCCLient {
  wc: any;
  connected: Signal;

  constructor() {
    console.log(`AWC ctor`);
    this.wc = false;
    this.connected = new Signal();
  }

  async ensureWC() {
    console.log(`AWC ensureWC`);
    if (this.wc) {
      return;
    }
    this.wc = new WalletConnect({
      bridge: "https://bridge.walletconnect.org",
      qrcodeModal: QRCodeModal,
    });
    const me = this;
    const onConnect = (err: any, payload: any) => {
      console.log(`AWC onConnect`, { err, payload });
      if (err) {
        throw err;
      }
      me.connected.notify();
    };
    this.wc.on("session_update", onConnect);
    this.wc.on("connect", onConnect);
    console.log(`AWC ensureWC`, { me });
  }

  async ensureSession() {
    await this.ensureWC();
    if (!this.wc.connected) {
      console.log(`AWC createSession`);
      await this.wc.createSession();
    } else {
      console.log(`AWC session exists`);
      this.connected.notify();
    }
  }

  async getAddr(): Promise<string> {
    await this.ensureSession();
    await this.connected.wait();
    const accts = this.wc.accounts;
    console.log(`AWC getAddr`, accts);
    return accts[0];
  }

  async signTxns(txns: string[]): Promise<string[]> {
    await this.ensureSession();
    const req = {
      method: "algo_signTxn",
      params: [txns.map((txn) => ({ txn }))],
    };
    console.log(`AWC signTxns ->`, req);
    try {
      const res = await this.wc.sendCustomRequest(req);
      console.log(`AWC signTxns <-`, res);
      return res;
    } catch (e: any) {
      console.log(`AWC signTxns err`, e);
      throw e;
    }
  }
}
