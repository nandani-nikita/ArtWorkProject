const { conn } = require('../DBs/db');
const dbQueries = require('../DBs/dbQueries');
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
                error: 'No file uploaded'
            });
        }

        const checkValidFile = utility.isValidFile(req.files.artWork);
        if ('error' in checkValidFile) {
            return res.status(406).json({ error: checkValidFile.error });
        }
        
        const uploadArtWork = await artWorkService.uploadArtWorkService(validUser, req.body, req.files);
        if ('error' in uploadArtWork) {
            return res.status(406).json({ error: uploadArtWork.error });
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
        res.status(200).json({ msg: "App started" });

    } catch (error) {
        console.log("Error: ", error);
        res.status(406).json({ error: error });
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

const getAllArtWorks = async (req, res) => {
    try {
        res.status(200).json({ msg: "App started" });

    } catch (error) {
        console.log("Error: ", error);
        res.status(406).json({ error: error });
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
