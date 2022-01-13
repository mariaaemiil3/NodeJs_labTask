const Joi = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength:6,
        maxlength:20
    },
    email: {
        type:String,
        match: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
        
        unique: true
    },
    password: {
        type: String,
        minlength: 8,
        maxlength: 120,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
})

const joiSchema = Joi.object({
    name: Joi.string().min(3).max(20).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(16).required(),
    age: Joi.number().required(),
    isAdmin: Joi.boolean()
})

const validateUser = (user) => {
    return joiSchema.validate(user);
}

const validateLoggingUser = (user) => {
    const schema =  Joi.object({
        email: Joi.string().email().required(),
    password: Joi.string().min(8).max(16).required()
    })
    return schema.validate(user);
}

const User = mongoose.model("user",userSchema);

module.exports = {User,validateUser,validateLoggingUser};