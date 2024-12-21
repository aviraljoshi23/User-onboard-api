const twilio = require('twilio');

/**
 * TwilioService handles communication with Twilio for sending messages.
 */
class TwilioService {
    constructor() {
        this.client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        this.sender = process.env.TWILIO_CONTACT; // Your Twilio phone number
    }

    /**
     * Sends an OTP message to the specified phone number.
     * @param {string} phoneNumber - The recipient's phone number (E.164 format).
     * @param {string} otp - The OTP to send.
     * @returns {Promise<Object>} - Resolves with Twilio's message response.
     * @throws {Error} - Throws an error if the message fails to send.
     */
    async sendOtp(phoneNumber, otp) {
        console.log(phoneNumber);
        console.log(this.sender);
        try {
            const message = await this.client.messages.create({
                body: `Your OTP is ${otp}. It is valid for 3 minutes.`,
                from: this.sender,
                to: `+91${phoneNumber}`
            });
            return message; // Message details from Twilio
        } catch (error) {
            console.log(error);
            console.error('Error sending OTP via Twilio:', error.message);
            throw new Error('Failed to send OTP');
        }
    }

            /**
         * Generates a 6-digit OTP and its expiry time.
         * @param {number} expiryInMinutes - The expiration time in minutes (default: 3).
         * @returns {Object} - An object containing the OTP and expiry time.
         */
        async generateOtp(expiryInMinutes = 3) {
            const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Random 6-digit OTP
            const otpExpiry = new Date(Date.now() + expiryInMinutes * 60 * 1000); // Expiry time in milliseconds
            return { otp, otpExpiry };
        }
}

module.exports = new TwilioService();
