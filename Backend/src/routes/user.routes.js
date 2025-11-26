const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, logOut } = require('../controllers/user.controller.js');
const { protect } = require('../middlewares/authentication.js');

router.post('/', registerUser);
router.post('/login', loginUser);

router.get('/me', protect, getMe);
router.post('/logout', protect, logOut);

module.exports = router;