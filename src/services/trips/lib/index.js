const db = require("../../../lib/db_connection");

const createTrip = async (userid, tripData, distance, price) => {
  const { country, startLocation, finalLocation } = tripData;
  const newTrip = await db.query("CALL Trip_Alta_sp(?, ?, ?, ?, ?, ?, ?, ?)", [
    userid,
    country,
    startLocation.latitude,
    startLocation.longitude,
    finalLocation.latitude,
    finalLocation.longitude,
    distance,
    price,
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

module.exports = {
  createTrip,
  getTripInQueueByUser
};
