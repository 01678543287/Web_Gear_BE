const { DateTime } = require("luxon");
const { eachLimit } = require("async");

const db = require("../../config/connectDB");
const Promo = require("../../models/Promoes");
const Voucher = require("../../models/Voucher");

const Untils = require("../modules/Untils");
const _error = Untils._error;
const _success = Untils._success;
const MESSAGESCONFIG = require("../Messages");
const { sequelize } = require("../../config/connectDB");
const MESSAGES = MESSAGESCONFIG.messages;

let Service = {};

Service.getAllPromo = async (params, callback) => {
  let errPromo, resultPromo;
  [errPromo, resultPromo] = await Untils.to(
    Promo.findAll({
      // where: { status: 0 },
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
  console.log(resultPromo, "rs");
  let result = _success(200);
  result.promoes = resultPromo;
  return callback(null, result);
};

Service.createPromo = async (params, callback) => {
  if (!params) {
    result = _error(1000, err);
    return callback(1000, { data: result });
  }

  let { title, code, status, type, value_type } = params;

  let dataPromo = {
    title: title,
    code: code,
    status: status,
    type: type,
    value_type: value_type,
  };

  let errPromo, rsPromo;
  [errPromo, rsPromo] = await Untils.to(Promo.create(dataPromo, { raw: true }));
  if (errPromo) {
    let result = _error(4000, errPromo);
    return callback(4000, { data: result });
  }
  let result = _success(200);
  return callback(null, result);
};

Service.getPromoByID = async (params, callback) => {
  if (!params) {
    let result = _error(1000, err);
    return callback(1000, { data: result });
  }

  let { promo_id } = params;
  if (!promo_id) {
    let result = _error(1000, err);
    return callback(1000, { data: result });
  }
  let where = {
    where: {
      id: promo_id,
    },
    raw: true,
  };
  let errPromo, rsPromo;
  [errPromo, rsPromo] = await Untils.to(Promo.findOne(where));
  if (errPromo) {
    let result = _error(2002, errPromo);
    return callback(2002, { data: result });
  }

  let result = _success(200);
  result.promo = rsPromo;
  return callback(null, result);
};

Service.editPromo = async (params, callback) => {
  if (!params) {
    result = _error(1000, err);
    return callback(1000, { data: result });
  }

  let { id, title, code, status, type, value_type } = params;

  if (!id) {
    let result = _error(1000);
    return callback(1000, { data: result });
  }

  let dataPromo = {
    title: title,
    code: code,
    status: status,
    type: type,
    value_type: value_type,
  };

  let where = {
    where: {
      id: id,
    },
    raw: true,
  };

  let errPromo, resultPromo;
  [errPromo, resultPromo] = await Untils.to(Promo.update(dataPromo, where));
  if (errPromo) {
    let result = _error(2002, errPromo);
    return callback(2002, { data: result });
  }

  let result = _success(200);
  return callback(null, result);
};

Service.deletePromo = async (params, callback) => {
  if (!params) {
    result = _error(1000, err);
    return callback(1000, { data: result });
  }

  let { promo_id } = params;
  if (!promo_id) {
    result = _error(1000, err);
    return callback(1000, { data: result });
  }

  let where = {
    where: {
      id: promo_id,
    },
    raw: true,
  };

  let errC, rsC;
  [errC, rsC] = await Untils.to(Promo.findOne(where));
  if (errC) {
    let result = _error(500, errC);
    return callback(500, { data: result });
  }

  let errPromo, rsPromo;
  [errPromo, rsPromo] = await Untils.to(
    Promo.update({ status: rsC.status === 0 ? 1 : 0 }, where)
  );
  if (errPromo) {
    let result = _error(500, errPromo);
    return callback(500, { data: result });
  }

  let result = _success(200);
  return callback(null, result);
};

module.exports = Service;
