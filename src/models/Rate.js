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
    comment: {
        type: Sequelize.TEXT,
    }
},
{
    tableName: 'rate'
}
)

module.exports = Rate;