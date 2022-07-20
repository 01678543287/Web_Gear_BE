const { Sequelize, DataTypes } = require('sequelize');
const db = require('../config/connectDB')

const Promoes = db.sequelize.define('promoes', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },
    title: {
        type: Sequelize.STRING,
    },
    code: {
        type: Sequelize.CHAR(10),
    },
    status: {
        type: Sequelize.INTEGER,
    },
    type: {
        type: Sequelize.INTEGER,
    },
    value_type: {
        type: Sequelize.STRING,
        comment: 'json'
    }
},
{
    tableName: 'promoes'
}
)

module.exports = Promoes;