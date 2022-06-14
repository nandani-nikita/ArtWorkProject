

const dotenv = require("dotenv");
dotenv.config({ path: './config.env' })
const jwt = require('jsonwebtoken');

const secret = process.env.PRIVATE_KEY;

module.exports.generateToken = function (login) {

    const jwttoken = jwt.sign({
        id: login.loginId,
        name: login.loginName,
        email: login.loginEmail,
        date: new Date(Date.now())
    },
        secret, {
        expiresIn: 60 * 60 * 24
    });

    return jwttoken;
};

module.exports.verifyToken = function (headers) {
try{
    var bearerToken;
    var bearerHeader = headers;
    if (bearerHeader) {
        var bearer = bearerHeader.split(" ");
        bearerToken = bearer[1];
        const tokenVerify = jwt.verify(bearerToken, secret);
        
        return tokenVerify;
    } else {
        //no token
        return false;
    }
} catch(error) {
    console.log("JWT VERIFICATION ERROR \n", error);
    return false;
}
    

}
