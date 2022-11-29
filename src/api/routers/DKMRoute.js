const express = require("express");
const { authenticateAdminToken } = require("../auth/authAdmin");
const { authenticateToken } = require("../auth/authUser");
const ServiceDKM = require("../modules/DKMService");
const Response = require("../Response");
const router = express.Router();

router.get("/getAll", authenticateAdminToken, (req, res) => {
  let params = req.body;
  ServiceDKM.getAllDKM(params, (err, result) => {
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

router.post("/createDKM", authenticateAdminToken, (req, res) => {
  let params = req.body;
  params.user = req.user;
  ServiceDKM.createDKM(params, (err, result) => {
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

router.get("/getDKM/:dkm_id", (req, res) => {
  let params = req.body;
  params.user = req.user;
  params.dkm_id = req.params.dkm_id;
  ServiceDKM.getDKMByID(params, (err, result) => {
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

router.put("/edit", authenticateAdminToken, (req, res) => {
  let params = req.body;
  params.user = req.user;
  ServiceDKM.editDKM(params, (err, result) => {
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

router.post("/delete", authenticateAdminToken, (req, res) => {
  let params = req.body;
  ServiceDKM.deleteDKM(params, (err, result) => {
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
