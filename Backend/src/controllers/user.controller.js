const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/user.models.js');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

const cookieOptions = {
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production', // Use SSL in production
    // sameSite: 'strict', // CSRF protection
    // maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
};

const registerUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, username, email, password } = req.body;

    if (!firstName || !lastName || !username || !email || !password) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        firstName,
        lastName,
        username,
        email,
        password: hashedPassword,
    });

    if (user) {
        const token = generateToken(user._id);

        return res.status(201)
           .cookie('token', token, cookieOptions)
           .json({
               _id: user.id,
               username: user.username,
               email: user.email,
               message: "Registered successfully",
               token : token
           });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

const loginUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
        const token = generateToken(user._id);

        return res.status(200)
           .cookie('token', token, cookieOptions)
           .json({
               _id: user.id,
               username: user.username,
               email: user.email,
               message: "Logged in successfully"
           });
    } else {
        res.status(400);
        throw new Error('Invalid credentials');
    }
});

const logOut = asyncHandler(async(req, res) => {
    res.status(200)
       .clearCookie("token", cookieOptions) 
       .json({ message: "Logged out successfully" });
});

const getMe = asyncHandler(async (req, res) => {
    res.status(200).json(req.user);
});

module.exports = {
    registerUser,
    loginUser,
    getMe,
    logOut
};