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
    discount,
    status,
    qty,
    cate_id,
  } = params;

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

  const idImage = Untils.generateId(8);

  let errUpload, rsUpload;
  [errUpload, rsUpload] = await Untils.to(uploadFileImage(image_link, idImage));
  if (errUpload) {
    let result = _error(9998, errUpload);
    return callback(9998, { data: result });
  }
  const imageDemo = rsUpload;
  let listImage = [];

  for (image of image_list) {
    let err, rs;
    [err, rs] = await Untils.to(uploadFileImage(image, idImage));
    if (err) {
      console.log(err, "upload file failed!!!");
    }
    listImage.push({ image_link: rs });
  }

  let dataProduct = {
    name: name,
    price: price,
    content: content ? content : "",
    view: 0,
    sold: 0,
    status: status ? status : 0,
    discount: discount ? discount : 0,
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

Service.editProduct = async (params, callback) => {
  // console.log(params, "ok");
  // let files = await bucket.getFiles()
  // files = files[0].filter(f => f.id.includes(dirName + '/'));
  // console.log(files, "listimage");
  // return;

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
    !image_link ||
    !image_list ||
    !qty ||
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

  // delete file old

  // const imageLink = rsProduct.image_link;
  // const imageList = Untils.safeParse(rsProduct.image_list);
  // console.log(imageLink, "imglink");
  // let errDelImg;
  // errDelImg = await bucket.file(rsProduct.image_link).delete();
  // if (errDelImg) {
  //   console.log("delete file: ", rsProduct.image_link);
  // }
  // for (image of imageList) {
  //   await bucket.file(image.image_link).delete();
  // }
  // console.log("done delete files ...");

  //upload new file
  // const idImage = Untils.generateId(8);

  // let errUpload, rsUpload;
  // [errUpload, rsUpload] = await Untils.to(uploadFileImage(image_link, idImage));
  // if (errUpload) {
  //   let result = _error(9998, errUpload);
  //   return callback(9998, { data: result });
  // }
  // const imageDemo = rsUpload;
  // let listImage = [];

  // for (image of image_list) {
  //   let err, rs;
  //   [err, rs] = await Untils.to(uploadFileImage(image, idImage));
  //   if (err) {
  //     console.log(err, "upload file failed!!!");
  //   }
  //   listImage.push({ image_link: rs });
  // }

  let dataUpateProduct = {
    name: name,
    price: price,
    content: content ? content : "",
    view: 0,
    sold: 0,
    status: status ? status : 0,
    discount: discount ? discount : 0,
    // image_link: imageDemo,
    // image_list: JSON.stringify(listImage),
    qty: qty,
  };

  let errP, rsP;
  [errP, rsP] = await Untils.to(
    Product.update(dataUpateProduct, { where: { id: id } })
  );
  if (errP) {
    let result = _error(7001, errP);
    return callback(7001, { data: result });
  }

  let findCate = {
    where: {
      id: cate_id,
    },
    raw: true,
  };

  let errCate, rsCate;
  [errCate, rsCate] = await Untils.to(Category.findOne(findCate));
  if (errCate) {
    let result = _error(2000, errCate);
    return callback(2000, { data: result });
  }
  if (!rsCate) {
    let result = _error(2000, errCate);
    return callback(2000, { data: result });
  }

  let where = {
    where: {
      product_id: id,
    },
  };
  let dataCatePro = {
    catelog_id: cate_id,
    product_id: id,
  };

  console.log(where, "where");
  console.log(dataCatePro, "dataCatePro");

  let errCatePro, rsCatePro;
  [errCatePro, rsCatePro] = await Untils.to(
    Cate_Product.update(dataCatePro, where)
  );
  if (errCatePro) {
    let result = _error(7002, errCatePro);
    return callback(7002, { data: result });
  }

  let result = _success(200);
  return callback(null, { data: result });
};

Service.deleteProduct = async (params, callback) => {
  if (!params) {
    result = _error(1000);
    return callback(1000, { data: result });
  }

  let { id } = params;

  if (!id) {
    result = _error(1000);
    return callback(1000, { data: result });
  }

  let where = {
    where: {
      id: id,
    },
    raw: true,
  };

  let dataProduct = {
    status: 1,
  };

  let errProduct, rsProduct;
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
    result = _error(1000);
    return callback(1000, { data: result });
  }

  let { id } = params;

  if (!id) {
    result = _error(1000);
    return callback(1000, { data: result });
  }

  let where = {
    where: {
      id: id,
    },
    raw: true,
  };

  let errProduct, rsProduct;
  [errProduct, rsProduct] = await Untils.to(Product.update(dataProduct, where));
  if (errProduct) {
    let result = _error(500, errProduct);
    return callback(500, { data: result });
  }

  let result = _success(200);
  return callback(null, result);
};

module.exports = Service;
