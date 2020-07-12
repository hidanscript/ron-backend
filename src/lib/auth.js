const bcrypt = require('bcrypt-nodejs');

const encryptPassword = password => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    console.log(hash);
    return hash;
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