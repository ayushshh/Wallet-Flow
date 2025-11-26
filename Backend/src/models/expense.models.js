const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    amount: {
        type: Number,
        required: [true, 'Please add an amount'],
        min: [0.01, 'Amount must be a positive number']
    },
    category: {
        type: String,
        required: [true, 'Please select a category'],
        trim: true
    },
    note: {
        type: String,
        required: false, 
        trim: true
    },
    date: {
        type: Date,
        required: [true, 'Please add a date']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Expense', expenseSchema);