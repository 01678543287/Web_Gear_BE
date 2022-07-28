const express = require("express");
const { authenticateAdminToken } = require("../auth/authAdmin");
const { authenticateToken } = require("../auth/authUser");
const ServiceProduct = require("../modules/ProductService");
const Response = require("../Response");
const router = express.Router();

const { multer } = require("../upload/UploadFileCloud");

router.get("/getAllProducts", (req, res) => {
  let params = req.body;
  ServiceProduct.getAllProduct(params, (err, result) => {
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
const cpUpload = multer.fields([
  { name: "image_link", maxCount: 1 },
  { name: "image_list", maxCount: 10 },
]);
router.post("/createProduct", cpUpload, (req, res) => {
  let params = req.body;
  params.image_link = req.files["image_link"][0];
  params.image_list = req.files["image_list"];
  ServiceProduct.createProduct(params, (err, result) => {
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

router.put("/editProduct/:id", cpUpload, (req, res) => {
  let params = req.body;
  params.image_link = req.files["image_link"][0];
  params.image_list = req.files["image_list"];
  params.id = req.params.id ? req.params.id : "";
  ServiceProduct.editProduct(params, (err, result) => {
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

router.post("/deleteProduct/:id", (req, res) => {
  let params = req.body;
  params.id = req.params.id;
  ServiceProduct.deleteProduct(params, (err, result) => {
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

router.get("/getAProductDetail/:id", (req, res) => {
  let params = req.body;
  ServiceProduct.getAProductDetail(params, (err, result) => {
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
