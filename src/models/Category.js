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
},
{
    tableName: 'category'
}
)

module.exports = Category;