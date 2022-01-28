import createState from "@jackcom/raphsducks";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "algorand-walletconnect-qrcode-modal";

const WCState = createState({
  connected: false,
  client: null as null | WalletConnect,
});

function onConnectionChange(err: any, payload: any) {
  if (err) {
    console.log(`M-WC connectionChange`, { err, payload });
    throw err;
  }

  WCState.connected(true);
}

export function getWCClient() {
  const { client } = WCState.getState();
  if (client) return client;

  const newClient = new WalletConnect({
    bridge: "https://bridge.walletconnect.org",
    qrcodeModal: QRCodeModal,
  });
  newClient.on("connect", onConnectionChange);
  newClient.on("session_update", onConnectionChange);
  WCState.client(newClient);

  return newClient;
}

export function disconnectWC() {
  const { client } = WCState.getState();
  if (!client) return;
  client.killSession();
  WCState.reset();
}

export async function getAddr(): Promise<string> {
  await assertWCSession();
  const client = getWCClient();
  return client.accounts[0];
}

export async function signTxns(txns: string[]): Promise<string[]> {
  await assertWCSession();
  const req = {
    method: "algo_signTxn",
    params: [txns.map((txn) => ({ txn }))],
  };

  console.log(`M-WC signTxns ->`, req);

  try {
    const client = getWCClient();
    const res = await client.sendCustomRequest(req);
    console.log(`M-WC signTxns <-`, res);
    return res;
  } catch (e: any) {
    console.log(`M-WC signTxns err`, e);
    throw e;
  }
}

async function assertWCSession() {
  //   await this.ensureSession();
  //        1. Check for existing (or create new) client
  //        2. Check for existing (or create new) session
  //   await this.connected.wait();
  //        1. Assert new client session is connected

  const client = getWCClient();
  if (!client.connected) {
    console.log(`M-WC create session`);
    await client.createSession();
  } else {
    console.log(`M-WC session exists`);
    WCState.connected(true);
  }

  return true;
}
