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
const { isNumber } = require("lodash");
const MESSAGES = MESSAGESCONFIG.messages;

let Service = {};

Service.guest = async (params, callback) => {
  params.year = parseInt(params.year);
  let currentYear = moment().year();
  let year =
    !params.year || params.year === "undefined" || !isNumber(params.year)
      ? currentYear
      : params.year;
  let queryAmountUser = `SELECT DATE_PART('month', "createdAt") AS month , COUNT(id) as amount_user
                          FROM users
                          WHERE DATE_PART('year', "createdAt") = ${year}
                          GROUP BY month`;
  let userQuery = await db.sequelize.query(queryAmountUser, {
    type: QueryTypes.SELECT,
    raw: true,
  });
  let chart = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (const item of userQuery) {
    chart[item.month - 1] = parseInt(item.amount_user);
  }

  result = _success(200);
  result.array = chart;
  return callback(null, result);
};

Service.exportGuest = async (params, callback) => {
  const { start, end, from, to, type, yearFrom, yearTo } = params;

  let queryAmountUser;
  let userQuery;
  if (type === "day") {
    let startAt =
      moment(start).utcOffset(420).format("YYYY-MM-DD") + " 00:00:00";
    let now = moment(end).utcOffset(420).format("YYYY-MM-DD") + " 23:59:59";

    queryAmountUser = `select name, age, email, phone, status, gender, "createdAt"
                         from users
                         where "createdAt" BETWEEN '${startAt}'::timestamp
                                           AND '${now}'::timestamp
                         order by "createdAt" DESC;`;
    userQuery = await db.sequelize.query(queryAmountUser, {
      type: QueryTypes.SELECT,
      raw: true,
    });
  } else if (type === "month") {
    queryAmountUser = `select name, age, email, phone, status, gender, "createdAt"
                        from users
                        where DATE_PART('month', "createdAt") BETWEEN ${from} AND ${to} 
                            AND  DATE_PART('year', "createdAt") BETWEEN ${yearFrom} AND ${yearTo}
                        order by "createdAt" DESC;`;
    userQuery = await db.sequelize.query(queryAmountUser, {
      type: QueryTypes.SELECT,
      raw: true,
    });
  } else if (type === "quarter") {
    queryAmountUser = `select name, age, email, phone, status, gender, "createdAt"
                      from users	
                      WHERE EXTRACT (QUARTER FROM "createdAt") BETWEEN ${from} AND ${to}
                      AND  DATE_PART('year', "createdAt") BETWEEN ${yearFrom} AND ${yearTo}
                      order by "createdAt" DESC;`;
    userQuery = await db.sequelize.query(queryAmountUser, {
      type: QueryTypes.SELECT,
      raw: true,
    });
  } else {
    queryAmountUser = `select name, age, email, phone, status, gender, "createdAt"
                      from users
                      where DATE_PART('year', "createdAt") BETWEEN ${from}
                          AND ${to}
                      order by "createdAt" DESC;`;
    userQuery = await db.sequelize.query(queryAmountUser, {
      type: QueryTypes.SELECT,
      raw: true,
    });
  }

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
  params.year = parseInt(params.year);
  let currentYear = moment().year();
  let year =
    !params.year || params.year === "undefined" || !isNumber(params.year)
      ? currentYear
      : params.year;
  let queryAmountUser = `SELECT DATE_PART('month', "createdAt") AS month , COUNT(id) as amount_user
                          FROM "order"
                          WHERE DATE_PART('year', "createdAt") = ${year}
                          GROUP BY month`;
  let userQuery = await db.sequelize.query(queryAmountUser, {
    type: QueryTypes.SELECT,
    raw: true,
  });
  let chart = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (const item of userQuery) {
    chart[item.month - 1] = parseInt(item.amount_user);
  }

  let queryTH = `SELECT DATE_PART('month', "createdAt") AS month , COUNT(id) as amount_user
                  FROM "tra_hang"
                  WHERE DATE_PART('year', "createdAt") = ${year}
                  GROUP BY month`;
  let THQuery = await db.sequelize.query(queryTH, {
    type: QueryTypes.SELECT,
  });
  let chartTH = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (const item of THQuery) {
    chartTH[item.month - 1] = parseInt(item.amount_user);
  }

  result = _success(200);
  result.array = chart;
  result.arrayTH = chartTH;
  return callback(null, result);
};

