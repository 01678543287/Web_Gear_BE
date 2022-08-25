const { DateTime } = require("luxon");
const { eachLimit } = require("async");
const dateFormat = require("dateformat");
const moment = require("moment");

const db = require("../../config/connectDB");
const Order = require("../../models/Order");
const Cart_Detail = require("../../models/Cart_Detail");
const Product = require("../../models/Product");

const Untils = require("../modules/Untils");
const _error = Untils._error;
const _success = Untils._success;
const MESSAGESCONFIG = require("../Messages");
const Admin = require("../../models/Admin");
const Rate = require("../../models/Rate");
const Transaction = require("../../models/Transaction");
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

  // for (product of rsOrd.products) {
  //   let findRate = {
  //     where: {
  //       product_id: product.id,
  //     },
  //     raw: true,
  //   };
  //   let errRate, rsRate;
  //   [errRate, rsRate] = await Untils.to(Rate.findAll(findRate));
  //   if (errRate) {
  //     console.log("get rate product error: ", errRate);
  //   }
  //   let totalPoint = 0;
  //   let count = 1;
  //   rsRate.forEach((rate) => {
  //     totalPoint += rate.point;
  //     count++;
  //   });

  //   product.rate = totalPoint / count;
  // }

  let findAdmin = {
    where: {
      id: rsOrd.admin_id,
    },
    raw: true,
  };
  let errA, rsA;
  [errA, rsA] = await Untils.to(Admin.findOne(findAdmin));
  if (errA) {
    let result = _error(8201, errA);
    return callback(8201, { data: result });
  }
  if (rsA) {
    rsOrd.admin = rsA.name;
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

Service.getOrderAdmin = async (params, callback) => {
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
    // where: {
    //   user_id: user.id,
    // },["createdAt", "DESC"],
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

  // console.log(rsOrd, "order");

  rsOrd.forEach((ord) => {
    ord.order_date = ord.order_date
      .toISOString()
      .replace(/T/, " ")
      .replace(/\..+/, "");
    // const userCheckout = JSON.parse(ord.user_checkout);
    // console.log(ord.user_checkout.name);
    ord.user_name = ord.user_checkout?.name;
    ord.user_address = ord.user_checkout?.address;
  });

  let result = _success(200);
  result.orders = rsOrd;
  return callback(null, result);
};

Service.getOrderAdminStatus = async (params, callback) => {
  if (!params) {
    let result = _error(1000);
    return callback(1000, { data: result });
  }

  let { user, status } = params;

  if (!user) {
    let result = _error(403);
    return callback(403, { data: result });
  }

  let findOrd = {
    where: {
      status: status,
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

  // console.log(rsOrd, "order");

  rsOrd.forEach((ord) => {
    ord.order_date = ord.order_date
      .toISOString()
      .replace(/T/, " ")
      .replace(/\..+/, "");
    // const userCheckout = JSON.parse(ord.user_checkout);
    // console.log(ord.user_checkout.name);
    ord.user_name = ord.user_checkout?.name;
    ord.user_address = ord.user_checkout?.address;
  });

  let result = _success(200);
  result.orders = rsOrd;
  return callback(null, result);
};

Service.changeStatusOrder = async (params, callback) => {
  if (!params) {
    let result = _error(1000);
    return callback(1000, { data: result });
  }

  let { user, status, orderId } = params;

  if (!user) {
    let result = _error(403);
    return callback(403, { data: result });
  }

  if ((!status && status != 0) || !orderId) {
    console.log(status, "status");
    console.log(orderId, "status");
    let result = _error(1000);
    return callback(1000, { data: result });
  }

  let whereOrd = {
    where: {
      id: orderId,
    },
    raw: true,
  };

  let dataOrd = {
    status:
      status === 0
        ? 1
        : status === 1 || status === 3
        ? 2
        : status === 2
        ? 4
        : 5,
    admin_id: user.id,
  };

  let errOrd, rsOrd;
  [errOrd, rsOrd] = await Untils.to(Order.update(dataOrd, whereOrd));
  if (errOrd) {
    let result = _error(8201, errOrd);
    return callback(8201, { data: result });
  }

  if (status === 2) {
    let errTrans, rsTrans;
    [errTrans, rsTrans] = await Untils.to(
      Transaction.update(
        { status: 4 },
        {
          where: {
            order_id: orderId,
          },
        }
      )
    );
    if (errTrans) {
      console.log(`create Order error: ${errTrans}`);
    }
  }

  let result = _success(200);
  return callback(null, result);
};

Service.setRate = async (params, callback) => {
  if (!params) {
    let result = _error(1000);
    return callback(1000, { data: result });
  }

  let { rate, user, product_id, cart_id, order_id } = params;

  // console.log(params, "pr=0=0=0=0=");
  // return;

  if (!user) {
    let result = _error(403);
    return callback(403, { data: result });
  }

  if (!rate || !product_id) {
    let result = _error(1000);
    return callback(1000, { data: result });
  }

  let dataRate = {
    product_id: product_id,
    user_id: user.id,
    point: parseInt(rate),
  };

  let errRate, rsRate;
  [errRate, rsRate] = await Untils.to(Rate.create(dataRate));
  if (errRate) {
    console.log(errRate, "err");
    let result = _error(8201, errRate);
    return callback(8201, { data: result });
  }

  let dataCartDetail = {
    rate: rate,
  };
  const where = {
    where: {
      card_id: cart_id,
      product_id: product_id,
    },
    raw: true,
  };
  let errCD, rsCD;
  [errCD, rsCD] = await Untils.to(Cart_Detail.update(dataCartDetail, where));
  if (errCD) {
    console.log(errCD, "err");
    let result = _error(8201, errCD);
    return callback(8201, { data: result });
  }
  // console.log(rsCD);
  // // return;
  // //
  let errCartDe, rsCartDe;
  [errCartDe, rsCartDe] = await Untils.to(
    Cart_Detail.findAll({ where: { card_id: cart_id }, raw: true })
  );
  if (errCartDe) {
    let result = _error(404, errCartDe);
    return callback(404, { data: result });
  }
  if (!rsCartDe) {
    let result = _error(404);
    return callback(404, { data: result });
  }

  for (cd of rsCartDe) {
    let findProduct = {
      where: {
        id: cd.product_id,
      },
      raw: true,
    };
    let errP, rsP;
    [errP, rsP] = await Untils.to(Product.findOne(findProduct));
    if (errP) {
      console.log(`find product error: ${errP}`);
    }
    rsP.image_link = Untils.linkImage + rsP.image_link;
    cd.product = rsP;
  }

  //create order
  let dataOrd = {
    products: JSON.stringify(rsCartDe),
  };

  let errOrd, rsOrd;
  [errOrd, rsOrd] = await Untils.to(
    Order.update(dataOrd, { where: { id: order_id } })
  );

  if (errOrd) {
    let result = _error(8200, errOrd);
    return callback(8200, { data: result });
  }
  //end

  let result = _success(200);
  return callback(null, result);
};

module.exports = Service;
