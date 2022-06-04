const { conn } = require('../DBs/db');
const { hashPassword, comparePassword } = require('../Controllers/hashed');
const { generateToken, verifyToken } = require('../Controllers/jwt');
const utility = require('./utility');

const artWorkService = require('../Services/artWorkService');

const uploadNew = async (req, res) => {
    try {
        const validUser = await verifyToken(req.headers['authorization']);
        if (!(validUser || validUser.id)) {
            return res.status(406).json({ error: "Unauthorized User" });
        }
        if (!req.files) {
            return res.status(406).send({
                error: 'No file to upload'
            });
        }

        const checkValidCaption = utility.isValidTextContent(req.files.caption);
        if (!checkValidCaption) {
            return res.status(406).json({ error: "Invalid Caption String. Allowed Characters: a-zA-Z0-9 _@.!#&()" });
        }
        const checkValidDescription = utility.isValidTextContent(req.files.caption);
        if (!checkValidDescription) {
            return res.status(406).json({ error: "Invalid Description String. Allowed Characters: a-zA-Z0-9 _@.!#&()" });
        }
        const checkValidFile = utility.isValidFile(req.files.artWork);
        if ('error' in checkValidFile) {
            return res.status(406).json({ error: checkValidFile.error.toString() });
        }

        const uploadArtWork = await artWorkService.uploadArtWorkService(validUser, req.body, req.files);
        if ('error' in uploadArtWork) {
            return res.status(406).json({ error: uploadArtWork.error.toString() });
        }
        return res.status(200).json({
            msg: uploadArtWork.msg,
            data: uploadArtWork.data
        });

    } catch (error) {
        console.log("Error: ", error);
        return res.status(406).json({ error: error });
    }
};
const deleteMyArtWork = async (req, res) => {
    try {
        const validUser = await verifyToken(req.headers['authorization']);
        if (!(validUser || validUser.id)) {
            return res.status(406).json({ error: "Unauthorized User" });
        }
        const checkValidArtWorkId = utility.isValidUuid(req.body.artId);
        if (!checkValidArtWorkId) {
            return res.status(406).json({ error: "Invalid Art Id" });
        }
        const deleteArtWork = await artWorkService.deleteArtWorkService(validUser, req.body);
        if ('error' in deleteArtWork) {
            return res.status(406).json({ error: deleteArtWork.error.toString() });
        }
        return res.status(200).json({
            msg: deleteArtWork.msg,
            data: deleteArtWork.data
        });

    } catch (error) {
        console.log("Error: ", error);
        return res.status(406).json({ error: error });
    }
};


const getAllArtWorks = async (req, res) => {
    try {

        const getArtWorks = await artWorkService.getAllArtWorkService();
        if ('error' in getArtWorks) {
            return res.status(406).json({ error: getArtWorks.error.toString() });
        }
        return res.status(200).json({
            msg: getArtWorks.msg,
            data: getArtWorks.data
        });

    } catch (error) {
        console.log("Error: ", error);
        return res.status(406).json({ error: error });
    }
};
const getTrendingArtWorks = async (req, res) => {
    try {
        res.status(200).json({ msg: "App started" });

    } catch (error) {
        console.log("Error: ", error);
        res.status(406).json({ error: error });
    }
};
const getMyArtWorks = async (req, res) => {
    try {
        const validUser = await verifyToken(req.headers['authorization']);
        if (!(validUser || validUser.id)) {
            return res.status(406).json({ error: "Unauthorized User" });
        }

        const getArtWorks = await artWorkService.getMyArtWorkService(validUser);
        if ('error' in getArtWorks) {
            return res.status(406).json({ error: getArtWorks.error.toString() });
        }
        return res.status(200).json({
            msg: getArtWorks.msg,
            data: getArtWorks.data
        });

    } catch (error) {
        console.log("Error: ", error);
        return res.status(406).json({ error: error });
    }
};
const comment = async (req, res) => {
    try {
        res.status(200).json({ msg: "App started" });

    } catch (error) {
        console.log("Error: ", error);
        res.status(406).json({ error: error });
    }
};
module.exports = {
    uploadNew,
    deleteMyArtWork,
    comment,
    getAllArtWorks,
    getTrendingArtWorks,
    getMyArtWorks
}
