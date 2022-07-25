const express = require('express')
const { authenticateAdminToken } = require('../auth/authAdmin')
const { authenticateToken } = require('../auth/authUser')
const ServiceWarehouse = require('../modules/WarehouseService')
const Response = require('../Response')
const router = express.Router()

router.get('/getAllWarehouse', authenticateAdminToken, (req, res) => {
  let params = req.body;
  ServiceWarehouse.getAllWarehouse(params, (err, result) => {
    result = result || {};
    let { errorCode, message, data, statusCode } = result;
    if (err) return Response.Error(req, res, errorCode, message, data, statusCode, err)
    return Response.Success(req, res, 'success', result)
  })
})

router.post('/createWarehouse', authenticateAdminToken, (req, res) => {
  let params = req.body;
  ServiceWarehouse.createWarehouse(params, (err, result) => {
    result = result || {};
    let { errorCode, message, data, statusCode } = result;
    if (err) return Response.Error(req, res, errorCode, message, data, statusCode, err)
    return Response.Success(req, res, 'success', result)
  })
})

router.put('/lockWarehouse', authenticateAdminToken, (req, res) => {
  let params = req.body;
  ServiceWarehouse.lockWarehouse(params, (err, result) => {
    result = result || {};
    let { errorCode, message, data, statusCode } = result;
    if (err) return Response.Error(req, res, errorCode, message, data, statusCode, err)
    return Response.Success(req, res, 'success', result)
  })
})

router.put('/unLockWarehouse', authenticateAdminToken, (req, res) => {
  let params = req.body;
  ServiceWarehouse.unLockWarehouse(params, (err, result) => {
    result = result || {};
    let { errorCode, message, data, statusCode } = result;
    if (err) return Response.Error(req, res, errorCode, message, data, statusCode, err)
    return Response.Success(req, res, 'success', result)
  })
})

router.delete('/deleteWarehouse', authenticateAdminToken, (req, res) => {
  let params = req.body;
  ServiceWarehouse.deleteWarehouse(params, (err, result) => {
    result = result || {};
    let { errorCode, message, data, statusCode } = result;
    if (err) return Response.Error(req, res, errorCode, message, data, statusCode, err)
    return Response.Success(req, res, 'success', result)
  })
})
module.exports = router;