Service.exportOrder = async (params, callback) => {
  const { start, end, from, to, type, yearFrom, yearTo } = params;
  let queryAmountUser;
  let userQuery;

  if (type === "day") {
    let startAt =
      moment(start).utcOffset(420).format("YYYY-MM-DD") + " 00:00:00";
    let now = moment(end).utcOffset(420).format("YYYY-MM-DD") + " 23:59:59";

    queryAmountUser = `select u.name as nguoi_mua, o.total as tong, o.discount as gia_giam, o.order_date as ngay_mua, a.name as nguoi_ban, o.status as trang_thai, o."createdAt" as "createdAt"
                      from  public."order" as o INNER JOIN users as u ON o.user_id = u.id
                          LEFT JOIN admins as a ON o.admin_id = a.id
                      where o."createdAt" BETWEEN '${startAt}'::timestamp
                                        AND '${now}'::timestamp
                      order by o."createdAt" DESC;`;
    userQuery = await db.sequelize.query(queryAmountUser, {
      type: QueryTypes.SELECT,
      raw: true,
    });
  } else if (type === "month") {
    queryAmountUser = `select u.name as nguoi_mua, o.total as tong, o.discount as gia_giam, o.order_date as ngay_mua, a.name as nguoi_ban, o.status as trang_thai, o."createdAt" as "createdAt"
                      from  public."order" as o INNER JOIN users as u ON o.user_id = u.id
                          LEFT JOIN admins as a ON o.admin_id = a.id
                        where DATE_PART('month', o."createdAt") BETWEEN ${from} AND ${to} 
                            AND  DATE_PART('year', o."createdAt") BETWEEN ${yearFrom} AND ${yearTo}
                        order by o."createdAt" DESC;`;
    userQuery = await db.sequelize.query(queryAmountUser, {
      type: QueryTypes.SELECT,
      raw: true,
    });
  } else if (type === "quarter") {
    queryAmountUser = `select u.name as nguoi_mua, o.total as tong, o.discount as gia_giam, o.order_date as ngay_mua, a.name as nguoi_ban, o.status as trang_thai, o."createdAt" as "createdAt"
                      from  public."order" as o INNER JOIN users as u ON o.user_id = u.id
                          LEFT JOIN admins as a ON o.admin_id = a.id
                      WHERE EXTRACT (QUARTER FROM o."createdAt") BETWEEN ${from} AND ${to}
                      AND  DATE_PART('year', o."createdAt") BETWEEN ${yearFrom} AND ${yearTo}
                      order by o."createdAt" DESC;`;
    userQuery = await db.sequelize.query(queryAmountUser, {
      type: QueryTypes.SELECT,
      raw: true,
    });
  } else {
    queryAmountUser = `select u.name as nguoi_mua, o.total as tong, o.discount as gia_giam, o.order_date as ngay_mua, a.name as nguoi_ban, o.status as trang_thai, o."createdAt" as "createdAt"
                      from  public."order" as o INNER JOIN users as u ON o.user_id = u.id
                          LEFT JOIN admins as a ON o.admin_id = a.id
                      where DATE_PART('year', o."createdAt") BETWEEN ${from}
                          AND ${to}
                      order by o."createdAt" DESC;`;
    userQuery = await db.sequelize.query(queryAmountUser, {
      type: QueryTypes.SELECT,
      raw: true,
    });
  }

  userQuery.forEach((guest) => {
    guest.createdAt = moment(guest.createdAt).format("DD/MM/YYYY HH:mm:ss");
    guest.ngay_mua = moment(guest.ngay_mua).format("DD/MM/YYYY HH:mm:ss");

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
    } else if (guest.trang_thai === 6) {
      guest.trang_thai = "Huỷ đơn";
    } else if (guest.trang_thai === 7) {
      guest.trang_thai = "Trả hàng";
    }
  });

  result = _success(200);
  result.dataSheet = userQuery;
  return callback(null, result);
};

