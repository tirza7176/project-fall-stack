const mongoose = require("mongoose");
const Joi = require("joi");

const _ = require("lodash");
const { User } = require("./user");

const orderSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    place: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 256,

    },
    amount: {
        type: Number,
        required: true,
        min: 40,
    },
    products: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
            quantity: { type: Number, required: true, min: 1 },
        }
    ],
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "canceled", "expired"],
        default: "pending",
    },
    totalPrice: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });

orderSchema.pre("save", async function (next) {
    try {
        await this.populate("products.product");

        let total = 0;
        this.products.forEach(item => {
            total += item.product.price * item.quantity;
        });

        this.totalPrice = total;
        next();
    } catch (err) {
        next(err);
    }
});

orderSchema.pre("save", function (next) {
    const now = new Date();
    if (this.date < now && this.status === "pending") {
        this.status = "expired";
    }
    next();
});

const Order = mongoose.model("Order", orderSchema, "order")
const orderValidation = Joi.object({
    date: Joi.date().required(),
    place: Joi.string().min(2).max(256).required(),
    amount: Joi.number().min(40).required(),
    products: Joi.array().items(Joi.object({
        product: Joi.string().required(),
        quantity: Joi.number().min(1).required(),
    })).required(),
    customer: Joi.string().required(),
    status: Joi.string().valid("pending", "confirmed", "canceled"),
    totalPrice: Joi.number(),
})
module.exports = {
    Order,
    orderValidation,
}
