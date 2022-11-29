const express = require("express");
const { authenticateAdminToken } = require("../auth/authAdmin");
const ChartService = require("../modules/ChartService");
const Response = require("../Response");
const router = express.Router();

router.get("/guest", authenticateAdminToken, (req, res) => {
  let params = req.body;
  params.year = req.query.year ? req.query.year : null;
  ChartService.guest(params, (err, result) => {
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

router.post("/exportGuest" /*, authenticateAdminToken*/, (req, res) => {
  let params = req.body;
  ChartService.exportGuest(params, (err, result) => {
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

router.get("/order", authenticateAdminToken, (req, res) => {
  let params = req.body;
  params.year = req.query.year;
  ChartService.order(params, (err, result) => {
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

router.post("/exportOrder" /*, authenticateAdminToken*/, (req, res) => {
  let params = req.body;
  ChartService.exportOrder(params, (err, result) => {
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

router.get("/transaction" /*, authenticateAdminToken*/, (req, res) => {
  let params = req.body;
  params.year = req.query.year;
  ChartService.transaction(params, (err, result) => {
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

router.post("/exportTransaction" /*, authenticateAdminToken*/, (req, res) => {
  let params = req.body;
  ChartService.exportTransaction(params, (err, result) => {
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

router.get("/profit" /*, authenticateAdminToken*/, (req, res) => {
  let params = req.body;
  params.year = req.query.year;
  ChartService.profit(params, (err, result) => {
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

router.post("/exportTraHang" /*, authenticateAdminToken*/, (req, res) => {
  let params = req.body;
  ChartService.exportTraHang(params, (err, result) => {
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
