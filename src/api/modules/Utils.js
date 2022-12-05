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

function removeVietnameseTones(str) {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  // Some system encode vietnamese combining accent as individual utf-8 characters
  // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
  // Remove extra spaces
  // Bỏ các khoảng trắng liền nhau
  str = str.replace(/ + /g, " ");
  str = str.trim();
  // Remove punctuations
  // Bỏ dấu câu, kí tự đặc biệt
  str = str.replace(
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
    " "
  );
  return str;
}

let removeDuplicate = (arr) => {
  let set = new Set(arr);
  return [...set];
};

let cb2Promise = (fn, ...arg) => {
  let p = new Promise((resolve, reject) => {
    let _fnCb = (err, ...results) => {
      if (err) return reject(err);

      if (results && results.length == 1) return resolve(results[0]);
      return resolve(results);
    };

    let _fnExec = null;
    let _args = [];

    if (Array.isArray(fn)) {
      if (typeof fn[0] != "function") {
        throw new Error("EUNKNOWARGS");
      }

      _fnExec = fn[0];
      _args = Array.prototype.slice.call(fn, 1);
    } else if (typeof fn == "function") {
      _fnExec = fn;
      _args = arg;
    } else {
      throw new Error("EUNKNOWARGS");
    }

    _args.push(_fnCb);

    _fnExec.apply(_fnExec, _args);
  });

  return p;
};


// const linkImage = "https://storage.googleapis.com/cloudimage123/";
const linkImage =
  "https://res.cloudinary.com/denztyim4/image/upload/v1661151316/DOANTHUCTAP/images/";
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
  removeVietnameseTones,
  removeDuplicate,
  cb2Promise,
};
