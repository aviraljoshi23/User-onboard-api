const i18n = require('i18n');
const jwt = require('jsonwebtoken');

/**
 * AuthUtil class provides utility methods for JWT handling.
 */
class AuthUtil {
    /**
     * Decodes and verifies a JWT token.
     * @param {string} token - The JWT token to decode and verify.
     * @returns {Promise<Object>} - Resolves with the decoded token data if valid.
     * @throws {Error} - Rejects with an error message if the token is invalid or expired.
     */
    static decodeJwtToken(token) {
        return new Promise((resolve, reject) => {
            try {
                // Verify and decode the JWT using the secret key
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                resolve(decoded);
            } catch (error) {
                // Handle specific JWT errors and reject with a localized message
                if (error instanceof jwt.JsonWebTokenError) {
                    reject(i18n.__('invalid_jwt_token')); // Invalid token
                } else {
                    reject(i18n.__('invalid_jwt_token')); // Generic error
                    console.error(error.message); // Log unexpected errors
                }
            }
        });
    }

    /**
     * Creates a JWT token with the provided data and expiration time.
     * @param {Object} data - The payload to include in the JWT.
     * @param {string|number} time - The expiration time for the token (e.g., "1h", "30m", or seconds).
     * @returns {string} - The generated JWT token.
     */
    static createJwtToken(data, time) {
        return jwt.sign(data, process.env.JWT_SECRET, {
            expiresIn: time // Sets the token's expiration
        });
    }
}

module.exports = AuthUtil;
