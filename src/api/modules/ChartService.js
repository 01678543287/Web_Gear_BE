const { DateTime } = require("luxon");
const { eachLimit } = require("async");
const async = require("async");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  uploadFileImage,
  multer,
  bucket,
} = require("../upload/UploadFileCloud");

const db = require("../../config/connectDB");
const User = require("../../models/Users");

const { QueryTypes, Op } = require("sequelize");
const Untils = require("../modules/Untils");
const _error = Untils._error;
const _success = Untils._success;
const MESSAGESCONFIG = require("../Messages");
const { sequelize } = require("../../config/connectDB");
const { now } = require("moment");
const MESSAGES = MESSAGESCONFIG.messages;

let Service = {};

Service.guest = async (params, callback) => {
  let queryAmountUser = `SELECT DATE_PART('month', "createdAt") AS month , COUNT(id) as amount_user
                          FROM users
                          GROUP BY month`;
  let userQuery = await db.sequelize.query(queryAmountUser, {
    type: QueryTypes.SELECT,
    raw: true,
  });
  let chart = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (const item of userQuery) {
    chart[item.month - 1] = parseInt(item.amount_user);
  }
  // console.log(chart);

  result = _success(200);
  result.array = chart;
  return callback(null, result);
};

Service.order = async (params, callback) => {
  let queryAmountUser = `SELECT DATE_PART('month', "createdAt") AS month , COUNT(id) as amount_user
                          FROM "order"
                          GROUP BY month`;
  let userQuery = await db.sequelize.query(queryAmountUser, {
    type: QueryTypes.SELECT,
    raw: true,
  });
  let chart = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (const item of userQuery) {
    chart[item.month - 1] = parseInt(item.amount_user);
  }
  // console.log(chart);

  result = _success(200);
  result.array = chart;
  return callback(null, result);
};

Service.transaction = async (params, callback) => {
  let queryAmountUser = `SELECT DATE_PART('month', "createdAt") AS month , SUM(amount) as total
                          FROM transaction WHERE status = 4
                          GROUP BY month`;
  let userQuery = await db.sequelize.query(queryAmountUser, {
    type: QueryTypes.SELECT,
    raw: true,
  });
  let chart = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (const item of userQuery) {
    chart[item.month - 1] = parseInt(item.total);
  }
  // console.log(chart);

  result = _success(200);
  result.array = chart;
  return callback(null, result);
};
module.exports = Service;