Service.transaction = async (params, callback) => {
  params.year = parseInt(params.year);
  let currentYear = moment().year();
  let year =
    !params.year || params.year === "undefined" || !isNumber(params.year)
      ? currentYear
      : params.year;
  let queryAmountUser = `SELECT DATE_PART('month', "createdAt") AS month , SUM(total - discount) as total
                        FROM public."order" 
                        WHERE (status = 4 OR status = 7) AND DATE_PART('year', "createdAt") = ${year}
                        GROUP BY month`;
  let userQuery = await db.sequelize.query(queryAmountUser, {
    type: QueryTypes.SELECT,
    raw: true,
  });
  let chartOrder = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (const item of userQuery) {
    chartOrder[item.month - 1] = parseInt(item.total);
  }

  let queryTraHang = `SELECT DATE_PART('month', th.at) AS month , SUM(th.total) as total
                      FROM (
                      SELECT  th.id, th."createdAt" at, sum(od.price * thd.qty) total
                        FROM tra_hang th 
                        INNER JOIN chi_tiet_tra_hang thd ON th.id = thd.trahang_id
                        INNER JOIN public."order" o ON o.id = th.order_id
                        INNER JOIN order_detail od ON o.id = od.order_id AND od.product_id = thd.product_id
                        GROUP BY th.id, at
                        ) th
                      WHERE DATE_PART('year', th.at) = ${year}
                      GROUP BY month`;

  let THQuery = await db.sequelize.query(queryTraHang, {
    type: QueryTypes.SELECT,
    raw: true,
  });
  let chartTraHang = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (const item of THQuery) {
    chartTraHang[item.month - 1] = parseInt(item.total);
  }

  var chart = chartOrder.map(function (v, i) {
    return v - chartTraHang[i];
  });

  result = _success(200);
  result.array = chart;
  return callback(null, result);
};

