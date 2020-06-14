const { Router } = require('express');
const { validateTripData } = require('../../../services/trips/validation');
const { createTrip } = require('../../../services/trips/lib');
const router = Router();

router.post('/', async (req, res) => {
    const tripData = { ...req.body };
    const price = 100;
    const distance = 50;

    if(validateTripData(tripData)) {
        const newTrip = await createTrip(tripData, distance, price);
        res.status(200);
        res.json(newTrip);
    } else {
        res.status(500);
        res.json({ error: true , message: 'Data is invalid' });
    }

});

module.exports = router;