const express = require("express");
const { handleSignup, handleLogin } = require("../controller/auth/auth.controller");
const { signupValidator, loginValidator } = require("../validators/authValidator");
const validateRequest = require("../middleware/validateRequest");
const router = express.Router()

/** 
 * @route POST /api/auth/signup
 * @description Handle user signup
 * @access Public
 * @body { fullname, email, password }
 */
router.post("/signup",
    signupValidator,
    validateRequest,
    handleSignup
);


/**
 * @route POST /api/auth/signup
 * @description Handle user login
 * @access Public
 * @body {email, pasword}
 */
router.post("/login", loginValidator, validateRequest, handleLogin)
module.exports = router;