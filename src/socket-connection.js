const {
  updateDriverPosition,
  getDriversWorkingAvailable,
  getDriverTripInfo,
  setDriverOnATrip,
  getDriverById,
} = require("./services/driver/lib");
const {
  getTripInQueueByUser,
  cancelTrip,
  completeTrip,
} = require("./services/trips/lib");
const { getDistance } = require("./lib/functions");
const User = require("./models/user");

let connectedUsers = {};
let connectedDrivers = {};

function init(server) {
  const io = require("socket.io")(server);
  io.on("connection", (socket) => {
    socket.on("USER_CONNECTED", (user) => {
      user.socketid = socket.id;
      user.socket = socket;
      connectedUsers = addConnection(connectedUsers, user);
      socket.user = user;
      console.log(connectedUsers);
    });

    socket.on("DRIVER_CONNECTED", (driver) => {
      driver.socketid = socket.id;
      driver.socket = socket;
      connectedDrivers = addConnection(connectedDrivers, driver);
      socket.driver = driver;
      console.log(connectedDrivers);
    });

    socket.on("UPDATE_DRIVER_POSITION", async (locationData) => {
      const { driverid, latitude, longitude } = locationData;
      updateDriverPosition(driverid, latitude, longitude);
      const driverConnection = connectedDrivers[driverid];
      const driverCurrentTripInfo = await getDriverTripInfo(driverid);
      try {
        if (driverCurrentTripInfo) {
          //If the driver is on a trip, send the data also to the user.
          if (isConnected(connectedUsers, driverCurrentTripInfo.UserID)) {
            //If the user is in connected users
            const userConnection = connectedUsers[driverCurrentTripInfo.UserID];
            const driverInfo = await getDriverById(driverid);
            io.to(userConnection.socketid).emit("DRIVER_POSITION_UPDATED", {
              latitude,
              longitude,
              driverid,
              nombre: driverInfo.Name,
              modeloAuto: driverInfo.ModeloAuto,
              matricula: driverInfo.Matricula,
            });
            const startLocationCoords = {
              latitude: driverCurrentTripInfo.StartLocationLatitude,
              longitude: driverCurrentTripInfo.StartLocationLongitude,
            };
            const finalLocationCoords = {
              latitude: driverCurrentTripInfo.FinalLocationLatitude,
              longitude: driverCurrentTripInfo.FinalLocationLongitude,
            };
            const distanceBetweenCurrentPosAndFinalPos = getDistance(
              { latitude, longitude },
              finalLocationCoords
            );
            if (distanceBetweenCurrentPosAndFinalPos <= 100) {
              // If the distance to final location is less than 100m
              const user = new User(driverCurrentTripInfo.UserID);
              const pointsDistance = getDistance(
                startLocationCoords,
                finalLocationCoords
              );
              user.config();
              user.addPoints(pointsDistance);
              io.to(userConnection.socketid).emit("TRIP_COMPLETED");
              io.to(driverConnection.socketid).emit("TRIP_COMPLETED");
              completeTrip(driverCurrentTripInfo.TripID, driverid);
            }
          }
        }
        io.to(driverConnection.socketid).emit("DRIVER_POSITION_UPDATED", {
          latitude,
          longitude,
          driverid,
        });
      } catch (err) {}
    });

    socket.on("TRIP_IN_QUEUE", async (userid) => {
      const tripData = await getTripInQueueByUser(userid); //Gets the trip data
      const trip = tripData[0];
      if (trip) {
        if (!Object.keys(connectedDrivers).length) {
          notifyUserNotDriverAvailable(trip.UserID);
          cancelTrip(trip.TripID);
          return;
        }
        const startPosition = {
          latitude: trip.StartLocationLatitude,
          longitude: trip.StartLocationLongitude,
        };
        const driversWorking = await getDriversWorkingAvailable(); //Gets drivers data that are not in a trip and are available
        const nearDriversWorking = driversWorking.filter((driver) => {
          const driverPosition = {
            latitude: driver.CurrentLocationLatitude,
            longitude: driver.CurrentLocationLongitude,
          };
          return getDistance(startPosition, driverPosition) < 800000000;
        }); //filters the drivers that are at max 8km away from the start position
        console.log("Drivers working", nearDriversWorking);
        console.log("near drivers working", nearDriversWorking);
        notifyDriversAboutNewTrip(nearDriversWorking, trip); // Here is the magic.
      }
    });

    socket.on("TRIP_ACCEPTED", (tripdata) => {
      if (isConnected(connectedUsers, tripdata.userid)) {
        const userConnection = connectedUsers[tripdata.userid];
        io.to(userConnection.socketid).emit("DRIVER_FOUND", tripdata);
      }
    });

    socket.on("disconnect", () => {
      if (socket.user) {
        console.log("User disconnected");
        connectedUsers = removeConnection(connectedUsers, socket.user.userId);
      }
      if (socket.driver) {
        console.log("Driver disconnected");
        connectedDrivers = removeConnection(
          connectedDrivers,
          socket.driver.driverid
        );
      }
    });

    function notifyUserNotDriverAvailable(userid) {
      const userConnection = connectedUsers[userid];
      io.to(userConnection.socketid).emit("NOT_DRIVERS_AVAILABLE");
    }

    function notifyDriversAboutNewTrip(
      driverlist = [],
      trip,
      exceptionIDs = []
    ) {
      let currentDriver;
      let newDriverList = [];
      if (driverlist.length) {
        if (exceptionIDs.length) {
          newDriverList = driverlist.filter((driver) =>
            filterDriversThatAlreadyRefused(driver, exceptionIDs)
          );
        } else {
          newDriverList = driverlist;
        }
        if (newDriverList.length) {
          currentDriver = newDriverList[0];
        } else {
          notifyUserNotDriverAvailable(trip.UserID);
          cancelTrip(trip.TripID);
          return;
        }
      } else {
        notifyUserNotDriverAvailable(trip.UserID);
        cancelTrip(trip.TripID);
        return;
      }

      if (isConnected(connectedDrivers, currentDriver.DriverID)) {
        const driverConnection = connectedDrivers[currentDriver.DriverID];
        driverConnection.socket.emit("NEW_TRIP", trip, (tripAccepted) => {
          if (tripAccepted) {
            setDriverOnATrip(currentDriver.DriverID, trip.TripID);
            const userConnection = connectedUsers[trip.UserID];
            const tripAppData = {
              id: trip.TripID,
              startStreetName: trip.StartStreetName,
              finalStreetName: trip.FinalStreetName,
              startLocation: {
                latitude: trip.StartLocationLatitude,
                longitude: trip.FinalLocationLongitude,
              },
              finalLocation: {
                latitude: trip.FinalLocationLatitude,
                longitude: trip.FinalLocationLongitude,
              },
            };
            const tripFinalData = {
              trip: tripAppData,
              driver: {
                driverid: currentDriver.DriverID,
                latitude: currentDriver.CurrentLocationLatitude,
                longitude: currentDriver.CurrentLocationLongitude,
                nombre: currentDriver.Name,
                modeloAuto: currentDriver.ModeloAuto,
                matricula: currentDriver.Matricula,
              },
            };
            io.to(userConnection.socketid).emit("DRIVER_FOUND", tripFinalData);
            return;
          } else {
            exceptionIDs.push(currentDriver.DriverID);
            notifyDriversAboutNewTrip(newDriverList, trip, exceptionIDs);
          }
        });
      } else {
        exceptionIDs.push(currentDriver.DriverID);
        notifyDriversAboutNewTrip(newDriverList, trip, exceptionIDs);
      }
    }
  });
}

function filterDriversThatAlreadyRefused(driver, exceptionIDs) {
  for (let i = 0; i < exceptionIDs.length; i++) {
    if (driver.DriverID === exceptionIDs[i]) return false;
  }
  return true;
}

function addConnection(connectionList, connectionData) {
  let newConnectionList = Object.assign({}, connectionList);
  if ("userId" in connectionData) {
    newConnectionList[connectionData.userId] = connectionData;
  } else if ("driverid" in connectionData) {
    newConnectionList[connectionData.driverid] = connectionData;
  }
  return newConnectionList;
}

function removeConnection(connectionList, connectionId) {
  let newConnectionList = Object.assign({}, connectionList);
  delete newConnectionList[connectionId];
  return newConnectionList;
}

function isConnected(connectionList, connectionId) {
  return connectionId in connectionList;
}

module.exports = init;
