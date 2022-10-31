const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config/connectDB");

const Nhap_Hang = db.sequelize.define(
  "nhap_hang",
  {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false, 
    },
    admin_id: {
      type: Sequelize.CHAR(36),
    },
    total: {
      type: Sequelize.DECIMAL(15, 2),
    },
    nhaphang_date: {
      type: Sequelize.DATE,
    },
    note: {
      type: Sequelize.TEXT,
    },
  },
  {
    tableName: "nhap_hang",
  }
);

module.exports = Nhap_Hang;
