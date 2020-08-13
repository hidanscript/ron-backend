const { Router } = require('express');
const router = Router();
const { getDistanceString } = require('../../lib/functions');

router.use('/user', require('./user'));
router.use('/driver', require('./driver'));
router.use('/trip', require('./trip'));
router.use('/data', require('./data'));

router.get('/test', async (req, res) => {
    const pos1 = { latitude: 35.4214124, longitude: 35.222121 };
    const pos2 = { latitude: 35.4224124, longitude: 35.223121 };
    const distance = getDistanceString(pos1, pos2);
    res.json({ distance: distance});
});

module.exports = router;