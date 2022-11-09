const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config/connectDB");

const Order = db.sequelize.define(
  "order",
  {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    user_id: {
      type: Sequelize.CHAR(36),
    },
    discount: {
      type: Sequelize.DECIMAL(15, 2),
    },
    total: {
      type: Sequelize.DECIMAL(15, 2),
    },
    order_date: {
      type: Sequelize.DATE,
    },
    admin_id: {
      type: Sequelize.CHAR(36),
    },
    shipper_id: {
      type: Sequelize.CHAR(36),
    },
    status: {
      type: Sequelize.INTEGER,
    },
    user_checkout: {
      type: Sequelize.TEXT,
    },
    payment_intent: {
      type: Sequelize.CHAR(36),
    },
  },
  {
    tableName: "order",
  }
);

module.exports = Order;
