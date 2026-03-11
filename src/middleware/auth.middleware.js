const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../models/blacklist.model");

/** 
 * @name authUser
 * @desc Middleware to authenticate user using JWT token
 * @access Private
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} - Returns user details if token is valid, otherwise returns error message
*/
const authUser = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: "Token blacklisted. Please login again",
        });
    }

    const isTokenBlaklisted = await tokenBlacklistModel.findOne({ token });

    if (isTokenBlaklisted) {
        return res.status(401).json({
            message: "Token is invalid. Please try again",
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next()
    } catch (error) {
        return res.status(401).json({
            message: "Invalid token"
        });
    }
}

module.exports = { authUser }