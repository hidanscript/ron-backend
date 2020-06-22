const db = require("../../lib/db_connection");
const { isArrayEmpty, isNumber, isString } = require("../../lib/validation");

const userIsOnATrip = async (userid) => {
  if (!isNumber(userid)) return;
  try {
    const userIsOnATrip = await db.query("CALL UserIsOnATrip_Cons_sp( ? )", [
      userid,
    ]);
    return !!userIsOnATrip[1].fieldCount;
  } catch (e) {
    return e;
  }
};

const userIsInQueue = async (userid) => {
  if (!isNumber(userid)) return;

  try {
    const userIsInQueue = await db.query("CALL UserTripsInQueue_Cons_sp(?)", [
      userid,
    ]);
    return !!userIsInQueue[1].fieldCount;
  } catch (e) {
    return e;
  }
};

const userCanCreateAtrip = async (userid) => {
  try {
    const userQueue = await userIsInQueue(userid);
    const userTrip = await userIsOnATrip(userid);
    return !userQueue && !userTrip;
  } catch (error) {
    return false;
  }
};

const validateTripData = (tripData) => {
  const { startLocation, finalLocation, userid } = tripData;
  return !!(
    isString(startLocation) &&
    isString(finalLocation) &&
    isNumber(userid)
  );
};

module.exports = {
  userIsInQueue,
  userIsOnATrip,
  userCanCreateAtrip,
  validateTripData,
};
