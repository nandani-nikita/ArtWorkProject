const express = require("express");
const router = express.Router();
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
router.use(fileUpload({
    createParentPath: true
}));
router.use(morgan('dev'));

const userCtrl = require('../Controllers/userController');

router.post('/sign-in', userCtrl.signIn);
router.post('/new', userCtrl.registerUser);
router.get('/:userId', userCtrl.getUser);

module.exports = router;
