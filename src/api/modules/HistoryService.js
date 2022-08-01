const { DateTime } = require("luxon");
const { eachLimit } = require("async");

const db = require("../../config/connectDB");
const History = require("../../models/History");
const Product = require("../../models/Product");

const Untils = require("../modules/Untils");
const _error = Untils._error;
const _success = Untils._success;
const MESSAGESCONFIG = require("../Messages");
const MESSAGES = MESSAGESCONFIG.messages;

let Service = {};

Service.getAllHistoryByUser = async (params, callback) => {
  if (!params) {
    let result = _error(1000);
    return callback(1000, { data: result });
  }

  let { user } = params;

  if (!user) {
    let result = _error(400);
    return callback(400, { data: result });
  }

  let errHistory, rsHistory;
  [errHistory, rsHistory] = await Untils.to(
    History.findAll({
      where: {
        user_id: user.id,
      },
      raw: true,
    })
  );
  if (errHistory) {
    let result = _error(500, errHistory);
    return callback(500, { data: result });
  }

  let result = _success(200);
  result.history = rsHistory;
  return callback(result);
};

module.exports = Service;
