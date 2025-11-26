const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    amount: {
        type: Number,
        required: [true, 'Please add a goal amount'],
        min: [0.01, 'Amount must be a positive number']
    },
    description: {
        type: String,
        required: [true, 'Please add a goal description'],
        trim: true
    },
    date: {
        type: Date,
        required: [true, 'Please add a target date']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Goal', goalSchema);