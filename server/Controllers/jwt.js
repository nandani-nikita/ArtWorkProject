

const dotenv = require("dotenv");
dotenv.config({ path: './config.env' })
const jwt = require('jsonwebtoken');

const secret = process.env.PRIVATE_KEY;

module.exports.generateToken = function (login) {

    // console.log("Secret :----", secret);
    // console.log(`login data: ${login}`);
    const jwttoken = jwt.sign({
        id: login.loginId,
        name: login.loginName,
        email: login.loginEmail,
        date: new Date(Date.now())
    },
        secret, {
        // expiresIn: 60 * 2 
        expiresIn: 60 * 60 * 24
    });

    // res.header('Authorization', 'Bearer ' + jwttoken);
    return jwttoken;
};

module.exports.verifyToken = function (headers) {
try{
    var bearerToken;
    var bearerHeader = headers;
    // console.log("inside jwt verify token", bearerHeader)
    // console.log(req.headers);
    // console.log(typeof bearerHeader)
    if (bearerHeader) {
        // if (typeof bearerHeader !== 'undefined') {
        var bearer = bearerHeader.split(" ");
        bearerToken = bearer[1];
        // req.token = bearerToken;
        //  console.log(bearerToken);
        const tokenVerify = jwt.verify(bearerToken, secret);
        // console.log(tokenVerify, "\ntoken verified");
        // return true;
        return tokenVerify;
    } else {
        console.log("No token");
        return false;
    }
} catch(error) {
    console.log("error", error);
    // return res.status(406).json({error:error})
    return error;
}
    

}
