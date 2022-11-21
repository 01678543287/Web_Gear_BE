const express = require("express");
const { authenticateAdminToken } = require("../auth/authAdmin");
const { authenticateToken, verifyTokenUser } = require("../auth/authUser");
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

router.get("/getAllProductsNH", (req, res) => {
  let params = req.body;
  ServiceProduct.getAllProductNH(params, (err, result) => {
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

router.get("/getAllProductsAdmin", (req, res) => {
  let params = req.body;
  ServiceProduct.getAllProductAdmin(params, (err, result) => {
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
router.post("/createProduct", authenticateAdminToken, cpUpload, (req, res) => {
  let params = req.body;
  params.image_link = req.files["image_link"]
    ? req.files["image_link"][0]
    : null;
  params.image_list = req.files["image_list"] ? req.files["image_list"] : null;
  params.user = req.user;

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

router.post(
  "/editProduct/:id",
  authenticateAdminToken,
  cpUpload,
  (req, res) => {
    let params = req.body;

    params.image_link = req.files["image_link"]
      ? req.files["image_link"][0]
      : null;

    params.image_list = req.files["image_list"]
      ? req.files["image_list"]
      : null;

    params.id = req.params.id ? req.params.id : "";
    params.user = req.user;

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
  }
);

router.post("/deleteProduct/:id", authenticateAdminToken, (req, res) => {
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

router.post("/getAProductDetail/:id", (req, res) => {
  let params = req.body;
  params.id = req.params.id;
  if (req.headers["authorization"] || req.headers["access_token"]) {
    const token = req.headers["authorization"]
      ? req.headers["authorization"]
      : req.headers["access_token"];
    params.user = verifyTokenUser(token);
  }
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
