const Joi = require('joi');

const validationSchema = {

    /**
     * Validation schema for user registration (createUser).
     * Fields: first_name, last_name, email, phone_no, date_of_birth
     */
    createUserJoiValidation: Joi.object({
        first_name: Joi.string().required().label('First Name'),
        last_name: Joi.string().required().label('Last Name'),
        email: Joi.string().required().email().label('Email'),
        phone_no: Joi.string()
            .pattern(/^\d{10,15}$/)
            .required()
            .label('Phone Number'),
        date_of_birth: Joi.string().required().label('Date of Birth'),
        password: Joi.string().min(6).required().label('Password')

    }),

    /**
     * Validation schema for user login.
     * Fields: email, password
     */
    loginJoiValidation: Joi.object({
        email: Joi.string().email().required().label('Email'),
        password: Joi.string().min(6).required().label('Password')
    }),

    /**
     * Validation schema for verifying OTP for a phone number.
     * Fields: phone_no, otp
     */
    verifyOtpJoiValidation: Joi.object({
        phone_no: Joi.string()
            .pattern(/^\d{10,15}$/)
            .required()
            .label('Phone Number'),
        otp: Joi.string().length(6).required().label('OTP')
    }),

}


module.exports = validationSchema;