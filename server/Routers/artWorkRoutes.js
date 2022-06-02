const express = require("express");
const router = express.Router();
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
router.use(fileUpload({
    createParentPath: true
}));
router.use(morgan('dev'));


const artCtrl = require('../Controllers/artWorkController');

router.post('/new', artCtrl.uploadNew);
router.post('/del', artCtrl.deleteMyArtWork);
router.post('/comment', artCtrl.comment);
router.get('/all', artCtrl.getAllArtWorks);
router.get('/trending', artCtrl.getTrendingArtWorks);
router.get('/my', artCtrl.getMyArtWorks);

module.exports = router;