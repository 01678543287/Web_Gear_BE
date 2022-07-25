const { DateTime } = require("luxon");
const { eachLimit } = require("async");

const db = require('../../config/connectDB')
const History = require('../../models/History')
const Product = require('../../models/Product')

const Untils = require('../modules/Untils')
const _error = Untils._error
const _success = Untils._success
const MESSAGESCONFIG = require('../Messages');
const MESSAGES = MESSAGESCONFIG.messages

let Service = {}

Service.getAllHistoryByUser = async (params, callback) => {
    if (!params) {
        let result = _error(1000)
        return callback(1000, { data: result })
    }

    let { user } = params;

    if (!user) {
        let result = _error(400);
        return callback(400, { data: result })
    }

    let errHistory, rsHistory;
    [errHistory, rsHistory] = await Untils.to(History.findAll({
        where: {
            user_id: user.id
        },
        raw: true
    }));
    if (errHistory) {
        let result = _error(500, errHistory)
        return callback(500, { data: result })
    }
    //chưa code phần dưới
    console.log(rsHistory,'==')
    return;

    // eachLimit(result, 1, async (item) => {
    //     let errr, resultt;
    //     [errr, resultt] = await Untils.to(Category.findAll({ where: { parent_id: item.id }, raw: true }));
    //     item.cate_child = resultt ? resultt : [{}];
    // }, (errr, resulttt) => {
    //     if (errr) {
    //         result = _error(404, errr)
    //         return callback(404, { data: result })
    //     }
    //     return callback(null, result)
    // })
}

Service.createCategory = async (params, callback) => {
    if (!params) {
        result = _error(1000, err)
        return callback(1000, { data: result })
    }

    let { name, parent_id } = params
    if (!name) {
        result = _error(1000, err)
        return callback(1000, { data: result })
    }

    let data = {
        name: name,
        parent_id: parent_id ? parent_id : '0'
    }
    let err, result;
    [err, result] = await Untils.to(Category.create(data, { raw: true }));
    if (err) {
        result = _error(2001, err)
        return callback(2001, { data: result })
    }
    return callback(null, result);
}

Service.editCategory = async (params, callback) => {
    if (!params) {
        result = _error(1000, err)
        return callback(1000, { data: result })
    }

    let { id, name } = params
    if (!id) {
        result = _error(1000, err)
        return callback(1000, { data: result })
    }
    if (!name) {
        result = _error(1000, err)
        return callback(1000, { data: result })
    }

    let data = {
        name: name
    }
    let where = {
        where: {
            id: id
        },
        raw: true
    }

    let err, result;
    [err, result] = await Untils.to(Category.update(data, where));
    if (err) {
        result = _error(2002, err)
        return callback(2002, { data: result })
    }

    let rs = Untils._success(200)
    return callback(null, rs);
}

Service.deleteCategory = async (params, callback) => {
    if (!params) {
        result = _error(1000, err)
        return callback(1000, { data: result })
    }

    let { id } = params
    if (!id) {
        result = _error(1000, err)
        return callback(1000, { data: result })
    }

    let findCateProduct = {
        where: {
            catelog_id: id
        }
    }
    let err, result;
    [err, result] = await Untils.to(Cate_Product.findOne(findCateProduct, { raw: true }));
    if (err) {
        result = _error(404, err)
        return callback(404, { data: result })
    }
    if (result) {
        result = _error(2004, null)
        return callback(2004, { data: result })
    }

    let where = {
        where: {
            id: id
        },
        raw: true
    }

    let errCate, rsCate;
    [errCate, rsCate] = await Untils.to(Category.destroy(where));
    if (errCate) {
        result = _error(2003, errCate)
        return callback(2003, { data: result })
    }

    let rs = Untils._success(200)
    return callback(null, rs);
}

module.exports = Service