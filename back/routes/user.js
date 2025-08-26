const _ = require("lodash");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const authmw = require("../middleware/auth")
const { User, userValidation, putUserValidation } = require("../model/user");

router.get("/", authmw, async (req, res) => {
    if (!req.user.isAdmin) {
        res.status(403).send("Forbidden")
    }
    try {
        const users = await User.find({}, { password: 0 })
        if (!users) {
            res.status(404).send("users not found");
            return
        }
        res.json(users)
    } catch (error) {
        console.log(error);
        res.status(500).send("Server error");
    }
})
router.get("/:id", authmw, async (req, res) => {
    const isOwner = req.user._id.toString() === req.params.id
    const isAdmin = req.user.isAdmin
    if (!isOwner && !isAdmin) {
        return res.status(403).send("Forbidden")
    }
    try {
        const user = await User.findById(req.params.id)
        if (!user) {
            res.status(404).send("users not found");
            return
        }
        res.send(_.omit(user.toObject(), ["password"]))
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Server error")
    }
})
router.delete("/:id", authmw, async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            res.status(403).send("Access denied.Admins only.");
            return
        }
        const deleteUser = await User.findByIdAndDelete(req.params.id)
        if (!deleteUser) {
            return res.status(404).send("No user found");
        }
        res.json({ message: "user deleted successfully", deleteUser })

    } catch (err) {
        console.error(err);
        res.status(500).send("server error...");
    }
})
router.put("/:id", authmw, async (req, res) => {
    const isOwner = req.user._id == req.params.id;
    const isAdmin = req.user.isAdmin;
    if (!isOwner && !isAdmin) {
        res.status(400).send("it is not Authorization")
        return
    }
    const { error, value } = putUserValidation.validate(req.body, { stripUnknown: true });
    if (error) {
        res.status(400).send(error.details[0].message);
        return
    }

    const editUser = await User.findByIdAndUpdate(req.params.id, value, {
        returnDocument: 'after'
    });
    if (!editUser) {
        res.status(400).send("user not found");
        return
    }
    res.send(_.pick(editUser, ["_id", "name", "email",
        "phone",
        "city"
    ]));
})


router.post("/", async (req, res) => {
    try {
        const { error } = userValidation.validate(req.body);
        if (error) {
            res.status(400).send(error.details[0].message);
            return;
        }

        let user = await User.findOne({ email: req.body.email });
        if (user) {
            res.status(400).send("user already exits");
            return
        }

        user = await new User({ ...req.body, password: await bcrypt.hash(req.body.password, 14) }).save();

        res.send(_.pick(user, ["_id", "name", "email", "phone", "city", "isAdmin"]));
    } catch (err) {
        console.error(err)
    }
})

module.exports = router
