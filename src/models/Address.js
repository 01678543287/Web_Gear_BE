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
  },
  {
    tableName: "address",
  }
);

module.exports = Address;
