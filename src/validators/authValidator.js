const { body } = require("express-validator");

/**
 * @name signupValidator
 * @description Validates the request body for user signup
 * Ensure all required fields are present and valid
 * @route POST /api/auth/signup
 * @access Public
 * 
 * @body {string} fullname - User's fullanme [3-60 characters]
 * @body {string} email - User's email address [valid email format, max 100 characters]
 * @body {string} password - User's password [6-32 characters]
 * @body {string} confirmPassword - Confirmation of the user's password [must match password]
 */
const signupValidator = [
    body("fullname")
        .notEmpty().withMessage("fullname is required")
        .isLength({ min: 3, max: 60 }).withMessage("Fullname must be between 3 & 60 chacreter")
        .trim(),


    body("email")
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email address")
        .isLength({ max: 100 }).withMessage("Invalid email address")
        .normalizeEmail(),


    body("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 6, max: 32 }).withMessage("Password must be between 6 and 32 characters"),

    body("confirmPassword")
        .notEmpty().withMessage("Confirm password is required")
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Passwords do not match");
            }
            return true;
        })

]


/**
 * @name loginValidator
 * @description validates the request body for user login
 * Ensure all fields are present and valid 
 * @route POST /api/auth/login
 * @access Public
 * 
 * @body {string} email - User's valid email
 * @body {string} password - User's password [6-32 characters]
*/
const loginValidator = [
    body("email")
        .notEmpty().withMessage("Email is required")
        .bail()
        .isEmail().withMessage("Invalid email address"),

    body("password")
        .notEmpty().withMessage("Password is required")
        .bail()
        .isLength({ min: 6, max: 32 }).withMessage("Password must be between 6 and 32 characters"),
]


module.exports = { signupValidator, loginValidator };