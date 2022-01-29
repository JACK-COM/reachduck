import createState from "@jackcom/raphsducks";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "algorand-walletconnect-qrcode-modal";

const WCState = createState({
  connected: false,
  client: null as null | WalletConnect,
});

let connected: Signal;

export function createWCClient() {
  connected = new Signal();
  return { getAddr, signTxns };
}

class Signal {
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

export function disconnectWC() {
  const { client } = WCState.getState();
  if (client) client.killSession();
  connected = new Signal();
  WCState.reset();
}

const onConnect = (err: any, _payload: any) => {
  if (err) throw err;
  connected.notify();
};

async function ensureWC() {
  const { client } = WCState.getState();
  if (!client) {
    const newclient = new WalletConnect({
      bridge: "https://bridge.walletconnect.org",
      qrcodeModal: QRCodeModal,
    });
    newclient.on("session_update", onConnect);
    newclient.on("connect", onConnect);
    WCState.client(newclient);
  }
}

async function ensureSession() {
  await ensureWC();
  const { client } = WCState.getState();
  if (!client?.connected) {
    await client?.createSession();
  } else {
    connected.notify();
  }
}

async function getAddr(): Promise<string> {
  await ensureSession();
  await connected.wait();
  const { client } = WCState.getState();
  const accts = client?.accounts || [""];
  return accts[0];
}

async function signTxns(txns: string[]): Promise<string[]> {
  await ensureSession();
  const req = {
    method: "algo_signTxn",
    params: [txns.map((txn) => ({ txn }))],
  };

  try {
    const { client } = WCState.getState();
    return await client?.sendCustomRequest(req);
  } catch (e: any) {
    throw e;
  }
}
