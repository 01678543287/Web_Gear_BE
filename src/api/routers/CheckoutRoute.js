const express = require("express");
const { authenticateAdminToken } = require("../auth/authAdmin");
const { authenticateToken } = require("../auth/authUser");
const ServiceCheckout = require("../modules/CheckoutService");
const router = express.Router();
const stripe = require("stripe")(process.env.KEY_SECRET_STRIPE);
const moment = require("moment");
const { QueryTypes, Op } = require("sequelize");
const crypto = require("crypto");
const https = require("https");
const request = require("request");

const { sequelize } = require("../../config/connectDB");
const db = require("../../config/connectDB");
const Response = require("../Response");
const Untils = require("../modules/Utils");
const _error = Untils._error;
const _success = Untils._success;

const CartDetail = require("../../models/Cart_Detail");
const Order = require("../../models/Order");
const Product = require("../../models/Product");
const Cart_Detail = require("../../models/Cart_Detail");
const Order_Detail = require("../../models/Order_Detail");

const mailer = require("../sendEmail/sendEmail");

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

router.post(
  "/create-checkout-session-momo",
  authenticateToken,
  (req, response) => {
    let params = req.body;
    params.user = req.user;
    // console.log(params)
    // return;;
    ServiceCheckout.checkoutMoMo(params, (err, result) => {
      result = result || {};
      let { errorCode, message, data, statusCode } = result;
      if (err)
        return Response.Error(
          req,
          response,
          errorCode,
          message,
          data,
          statusCode,
          err
        );
      // return Response.Success(req, res, "success", result);
      //redirectUrl MOMO
      let {
        user,
        userCheckout,
        price,
        discount,
        note,
        code_voucher,
        cartList,
      } = params;
      let { orderData } = result;

      var partnerCode = "MOMO";
      var accessKey = "F8BBA842ECF85";
      var secretkey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
      var requestId = partnerCode + new Date().getTime();
      var orderId = orderData.id;
      var orderInfo = "pay with MoMo";
      var redirectUrl = `${process.env.CLIENT_URL}/order/`;
      var ipnUrl = "https://callback.url/notify";
      var amount = price - discount;
      var requestType = "captureWallet";
      var extraData = "";

      var rawSignature =
        "accessKey=" +
        accessKey +
        "&amount=" +
        amount +
        "&extraData=" +
        extraData +
        "&ipnUrl=" +
        ipnUrl +
        "&orderId=" +
        orderId +
        "&orderInfo=" +
        orderInfo +
        "&partnerCode=" +
        partnerCode +
        "&redirectUrl=" +
        redirectUrl +
        "&requestId=" +
        requestId +
        "&requestType=" +
        requestType;

      var signature = crypto
        .createHmac("sha256", secretkey)
        .update(rawSignature)
        .digest("hex");

      const requestBody = JSON.stringify({
        partnerCode: partnerCode,
        accessKey: accessKey,
        requestId: requestId,
        amount: amount,
        orderId: orderId,
        orderInfo: orderInfo,
        redirectUrl: redirectUrl,
        ipnUrl: ipnUrl,
        extraData: extraData,
        requestType: requestType,
        signature: signature,
        lang: "en",
      });

      // const options = {
      //   hostname: "test-payment.momo.vn",
      //   port: 443,
      //   path: "/v2/gateway/api/create",
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     "Content-Length": Buffer.byteLength(requestBody),
      //   },
      // };

      // const reqMOMO = https.request(options, (res) => {
      //   // console.log(`Status: ${res.statusCode}`);
      //   // console.log(`Headers: ${JSON.stringify(res.headers)}`);
      //   res.setEncoding("utf8");
      //   res.on("data", async (body) => {
      //     // console.log("Body: ");
      //     // console.log(body);
      //     // console.log("payUrl: ");
      //     // console.log(JSON.parse(body).payUrl);
      //     // const payUrl = JSON.parse(body).payUrl;
      //     let payUrl = Untils.safeParse(body);
      //     if (payUrl) {
      //       response.send({ url: payUrl.payUrl });
      //     }
      //   });

      //   res.on("end", () => {
      //     console.log("No more data in response.");
      //   });
      // });

      // reqMOMO.on("error", (e) => {
      //   console.log(`problem with request: ${e.message}`);
      // });

      // console.log("Sending....");
      // reqMOMO.write(requestBody);
      // reqMOMO.end();

      request(
        {
          url: "https://test-payment.momo.vn/v2/gateway/api/create",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: requestBody,
        },
        (err, res, body) => {
          // console.log(err, "err");
          // console.log(res, "response");
          // console.log(body, "body");
          let payUrl = Untils.safeParse(body);
          if (payUrl) {
            response.send({ url: payUrl.payUrl });
          }
        }
      );
      // }
    });
  }
);

