const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config/connectDB");

const Chi_Tiet_Nhap_Hang = db.sequelize.define(
  "chi_tiet_nhap_hang",
  {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    nhaphang_id: {
      type: Sequelize.CHAR(36),
    },
    product_id: {
      type: Sequelize.CHAR(36),
    },
    qty: {
      type: Sequelize.INTEGER,
    },
    amount: {
      type: Sequelize.DECIMAL(15, 2),
    },
  },
  {
    tableName: "chi_tiet_nhap_hang",
  }
);

module.exports = Chi_Tiet_Nhap_Hang;
