const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        first_name: {
            type: String,
            required: true
        },
        last_name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        phone_no: {
            type: String,
            required: true,
            unique: true
        },
        password:{
            type:String,
            required:true,
        },
        date_of_birth: {
            type: Date,
            required: true
        },
        otp: {
            type: String,
            default: null
        },
        otp_expiry: {
            type: Date,
            default: null
        },
        is_verified: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);
const User = mongoose.model('User', UserSchema);

module.exports = User;
