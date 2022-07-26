const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config/connectDB");

const History = db.sequelize.define(
  "history",
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
  },
  {
    tableName: "history",
  }
);

module.exports = History;
