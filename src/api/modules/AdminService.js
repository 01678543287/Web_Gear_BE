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
const Admin = require("../../models/Admin");

const Untils = require("../modules/Untils");
const _error = Untils._error;
const _success = Untils._success;
const MESSAGESCONFIG = require("../Messages");
const { sequelize } = require("../../config/connectDB");
const { now } = require("moment");
const MESSAGES = MESSAGESCONFIG.messages;

let Service = {};

Service.createAdmin = async (params, callback) => {
  let {
    name,
    email,
    phone,
    address,
    password,
    avatar,
    gender,
    birthday,
    cccd,
    home_town,
  } = params;

  // console.log(params, "pr=0==0=0");
  // return;
  if (!email || !password) {
    let result = _error(1000);
    return callback(1000, { data: result });
  }

  // const idImage = Untils.generateId(8);

  // let errUpload, rsUpload;
  // [errUpload, rsUpload] = await Untils.to(uploadFileImage(avatar, idImage));
  // if (errUpload) {
  //   let result = _error(9998, errUpload);
  //   return callback(9998, { data: result });
  // }

  const avatarImg = null;
  // const avatarImg = rsUpload;

  let dataUser = {
    name: name,
    birthday: birthday ? birthday : 0,
    gender: gender ? gender : 0,
    avatar: avatarImg ? avatarImg : "",
    email: email,
    address: address,
    password: password,
    phone: phone,
    cccd: cccd,
    home_town: home_town,
  };

  let result, err;
  [err, result] = await Untils.to(Admin.create(dataUser, { raw: true }));

  if (err) {
    result = _error(3002, err);
    return callback(3002, { data: result });
  }

  const dataToken = {
    id: result.id,
    name: result.name,
    age: result.age,
    email: result.email,
    address: result.address,
    phone: result.phone,
    role: "ADMIN",
  };

  const accessToken = jwt.sign(dataToken, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "10d",
  });

  result = _success(200);
  result.access_token = accessToken;
  return callback(null, result);
};

Service.editAdmin = async (params, callback) => {
  let {
    user_id,
    name,
    email,
    phone,
    address,
    password,
    avatar,
    gender,
    birthday,
    cccd,
    status,
    home_town,
  } = params;

  console.log(params, "pr=0==0=0");
  // return;
  if (!user_id) {
    let result = _error(1000);
    return callback(1000, { data: result });
  }

  // const idImage = Untils.generateId(8);

  // let errUpload, rsUpload;
  // [errUpload, rsUpload] = await Untils.to(uploadFileImage(avatar, idImage));
  // if (errUpload) {
  //   let result = _error(9998, errUpload);
  //   return callback(9998, { data: result });
  // }

  const avatarImg = null;
  // const avatarImg = rsUpload;

  let dataUser = {
    name: name,
    birthday: birthday ? birthday : 0,
    gender: gender ? parseInt(gender) : 0,
    avatar: avatarImg ? avatarImg : "",
    email: email,
    address: address,
    password: password,
    phone: phone,
    cccd: cccd,
    home_town: home_town,
    status: status,
  };

  let result, err;
  [err, result] = await Untils.to(
    Admin.update(
      dataUser,
      {
        where: {
          id: user_id,
        },
      },
      { raw: true }
    )
  );

  if (err) {
    result = _error(3002, err);
    return callback(3002, { data: result });
  }

  const dataToken = {
    id: result.id,
    name: result.name,
    age: result.age,
    email: result.email,
    address: result.address,
    phone: result.phone,
    role: "ADMIN",
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
  [err, user] = await Untils.to(Admin.findOne(checkUser));
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
      email: user.email,
      address: user.address,
      phone: user.phone,
      role: "ADMIN",
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
    Admin.findOne({
      where: {
        id: params.user_id,
      },
      raw: true,
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
    status: checkExist.status === 0 ? 1 : 0,
  };

  let errLock, rsLock;
  [errLock, rsLock] = await Untils.to(
    Admin.update(dataUpdate, {
      where: { id: params.user_id },
    })
  );

  let result = _success(200);
  return callback(null, result);
};

// Service.delete = async (params, callback) => {
//   if (!params) {
//     let result = _error(1000, err);
//     return callback(1000, { data: result });
//   }
//   if (!params.user_id) {
//     let result = _error(1000, err);
//     return callback(1000, { data: result });
//   }

//   let err, checkExist;
//   [err, checkExist] = await Untils.to(
//     User.findOne({
//       where: { id: params.user_id, role: 0 },
//     })
//   );
//   if (err) {
//     let result = _error(3004, err);
//     return callback(3004, { data: result });
//   }
//   if (!checkExist) {
//     let result = _error(3004, err);
//     return callback(3004, { data: result });
//   }

//   let dataUpdate = {
//     status: 2,
//   };

//   let errLock, rsLock;
//   [errLock, rsLock] = await Untils.to(
//     User.update(dataUpdate, {
//       where: { id: params.user_id },
//     })
//   );

//   let result = _success(200);
//   return callback(null, result);
// };

Service.getUserByID = async (params, callback) => {
  if (!params) {
    let result = _error(1000);
    return callback(1000, { data: result });
  }

  let errUser, rsUser;
  [errUser, rsUser] = await Untils.to(
    Admin.findOne({
      where: { id: params.accId },
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

Service.getUsersAdmin = async (params, callback) => {
  if (!params) {
    let result = _error(1000);
    return callback(1000, { data: result });
  }

  let { status } = params;

  let errUser, rsUsers;
  [errUser, rsUsers] = await Untils.to(
    Admin.findAll({
      // where: {
      //   status: status ? status : 0,
      // },
      order: [["email", "ASC"]],
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
