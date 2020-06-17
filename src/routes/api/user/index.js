const { Router } = require('express');
const { authUser } = require('../../auth');
const { getUserById } = require('../../../services/user/lib');
const router = Router();

const passport = require('passport');

router.post('/', passport.authenticate('local-signup'), (req, res) => {
    res.json({ success: true });
});

router.get('/', authUser, async (req, res) => {
    const user = await getUserById(req.session.passport.user);
    console.log(user);
    res.json(user);
});

module.exports = router;