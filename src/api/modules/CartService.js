const { DateTime } = require("luxon");
const { eachLimit } = require("async");
const { QueryTypes, Op } = require("sequelize");
const moment = require("moment");

const { sequelize } = require("../../config/connectDB");
const db = require("../../config/connectDB");
const Promo = require("../../models/Promoes");
const Voucher = require("../../models/Voucher");
const User = require("../../models/Users");
// const Cart = require("../../models/Cart");
const Product = require("../../models/Product");
const Cart_Detail = require("../../models/Cart_Detail");
const Dot_Khuyen_Mai = require("../../models/Dot_Khuyen_Mai");
const Chi_Tiet_Dot_Khuyen_Mai = require("../../models/Chi_Tiet_Dot_Khuyen_Mai");

const Untils = require("./Utils");
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
  console.log(params);

  let { product_id, user, type, qty, currentQty } = params;

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

  // if (type === 1) {
  //   findProduct.where.qty = { [Op.gt]: 0 };
  // } else if (type === 2) {
  //   findProduct.where.qty = { [Op.gte]: qty };
  // } else if (type === 0) {
  //   findProduct.where.qty = { [Op.gte]: 0 };
  // }

  let [errProduct, rsProduct] = await Untils.to(Product.findOne(findProduct));
  if (errProduct) {
    let result = _error(7000, errProduct);
    return callback(7000, { data: result });
  }
  if (!rsProduct) {
    let result = _error(7000);
    return callback(7000, { data: result });
  }

  // console.log(rsProduct, "rsProduct");

  // if (type === 1) {
  //   qty = qty ? qty : 0;
  //   let sum = qty + currentQty;
  //   if (rsProduct.qty < sum) {
  //     let result = _error(7006);
  //     return callback(7006, { data: result });
  //   }
  // } else if (type === 2) {
  //   let sum = qty;
  //   if (rsProduct.qty < sum) {
  //     let result = _error(7006);
  //     return callback(7006, { data: result });
  //   }
  // }

  if (qty > rsProduct.qty + currentQty) {
    let result = _error(8104);
    return callback(8104, { data: result });
  }

  if (type === 0) {
    rsProduct.qty += 1;
  } else if (type === 1) {
    rsProduct.qty -= 1;
  } else if (type === 2) {
    rsProduct.qty += currentQty - qty;
  }

  let [errKM, rsKM] = await Untils.to(
    Chi_Tiet_Dot_Khuyen_Mai.findOne({
      attributes: [
        [sequelize.fn("MAX", sequelize.col("value")), "value"],
        "dotkhuyenmai_id",
      ],
      where: { product_id: product_id },
      group: ["dotkhuyenmai_id"],
      raw: true,
    })
  );
  if (errKM) {
    console.log(errKM, "error find chi tiet dot khuyen mai");
  }
  if (rsKM) {
    let nowDate = moment().utcOffset(420).format("YYYY-MM-DD HH:mm:ss");

    let where = {
      where: {
        id: rsKM.dotkhuyenmai_id,
        start_At: { [Op.lte]: `${nowDate.toString()}` },
        end_At: { [Op.gte]: `${nowDate.toString()}` },
        status: 0,
      },
      raw: true,
    };
    let [errDKM, rsDKM] = await Untils.to(Dot_Khuyen_Mai.findOne(where));
    if (errDKM) {
      console.log(errDKM, "error find dot khuyen mai");
    }
    if (rsDKM) {
      rsProduct.price =
        rsKM && rsKM.value ? rsProduct.price * (1 - rsKM.value / 100) : null;
    }
  }

  let [erP, rsP] = await Untils.to(
    Product.update(
      { qty: rsProduct.qty },
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
    //check exist product in cart_detail
    let checkExistProductInCartDetail = {
      where: {
        user_id: user.id,
        product_id: product_id,
        status: 0,
      },
      raw: true,
    };

    let [errCECD, rsCECD] = await Untils.to(
      Cart_Detail.findOne(checkExistProductInCartDetail)
    );
    if (errCECD) {
      let result = _error(8101, errCECD);
      return callback(8101, { data: result });
    }
    if (rsCECD) {
      if (type === 0) {
        rsCECD.qty -= 1;
      } else if (type === 1) {
        rsCECD.qty += 1;
      } else if (type === 2) {
        rsCECD.qty = qty;
      }

      let dataU = {
        qty: rsCECD.qty,
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
        user_id: user.id,
        product_id: product_id,
        price: rsProduct.price,
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

  let nowDate = moment().utcOffset(420).format("YYYY-MM-DD HH:mm:ss");
  let cart = {};
  // let queryProductCart = `SELECT p.id, p.name, (p.price * (100 - (COALESCE( MAX(dkm.value), 0 ))))/100 price, p.qty as qty_product, p.image_link,
  //                           cd.qty, cd.qty * (p.price * (100 - (COALESCE( MAX(dkm.value), 0 ))))/100 as total
  //                         FROM products p
  //                           INNER JOIN cart_detail cd ON p.id = cd.product_id
  //                           LEFT JOIN (
  //                             SELECT  MAX(cdkm.value) AS "value", cdkm.product_id
  //                             FROM dot_khuyen_mai km
  //                             INNER JOIN chi_tiet_dot_khuyen_mai cdkm ON km.id = cdkm.dotkhuyenmai_id
  //                             WHERE km.status = 0 AND km."start_At" <= '${nowDate}'
  //                             AND km."end_At" >= '${nowDate}'
  //                             GROUP BY cdkm.product_id
  //                           ) dkm ON dkm.product_id = p.id
  //                         WHERE cd.user_id = '${user.id}'
  //                           AND p.status = 0
  //                         GROUP BY p.id, cd.qty`;
  let queryProductCart = `SELECT p.id, p.name, (p.price * (100 - (COALESCE( MAX(dkm.value), 0 ))))/100 price, p.qty as qty_product, p.image_link,
                            cd.qty, cd.qty * (p.price * (100 - (COALESCE( MAX(dkm.value), 0 ))))/100 as total
                          FROM products p 
                            INNER JOIN cart_detail cd ON p.id = cd.product_id
                            LEFT JOIN ( 
                              SELECT  MAX(cdkm.value) AS "value", cdkm.product_id
                              FROM dot_khuyen_mai km 
                              INNER JOIN chi_tiet_dot_khuyen_mai cdkm ON km.id = cdkm.dotkhuyenmai_id
                              WHERE km.status = 0 AND km."start_At" <= NOW()
                              AND km."end_At" >= NOW()
                              GROUP BY cdkm.product_id
                            ) dkm ON dkm.product_id = p.id
                          WHERE cd.user_id = '${user.id}'
                            AND p.status = 0
                          GROUP BY p.id, cd.qty`;

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
    let nowDate = moment().utcOffset(420).format("YYYY-MM-DD HH:mm:ss");

    let cart = {};
    // let queryProductCart = `SELECT p.id, p.name, (p.price * (100 - (COALESCE( MAX(dkm.value), 0 ))))/100 price, p.qty as qty_product, p.image_link,
    //                           cd.qty, cd.qty * (p.price * (100 - (COALESCE( MAX(dkm.value), 0 ))))/100 as total
    //                         FROM products p
    //                           INNER JOIN cart_detail cd ON p.id = cd.product_id
    //                           LEFT JOIN (
    //                             SELECT  MAX(cdkm.value) AS "value", cdkm.product_id
    //                             FROM dot_khuyen_mai km
    //                             INNER JOIN chi_tiet_dot_khuyen_mai cdkm ON km.id = cdkm.dotkhuyenmai_id
    //                             WHERE km.status = 0 AND km."start_At" <= '${nowDate}'
    //                             AND km."end_At" >= '${nowDate}'
    //                             GROUP BY cdkm.product_id
    //                           ) dkm ON dkm.product_id = p.id
    //                         WHERE cd.user_id = '${user.id}'
    //                           AND p.status = 0
    //                         GROUP BY p.id, cd.qty`;
    let queryProductCart = `SELECT p.id, p.name, (p.price * (100 - (COALESCE( MAX(dkm.value), 0 ))))/100 price, p.qty as qty_product, p.image_link,
                              cd.qty, cd.qty * (p.price * (100 - (COALESCE( MAX(dkm.value), 0 ))))/100 as total
                            FROM products p 
                              INNER JOIN cart_detail cd ON p.id = cd.product_id
                              LEFT JOIN ( 
                                SELECT  MAX(cdkm.value) AS "value", cdkm.product_id
                                FROM dot_khuyen_mai km 
                                INNER JOIN chi_tiet_dot_khuyen_mai cdkm ON km.id = cdkm.dotkhuyenmai_id
                                WHERE km.status = 0 AND km."start_At" <= NOW()
                                AND km."end_At" >= NOW()
                                GROUP BY cdkm.product_id
                              ) dkm ON dkm.product_id = p.id
                            WHERE cd.user_id = '${user.id}'
                              AND p.status = 0
                            GROUP BY p.id, cd.qty`;
    let cartQuery = await db.sequelize.query(queryProductCart, {
      type: QueryTypes.SELECT,
      raw: true,
    });

    console.log(cartQuery, "cart query");

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

  let [errDP, rsDP] = await Untils.to(
    Cart_Detail.findOne({
      where: {
        product_id: product_id,
        user_id: user.id,
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
        user_id: user.id,
      },
    })
  );

  let nowDate = moment().utcOffset(420).format("YYYY-MM-DD HH:mm:ss");
  let cart = {};
  let queryProductCart = `SELECT p.id, p.name, (p.price * (100 - (COALESCE( MAX(dkm.value), 0 ))))/100 price, p.qty as qty_product, p.image_link,
                            cd.qty, cd.qty * (p.price * (100 - (COALESCE( MAX(dkm.value), 0 ))))/100 as total
                          FROM products p 
                            INNER JOIN cart_detail cd ON p.id = cd.product_id
                            LEFT JOIN ( 
                              SELECT  MAX(cdkm.value) AS "value", cdkm.product_id
                              FROM dot_khuyen_mai km 
                              INNER JOIN chi_tiet_dot_khuyen_mai cdkm ON km.id = cdkm.dotkhuyenmai_id
                              WHERE km.status = 0 AND km."start_At" <= NOW()
                              AND km."end_At" >= NOW()
                              GROUP BY cdkm.product_id
                            ) dkm ON dkm.product_id = p.id
                          WHERE cd.user_id = '${user.id}'
                            AND p.status = 0 AND p.qty > 0
                          GROUP BY p.id, cd.qty`;
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
