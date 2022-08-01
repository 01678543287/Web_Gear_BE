const jwt = require("jsonwebtoken");

let authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]
    ? req.headers["authorization"]
    : req.headers["access_token"]
    ? req.headers["access_token"]
    : req.cookies.access_token;
  if (!authHeader) return res.sendStatus(401);
  let token;
  if (!authHeader && authHeader.split(" ")[0] === "Bearer") {
    token = authHeader && authHeader.split(" ")[1];
  } else {
    token = authHeader;
  }

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
      console.log(`Verify token error: ${err}`);
    }
    return user;
  });
};

module.exports = {
  authenticateToken,
  verifyTokenUser,
};
