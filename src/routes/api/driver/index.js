const { Router } = require('express');
const { auth } = require('../../auth');
const { getDriverById } = require('../../../services/driver/lib');
const router = Router();

const passport = require('passport');

router.post('/', passport.authenticate('local-signup-driver'), (req, res) => {
    res.json({ success: true });
});

router.get('/', auth, async (req, res) => {
    const driver = await getDriverById(req.session.passport.user);
    console.log(driver);
    res.json(driver);
});

module.exports = router;