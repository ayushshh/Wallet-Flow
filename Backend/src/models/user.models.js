const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Please provide a first name'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Please provide a last name'],
        trim: true
    },
    username: {
        type: String,
        required: [true, 'Please provide a username'],
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);