const express = require("express");
const router = express.Router();

const ctrl = require('../Controllers/controller');

router.get('/', ctrl.active);

module.exports = router;
