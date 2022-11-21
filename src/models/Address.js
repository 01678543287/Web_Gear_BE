const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config/connectDB");
const bcrypt = require("bcrypt");

const Address = db.sequelize.define(
  "address",
  {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    user_id: {
      type: Sequelize.CHAR(36),
      allowNull: false,
    },
    address: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    status: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    code_tinh: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    code_huyen: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    code_xa: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "address",
  }
);

module.exports = Address;
