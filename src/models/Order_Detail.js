const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config/connectDB");

const Order_Detail = db.sequelize.define(
  "order_detail",
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
    product_id: {
      type: Sequelize.CHAR(36),
    },
    qty: {
      type: Sequelize.INTEGER,
    },
    price: {
      type: Sequelize.DECIMAL(15, 2),
    },
  },
  {
    tableName: "order_detail",
  }
);

module.exports = Order_Detail;
