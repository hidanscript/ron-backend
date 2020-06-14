const db = require('../../../lib/db_connection');

const createTrip = async (tripData, distance, price) => {
    const { userid, country, startLocation, finalLocation } = tripData;
    const newTrip = await db.query(
        "CALL Trip_Alta_sp(?, ?, ?, ?, ?, ?)", 
        [ userid, country, startLocation, finalLocation, distance, price ]
    );
    
    return newTrip;
};

module.exports = {
    createTrip
};