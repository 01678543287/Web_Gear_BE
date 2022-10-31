const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config/connectDB");

const Thay_Doi_Gia = db.sequelize.define(
  "thay_doi_gia",
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
    admin_id: {
      type: Sequelize.CHAR(36),
    },
    price_change_date_to: {
      type: "TIMESTAMPS",
    },
    price_change_date_from: {
      type: "TIMESTAMPS",
    },
    price: {
      type: Sequelize.INTEGER,
    },
    active: {
      type: Sequelize.INTEGER,
    }
  },
  {
    tableName: "thay_doi_gia",
  }
);

module.exports = Thay_Doi_Gia;
