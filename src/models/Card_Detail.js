const { Sequelize, DataTypes } = require('sequelize');
const db = require('../config/connectDB')

const Card_Detail = db.sequelize.define('card_detail', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },
    card_id: {
        type: Sequelize.CHAR(36),
    },
    product_id: {
        type: Sequelize.CHAR(36),
    },
    qty: {
        type: Sequelize.INTEGER,
    },
    rate: {
        type: Sequelize.INTEGER,
    },
    updatedAt: {
        type: Sequelize.DATE,
    }
},
{
    tableName: 'card_detail'
}
)

module.exports = Card_Detail;