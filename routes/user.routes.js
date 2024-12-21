const express = require('express');
const authController = require('../controllers/auth.controller');
const validateRequest = require('../middleware/dataValidator');
const Validation = require('../validations/validationSchema');
const router = express.Router();




/**
 * @route POST /api/auth/login
 * @description Log in a user using email and password
 */
router.post('/login',validateRequest(Validation.loginJoiValidation), authController.login);

/**
 * @route POST /api/users/createUser
 * @description Create a user via OTP verification.
 */
router.post('/createUser',validateRequest(Validation.createUserJoiValidation),authController.createUser);


/**
 * @route POST /api/users/verify-otp
 * @description Verify a user's OTP
 */
router.post('/verify-otp',validateRequest(Validation.verifyOtpJoiValidation),authController.verifyOtp);


module.exports = router;
