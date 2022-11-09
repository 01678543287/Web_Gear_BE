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
const Order = require("../../models/Order");

const { QueryTypes, Op } = require("sequelize");
const Untils = require("../modules/Utils");
const _error = Untils._error;
const _success = Untils._success;
const MESSAGESCONFIG = require("../Messages");
const { sequelize } = require("../../config/connectDB");
const { now } = require("moment");
const moment = require("moment");
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

Service.exportGuest = async (params, callback) => {
  const { start, end } = params;
  // const s = "Sat Aug 20 2022 12:14:50 GMT+0700 (Indochina Time)";
  // const e = "Mon Aug 24 2022 13:39:08 GMT+0700 (Indochina Time)";
  let startAt = moment(start).utcOffset(420).format("YYYY-MM-DD") + " 00:00:00";
  // let startAt = moment().add(-13, "d").utcOffset(420).format("YYYY-MM-DD") + " 00:00:00";
  let now = moment(end).utcOffset(420).format("YYYY-MM-DD") + " 23:59:59";

  let queryAmountUser = `select name, age, email, address, phone, status, gender, "createdAt"
                         from users
                         where "createdAt" BETWEEN '${startAt}'::timestamp
                                           AND '${now}'::timestamp
                         order by "createdAt" DESC;`;
  let userQuery = await db.sequelize.query(queryAmountUser, {
    type: QueryTypes.SELECT,
    raw: true,
  });

  // console.log(startAt, "startAt");
  // console.log(now, "now");
  // console.log(queryAmountUser, "where");
  // console.log(userQuery, "rsG");
  userQuery.forEach((guest) => {
    guest.createdAt = guest.createdAt
      .toISOString()
      .replace(/T/, " ")
      .replace(/\..+/, "");
    if (guest.status === 0) {
      guest.status = "Hoạt động";
    } else if (guest.status === 1) {
      guest.status = "Khoá";
    }
    if (guest.gender === 0) {
      guest.gender = "Nam";
    } else if (guest.gender === 1) {
      guest.gender = "Nữ";
    }
  });

  result = _success(200);
  result.dataSheet = userQuery;
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

Service.exportOrder = async (params, callback) => {
  const { start, end } = params;
  // const s = "Sat Aug 20 2022 12:14:50 GMT+0700 (Indochina Time)";
  // const e = "Mon Aug 24 2022 13:39:08 GMT+0700 (Indochina Time)";
  let startAt = moment(start).utcOffset(420).format("YYYY-MM-DD") + " 00:00:00";
  // let startAt = moment().add(-13, "d").utcOffset(420).format("YYYY-MM-DD") + " 00:00:00";
  let now = moment(end).utcOffset(420).format("YYYY-MM-DD") + " 23:59:59";

  let queryAmountUser = `select u.name as nguoi_mua, o.total as tong, o.discount as gia_giam, o.order_date as ngay_mua, a.name as nguoi_ban, o.status as trang_thai, o."createdAt" as "createdAt"
  from  public."order" as o INNER JOIN users as u ON o.user_id = u.id
      LEFT JOIN admins as a ON o.admin_id = a.id
                         where o."createdAt" BETWEEN '${startAt}'::timestamp
                                           AND '${now}'::timestamp
                         order by o."createdAt" DESC;`;
  let userQuery = await db.sequelize.query(queryAmountUser, {
    type: QueryTypes.SELECT,
    raw: true,
  });

  // console.log(startAt, "startAt");
  // console.log(now, "now");
  // console.log(queryAmountUser, "where");
  // console.log(userQuery, "rsG");

  // { name: 'Chờ xác nhận', value: 0 },
  // { name: 'Đã xác nhận', value: 1 },
  // { name: 'Đã thanh toán', value: 3 },
  // { name: 'Đang giao', value: 2 },
  // { name: 'Đã hoàn thành', value: 4 },
  // { name: 'Đơn hàng lỗi', value: 5 },

  userQuery.forEach((guest) => {
    guest.createdAt = guest.createdAt
      .toISOString()
      .replace(/T/, " ")
      .replace(/\..+/, "");
    guest.ngay_mua = guest.ngay_mua
      .toISOString()
      .replace(/T/, " ")
      .replace(/\..+/, "");

    if (guest.trang_thai === 0) {
      guest.trang_thai = "Chờ xác nhận";
    } else if (guest.trang_thai === 1) {
      guest.trang_thai = "Đã xác nhận";
    } else if (guest.trang_thai === 2) {
      guest.trang_thai = "Đang giao";
    } else if (guest.trang_thai === 3) {
      guest.trang_thai = "Đã thanh toán";
    } else if (guest.trang_thai === 4) {
      guest.trang_thai = "Đã hoàn thành";
    } else if (guest.trang_thai === 5) {
      guest.trang_thai = "Đơn hàng lỗi";
    }
  });

  result = _success(200);
  result.dataSheet = userQuery;
  return callback(null, result);
};

Service.transaction = async (params, callback) => {
  let queryAmountUser = `SELECT DATE_PART('month', "createdAt") AS month , SUM(total) as total
  FROM public."order" WHERE status = 3
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

Service.exportTransaction = async (params, callback) => {
  const { start, end } = params;
  let startAt = moment(start).utcOffset(420).format("YYYY-MM-DD") + " 00:00:00";
  let now = moment(end).utcOffset(420).format("YYYY-MM-DD") + " 23:59:59";

  let queryAmountUser = `select SUM(total) as doanh_thu , to_char("createdAt", 'DD/MM/YYYY') as ngay
                        from public."order"
                        where status = 3 AND "createdAt" BETWEEN '${startAt}'::timestamp
                                          AND '${now}'::timestamp 
                        group by ngay 
                        order by ngay DESC`;
  let userQuery = await db.sequelize.query(queryAmountUser, {
    type: QueryTypes.SELECT,
    raw: true,
  });

  let queryNH = `select SUM(total) as chi_phi , to_char("createdAt", 'DD/MM/YYYY') as ngay
  from nhap_hang
                         where "createdAt" BETWEEN '${startAt}'::timestamp
                                           AND '${now}'::timestamp 
                         group by ngay 
                         order by ngay DESC`;
  let NHQuery = await db.sequelize.query(queryNH, {
    type: QueryTypes.SELECT,
    raw: true,
  });

  // console.log(startAt, "startAt");
  // console.log(now, "now");
  // console.log(queryAmountUser, "where");
  // console.log(userQuery, "rsG");
  // userQuery.forEach((guest) => {
  //   guest.ngay = guest.ngay.toISOString().replace(/T/, " ").replace(/\..+/, "");
  // });

  result = _success(200);
  result.dataSheet = userQuery;
  result.NHQuery = NHQuery;
  return callback(null, result);
};

Service.profit = async (params, callback) => {
  let queryAmountUser = `SELECT DATE_PART('month', "createdAt") AS month , SUM(total) as total
                          FROM nhap_hang
                          GROUP BY month`;
  let userQuery = await db.sequelize.query(queryAmountUser, {
    type: QueryTypes.SELECT,
    raw: true,
  });
  let chart = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (const item of userQuery) {
    chart[item.month - 1] = parseInt(item.total);
  }

  result = _success(200);
  result.array = chart;
  return callback(null, result);
};

module.exports = Service;
