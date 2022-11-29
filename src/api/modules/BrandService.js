const { DateTime } = require("luxon");
const { eachLimit } = require("async");
const moment = require("moment");
const { Op, QueryTypes } = require("sequelize");

const { sequelize } = require("../../config/connectDB");
const db = require("../../config/connectDB");
const Category = require("../../models/Category");
const Category_Detail = require("../../models/Category_Detail");
const Product = require("../../models/Product");
const Dot_Khuyen_Mai = require("../../models/Dot_Khuyen_Mai");
const Chi_Tiet_Dot_Khuyen_Mai = require("../../models/Chi_Tiet_Dot_Khuyen_Mai");

const Brand = require("../../models/Brand");

const Untils = require("./Utils");
const _error = Untils._error;
const _success = Untils._success;
const MESSAGESCONFIG = require("../Messages");
const MESSAGES = MESSAGESCONFIG.messages;

let Service = {};

Service.getAllCategory = async (params, callback) => {
  let err, result;
  [err, result] = await Untils.to(Brand.findAll({ raw: true }));
  if (err) {
    result = _error(2000, err);
    return callback(2000, { data: result });
  }

  let resultRes = _success(200);
  resultRes.brand = result;
  return callback(null, resultRes);
};

Service.getBrand = async (params, callback) => {
  let category = [];
  let [err, result] = await Untils.to(
    Brand.findOne({ where: { id: params.brand_id }, raw: true })
  );
  if (err) {
    result = _error(2000, err);
    return callback(2000, { data: result });
  }

  let [errCD, rsCD] = await Untils.to(
    Category_Detail.findAll({ where: { brand_id: params.brand_id }, raw: true })
  );
  if (errCD) {
    result = _error(2000, errCD);
    return callback(2000, { data: result });
  }

  for (item of rsCD) {
    let [errFB, rsFB] = await Untils.to(
      Category.findOne({ where: { id: item.cate_id }, raw: true })
    );
    if (errFB) {
      console.log(errFB);
      let result = _error(8000, errFB);
      return callback(8000, { data: result });
    }
    if (rsFB) {
      category.push(rsFB);
    }
  }

  let resultCB = _success(200);
  resultCB.brand = result;
  resultCB.category = category;
  return callback(null, resultCB);
};

Service.getProductsByBrand = async (params, callback) => {
  console.log(params);
  let { brand_id } = params;
  let products = [];

  let [err, result] = await Untils.to(
    Brand.findOne({ where: { id: brand_id }, raw: true })
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
    Product.findAll({ where: { brand_id: brand_id, status: 0 }, raw: true })
  );
  if (errP) {
    console.log(`find product error: ${errP}`);
  }

  for (item of rsP) {
    item.price = parseFloat(item.price);
    item.image_link = Untils.linkImage + item.image_link;
    item.image_list = Untils.safeParse(item.image_list);
    for (image of item.image_list) {
      image.image_link = Untils.linkImage + image.image_link;
    }

    let query = `SELECT max(dkmd.value) as max
    FROM products p
      INNER JOIN chi_tiet_dot_khuyen_mai dkmd ON dkmd.product_id = p.id
      INNER JOIN dot_khuyen_mai dkm ON dkm.id = dkmd.dotkhuyenmai_id
    WHERE p.id = '${item.id}' 
      AND dkm."start_At" <= NOW()
        AND dkm."end_At" >= NOW()`;
    let dkmd = await db.sequelize.query(query, {
      type: QueryTypes.SELECT,
      raw: true,
    });
    console.log(dkmd[0].max, "dkmd");
    let valueMax = dkmd[0].max ? dkmd[0].max : 0;

    item.priceKM =
      valueMax !== 0 ? (item.price * (100 - valueMax)) / 100 : null;
    products.push(item);
  }

  let resultss = Untils._success(200);
  resultss.products = products;
  return callback(null, resultss);
};

Service.createBrand = async (params, callback) => {
  if (!params) {
    let result = _error(1000);
    return callback(1000, { data: result });
  }

  let { name, cate } = params;

  if (!name || !cate) {
    let result = _error(1000);
    return callback(1000, { data: result });
  }

  let data = {
    name: name,
    name_without_unicode: Untils.removeVietnameseTones(name),
    logo: "no logo",
  };
  let [err, result] = await Untils.to(Brand.create(data, { raw: true }));
  if (err) {
    result = _error(2001, err);
    return callback(2001, { data: result });
  }

  let dataCD = cate.map((item) => {
    return { brand_id: result.id, cate_id: item.id };
  });

  let [errCD, rsCD] = await Untils.to(
    Category_Detail.bulkCreate(dataCD, { raw: true })
  );
  if (errCD) {
    result = _error(2001, errCD);
    return callback(2001, { data: result });
  }

  return callback(null, result);
};

Service.editBrand = async (params, callback) => {
  if (!params) {
    result = _error(1000, err);
    return callback(1000, { data: result });
  }

  let { id, name, cate } = params;
  if (!id || !name || !cate) {
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

  let [err, result] = await Untils.to(Brand.update(data, where));
  if (err) {
    result = _error(2002, err);
    return callback(2002, { data: result });
  }

  let dataCD = cate.map((item) => {
    return { brand_id: id, cate_id: item.id };
  });
  let [errCD, rsCD] = await Untils.to(
    Category_Detail.destroy({
      where: {
        brand_id: id,
      },
    })
  );
  if (errCD) {
    let result = _error(2002, errCD);
    return callback(2002, { data: result });
  }
  [errCD, rsCD] = await Untils.to(Category_Detail.bulkCreate(dataCD));
  if (errCD) {
    let result = _error(2002, errCD);
    return callback(2002, { data: result });
  }
  let rs = Untils._success(200);
  return callback(null, rs);
};

Service.deleteBrand = async (params, callback) => {
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
      brand_id: id,
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
  [errCate, rsCate] = await Untils.to(Brand.destroy(where));
  if (errCate) {
    result = _error(2003, errCate);
    return callback(2003, { data: result });
  }

  let rs = Untils._success(200);
  return callback(null, rs);
};

module.exports = Service;
