const express = require('express')
const { authenticateAdminToken } = require('../auth/authAdmin')
const { authenticateToken } = require('../auth/authUser')
const ServiceVoucher = require('../modules/VoucherService')
const Response = require('../Response')
const router = express.Router()

router.get('/use', authenticateToken, (req, res) => {
  let params = req.body;
  params.user = req.user;
  ServiceVoucher.useVoucher(params, (err, result) => {
    result = result || {};
    let { errorCode, message, data, statusCode } = result;
    if (err) return Response.Error(req, res, errorCode, message, data, statusCode, err)
    return Response.Success(req, res, 'success', result)
  })
})

router.post('/sendVoucherForUser', authenticateAdminToken, (req, res) => {
  let params = req.body;
  ServiceVoucher.sendVoucherForUser(params, (err, result) => {
    result = result || {};
    let { errorCode, message, data, statusCode } = result;
    if (err) return Response.Error(req, res, errorCode, message, data, statusCode, err)
    return Response.Success(req, res, 'success', result)
  })
})

router.post('/sendVoucherForAllUsers', authenticateAdminToken, (req, res) => {
  let params = req.body;
  ServiceVoucher.sendVoucherForAllUsers(params, (err, result) => {
    result = result || {};
    let { errorCode, message, data, statusCode } = result;
    if (err) return Response.Error(req, res, errorCode, message, data, statusCode, err)
    return Response.Success(req, res, 'success', result)
  })
})

module.exports = router;