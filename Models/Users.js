const mongoose = require("mongoose");
const Roles = require('./Roles')
const Subscription = require('./Subscription')


const UserSchema = new mongoose.Schema(
    {   
        roleId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Roles"
        },
        userName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        subscriptionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subscription",
            required: false
        },
        token :{
            type: String
        },
        isVerified: {
            type: Boolean,
            required: true,
            default: false
        },
        isActive: {
            type: Boolean,
            default: true
        },
        banned: {
            type: Boolean,
            default: false
        },
        balance: {
            type: Number,
            default: 0
        },
    },
    {
        timestamps: true
    }
)
const User = mongoose.model('User', UserSchema)
module.exports = User;