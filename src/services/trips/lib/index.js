const db = require("../../../lib/db_connection");

const createTrip = async (userid, tripData, distance, price) => {
  const { country, startLocation, finalLocation, startStreetName, finalStreetName } = tripData;
  const newTrip = await db.query("CALL Trip_Alta_sp(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
    userid,
    country,
    startLocation.latitude,
    startLocation.longitude,
    finalLocation.latitude,
    finalLocation.longitude,
    distance,
    price,
    startStreetName,
    finalStreetName
  ]);

  return newTrip;
};

const getTripInQueueByUser = async userid => {
  try {
    const trip = await db.query("CALL GetTripInQueueByUserID_sp(?)", userid);
    return trip.length ? trip[0] : false;
  } catch(err) {
    return false;
  }
}

const completeTrip = async (tripid, driverid) => {
  try {
    await db.query("CALL CompleteTrip_sp(?, ?)", [tripid, driverid]);
    return true;
  } catch(error) {
    return false;
  }
}

const cancelTrip = async tripid => {
  try {
    await db.query("CALL Trip_Baja_sp(?)", tripid);
    console.log("TRIP CANCELED");
  } catch(err) { }
}

module.exports = {
  createTrip,
  getTripInQueueByUser,
  cancelTrip,
  completeTrip
};
