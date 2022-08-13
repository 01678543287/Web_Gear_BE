const { DateTime } = require("luxon");
const { eachLimit } = require("async");

const db = require("../../config/connectDB");
const Promo = require("../../models/Promoes");
const Voucher = require("../../models/Voucher");
const User = require("../../models/Users");
const Cart = require("../../models/Cart");
const CartDetail = require("../../models/Cart_Detail");
const Order = require("../../models/Order");
const Product = require("../../models/Product");

const Untils = require("../modules/Untils");
const _error = Untils._error;
const _success = Untils._success;
const MESSAGESCONFIG = require("../Messages");
const Transaction = require("../../models/Transaction");
const MESSAGES = MESSAGESCONFIG.messages;

let Service = {};

Service.checkout = async (params, callback) => {
  if (!params) {
    let result = _error(1000);
    return callback(1000, { data: result });
  }

  let { user, userCheckout, price, discount, note } = params;

  if (!user) {
    let result = _error(403);
    return callback(403, { data: result });
  }

  let findCart = {
    where: {
      user_id: user.id,
      status: 0,
    },
    raw: true,
  };

  let errCart, rsCart;
  [errCart, rsCart] = await Untils.to(Cart.findOne(findCart));
  if (errCart) {
    let result = _error(404, errCart);
    return callback(404, { data: result });
  }
  if (!rsCart) {
    let result = _error(404);
    return callback(404, { data: result });
  }

  let errCartDe, rsCartDe;
  [errCartDe, rsCartDe] = await Untils.to(
    CartDetail.findAll({ where: { card_id: rsCart.id }, raw: true })
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
    user_id: user.id,
    discount: discount,
    total: price,
    card_id: rsCart.id,
    status: 0,
    note: note ? note : null,
    products: JSON.stringify(rsCartDe),
    user_checkout: JSON.stringify(userCheckout),
  };
  console.log(dataOrd, "dataord=======");
  let errOrd, rsOrd;
  [errOrd, rsOrd] = await Untils.to(Order.create(dataOrd));

  if (errOrd) {
    let result = _error(8200, errOrd);
    return callback(8200, { data: result });
  }

  //create transaction
  let dataTransaction = {
    order_id: rsOrd.id,
    amount: price - discount,
    status: 0, // waiting comfirm
    user_id: user.id,
  };
  let errTrans, rsTrans;
  [errTrans, rsTrans] = await Untils.to(Transaction.create(dataTransaction));

  if (errTrans) {
    let result = _error(8300, errTrans);
    return callback(8300, { data: result });
  }

  //unactive cart
  [errCart, rsCart] = await Untils.to(
    Cart.update({ status: 1 }, { where: { id: rsCart.id } })
  );
  if (errCart) {
    let result = _error(8105, errCart);
    return callback(8105, { data: result });
  }

  //   console.log(rsOrd.id, "rsOrd");
  //   return;

  let result = _success(200);
  //   result.discount = price;
  return callback(null, result);
};

module.exports = Service;
