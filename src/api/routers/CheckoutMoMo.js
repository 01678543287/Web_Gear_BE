var partnerCode = "MOMO";
var accessKey = "F8BBA842ECF85";
var secretkey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
var requestId = partnerCode + new Date().getTime(); //done
var orderId = requestId; //done
var orderInfo = "pay with MoMo"; //done
var redirectUrl = "https://momo.vn/return";
// var redirectUrl = "http://localhost:3000/order/"; //done
var ipnUrl = "https://callback.url/notify"; //done
// var ipnUrl = "http://localhost:8000/api/checkout/webhookMomo";
var amount = "50000"; //done
var requestType = "captureWallet"; //done
var extraData = ""; //pass empty value if your merchant does not have stores

//before sign HMAC SHA256 with format
//accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
var rawSignature =
  "accessKey=" +
  accessKey +
  "&amount=" +
  amount +
  "&extraData=" +
  extraData +
  "&ipnUrl=" +
  ipnUrl +
  "&orderId=" +
  orderId +
  "&orderInfo=" +
  orderInfo +
  "&partnerCode=" +
  partnerCode +
  "&redirectUrl=" +
  redirectUrl +
  "&requestId=" +
  requestId +
  "&requestType=" +
  requestType; //done
//puts raw signature
console.log("--------------------RAW SIGNATURE----------------");
console.log(rawSignature);
//signature
const crypto = require("crypto");
var signature = crypto
  .createHmac("sha256", secretkey)
  .update(rawSignature)
  .digest("hex"); //done
console.log("--------------------SIGNATURE----------------");
console.log(signature);

//json object send to MoMo endpoint
const requestBody = JSON.stringify({
  partnerCode: partnerCode,
  accessKey: accessKey,
  requestId: requestId,
  amount: amount,
  orderId: orderId,
  orderInfo: orderInfo,
  redirectUrl: redirectUrl,
  ipnUrl: ipnUrl,
  extraData: extraData,
  requestType: requestType,
  signature: signature,
  lang: "en",
}); //done
const requestBody123 = {
  partnerCode: partnerCode,
  accessKey: accessKey,
  requestId: requestId,
  amount: amount,
  orderId: orderId,
  orderInfo: orderInfo,
  redirectUrl: redirectUrl,
  ipnUrl: ipnUrl,
  extraData: extraData,
  requestType: requestType,
  signature: signature,
  lang: "en",
}; //done
//Create the HTTPS objects
const https = require("https");
const options = {
  hostname: "test-payment.momo.vn",
  port: 443,
  path: "/v2/gateway/api/create",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(requestBody),
  },
};
//Send the request and get the response
const axios = require("axios");
const request = require("request");

request(
  {
    url: "https://test-payment.momo.vn/v2/gateway/api/create",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: requestBody,
  },
  (err, response, body) => {
    console.log(err, "err");
    console.log(response, "response");
    console.log(body, "body");
  }
);

// axios({
//   method: "POST",
//   url: `https://test-payment.momo.vn/v2/gateway/api/create`,
//   headers: {
//     "Content-Type": "application/json",
//     // "Content-Length": Buffer.byteLength(requestBody),
//     // "Content-Type": "text/html; charset=utf-8",
//   },
//   data: requestBody123,
// })
//   .then((res) => {
//     // res.setContentEncoding("utf8");
//     console.log(res);
//     console.log(res.data, "response");

//     // let bodyParse = Utils.safeParse(res.data);

//     // if (bodyParse) return callback(null, bodyParse);

//     // return callback("INFONOTFOUND", res.data);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// const req = https.request(options, (res) => {
//   // console.log(`Status: ${res.statusCode}`);
//   // console.log(`Headers: ${JSON.stringify(res.headers)}`);
//   res.setEncoding("utf8");
//   res.on("data", async (body) => {
//     console.log("Body: ");
//     console.log(JSON.parse(body));
//     console.log("payUrl: ");
//     console.log(JSON.parse(body).payUrl);
//   });

//   res.on("end", () => {
//     console.log("No more data in response.");
//   });
// });

// req.on("error", (e) => {
//   console.log(`problem with request: ${e.message}`);
// });
// // write data to request body
// console.log("Sending....");
// req.write(requestBody);
// req.end();
