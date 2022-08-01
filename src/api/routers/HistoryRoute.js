const express = require('express')
const { authenticateAdminToken } = require('../auth/authAdmin')
const { authenticateToken } = require('../auth/authUser')
const ServiceHistory = require('../modules/HistoryService')
const Response = require('../Response')
const router = express.Router()


router.get('/getAllHistoryByUser', authenticateToken, (req, res) => {
  let params = req.body;
  params.user = req.user;
  ServiceHistory.getAllHistoryByUser(params, (err, result) => {
    result = result || {};
    let { errorCode, message, data, statusCode } = result;
    if (err) return Response.Error(req, res, errorCode, message, data, statusCode, err)
    return Response.Success(req, res, 'success', result)
  })
})

router.post('/addHistoryProduct', authenticateAdminToken, (req, res) => {
  let params = req.body;
  ServiceHistory.addHistoryProduct(params, (err, result) => {
    result = result || {};
    let { errorCode, message, data, statusCode } = result;
    if (err) return Response.Error(req, res, errorCode, message, data, statusCode, err)
    return Response.Success(req, res, 'success', result)
  })
})



module.exports = router;