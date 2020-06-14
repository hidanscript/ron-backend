const { Router } = require('express');
const router = Router();

const passport = require('passport');

router.post('/', passport.authenticate('local-signup-driver'), (req, res) => {
    res.json({ success: true });
});

module.exports = router;