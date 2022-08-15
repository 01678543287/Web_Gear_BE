const { Sequelize, DataTypes } = require('sequelize');
const db = require('../config/connectDB')

const Ribbon_Product = db.sequelize.define('ribbon_product', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },
    ribbon_id: {
        type: Sequelize.CHAR(36),
    },
    product_id: {
        type: Sequelize.CHAR(36),
    },
}, {
    tableName: 'ribbon_product'
}
)

module.exports = Ribbon_Product;