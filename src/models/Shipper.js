const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config/connectDB");
const bcrypt = require("bcrypt");

const Shipper = db.sequelize.define(
  "shipper",
  {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING,
    },
    gender: {
      type: Sequelize.INTEGER,
    },
    birthday: {
      type: "TIMESTAMPS",
    },
    avatar: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
      validate: {
        isEmail: true,
      },
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
        is: /\d{10}$/i,
        len: 10,
      },
    },
    status: {
      type: Sequelize.INTEGER,
    },
    home_town: {
      type: Sequelize.STRING,
    },
    cccd: {
      type: Sequelize.STRING,
    },
    token: {
      type: Sequelize.STRING,
    },
  },
  {
    hooks: {
      beforeCreate: async (admin) => {
        if (admin.password) {
          const salt = await bcrypt.genSaltSync(10, "a");
          admin.password = bcrypt.hashSync(admin.password, salt);
        }
      },
    },
  },
  {
    tableName: "shipper",
  }
);

module.exports = Shipper;
