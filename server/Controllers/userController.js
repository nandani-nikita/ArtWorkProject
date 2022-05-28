

const { generateToken, verifyToken } = require('./jwt');
const utility = require('./utility');

const userService = require('../Services/userService');

const signIn = async (req, res) => {
    try {
        console.log('Sign-In api');
        if (!(req.body.username && req.body.password)) {
            return res.status(406).json({
                error: "Invalid Input"
            });
        }

        let checkValidEmail = utility.isValidEmail(req.body.username);
        if(!checkValidEmail) {
            return res.status(406).json({
                error: "Invalid Email Format"
            });
        }
        // let checkValidPassword = utility.isValidEmail(req.body.password);
        // if(!checkValidPassword) {
        //     return res.status(406).json({
        //         error: "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character; special characters allowed: @$!%*?&"
        //     });
        // }
        let validUser = await userService.signInService(req.body);

        // console.log(validUser);
        if ('error' in validUser) {
            console.log('false');
            return res.status(406).json({ error: validUser.error })
        }

        console.log('true');
        res.status(200).json({
            msg: "Login Successful",
            name: validUser.name,
            email: validUser.email,
            token: validUser.token
        });

    } catch (error) {
        console.log("error occurred",error);
        res.status(406).json(error);
    }
};



module.exports = {
    signIn
}
