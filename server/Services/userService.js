const { conn } = require('../DBs/db');
const { hashPassword, comparePassword } = require('../Controllers/hashed');

const { generateToken } = require('../Controllers/jwt');

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
        const checkExistingUser = await conn.query(`SELECT * FROM users WHERE email='${body.email}'`);
        console.log(checkExistingUser);
        if (checkExistingUser.rows.length === 0) {
            var fileLocation = null;
            const id = uuidv4();
            if (files) {
                const avatar = files.profilePicture;

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
                fileLocation = s3upload.Location;
            }
            const signUpMedium = ((body.signUpMedium && (body.signUpMedium).toLowerCase() === 'google') ? 'google' : 'inapp')

            const insertUserColumns = `id, name, email, password, phone, gender, dob, profile_picture, signup_medium`;

            const insertUserValues = `'${id}','${body.name}','${body.email}','${await hashPassword(body.password)}','${body.mobile}','${(body.gender).toLowerCase()}','${body.dob}','${fileLocation}','${signUpMedium}'`;

            await conn.query(`INSERT INTO users (${insertUserColumns}) VALUES (${insertUserValues})`);

            return {
                msg: 'User Registered',
                name: body.name,
                gender: body.gender,
                dob: body.dob,
                email: body.email,
                mobile: body.mobile,
                profilePicture: fileLocation
            };
        } else {
            return { error: 'Email Taken' }
        }


    } catch (e) {
        console.log(`registerUserService catch error : ${e}`);
        return { error: e.toString() }
    }
}

async function getUserDetailsService(userId) {
    try {
        // console.log(userId);
        const checkExistingUser = (await conn.query(`SELECT * FROM users WHERE id='${userId}'`)).rows;
        // console.log(checkExistingUser);
        if (checkExistingUser.length) {
            const user = checkExistingUser[0];


            return {
                msg: 'User Found',
                id: user.id,
                name: user.name,
                gender: user.gender,
                dob: user.dob,
                email: user.email,
                mobile: user.mobile,
                profilePicture: user.profile_picture
            };
        } else {
            return { error: 'User Not Found' }
        }


    } catch (e) {
        console.log(`getUserDetailsService catch error : ${e}`);
        return { error: e.toString() }
    }
}
module.exports = {
    signInService,
    registerUserService,
    getUserDetailsService
}