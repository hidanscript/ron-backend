const { updateDriverPosition, getDriversWorkingAvailable } = require('./services/driver/lib');
const { getTripInQueueByUser } = require('./services/trips/lib');
const { getDistance } = require('./lib/functions');

function init(server) {
    const io = require('socket.io')(server);

    io.on("connection", (socket) => {

        socket.on("join driver room", driverid => {
            socket.join('room ' + driverid);
        });

        socket.on("join user room", userid => {
            socket.join('room user ' + userid);
        });

        socket.on("update driver position", async locationData => {
            const { driverid, latitude, longitude } = locationData;
            const newDriverPosition = await updateDriverPosition(driverid, latitude, longitude);
            io.sockets.on('room ' + driverid).emit("driver position updated", newDriverPosition);
        });

        socket.on("trip in queue", async (userid) => {
            const trip = await getTripInQueueByUser(userid); //Gets the trip data
            const startPosition = { latitude: trip.StartLocationLatitude, longitude: trip.StartLocationLongitude };
            const driversWorking = await getDriversWorkingAvailable(); //Gets drivers data that are not in a trip and are available
            const nearDriversWorking = driversWorking.filter(driver => {
                const driverPosition = { latitude: driver.CurrentLocationLatitude, longitude: driver.CurrentLocationLongitude };
                return getDistance(startPosition, driverPosition) < 8000;
            }); //filters the drivers that are at max 8km away from the start position
            nearDriversWorking.forEach(driver => {
                io.sockets.on('room ' + driver.DriverID).emit("new trip", trip);
            });
        });

        socket.on("trip accepted", tripdata => {
            io.sockets.on('room user ' + tripdata.UserID).emit("driver found", tripdata);
        });
        
    });
}

module.exports = init;
