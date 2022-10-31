const { Sequelize, DataTypes } = require('sequelize');
const db = require('../config/connectDB')

const Category_Detail = db.sequelize.define('category_detail', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },
    brand_id: {
        type: Sequelize.CHAR(36),
    },
    cate_id: {
        type: Sequelize.CHAR(36),
    }
},
{
    tableName: 'category_detail'
}
)

module.exports = Category_Detail;