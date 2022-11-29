const jwt = require("jsonwebtoken");
const Untils = require("../modules/Utils");
const Shipper = require("../../models/Shipper");

let authenticateShipperToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]
    ? req.headers["authorization"]
    : req.headers["access_token"]
    ? req.headers["access_token"]
    : // : req.cookies.access_token
      // ? req.cookies.access_token
      req.body.access_token;
  console.log(authHeader, "authHeader");
  if (!authHeader) return res.sendStatus(401);
  let token;
  if (!authHeader && authHeader.split(" ")[0] === "Bearer") {
    token = authHeader && authHeader.split(" ")[1];
  } else {
    token = authHeader;
  }

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
    if (err) return res.sendStatus(403);
    let errAdmin, checkAdmin;
    [errAdmin, checkAdmin] = await Untils.to(
      Shipper.findOne({ where: { id: user.id } })
    );
    if (!checkAdmin) {
      return res.sendStatus(401);
    }
    req.user = user;
    next();
  });
};

module.exports = {
  authenticateShipperToken,
};
