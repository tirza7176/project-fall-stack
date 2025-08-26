const mongoose = require("mongoose");
const Joi = require("joi");

const _ = require("lodash");

const userSchema = new mongoose.Schema({
    name: {
        firstName: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 256,
        },
        lastName: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 256,
        }
    },
    email: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 256,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 1024,
    },
    phone: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 256,
    },
    city: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 256,
    },
    isAdmin: {
        type: Boolean,
        required: true,
    },

})

const User = mongoose.model("User", userSchema, "user");
const validation = {
    name: {
        firstName: Joi.string().min(2).max(2500).required(),
        lastName: Joi.string().min(2).max(2500).required(),
    },
    password: Joi.string().pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{7,}$/, { name: 'password' }).required(),
    email: Joi.string().min(2).max(256).required(),
    phone: Joi.string().min(2).max(256).required(),
    city: Joi.string().min(2).max(256).required(),
    isAdmin: Joi.boolean().default(false),
}
const userValidation = Joi.object(validation).required(); const putUserValidation = Joi.object(_.omit(validation, ["email", "password"])).required();
const signinValidation = Joi.object(_.pick(validation, ["email", "password"])).required();

module.exports = {
    User,
    userValidation,
    signinValidation,
    putUserValidation,
}