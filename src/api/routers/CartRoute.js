const express = require("express");
const moment = require('moment');
const { authenticateAdminToken } = require("../auth/authAdmin");
const { authenticateToken, verifyTokenUser } = require("../auth/authUser");
const ServiceCart = require("../modules/CartService");
const Response = require("../Response");
const router = express.Router();

router.post("/addToCart/:product_id", (req, res) => {
  let params = req.body;
  params.product_id = req.params.product_id;
  if (
    req.headers["authorization"] ||
    req.headers["access_token"] ||
    req.cookies.access_token
  ) {
    const token = req.headers["authorization"]
      ? req.headers["authorization"]
      : req.headers["access_token"]
      ? req.headers["access_token"]
      : req.cookies.access_token;
    params.user = verifyTokenUser(token);
  }
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

router.get("/getCartForUser", authenticateToken, (req, res) => {
  let params = req.body;
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
  params.user = req.user;
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
    return Response.Success(req, res, "success", result);
  });
});

module.exports = router;
