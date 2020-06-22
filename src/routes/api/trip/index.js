const { Router } = require('express');
const { validateTripData } = require('../../../services/trips/validation');
const { createTrip } = require('../../../services/trips/lib');
const { getDistance, calculateTotalCost } = require('../../../lib/functions');
const router = Router();

router.post('/', async (req, res) => {
    const tripData = { ...req.body };
    const { startPosition, finalPosition } = req.body;
    const distance = getDistance(startPosition, finalPosition);
    const price = calculateTotalCost(distance);

    if(validateTripData(tripData)) {
        try {
            const newTrip = await createTrip(tripData, distance, price);
            res.status(200);
            res.json(newTrip);
        } catch(error) {
            res.status(500);
            res.json({ error: true, message: error });
        }
    } else {
        res.status(500);
        res.json({ error: true , message: 'Data is invalid' });
    }

});

module.exports = router;