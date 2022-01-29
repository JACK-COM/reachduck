/**
 * @file INDEX
 * Main/lib entry point
 */

import * as constants from "./constants";
import * as utils from "./utils/helpers";
import * as account from "./account";
import * as reachlib from "./reachlib-api";

const reachduck = {
  ...constants,
  ...utils,
  ...account,
  ...reachlib,
};

export default reachduck;
