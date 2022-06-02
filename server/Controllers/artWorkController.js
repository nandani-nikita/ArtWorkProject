const { conn } = require('../DBs/db');
const dbQueries = require('../DBs/dbQueries');
const { hashPassword, comparePassword } = require('../Controllers/hashed');
const { generateToken, verifyToken } = require('../Controllers/jwt');

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
        let avatar = req.files.artWork;

        const fileExtensions = ['png', 'jpeg', 'jpg'];
        const mimeTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        const maxSize = 5;


        const uploadFileExtension = avatar.name.split('.');
        const uploadFileMimeType = avatar.mimetype;

        if(uploadFileExtension.length>2 || !fileExtensions.includes(uploadFileExtension[1]) || !mimeTypes.includes(uploadFileMimeType)) {
            return res.status(406).json({
                error: "Please check the filename and extension. Allowed types: png, jpeg, jpg"
            })
        }
       
        if((avatar.size / (1024 * 1024)) > maxSize) {
            return res.status(406).json({
                error: "File too large"
            })
        }

        // avatar.mv('./artworks/' + avatar.name);
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
