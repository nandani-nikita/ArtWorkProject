const bcrypt = require('bcrypt');

module.exports.hashPassword = async (password, saltRounds = 10) => {
    try {
        // Generate a salt
        const salt = await bcrypt.genSalt(saltRounds);

        // console.log(typeof(bcrypt.hash(password, salt)));
        // Hash password
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (error) {
        console.log(error);
    }

    // Return null if error
    return null;
};


module.exports.comparePassword = async (password, hash) => {
    try {
        // console.log(await bcrypt.compare(password, hash))
        // Compare password
        const passwordCheck = await bcrypt.compare(password, hash);
        return passwordCheck;
    } catch (error) {
        console.log(error);
    }

    // Return false if error
    return false;
};