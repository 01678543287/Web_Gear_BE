const { Sequelize, DataTypes } = require('sequelize');
const db = require('../config/connectDB')

const Rate = db.sequelize.define('rate', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },
    user_id: {
        type: Sequelize.CHAR(36),
    },
    product_id: {
        type: Sequelize.CHAR(36),
    },
    point: {
        type: Sequelize.INTEGER,
    },
    updatedAt: {
        type: Sequelize.DATE,
    }
},
{
    tableName: 'rate'
}
)

module.exports = Rate;