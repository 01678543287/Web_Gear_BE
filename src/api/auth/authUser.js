const jwt = require("jsonwebtoken");

let authenticateToken = (req, res, next) => {
  // console.log(req.headers["authorization"], "headers");
  
  const authHeader = req.headers["authorization"]
    ? req.headers["authorization"]
    : req.headers["access_token"]
    ? req.headers["access_token"]
    // : req.cookies.access_token
    // ? req.cookies.access_token
    : req.body.access_token;
  if (!authHeader) return res.sendStatus(401);
  let token;
  if (!authHeader && authHeader.split(" ")[0] === "Bearer") {
    token = authHeader && authHeader.split(" ")[1];
  } else {
    token = authHeader;
  }
  // console.log(token, "token");

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

let verifyTokenUser = (token) => {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    return user;
  });
};

module.exports = {
  authenticateToken,
  verifyTokenUser,
};
