const { DateTime } = require("luxon");
const { eachLimit } = require("async");
const { QueryTypes, Op } = require("sequelize");

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

  let { product_id, user, type } = params;

  if (!product_id) {
    let result = _error(1000);
    return callback(1000, { data: result });
  }

  let findProduct = {
    where: {
      id: product_id,
      status: 0,
      qty: type === 1 ? { [Op.gt]: 0 } : { [Op.gte]: 0 },
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

  let erP, rsP;
  [erP, rsP] = await Untils.to(
    Product.update(
      { qty: type === 1 ? rsProduct.qty - 1 : rsProduct.qty + 1 },
      {
        where: {
          id: rsProduct.id,
        },
      }
    )
  );

  if (erP) {
    let result = _error(8104, erP);
    return callback(8104, { data: result });
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
        qty: type === 1 ? parseInt(rsCECD.qty) + 1 : parseInt(rsCECD.qty) - 1,
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

  let cart = {};
  let queryProductCart = `SELECT p.id, p.name, p.price, p.image_link, p.qty as qty_product, d.qty, p.price * d.qty - p.discount as total
                            FROM (SELECT cd.product_id , cd.qty
                                  FROM card as c INNER JOIN card_detail as cd ON c.id = cd.card_id
                                  WHERE c.user_id = '${user.id}'
                                    AND c.status = 0
                                  ORDER BY cd."createdAt" DESC
                                ) as d INNER JOIN products as p ON d.product_id = p.id
                            WHERE p.status = 0 `;
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
  result.cart = cart ? cart : [];
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
    let queryProductCart = `SELECT p.id, p.name, p.price, p.image_link, p.qty as qty_product, d.qty, p.price * d.qty - p.discount as total
                            FROM (SELECT cd.product_id , cd.qty
                                  FROM card as c INNER JOIN card_detail as cd ON c.id = cd.card_id
                                  WHERE c.user_id = '${user.id}'
                                    AND c.status = 0
                                  ORDER BY cd."createdAt" DESC
                                ) as d INNER JOIN products as p ON d.product_id = p.id
                            WHERE p.status = 0`;
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
    result.cart = cart ? cart : [];
    return callback(null, result);
  } else {
    let result = _success(200);
    result.cart = cart;
    return callback(null, result);
  }
};

Service.deleteProductForCart = async (params, callback) => {
  if (!params) {
    let result = _error(1000);
    return callback(1000, { data: result });
  }

  let { user, product_id } = params;

  if (!user) {
    let result = _error(403);
    return callback(403, result);
  }

  if (!product_id) {
    let result = _error(1000);
    return callback(1000, result);
  }

  const findCart = {
    where: {
      user_id: user.id,
      status: 0,
    },
    raw: true,
  };

  let errC, rsC;
  [errC, rsC] = await Untils.to(Cart.findOne(findCart));

  if (errC) {
    const result = _error(8103, errC);
    return callback(8103, result);
  }
  if (!rsC) {
    const result = _error(8103);
    return callback(8103, result);
  }

  let errDP, rsDP;
  [errDP, rsDP] = await Untils.to(
    Cart_Detail.findOne({
      where: {
        product_id: product_id,
        card_id: rsC.id,
      },
      raw: true,
    })
  );

  let errP, rsP;
  [errP, rsP] = await Untils.to(
    Product.findOne({
      where: {
        id: product_id,
      },
      raw: true,
    })
  );
  if (!rsDP) {
    let result = _error(7000);
    return callback(7000, { data: result });
  }
  [errP, rsP] = await Untils.to(
    Product.update(
      { qty: rsDP.qty + rsP.qty },
      {
        where: {
          id: product_id,
        },
        raw: true,
      }
    )
  );

  [errDP, rsDP] = await Untils.to(
    Cart_Detail.destroy({
      where: {
        product_id: product_id,
        card_id: rsC.id,
      },
    })
  );

  let cart = {};
  let queryProductCart = `SELECT p.id, p.name, p.price, p.image_link, d.qty, p.price * d.qty - p.discount as total
                            FROM (SELECT cd.product_id , cd.qty
                                  FROM card as c INNER JOIN card_detail as cd ON c.id = cd.card_id
                                  WHERE c.user_id = '${user.id}'
                                    AND c.status = 0
                                  ORDER BY cd."createdAt" DESC
                                ) as d INNER JOIN products as p ON d.product_id = p.id
                            WHERE p.status = 0 AND p.qty > 0 
                            `;
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
  result.cart = cart ? cart : [];
  return callback(null, result);
};

module.exports = Service;
