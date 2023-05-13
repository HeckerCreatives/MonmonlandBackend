const mongoose = require("mongoose");
const Roles = require('./Roles')
const Subscription = require('./Subscription')


const UserSchema = mongoose.Schema(
    {   
        roleId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: Roles
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
            ref: Subscription,
            required: false
        },
        isVerified: {
            type: Boolean,
            required: true,
            default: false
        }
    }
)

module.exports = mongoose.model('User', UserSchema)