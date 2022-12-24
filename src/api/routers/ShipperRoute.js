const express = require("express");
const { authenticateAdminToken } = require("../auth/authAdmin");
const ShipperService = require("../modules/ShipperService");
const Response = require("../Response");
const router = express.Router();
const { multer } = require("../upload/UploadFileCloud");

const cpUpload = multer.fields([{ name: "avatar", maxCount: 1 }]);
router.post("/signUpShipper", cpUpload, authenticateAdminToken, (req, res) => {
  let params = req.body;
  ShipperService.createShipper(params, (err, result) => {
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

router.post("/signInAdmin", (req, res) => {
  let params = req.body;
  ShipperService.signIn(params, (err, result) => {
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

router.put("/lock", authenticateAdminToken, (req, res) => {
  let params = req.body;
  ShipperService.lock(params, (err, result) => {
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

router.delete("/delete", authenticateAdminToken, (req, res) => {
  let params = req.body;
  ShipperService.lock(params, (err, result) => {
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

router.post("/getAdminDetail", authenticateAdminToken, (req, res) => {
  let params = req.body;
  ShipperService.getUserByID(params, (err, result) => {
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

router.get("/getUsersAdmin", authenticateAdminToken, (req, res) => {
  let params = req.query;
  ShipperService.getUsersAdmin(params, (err, result) => {
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

router.post("/editAdmin", cpUpload, authenticateAdminToken, (req, res) => {
  let params = req.body;
  // params.avatar = req.files["avatar"] ? req.files["avatar"][0] : "";
  ShipperService.editAdmin(params, (err, result) => {
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

router.post("/verify", (req, res) => {
  let params = req.body;
  // console.log(params, "pr=======");
  ShipperService.verify(params, (err, result) => {
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

router.post("/changePassword", (req, res) => {
  let params = req.body;
  // console.log(params, "pr=======");
  ShipperService.changePassword(params, (err, result) => {
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

router.post("/forgetPassword", (req, res) => {
  let params = req.body;
  ShipperService.forgetPassword(params, (err, result) => {
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

router.get("/getListShipper", (req, res) => {
  let params = req.body;
  ShipperService.getListShipper(params, (err, result) => {
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
