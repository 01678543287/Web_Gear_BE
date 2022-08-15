const { DateTime } = require("luxon");
const { eachLimit } = require("async");

const db = require("../../config/connectDB");
const Promo = require("../../models/Promoes");
const Voucher = require("../../models/Voucher");
const User = require("../../models/Users");

const Untils = require("../modules/Untils");
const _error = Untils._error;
const _success = Untils._success;
const MESSAGESCONFIG = require("../Messages");
const Transaction = require("../../models/Transaction");
const MESSAGES = MESSAGESCONFIG.messages;

let Service = {};

Service.getTransaction90Days = async (params, callback) => {
  if (!params) {
    let result = _error(1000);
    return callback(1000, { data: result });
  }

  let { user } = params;

  // let query = `SELECT `

  let findTransaction = {
    where: {
      user_id: user.id,
    },
    raw: true,
  };

  let errT, rsT;
  [errT, rsT] = await Untils.to(Transaction.findAll(findTransaction));
  if (errT) {
    let result = _error(4001, errT);
    return callback(4001, { data: result });
  }
  if (!rsT) {
    let result = _error(4001);
    return callback(4001, { data: result });
  }
  console.log(rsT, "======-=0=0=0=0");

  // for (vou of rsV) {
  //   let errPromo, rsPromo;
  //   [errPromo, rsPromo] = await Untils.to(
  //     Promo.findOne({ where: { id: vou.promoes_id }, raw: true })
  //   );
  //   if (errPromo) {
  //     let result = _error(4001, errPromo);
  //     return callback(4001, { data: result });
  //   }
  //   vou.code = rsPromo.code;
  //   vou.title = rsPromo.title;
  //   if (rsPromo.type == 0) {
  //     // giảm giá theo phần trăm
  //     vou.discount = price * (rsPromo.value_type / 100);
  //   } else if (rsPromo.type == 1) {
  //     // giảm giá trực tiếp
  //     vou.discount = parseInt(rsPromo.value_type);
  //   }
  // }

  let result = _success(200);
  // result.voucher = rsV;
  return callback(null, result);
};
module.exports = Service;
