const axios = require("axios");
const crypto = require("crypto");

const Utils = require("../modules/Utils");

var partnerCode = "MOMO";
var accessKey = "F8BBA842ECF85";
var secretkey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
var orderId = partnerCode + new Date().getTime() + Utils.generateId(3);
var description = "";

let Service = {};

Service.refundMoMo = async (params, callback = noop) => {
  let { amount, transId, requestId } = params;
  console.log(params, "pamras");

  var rawSignature =
    "accessKey=" +
    accessKey +
    "&amount=" +
    amount +
    "&description=" +
    description +
    "&orderId=" +
    orderId +
    "&partnerCode=" +
    partnerCode +
    "&requestId=" +
    requestId +
    "&transId=" +
    transId;

  var signature = crypto
    .createHmac("sha256", secretkey)
    .update(rawSignature)
    .digest("hex");

  const requestBody = JSON.stringify({
    partnerCode: partnerCode,
    orderId: orderId,
    requestId: requestId,
    amount: amount,
    transId: transId,
    lang: "vi",
    description: description,
    signature: signature,
  });
  let data = {
    partnerCode: partnerCode,
    orderId: orderId,
    requestId: requestId,
    amount: amount,
    transId: transId,
    lang: "vi",
    description: description,
    signature: signature,
  };
  //   console.log(data);
  axios({
    method: "POST",
    url: `https://test-payment.momo.vn/v2/gateway/api/refund`,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  }).then((res) => {
    // console.log(res, "response");

    let bodyParse = Utils.safeParse(res.data);

    if (bodyParse) return callback(null, bodyParse);

    return callback("INFONOTFOUND", res.data);
  });
};

module.exports = Service;
