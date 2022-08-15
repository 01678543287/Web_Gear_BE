const express = require("express");
const { authenticateAdminToken } = require("../auth/authAdmin");
const { authenticateToken } = require("../auth/authUser");
const ServiceCheckout = require("../modules/CheckoutService");
const Response = require("../Response");
const router = express.Router();
const stripe = require("stripe")(process.env.KEY_SECRET_STRIPE);

const Untils = require("../modules/Untils");
const _error = Untils._error;
const _success = Untils._success;
const Cart = require("../../models/Cart");
const CartDetail = require("../../models/Cart_Detail");
const Product = require("../../models/Product");

router.post("/", authenticateToken, (req, res) => {
  let params = req.body;
  params.user = req.user;
  ServiceCheckout.checkout(params, (err, result) => {
    result = result || {};
    let { errorCode, message, data, statusCode } = result;
    if (err)
      return Response.Error(
        req,
        res,
        errorCode,
        message,
        data,
        statusCode,
        err
      );
    return Response.Success(req, res, "success", result);
  });
});

router.post("/create-checkout-session", authenticateToken, async (req, res) => {
  const params = req.body;
  params.user = req.user;
  let { user, userCheckout, price, discount, note } = params;

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
    products: rsCartDe,
    user_checkout: userCheckout,
  };

  console.log(dataOrd);
  const session = await stripe.checkout.sessions.create({
    line_items: 
    [
      {
        price_data: {
          currency: "vnd",
          product_data: {
            name: "T-shirt",
          },
          unit_amount: 200000,
        },
        quantity: 1,
      },
      {
        price_data: {
          currency: "vnd",
          product_data: {
            name: "Áo thun",
          },
          unit_amount: 300000,
        },
        quantity: 2,
      },
    ]
    ,
    mode: "payment",
    success_url: `${process.env.CLIENT_URL}/order/`,
    cancel_url: `${process.env.CLIENT_URL}/ecommerce/checkout`,
  });

  res.send({ url: session.url });
});

module.exports = router;
