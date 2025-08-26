const express = require("express");
const router = express.Router();
const authmw = require("../middleware/auth")
const _ = require("lodash");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const { productValidation, Product } = require("../model/product")

router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).send("no product found")
        }
        res.send(_.omit(product.toObject(), ["_id", "createdAt", "updatedAt"]))
    } catch (err) {
        console.error(err);
        res.status(500).send("Something went wrong...");
    }
})

router.get("/", async (req, res) => {
    try {
        const products = await Product.find({});
        if (products.length === 0) {
            return res.status(404).send("No products found");
        }
        res.json(products)
    } catch (err) {
        console.error(err);
        res.status(500).send("Something went wrong...");
    }
})

router.put("/:id", authmw, async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            res.status(403).send("Access denied.Admins only.");
            return
        }
        const { error, value } = productValidation.validate(req.body);
        if (error) {
            res.status(400).send(error.details[0].message);
            return;
        }
        const product = await Product.findByIdAndUpdate(req.params.id, value, { new: true })
        if (!product) {
            return res.status(404).send("No product found");
        }
        res.json({ message: "Product updated successfully", product })
    }
    catch (err) {
        console.error(err);
        res.status(500).send("server error...");
    }

})
router.patch("/:id", authmw, async (req, res) => {
    try {
        const userId = req.user._id;


        const updatedProduct = await Product.findByIdAndUpdate(req.params.id,
            [
                {
                    $set: {
                        Likes: {
                            $cond: [
                                { $in: [userId, "$Likes"] },

                                { $setDifference: ["$Likes", [userId]] },
                                { $concatArrays: ["$Likes", [userId]] }]
                        }
                    }
                }
            ], { new: true })
        if (!updatedProduct) {
            return res.status(404).send("No product found");
        }
        res.send(updatedProduct)
    } catch (err) {
        console.error(err);
        res.status(500).send("server error...");
    }
})
router.delete("/:id", authmw, async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            res.status(403).send("Access denied.Admins only.");
            return
        }
        const product = await Product.findByIdAndDelete(req.params.id)
        if (!product) {
            return res.status(404).send("No product found");
        }
        res.json({ message: "Product deleted successfully", product })

    } catch (err) {
        console.error(err);
        res.status(500).send("server error...");
    }
})

router.post("/", authmw, async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            res.status(403).send("Access denied.Admins only.");
            return
        }
        const { error } = productValidation.validate(req.body);
        if (error) {
            res.status(400).send(error.details[0].message);
            return;
        }
        const product = new Product(req.body);

        await product.save()

        res.json({ message: "Product added successfully", product })
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Something went wrong...");
    }
}
)

module.exports = router;