const express = require("express");
const moment = require("moment");
const { authenticateAdminToken } = require("../auth/authAdmin");
const { authenticateToken, verifyTokenUser } = require("../auth/authUser");
const ServiceCart = require("../modules/CartService");
const Response = require("../Response");
const router = express.Router();

router.post("/addToCart/:product_id", (req, res) => {
  let params = req.body;
  params.product_id = req.params.product_id;
  // if (
  //   req.headers["authorization"] ||
  //   req.headers["access_token"] ||
  //   req.cookies.access_token
  // ) {
  //   const token = req.headers["authorization"]
  //     ? req.headers["authorization"]
  //     : req.headers["access_token"]
  //     ? req.headers["access_token"]
  //     : req.cookies.access_token;
  //   params.user = verifyTokenUser(token);
  // }
  params.user = verifyTokenUser(params.access_token);

  ServiceCart.addToCart(params, (err, result) => {
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
    res.clearCookie("cart");
    return Response.Success(req, res, "success", result);
  });
});

router.post("/getCartForUser", (req, res) => {
  let params = req.body;
  // console.log(params, "pa");
  // if (
  //   req.headers["authorization"] ||
  //   req.headers["access_token"] ||
  //   req.cookies.access_token
  // ) {
  //   const token = req.headers["authorization"]
  //     ? req.headers["authorization"]
  //     : req.headers["access_token"]
  //     ? req.headers["access_token"]
  //     : req.cookies.access_token;
  //   params.user = verifyTokenUser(token);
  // }
  params.user = verifyTokenUser(params.access_token);

  params.cart = req.cookies.cart ? req.cookies.cart : null;
  ServiceCart.getCartForUser(params, (err, result) => {
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
    res.cookie("cart", result.cart, { maxAge: 7 * 24 * 60 * 60 * 1000 });
    // console.log(result.cart, "rsCart");
    return Response.Success(req, res, "success", result);
  });
});

router.post("/deleteProductForCart/:product_id", (req, res) => {
  let params = req.body;
  params.product_id = req.params.product_id;
  // console.log(params, "pa");
  // if (
  //   req.headers["authorization"] ||
  //   req.headers["access_token"] ||
  //   req.cookies.access_token
  // ) {
  //   const token = req.headers["authorization"]
  //     ? req.headers["authorization"]
  //     : req.headers["access_token"]
  //     ? req.headers["access_token"]
  //     : req.cookies.access_token;
  //   params.user = verifyTokenUser(token);
  // }
  params.user = verifyTokenUser(params.access_token);

  ServiceCart.deleteProductForCart(params, (err, result) => {
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
