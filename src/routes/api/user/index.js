const { Router } = require('express');
const { auth } = require('../../auth');
const { getUserById } = require('../../../services/user/lib');
const router = Router();

const passport = require('passport');

router.post('/', passport.authenticate('local-signup'), (req, res) => {
    res.json({ success: true, userid: req.session.passport.user });
});

router.get('/', auth, async (req, res) => {
    const user = await getUserById(req.session.passport.user);
    res.json({...user, userid: req.session.passport.user});
});

router.post('/login', passport.authenticate('local-login'), (req, res) => {
    res.json({ success: true , userid: req.session.passport.user });
});

router.get('/logout', auth, async (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

module.exports = router;