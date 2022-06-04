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
router.get('/all', artCtrl.getAllArtWorks);
router.get('/my', artCtrl.getMyArtWorks);
router.post('/del', artCtrl.deleteMyArtWork);
// router.get('/trending', artCtrl.getTrendingArtWorks);

module.exports = router;