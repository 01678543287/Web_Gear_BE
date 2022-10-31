const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config/connectDB");

const Chi_Tiet_Dot_Khuyen_Mai = db.sequelize.define(
  "chi_tiet_dot_khuyen_mai",
  {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    dotkhuyenmai_id: {
      type: Sequelize.CHAR(36),
    },
    product_id: {
      type: Sequelize.CHAR(36),
    },
    value: {
      type: Sequelize.INTEGER,
    },
  },
  {
    tableName: "chi_tiet_dot_khuyen_mai",
  }
);

module.exports = Chi_Tiet_Dot_Khuyen_Mai;
