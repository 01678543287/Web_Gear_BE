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
  // console.log(params, "prams");
  // return;
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

module.exports = router;
