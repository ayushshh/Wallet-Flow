const express = require('express');
const router = express.Router();
const { getExpense, setExpense, updateExpense, deleteExpense } = require('../controllers/expense.controller.js');
const { protect } = require('../middlewares/authentication.js');

router.use(protect);

router.route('/')
    .get(getExpense)
    .post(setExpense);

router.route('/:id')
    .put(updateExpense)
    .delete(deleteExpense);

module.exports = router;