const { Sequelize, DataTypes } = require('sequelize');
const db = require('../config/connectDB')
const bcrypt = require("bcrypt");

const Users = db.sequelize.define('users', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
    },
    age: {
        type: Sequelize.INTEGER,
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    address: {
        type: Sequelize.STRING,
    },
    password: {
        type: Sequelize.STRING,
    },
    phone: {
        type: Sequelize.STRING,
        unique: true,
        validate: {
            is: /\d{10}$/i ,
            len: 10
        }
    },
    role: {
        type: Sequelize.INTEGER,
    },
    new: {
        type: Sequelize.INTEGER,
    },
    status: {
        type: Sequelize.INTEGER,
    },
    updatedAt: {
        type: Sequelize.DATE,
    }
}, {
    hooks: {
        beforeCreate: async (user) => {
            if (user.password) {
                const salt = await bcrypt.genSaltSync(10, 'a');
                user.password = bcrypt.hashSync(user.password, salt);
            }
        }
    }
}, {
    tableName: 'users',
},
);



module.exports = Users;