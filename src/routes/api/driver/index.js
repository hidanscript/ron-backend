const { Router } = require('express');
const { auth } = require('../../auth');
const { getDriverById, setDriverWorking } = require('../../../services/driver/lib');
const multer = require('multer');
const upload = multer({ dest: '../../../uploads/' });
const router = Router();

const passport = require('passport');

router.post('/', passport.authenticate('local-signup-driver'), (req, res) => {
    res.json({ success: true, driverid: req.session.passport.user.id });
});

router.get('/', auth, async (req, res) => {
    const driver = await getDriverById(req.session.passport.user.id);
    res.json(driver);
});

router.post('/login', passport.authenticate('local-login-driver'), (req, res) => {
    res.json({ success: true , userid: req.session.passport.user });
});

router.get('/working', auth, async (req, res) => {
    const driver = await getDriverById(req.session.passport.user.id);
    setDriverWorking(driver.DriverID);
    res.json(driver);
});

router.get('/logout', auth, async (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

module.exports = router;