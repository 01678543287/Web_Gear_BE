const express = require("express");
const { authenticateAdminToken } = require("../auth/authAdmin");
const { authenticateToken, verifyTokenUser } = require("../auth/authUser");
const ServiceSearch = require("../modules/SearchingService");
const Response = require("../Response");
const router = express.Router();

const { multer } = require("../upload/UploadFileCloud");

router.post("/searchProduct/:product_name", (req, res) => {
  let params = req.body;
  params.product_name = req.params.product_name;
  ServiceSearch.searchProduct(params, (err, result) => {
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
    // console.log(result, "rs==");
    return Response.Success(req, res, "success", result);
  });
});

module.exports = router;
