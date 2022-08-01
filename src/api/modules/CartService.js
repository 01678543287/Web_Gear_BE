const { DateTime } = require("luxon");
const { eachLimit } = require("async");
const { QueryTypes } = require("sequelize");

const db = require("../../config/connectDB");
const Promo = require("../../models/Promoes");
const Voucher = require("../../models/Voucher");
const User = require("../../models/Users");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");
const Cart_Detail = require("../../models/Cart_Detail");

const Untils = require("../modules/Untils");
const _error = Untils._error;
const _success = Untils._success;
const MESSAGESCONFIG = require("../Messages");
const MESSAGES = MESSAGESCONFIG.messages;

let Service = {};

Service.addToCart = async (params, callback) => {
  if (!params) {
    let result = _error(1000);
    return callback(1000, { data: result });
  }

  let { product_id, user } = params;

  if (!product_id) {
    let result = _error(1000);
    return callback(1000, { data: result });
  }

  let findProduct = {
    where: {
      id: product_id,
      status: 0,
    },
    raw: true,
  };

  let errProduct, rsProduct;
  [errProduct, rsProduct] = await Untils.to(Product.findOne(findProduct));
  if (errProduct) {
    let result = _error(7000, errProduct);
    return callback(7000, { data: result });
  }
  if (!rsProduct) {
    let result = _error(7000);
    return callback(7000, { data: result });
  }

  if (user) {
    let checkExistCart = {
      where: {
        user_id: user.id,
        status: 0,
      },
      raw: true,
    };
    let errCC, checkCart;
    [errCC, checkCart] = await Untils.to(Cart.findOne(checkExistCart));
    if (errCC) {
      let result = _error(8102, errCC);
      return callback(8102, { data: result });
    }
    let cart;
    if (!checkCart) {
      // create cart
      let dataCart = {
        user_id: user.id,
      };
      let errCart, rsCart;
      [errCart, rsCart] = await Untils.to(Cart.create(dataCart));
      if (errCart) {
        let result = _error(8100, errCart);
        return callback(8100, { data: result });
      }
      cart = rsCart.dataValues;
    } else {
      cart = checkCart;
    }

    //check exist product in cart_detail
    let checkExistProductInCartDetail = {
      where: {
        card_id: cart.id,
        product_id: product_id,
      },
      raw: true,
    };
    let errCECD, rsCECD;
    [errCECD, rsCECD] = await Untils.to(
      Cart_Detail.findOne(checkExistProductInCartDetail)
    );
    if (errCECD) {
      let result = _error(8101, errCECD);
      return callback(8101, { data: result });
    }
    if (rsCECD) {
      let dataU = {
        qty: parseInt(rsCECD.qty) + 1,
      };
      let where = {
        where: {
          id: rsCECD.id,
        },
      };
      let errU, rsU;
      [errU, rsU] = await Untils.to(Cart_Detail.update(dataU, where));
    } else {
      // create cart_detail
      let dataCartDetail = {
        card_id: cart.id,
        product_id: product_id,
        qty: 1,
        rate: 0,
      };
      let errCartDetail, rsCartDetail;
      [errCartDetail, rsCartDetail] = await Untils.to(
        Cart_Detail.create(dataCartDetail)
      );
      if (errCartDetail) {
        let result = _error(8101, errCartDetail);
        return callback(8101, { data: result });
      }
    }
  } else {
    // set session || cookie
  }
  // let cart = {};
  // let queryProductCart = `SELECT p.id, p.name, p.price, p.image_link, d.qty, p.price * d.qty - p.discount as total
  // FROM (SELECT cd.product_id , cd.qty
  //       FROM card as c INNER JOIN card_detail as cd ON c.id = cd.card_id
  //       WHERE c.user_id = '${user.id}'
  //         AND c.status = 0
  //      ) as d INNER JOIN products as p ON d.product_id = p.id
  // WHERE p.status = 0 AND p.qty > 0 `;
  // let cartQuery = await db.sequelize.query(queryProductCart, {
  //   type: QueryTypes.SELECT,
  //   raw: true,
  // });
  // cart.totalPrice = 0;
  // for (const product of cartQuery) {
  //   product.image_link = Untils.linkImage + product.image_link;
  //   product.price = parseInt(product.price);
  //   product.total = parseInt(product.total);
  //   cart.totalPrice += product.total;
  // }
  // cart.products = cartQuery;

  let result = _success(200);
  return callback(null, result);
};

