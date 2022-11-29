const { DateTime } = require("luxon");
const { eachLimit, forEach } = require("async");
const moment = require("moment");
const { now } = require("moment");
const _ = require("lodash");

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
const Thay_Doi_Gia = require("../../models/Thay_Doi_Gia");
const Dot_Khuyen_Mai = require("../../models/Dot_Khuyen_Mai");
const Chi_Tiet_Dot_Khuyen_Mai = require("../../models/Chi_Tiet_Dot_Khuyen_Mai");

const Untils = require("./Utils");
const _error = Untils._error;
const _success = Untils._success;
const MESSAGESCONFIG = require("../Messages");
const { sequelize } = require("../../config/connectDB");
const { Op, QueryTypes } = require("sequelize");
const Brand = require("../../models/Brand");
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
      item.price = parseFloat(item.price);
      item.image_link = Untils.linkImage + item.image_link;
      let imageList = Untils.safeParse(item.image_list);
      for (img of imageList) {
        img.image_link = Untils.linkImage + img.image_link;
      }
      item.image_list = imageList;

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

      let [errRate, rsRate] = await Untils.to(
        Rate.findAndCountAll({ where: { product_id: item.id }, raw: true })
      );
      if (errRate) {
        let result = _error(8700, errRate);
        return callback(8700, { data: result });
      }
      let ratePoint = 0;
      if (rsRate.rows.length > 0) {
        ratePoint = _.sumBy(rsRate.rows, "point") / rsRate.count;
      }
      item.pointRate = ratePoint;
    },
    (err, result) => {
      if (err) {
        console.log(err);
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

Service.getProductListDKM = async (params, callback) => {
  let query = `SELECT p.* 
                FROM products p LEFT JOIN chi_tiet_dot_khuyen_mai dkm ON p.id = dkm.product_id
                WHERE p.status = 0 AND dkm.id IS NULL`;

  let resultProduct = await db.sequelize.query(query, {
    type: QueryTypes.SELECT,
    raw: true,
  });

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
  let {
    name,
    price,
    content,
    image_link,
    image_list,
    status,
    qty,
    cate_id,
    brand_id,
    user,
  } = params;

  if (
    !name ||
    !price ||
    !image_link ||
    !image_list ||
    !cate_id ||
    !price ||
    !brand_id ||
    !user
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

  let whereBrand = {
    where: {
      id: brand_id,
    },
    raw: true,
  };
  let [errBrand, rsBrand] = await Untils.to(Brand.findOne(whereBrand));
  if (errBrand) {
    let result = _error(2000, errBrand);
    return callback(2000, result);
  }
  if (!rsBrand) {
    let result = _error(2000);
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
    brand_id: brand_id,
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

  let dataPrice = {
    product_id: rsProduct.id,
    admin_id: user.id,
    price_change_date_to: moment(rsProduct.createdAt).format(
      "YYYY-MM-DD HH:mm:ss"
    ),
    price: price,
  };
  let [errPrice, rsPrice] = await Untils.to(Thay_Doi_Gia.create(dataPrice));
  if (errPrice) {
    let result = _error(7004, errPrice);
    return callback(7004, { data: result });
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
    content,
    image_link,
    image_list,
    qty,
    cate_id,
    brand_id,
    user,
  } = params;

  if (!id || !name || !price || !cate_id || !brand_id || !user) {
    let result = _error(1000);
    return callback(1000, { data: result });
  }

  let findProduct = {
    where: {
      id: id,
    },
    raw: true,
  };
  let [errProduct, rsProduct] = await Untils.to(Product.findOne(findProduct));
  if (errProduct) {
    let result = _error(7000, errProduct);
    return callback(7000, { data: result });
  }
  if (!rsProduct) {
    let result = _error(7000);
    return callback(7000, { data: result });
  }

  if (parseInt(rsProduct.price) !== parseInt(price)) {
    let nowData = moment(now()).format("YYYY-MM-DD HH:mm:ss");
    let dataUpdate = {
      price_change_date_from: nowData,
      active: 1,
    };
    let where = {
      where: { product_id: id, active: 0 },
    };
    let [errUPrice, rsUPrice] = await Untils.to(
      Thay_Doi_Gia.update(dataUpdate, where)
    );
    if (errUPrice) {
      console.log(errUPrice);
      let result = _error(7005, errUPrice);
      return callback(7005, { data: result });
    }

    let dataPrice = {
      product_id: id,
      admin_id: user.id,
      price_change_date_to: nowData,
      price: price,
    };
    let [errPrice, rsPrice] = await Untils.to(Thay_Doi_Gia.create(dataPrice));
    if (errPrice) {
      let result = _error(7004, errPrice);
      return callback(7004, { data: result });
    }
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
    brand_id: brand_id,
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

  let queryDKM = `SELECT max(dkmd.value) as max
                    FROM products p
                      INNER JOIN chi_tiet_dot_khuyen_mai dkmd ON dkmd.product_id = p.id
                      INNER JOIN dot_khuyen_mai dkm ON dkm.id = dkmd.dotkhuyenmai_id
                    WHERE p.id = '${id}' 
                      AND dkm."start_At" <= NOW()
                        AND dkm."end_At" >= NOW()`;
  let dkmd = await db.sequelize.query(queryDKM, {
    type: QueryTypes.SELECT,
    raw: true,
  });
  let valueMax = dkmd[0].max ? dkmd[0].max : 0;

  rsProduct.priceKM =
    valueMax !== 0 ? (rsProduct.price * (100 - valueMax)) / 100 : null;

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

  let query = `SELECT u.name, u.avatar, rate.comment, rate.point, rate.id as id
                FROM rate 
                  INNER JOIN public."order" as o ON rate.order_id = o.id
                  INNER JOIN users as u ON u.id = o.user_id
                WHERE rate.product_id = '${id}' 
                ORDER BY rate."createdAt" DESC`; //AND rate.comment != 'null'
  let cmtQuery = await db.sequelize.query(query, {
    type: QueryTypes.SELECT,
    raw: true,
  });

  rsProduct.comment = cmtQuery ? cmtQuery : [];

  let result = _success(200);
  result.product = rsProduct;
  return callback(null, result);
};

module.exports = Service;
