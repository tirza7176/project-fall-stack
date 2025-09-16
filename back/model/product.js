const mongoose = require("mongoose");
const Joi = require("joi");

const _ = require("lodash");

const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 256,
    },
    description: {
        type: String,

        maxlength: 2500,
        default: "",
    },
    image: {
        type: String,

        minlength: 2,
        maxlength: 1024,
        default: "https://www.boker.co.il/userfiles/web_pages/picture_41.webp",
    },
    price: {
        type: Number,
        min: 0,
        default: 0,
    },
    pricingType: {
        type: String,
        enum: ["basic", "perPerson", "perItem"],
        required: true,
    },
    menuType: {
        type: String,
        enum: ["seating", "buffet"],
        required: true
    },
    foodType: {
        type: String,
        enum: ["meat", "dairy", "pareve"],
        required: true,
    },
    isUpgrade: {
        type: Boolean,
        default: false,
    },
    category: {
        type: String,
        required: true,
    },
    Likes: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        default: [],

    },
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema, "product");
const productValidation = Joi.object({
    name: Joi.string().min(2).max(256),
    description: Joi.string().allow("").max(2500),
    image: Joi.string().uri().min(2).max(2500).allow(""),
    price: Joi.number().min(0),
    pricingType: Joi.string().valid("basic", "perPerson", "perItem").required(),
    menuType: Joi.string().valid("seating", "buffet").required(),
    foodType: Joi.string().valid("meat", "dairy", "pareve").required(),
    isUpgrade: Joi.boolean(),
    category: Joi.string().required(),

})


module.exports = {
    productValidation,
    Product,
}