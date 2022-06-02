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
module.exports = {
    isValidEmail,
    isValidPassword,
    isValidPhone,
    isValidDate
}