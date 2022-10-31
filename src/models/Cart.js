const { Sequelize, DataTypes } = require('sequelize');
const db = require('../config/connectDB')

const Cart = db.sequelize.define('cart', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },
    user_id: {
        type: Sequelize.CHAR(36),
    },
    status: {
        type: Sequelize.INTEGER,
    },
},
{
    tableName: 'cart'
}
)

module.exports = Cart;