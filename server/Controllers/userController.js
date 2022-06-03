

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
        if (!checkValidEmail) {
            return res.status(406).json({
                error: "Invalid Email Format"
            });
        }
        let checkValidPassword = utility.isValidPassword(req.body.password);
        if (!checkValidPassword) {
            return res.status(406).json({
                error: "Password length is minimum 8 characters and maximum 12 characters. Passowrd must contain at least one uppercase letter, one lowercase letter, one number and one special character; special characters allowed: !@#$%^&*"
            });
        }

        let validUser = await userService.signInService(req.body);

        if ('error' in validUser) {
            return res.status(406).json({ error: validUser.error })
        }

        res.status(200).json({
            msg: "Login Successful",
            name: validUser.name,
            email: validUser.email,
            token: validUser.token
        });

    } catch (error) {
        res.status(406).json(error);
    }
};

const registerUser = async (req, res) => {
    try {
        console.log('Register User Api');
        if (!(req.body.name && req.body.email && req.body.password && req.body.mobile && req.body.dob)) {
            return res.status(406).json({
                error: "Invalid Input. Fields required: name, email, password, mobile, dob."
            });
        }

        let checkValidEmail = utility.isValidEmail(req.body.email);
        if (!checkValidEmail) {
            return res.status(406).json({
                error: "Invalid Email Format"
            });
        }
        let checkValidPassword = utility.isValidPassword(req.body.password);
        if (!checkValidPassword) {
            return res.status(406).json({
                error: "Password length is minimum 8 characters and maximum 12 characters. Passowrd must contain at least one uppercase letter, one lowercase letter, one number and one special character; special characters allowed: !@#$%^&*"
            });
        }
        let checkValidPhone = utility.isValidPhone(req.body.mobile);
        if (!checkValidPhone) {
            return res.status(406).json({
                error: "Invalid Phone Number"
            });
        }

        let checkValidDob = utility.isValidDate(req.body.dob);
        if (!checkValidDob) {
            return res.status(406).json({
                error: "Invalid Date Of Birth. Please enter your dob in the format: YYYY-MM-DD or YYYY/MM/DD or YYYY.MM.DD"
            });
        }
        
        if(req.files) {
            const checkValidFile = utility.isValidFile(req.files.profilePicture);
            if ('error' in checkValidFile) {
                return res.status(406).json({ error: checkValidFile.error });
            }
        }
        let user = await userService.registerUserService(req.body, req.files);

        if ('error' in user) {
            return res.status(406).json({ error: user.error })
        }

        res.status(200).json({
            msg: user.msg,
            name: user.name,
            email: user.email,
            mobile: user.mobile,
            dob: user.dob,
            profilePicture: user.profilePicture
        });

    } catch (error) {
        res.status(406).json(error);
    }
};

module.exports = {
    signIn,
    registerUser
}
