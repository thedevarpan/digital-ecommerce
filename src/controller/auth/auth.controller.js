const userModel = require("../../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const logger = require("../../utils/logger");
const blacklistModel = require("../../models/blacklist.model");

/**
 * @name handleSignup
 * @route POST /api/auth/signup
 * @description Handle user signup
 * @access Public
 * @body { fullname, email, password }
 * @return { success, message, user }
 */
const handleSignup = async (req, res) => {
    try {
        const { fullname, email, password, confirmPassword } = req.body;

        /* Check email already exists or not */
        const findUser = await userModel.findOne({ email });

        if (findUser) {
            return res.status(400).json({
                success: false,
                message: "Email already used",
            });
        }

        /* Check if passwords match */
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match",
            });
        }

        /* Hash password*/
        const hashedPassword = await bcrypt.hash(password, 10);

        /* Create the user */
        const createdUser = await userModel.create({
            fullname, email, password: hashedPassword
        });

        const token = jwt.sign({ id: findUser._id, role: findUser.role },
            process.env.JWT_SECRET, { expiresIn: "7d" });

        res.cookie("token", token);

        return res.status(201).json({
            success: true,
            message: "User Signup successfully",
            user: {
                id: createdUser._id,
                fullname: createdUser.fullname,
                email: createdUser.email,
            }
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}


/**
 * @name handleLogin
 * @route POST /api/auth/login
 * @descriptiom Handle user login
 * @access Public
 * @body { email, password }
 * @returns {object}
 */
const handleLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        /* Find user using entered email address */
        const findUser = await userModel.findOne({ email });

        if (!findUser) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            })
        }

        /* Compare the password */
        const isMatch = await bcrypt.compare(password, findUser.password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        /* Create a token */
        const token = jwt.sign({ id: findUser._id, role: findUser.role },
            process.env.JWT_SECRET, { expiresIn: "7d" });

        /* Set the cookie */
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV == "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        /* Update last login information */
        findUser.lastLogin = new Date();
        await findUser.save();

        /* Send the response */
        return res.status(200).json({
            success: true,
            message: "Login successfull",
            user: {
                id: findUser._id,
                fullname: findUser.fullname,
                email: findUser.email,
                role: findUser.role
            }
        });

    } catch (error) {
        logger.error("Login failed", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}


/**
 * @name handleLogout 
 * @route GET /api/auth/login
 * @description 
 * @access Public
*/
const handleLogout = async (req, res) => {
    const token = req.cookies.token;

    if (token) {
        await blacklistModel.create({ token });
    }

    res.clearCookie("token");
    return res.status(200).json({
        message: "User loggd out successfully",
    });
}

module.exports = { handleSignup, handleLogin, handleLogout }