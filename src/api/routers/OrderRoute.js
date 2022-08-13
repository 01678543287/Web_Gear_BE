const express = require("express");
const { authenticateAdminToken } = require("../auth/authAdmin");
const { authenticateToken } = require("../auth/authUser");
const ServiceOrder = require("../modules/OrderService");
const Response = require("../Response");
const router = express.Router();

router.get("/getOrdersForUser", authenticateToken, (req, res) => {
  let params = req.body;
  params.user = req.user;
  ServiceOrder.getOrder(params, (err, result) => {
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

router.get(
  "/getOrderDetailForUser/:order_id",
  authenticateToken,
  (req, res) => {
    let params = req.body;
    params.user = req.user;
    params.order_id = req.params.order_id;
    ServiceOrder.getOrderDetailForUser(params, (err, result) => {
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
  }
);

module.exports = router;
