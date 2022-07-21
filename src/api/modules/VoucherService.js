const { DateTime } = require("luxon");
const { eachLimit } = require("async");

const db = require('../../config/connectDB')
const Promo = require('../../models/Promoes')
const Voucher = require('../../models/Voucher')
const User = require('../../models/Users')

const Untils = require('../modules/Untils')
const _error = Untils._error
const _success = Untils._success
const MESSAGESCONFIG = require('../Messages');
const MESSAGES = MESSAGESCONFIG.messages

let Service = {}

Service.useVoucher = async (params, callback) => {
    if (!params) {
        let result = _error(1000);
        return callback(1000, { data: result });
    }

    let { code, price, user } = params;

    if (!code) {
        let result = _error(1000);
        return callback(1000, { data: result });
    }
    if (!price) {
        let result = _error(1000);
        return callback(1000, { data: result });
    }

    price = parseInt(price);

    let where = {
        where: {
            code: code,
            status: 0
        },
        raw: true
    }

    let errPromo, rsPromo;
    [errPromo, rsPromo] = await Untils.to(Promo.findOne(where));
    if (errPromo) {
        let result = _error(4001, errPromo);
        return callback(4001, { data: result });
    }
    if (!rsPromo) {
        let result = _error(4001);
        return callback(4001, { data: result });
    }

    let checkVoucher = {
        where: {
            user_id: user.id,
            promoes_id: rsPromo.id,
            is_active: 0
        },
        raw: true
    }

    let errVoucher, rsVoucher;
    [errVoucher, rsVoucher] = await Untils.to(Voucher.findOne(checkVoucher));
    if (errVoucher) {
        let result = _error(4001);
        return callback(4001, { data: result })
    }
    if (!rsVoucher) {
        let result = _error(4001);
        return callback(4001, { data: result })
    }

    if (rsPromo.type == 0) { // giảm giá theo phần trăm
        price = price * (rsPromo.value_type / 100)
    }
    else if (rsPromo.type == 1) { // giảm giá trực tiếp
        price = parseInt(rsPromo.value_type)
    }

    [errVoucher, rsVoucher] = await Untils.to(Voucher.update(
        {
            is_active: 1
        },
        {
            where: {
                id: rsVoucher.id
            }
        }
    ));
    if (errVoucher) {
        let result = _error(4001);
        return callback(4001, { data: result })
    }

    let result = _success(200)
    result.discount = price;
    return callback(null, result)
}

Service.sendVoucherForUser = async (params, callback) => {
    if (!params) {
        let result = _error(1000);
        return callback(1000, { data: result });
    }

    let { promo_id, user_id } = params;

    if (!promo_id) {
        let result = _error(1000);
        return callback(1000, { data: result });
    }
    if (!user_id) {
        let result = _error(1000);
        return callback(1000, { data: result });
    }

    let where = {
        where: {
            id: promo_id
        },
        raw: true
    }

    let errPromo, rsPromo;
    [errPromo, rsPromo] = await Untils.to(Promo.findOne(where));
    if (errPromo) {
        let result = _error(500, errPromo);
        return callback(500, { data: result });
    }
    if (!rsPromo) {
        let result = _error(4001);
        return callback(4001, { data: result });
    }

    let checkExistVoucher = {
        where: {
            promoes_id: promo_id,
            user_id: user_id
        },
        raw: true
    }

    let errV, rsV;
    [errV, rsV] = await Untils.to(Voucher.findOne(checkExistVoucher));
    if (errV) {
        let result = _error(500, errV);
        return callback(500, { data: result });
    }
    if (rsV) {
        let result = _error(4002);
        return callback(4002, { data: result });
    }

    let dataVoucher = {
        user_id: user_id,
        promoes_id: promo_id
    }

    let errVoucher, rsVoucher;
    [errVoucher, rsVoucher] = await Untils.to(Voucher.create(dataVoucher));
    if (errVoucher) {
        let result = _error(500, errVoucher);
        return callback(500, { data: result })
    }
    if (!rsVoucher) {
        let result = _error(4001);
        return callback(4001, { data: result })
    }

    let result = _success(200)
    return callback(null, result)
}

Service.sendVoucherForAllUsers = async (params, callback) => {
    if (!params) {
        let result = _error(1000);
        return callback(1000, { data: result });
    }

    let { promo_id } = params;

    if (!promo_id) {
        let result = _error(1000);
        return callback(1000, { data: result });
    }

    let where = {
        where: {
            id: promo_id
        },
        raw: true
    }

    let errPromo, rsPromo;
    [errPromo, rsPromo] = await Untils.to(Promo.findOne(where));
    if (errPromo) {
        let result = _error(500, errPromo);
        return callback(500, { data: result });
    }
    if (!rsPromo) {
        let result = _error(4001);
        return callback(4001, { data: result });
    }

    let findUser = {
        where: {
            role: 0,
            status: 0
        },
        raw: true
    }

    let errUsers, rsUsers;
    [errUsers, rsUsers] = await Untils.to(User.findAll(findUser))
    if (errUsers) {
        let result = _error(500, errUsers);
        return callback(500, { data: result });
    }

    let sendVoucher = async (user) => {
        let checkExistVoucher = {
            where: {
                promoes_id: promo_id,
                user_id: user.id
            },
            raw: true
        }

        let errV, rsV;
        [errV, rsV] = await Untils.to(Voucher.findOne(checkExistVoucher));
        if (errV) {
            let result = _error(500, errV);
            return callback(500, { data: result });
        }
        if (rsV) {
            console.log(`User ${user.id} already has this voucher`)
        } else if (!rsV) {
            let dataVoucher = {
                user_id: user.id,
                promoes_id: promo_id
            }

            let errVoucher, rsVoucher;
            [errVoucher, rsVoucher] = await Untils.to(Voucher.create(dataVoucher));
            if (errVoucher) {
                let result = _error(500, errVoucher);
                return callback(500, { data: result })
            }
            if (!rsVoucher) {
                let result = _error(4001);
                return callback(4001, { data: result })
            }
        }
    }

    eachLimit(rsUsers, 1, sendVoucher, (err, result) => {
        if (err) {
            result = _error(500, err);
            return callback(500, { data: result })
        }

        result = _success(200)
        return callback(null, result)
    })


}



module.exports = Service