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
    dniFrontImageUrl: driverData.dniFrontImage,
    dniBackImageUrl: driverData.dniBackImage,
    licenseUrl: driverData.licenseUrl,
    cellphone: parseInt(driverData.cellphone),
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
    isString(name)
  );
};

const getDriverById = async (driverid) => {
  const user = await db.query("CALL GetDriverById_sp(?)", driverid);
  return user[0];
};

const updateDriverPosition = async (driverid, latitude, longitude) => {
  try {
    console.log('latitude', latitude);
    console.log('longitude', longitude);
    await db.query(
      "UPDATE Driver SET CurrentLocationLatitude = ?, CurrentLocationLongitude = ? WHERE DriverID = ?",
      [latitude, longitude, driverid]
    );
    return { driverid, latitude, longitude };
  } catch (error) {
    return false;
  }
};

const getDriversWorkingAvailable = async() => {
  try {
    const driverList = await db.query("CALL GetWorkingDriversAvailable_sp()");
    return driverList.length ? driverList[0] : false;
  } catch (e) { 
    return false;
  }
}

const getDriverByEmail = async email => {
  try {
    const driver = await db.query("SELECT * FROM Driver WHERE DriverID = ?", driverid);
    return driver.length ? driver[0] : false;
  } catch(error) {
    return false;
  }
}

const getDriverTripInfo = async driverid => {
  try {
    const tripÌnfo = await db.query("CALL DriverTripInfo_Cons_sp(?)", driverid);
    return tripÌnfo.length ? tripInfo[0] : false;
  } catch(error) {
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

const setDriverWorking = async (driverid, latitude, longitude, stop) => {
  try {
    if(stop) {
      await db.query("CALL StopDriverWorking_sp(?)", [driverid] );
    } else {
      await db.query("CALL SetDriverWorking_sp(?,?,?)", [driverid, latitude, longitude] );
    }
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
  setDriverOnATrip,
  setDriverWorking
};
