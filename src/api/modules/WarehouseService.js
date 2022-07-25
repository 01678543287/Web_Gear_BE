const { DateTime } = require("luxon");
const { eachLimit } = require("async");

const db = require('../../config/connectDB')
const Warehouse = require('../../models/Warehouse')
const Product = require('../../models/Product')

const Untils = require('../modules/Untils')
const _error = Untils._error
const _success = Untils._success
const MESSAGESCONFIG = require('../Messages');
const MESSAGES = MESSAGESCONFIG.messages

let Service = {}

Service.getAllWarehouse = async (params, callback) => {
    let findWare = {
        where: {
            status: 0
        },
        raw: true
    }
    let errWare, rsWare;
    [errWare, rsWare] = await Untils.to(Warehouse.findAll(findWare));
    if (errWare) {
        let result = _error(5000, errWare)
        return callback(5000, { data: result })
    }
    if (!rsWare || rsWare.length == 0) {
        let result = _success(200);
        result.warehouses = rsWare;
        return callback(null, result)
    } else {
        eachLimit(rsWare, 1, async (ware) => {
            let findProduct = {
                where: {
                    warehouse_id: ware.id,
                    status: 0
                },
                raw: true
            }
            let errProduct, rsProducts;
            [errProduct, rsProducts] = await Untils.to(Product.findAll(findProduct));
            if (errProduct) {
                let result = _error(500, errProduct);
                return callback(500, { data: result });
            }
            ware.products = rsProducts;
        }, (err, result) => {
            if (err) {
                let result = _error(6000, err);
                return callback(6000, { data: result });
            }
            return callback(null, rsWare);
        })
    }
}

Service.createWarehouse = async (params, callback) => {
    let errWare, rsWare;
    [errWare, rsWare] = await Untils.to(Warehouse.create({ raw: true }));
    if (errWare) {
        let result = _error(6001, errWare)
        return callback(6001, { data: result })
    }

    let result = _success(200);
    result.warehouse = rsWare;
    return callback(null, result);
}

Service.lockWarehouse = async (params, callback) => {
    if (!params) {
        result = _error(1000, err)
        return callback(1000, { data: result })
    }

    let { warehouse_id } = params;
    if (!warehouse_id) {
        result = _error(1000, err)
        return callback(1000, { data: result })
    }

    let data = {
        status: 1
    }
    let where = {
        where: {
            id: warehouse_id
        },
        raw: true
    }

    let errWare, rsWare;
    [errWare, rsWare] = await Untils.to(Warehouse.update(data, where));
    if (errWare) {
        let result = _error(6002, errWare)
        return callback(6002, { data: result })
    }

    let rs = _success(200);
    return callback(null, rs);
}

Service.unLockWarehouse = async (params, callback) => {
    if (!params) {
        result = _error(1000, err)
        return callback(1000, { data: result })
    }

    let { warehouse_id } = params;
    if (!warehouse_id) {
        result = _error(1000, err)
        return callback(1000, { data: result })
    }

    let data = {
        status: 0
    }
    let where = {
        where: {
            id: warehouse_id
        },
        raw: true
    }

    let errWare, rsWare;
    [errWare, rsWare] = await Untils.to(Warehouse.update(data, where));
    if (errWare) {
        let result = _error(6002, errWare)
        return callback(6002, { data: result })
    }

    let rs = _success(200);
    return callback(null, rs);
}

Service.deleteWarehouse = async (params, callback) => {
    if (!params) {
        let result = _error(1000)
        return callback(1000, { data: result })
    }

    let { warehouse_id } = params;
    if (!warehouse_id) {
        result = _error(1000)
        return callback(1000, { data: result })
    }

    let findProduct = {
        where: {
            warehouse_id: warehouse_id
        },
        raw: true
    }
    let errPro, rsPro;
    [errPro, rsPro] = await Untils.to(Product.findAll(findProduct));
    if (errPro) {
        let result = _error(404, errPro)
        return callback(404, { data: result })
    }

    if (rsPro.length > 0) {
        let result = _error(6003)
        return callback(6003, { data: result })
    }

    let where = {
        where: {
            id: warehouse_id
        },
        raw: true
    }

    let errCate, rsCate;
    [errCate, rsCate] = await Untils.to(Warehouse.destroy(where));
    if (errCate) {
        result = _error(2003, errCate)
        return callback(2003, { data: result })
    }

    let rs = _success(200)
    return callback(null, rs);
}


module.exports = Service