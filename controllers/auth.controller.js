const sendResponse = require("../middleware/setResponse");
const __ = require("i18n").__;
const AuthService = require('../services/auth.services');



/**
 * Controller to onboard a user by sending OTP and saving user data.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.createUser = async (req, res) => {
  try {
    const response = await AuthService.createUser(req.body);
    res.status(200).send(sendResponse(__(`${response.message}`, response.data)));
  } catch (error) {
    res.status(400).send(sendResponse(__(error.message)));
  }
};



/**
 * Controller to log in a user using email and password.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.login = async (req, res) => {
  try {
    const token = await AuthService.login(req.body);
    // Respond with success and token
    res.status(200).send(sendResponse(__('messages.login_success'), { token }));
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(400).send(sendResponse(__(error.message)));
  }
};

/**
 * Controller to verify a user's OTP.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.verifyOtp = async (req, res) => {
  const { phone_no, otp } = req.body;

  try {
    // Call the AuthService to verify OTP
    const response = await AuthService.verifyOtp(phone_no, otp);

    // Respond with success
    res.status(200).send(sendResponse(__('messages.otp_verified_successfully'), response));
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(error.statusCode||400).send(sendResponse(__(error.message)));
  }
};