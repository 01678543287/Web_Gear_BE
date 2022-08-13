const { DateTime } = require("luxon");
const { eachLimit } = require("async");
const dateFormat = require("dateformat");
const moment = require("moment");

const db = require("../../config/connectDB");
const Order = require("../../models/Order");

const Untils = require("../modules/Untils");
const _error = Untils._error;
const _success = Untils._success;
const MESSAGESCONFIG = require("../Messages");
const MESSAGES = MESSAGESCONFIG.messages;

let Service = {};

Service.getOrder = async (params, callback) => {
  if (!params) {
    let result = _error(1000);
    return callback(1000, { data: result });
  }

  let { user } = params;

  if (!user) {
    let result = _error(403);
    return callback(403, { data: result });
  }

  let findOrd = {
    where: {
      user_id: user.id,
    },
    order: [["createdAt", "DESC"]],
    raw: true,
  };

  let errOrd, rsOrd;
  [errOrd, rsOrd] = await Untils.to(Order.findAll(findOrd));
  if (errOrd) {
    let result = _error(8201, errOrd);
    return callback(8201, { data: result });
  }
  if (!rsOrd) {
    let result = _error(8201);
    return callback(8201, { data: result });
  }

  rsOrd.forEach((ord) => {
    ord.order_date = ord.order_date
      .toISOString()
      .replace(/T/, " ")
      .replace(/\..+/, "");
    // const userCheckout = JSON.parse(ord.user_checkout);
    // console.log(ord.user_checkout.name);
    ord.user_name = ord.user_checkout.name;
    ord.user_address = ord.user_checkout.address;
  });

  let result = _success(200);
  result.orders = rsOrd;
  return callback(null, result);
};

Service.getOrderDetailForUser = async (params, callback) => {
  if (!params) {
    let result = _error(1000);
    return callback(1000, { data: result });
  }

  let { user, order_id } = params;

  if (!user) {
    let result = _error(403);
    return callback(403, { data: result });
  }

  if (!order_id) {
    let result = _error(403);
    return callback(403, { data: result });
  }

  let findOrd = {
    where: {
      id: order_id,
    },
    raw: true,
  };

  let errOrd, rsOrd;
  [errOrd, rsOrd] = await Untils.to(Order.findOne(findOrd));
  if (errOrd) {
    let result = _error(8201, errOrd);
    return callback(8201, { data: result });
  }
  if (!rsOrd) {
    let result = _error(8201);
    return callback(8201, { data: result });
  }

  rsOrd.order_date = rsOrd.order_date
    .toISOString()
    .replace(/T/, " ")
    .replace(/\..+/, "");
  // const userCheckout = JSON.parse(ord.user_checkout);
  // console.log(rsOrd.user_checkout.name);
  rsOrd.total = parseInt(rsOrd.total);
  rsOrd.discount = parseInt(rsOrd.discount);
  rsOrd.user_name = rsOrd.user_checkout.name;

  let result = _success(200);
  result.order = rsOrd;
  return callback(null, result);
};

module.exports = Service;
