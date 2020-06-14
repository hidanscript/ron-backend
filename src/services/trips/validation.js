const db = require('../../lib/db_connection');
const { isArrayEmpty, isNumber, isString } = require('../../lib/validation');

const userIsOnATrip = async userid => {
    if(!isNumber(userid)) return;

    try {
        const userIsOnATrip = await db.query("SELECT TOP 1 * FROM TripsInProcess WHERE userid = ?" , [ userid ]);
        return !!(userIsOnATrip);
    } catch(e) {
        return e;
    }
}

const userIsInQueue = async userid => {
    if(!isNumber(userid)) return;

    try {
        const userIsInQueue = await db.query("CALL UserTripsInQueue_Cons_sp(?)" , [ userid ]);
        return !!(userIsInQueue);
    } catch(e) {
        return e;
    }   
}

const userCanCreateAtrip = async userid => {
    return !!(!userIsInQueue(userid) && !userIsOnATrip(userid));
}

const validateTripData = tripData => {
    const { startLocation, finalLocation, userid } = tripData;
    return !!(isString(startLocation) && isString(finalLocation) && isNumber(userid));
}

module.exports = {
    userIsInQueue,
    userIsOnATrip,
    userCanCreateAtrip,
    validateTripData
}