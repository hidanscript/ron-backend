const { isNumber, isString } = require("../../../lib/validation");
const db = require("../../../lib/db_connection");
const auth = require("../../../lib/auth");

const createDriver = async (driverData, username, password) => {
  const encryptedPassword = await auth.encryptPassword(password);

  const newDriver = {
    email: username,
    name: driverData.name,
    dni: driverData.dni,
    currentLocationLatitude: driverData.currentLocationLatitude,
    currentLocationLongitude: driverData.currentLocationLongitude,
    cellphone: driverData.cellphone,
    password: encryptedPassword,
  };

  const result = await db.query("INSERT INTO Driver SET ?", newDriver);
  newDriver.id = result.insertId;
  newDriver.type = "driver";
  return newDriver;
};

const validateDriver = (driverData) => {
  const { name, dni, cellphone } = driverData;
  return (
    isString(name) &&
    isNumber(dni) &&
    isNumber(cellphone)
  );
};

const getDriverById = async (driverid) => {
  const user = await db.query(
    "SELECT * FROM Driver WHERE DriverID = ?",
    driverid
  );
  return user;
};

const updateDriverPosition = async (driverid, latitude, longitude) => {
  try {
    const driver = await db.query(
      "UPDATE Driver SET CurrentLocationLatitude = ?, CurrentLocationLongitude = ? WHERE DriverID = ?",
      [latitude, longitude, driverid]
    );
    return driver;
  } catch (error) {
    return false;
  }
};

const getDriversWorkingAvailable = async() => {
  try {
    const driverList = await db.query("CALL GetWorkingDriversAvailable_sp()");
    return driverList.length ? driverList : false;
  } catch {
    return false;
  }
}

const getDriverByEmail = async email => {
  try {
    const driver = await db.query("SELECT * FROM Driver WHERE DriverID = ?", driverid);
    return driver.length ? driver[0] : false;
  } catch {
    return false;
  }
}

const getDriverTripInfo = async driverid => {
  try {
    const tripÌnfo = await db.query("CALL DriverTripInfo_Cons_sp(?)", driverid);
    return tripÌnfo.length ? tripInfo[0] : false;
  } catch {
    return false;
  }
}

const setDriverOnATrip = async (driverid, tripidprovided) => {
  try {
    await db.query("CALL SetDriverOnATrip_sp(?, ?)", [driverid, tripidprovided]);
    return true;
  } catch(error) {
    return false;
  }
}

module.exports = {
  createDriver,
  validateDriver,
  getDriverById,
  updateDriverPosition,
  getDriversWorkingAvailable,
  getDriverByEmail,
  getDriverTripInfo,
  setDriverOnATrip
};
