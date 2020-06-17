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

    const result = await db.query("INSERT INTO Rider SET ?", newUser);
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
    const user = await db.query("SELECT * FROM Rider WHERE RiderID = ?", userid);
    return user;
}

module.exports = {
    createUser,
    validateUser,
    getUserById
}