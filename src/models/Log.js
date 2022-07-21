const { Sequelize, DataTypes } = require('sequelize');
const db = require('../config/connectDB')

const Log = db.sequelize.define('log', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },
    refId: {
        type: Sequelize.CHAR(36),
    },
    params: {
        type: Sequelize.STRING,
    },
    action: {
        type: Sequelize.CHAR(200),
    },
    updatedAt: {
        type: Sequelize.DATE,
    }
},
{
    tableName: 'log'
}
)

module.exports = Log;