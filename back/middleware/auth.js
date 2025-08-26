const jwt = require("jsonwebtoken");
const { User } = require("../model/user")

module.exports = async (req, res, next) => {
    const token = req.headers["x-auth-token"];
    if (!token) {
        res.status(401).send("Unauthorized")
        return
    }
    try {
        const payload = jwt.verify(token, process.env.JWT_KEY);
        req.user = await User.findById(payload._id)


        if (!req.user) {
            res.status(400).send("user not found")
            return
        }

        next();
    }
    catch {
        res.status(404).send("invalid token")
    }
}
