const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config/connectDB");

const Ribbon = db.sequelize.define(
  "ribbon",
  {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    name: {
      type: Sequelize.TEXT,
    },
    active: {
      type: Sequelize.INTEGER,
    },
  },
  {
    tableName: "ribbon",
  }
);

module.exports = Ribbon;
