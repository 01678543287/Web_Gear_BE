const { DateTime } = require("luxon");
const { eachLimit, forEach } = require("async");

const db = require("../../config/connectDB");
const Product = require("../../models/Product");
const Category = require("../../models/Category");
const Cate_Product = require("../../models/Cate_Product");

const Untils = require("../modules/Untils");
const _error = Untils._error;
const _success = Untils._success;
const MESSAGESCONFIG = require("../Messages");
const { sequelize } = require("../../config/connectDB");
const { Op } = require("sequelize");
const MESSAGES = MESSAGESCONFIG.messages;

let Service = {};

Service.searchProduct = async (params, callback) => {
  // console.log(params);

  let { product_name } = params;
  product_name = Untils.removeVietnameseTones(product_name);
  let errProduct, resultProduct;
  [errProduct, resultProduct] = await Untils.to(
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
  // if (!resultProduct) {
  //   let result = _error(7000, errProduct);
  //   return callback(7000, { data: result });
  // }

  // if (!resultProduct) {
    // search by category
    let errCate, rsCate;
    [errCate, rsCate] = await Untils.to(
      Category.findOne({
        where: {
          name: {
            [Op.iLike]: "%" + product_name + "%",
          },
        },
        raw: true,
      })
    );
    if (rsCate) {
      let err, result;
      [err, result] = await Untils.to(
        Cate_Product.findAll({ where: { catelog_id: rsCate.id }, raw: true })
      );
      if (err) {
        result = _error(2000, err);
        return callback(2000, { data: result });
      }

      let products = [];

      for (item of result) {
        let errP, rsP;
        [errP, rsP] = await Untils.to(
          Product.findOne({
            where: { id: item.product_id, status: 0 },
            raw: true,
          })
        );
        if (errP) {
          console.log(`find product error: ${errP}`);
        }
        // rsP.discount = parseFloat(rsP.discount);
        // rsP.price = parseFloat(rsP.price);
        // rsP.image_link = Untils.linkImage + rsP.image_link;
        // rsP.image_list = Untils.safeParse(rsP.image_list);
        // for (image of rsP.image_list) {
        //   image.image_link = Untils.linkImage + image.image_link;
        // }
        // console.log(rsP, "rsssss");
        products.push(rsP);
      }
      resultProduct.push(...products);
      // end
    // }
  }

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
