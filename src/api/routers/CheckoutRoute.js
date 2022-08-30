const express = require("express");
const { authenticateAdminToken } = require("../auth/authAdmin");
const { authenticateToken } = require("../auth/authUser");
const ServiceCheckout = require("../modules/CheckoutService");
const router = express.Router();
const stripe = require("stripe")(process.env.KEY_SECRET_STRIPE);

const Response = require("../Response");
const Untils = require("../modules/Untils");
const _error = Untils._error;
const _success = Untils._success;
const Cart = require("../../models/Cart");
const CartDetail = require("../../models/Cart_Detail");
const Order = require("../../models/Order");
const Product = require("../../models/Product");
const Transaction = require("../../models/Transaction");

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

  let errCartDe, rsCartDe;
  [errCartDe, rsCartDe] = await Untils.to(
    CartDetail.findAll({ where: { card_id: rsCart.id }, raw: true })
  );

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

  console.log(userCheckout);
  const customer = await stripe.customers.create({
    metadata: {
      userId: user.id,
      userCheckout: JSON.stringify({
        name: userCheckout.name,
        address: userCheckout.address,
        phone: userCheckout.phone,
        email: userCheckout.email,
      }),
      cart: rsCart.id,
    },
  });

  const line_items = dataOrd.products.map((item) => {
    return {
      price_data: {
        currency: "vnd",
        product_data: {
          name: item.product.name,
          images: [item.product.image_link],
          description: note,
          metadata: {
            id: item.product.id,
          },
        },
        unit_amount: item.product.price,
      },
      quantity: item.qty,
    };
  });

  const session = await stripe.checkout.sessions.create({
    customer: customer.id,
    line_items: line_items,
    mode: "payment",
    success_url: `${process.env.CLIENT_URL}/order/`,
    cancel_url: `${process.env.CLIENT_URL}/ecommerce/checkout`,
  });

  res.send({ url: session.url });
});

// This is your Stripe CLI webhook secret for testing your endpoint locally.
let endpointSecret;
// endpointSecret =
//   "whsec_c698a89fc210e6e427793f1261baa60170ee043cc9d5d5f26ed0e4e8b6eda22b";

router.post( "/webhook", express.raw({ type: "application/json" }),(req, res) => {
    const sig = req.headers["stripe-signature"];

    let data;
    let eventType;

    if (endpointSecret) {
      let event;

      try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        console.log("Webhook verified");
      } catch (err) {
        console.log(`Webhook Error: ${err.message}`);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
      }
      data = event.data.object;
      eventType = event.type;
    } else {
      data = req.body.data.object;
      eventType = req.body.type;
    }
    console.log(eventType, "typeeee======");
    // Handle the event
    if (eventType === "checkout.session.completed") {
      stripe.customers
        .retrieve(data.customer)
        .then(async (customer) => {
          console.log(customer, "customer=0=0=0=0=0=0");
          console.log(data, "data=====");

          let findCart = {
            where: {
              id: customer.metadata.cart,
            },
            raw: true,
          };

          let errCart, rsCart;
          [errCart, rsCart] = await Untils.to(Cart.findOne(findCart));
          if (errCart) {
            console.log(`find Cart error: ${errCart}`);
          }
          // if (!rsCart) {
          //   let result = _error(404);
          //   return callback(404, { data: result });
          // }

          let errCartDe, rsCartDe;
          [errCartDe, rsCartDe] = await Untils.to(
            CartDetail.findAll({
              where: { card_id: customer.metadata.cart },
              raw: true,
            })
          );
          if (errCartDe) {
            console.log(`find Cart error: ${errCartDe}`);
          }
          // if (!rsCartDe) {
          //   let result = _error(404);
          //   return callback(404, { data: result });
          // }

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

          let dataOrd = {
            user_id: customer.metadata.userId,
            discount: 0,
            total: data.amount_total,
            card_id: customer.metadata.cart,
            status: 3,
            note: "",
            products: JSON.stringify(rsCartDe),
            user_checkout: customer.metadata.userCheckout,
          };

          let errOrd, rsOrd;
          [errOrd, rsOrd] = await Untils.to(Order.create(dataOrd));
          if (errOrd) {
            console.log(`create Order error: ${errOrd}`);
          }

          //create transaction
          let dataTransaction = {
            order_id: rsOrd.id,
            amount: data.amount_total,
            status: 3, // waiting comfirm
            user_id: customer.metadata.userId,
          };
          let errTrans, rsTrans;
          [errTrans, rsTrans] = await Untils.to(
            Transaction.create(dataTransaction)
          );
          if (errTrans) {
            console.log(`create Order error: ${errTrans}`);
          }

          //unactive cart
          [errCart, rsCart] = await Untils.to(
            Cart.update(
              { status: 1 },
              { where: { id: customer.metadata.cart } }
            )
          );
          if (errCart) {
            console.log(`create Order error: ${errCart}`);
          }
        })
        .catch((err) => console.log(err.message, "message ERROR"));
    }

    // Return a 200 res to acknowledge receipt of the event
    res.send().end();
  }
);
//end Stripe Payment

module.exports = router;
