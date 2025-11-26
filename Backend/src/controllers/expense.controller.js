const asyncHandler = require('express-async-handler');
const Expense = require('../models/expense.models.js');

const getExpense = asyncHandler(async (req, res) => {
    const expenses = await Expense.find({ user: req.user.id });
    res.status(200).json(expenses);
});

const setExpense = asyncHandler(async (req, res) => {
    const { amount, category, note, date } = req.body;

    if (!amount || !category || !date) {
        res.status(400);
        throw new Error('Please provide amount, category, and date');
    }

    const expense = await Expense.create({
        user: req.user.id,
        amount,
        category,
        note,
        date,
    });

    res.status(201).json(expense);
});


const updateExpense = asyncHandler(async (req, res) => {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
        res.status(404);
        throw new Error('Expense not found');
    }

    if (expense.user.toString() !== req.user.id) {
        res.status(401); 
        throw new Error('User not authorized to update this expense');
    }

    
    const updatedExpense = await Expense.findByIdAndUpdate(
        req.params.id,
        req.body, 
        { new: true } 
    );

    res.status(200).json(updatedExpense);
});


const deleteExpense = asyncHandler(async (req, res) => {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
        res.status(404);
        throw new Error('Expense not found');
    }

    if (expense.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized to delete this expense');
    }

    await expense.deleteOne();

    res.status(200).json({ id: req.params.id, message: 'Expense deleted' });
});

module.exports = {
    getExpense,
    setExpense,
    updateExpense,
    deleteExpense,
};