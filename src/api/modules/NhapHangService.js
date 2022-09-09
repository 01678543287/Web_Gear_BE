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
const Admin = require("../../models/Admin");
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

Service.getNhapHang = async (params, callback) => {
  if (!params) {
    let result = _error(1000);
    return callback(1000, { data: result });
  }

  let { user } = params;

  if (!user) {
    let result = _error(403);
    return callback(403, { data: result });
  }

  let findNH = {
    order: [["createdAt", "DESC"]],
    raw: true,
  };

  let errOrd, rsOrd;
  [errOrd, rsOrd] = await Untils.to(Nhap_Hang.findAll(findNH));
  if (errOrd) {
    let result = _error(8201, errOrd);
    return callback(8201, { data: result });
  }
  if (!rsOrd) {
    let result = _error(8201);
    return callback(8201, { data: result });
  }

  // console.log(rsOrd, "nhaphang0=0=0=0=0=0=");

  for (let ord of rsOrd) {
    ord.nhaphang_date = ord.nhaphang_date
      .toISOString()
      .replace(/T/, " ")
      .replace(/\..+/, "");

    let errA, rsA;
    [errA, rsA] = await Untils.to(
      Admin.findOne({ where: { id: ord.admin_id }, raw: true })
    );
    ord.admin_id = rsA.name;
  }

  // rsOrd.forEach((ord) => {

  // //   // const userCheckout = JSON.parse(ord.user_checkout);
  // //   // console.log(ord.user_checkout.name);
  // //   ord.user_name = ord.user_checkout.name;
  // //   ord.user_address = ord.user_checkout.address;
  // });

  let result = _success(200);
  result.nhaphang = rsOrd;
  return callback(null, result);
};

Service.getNHDetail = async (params, callback) => {
  if (!params) {
    let result = _error(1000);
    return callback(1000, { data: result });
  }

  let { user, nhaphang_id } = params;

  if (!user) {
    let result = _error(403);
    return callback(403, { data: result });
  }

  if (!nhaphang_id) {
    let result = _error(403);
    return callback(403, { data: result });
  }

  let findOrd = {
    where: {
      nhaphang_id: nhaphang_id,
    },
    raw: true,
  };

  let errN, rsN;
  [errN, rsN] = await Untils.to(
    Nhap_Hang.findOne({ where: { id: nhaphang_id }, raw: true })
  );

  let errA, rsA;
  [errA, rsA] = await Untils.to(
    Admin.findOne({ where: { id: rsN.admin_id }, raw: true })
  );

  let errOrd, rsOrd;
  [errOrd, rsOrd] = await Untils.to(Chi_Tiet_Nhap_Hang.findAll(findOrd));
  if (errOrd) {
    let result = _error(8201, errOrd);
    return callback(8201, { data: result });
  }
  if (!rsOrd) {
    let result = _error(8201);
    return callback(8201, { data: result });
  }

  // console.log(rsOrd);

  let products = [];
  for (let item of rsOrd) {
    let errP, rsP;
    [errP, rsP] = await Untils.to(
      Product.findOne({ where: { id: item.product_id }, raw: true })
    );
    products.push({
      id: rsP.id,
      name: rsP.name,
      qty: parseInt(item.qty),
      amount: parseInt(item.amount),
      image_link: Untils.linkImage + rsP.image_link,
    });
  }
  // console.log(products);

  rsOrd.products = products;
  let resData = {
    id: nhaphang_id,
    total: parseInt(rsN.total),
    nhaphang_date: rsN.nhaphang_date
      .toISOString()
      .replace(/T/, " ")
      .replace(/\..+/, ""),
    admin_id: rsA.name,
    products: products,
  };

  let result = _success(200);
  result.nhaphang = resData;
  return callback(null, result);
};

module.exports = Service;
