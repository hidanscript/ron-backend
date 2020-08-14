const { isString } = require('../../../lib/validation');
const db = require('../../../lib/db_connection');
const auth = require('../../../lib/auth');

const createUser = async (username, password, userData) => {
    const encryptedPassword = auth.encryptPassword(password);
    const newUser = {
        email: username,
        name: userData.name,
        password: encryptedPassword,
        cellphone: parseInt(userData.cellphone),
        dni: parseInt(userData.dni),
        country: userData.selectedCountry
    }
    
    try {
        const result = await db.query("INSERT INTO User SET ?", newUser);
        newUser.id = result.insertId;
        newUser.type = "user";
        return newUser;
    } catch(error) {
        return false;
    }
    
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
    const user = await db.query("SELECT UserID, Name, Email, Points, Trips FROM User WHERE UserID = ?", userid);
    return user[0];
}

const getUserByEmail = async email => {
    const user = await db.query("SELECT UserID, Name, Email, Points, Password, Trips FROM User WHERE Email = ?", email);
    return user.length ? user[0] : false;
}

const getTripByUserID = async userid => {
    const trip = await db.query("CALL GetUncompletedTripByUserID_Cons_sp(?)", userid);
    return trip.length ? trip[0] : false;
}

module.exports = {
    createUser,
    validateUser,
    getUserById,
    getUserByEmail,
    getTripByUserID
}