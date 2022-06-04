const { conn } = require('../DBs/db');
const dotenv = require("dotenv");
dotenv.config({ path: './.env' });

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
        const insertColumns = `id, art_work, caption, description, uploaded_by, uploaded_on`;
        const insertValues = `'${avatarId}', '${s3upload.Location}', '${body.caption}', '${body.description}', '${user.id}', '${new Date(Date.now())}'`

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


async function deleteArtWorkService(user, body) {
    try {
        let artWorks = (await conn.query(`SELECT * FROM arts WHERE uploaded_by='${user.id}' AND id='${body.artId}'`)).rows[0];

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

        await conn.query(`DELETE FROM arts WHERE uploaded_by='${user.id}' AND id='${body.artId}'`);
    
        
        return {
            msg: 'Art Works Deleted',
            data: body.artId
        };

    } catch (e) {
        console.log(`deleteArtWorkService catch error : ${e}`);
        return { error: e.toString() }
    }
}
module.exports = {
    uploadArtWorkService,
    getAllArtWorkService,
    getMyArtWorkService,
    deleteArtWorkService
}