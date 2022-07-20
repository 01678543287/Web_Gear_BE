const { DateTime } = require("luxon");
const { eachLimit } = require("async");
const async = require("async")
const bcrypt = require("bcrypt")

const db = require('../../config/connectDB')
const User = require('../../models/Users')

const Untils = require('../modules/Untils')
const _error = Untils._error
const MESSAGESCONFIG = require('../Messages');
const { sequelize } = require("../../config/connectDB");
const MESSAGES = MESSAGESCONFIG.messages

let Service = {}

Service.createUser = async (params, callback) => {
    let { name, age, email, phone, address, password } = params;
    if (!email || !password) {
        result = _error(1000, err)
        return callback(1000, { data: result })
    }

    let dataUser = {
        name: name,
        age: age,
        email: email,
        address: address,
        password: password,
        phone: phone,
        role: 0,
        new: 0
    }
    let result, err;
    [err, result] = await Untils.to(User.create( dataUser, {raw: true }))

    if (err) {
        result = _error(400,err,err.errors[0].message);
        return callback(400, {data: result})
    }
}

module.exports = Service