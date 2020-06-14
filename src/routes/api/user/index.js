const { Router } = require('express');
const router = Router();

const passport = require('passport');

router.post('/', passport.authenticate('local-signup'), (req, res) => {
    res.json({ success: true });
});

router.get('/', (req, res) => {
    console.log(req.session.passport);
    res.json({
        userid: req.session.passport.user
    });
});

module.exports = router;