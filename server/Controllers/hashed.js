const bcrypt = require('bcrypt');

module.exports.hashPassword = async (password, saltRounds = 10) => {
    try {
        const salt = await bcrypt.genSalt(saltRounds);

        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (error) {
        console.log(error);
    }

    return null;
};


module.exports.comparePassword = async (password, hash) => {
    try {
        const passwordCheck = await bcrypt.compare(password, hash);
        return passwordCheck;
    } catch (error) {
        console.log(error);
    }

    return false;
};