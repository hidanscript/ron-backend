const bcrypt = require('bcrypt-nodejs');

const encryptPassword = password => {
    return bcrypt.hashSync(password);
}

const matchPassword = async (password, savedPassword) => {
    try {
        await bcrypt.compare(password, savedPassword);
    } catch(error) {
        console.log(error);
    }
}

module.exports = {
    encryptPassword,
    matchPassword
}