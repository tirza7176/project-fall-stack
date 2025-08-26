const express = require("express");
const router = express.Router();
const authmw = require("../middleware/auth")
const _ = require("lodash");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const { orderValidation, Order } = require("../model/order")


router.put("/", authmw, async (req, res) => { })

router.get("/me", authmw, async (req, res) => {

    if (!req.user) {
        return res.status(403).send("Not authorized");
    }

    try {
        const myOrders = await Order.find({ customer: req.user._id })
            .populate("customer", "name email")
            .populate("products.product", "name price");

        if (!myOrders || myOrders.length === 0) {
            return res.status(404).send("No orders found for this user");
        }

        res.json(myOrders);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Something went wrong...");
    }
})

router.get("/user/:userId", authmw, async (req, res) => {
    if (!req.user.isAdmin) {
        return res.status(403).send("Access denied. Admins only.");
    }
    try {
        const orders = await Order.find({ customer: req.params.userId })
            .populate("customer", "name email")
            .populate("products.product", "name price");

        if (!orders || orders.length === 0) {
            return res.status(404).send("No orders found for this user");
        }

        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).send("Something went wrong...");
    }
})
router.get("/:orderId", authmw, async (req, res) => {
    if (!req.user.isAdmin) {
        return res.status(403).send("Access denied. Admins only.");
    }
    try {
        const order = await Order.findById(req.params.orderId)
            .populate("customer", "name email")
            .populate("products.product", "name price");

        if (!order) {
            return res.status(404).send("Order not found");
        }

        res.json(order);
    } catch (err) {
        console.error(err);
        res.status(500).send("Something went wrong...");
    }
})

router.get("/", authmw, async (req, res) => {
    if (!req.user.isAdmin) {
        res.status(403).send("Access denied.Admins only.");
        return
    }
    try {
        const orders = await Order.find({})
            .populate("customer", "name email")
            .populate("products.product", "name price")
        if (orders.length === 0) {
            return res.status(404).send("No orders found");
        }
        res.json(orders)
    } catch (err) {
        console.error(err);
        res.status(500).send("Something went wrong...");
    }
})
router.put("/:id", authmw, async (req, res) => {
    const { error, value } = orderValidation.validate(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).send("No order found");
        }

        const isAdmin = req.user.isAdmin;
        const isOwner = order.customer.toString() === req.user._id.toString();

        if (!isAdmin && !isOwner) {
            return res.status(403).send("Not authorized");
        }

        if (isOwner && !isAdmin && order.status !== "pending") {
            return res.status(400).send("You can only cancel pending orders");
        }
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { $set: value },
            { new: true }
        );

        res.json({ message: "Order updated successfully", order: updatedOrder })
    } catch (err) {
        console.error(err);
        res.status(500).send("Something went wrong...");
    }
})
router.delete("/:id", authmw, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).send("No order found");
        }

        const isAdmin = req.user.isAdmin;
        const isOwner = order.customer.toString() === req.user._id.toString();

        if (!isAdmin && !isOwner) {
            return res.status(403).send("Not authorized");
        }

        if (isOwner && !isAdmin && order.status !== "pending") {
            return res.status(400).send("You can only cancel pending orders");
        }
        await order.deleteOne();

        return res.json({ message: "Order deleted successfully", order });
    } catch (err) {
        console.error(err);
        res.status(500).send("Something went wrong...");
    }
});
router.post("/", authmw, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(403).send("Not authorized");
        }

        if (!req.user.isAdmin) {
            req.body.customer = req.user._id.toString();
        }
        const { error } = orderValidation.validate(req.body)
        if (error) {
            res.status(400).send(error.details[0].message);
            return;
        }
        let order = new Order(req.body)
        await order.save();
        order = await Order.findById(order._id)
            .populate("customer", "name email")
            .populate("products.product", "name price");
        res.json({ message: "order Created successfully", order })
    } catch (err) {
        console.error(err);
        res.status(500).send("Something went wrong...");
    }
})

module.exports = router