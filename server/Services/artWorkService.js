const { conn } = require('../DBs/db');
const dotenv = require("dotenv");
dotenv.config({ path: './.env' });

const commentService = require('./commentService');
const userService = require('./userService');

const { v4: uuidv4 } = require('uuid');
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});
async function uploadArtWorkService(user, body, files) {
    try {
        const avatar = files.artWork;
        const avatarId = uuidv4();
        const extenstion = avatar.name.split('.')[1];
        const fileContent = Buffer.from(avatar.data, 'binary');
        // const fileContent = fs.readFileSync(avatar)
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `artWorks/${user.id}/${avatarId}.${extenstion}`,
            Body: fileContent
        }

        var s3upload = await s3.upload(params).promise();
        console.log(s3upload);

        const dateString = new Date(Date.now());
        const date = dateString.toLocaleDateString() + " " + dateString.toLocaleTimeString();
        console.log(date);
        const time = dateString.toTimeString();

        const insertColumns = `id, art_work, caption, description, uploaded_by, uploaded_on`;

        const insertValues = `'${avatarId}', '${s3upload.Location}', '${body.caption}', '${body.description}', '${user.id}', '${date}'`

        await conn.query(`INSERT INTO arts (${insertColumns}) VALUES (${insertValues})`);

        return {
            msg: 'Art Work Uploaded',
            data: s3upload
        };

    } catch (e) {
        console.log(`uploadArtWorkService catch error : ${e}`);
        return { error: e.toString() }
    }
}
async function getAllArtWorkService() {
    try {
        const artWorks = await conn.query(`SELECT * FROM arts ORDER BY uploaded_on DESC`);

        return {
            msg: 'Art Works Found',
            data: artWorks.rows
        };

    } catch (e) {
        console.log(`getAllArtWorkService catch error : ${e}`);
        return { error: e.toString() }
    }
}
async function getArtWorkByIdService(artId, userId = null) {
    try {
        const artWork = (await conn.query(`SELECT * FROM arts WHERE id='${artId}'`)).rows[0];
        console.log(userId);
        const commentData = await commentService.getArrangedComments(artId, userId);
        Object.assign(artWork, { commentData: commentData });
        const authorInfo = await userService.getUserDetailsService(artWork.uploaded_by);
        Object.assign(artWork, { authorInfo: authorInfo });
        // console.log(artWork);
        return {
            msg: 'Art Work Found',
            data: artWork
        };

    } catch (e) {
        console.log(`getAllArtWorkService catch error : ${e}`);
        return { error: e.toString() }
    }
}
async function getMyArtWorkService(user) {
    try {
        const artWorks = await conn.query(`SELECT * FROM arts WHERE uploaded_by='${user.id}' ORDER BY uploaded_on DESC`);

        return {
            msg: 'Art Works Found',
            data: artWorks.rows
        };

    } catch (e) {
        console.log(`getMyArtWorkService catch error : ${e}`);
        return { error: e.toString() }
    }
}


async function deleteArtWorkService(user, artId) {
    try {
        let artWorks = (await conn.query(`SELECT * FROM arts WHERE uploaded_by='${user.id}' AND id='${artId}'`)).rows[0];

        if (!artWorks || artWorks.length === 0) {
            return {
                error: "Art Work Not Found"
            }
        }
        const s3artKey = artWorks.art_work.split('.com/')[1];
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `${s3artKey}`
        };
        var s3delete = await s3.deleteObject(params).promise();
        console.log(s3delete);

        await conn.query(`DELETE FROM likes_ratings WHERE art_id='${artId}'`);
        await conn.query(`DELETE FROM comments WHERE art_id='${artId}'`);
        await conn.query(`DELETE FROM arts WHERE uploaded_by='${user.id}' AND id='${artId}'`);


        return {
            msg: 'Art Works Deleted',
            data: artId
        };

    } catch (e) {
        console.log(`deleteArtWorkService catch error : ${e}`);
        return { error: e.toString() }
    }
}
module.exports = {
    uploadArtWorkService,
    getAllArtWorkService,
    getArtWorkByIdService,
    getMyArtWorkService,
    deleteArtWorkService
}