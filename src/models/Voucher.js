const { Sequelize, DataTypes } = require('sequelize');
const db = require('../config/connectDB')

const Voucher = db.sequelize.define('voucher', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },
    user_id: {
        type: Sequelize.CHAR(36),
    },
    promo_id: {
        type: Sequelize.CHAR(36),
    },
    is_active: {
        type: Sequelize.INTEGER,
    }
}, {
    tableName: 'voucher'
}
)

module.exports = Voucher;