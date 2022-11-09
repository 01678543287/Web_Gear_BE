const { DateTime } = require("luxon");
const { eachLimit, forEach } = require("async");
const {
  uploadFileImageCloudinaryCloudinary,
  uploadFileImageCloudinary,
  multer,
  bucket,
} = require("../upload/UploadFileCloud");

const db = require("../../config/connectDB");
const Product = require("../../models/Product");
const Category = require("../../models/Category");
const Category_Detail = require("../../models/Category_Detail");
const Rate = require("../../models/Rate");
const User = require("../../models/Users");

const Untils = require("./Utils");
const _error = Untils._error;
const _success = Untils._success;
const MESSAGESCONFIG = require("../Messages");
const { sequelize } = require("../../config/connectDB");
const { QueryTypes } = require("sequelize");
const MESSAGES = MESSAGESCONFIG.messages;

let Service = {};

Service.getAllProduct = async (params, callback) => {
  let errProduct, resultProduct;
  [errProduct, resultProduct] = await Untils.to(
    Product.findAll({
      where: { status: 0 },
      order: [["createdAt", "DESC"]],
      raw: true,
    })
  );
  if (errProduct) {
    let result = _error(7000, errProduct);
    return callback(7000, { data: result });
  }
  if (!resultProduct) {
    let result = _error(7000, errProduct);
    return callback(7000, { data: result });
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

Service.getAllProductNH = async (params, callback) => {
  let errProduct, resultProduct;
  [errProduct, resultProduct] = await Untils.to(
    Product.findAll({
      order: [["createdAt", "DESC"]],
      raw: true,
    })
  );
  if (errProduct) {
    let result = _error(7000, errProduct);
    return callback(7000, { data: result });
  }
  if (!resultProduct) {
    let result = _error(7000, errProduct);
    return callback(7000, { data: result });
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

Service.getAllProductAdmin = async (params, callback) => {
  let errProduct, resultProduct;
  [errProduct, resultProduct] = await Untils.to(
    Product.findAll({
      order: [["createdAt", "DESC"]],
      raw: true,
    })
  );
  if (errProduct) {
    let result = _error(7000, errProduct);
    return callback(7000, { data: result });
  }
  if (!resultProduct) {
    let result = _error(7000, errProduct);
    return callback(7000, { data: result });
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

Service.createProduct = async (params, callback) => {
  if (!params) {
    result = _error(1000, err);
    return callback(1000, { data: result });
  }
  // params.warehouse_id = "5b9d1d26-d443-48d0-8761-68ccf4303644";
  let {
    name,
    price,
    content,
    image_link,
    image_list,
    // warehouse_id,
    // discount,
    status,
    qty,
    cate_id,
    brand_id,
  } = params;

  if (
    !name ||
    !price ||
    !image_link ||
    !image_list ||
    // !warehouse_id ||
    // !qty ||
    !cate_id
  ) {
    let result = _error(1000);
    return callback(1000, { data: result });
  }

  let whereCate = {
    where: {
      id: cate_id,
    },
    raw: true,
  };
  let errCate, rsCate;
  [errCate, rsCate] = await Untils.to(Category.findOne(whereCate));
  if (errCate) {
    let result = _error(2000, errCate);
    return callback(2000, result);
  }
  if (!rsCate) {
    let result = _error(2000, errCate);
    return callback(2000, result);
  }

  const idImage = Untils.generateId(8);

  let errUpload, rsUpload;
  [errUpload, rsUpload] = await Untils.to(
    uploadFileImageCloudinary(image_link, idImage)
  );
  if (errUpload) {
    let result = _error(9998, errUpload);
    return callback(9998, { data: result });
  }

  const imageDemo = rsUpload;
  let listImage = [];

  for (image of image_list) {
    let err, rs;
    [err, rs] = await Untils.to(uploadFileImageCloudinary(image, idImage));
    if (err) {
      console.log(err, "upload file failed!!!");
    }
    listImage.push({ image_link: rs });
  }

  let dataProduct = {
    name: name,
    name_without_unicode: Untils.removeVietnameseTones(name),
    price: price,
    content: content ? content : "Chưa có mô tả",
    view: 0,
    sold: 0,
    status: status ? status : 0,
    image_link: imageDemo,
    image_list: JSON.stringify(listImage),
    brand_id: "1", //test
    // qty: qty,
    cate_id: cate_id,
  };

  let errProduct, rsProduct;
  [errProduct, rsProduct] = await Untils.to(
    Product.create(dataProduct, { raw: true })
  );
  if (errProduct) {
    let result = _error(7003, errProduct);
    return callback(7003, { data: result });
  }

  let result = _success(200);
  return callback(null, result);
};

Service.editProduct = async (params, callback) => {
  if (!params) {
    let result = _error(1000, err);
    return callback(1000, { data: result });
  }

  const {
    id,
    name,
    price,
    status,
    discount,
    content,
    image_link,
    image_list,
    qty,
    cate_id,
  } = params;

  if (
    !id ||
    !name ||
    !price ||
    // !image_link ||
    // !image_list ||
    // !qty ||
    !cate_id
  ) {
    let result = _error(1000);
    return callback(1000, { data: result });
  }

  let findProduct = {
    where: {
      id: id,
    },
    raw: true,
  };
  let errProduct, rsProduct;
  [errProduct, rsProduct] = await Untils.to(Product.findOne(findProduct));
  if (errProduct) {
    let result = _error(7000, errProduct);
    return callback(7000, { data: result });
  }
  if (!rsProduct) {
    let result = _error(7000);
    return callback(7000, { data: result });
  }

  let dataUpateProduct = {
    name: name,
    name_without_unicode: Untils.removeVietnameseTones(name),
    price: price,
    content: content ? content : "Chưa có mô tả",
    status: status ? status : 1,
    // discount: discount ? discount : 0,
    // image_link: imageDemo,
    // image_list: JSON.stringify(listImage),
    qty: qty,
    cate_id: cate_id,
    brand_id: '1',//test
  };

  const idImage = Untils.generateId(8);

  if (image_link) {
    let errUpload, rsUpload;
    [errUpload, rsUpload] = await Untils.to(
      uploadFileImageCloudinary(image_link, idImage)
    );
    if (errUpload) {
      let result = _error(9998, errUpload);
      return callback(9998, { data: result });
    }

    const imageDemo = rsUpload;
    dataUpateProduct.image_link = imageDemo;
  }

  if (image_list) {
    let listImage = [];

    for (image of image_list) {
      let err, rs;
      [err, rs] = await Untils.to(uploadFileImageCloudinary(image, idImage));
      if (err) {
        console.log(err, "upload file failed!!!");
      }
      listImage.push({ image_link: rs });
    }
    dataUpateProduct.image_list = JSON.stringify(listImage);
  }

  let errP, rsP;
  [errP, rsP] = await Untils.to(
    Product.update(dataUpateProduct, { where: { id: id } })
  );
  if (errP) {
    let result = _error(7001, errP);
    return callback(7001, { data: result });
  }

  let result = _success(200);
  return callback(null, { data: result });
};

Service.deleteProduct = async (params, callback) => {
  if (!params) {
    let result = _error(1000);
    return callback(1000, { data: result });
  }

  let { id } = params;

  if (!id) {
    let result = _error(1000);
    return callback(1000, { data: result });
  }

  let where = {
    where: {
      id: id,
    },
    raw: true,
  };

  let errProduct, rsProduct;
  [errProduct, rsProduct] = await Untils.to(Product.findOne(where));
  if (errProduct) {
    let result = _error(500, errProduct);
    return callback(500, { data: result });
  }

  let dataProduct = {
    status: rsProduct.status && rsProduct.status === 1 ? 0 : 1,
  };

  [errProduct, rsProduct] = await Untils.to(Product.update(dataProduct, where));
  if (errProduct) {
    let result = _error(500, errProduct);
    return callback(500, { data: result });
  }

  let result = _success(200);
  return callback(null, result);
};

Service.getAProductDetail = async (params, callback) => {
  if (!params) {
    let result = _error(1000);
    return callback(1000, { data: result });
  }

  let { id, user } = params;

  if (!id) {
    let result = _error(1000);
    return callback(1000, { data: result });
  }

  let where = {
    where: {
      id: id,
    },
    raw: true,
  };

  let errProduct, rsProduct;
  [errProduct, rsProduct] = await Untils.to(Product.findOne(where));
  if (errProduct) {
    let result = _error(500, errProduct);
    return callback(500, { data: result });
  }
  if (!rsProduct) {
    let result = _error(7000);
    return callback(7000, { data: result });
  }

  //update view for product
  let dataUpateP = {
    view: parseInt(rsProduct.view) + 1,
  };
  let errP, rsP;
  [errP, rsP] = await Untils.to(Product.update(dataUpateP, where));
  if (errP) {
    console.log("update view + 1 failed");
  }

  rsProduct.price = parseFloat(rsProduct.price);
  rsProduct.image_link = Untils.linkImage + rsProduct.image_link;
  rsProduct.image_list = Untils.safeParse(rsProduct.image_list);
  for (image of rsProduct.image_list) {
    image.image_link = Untils.linkImage + image.image_link;
  }

  let findRate = {
    where: {
      product_id: id,
    },
    raw: true,
  };
  let errRate, rsRate;
  [errRate, rsRate] = await Untils.to(Rate.findAll(findRate));
  if (errRate) {
    console.log("get rate product error: ", errRate);
  }
  let totalPoint = 0;
  let count = 0;
  rsRate.forEach((rate) => {
    totalPoint += rate.point;
    count++;
  });

  if (count === 0) count = 1;

  rsProduct.rate = totalPoint / count;

  // const findCate = {
  //   where: {
  //     product_id: id,
  //   },
  //   raw: true,
  // };
  // let errC, rsC;
  // [errC, rsC] = await Untils.to(Cate_Product.findOne(findCate));

  // if (!errC) {
  //   rsProduct.category = rsC;
  // }

  let result = _success(200);
  result.product = rsProduct;
  return callback(null, result);
};

// Service.getAProductDetail123 = async (params, callback) => {
//   if (!params) {
//     let result = _error(1000);
//     return callback(1000, { data: result });
//   }

//   let { id, user } = params;

//   if (!id) {
//     let result = _error(1000);
//     return callback(1000, { data: result });
//   }

//   let where = {
//     where: {
//       id: id,
//     },
//     raw: true,
//   };

//   let errProduct, rsProduct;
//   [errProduct, rsProduct] = await Untils.to(Product.findOne(where));
//   if (errProduct) {
//     let result = _error(500, errProduct);
//     return callback(500, { data: result });
//   }
//   if (!rsProduct) {
//     let result = _error(7000);
//     return callback(7000, { data: result });
//   }

//   //update view for product
//   let dataUpateP = {
//     view: parseInt(rsProduct.view) + 1,
//   };
//   let errP, rsP;
//   [errP, rsP] = await Untils.to(Product.update(dataUpateP, where));
//   if (errP) {
//     console.log("update view + 1 failed");
//   }

//   if (user) {
//     let dataH = {
//       product_id: id,
//       user_id: user.id,
//     };
//     let errH, rsH;
//     [errH, rsH] = await Untils.to(History.create(dataH));
//     if (errH) {
//       console.log(`Create history error: ${errH}`);
//     }
//   }

//   rsProduct.discount = parseFloat(rsProduct.discount);
//   rsProduct.price = parseFloat(rsProduct.price);
//   rsProduct.image_link = Untils.linkImage + rsProduct.image_link;
//   rsProduct.image_list = Untils.safeParse(rsProduct.image_list);
//   for (image of rsProduct.image_list) {
//     image.image_link = Untils.linkImage + image.image_link;
//   }

//   let cmt = await db.sequelize.query(
//     `SELECT U.ID as user_id,
//             U.NAME as user_name,
//             U.AVATAR as user_avatar,
//             C.*
//     FROM  COMMENT AS C INNER JOIN USERS AS U ON C.USER_ID = U.ID,
//           PRODUCTS AS P
//     WHERE U.STATUS = 1 AND P.ID = '${id}'`,
//     { type: QueryTypes.SELECT, raw: true }
//   );

//   rsProduct.cmt = cmt;

//   let findRate = {
//     where: {
//       product_id: id,
//     },
//     raw: true,
//   };
//   let errRate, rsRate;
//   [errRate, rsRate] = await Untils.to(Rate.findAll(findRate));
//   if (errRate) {
//     console.log("get rate product error: ", errRate);
//   }
//   let totalPoint = 0;
//   let count = 0;
//   rsRate.forEach((rate) => {
//     totalPoint += rate.point;
//     count++;
//   });

//   if (count === 0) count = 1;

//   rsProduct.rate = totalPoint / count;

//   const findCate = {
//     where: {
//       product_id: id,
//     },
//     raw: true,
//   };
//   let errC, rsC;
//   [errC, rsC] = await Untils.to(Cate_Product.findOne(findCate));

//   if (!errC) {
//     rsProduct.category = rsC;
//   }

//   let result = _success(200);
//   result.product = rsProduct;
//   return callback(null, result);
// };

module.exports = Service;
