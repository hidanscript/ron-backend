const { Router } = require("express");
const { validateTripData } = require("../../../services/trips/validation");
const { createTrip } = require("../../../services/trips/lib");
const { getDistance, calculateTotalCost } = require("../../../lib/functions");
const { auth } = require("../../auth");
const router = Router();

router.post("/", auth, async (req, res) => {
  const userid = req.session.passport.user;
  const tripData = { ...req.body };
  const { startLocation, finalLocation } = req.body;
  const distance = getDistance(startLocation, finalLocation);
  const price = calculateTotalCost(distance);

  try {
    const newTrip = await createTrip(userid, tripData, distance, price);
    res.status(200);
    res.json(newTrip);
  } catch (error) {
    res.status(500);
    res.json({ error: true, message: error });
  }
});

module.exports = router;
