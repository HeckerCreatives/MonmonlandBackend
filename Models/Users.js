const mongoose = require("mongoose");
const Roles = require('./Roles')
const Subscription = require('./Subscription')
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
    {   
        roleId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Roles"
        },
        referrerId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
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
        phone: {
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
        playfabid :{
            type: String
        },
    },
    {
        timestamps: true
    }
);

UserSchema.query.byRefferal = function (referrerId) {
    return this.where({ referrerId });
};

UserSchema.pre("save", async function (next) {
    if (!this.isModified) {
      next();
    }
  
    this.password = await bcrypt.hashSync(this.password, 10)
});

UserSchema.methods.matchPassword = async function(password){
    return await bcrypt.compare(password, this.password)
}

const User = mongoose.model('User', UserSchema)
module.exports = User;