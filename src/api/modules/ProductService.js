const { DateTime } = require("luxon");
const { eachLimit } = require("async");
const {
  uploadFileImage,
  multer,
  bucket,
} = require("../upload/UploadFileCloud");

const db = require("../../config/connectDB");
const Product = require("../../models/Product");
const Category = require("../../models/Category");
const Cate_Product = require("../../models/Cate_Product");

const Untils = require("../modules/Untils");
const _error = Untils._error;
const _success = Untils._success;
const MESSAGESCONFIG = require("../Messages");
const { sequelize } = require("../../config/connectDB");
const MESSAGES = MESSAGESCONFIG.messages;

let Service = {};

Service.getAllProduct = async (params, callback) => {
  let errProduct, resultProduct;
  [errProduct, resultProduct] = await Untils.to(
    Product.findAll({
      where: { status: 0 },
      raw: true,
    })
  );
  if (!resultProduct) {
    let result = _error(7000);
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
      let img = Untils.safeParse(item.image_list);
      item.image_list = img;
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
    warehouse_id,
    qty,
    cate_id,
  } = params;

  console.log(params);

  if (
    !name ||
    !price ||
    !image_link ||
    !image_list ||
    !warehouse_id ||
    !qty ||
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

  let errUpload, rsUpload;
  [errUpload, rsUpload] = await Untils.to(uploadFileImage(image_link));
  if (errUpload) {
    let result = _error(9998, errUpload);
    return callback(9998, { data: result });
  }
  const imageDemo = rsUpload;
  let listImage = [];

  for (image of image_list) {
    let err, rs;
    [err, rs] = await Untils.to(uploadFileImage(image));
    listImage.push({ image_link: rs });
  }

  let dataProduct = {
    name: name,
    price: price,
    content: content,
    view: 0,
    sold: 0,
    status: 0,
    discount: 0,
    image_link: imageDemo,
    image_list: JSON.stringify(listImage),
    warehouse_id: warehouse_id,
    qty: qty,
  };

  let errProduct, rsProduct;
  [errProduct, rsProduct] = await Untils.to(
    Product.create(dataProduct, { raw: true })
  );
  if (errProduct) {
    let result = _error(4000, errProduct);
    return callback(4000, { data: result });
  }
  let errCatePro, rsCatePro;
  [errCatePro, rsCatePro] = await Untils.to(
    Cate_Product.create({ catelog_id: cate_id, product_id: rsProduct.id })
  );
  if (errCatePro) {
    let result = _error(8000, errCatePro);
    return callback(8000, result);
  }
  let result = _success(200);
  return callback(null, result);
};

Service.getPromoByID = async (params, callback) => {
  if (!params) {
    let result = _error(1000, err);
    return callback(1000, { data: result });
  }

  let { promo_id } = params;
  if (!promo_id) {
    let result = _error(1000, err);
    return callback(1000, { data: result });
  }
  let where = {
    where: {
      id: promo_id,
    },
    raw: true,
  };
  let errPromo, rsPromo;
  [errPromo, rsPromo] = await Untils.to(Promo.findOne(where));
  if (errPromo) {
    let result = _error(2002, errPromo);
    return callback(2002, { data: result });
  }

  let result = _success(200);
  result.promo = rsPromo;
  return callback(null, result);
};

Service.editPromo = async (params, callback) => {
  if (!params) {
    result = _error(1000, err);
    return callback(1000, { data: result });
  }

  let { id, title, code, status, type, value_type } = params;

  if (!id) {
    let result = _error(1000);
    return callback(1000, { data: result });
  }

  let dataPromo = {
    title: title,
    code: code,
    status: status,
    type: type,
    value_type: value_type,
  };

  let where = {
    where: {
      id: id,
    },
    raw: true,
  };

  let errPromo, resultPromo;
  [errPromo, resultPromo] = await Untils.to(Promo.update(dataPromo, where));
  if (errPromo) {
    let result = _error(2002, errPromo);
    return callback(2002, { data: result });
  }

  let result = _success(200);
  return callback(null, result);
};

Service.deletePromo = async (params, callback) => {
  if (!params) {
    result = _error(1000, err);
    return callback(1000, { data: result });
  }

  let { promo_id } = params;
  if (!promo_id) {
    result = _error(1000, err);
    return callback(1000, { data: result });
  }

  let where = {
    where: {
      id: promo_id,
    },
    raw: true,
  };

  let errPromo, rsPromo;
  [errPromo, rsPromo] = await Untils.to(Promo.destroy(where));
  if (errPromo) {
    let result = _error(500, errPromo);
    return callback(500, { data: result });
  }

  let result = _success(200);
  return callback(null, result);
};

module.exports = Service;
