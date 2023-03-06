import { useAlgoD } from "./ALGO.shared";

export async function compileContract(teal: string) {
  const algod = useAlgoD();
  const compiled = await algod.compile(teal).do()
  return compiled
}
