const express = require("express");
const router = express.Router();

const commentCtrl = require('../Controllers/commentsController');

router.post('/like', commentCtrl.like);
router.post('/rate', commentCtrl.rate);
router.post('/comment', commentCtrl.comment);
router.post('/all-comments', commentCtrl.getAllComments);
router.post('/my-comments', commentCtrl.getMyComments); //get all comments and ratings of art id 
router.post('/likes-ratings', commentCtrl.getAllReactionCount);

module.exports = router;