Service.exportTransaction = async (params, callback) => {
  const { start, end, from, to, type, yearFrom, yearTo } = params;
  let queryAmountUser, queryNH;
  let userQuery, NHQuery;

  if (type === "day") {
    let startAt =
      moment(start).utcOffset(420).format("YYYY-MM-DD") + " 00:00:00";
    let now = moment(end).utcOffset(420).format("YYYY-MM-DD") + " 23:59:59";

    queryAmountUser = `SELECT COALESCE( dt.doanh_thu, 0 ) doanh_thu, COALESCE( a.total, 0 ) hoan_tien, COALESCE( a.ngay, dt.ngay ) ngay
                FROM 
                  (Select SUM(total - discount) as doanh_thu , to_char("createdAt", 'DD/MM/YYYY') as ngay
                  from public."order" o
                  WHERE (status = 4 OR status = 7) AND "createdAt" BETWEEN '${startAt}'::timestamp
                  AND '${now}'::timestamp
                  group by ngay
                  order by ngay DESC) dt 
                FULL JOIN 
                  (SELECT sum(od.price * thd.qty) total, to_char(th."createdAt", 'DD/MM/YYYY') as ngay
                  FROM tra_hang th
                    INNER JOIN chi_tiet_tra_hang thd ON th.id = thd.trahang_id
                    INNER JOIN public."order" o ON o.id = th.order_id
                    INNER JOIN order_detail od ON thd.product_id = od.product_id AND o.id = od.order_id
                    WHERE th."createdAt" BETWEEN '${startAt}'::timestamp
                    AND '${now}'::timestamp
                    GROUP BY ngay
                    ORDER BY ngay DESC
                  ) a ON a.ngay = dt.ngay
                      ORDER BY ngay DESC`;
    userQuery = await db.sequelize.query(queryAmountUser, {
      type: QueryTypes.SELECT,
      raw: true,
    });

    queryNH = `select SUM(total) as chi_phi , to_char("createdAt", 'DD/MM/YYYY') as ngay
                from nhap_hang
                where "createdAt" BETWEEN '${startAt}'::timestamp
                                  AND '${now}'::timestamp
                group by ngay
                order by ngay DESC`;
    NHQuery = await db.sequelize.query(queryNH, {
      type: QueryTypes.SELECT,
      raw: true,
    });
  } else if (type === "month") {
    queryAmountUser = `SELECT COALESCE( dt.doanh_thu, 0 ) doanh_thu, COALESCE( a.total, 0 ) hoan_tien, COALESCE( a.ngay, dt.ngay ) ngay
                FROM 
                  (Select SUM(total - discount) as doanh_thu , to_char("createdAt", 'DD/MM/YYYY') as ngay
                  from public."order" o
                  WHERE (status = 4 OR status = 7) AND DATE_PART('month', o."createdAt") BETWEEN ${from} AND ${to} 
                  AND  DATE_PART('year', o."createdAt") BETWEEN ${yearFrom} AND ${yearTo}
                  group by ngay
                  order by ngay DESC) dt 
                FULL JOIN 
                  (SELECT sum(od.price * thd.qty) total, to_char(th."createdAt", 'DD/MM/YYYY') as ngay
                  FROM tra_hang th
                    INNER JOIN chi_tiet_tra_hang thd ON th.id = thd.trahang_id
                    INNER JOIN public."order" o ON o.id = th.order_id
                    INNER JOIN order_detail od ON thd.product_id = od.product_id AND o.id = od.order_id
                    WHERE DATE_PART('month', o."createdAt") BETWEEN ${from} AND ${to} 
                    AND  DATE_PART('year', o."createdAt") BETWEEN ${yearFrom} AND ${yearTo}
                  GROUP BY ngay
                  ORDER BY ngay DESC
                  ) a ON a.ngay = dt.ngay
                      ORDER BY ngay DESC`;
    userQuery = await db.sequelize.query(queryAmountUser, {
      type: QueryTypes.SELECT,
      raw: true,
    });

    queryNH = `select SUM(total) as chi_phi , to_char("createdAt", 'DD/MM/YYYY') as ngay
                  from nhap_hang
                  where DATE_PART('month', "createdAt") BETWEEN ${from} AND ${to} 
                  AND  DATE_PART('year', "createdAt") BETWEEN ${yearFrom} AND ${yearTo}
                  group by ngay
                  order by ngay DESC`;
    NHQuery = await db.sequelize.query(queryNH, {
      type: QueryTypes.SELECT,
      raw: true,
    });
  } else if (type === "quarter") {
    queryAmountUser = `SELECT COALESCE( dt.doanh_thu, 0 ) doanh_thu, COALESCE( a.total, 0 ) hoan_tien, COALESCE( a.ngay, dt.ngay ) ngay
                FROM 
                  (Select SUM(total - discount) as doanh_thu , to_char("createdAt", 'DD/MM/YYYY') as ngay
                  from public."order" o
                  WHERE (status = 4 OR status = 7) AND EXTRACT (QUARTER FROM o."createdAt") BETWEEN ${from} AND ${to}
                  AND  DATE_PART('year', o."createdAt") BETWEEN ${yearFrom} AND ${yearTo}
                  group by ngay
                  order by ngay DESC) dt 
                FULL JOIN 
                  (SELECT sum(od.price * thd.qty) total, to_char(th."createdAt", 'DD/MM/YYYY') as ngay
                  FROM tra_hang th
                    INNER JOIN chi_tiet_tra_hang thd ON th.id = thd.trahang_id
                    INNER JOIN public."order" o ON o.id = th.order_id
                    INNER JOIN order_detail od ON thd.product_id = od.product_id AND o.id = od.order_id
                    WHERE EXTRACT (QUARTER FROM o."createdAt") BETWEEN ${from} AND ${to}
                    AND  DATE_PART('year', o."createdAt") BETWEEN ${yearFrom} AND ${yearTo}
                  GROUP BY ngay
                  ORDER BY ngay DESC
                  ) a ON a.ngay = dt.ngay
                ORDER BY ngay DESC`;

    userQuery = await db.sequelize.query(queryAmountUser, {
      type: QueryTypes.SELECT,
      raw: true,
    });

    queryNH = `select SUM(total) as chi_phi , to_char("createdAt", 'DD/MM/YYYY') as ngay
                  from nhap_hang
                  where EXTRACT (QUARTER FROM "createdAt") BETWEEN ${from} AND ${to}
                  AND  DATE_PART('year', "createdAt") BETWEEN ${yearFrom} AND ${yearTo}
                  group by ngay
                  order by ngay DESC`;
    NHQuery = await db.sequelize.query(queryNH, {
      type: QueryTypes.SELECT,
      raw: true,
    });
  } else {
    queryAmountUser = `SELECT COALESCE( dt.doanh_thu, 0 ) doanh_thu, COALESCE( a.total, 0 ) hoan_tien, COALESCE( a.ngay, dt.ngay ) ngay
                        FROM 
                          (Select SUM(total - discount) as doanh_thu , to_char("createdAt", 'DD/MM/YYYY') as ngay
                          from public."order" o
                          where (status = 4 OR status = 7) AND DATE_PART('year', o."createdAt") BETWEEN ${from}
                          AND ${to}
                          group by ngay
                          order by ngay DESC) dt 
                        FULL JOIN 
                          (SELECT sum(od.price * thd.qty) total, to_char(th."createdAt", 'DD/MM/YYYY') as ngay
                          FROM tra_hang th
                            INNER JOIN chi_tiet_tra_hang thd ON th.id = thd.trahang_id
                            INNER JOIN public."order" o ON o.id = th.order_id
                            INNER JOIN order_detail od ON thd.product_id = od.product_id AND o.id = od.order_id
                          where DATE_PART('year', o."createdAt") BETWEEN ${from}
                            AND ${to}
                          GROUP BY ngay
                          ORDER BY ngay DESC 
                          ) a ON a.ngay = dt.ngay
                        ORDER BY ngay DESC`;
    userQuery = await db.sequelize.query(queryAmountUser, {
      type: QueryTypes.SELECT,
      raw: true,
    });

    queryNH = `select SUM(total) as chi_phi , to_char("createdAt", 'DD/MM/YYYY') as ngay
                  from nhap_hang
                  where DATE_PART('year', "createdAt") BETWEEN ${from}
                  AND ${to}
                  group by ngay
                  order by ngay DESC`;
    NHQuery = await db.sequelize.query(queryNH, {
      type: QueryTypes.SELECT,
      raw: true,
    });
  }

  result = _success(200);
  result.dataSheet = userQuery;
  result.NHQuery = NHQuery;
  return callback(null, result);
};