router.post(
  "/create-checkout-session",
  authenticateToken,
  async (req, response) => {
    const params = req.body;
    params.user = req.user;
    let { user, userCheckout, price, discount, note, cartList, partner } =
      params;

    let errCartDe, rsCartDe;
    [errCartDe, rsCartDe] = await Untils.to(
      CartDetail.findAll({ where: { user_id: user.id }, raw: true })
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
      status: 0,
      note: note ? note : null,
      user_checkout: userCheckout,
    };

    let [ecartDetail, rsCartDetail] = await Untils.to(
      CartDetail.findAll({ where: { user_id: user.id, status: 0 }, raw: true })
    );
    if (ecartDetail) {
      console.log(`find  cart details error user: ${user.id}`);
    }
    let products = [];
    for (item of rsCartDetail) {
      let [eP, rP] = await Untils.to(
        Product.findOne({ where: { id: item.product_id }, raw: true })
      );
      if (eP) {
        console.log("error find product");
      }
      item.name = rP.name;
      item.image_link = Untils.linkImage + rP.image_link;
    }

    const customer = await stripe.customers.create({
      metadata: {
        userId: user.id,
        userCheckout: JSON.stringify({
          name: userCheckout.name,
          address: userCheckout.address,
          phone: userCheckout.phone,
          email: userCheckout.email,
        }),
        user_id: user.id,
      },
    });

    const line_items = cartList.map((item) => {
      return {
        price_data: {
          currency: "vnd",
          product_data: {
            name: item.name,
            images: [item.image_link],
            description: note,
            metadata: {
              id: item.id,
            },
          },
          unit_amount: parseInt(item.price),
        },
        quantity: parseInt(item.qty),
      };
    });

    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      line_items: line_items,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/order/`,
      cancel_url: `${process.env.CLIENT_URL}/ecommerce/checkout`,
    });

    response.send({ url: session.url });
    // }
  }
);

// This is your Stripe CLI webhook secret for testing your endpoint locally.
let endpointSecret;
// endpointSecret =
//   "whsec_c698a89fc210e6e427793f1261baa60170ee043cc9d5d5f26ed0e4e8b6eda22b";

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (req, res) => {
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

    // Handle the event
    if (eventType === "checkout.session.completed") {
      stripe.customers
        .retrieve(data.customer)
        .then(async (customer) => {
          let nowDate = moment().utcOffset(420).format("YYYY-MM-DD HH:mm:ss");
          let queryProductCart = `SELECT p.id, p.name, (p.price * (100 - (COALESCE( MAX(dkm.value), 0 ))))/100 price, p.qty as qty_product, p.image_link,
                              cd.qty, cd.qty * (p.price * (100 - (COALESCE( MAX(dkm.value), 0 ))))/100 as total
                            FROM products p 
                              INNER JOIN cart_detail cd ON p.id = cd.product_id
                              LEFT JOIN ( 
                                SELECT  MAX(cdkm.value) AS "value", cdkm.product_id
                                FROM dot_khuyen_mai km 
                                INNER JOIN chi_tiet_dot_khuyen_mai cdkm ON km.id = cdkm.dotkhuyenmai_id
                                WHERE km.status = 0 AND km."start_At" <= '${nowDate}'
                                AND km."end_At" >= '${nowDate}'
                                GROUP BY cdkm.product_id
                              ) dkm ON dkm.product_id = p.id
                            WHERE cd.user_id = '${customer.metadata.userId}'
                              AND p.status = 0
                            GROUP BY p.id, cd.qty`;
          let cartQuery = await db.sequelize.query(queryProductCart, {
            type: QueryTypes.SELECT,
            raw: true,
          });
          // console.log(cartQuery, "webhook cart detail");

          let dataOrd = {
            user_id: customer.metadata.userId,
            discount: 0,
            total: data.amount_total,
            // card_id: customer.metadata.cart,
            status: 3,
            // note: "",
            // products: JSON.stringify(rsCartDe),
            user_checkout: customer.metadata.userCheckout,
            payment_intent: req.body.data.object.payment_intent,
          };

          let errOrd, rsOrd;
          [errOrd, rsOrd] = await Untils.to(Order.create(dataOrd));
          if (errOrd) {
            console.log(`create Order error: ${errOrd}`);
          }

          let dataOrderDetails = cartQuery.map((item) => {
            return {
              order_id: rsOrd ? rsOrd.id : null,
              product_id: item.id,
              price: parseInt(item.price),
              qty: parseInt(item.qty),
            };
          });

          let [errCreateOD, rsOD] = await Untils.to(
            Order_Detail.bulkCreate(dataOrderDetails)
          );
          if (errCreateOD) {
            console.log(`create Order error: ${errCreateOD}`);
          }

          //detroy cart details
          let [errC, rsC] = await Untils.to(
            Cart_Detail.destroy({
              where: { user_id: customer.metadata.user_id },
            })
          );
          if (errC) {
            console.log(`create Order error: ${errCart}`);
          }

          //sendMail
          mailer.sendMail(
            req.body.data.object.customer_details.email,
            "Checkout Success",
            `
            <!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
        
        <head>
          <!--[if gte mso 9]>
        <xml>
          <o:OfficeDocumentSettings>
            <o:AllowPNG/>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
        <![endif]-->
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta name="x-apple-disable-message-reformatting">
          <!--[if !mso]><!-->
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <!--<![endif]-->
          <title></title>
        
          <style type="text/css">
            @media only screen and (min-width: 620px) {
              .u-row {
                width: 600px !important;
              }
              .u-row .u-col {
                vertical-align: top;
              }
              .u-row .u-col-100 {
                width: 600px !important;
              }
            }
            
            @media (max-width: 620px) {
              .u-row-container {
                max-width: 100% !important;
                padding-left: 0px !important;
                padding-right: 0px !important;
              }
              .u-row .u-col {
                min-width: 320px !important;
                max-width: 100% !important;
                display: block !important;
              }
              .u-row {
                width: calc(100% - 40px) !important;
              }
              .u-col {
                width: 100% !important;
              }
              .u-col>div {
                margin: 0 auto;
              }
            }
            
            body {
              margin: 0;
              padding: 0;
            }
            
            table,
            tr,
            td {
              vertical-align: top;
              border-collapse: collapse;
            }
            
            p {
              margin: 0;
            }
            
            .ie-container table,
            .mso-container table {
              table-layout: fixed;
            }
            
            * {
              line-height: inherit;
            }
            
            a[x-apple-data-detectors='true'] {
              color: inherit !important;
              text-decoration: none !important;
            }
            
            table,
            td {
              color: #000000;
            }
          </style>
        
        
        
          <!--[if !mso]><!-->
          <link href="https://fonts.googleapis.com/css?family=Cabin:400,700" rel="stylesheet" type="text/css">
          <!--<![endif]-->
        
        </head>
        
        <body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #f9f9f9;color: #000000">
          <!--[if IE]><div class="ie-container"><![endif]-->
          <!--[if mso]><div class="mso-container"><![endif]-->
          <table style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #f9f9f9;width:100%" cellpadding="0" cellspacing="0">
            <tbody>
              <tr style="vertical-align: top">
                <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                  <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #f9f9f9;"><![endif]-->
        
        
                  <div class="u-row-container" style="padding: 0px;background-color: transparent">
                    <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
                      <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                        <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->
        
                        <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                        <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                          <div style="height: 100%;width: 100% !important;">
                            <!--[if (!mso)&(!IE)]><!-->
                            <div style="height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                              <!--<![endif]-->
        
                              <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                <tbody>
                                  <tr>
                                    <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Cabin',sans-serif;" align="left">
        
                                      <div style="color: #afb0c7; line-height: 170%; text-align: center; word-wrap: break-word;">
                                        <p style="font-size: 14px; line-height: 170%;"><span style="font-size: 14px; line-height: 23.8px;">View Email in Browser</span></p>
                                      </div>
        
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
        
                              <!--[if (!mso)&(!IE)]><!-->
                            </div>
                            <!--<![endif]-->
                          </div>
                        </div>
                        <!--[if (mso)|(IE)]></td><![endif]-->
                        <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                      </div>
                    </div>
                  </div>
        
        
        
                  <div class="u-row-container" style="padding: 0px;background-color: transparent">
                    <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
                      <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                        <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]-->
        
                        <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                        <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                          <div style="height: 100%;width: 100% !important;">
                            <!--[if (!mso)&(!IE)]><!-->
                            <div style="height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                              <!--<![endif]-->
        
                              <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                <tbody>
                                  <tr>
                                    <td style="overflow-wrap:break-word;word-break:break-word;padding:20px;font-family:'Cabin',sans-serif;" align="left">
        
                                      <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                        <tr>
                                          <td style="padding-right: 0px;padding-left: 0px;" align="center">
        
                                            <img align="center" border="0" src="https://assets.unlayer.com/projects/98363/1661829414323-gofiggym.png" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 32%;max-width: 179.2px;"
                                              width="179.2" />
        
                                          </td>
                                        </tr>
                                      </table>
        
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
        
                              <!--[if (!mso)&(!IE)]><!-->
                            </div>
                            <!--<![endif]-->
                          </div>
                        </div>
                        <!--[if (mso)|(IE)]></td><![endif]-->
                        <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                      </div>
                    </div>
                  </div>
        
        
        
                  <div class="u-row-container" style="padding: 0px;background-color: transparent">
                    <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #003399;">
                      <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                        <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #003399;"><![endif]-->
        
                        <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                        <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                          <div style="height: 100%;width: 100% !important;">
                            <!--[if (!mso)&(!IE)]><!-->
                            <div style="height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                              <!--<![endif]-->
        
                              <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                <tbody>
                                  <tr>
                                    <td style="overflow-wrap:break-word;word-break:break-word;padding:40px 10px 10px;font-family:'Cabin',sans-serif;" align="left">
        
                                      <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                        <tr>
                                          <td style="padding-right: 0px;padding-left: 0px;" align="center">
        
                                            <img align="center" border="0" src="https://cdn.templates.unlayer.com/assets/1597218650916-xxxxc.png" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 26%;max-width: 150.8px;"
                                              width="150.8" />
        
                                          </td>
                                        </tr>
                                      </table>
        
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
        
                              <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                <tbody>
                                  <tr>
                                    <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Cabin',sans-serif;" align="left">
        
                                      <div style="color: #e5eaf5; line-height: 140%; text-align: center; word-wrap: break-word;">
                                        <p style="font-size: 14px; line-height: 140%;">Đặt hàng</p>
                                      </div>
        
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
        
                              <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                <tbody>
                                  <tr>
                                    <td style="overflow-wrap:break-word;word-break:break-word;padding:0px 10px 31px;font-family:'Cabin',sans-serif;" align="left">
        
                                      <div style="color: #e5eaf5; line-height: 140%; text-align: center; word-wrap: break-word;">
                                        <p style="font-size: 14px; line-height: 140%;"><span style="font-size: 28px; line-height: 39.2px;"><strong><span style="line-height: 39.2px; font-size: 28px;">Đặt hàng thành công</span></strong>
                                          </span>
                                        </p>
                                      </div>
        
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
        
                              <!--[if (!mso)&(!IE)]><!-->
                            </div>
                            <!--<![endif]-->
                          </div>
                        </div>
                        <!--[if (mso)|(IE)]></td><![endif]-->
                        <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                      </div>
                    </div>
                  </div>
        
        
        
                  <div class="u-row-container" style="padding: 0px;background-color: transparent">
                    <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
                      <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                        <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]-->
        
                        <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                        <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                          <div style="height: 100%;width: 100% !important;">
                            <!--[if (!mso)&(!IE)]><!-->
                            <div style="height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                              <!--<![endif]-->
        
                              <!--[if (!mso)&(!IE)]><!-->
                            </div>
                            <!--<![endif]-->
                          </div>
                        </div>
                        <!--[if (mso)|(IE)]></td><![endif]-->
                        <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                      </div>
                    </div>
                  </div>
        
        
        
                  <div class="u-row-container" style="padding: 0px;background-color: transparent">
                    <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #e5eaf5;">
                      <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                        <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #e5eaf5;"><![endif]-->
        
                        <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                        <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                          <div style="height: 100%;width: 100% !important;">
                            <!--[if (!mso)&(!IE)]><!-->
                            <div style="height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                              <!--<![endif]-->
        
                              <!--[if (!mso)&(!IE)]><!-->
                            </div>
                            <!--<![endif]-->
                          </div>
                        </div>
                        <!--[if (mso)|(IE)]></td><![endif]-->
                        <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                      </div>
                    </div>
                  </div>
        
        
        
                  <div class="u-row-container" style="padding: 0px;background-color: transparent">
                    <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #003399;">
                      <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                        <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #003399;"><![endif]-->
        
                        <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                        <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                          <div style="height: 100%;width: 100% !important;">
                            <!--[if (!mso)&(!IE)]><!-->
                            <div style="height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                              <!--<![endif]-->
        
                              <!--[if (!mso)&(!IE)]><!-->
                            </div>
                            <!--<![endif]-->
                          </div>
                        </div>
                        <!--[if (mso)|(IE)]></td><![endif]-->
                        <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                      </div>
                    </div>
                  </div>
        
        
                  <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                </td>
              </tr>
            </tbody>
          </table>
          <!--[if mso]></div><![endif]-->
          <!--[if IE]></div><![endif]-->
        </body>
        
        </html>
            `
          );
          console.log("send mail successfully");
        })
        .catch((err) => console.log(err.message, "message ERROR"));
    }

    // Return a 200 res to acknowledge receipt of the event
    res.send().end();
  }
);
//end Stripe Payment

router.post("/callbackMoMo", authenticateToken, (req, res) => {
  let params = req.body;
  params.user = req.user;
  // return;
  ServiceCheckout.callbackMoMo(params, (err, result) => {
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

module.exports = router;
