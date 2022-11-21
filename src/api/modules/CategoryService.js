const { DateTime } = require("luxon");
const { eachLimit } = require("async");
const moment = require("moment");
const { Op, QueryTypes } = require("sequelize");

const { sequelize } = require("../../config/connectDB");
const db = require("../../config/connectDB");
const Category = require("../../models/Category");
const Category_Detail = require("../../models/Category_Detail");
const Brand = require("../../models/Brand");
const Product = require("../../models/Product");
const Dot_Khuyen_Mai = require("../../models/Dot_Khuyen_Mai");
const Chi_Tiet_Dot_Khuyen_Mai = require("../../models/Chi_Tiet_Dot_Khuyen_Mai");

const Untils = require("./Utils");
const _error = Untils._error;
const MESSAGESCONFIG = require("../Messages");
const MESSAGES = MESSAGESCONFIG.messages;

let Service = {};

Service.getAllCategory = async (params, callback) => {
  let err, result;
  [err, result] = await Untils.to(Category.findAll({ raw: true }));
  if (err) {
    result = _error(2000, err);
    return callback(2000, { data: result });
  }

  eachLimit(
    result,
    1,
    async (item) => {
      let errr, resultt;
      [errr, resultt] = await Untils.to(
        Category_Detail.findAll({ where: { cate_id: item.id }, raw: true })
      );
      if (errr) {
        result = _error(404, errr);
        return callback(404, { data: errr });
      }

      for (br of resultt) {
        let [err, result] = await Untils.to(
          Brand.findAll({ where: { id: br.brand_id }, raw: true })
        );
        item.brand = result ? result : [{}];
      }
    },
    (errr, resulttt) => {
      if (errr) {
        result = _error(404, errr);
        return callback(404, { data: result });
      }
      return callback(null, result);
    }
  );
};

Service.getCategory = async (params, callback) => {
  console.log(params, "pr=0=0=");
  // return;
  let err, result;
  [err, result] = await Untils.to(
    Category.findOne({ where: { id: params.cate_id }, raw: true })
  );
  if (err) {
    result = _error(2000, err);
    return callback(2000, { data: result });
  }
  let resultCB = Untils._success(200);
  resultCB.category = result;
  return callback(null, resultCB);
};

Service.getProductsByCate = async (params, callback) => {
  let { cate_id } = params;
  let products = [];

  let [err, result] = await Untils.to(
    Category.findOne({ where: { id: cate_id }, raw: true })
  );
  if (err) {
    result = _error(2000, err);
    return callback(2000, { data: result });
  }
  if (!result) {
    let result = _error(2000);
    return callback(2000, { data: result });
  }

  let errP, rsP;
  [errP, rsP] = await Untils.to(
    Product.findAll({ where: { cate_id: cate_id, status: 0 }, raw: true })
  );
  if (errP) {
    console.log(`find product error: ${errP}`);
  }
  // console.log(rsP, "rsP=====");

  for (item of rsP) {
    // rsP.discount = parseFloat(rsP.discount);
    item.price = parseFloat(item.price);
    item.image_link = Untils.linkImage + item.image_link;
    item.image_list = Untils.safeParse(item.image_list);
    for (image of item.image_list) {
      image.image_link = Untils.linkImage + image.image_link;
    }
    let [errKM, rsKM] = await Untils.to(
      Chi_Tiet_Dot_Khuyen_Mai.findOne({
        attributes: [
          [sequelize.fn("MAX", sequelize.col("value")), "value"],
          "dotkhuyenmai_id",
        ],
        where: { product_id: item.id },
        group: ["dotkhuyenmai_id"],
        raw: true,
      })
    );
    if (errKM) {
      console.log(errKM, "error find chi tiet dot khuyen mai");
    }
    if (rsKM) {
      let nowDate = moment().utcOffset(420).format("YYYY-MM-DD HH:mm:ss");

      let where = {
        where: {
          id: rsKM.dotkhuyenmai_id,
          start_At: { [Op.lte]: `${nowDate.toString()}` },
          end_At: { [Op.gte]: `${nowDate.toString()}` },
          status: 0,
        },
        raw: true,
      };
      let [errDKM, rsDKM] = await Untils.to(Dot_Khuyen_Mai.findOne(where));
      if (errDKM) {
        console.log(errDKM, "error find dot khuyen mai");
      }
      if (rsDKM) {
        item.priceKM =
          rsKM && rsKM.value ? item.price * (1 - rsKM.value / 100) : null;
      }
    }
    products.push(item);
  }
  console.log(products, "pro=====");

  let resultss = Untils._success(200);
  resultss.products = products;
  return callback(null, resultss);
};

Service.createCategory = async (params, callback) => {
  if (!params) {
    let result = _error(1000);
    return callback(1000, { data: result });
  }

  let { name } = params;
  if (!name) {
    let result = _error(1000);
    return callback(1000, { data: result });
  }

  let data = {
    name: name,
    name_without_unicode: Untils.removeVietnameseTones(name),
  };
  let err, result;
  [err, result] = await Untils.to(Category.create(data, { raw: true }));
  if (err) {
    result = _error(2001, err);
    return callback(2001, { data: result });
  }
  return callback(null, result);
};

Service.editCategory = async (params, callback) => {
  if (!params) {
    result = _error(1000, err);
    return callback(1000, { data: result });
  }

  let { id, name } = params;
  if (!id) {
    result = _error(1000, err);
    return callback(1000, { data: result });
  }
  if (!name) {
    result = _error(1000, err);
    return callback(1000, { data: result });
  }

  let data = {
    name: name,
    name_without_unicode: Untils.removeVietnameseTones(name),
  };
  let where = {
    where: {
      id: id,
    },
    raw: true,
  };

  let err, result;
  [err, result] = await Untils.to(Category.update(data, where));
  if (err) {
    result = _error(2002, err);
    return callback(2002, { data: result });
  }

  let rs = Untils._success(200);
  return callback(null, rs);
};

Service.deleteCategory = async (params, callback) => {
  if (!params) {
    result = _error(1000, err);
    return callback(1000, { data: result });
  }

  let { id } = params;
  if (!id) {
    result = _error(1000, err);
    return callback(1000, { data: result });
  }

  let findCateProduct = {
    where: {
      cate_id: id,
    },
  };
  let err, result;
  [err, result] = await Untils.to(
    Product.findOne(findCateProduct, { raw: true })
  );
  if (err) {
    result = _error(404, err);
    return callback(404, { data: result });
  }
  if (result) {
    result = _error(2004, null);
    return callback(2004, { data: result });
  }

  let where = {
    where: {
      id: id,
    },
    raw: true,
  };

  let errCate, rsCate;
  [errCate, rsCate] = await Untils.to(Category.destroy(where));
  if (errCate) {
    result = _error(2003, errCate);
    return callback(2003, { data: result });
  }

  let rs = Untils._success(200);
  return callback(null, rs);
};

module.exports = Service;
