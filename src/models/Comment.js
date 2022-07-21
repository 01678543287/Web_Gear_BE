const { Sequelize, DataTypes } = require('sequelize');
const db = require('../config/connectDB')

const Comment = db.sequelize.define('comment', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },
    parent_cmt_id: {
        type: Sequelize.CHAR(36),
    },
    user_id: {
        type: Sequelize.CHAR(36),
    },
    product_id: {
        type: Sequelize.CHAR(36),
    },
    content: {
        type: Sequelize.TEXT,
    },
    updatedAt: {
        type: Sequelize.DATE,
    }
},
{
    tableName: 'comment'
}
)

module.exports = Comment;