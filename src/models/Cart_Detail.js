const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config/connectDB");

const Cart_Detail = db.sequelize.define(
  "cart_detail",
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
    product_id: {
      type: Sequelize.CHAR(36),
    },
    qty: {
      type: Sequelize.INTEGER,
    },
    price: {
      type: Sequelize.DECIMAL(15, 2),
    },
    status: {
      type: Sequelize.INTEGER,
    },
  },
  {
    tableName: "cart_detail",
  }
);

module.exports = Cart_Detail;
