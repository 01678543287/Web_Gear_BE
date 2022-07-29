const express = require("express");
const { authenticateAdminToken } = require("../auth/authAdmin");
const AdminService = require("../modules/AdminService");
const Response = require("../Response");
const router = express.Router();
const { multer } = require("../upload/UploadFileCloud");

const cpUpload = multer.fields([{ name: "avatar", maxCount: 1 }]);
router.post("/signUpAdmin", cpUpload, authenticateAdminToken, (req, res) => {
  let params = req.body;
  params.avatar = req.files["avatar"] ? req.files["avatar"][0] : "";
  AdminService.createAdmin(params, (err, result) => {
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

router.get("/signInAdmin",authenticateAdminToken, (req, res) => {
  let params = req.body;
  AdminService.signIn(params, (err, result) => {
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
  AdminService.lock(params, (err, result) => {
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
  AdminService.lock(params, (err, result) => {
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

router.get("/getUserByID/:user_id", (req, res) => {// chua code
  let params = req.params;
  AdminService.getUserByID(params, (err, result) => {
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

router.get("/getUsers", (req, res) => {//chua code
  let params = req.query;
  AdminService.getUsers(params, (err, result) => {
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
