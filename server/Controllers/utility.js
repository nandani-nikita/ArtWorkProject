const isValidEmail = function (email) {
    const regexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regexp.test(String(email).toLowerCase());
}

const isValidPassword = function (password) {
    const regexp = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,12}$/;
    return regexp.test(password);
}

const isValidPhone = function (phone) {
    const regexp = /^\d{10}$/;
    return regexp.test(phone);
}
const isValidGender = function (gender) {
    const allowedGenders = ['male', 'female', 'others'];
    if(allowedGenders.includes(gender.toLowerCase())) {
        return true;
    }
    return false;
}
const isValidDate = function (date) {
    const newDate = new Date(date)
    if (newDate.toDateString() === 'Invalid Date') {
        return false;
    }
    return true;
}

const isValidFile = function (avatar) {
    const fileExtensions = ['png', 'jpeg', 'jpg'];
    const mimeTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    const maxSize = 5;


    const uploadFileExtension = avatar.name.split('.');
    const uploadFileMimeType = avatar.mimetype;

    if (uploadFileExtension.length > 2 || !fileExtensions.includes(uploadFileExtension[1]) || !mimeTypes.includes(uploadFileMimeType)) {
        return {
            error: "Please check the filename and extension. Allowed types: png, jpeg, jpg"
        }
    }

    if ((avatar.size / (1024 * 1024)) > maxSize) {
        return {
            error: "File too large"
        }
    }

    return { msg: "Valid File" }
}

const isValidTextContent = function (textData) {
    const regexp = /^[ A-Za-z0-9_@.!#&()]*$/;

    return regexp.test(textData);
}
const isValidUuid = function (uuid) {
    const regexp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;

    return regexp.test(uuid);
}
const isValidRates = function (rating) {
    console.log("wdfcwd",typeof(rating));
    if(Number.isInteger(rating) && rating>0 && rating<=5) {
        return true;
    }

    return false;
}
module.exports = {
    isValidEmail,
    isValidPassword,
    isValidPhone,
    isValidGender,
    isValidDate,
    isValidFile,
    isValidTextContent,
    isValidUuid,
    isValidRates
}