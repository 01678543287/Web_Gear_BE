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
    // console.log(params, "pr=====");
    // // return;
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

router.get("/getTHDetailForUser/:order_id", authenticateToken, (req, res) => {
  let params = req.body;
  params.user = req.user;
  params.order_id = req.params.order_id;
  // console.log(params, "pr=====");
  // // return;
  ServiceOrder.getTHDetailForUser(params, (err, result) => {
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

router.get("/getOrderAdmin", authenticateAdminToken, (req, res) => {
  let params = req.body;
  params.user = req.user;
  ServiceOrder.getOrderAdmin(params, (err, result) => {
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

router.get("/getTHAdmin", authenticateAdminToken, (req, res) => {
  let params = req.body;
  params.user = req.user;
  ServiceOrder.getTHAdmin(params, (err, result) => {
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

router.post("/getOrderAdminStatus", authenticateAdminToken, (req, res) => {
  let params = req.body;
  params.user = req.user;
  ServiceOrder.getOrderAdminStatus(params, (err, result) => {
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

router.post("/changeStatusOrder", authenticateToken, (req, res) => {
  let params = req.body;
  params.user = req.user;
  // console.log(params, "pr=0=0");
  // return;
  ServiceOrder.changeStatusOrder(params, (err, result) => {
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

router.post("/setRateOrderDetail", authenticateToken, (req, res) => {
  let params = req.body;
  params.user = req.user;
  ServiceOrder.setRate(params, (err, result) => {
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

router.post("/cancel", authenticateToken, (req, res) => {
  let params = req.body;
  params.user = req.user;
  ServiceOrder.cancel(params, (err, result) => {
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

router.post("/return", authenticateToken, (req, res) => {
  let params = req.body;
  params.user = req.user;
  ServiceOrder.return(params, (err, result) => {
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
