const { Sequelize, DataTypes } = require('sequelize');
const db = require('../config/connectDB')

const Warehouse = db.sequelize.define('warehouse', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },
    qty: {
        type: Sequelize.INTEGER,
    },
    status: {
        type: Sequelize.INTEGER,
    }
},
{
    tableName: 'warehouse'
}
)

module.exports = Warehouse;