const { DateTime } = require("luxon");
const { eachLimit } = require("async");
const async = require("async");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  uploadFileImage,
  multer,
  bucket,
} = require("../upload/UploadFileCloud");

const db = require("../../config/connectDB");
const User = require("../../models/Users");
const Card = require("../../models/Cart");

const Untils = require("../modules/Untils");
const _error = Untils._error;
const _success = Untils._success;
const MESSAGESCONFIG = require("../Messages");
const { sequelize } = require("../../config/connectDB");
const MESSAGES = MESSAGESCONFIG.messages;

let Service = {};

Service.createUser = async (params, callback) => {
  let { name, age, email, phone, address, password, avatar, gender } = params;
  if (!email || !password) {
    let result = _error(1000, err);
    return callback(1000, { data: result });
  }

  const idImage = Untils.generateId(8);

  let errUpload, rsUpload;
  [errUpload, rsUpload] = await Untils.to(uploadFileImage(avatar, idImage));
  if (errUpload) {
    let result = _error(9998, errUpload);
    return callback(9998, { data: result });
  }

  const avatarImg = rsUpload;

  let dataUser = {
    name: name,
    age: age ? age : 0,
    gender: gender ? gender : 0,
    avatar: avatarImg,
    email: email,
    address: address,
    password: password,
    phone: phone,
    new: 0,
  };
  let result, err;
  [err, result] = await Untils.to(User.create(dataUser, { raw: true }));

  if (err) {
    let result = _error(400, err, err.message);
    return callback(400, { data: result });
  }

  const dataToken = {
    id: result.id,
    name: result.name,
    age: result.age,
    email: result.email,
    address: result.address,
    phone: result.phone,
    new: result.new,
  };

  const accessToken = jwt.sign(dataToken, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "10d",
  });

  result = _success(200);
  result.access_token = accessToken;
  return callback(null, result);
};

Service.signIn = async (params, callback) => {
  let { email, password } = params;
  if (!email || !password) {
    let result = _error(1000);
    return callback(1000, { data: result });
  }

  let checkUser = {
    where: {
      email: email,
    },
    raw: true,
  };

  let err, user;
  [err, user] = await Untils.to(User.findOne(checkUser));
  if (err) {
    let result = _error(3000, err);
    return callback(3000, { data: result });
  }
  if (!user) {
    let result = _error(3001);
    return callback(3001, { data: result });
  }

  if (user.status == 1) {
    let result = _error(3003);
    return callback(3003, { data: result });
  }
  if (user.status == 2) {
    let result = _error(3001);
    return callback(3001, { data: result });
  }
  const validPass = await bcrypt.compareSync(password, user.password);

  if (validPass) {
    const dataToken = {
      id: user.id,
      name: user.name,
      age: user.age,
      email: user.email,
      address: user.address,
      phone: user.phone,
      new: user.new,
    };
    const accessToken = jwt.sign(dataToken, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "10d",
    });
    result = _success(200);
    result.access_token = accessToken;
    return callback(null, result);
  } else {
    let result = _error(3005);
    return callback(3005, { data: result });
  }
};

Service.lock = async (params, callback) => {
  if (!params) {
    let result = _error(1000, err);
    return callback(1000, { data: result });
  }
  if (!params.user_id) {
    let result = _error(1000, err);
    return callback(1000, { data: result });
  }

  let err, checkExist;
  [err, checkExist] = await Untils.to(
    User.findOne({
      where: {
        id: params.user_id,
      },
    })
  );
  if (err) {
    let result = _error(3004, err);
    return callback(3004, { data: result });
  }
  if (!checkExist) {
    let result = _error(3004, err);
    return callback(3004, { data: result });
  }

  let dataUpdate = {
    status: 1,
  };

  let errLock, rsLock;
  [errLock, rsLock] = await Untils.to(
    User.update(dataUpdate, {
      where: { id: params.user_id },
    })
  );

  let result = _success(200);
  return callback(null, result);
};

Service.delete = async (params, callback) => {
  if (!params) {
    let result = _error(1000, err);
    return callback(1000, { data: result });
  }
  if (!params.user_id) {
    let result = _error(1000, err);
    return callback(1000, { data: result });
  }

  let err, checkExist;
  [err, checkExist] = await Untils.to(
    User.findOne({
      where: { id: params.user_id },
    })
  );
  if (err) {
    let result = _error(3004, err);
    return callback(3004, { data: result });
  }
  if (!checkExist) {
    let result = _error(3004, err);
    return callback(3004, { data: result });
  }

  let dataUpdate = {
    status: 2,
  };

  let errLock, rsLock;
  [errLock, rsLock] = await Untils.to(
    User.update(dataUpdate, {
      where: { id: params.user_id },
    })
  );

  // //unactive card
  // let whereCard = {
  //     where: {
  //         user_id: params.user_id,
  //         status: 0
  //     }
  // }
  // let dataCard = {
  //     status: 1
  // }
  // let errCard, rsCard;
  // [errCard, rsCard] = await Untils.to(Card.update(dataCard, whereCard));
  // if(errCard) {
  //     console.log('update card error');
  // }

  let result = _success(200);
  return callback(null, result);
};

Service.getUserByID = async (params, callback) => {
  if (!params) {
    let result = _error(1000);
    return callback(1000, { data: result });
  }

  let errUser, rsUser;
  [errUser, rsUser] = await Untils.to(
    User.findOne({
      where: { id: params.user_id },
      attributes: { exclude: ["password"] },
      raw: true,
    })
  );
  if (errUser) {
    let result = _error(3004, errUser);
    return callback(3004, { data: result });
  }
  if (!rsUser) {
    let result = _error(3004);
    return callback(3004, { data: result });
  }

  let result = _success(200);
  result.user = rsUser;
  return callback(null, result);
};

Service.getUsers = async (params, callback) => {
  if (!params) {
    let result = _error(1000);
    return callback(1000, { data: result });
  }

  let { status } = params;

  let errUser, rsUsers;
  [errUser, rsUsers] = await Untils.to(
    User.findAll({
      where: {
        status: status ? status : 0,
      },
      attributes: { exclude: ["password"] },
      raw: true,
    })
  );
  if (errUser) {
    let result = _error(404, errUser);
    return callback(404, { data: result });
  }
  if (!rsUsers) {
    let result = _error(404);
    return callback(404, { data: result });
  }
  let result = _success(200);
  result.users = rsUsers;
  return callback(null, result);
};

module.exports = Service;
