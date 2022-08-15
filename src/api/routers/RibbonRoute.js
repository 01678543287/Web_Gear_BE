const express = require("express");
const { authenticateAdminToken } = require("../auth/authAdmin");
const { authenticateToken } = require("../auth/authUser");
const ServiceRibbon = require("../modules/RibbonService");
const Response = require("../Response");
const router = express.Router();

router.get("/getRibbon", (req, res) => {
  let params = req.body;
  ServiceRibbon.getRibbon(params, (err, result) => {
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
