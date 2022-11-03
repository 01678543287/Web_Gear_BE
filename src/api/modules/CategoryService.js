const { DateTime } = require("luxon");
const { eachLimit } = require("async");

const db = require("../../config/connectDB");
const Category = require("../../models/Category");
const Category_Detail = require("../../models/Category_Detail");

const Untils = require("../modules/Untils");
const _error = Untils._error;
const MESSAGESCONFIG = require("../Messages");
const Product = require("../../models/Product");
const MESSAGES = MESSAGESCONFIG.messages;

let Service = {};

Service.getAllCategory = async (params, callback) => {
  let err, result;
  [err, result] = await Untils.to(
    Category.findAll({raw: true })
  );
  if (err) {
    result = _error(2000, err);
    return callback(2000, { data: result });
  }

  console.log(JSON.stringify(result));

  eachLimit(
    result,
    1,
    async (item) => {
      let errr, resultt;
      [errr, resultt] = await Untils.to(
        Category_Detail.findAll({ where: { parent_id: item.id }, raw: true })
      );
      item.cate_child = resultt ? resultt : [{}];
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

// Service.getCategory = async (params, callback) => {
//   console.log(params, "pr=0=0=");
//   // return;
//   let err, result;
//   [err, result] = await Untils.to(
//     Category.findOne({ where: { id: params.cate_id }, raw: true })
//   );
//   if (err) {
//     result = _error(2000, err);
//     return callback(2000, { data: result });
//   }
//   let resultCB = Untils._success(200);
//   resultCB.category = result;
//   return callback(null, resultCB);
// };

// Service.getProductsByCate = async (params, callback) => {
//   let { cate_id } = params;

//   let err, result;
//   [err, result] = await Untils.to(
//     Cate_Product.findAll({ where: { catelog_id: cate_id }, raw: true })
//   );
//   if (err) {
//     result = _error(2000, err);
//     return callback(2000, { data: result });
//   }
//   let products = [];

//   for (item of result) {
//     let errP, rsP;
//     [errP, rsP] = await Untils.to(
//       Product.findOne({ where: { id: item.product_id, status: 0 }, raw: true })
//     );
//     if (errP) {
//       console.log(`find product error: ${errP}`);
//     }
//     if (rsP) {
//       rsP.discount = parseFloat(rsP.discount);
//       rsP.price = parseFloat(rsP.price);
//       rsP.image_link = Untils.linkImage + rsP.image_link;
//       rsP.image_list = Untils.safeParse(rsP.image_list);
//       for (image of rsP.image_list) {
//         image.image_link = Untils.linkImage + image.image_link;
//       }
//       // console.log(rsP, "rsssss");
//       products.push(rsP);
//     }
//   }
//   //   console.log(products, "pro=====");

//   let resultss = Untils._success(200);
//   resultss.products = products;
//   return callback(null, resultss);

//   //   eachLimit(
//   //     result,
//   //     1,
//   //     async (item) => {
//   //       let errr, resultt;
//   //       [errr, resultt] = await Untils.to(
//   //         Product.findOne({ where: { id: item.product_id }, raw: true })
//   //       );
//   //       products = resultt ? resultt : {};
//   //     },
//   //     (errr, resulttt) => {
//   //       if (errr) {
//   //         result = _error(404, errr);
//   //         return callback(404, { data: result });
//   //       }
//   //       return callback(null, result);
//   //     }
//   //   );
// };

Service.createCategory = async (params, callback) => {
  if (!params) {
    let result = _error(1000);
    return callback(1000, { data: result });
  }

  let { name, parent_id } = params;
  if (!name) {
    let result = _error(1000);
    return callback(1000, { data: result });
  }

  let data = {
    name: name,
  };
  let err, result;
  [err, result] = await Untils.to(Category.create(data, { raw: true }));
  if (err) {
    result = _error(2001, err);
    return callback(2001, { data: result });
  }
  return callback(null, result);
};

// Service.editCategory = async (params, callback) => {
//   if (!params) {
//     result = _error(1000, err);
//     return callback(1000, { data: result });
//   }

//   let { id, name } = params;
//   if (!id) {
//     result = _error(1000, err);
//     return callback(1000, { data: result });
//   }
//   if (!name) {
//     result = _error(1000, err);
//     return callback(1000, { data: result });
//   }

//   let data = {
//     name: name,
//   };
//   let where = {
//     where: {
//       id: id,
//     },
//     raw: true,
//   };

//   let err, result;
//   [err, result] = await Untils.to(Category.update(data, where));
//   if (err) {
//     result = _error(2002, err);
//     return callback(2002, { data: result });
//   }

//   let rs = Untils._success(200);
//   return callback(null, rs);
// };

// Service.deleteCategory = async (params, callback) => {
//   if (!params) {
//     result = _error(1000, err);
//     return callback(1000, { data: result });
//   }

//   let { id } = params;
//   if (!id) {
//     result = _error(1000, err);
//     return callback(1000, { data: result });
//   }

//   let findCateProduct = {
//     where: {
//       catelog_id: id,
//     },
//   };
//   let err, result;
//   [err, result] = await Untils.to(
//     Cate_Product.findOne(findCateProduct, { raw: true })
//   );
//   if (err) {
//     result = _error(404, err);
//     return callback(404, { data: result });
//   }
//   if (result) {
//     result = _error(2004, null);
//     return callback(2004, { data: result });
//   }

//   let where = {
//     where: {
//       id: id,
//     },
//     raw: true,
//   };

//   let errCate, rsCate;
//   [errCate, rsCate] = await Untils.to(Category.destroy(where));
//   if (errCate) {
//     result = _error(2003, errCate);
//     return callback(2003, { data: result });
//   }

//   let rs = Untils._success(200);
//   return callback(null, rs);
// };

module.exports = Service;
