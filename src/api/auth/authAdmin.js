const jwt = require("jsonwebtoken")
const Untils = require("../modules/Untils")
const User = require("../../models/Users")

let authenticateAdminToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
        if (err) return res.sendStatus(403);
        let errAdmin, checkAdmin;
        [errAdmin, checkAdmin] = await Untils.to(User.findOne({ where: { id: user.id, role: 1 } }))
        if (!checkAdmin) {
            return res.sendStatus(401);
        }
        req.user = user;
        next()
    })
}

module.exports = {
    authenticateAdminToken
}