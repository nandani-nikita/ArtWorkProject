const { conn } = require('../DBs/db');
const dbQueries = require('../DBs/dbQueries');
const { hashPassword, comparePassword } = require('../Controllers/hashed');

const { generateToken, verifyToken } = require('../Controllers/jwt');
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

async function registerUserService(body) {
    try {
        const checkExistingUser = await dbQueries.findOnConditionFunction('users', `email='${body.email}'`);

        if (!checkExistingUser) {
            const signUpMedium = ((body.signUpMedium && (body.signUpMedium).toLowerCase() === 'google') ? 'google' : 'inapp')
            const insertUserColumns = `name, email, password, phone, dob, signup_medium`;
            const insertUserValues = `'${body.name}','${body.email}','${await hashPassword(body.password)}','${body.mobile}','${body.dob}','${signUpMedium}'`;
            const saveData = await dbQueries.insertFunction('users', insertUserColumns, insertUserValues);

            if ('error' in saveData) {
                return saveData
            }
            return {
                msg: 'User Registered',
                name: body.name,
                dob: body.dob,
                email: body.email,
                mobile: body.mobile
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