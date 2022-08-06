import { loadStdlib } from "@reach-sh/stdlib";
import { loadReach } from "../reachlib-core";
import { formatAssetMetadata } from "./ALGO.indexer";

describe("ALGO.indexer suite", () => {
  const assetParams = {
    "circulating-supply": 1000000000000000,
    decimals: 6,
    name: "Amayo",
    total: 1000000000000000,
    "unit-name": "Paro"
  };

  const assetParamsB64 = {
    "circulating-supply": 1000000000000000,
    decimals: 6,
    "name-b64": "QW1heW8=",
    total: 1000000000000000,
    "unit-name-b64": "UGFybw=="
  };

  it("Formats token metadata", () => {
    loadReach(loadStdlib);
    const asset = { index: 772493104, params: assetParams };
    const f = formatAssetMetadata(asset, 0);
    expect(f.id).toStrictEqual(asset.index);
    expect(f.amount).toStrictEqual("0");
    expect(f.name).toStrictEqual(assetParams.name);
    expect(f.symbol).toStrictEqual(assetParams["unit-name"]);
  });

  it("Formats Base64-encoded token metadata", () => {
    loadReach(loadStdlib);
    const asset = { index: 772493104, params: assetParamsB64 };
    const f = formatAssetMetadata(asset, 0);
    expect(f.id).toStrictEqual(asset.index);
    expect(f.amount).toStrictEqual("0");
    expect(f.name).toStrictEqual(assetParams.name);
    expect(f.symbol).toStrictEqual(assetParams["unit-name"]);
  });
});
