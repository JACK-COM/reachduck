import {
  connectUser,
  createConnectorAPI,
  formatAtomicUnits,
  fromArgs,
  loadReachWithOpts
} from "@jackcom/reachduck";
import { loadStdlib } from "@reach-sh/stdlib";

/* Use as a general scratchpad for testing the library */
const chain = createConnectorAPI("ALGO");
const rch = loadReachWithOpts(loadStdlib, {});
const mnm = fromArgs("KEY");

const a = await connectUser({ fetchAssets: true }).catch(() =>
  chain.createAccount()
);

console.log(formatAtomicUnits("12334455667", 4), { a, mnm });
