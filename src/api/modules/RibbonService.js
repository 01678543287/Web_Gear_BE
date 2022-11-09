const { DateTime } = require("luxon");
const { eachLimit } = require("async");

const db = require("../../config/connectDB");
const Ribbon = require("../../models/Ribbon");
const Ribbon_Detail = require("../../models/Ribbon_Detail");

const Untils = require("./Utils");
const _error = Untils._error;
const _success = Untils._success;
const MESSAGESCONFIG = require("../Messages");
const Product = require("../../models/Product");
const MESSAGES = MESSAGESCONFIG.messages;

let Service = {};

Service.getRibbon = async (params, callback) => {
  // const [err, rs] = await Untils.to(Ribbon.create({ name: "Đề xuất" }));
  // console.log(err,'err======')
  // console.log(rs,'rs======')
  let errRibbon, rsRibbon;
  [errRibbon, rsRibbon] = await Untils.to(
    Ribbon.findAll({
      where: { active: 0 },
      order: [["priority", "ASC"]],
      raw: true,
    })
  );
  // console.log(rsRibbon, "ribbon");
  if (errRibbon) {
    let result = _error(404, errRibbon);
    return callback(404, { data: result });
  }
  for (rib of rsRibbon) {
    let errRibbonDetail, ribDetail;
    [errRibbonDetail, ribDetail] = await Untils.to(
      Ribbon_Detail.findAll({ where: { ribbon_id: rib.id }, raw: true })
    );
    if (errRibbonDetail) {
      let result = _error(404, errRibbonDetail);
      return callback(404, { data: result });
    }

    // console.log(ribDetail, 'ribdetail')
    let listProduct = [];
    for (item of ribDetail) {
      let errPro, rsPro;
      [errPro, rsPro] = await Untils.to(
        Product.findOne({
          where: { id: item.product_id, status: 0 },
          raw: true,
        })
      );
      if (rsPro) {
        rsPro.discount = parseFloat(rsPro.discount);
        rsPro.price = parseFloat(rsPro.price);
        rsPro.image_link = Untils.linkImage + rsPro.image_link;
        rsPro.image_list = Untils.safeParse(rsPro.image_list);
        for (image of rsPro.image_list) {
          image.image_link = Untils.linkImage + image.image_link;
        }
        listProduct.push(rsPro);
      }
    }
    rib.products = listProduct;
  }

  // console.log(JSON.stringify(rsRibbon), "ribbon=0=0=-0=-0=-0");

  let result = _success(200);
  result.ribbon = rsRibbon;
  return callback(null, result);
};

module.exports = Service;
