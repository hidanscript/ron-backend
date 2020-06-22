const convertToRadians = (x) => {
  return (x * Math.PI) / 180;
};

const getDistance = (startPosition, finalPosition) => {
  const EarthRadius = 6378137; // Earth’s mean radius in meters
  let dLat = convertToRadians(finalPosition.latitude - startPosition.latitude);
  let dLong = convertToRadians(
    finalPosition.longitude - startPosition.longitude
  );
  let a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(convertToRadians(startPosition.latitude)) *
      Math.cos(convertToRadians(finalPosition.latitude)) *
      Math.sin(dLong / 2) *
      Math.sin(dLong / 2);
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  let distance = Math.round(EarthRadius * c); // Distance in meters
  return distance;
};

const getDistanceString = (startPosition, finalPosition) => {
  const distance = getDistance(startPosition, finalPosition);
  return distance >= 1000
  ? `${Math.round((distance / 1000 + Number.EPSILON) * 100) / 100} km`
  : `${distance} m`;
}

const calculateDistanceCost = distance => {
  let distanceCost = 0;
  if(distance < 1000) {
    distanceCost = 0;
  } else {
    distanceCost = distance - 1000; // Discounts the first kilometer.
    distanceCost = distanceCost / 500; // How many 500 meters are in the remaining distance.
    distanceCost = distanceCost * 50; // Every 500 meters the cost increases 50$ARS.
    distanceCost = Math.round(distanceCost);
  }  
  return distanceCost;
}

const calculateTotalCost = distance => {
  const BASE_COST = 75;
  const DISTANCE_COST = calculateDistanceCost(distance);
  return BASE_COST + DISTANCE_COST;
}

module.exports = {
  getDistance,
  getDistanceString,
  calculateTotalCost
};
