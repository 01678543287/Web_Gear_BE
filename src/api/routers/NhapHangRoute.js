const express = require("express");
const moment = require("moment");
const { authenticateAdminToken } = require("../auth/authAdmin");
const { authenticateToken, verifyTokenUser } = require("../auth/authUser");
const NhapHangService = require("../modules/NhapHangService");
const Response = require("../Response");
const router = express.Router();

router.post("/nhapHang", authenticateAdminToken, (req, res) => {
  let params = req.body;
  params.user = req.user;
  NhapHangService.nhapHang(params, (err, result) => {
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

router.get("/getNhapHang", authenticateAdminToken, (req, res) => {
  let params = req.body;
  params.user = req.user;
  NhapHangService.getNhapHang(params, (err, result) => {
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

router.get("/getNHDetail/:nhaphang_id", authenticateAdminToken, (req, res) => {
  let params = req.body;
  params.user = req.user;
  params.nhaphang_id = req.params.nhaphang_id;
  NhapHangService.getNHDetail(params, (err, result) => {
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
