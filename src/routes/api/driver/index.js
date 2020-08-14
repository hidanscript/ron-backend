const { Router } = require('express');
const { auth } = require('../../auth');
const { getDriverById, setDriverWorking } = require('../../../services/driver/lib');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.png')
    }
});
const upload = multer({ storage });
const router = Router();

const passport = require('passport');

router.post('/', passport.authenticate('local-signup-driver'), (req, res) => {
    res.json({ success: true, driverid: req.session.passport.user.id });
});

router.get('/', auth, async (req, res) => {
    const driver = await getDriverById(req.session.passport.user.id);
    res.json(driver);
});

router.post('/dni-front', upload.single('dnifront'), (req, res) => {
    const file = req.file;
    res.json({ filename: file.filename, success: true });
});

router.post('/green-blue-front', upload.single('greenbluefront'), (req, res) => {
    const file = req.file;
    res.json({ filename: file.filename, success: true });
});

router.post('/green-blue-back', upload.single('greenblueback'), (req, res) => {
    const file = req.file;
    res.json({ filename: file.filename, success: true });
});

router.post('/dni-back', upload.single('dniback'), (req, res) => {
    const file = req.file;
    res.json({ filename: file.filename, success: true });
});

router.post('/license', upload.single('license'), (req, res) => {
    const file = req.file;
    res.json({ filename: file.filename, success: true });
});

router.post('/login', passport.authenticate('local-login-driver'), (req, res) => {
    res.json({ success: true , userid: req.session.passport.user.id });
});

router.post('/working', auth, async (req, res) => {
    const { latitude, longitude, stop } = req.body;
    const driver = await getDriverById(req.session.passport.user.id);
    setDriverWorking(driver[0].DriverID, latitude, longitude, stop);
    res.json(driver);
});

router.get('/logout', auth, async (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

module.exports = router;