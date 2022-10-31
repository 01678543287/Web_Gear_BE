const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config/connectDB");

const Product = db.sequelize.define(
  "products",
  {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING,
    },
    name_without_unicode: {
      type: Sequelize.STRING,
    },
    content: {
      type: Sequelize.TEXT,
    },
    image_link: {
      type: Sequelize.STRING,
    },
    image_list: {
      type: Sequelize.TEXT,
    },
    view: {
      type: Sequelize.INTEGER,
    },
    sold: {
      type: Sequelize.INTEGER,
    },
    qty: {
      type: Sequelize.INTEGER,
    },
    status: {
      type: Sequelize.INTEGER,
    },
    cate_id: {
      type: Sequelize.CHAR(36),
    },
    brand_id: {
      type: Sequelize.CHAR(36),
    },
  },
  {
    tableName: "products",
  }
);

module.exports = Product;
