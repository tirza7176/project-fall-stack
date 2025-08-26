const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const { signinValidation, User } = require("../model/user")
router.post("/", async (req, res) => {

    const { error } = signinValidation.validate(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    let user = await User.findOne({ email: req.body.email })
    if (!user) {
        res.status(400).send("invalid email");
        return
    }
    const isValidPassword = await bcrypt.compare(req.body.password, user.password);
    if (!isValidPassword) {
        res.status(400).send("invalid password");
        return
    }
    const token = jwt.sign({ _id: user._id, isAdmin: user.isAdmin }, process.env.JWT_KEY);
    //response
    res.send({ token })

})

module.exports = router