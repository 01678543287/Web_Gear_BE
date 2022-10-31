const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config/connectDB");

const Dot_Khuyen_Mai = db.sequelize.define(
  "dot_khuyen_mai",
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
    start_At: {
      type: Sequelize.DATE,
    },
    end_At: {
      type: Sequelize.DATE,
    },
    status: {
      type: Sequelize.INTEGER,
    }
  },
  {
    tableName: "dot_khuyen_mai",
  }
);

module.exports = Dot_Khuyen_Mai;
