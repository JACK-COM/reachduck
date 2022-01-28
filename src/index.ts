import * as constants from "./constants";
import * as utils from "./utils/helpers";
import * as account from "./account";
import * as reachlib from "./reachlib-api";

const reachducks = {
  ...constants,
  ...utils,
  ...account,
  ...reachlib,
};

export default reachducks;
