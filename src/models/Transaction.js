const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config/connectDB");

const Transaction = db.sequelize.define(
  "transaction",
  {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    order_id: {
      type: Sequelize.CHAR(36),
    },
    status: {
      type: Sequelize.INTEGER,
    },
    amount: {
      type: Sequelize.DECIMAL(15, 2),
    },
    user_id: {
      type: Sequelize.CHAR(36),
    },
  },
  {
    tableName: "transaction",
  }
);

module.exports = Transaction;
