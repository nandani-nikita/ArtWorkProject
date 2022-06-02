const express = require("express");
const router = express.Router();

const userCtrl = require('../Controllers/userController');

router.post('/sign-in', userCtrl.signIn);
router.post('/new', userCtrl.registerUser);

module.exports = router;
