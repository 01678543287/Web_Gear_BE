const { Sequelize, DataTypes } = require('sequelize');
const db = require('../config/connectDB')

const Category = db.sequelize.define('category', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
    },
    parent_id: {
        type: Sequelize.CHAR(36),
    },
    updatedAt: {
        type: Sequelize.DATE,
    }
},
{
    tableName: 'category'
}
)

module.exports = Category;