const TwilioService = require('../services/twilio.services'); // Twilio service for sending OTP
const i18n = require('i18n');
const __ = require("i18n").__;
const bcrypt = require("bcrypt");
const User = require('../models/user.model');
const { createJwtToken } = require('../util/auth.util');

/**
 * AuthService handles all user-related authentication services.
 */
class AuthService {
    /**
     * Onboards a user by validating input, sending OTP, and storing user data.
     * @param {Object} userData - User details including first_name, last_name, email, phone_no, and date_of_birth.
     * @returns {Promise<Object>} - Returns success message and user ID.
     * @throws {Error} - Throws error if onboarding fails.
     */
    static async createUser(userData) {
        const { first_name, last_name, email, phone_no, date_of_birth, password } = userData;

        // Generate a random 6-digit OTP
        const {otp,otpExpiry} = await TwilioService.generateOtp(3);

        try {
            // Check if email or phone number already exists
            const existingUser = await User.findOne({
                $or: [{ email }, { phone_no }]
            });

            if (existingUser) {
                if (existingUser.email === email && existingUser.phone_no === phone_no) {
                    throw new Error(i18n.__('message')); // Both email and phone exist
                } else if (existingUser.email === email) {
                    throw new Error(i18n.__('user_email_exists')); // Only email exists
                } else if (existingUser.phone_no === phone_no) {
                    throw new Error(i18n.__('user_phone_exists')); // Only phone exists
                }
            }

            // Send OTP via Twilio
            await TwilioService.sendOtp(phone_no, otp);
            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);
            // Store user data and OTP in the database
            const user = await User.findOneAndUpdate(
                { phone_no },
                {
                    first_name,
                    last_name,
                    email,
                    date_of_birth,
                    otp,
                    otp_expiry: otpExpiry,
                    is_verified: false,
                    password:hashedPassword
                },
                { upsert: true, new: true }
            );

            return {
                message: i18n.__('auth.otp_send'),
                user: user._id
            };
        } catch (err) {
            console.error('Error onboarding user:', err.message);
            throw new Error(err.message);
        }
    }
    /**
     * Verifies an OTP for a user.
     * @param {string} phone_no - User's phone number.
     * @param {string} otp - The OTP to verify.
     * @returns {Promise<Object>} - Returns success message upon successful verification.
     * @throws {Error} - Throws error if verification fails or OTP is invalid/expired.
     */
    static async verifyOtp(phone_no, otp) {
        try {
            // Find user by phone number
            const user = await User.findOne({ phone_no });
            if (!user) throw new Error(i18n.__('user_not_found'));

            if (user.is_verified) {
                const error = new Error(i18n.__('messages.user_already_verified'));
                error.statusCode = 409; // Conflict
                throw error;
            }
            

            // Validate OTP
            if (user.otp !== otp) throw new Error(i18n.__('invalid_otp'));

            // Check OTP expiration (3-minute window)
            const currentTime = new Date();
            const otpExpiryTime = new Date(user.otp_expiry);

            if (currentTime > otpExpiryTime) {
                throw new Error(i18n.__('otp_expired'));
            }

            // Mark the user as verified
            user.is_verified = true;
            user.otp = null;
            user.otp_expiry = null;
            await user.save();

            return { message: i18n.__('otp_verification_success') };
        } catch (err) {
            console.error('Error onboarding user:', err.message);
            if (!err.statusCode) {
                err.statusCode = 400;
            }
            throw err;
        }
    }


    /**
 * Handles the login process, including validation and token generation.
 * @param {Object} credentials - User credentials (email and password).
 * @returns {Promise<string>} - Returns a JWT token if login is successful.
 * @throws {Error} - Throws an error if any step fails.
 */
    static async login({ email, password }) {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) throw new Error(i18n.__('messages.user_not_found'));

        // Check if user is verified
        if (!user.is_verified) throw new Error(i18n.__('messages.user_not_verified'));
        // Validate user credentials
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) throw new Error(i18n.__('messages.invalid_password'));
        return createJwtToken({ userId: user._id, email: user.email }, '1h');
    }

}

module.exports = AuthService;
