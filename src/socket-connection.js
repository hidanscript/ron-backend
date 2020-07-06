const { 
    updateDriverPosition, 
    getDriversWorkingAvailable, 
    getDriverTripInfo, 
    setDriverOnATrip 
} = require('./services/driver/lib');
const { getTripInQueueByUser } = require('./services/trips/lib');
const { getDistance } = require('./lib/functions');
const { connect } = require('./middlewares');

const BreakException = {};
let connectedUsers = {};
let connectedDrivers = {};

function init(server) {
    const io = require('socket.io')(server);

    io.on("connection", (socket) => {

        socket.on('USER_CONNECTED', (user) => {
            user.socketid = socket.id;
            connectedUsers = addConnection(connectedUsers, user);
            socket.user = user;
            console.log(connectedUsers)
        });

        socket.on('DRIVER_CONNECTED', driver => {
            driver.socketid = socket.id;
            connectedDrivers = addConnection(connectedDrivers, driver);
            socket.driver = driver;
            console.log(connectedDrivers)
        });

        socket.on("UPDATE_DRIVER_POSITION", async locationData => {
            const { driverid, latitude, longitude } = locationData;
            const newDriverPosition = await updateDriverPosition(driverid, latitude, longitude);
            const driverConnection = connectedDrivers[driverid];
            const driverCurrentTripInfo = await getDriverTripInfo(driverid);
            if(driverCurrentTripInfo) { //If the driver is on a trip, send the data also to the user.
                if(isConnected(connectedUsers, driverCurrentTripInfo.UserID)) { //If the user is in connected users
                    const userConnection = connectedUsers[driverCurrentTripInfo.UserID];
                    io.to(userConnection.socketid).emit("DRIVER_POSITION_UPDATED", newDriverPosition);
                }
            }
            io.to(driverConnection.socketid).emit("DRIVER_POSITION_UPDATED", newDriverPosition);
        });

        socket.on("TRIP_IN_QUEUE", async (userid) => {
            const tripData = await getTripInQueueByUser(userid); //Gets the trip data
            const trip = tripData[0];
            if(!Object.keys(connectedDrivers).length) {
                const userConnection = connectedUsers[trip.UserID];
                io.to(userConnection.socketid).emit("NOT_DRIVERS_AVAILABLE");
            };
            const startPosition = { latitude: trip.StartLocationLatitude, longitude: trip.StartLocationLongitude };
            const driversWorking = await getDriversWorkingAvailable(); //Gets drivers data that are not in a trip and are available
            const nearDriversWorking = driversWorking.filter(driver => {
                const driverPosition = { latitude: driver.CurrentLocationLatitude, longitude: driver.CurrentLocationLongitude };
                return getDistance(startPosition, driverPosition) < 8000;
            }); //filters the drivers that are at max 8km away from the start position
            try {
                nearDriversWorking.forEach(async driver => {
                    if(isConnected(connectedDrivers, driver.driverid)) {
                        const driverConnection = connectedDrivers[driver.DriverID];
                        io.to(driverConnection.socketid).emit("NEW_TRIP", trip, tripAccepted => {
                            if(tripAccepted) {
                                if(setDriverOnATrip(driver.driverid, trip.TripID)) {
                                    const userConnection = connectedUsers[trip.UserID];
                                    io.to(userConnection.socketid).emit("DRIVER_FOUND", trip, driver.driverid);
                                    throw BreakException;
                                }
                            }
                        });
                    }
                });
            } catch(error) {
                if (e !== BreakException) throw e;
            }
            
        });

        socket.on("TRIP_ACCEPTED", tripdata => {
            if(isConnected(connectedUsers, tripdata.userid)) {
                const userConnection = connectedUsers[tripdata.userid];
                io.to(userConnection.socketid).emit("driver found", tripdata);
            }
        });

        socket.on('disconnect', () => {
            if(socket.user) {
                connectedUsers = removeConnection(connectedUsers, socket.user.userId);
            }
            if(socket.driver) {
                connectedDrivers = removeConnection(connectedDrivers, socket.driver.driverid);
            }
         });
        
    });

   
}

function addConnection(connectionList, connectionData) {
    let newConnectionList = Object.assign({}, connectionList);
    if("userId" in connectionData) {
        newConnectionList[connectionData.userId] = connectionData;
    }
    if("driverid" in connectionData) {
        newConnectionList[connectionData.driverid] = connectionData;
    }
    return newConnectionList;
}

function removeConnection(connectionList, connectionId){
	let newConnectionList = Object.assign({}, connectionList);
	delete newConnectionList[connectionId];
	return newConnectionList;
}

function isConnected(connectionList, connectionId){
    return connectionId in connectionList
}

module.exports = init;
