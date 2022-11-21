const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config/connectDB");

const Chi_Tiet_Tra_Hang = db.sequelize.define(
  "chi_tiet_tra_hang",
  {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    product_id: {
      type: Sequelize.CHAR(36),
    },
    trahang_id: {
      type: Sequelize.CHAR(36),
    },
    qty: {
      type: Sequelize.INTEGER,
    },
  },
  {
    tableName: "chi_tiet_tra_hang",
  }
);

module.exports = Chi_Tiet_Tra_Hang;
