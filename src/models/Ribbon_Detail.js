const { Sequelize, DataTypes } = require('sequelize');
const db = require('../config/connectDB')

const Ribbon_Detail = db.sequelize.define('ribbon_detail', {
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
    tableName: 'ribbon_detail'
}
)

module.exports = Ribbon_Detail;