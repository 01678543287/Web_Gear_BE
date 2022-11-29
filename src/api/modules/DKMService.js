const { DateTime } = require("luxon");
const { eachLimit } = require("async");
const moment = require("moment");

const db = require("../../config/connectDB");
const Promo = require("../../models/Promoes");
const Voucher = require("../../models/Voucher");
const Dot_Khuyen_Mai = require("../../models/Dot_Khuyen_Mai");
const Chi_Tiet_Dot_Khuyen_Mai = require("../../models/Chi_Tiet_Dot_Khuyen_Mai");
const Admin = require("../../models/Admin");

const Untils = require("./Utils");
const _error = Untils._error;
const _success = Untils._success;
const MESSAGESCONFIG = require("../Messages");
const { sequelize } = require("../../config/connectDB");
const MESSAGES = MESSAGESCONFIG.messages;

const { QueryTypes, Op } = require("sequelize");

let Service = {};

Service.getAllDKM = async (params, callback) => {
  let errPromo, resultPromo;
  [errPromo, resultPromo] = await Untils.to(
    Dot_Khuyen_Mai.findAll({
      order: [["createdAt", "DESC"]],
      raw: true,
    })
  );
  if (errPromo) {
    let result = _error(2000, errPromo);
    return callback(2000, { data: result });
  }
  if (!resultPromo) {
    let result = _error(2000, errPromo);
    return callback(2000, { data: result });
  }
  console.log(resultPromo);

  eachLimit(
    resultPromo,
    1,
    async (item) => {
      item.start_At = moment(item.start_At).format("DD/MM/YYYY HH:mm:ss");
      item.end_At = moment(item.end_At).format("DD/MM/YYYY HH:mm:ss");
      let now = moment().format("DD/MM/YYYY HH:mm:ss");

      if (now <= item.start_At || now >= item.end_At) {
        item.status = 1;
      }

      let [errA, rsA] = await Untils.to(
        Admin.findOne({ where: { id: item.admin_id }, raw: true })
      );
      if (errA) {
        let result = _error(8600, errA);
        return callback(8600, { data: result });
      }
      if (!rsA) {
        let result = _error(8600);
        return callback(8600, { data: result });
      }

      item.admin = rsA.name;
    },
    (err, result) => {
      result = _success(200);
      result.dkm = resultPromo;
      return callback(null, result);
    }
  );
};

Service.createDKM = async (params, callback) => {
  if (!params) {
    result = _error(1000, err);
    return callback(1000, { data: result });
  }

  let { products, end, start, user } = params;

  if (!products || products.length === 0 || !end || !start) {
    let result = _error(1000);
    return callback(1000, { data: result });
  }

  let dataDKM = {
    admin_id: user.id,
    start_At: start,
    end_At: end,
    value: 0,
    status: 0,
  };

  let [errDKM, rsDKM] = await Untils.to(
    Dot_Khuyen_Mai.create(dataDKM, { raw: true })
  );
  if (errDKM) {
    console.log(errDKM);
    let result = _error(8651, errDKM);
    return callback(8651, { data: result });
  }

  let dataDKMD = products.map((item) => {
    return {
      dotkhuyenmai_id: rsDKM.id,
      product_id: item.id,
      value: item.value,
    };
  });

  let [errDKMD, rsDKMD] = await Untils.to(
    Chi_Tiet_Dot_Khuyen_Mai.bulkCreate(dataDKMD, { raw: true })
  );
  if (errDKMD) {
    let result = _error(8650, errDKMD);
    return callback(8650, { data: result });
  }

  let result = _success(200);
  return callback(null, result);
};

Service.getDKMByID = async (params, callback) => {
  if (!params) {
    let result = _error(1000, err);
    return callback(1000, { data: result });
  }

  let { dkm_id } = params;
  if (!dkm_id) {
    let result = _error(1000, err);
    return callback(1000, { data: result });
  }

  let query = `SELECT p.id, p.name, p.price, dkmd.value, dkm."start_At", dkm."end_At"
                FROM products p 
                  INNER JOIN chi_tiet_dot_khuyen_mai dkmd ON p.id = dkmd.product_id
                  INNER JOIN dot_khuyen_mai dkm ON dkmd.dotkhuyenmai_id = dkm.id
                WHERE dkm.id = '${dkm_id}'`;
  let resultDKM = await db.sequelize.query(query, {
    type: QueryTypes.SELECT,
    raw: true,
  });
  if (!resultDKM || resultDKM.length === 0) {
    let result = _error(404);
    return callback(404, { data: result });
  }

  let data = resultDKM.map((item) => {
    return {
      ds: {
        value: item.id,
        label: item.name,
        price: item.price,
      },
      number_book: item.value,
      price: 0,
    };
  });

  let temp = {
    id_receipt: 0,
    data: data,
  };

  let result = _success(200);
  result.start = resultDKM[0].start_At;
  result.end = resultDKM[0].end_At;
  result.products = temp;
  return callback(null, result);
};

Service.editDKM = async (params, callback) => {
  if (!params) {
    result = _error(1000, err);
    return callback(1000, { data: result });
  }

  let { products, end, start, user, dkm_id } = params;

  if (!products || products.length === 0 || !end || !start || !dkm_id) {
    let result = _error(1000);
    return callback(1000, { data: result });
  }

  let dataDKM = {
    admin_id: user.id,
    start_At: start,
    end_At: end,
    value: 0,
    status: 0,
  };

  let [errDKM, rsDKM] = await Untils.to(
    Dot_Khuyen_Mai.update(dataDKM, { where: { id: dkm_id }, raw: true })
  );
  if (errDKM) {
    console.log(errDKM);
    let result = _error(8651, errDKM);
    return callback(8651, { data: result });
  }

  let [errDDKM, rsDDKM] = await Untils.to(
    Chi_Tiet_Dot_Khuyen_Mai.destroy({ where: { dotkhuyenmai_id: dkm_id } })
  );
  if (errDDKM) {
    console.log(errDDKM);
    let result = _error(8650, errDDKM);
    return callback(8650, { data: result });
  }

  let dataDKMD = products.map((item) => {
    return {
      dotkhuyenmai_id: dkm_id,
      product_id: item.id,
      value: item.value,
    };
  });

  let [errDKMD, rsDKMD] = await Untils.to(
    Chi_Tiet_Dot_Khuyen_Mai.bulkCreate(dataDKMD, { raw: true })
  );
  if (errDKMD) {
    let result = _error(8650, errDKMD);
    return callback(8650, { data: result });
  }

  let result = _success(200);
  return callback(null, result);
};

Service.deleteDKM = async (params, callback) => {
  if (!params) {
    result = _error(1000, err);
    return callback(1000, { data: result });
  }
  // console.log(params);
  // return;

  let { dkm_id } = params;
  if (!dkm_id) {
    result = _error(1000);
    return callback(1000, { data: result });
  }

  let where = {
    where: {
      dotkhuyenmai_id: dkm_id,
    },
  };

  let [errC, rsC] = await Untils.to(Chi_Tiet_Dot_Khuyen_Mai.destroy(where));
  if (errC) {
    let result = _error(500, errC);
    return callback(500, { data: result });
  }

  let errPromo, rsPromo;
  [errPromo, rsPromo] = await Untils.to(
    Dot_Khuyen_Mai.destroy({ where: { id: dkm_id } })
  );
  if (errPromo) {
    let result = _error(500, errPromo);
    return callback(500, { data: result });
  }

  let result = _success(200);
  return callback(null, result);
};

module.exports = Service;
