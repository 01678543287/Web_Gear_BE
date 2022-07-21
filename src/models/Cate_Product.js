const { Sequelize, DataTypes } = require('sequelize');
const db = require('../config/connectDB')

const Cate_Product = db.sequelize.define('cate_product', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },
    catelog_id: {
        type: Sequelize.CHAR(36),
    },
    product_id: {
        type: Sequelize.CHAR(36),
    },
    updatedAt: {
        type: Sequelize.DATE,
    }
},
{
    tableName: 'cate_product'
}
)

module.exports = Cate_Product;