const express = require("express");
const { authenticateAdminToken } = require("../auth/authAdmin");
const { authenticateToken } = require("../auth/authUser");
const ServiceCheckout = require("../modules/CheckoutService");
const Response = require("../Response");
const router = express.Router();

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

module.exports = router;
