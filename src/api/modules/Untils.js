const MESSAGESCONFIG = require("../Messages");
const MESSAGES = MESSAGESCONFIG.messages;

function to(promise) {
  return promise
    .then((data) => {
      return [null, data];
    })
    .catch((err) => [err]);
}

let safeParse = (str) => {
  try {
    if (typeof str == "object") return str;
    return JSON.parse(str);
  } catch (ex) {
    // console.log('safeParse ex=', ex);
    return null;
  }
};

let _error = (errorCode, err, messageERR = "") => {
  return {
    errorCode: errorCode,
    message: MESSAGES[errorCode],
    messageERR,
    err: err ? err : "ERROR",
  };
};

let _success = (succesCode) => {
  return {
    errorCode: succesCode,
    message: MESSAGES[succesCode],
  };
};

let generateId = (length) => {
  return Math.floor(
    Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1)
  );
};

// const linkImage = "https://storage.googleapis.com/cloudimage123/";
const linkImage = "https://res.cloudinary.com/denztyim4/image/upload/v1661151316/DOANTHUCTAP/images/";
const linkImageCloudinary =
  "https://res.cloudinary.com/denztyim4/image/upload/v1661151316/DOANTHUCTAP/images/";

module.exports = {
  to,
  _error,
  _success,
  safeParse,
  generateId,
  linkImage,
  linkImageCloudinary,
};
