const userModel = require('../models/userModel');
const authServices = require('../services/authServices');
const response = require('../utils/response');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const authController = {};
const ACCESS_TOKEN = process.env.ACCESS_TOKEN_SECRET_KEY;
const ACCESS_TOKEN_KEY = process.env.ACCESS_TOKEN_KEY
const USER_ROLE = process.env.USER_ROLE
const CHUA_KICH_HOAT_TAI_KHOAN = process.env.CHUA_KICH_HOAT_TAI_KHOAN
authController.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await authServices.validateLoginForm(email, password);
        var token = jwt.sign({ id: user.id }, ACCESS_TOKEN);
        res.cookie(ACCESS_TOKEN_KEY, token, {
            maxAge: 24 * 60 * 60 * 1000
        })
        res.status(200).json(response.successResponse({ email: user.email }, "LOGGED IN SUCCESS"));
    } catch (err) {
        res.status(500).json(response.errorResponse(err.message));
    }
}

authController.register = async (req, res) => {
    try {
        const user = {
            email: req.body.email,
            password: req.body.password,
            rePassword: req.body.rePassword,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
        }
        await authServices.validateRegister(user);
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        user.password = hashedPassword;
        user.status = CHUA_KICH_HOAT_TAI_KHOAN;
        user.role = USER_ROLE;
        await userModel.createUser(user);
        const savedUser = await userModel.getUserByEmail(user.email);
        var token = jwt.sign({ id: savedUser.id }, ACCESS_TOKEN);
        res.cookie(ACCESS_TOKEN_KEY, token, {
            maxAge: 24 * 60 * 60 * 1000
        })
        res.status(200).json(response.successResponse({ email: savedUser.email, firstName: savedUser.firstName, lastName: savedUser.lastName, token: token }, "success"));
    } catch (err) {
        res.status(500).json(response.errorResponse(err.message));
    }
}

authController.logout = async (req, res) => {
    try {
        res.clearCookie(ACCESS_TOKEN_KEY);
        res.status(200).json(response.successResponse([], "LOGGED OUT"));
    } catch (err) {
        res.status(500).json(response.errorResponse(err.message));
    }
}

module.exports = authController;