import WalletConnect from "@walletconnect/client";
import AlgoQRCodeModal from "algorand-walletconnect-qrcode-modal";

let client: WalletConnect | undefined;
let ready: WCReady;
let connectedTo: string | undefined;

export function createWCClient(to = "ALGO") {
  ready = new WCReady();
  connectedTo = to;
  return { getAddr, signTxns };
}

class WCReady {
  promise: Promise<boolean>;
  resolve: (a: boolean) => void;

  constructor() {
    this.resolve = (a) => {
      void a;
      throw new Error(`signal never initialized`);
    };
    const me = this;
    this.promise = new Promise((resolve) => {
      me.resolve = resolve;
    });
  }

  wait() {
    return this.promise;
  }

  notify() {
    this.resolve(true);
  }
}

export function disconnectWC() {
  if (client) client.killSession();
  ready = new WCReady();
  connectedTo = undefined;
  client = undefined;
}

const onConnect = (err: any, _payload: any) => {
  if (err) throw err;
  ready.notify();
};

async function ensureWC() {
  if (!client) {
    const qrcodeModal = AlgoQRCodeModal;
    const newclient = new WalletConnect({
      bridge: "https://bridge.walletconnect.org",
      qrcodeModal,
    });
    newclient.on("session_update", onConnect);
    newclient.on("connect", onConnect);
    client = newclient;
  }
}

async function ensureSession() {
  await ensureWC();
  if (!client?.connected) {
    await client?.createSession();
  } else ready.notify();
}

async function getAddr(): Promise<string> {
  await ensureSession();
  await ready.wait();
  const accts = client?.accounts || [""];
  return accts[0];
}

async function signTxns(txns: string[]): Promise<string[]> {
  await ensureSession();

  try {
    return await client?.sendCustomRequest({
      method: "algo_signTxn",
      params: [txns.map((txn) => ({ txn }))],
    });
  } catch (e: any) {
    throw e;
  }
}
