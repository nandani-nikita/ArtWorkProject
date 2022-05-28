const { conn } = require('../DBs/db');

const { hashPassword, comparePassword } = require('../Controllers/hashed');

const { generateToken, verifyToken } = require('../Controllers/jwt');
async function signInService(body) {
    try {

        var validUser = (await conn.query(`select * from users where email='${body.username}'`)).rows[0];
        
        console.log(validUser, validUser.password);
        if (!validUser) {
            return { error: "Invalid User Id" };
        }
        
        var validPassword = await comparePassword(body.password, validUser.password);
        console.log(validPassword);
        if (!validPassword) {
            validUser = { error: "Wrong Password" };
            return validUser;
        }

        var login = {
            loginId:validUser['user_id'],
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

// async function adminRegisterService(body) {
//     try {
//         var userAvailable = await AdminSch.findOne({
//             $or: [
//                 { email: body.email },
//                 { username: body.username }
//             ]
//         });
//         if (userAvailable) {
//             return { error: "Email or username entered is already taken. Please try a different one" };
//         }
//         const newAdmin = new AdminSch({
//             name: body.name,
//             email: body.email,
//             username: body.username,
//             password: (await hashPassword(body.password)).toString(),
//             role: (body.role).toUpperCase(),
//             dob: body.dob,
//             address: body.address,
//             mobile: body.mobile,
//             registrationDate: new Date(Date.now())
//         });
//         var savedData = await newAdmin.save()
//         return { data: savedData }
//     } catch (e) {
//         console.log(`catch error : ${e}`);
//         return { error: e.toString() }
//     }
// }


// async function adminRemoveService() {
//     try {
//         var userAvailable = await AdminSch.findOneAndUpdate({
//             $and: [{
//                 $or: [
//                     { email: body.email },
//                     { username: body.username }
//                 ]
//             }, { role: (body.role).toUpperCase() }]
//         }, {
//             $set: {
//                 isActive: false
//             }
//         }, { new: true });

//         if (!userAvailable) {
//             return { error: `${(body.role).toUpperCase()} NOT found with given email or username` };
//         }
//         return userAvailable;
//     } catch (e) {
//         console.log(`catch error : ${e}`);
//         return { error: e.toString() }
//     }
// }

// async function getAllAdminService() {
//     try {
//         var admins = await AdminSch.find({
//             $or: [{ role: "ADMIN" }, { role: "STAFF" }]
//         });
//         console.log(admins);
//         return admins
//     } catch (e) {
//         return { error: e }
//     }
// }

// async function getAdminDataService(body) {
//     try {
//         var admin = await AdminSch.findOne({
//             $and: [{
//                 $or: [
//                     { email: body.email },
//                     { username: body.username }
//                 ]
//             }, { role: (body.role).toUpperCase() }]
//         });

//         if (!admin) {
//             return { error: `${(body.role).toUpperCase()} Profile Not Found` }
//         }
//         return admin;


//     } catch (e) {
//         return { error: e }
//     }
// }

// async function adminUpdateService(body) {
//     try {
//         var adminUpdate = await AdminSch.findOneAndUpdate({
//             $and: [{
//                 $or: [
//                     { email: body.email },
//                     { username: body.username }
//                 ]
//             }, {
//                 $or: [
//                     { role: "ADMIN" },
//                     { role: "STAFF" }
//                 ]
//             }]
//         }, {
//             // username: body.username,
//             dob: body.dob,
//             address: body.address,
//             mobile: body.mobile,
//         }, { new: true });
//         console.log("updated data", adminUpdate);
//         if (!adminUpdate) {
//             return { error: "Email or username entered is incorrect. Please try a correct one" }
//         }
//         return adminUpdate;


//     } catch (e) {
//         console.log(e);
//         return { error: e.toString() }
//     }
// }


// async function getMyInfoService(username, role) {
//     try {
//         var admin = await AdminSch.findOne({
//             $and: [
//                 { username: username },
//                 { role: role }]
//         }, {
//             _id: 0,
//             password: 0,
//             __v: 0
//         });

//         if (!admin) {
//             return { error: `${(body.role).toUpperCase()} Profile Not Found` }
//         }
//         return admin;


//     } catch (e) {
//         return { error: e }
//     }
// }

module.exports = {
    signInService,
    // adminRegisterService,
    // adminRemoveService,
    // getAllAdminService,
    // getAdminDataService,
    // adminUpdateService,
    // getMyInfoService
}