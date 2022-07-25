const { Sequelize, DataTypes } = require('sequelize');
const db = require('../config/connectDB')

const Card = db.sequelize.define('card', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },
    user_id: {
        type: Sequelize.CHAR(36),
    },
    order_id: {
        type: Sequelize.CHAR(36),
    },
    total_price: {
        type: Sequelize.DECIMAL(15, 2),
    },
    status: {
        type: Sequelize.INTEGER,
    },
    note: {
        type: Sequelize.TEXT,
    },
    updatedAt: {
        type: Sequelize.DATE,
    }
},
{
    tableName: 'card'
}
)

module.exports = Card;