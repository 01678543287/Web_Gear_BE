const express = require('express')
const { authenticateAdminToken } = require('../auth/authAdmin')
const { authenticateToken } = require('../auth/authUser')
const ServiceCategory = require('../modules/CategoryService')
const Response = require('../Response')
const router = express.Router()


router.get('/getAll', (req, res) => {
  let params = req.body;
  ServiceCategory.getAllCategory(params, (err, result) => {
    result = result || {};
    let { errorCode, message, data, statusCode } = result;
    if (err) return Response.Error(req, res, errorCode, message, data, statusCode, err)
    return Response.Success(req, res, 'success', result)
  })
})

router.post('/create', authenticateAdminToken, (req, res) => {
  let params = req.body;
  ServiceCategory.createCategory(params, (err, result) => {
    result = result || {};
    let { errorCode, message, data, statusCode } = result;
    if (err) return Response.Error(req, res, errorCode, message, data, statusCode, err)
    return Response.Success(req, res, 'success', result)
  })
})

router.put('/edit', authenticateAdminToken, (req, res) => {
  let params = req.body;
  ServiceCategory.editCategory(params, (err, result) => {
    result = result || {};
    let { errorCode, message, data, statusCode } = result;
    if (err) return Response.Error(req, res, errorCode, message, data, statusCode, err)
    return Response.Success(req, res, 'success', result)
  })
})

router.delete('/delete', authenticateAdminToken, (req, res) => {
  let params = req.body;
  ServiceCategory.deleteCategory(params, (err, result) => {
    result = result || {};
    let { errorCode, message, data, statusCode } = result;
    if (err) return Response.Error(req, res, errorCode, message, data, statusCode, err)
    return Response.Success(req, res, 'success', result)
  })
})


module.exports = router;