Service.getCartForUser = async (params, callback) => {
  if (!params) {
    let result = _error(1000);
    return callback(1000, { data: result });
  }

  let { user, cart } = params;

  if (user && !cart) {
    let cart = {};
    let queryProductCart = `SELECT p.id, p.name, p.price, p.image_link, d.qty, p.price * d.qty - p.discount as total
                            FROM (SELECT cd.product_id , cd.qty
                                  FROM card as c INNER JOIN card_detail as cd ON c.id = cd.card_id
                                  WHERE c.user_id = '${user.id}'
                                    AND c.status = 0
                                ) as d INNER JOIN products as p ON d.product_id = p.id
                            WHERE p.status = 0 AND p.qty > 0 `;
    let cartQuery = await db.sequelize.query(queryProductCart, {
      type: QueryTypes.SELECT,
      raw: true,
    });
    cart.totalPrice = 0;
    cart.countProduct = 0;
    for (const product of cartQuery) {
      product.image_link = Untils.linkImage + product.image_link;
      product.price = parseInt(product.price);
      product.total = parseInt(product.total);
      cart.countProduct++;
      cart.totalPrice += product.total;
    }
    cart.products = cartQuery;
    let result = _success(200);
    result.cart = cart;
    return callback(null, result);
  } else {
    let result = _success(200);
    result.cart = cart;
    return callback(null, result);
  }
};

Service.sendVoucherForAllUsers = async (params, callback) => {
  if (!params) {
    let result = _error(1000);
    return callback(1000, { data: result });
  }

  let { promo_id } = params;

  if (!promo_id) {
    let result = _error(1000);
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
    let result = _error(500, errPromo);
    return callback(500, { data: result });
  }
  if (!rsPromo) {
    let result = _error(4001);
    return callback(4001, { data: result });
  }

  let findUser = {
    where: {
      role: 0,
      status: 0,
    },
    raw: true,
  };

  let errUsers, rsUsers;
  [errUsers, rsUsers] = await Untils.to(User.findAll(findUser));
  if (errUsers) {
    let result = _error(500, errUsers);
    return callback(500, { data: result });
  }

  let sendVoucher = async (user) => {
    let checkExistVoucher = {
      where: {
        promoes_id: promo_id,
        user_id: user.id,
      },
      raw: true,
    };

    let errV, rsV;
    [errV, rsV] = await Untils.to(Voucher.findOne(checkExistVoucher));
    if (errV) {
      let result = _error(500, errV);
      return callback(500, { data: result });
    }
    if (rsV) {
      console.log(`User ${user.id} already has this voucher`);
    } else if (!rsV) {
      let dataVoucher = {
        user_id: user.id,
        promoes_id: promo_id,
      };

      let errVoucher, rsVoucher;
      [errVoucher, rsVoucher] = await Untils.to(Voucher.create(dataVoucher));
      if (errVoucher) {
        let result = _error(500, errVoucher);
        return callback(500, { data: result });
      }
      if (!rsVoucher) {
        let result = _error(4001);
        return callback(4001, { data: result });
      }
    }
  };

  eachLimit(rsUsers, 1, sendVoucher, (err, result) => {
    if (err) {
      result = _error(500, err);
      return callback(500, { data: result });
    }

    result = _success(200);
    return callback(null, result);
  });
};

module.exports = Service;
