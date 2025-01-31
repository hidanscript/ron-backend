const { Router } = require("express");
const { validateTripData } = require("../../../services/trips/validation");
const { createTrip } = require("../../../services/trips/lib");
const { getDistance, getDistanceString, calculateTotalCost } = require("../../../lib/functions");
const { auth } = require("../../auth");
const router = Router();
const db = require('../../../lib/db_connection');

router.post("/", auth, async (req, res) => {
  const userid = req.session.passport.user.id;
  const tripData = { ...req.body };
  const { startLocation, finalLocation } = req.body;
  const distance = getDistance(startLocation, finalLocation);
  const price = calculateTotalCost(distance);

  try {
    const newTrip = await createTrip(userid, tripData, distance, price);
    res.status(200);
    res.json({ trip: newTrip, success: true });
  } catch (error) {
    res.status(500);
    console.log(error)
    res.json({ success: false, error: true, message: error });
  }
});

router.post('/data', async(req, res) => {
  try {
    const { startLocation, finalLocation, couponCode } = req.body;
    const distance = getDistance(startLocation, finalLocation);
    const distanceString = getDistanceString(startLocation, finalLocation);
    let price = calculateTotalCost(distance);

    if(couponCode) {
      const result = await db.query('SELECT * FROM Coupons WHERE Code = ?', couponCode);
      const coupon = result[0];

      if(coupon) price = coupon.QuantityAvailable ? price = price * coupon.Discount : price;     
      console.log(coupon);
    }    

    res.status(200);
    res.json({ success: true, distance: distanceString, price : `${price} $ARS` });
  } catch(error) {
    console.log(error);
    res.status(500);
    res.json({ success: false, message: error });
  }
});

module.exports = router;
