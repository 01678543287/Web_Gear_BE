const { DateTime } = require("luxon");
const { eachLimit } = require("async");
const { QueryTypes, Op, where } = require("sequelize");

const db = require("../../config/connectDB");
const Nhap_Hang = require("../../models/Nhap_Hang");
const Chi_Tiet_Nhap_Hang = require("../../models/Chi_Tiet_Nhap_Hang");
// const Cart = require("../../models/Cart");
const Product = require("../../models/Product");
// const Cart_Detail = require("../../models/Cart_Detail");

const Untils = require("./Untils");
const _error = Untils._error;
const _success = Untils._success;
const MESSAGESCONFIG = require("../Messages");
const MESSAGES = MESSAGESCONFIG.messages;

let Service = {};

Service.nhapHang = async (params, callback) => {
  if (!params) {
    let result = _error(1000);
    return callback(1000, { data: result });
  }

  let { products, user, note } = params;

  if (!products) {
    let result = _error(1000);
    return callback(1000, { data: result });
  }

  const dataNH = {
    admin_id: user.id,
    total: 0,
    note: note ? note : "",
  };
  let errNH, rsNH;
  [errNH, rsNH] = await Untils.to(Nhap_Hang.create(dataNH));
  if (errNH) {
    let result = _error(8400, errNH);
    return callback(8400, { data: result });
  }

  // console.log(rsNH.id);
  let totalPrice = 0;
  for (item of products) {
    console.log(item);
    totalPrice += item.amount * item.qty;
    let dataNHD = {
      nhaphang_id: rsNH.id,
      product_id: item.id ? item.id : "",
      qty: item.qty ? item.qty : 0,
      amount: item.amount ? item.amount : 0,
    };
    let errNHD, rsNHD;
    [errNHD, rsNHD] = await Untils.to(Chi_Tiet_Nhap_Hang.create(dataNHD));
    if (errNHD) {
      let result = _error(8401, errNHD);
      return callback(8401, { data: result });
    }

    let errP, rsP;
    [errP, rsP] = await Untils.to(
      Product.findOne({ where: { id: item.id }, raw: true })
    );
    if (errP) {
      let result = _error(7000, errP);
      return callback(7000, { data: result });
    }

    [errP, rsP] = await Untils.to(
      Product.update({ qty: rsP.qty + item.qty }, { where: { id: item.id } })
    );
  }
  [errNH, rsNH] = await Untils.to(
    Nhap_Hang.update({ total: totalPrice }, { where: { id: rsNH.id } })
  );
  if (errNH) {
    let result = _error(8400, errNH);
    return callback(8400, { data: result });
  }

  let result = _success(200);
  return callback(null, result);
};

module.exports = Service;
