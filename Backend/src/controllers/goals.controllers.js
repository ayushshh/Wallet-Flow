const asyncHandler = require('express-async-handler');
const Goal = require('../models/goals.models.js');


const getGoals = asyncHandler(async (req, res) => {
    const goals = await Goal.find({ user: req.user.id });
    res.status(200).json(goals);
});

const setGoal = asyncHandler(async (req, res) => {
    const { amount, description, date } = req.body;

    if (!amount || !description || !date) {
        res.status(400);
        throw new Error('Please provide amount, description, and date');
    }

    const goal = await Goal.create({
        user: req.user.id, 
        amount,
        description, 
        date,
    });

    res.status(201).json(goal);
});

const updateGoal = asyncHandler(async (req, res) => {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
        res.status(404);
        throw new Error('Goal not found');
    }

    if (goal.user.toString() !== req.user.id) {
        res.status(401); // Unauthorized
        throw new Error('User not authorized to update this goal');
    }

    const updatedGoal = await Goal.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true } 
    );

    res.status(200).json(updatedGoal);
});

const deleteGoal = asyncHandler(async (req, res) => {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
        res.status(404);
        throw new Error('Goal not found');
    }

    if (goal.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized to delete this goal');
    }

    await goal.deleteOne();

    res.status(200).json({ id: req.params.id, message: 'Goal deleted' });
});

module.exports = {
    getGoals,
    setGoal,
    updateGoal,
    deleteGoal,
};