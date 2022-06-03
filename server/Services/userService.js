const { conn } = require('../DBs/db');
const dbQueries = require('../DBs/dbQueries');
const { hashPassword, comparePassword } = require('../Controllers/hashed');

const { generateToken, verifyToken } = require('../Controllers/jwt');

const { v4: uuidv4 } = require('uuid');
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

async function signInService(body) {
    try {

        var validUser = (await conn.query(`select * from users where email='${body.username}'`)).rows[0];

        if (!validUser) {
            return { error: "Invalid User Id" };
        }

        var validPassword = await comparePassword(body.password, validUser.password);
        if (!validPassword) {
            validUser = { error: "Wrong Password" };
            return validUser;
        }

        var login = {
            loginId: validUser['id'],
            loginName: validUser['name'],
            loginEmail: validUser['email']
        }

        const jwttoken = await generateToken(login);
        Object.assign(validUser, { token: jwttoken });

        return validUser;

    } catch (e) {
        return { error: e }
    }
}

async function registerUserService(body, files) {
    try {
        const checkExistingUser = await dbQueries.findOnConditionFunction('users', `email='${body.email}'`);

        if (!checkExistingUser) {
            const avatar = files.profilePicture;
        const id = uuidv4();
        const extenstion = avatar.name.split('.')[1];
        const fileContent = Buffer.from(avatar.data, 'binary');
        // const fileContent = fs.readFileSync(avatar)
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `profilePictures/${id}.${extenstion}`,
            Body: fileContent
        }

        var s3upload = await s3.upload(params).promise();
        console.log(s3upload);
            
            const signUpMedium = ((body.signUpMedium && (body.signUpMedium).toLowerCase() === 'google') ? 'google' : 'inapp')

            const insertUserColumns = `id, name, email, password, phone, dob, profile_picture, signup_medium`;
            const insertUserValues = `'${id}','${body.name}','${body.email}','${await hashPassword(body.password)}','${body.mobile}','${body.dob}','${s3upload.Location}','${signUpMedium}'`;

            const saveData = await dbQueries.insertFunction('users', insertUserColumns, insertUserValues);

            if ('error' in saveData) {
                return saveData
            }
            return {
                msg: 'User Registered',
                name: body.name,
                dob: body.dob,
                email: body.email,
                mobile: body.mobile,
                profilePicture: s3upload.Location
            };
        }


        return checkExistingUser;
    } catch (e) {
        console.log(`registerUserService catch error : ${e}`);
        return { error: e.toString() }
    }
}


module.exports = {
    signInService,
    registerUserService
}