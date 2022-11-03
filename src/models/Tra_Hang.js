const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config/connectDB");

const Tra_Hang = db.sequelize.define(
  "tra_hang",
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
    order_id: {
      type: Sequelize.DECIMAL(15, 2),
    },
    qty: {
      type: Sequelize.INTEGER,
    },
  },
  {
    tableName: "tra_hang",
  }
);

module.exports = Tra_Hang;
