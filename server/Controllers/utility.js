const isValidEmail = function (email) {
    const regexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regexp.test(String(email).toLowerCase());
}
const isValidPassword = function (password) {
    var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,12}$/;
    return re.test(password);
}
const isValidPhone = function (phone) {
    var re = /^\d{10}$/;
    return re.test(phone);
}
const isValidDate = function (date) {
    var newDate = new Date(date)
    if (newDate.toDateString() === 'Invalid Date') {
        return false;
    }
    return true;
}

const isValidFile = function(avatar) {
        const fileExtensions = ['png', 'jpeg', 'jpg'];
        const mimeTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        const maxSize = 5;


        const uploadFileExtension = avatar.name.split('.');
        const uploadFileMimeType = avatar.mimetype;

        if(uploadFileExtension.length>2 || !fileExtensions.includes(uploadFileExtension[1]) || !mimeTypes.includes(uploadFileMimeType)) {
            return {
                error: "Please check the filename and extension. Allowed types: png, jpeg, jpg"
            }
        }
       
        if((avatar.size / (1024 * 1024)) > maxSize) {
            return {
                error: "File too large"
            }
        }

        return {msg:"Valid File"}
}
module.exports = {
    isValidEmail,
    isValidPassword,
    isValidPhone,
    isValidDate,
    isValidFile
}