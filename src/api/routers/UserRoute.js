const express = require('express')
const { authenticateAdminToken } = require('../auth/authAdmin')
const { authenticateToken } = require('../auth/authUser')
const UserService = require('../modules/UserService')
const Response = require('../Response')
const router = express.Router()


router.post('/signUp', (req, res) => {
    let params = req.body;
    UserService.createUser(params, (err, result) => {
        result = result || {};
        let { errorCode, message, data, statusCode } = result;
        if (err) return Response.Error(req, res, errorCode, message, data, statusCode, err)
        return Response.Success(req, res, 'success', result)
    })
})

router.get('/signIn', (req, res) => {
    let params = req.body;
    UserService.signIn(params, (err, result) => {
        result = result || {};
        let { errorCode, message, data, statusCode } = result;
        if (err) return Response.Error(req, res, errorCode, message, data, statusCode, err)
        return Response.Success(req, res, 'success', result)
    })
})

router.put('/lock',authenticateAdminToken, (req, res) => {
    let params = req.body;
    UserService.lock(params, (err, result) => {
        result = result || {};
        let { errorCode, message, data, statusCode } = result;
        if (err) return Response.Error(req, res, errorCode, message, data, statusCode, err)
        return Response.Success(req, res, 'success', result)
    })
})

router.delete('/delete',authenticateAdminToken, (req, res) => {
    let params = req.body;
    UserService.lock(params, (err, result) => {
        result = result || {};
        let { errorCode, message, data, statusCode } = result;
        if (err) return Response.Error(req, res, errorCode, message, data, statusCode, err)
        return Response.Success(req, res, 'success', result)
    })
})

module.exports = router