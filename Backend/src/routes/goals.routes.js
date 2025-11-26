const express = require('express');
const { getGoals, setGoal, updateGoal, deleteGoal } = require('../controllers/goals.controllers.js');
const { protect } = require('../middlewares/authentication.js');

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getGoals)
    .post(setGoal);

router.route('/:id')
    .put(updateGoal)
    .delete(deleteGoal);

module.exports = router;