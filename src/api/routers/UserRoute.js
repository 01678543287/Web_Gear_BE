const express = require("express");
const { authenticateAdminToken } = require("../auth/authAdmin");
const { authenticateToken } = require("../auth/authUser");
const UserService = require("../modules/UserService");
const Response = require("../Response");
const router = express.Router();
const { multer } = require("../upload/UploadFileCloud");

const cpUpload = multer.fields([{ name: "avatar", maxCount: 1 }]);
router.post("/signUp", cpUpload, (req, res) => {
  let params = req.body;
  // params.avatar = req.files ? req.files["avatar"][0] : null;
  UserService.createUser(params, (err, result) => {
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
    res.cookie("access_token", result.access_token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return Response.Success(req, res, "success", result);
  });
});

router.post("/signIn", (req, res) => {
  let params = req.body;
  console.log(params, "pr=======");
  UserService.signIn(params, (err, result) => {
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
    res.cookie("access_token", result.access_token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return Response.Success(req, res, "success", result);
  });
});

router.put("/lock", authenticateAdminToken, (req, res) => {
  let params = req.body;
  UserService.lock(params, (err, result) => {
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
  UserService.lock(params, (err, result) => {
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

router.get("/getUserByID/:user_id", (req, res) => {
  let params = req.params;
  UserService.getUserByID(params, (err, result) => {
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

router.get("/getUsers", authenticateAdminToken, (req, res) => {
  let params = req.query;
  UserService.getUsers(params, (err, result) => {
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
