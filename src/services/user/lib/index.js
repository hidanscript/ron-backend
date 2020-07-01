const { isString } = require('../../../lib/validation');
const db = require('../../../lib/db_connection');
const auth = require('../../../lib/auth');

const createUser = async (username, password, userData) => {
    const encryptedPassword = await auth.encryptPassword(password);

    const newUser = {
        email: username,
        name: userData.name,
        password: encryptedPassword,
    }

    const result = await db.query("INSERT INTO User SET ?", newUser);
    newUser.id = result.insertId;
    return newUser;
}

const validateUser = (username, password, userData) => {
    const { name } = userData;
    return !!(
        isString(username) &&
        isString(password) && 
        isString(name)
    );
}

const getUserById = async userid => {
    const user = await db.query("SELECT Name, Email, Trips FROM User WHERE UserID = ?", userid);
    return user;
}

const getUserByEmail = async email => {
    const user = await db.query("SELECT Name, Email, Password, Trips FROM User WHERE Email = ?", email);
    return user.length ? user[0] : false;
}

module.exports = {
    createUser,
    validateUser,
    getUserById,
    getUserByEmail
}