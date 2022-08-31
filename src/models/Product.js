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
    price: {
      type: Sequelize.DECIMAL(15, 2),
    },
    discount: {
      type: Sequelize.DECIMAL(15, 2),
    },
    content: {
      type: Sequelize.TEXT,
    },
    image_link: {
      type: Sequelize.STRING,
    },
    image_list: {
      type: Sequelize.TEXT,
      comment: "json",
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
    warehouse_id: {
      type: Sequelize.CHAR(36),
    },
  },
  {
    tableName: "products",
  }
);

module.exports = Product;
