const { conn } = require('../DBs/db');
const dbQueries = require('../DBs/dbQueries');
const { hashPassword, comparePassword } = require('../Controllers/hashed');
const fs = require('fs');
const { generateToken, verifyToken } = require('../Controllers/jwt');
const { v4: uuidv4 } = require('uuid');
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})
async function uploadArtWorkService(user, body, files) {
    try {
        const avatar = files.artWork;
        const avatarId = uuidv4();
        const extenstion = avatar.name.split('.')[1];
        const fileContent = Buffer.from(avatar.data, 'binary');
        // const fileContent = fs.readFileSync(avatar)
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `${avatarId}.${extenstion}`,
            Body: fileContent
        }

        var s3upload = await s3.upload(params).promise();
        console.log(s3upload);
        const insertColumns = `id, art_work, caption, description, uploaded_by, uploaded_on`;
        const insertValues = `'${avatarId}', '${s3upload.Location}', '${body.caption}', '${body.description}', '${user.id}', '${(new Date(Date.now())).toDateString()}'`

        const saveData = await dbQueries.insertFunction('arts', insertColumns, insertValues);
        if ('error' in saveData) {
            return saveData
        }
        return {
            msg: 'Art Work Uploaded',
            data: s3upload
        };

    } catch (e) {
        console.log(`artworkservice catch error : ${e}`);
        return { error: e.toString() }
    }
}

module.exports = {
    uploadArtWorkService
}