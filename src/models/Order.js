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
    card_id: {
      type: Sequelize.CHAR(36),
    },
    status: {
      type: Sequelize.INTEGER,
    },
    products: {
      type: Sequelize.TEXT,
    },
    user_checkout: {
      type: Sequelize.TEXT,
    },
  },
  {
    tableName: "order",
  }
);

module.exports = Order;
