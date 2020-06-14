const { isNumber, isString } = require('../../../lib/validation');
const db = require('../../../lib/db_connection');
const auth = require('../../../lib/auth');

const createDriver = async (driverData, username, password) => {
    const encryptedPassword = await auth.encryptPassword(password);

    const newDriver = {
        email: username,
        name: driverData.name,
        dni: driverData.dni,
        currentLocation: driverData.currentLocation,
        cellphone: driverData.cellphone,
        password: encryptedPassword,
    }

    const result = await db.query("INSERT INTO Driver SET ?", newDriver);
    newDriver.id = result.insertId;
    return newDriver;
}

const validateDriver = driverData => {
    const { name, dni, cellphone, currentLocation } = driverData;
    return !!(
        isString(name) && 
        isNumber(dni) && 
        isString(cellphone) && 
        isString(currentLocation)
    );
}

module.exports = {
    createDriver,
    validateDriver
}