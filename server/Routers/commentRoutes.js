const express = require("express");
const router = express.Router();

const commentCtrl = require('../Controllers/commentsController');

router.post('/like', commentCtrl.like);
router.post('/rate', commentCtrl.rate);
router.post('/comment', commentCtrl.comment);
router.post('/del-comment', commentCtrl.deleteComment);

module.exports = router;