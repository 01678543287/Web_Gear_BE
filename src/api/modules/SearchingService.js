const { DateTime } = require("luxon");
const { eachLimit, forEach } = require("async");

const db = require("../../config/connectDB");
const Product = require("../../models/Product");
const Category = require("../../models/Category");
const Category_Detail = require("../../models/Category_Detail");
const Brand = require("../../models/Brand");

const Untils = require("./Utils");
const _error = Untils._error;
const _success = Untils._success;
const MESSAGESCONFIG = require("../Messages");
const { sequelize } = require("../../config/connectDB");
const { Op } = require("sequelize");
const MESSAGES = MESSAGESCONFIG.messages;

let Service = {};

Service.searchProduct = async (params, callback) => {
  let { product_name } = params;

  product_name = Untils.removeVietnameseTones(product_name);
  let [errProduct, resultProduct] = await Untils.to(
    Product.findAll({
      where: {
        status: 0,
        name_without_unicode: {
          [Op.iLike]: "%" + product_name + "%",
        },
      },
      raw: true,
    })
  );

  if (errProduct) {
    let result = _error(7000, errProduct);
    return callback(7000, { data: result });
  }

  if (!resultProduct || resultProduct.length === 0) {
    // search by category
    let [errCate, rsCate] = await Untils.to(
      Category.findOne({
        where: {
          name_without_unicode: {
            [Op.iLike]: "%" + product_name + "%",
          },
        },
        raw: true,
      })
    );
    if (rsCate) {
      let [errCate, rsPC] = await Untils.to(
        Product.findAll({ where: { cate_id: rsCate.id, status: 0 }, raw: true })
      );
      resultProduct.push(...rsPC);
    }
    // search by brand
    if (!rsCate || rsCate.length === 0) {
      let [errBrand, rsBrand] = await Untils.to(
        Brand.findOne({
          where: {
            name_without_unicode: {
              [Op.iLike]: "%" + product_name + "%",
            },
          },
          raw: true,
        })
      );

      if (rsBrand) {
        let [errBR, rsPB] = await Untils.to(
          Product.findAll({
            where: { brand_id: rsBrand.id, status: 0 },
            raw: true,
          })
        );
        resultProduct.push(...rsPB);
      }
    }
  }

  Untils.removeDuplicate(resultProduct);

  eachLimit(
    resultProduct,
    1,
    async (item) => {
      item.image_link = Untils.linkImage + item.image_link;
      let imageList = Untils.safeParse(item.image_list);
      for (img of imageList) {
        img.image_link = Untils.linkImage + img.image_link;
      }
      item.image_list = imageList;
    },
    (err, result) => {
      if (err) {
        result = _error(7000, err);
        return callback(7000, { data: result });
      }
      result = _success(200);
      result.products = resultProduct;
      return callback(null, result);
    }
  );
};
module.exports = Service;
