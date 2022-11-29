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
  let brand = [];
  let [err, result] = await Untils.to(
    Category.findOne({ where: { id: params.cate_id }, raw: true })
  );
  if (err) {
    result = _error(2000, err);
    return callback(2000, { data: result });
  }

  let [errCD, rsCD] = await Untils.to(
    Category_Detail.findAll({ where: { cate_id: params.cate_id }, raw: true })
  );
  if (errCD) {
    result = _error(2000, errCD);
    return callback(2000, { data: result });
  }

  for (item of rsCD) {
    let [errFB, rsFB] = await Untils.to(
      Brand.findOne({ where: { id: item.brand_id }, raw: true })
    );
    if (errFB) {
      let result = _error(8000, errFB);
      return callback(8000, { data: result });
    }
    if (rsFB) {
      brand.push(rsFB);
    }
  }

  let resultCB = Untils._success(200);
  resultCB.category = result;
  resultCB.brand = brand;
  return callback(null, resultCB);
};

Service.getProductsByCate = async (params, callback) => {
  let { cate_id } = params;
  let products = [];
  let brands = [];

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
    let valueMax = dkmd[0].max ? dkmd[0].max : 0;

    item.priceKM =
      valueMax !== 0 ? (item.price * (100 - valueMax)) / 100 : null;
    products.push(item);
  }

  let [errB, rsB] = await Untils.to(
    Category_Detail.findAll({ where: { cate_id: cate_id }, raw: true })
  );
  if (errB) {
    let result = _error(8000, errB);
    return callback(8000, { data: result });
  }
  console.log(rsB);
  // eachLimit(
  //   rsB,
  //   1,
  //   async (item) => {
  // let [errFB, rsFB] = await Untils.to(
  //   Brand.findOne({ where: { id: item.brand_id }, raw: true })
  // );
  // if (errFB) {
  //   console.log(errFB);
  //   let result = _error(8000, errFB);
  //   return callback(8000, { data: result });
  // }
  // console.log(rsFB);
  // if (rsFB) {
  //   let temp = {
  //     id: rsFB.id,
  //     name: rsFB.name,
  //   };
  //   brands.push(temp);
  //     }
  //   },
  //   (err, result) => {
  //     if (err) {
  //       console.log(err);
  //     }
  //   }
  // );
  for (item of rsB) {
    let [errFB, rsFB] = await Untils.to(
      Brand.findOne({ where: { id: item.brand_id }, raw: true })
    );
    if (errFB) {
      console.log(errFB);
      let result = _error(8000, errFB);
      return callback(8000, { data: result });
    }
    if (rsFB) {
      let temp = {
        id: rsFB.id,
        name: rsFB.name,
      };
      brands.push(temp);
    }
  }

  console.log(brands);
  let resultss = Untils._success(200);
  resultss.products = products;
  resultss.brands = brands;
  return callback(null, resultss);
};

Service.createCategory = async (params, callback) => {
  if (!params) {
    let result = _error(1000);
    return callback(1000, { data: result });
  }

  let { name, cate } = params;
  // console.log(params);
  // return;
  if (!name || !cate) {
    let result = _error(1000);
    return callback(1000, { data: result });
  }

  let data = {
    name: name,
    name_without_unicode: Untils.removeVietnameseTones(name),
  };

  let [err, result] = await Untils.to(Category.create(data, { raw: true }));
  if (err) {
    result = _error(2001, err);
    return callback(2001, { data: result });
  }

  let dataCD = cate.map((item) => {
    return { brand_id: item.id, cate_id: result.id };
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

Service.editCategory = async (params, callback) => {
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

  let err, result;
  [err, result] = await Untils.to(Category.update(data, where));
  if (err) {
    result = _error(2002, err);
    return callback(2002, { data: result });
  }

  let dataCD = cate.map((item) => {
    return { brand_id: item.id, cate_id: id };
  });
  let [errCD, rsCD] = await Untils.to(
    Category_Detail.destroy({
      where: {
        cate_id: id,
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