Service.profit = async (params, callback) => {
  let currentYear = moment().year();
  let year =
    params.year && params.year !== "undefined" ? params.year : currentYear;
  let queryAmountUser = `SELECT DATE_PART('month', "createdAt") AS month , SUM(total) as total
                          FROM nhap_hang
                          WHERE DATE_PART('year', "createdAt") = ${year}
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

Service.exportTraHang = async (params, callback) => {
  const { start, end, from, to, type, yearFrom, yearTo } = params;
  let queryAmountUser;
  let userQuery;
  if (type === "day") {
    let startAt =
      moment(start).utcOffset(420).format("YYYY-MM-DD") + " 00:00:00";
    let now = moment(end).utcOffset(420).format("YYYY-MM-DD") + " 23:59:59";

    queryAmountUser = `SELECT th.id, u.name nguoi_tra,sum(od.price * thd.qty) total,th."createdAt" at,th."createdAt" as "createdAt"
                        FROM tra_hang th
                          INNER JOIN chi_tiet_tra_hang thd ON th.id = thd.trahang_id
                          INNER JOIN public."order" o ON o.id = th.order_id
                          INNER JOIN order_detail od ON thd.product_id = od.product_id AND o.id = od.order_id
                          INNER JOIN users AS u ON o.user_id = u.id
                          LEFT JOIN admins AS a ON th.admin_id = a.id
                        WHERE th."createdAt" BETWEEN '${startAt}'::timestamp
                          AND '${now}'::timestamp
                        GROUP BY th.id, at,u.name, a.name
                        ORDER BY "createdAt"`;
    userQuery = await db.sequelize.query(queryAmountUser, {
      type: QueryTypes.SELECT,
      raw: true,
    });
  } else if (type === "month") {
    queryAmountUser = `SELECT th.id, u.name nguoi_tra,sum(od.price * thd.qty) total,th."createdAt" at,th."createdAt" as "createdAt"
                        FROM tra_hang th
                          INNER JOIN chi_tiet_tra_hang thd ON th.id = thd.trahang_id
                          INNER JOIN public."order" o ON o.id = th.order_id
                          INNER JOIN order_detail od ON thd.product_id = od.product_id AND o.id = od.order_id
                          INNER JOIN users AS u ON o.user_id = u.id
                          LEFT JOIN admins AS a ON th.admin_id = a.id
                        where DATE_PART('month', o."createdAt") BETWEEN ${from} AND ${to} 
                            AND  DATE_PART('year', o."createdAt") BETWEEN ${yearFrom} AND ${yearTo}
                        GROUP BY th.id, at,u.name, a.name
                        ORDER BY "createdAt"`;
    userQuery = await db.sequelize.query(queryAmountUser, {
      type: QueryTypes.SELECT,
      raw: true,
    });
  } else if (type === "quarter") {
    queryAmountUser = `SELECT th.id, u.name nguoi_tra,sum(od.price * thd.qty) total,th."createdAt" at,th."createdAt" as "createdAt"
                      FROM tra_hang th
                        INNER JOIN chi_tiet_tra_hang thd ON th.id = thd.trahang_id
                        INNER JOIN public."order" o ON o.id = th.order_id
                        INNER JOIN order_detail od ON thd.product_id = od.product_id AND o.id = od.order_id
                        INNER JOIN users AS u ON o.user_id = u.id
                        LEFT JOIN admins AS a ON th.admin_id = a.id
                      WHERE EXTRACT (QUARTER FROM o."createdAt") BETWEEN ${from} AND ${to}
                      AND  DATE_PART('year', o."createdAt") BETWEEN ${yearFrom} AND ${yearTo}
                      GROUP BY th.id, at,u.name, a.name
                      ORDER BY "createdAt"`;
    userQuery = await db.sequelize.query(queryAmountUser, {
      type: QueryTypes.SELECT,
      raw: true,
    });
  } else {
    queryAmountUser = `SELECT th.id, u.name nguoi_tra,sum(od.price * thd.qty) total,th."createdAt" at,th."createdAt" as "createdAt"
                        FROM tra_hang th
                          INNER JOIN chi_tiet_tra_hang thd ON th.id = thd.trahang_id
                          INNER JOIN public."order" o ON o.id = th.order_id
                          INNER JOIN order_detail od ON thd.product_id = od.product_id AND o.id = od.order_id
                          INNER JOIN users AS u ON o.user_id = u.id
                          LEFT JOIN admins AS a ON th.admin_id = a.id
                      where DATE_PART('year', o."createdAt") BETWEEN ${from}
                          AND ${to}
                          GROUP BY th.id, at,u.name, a.name
                          ORDER BY "createdAt"`;
    userQuery = await db.sequelize.query(queryAmountUser, {
      type: QueryTypes.SELECT,
      raw: true,
    });
  }

  userQuery.forEach((guest) => {
    guest.createdAt = moment(guest.createdAt).format("DD/MM/YYYY HH:mm:ss");
    delete guest.id;
    delete guest.at;
  });

  result = _success(200);
  result.dataSheet = userQuery;
  return callback(null, result);
};

module.exports = Service;
