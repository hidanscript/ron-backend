const { Router } = require('express');
const { auth } = require('../../auth');
const { getUserById, getTripByUserID } = require('../../../services/user/lib');
const nodemailer = require('nodemailer');
const router = Router();

const passport = require('passport');

let smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "ronwebsiteapp@gmail.com",
        pass: "manzana22Ok"
    }
});
let rand,mailOptions,host,link;

router.post('/', passport.authenticate('local-signup'), (req, res) => {

    mailOptions={
        to : req.body.email,
        subject : "¡Bienvenido!",
        html : '<h1 style="text-align:center;"><b>¡Bienvenido a RON!</b></h1><br><h2 style="text-align:center;">¡Muchas gracias por registrarse!</h2>' 
    }

    smtpTransport.sendMail(mailOptions, function(error, response){ });
    res.json({ success: true, userid: req.session.passport.user.id });
});

router.get('/', auth, async (req, res) => {
    const user = await getUserById(req.session.passport.user.id);
    res.json({...user, userid: req.session.passport.user.id});
});

router.post('/login', passport.authenticate('local-login'), (req, res) => {
    res.json({ success: true , userid: req.session.passport.user.id });
});

router.get('/logout', auth, async (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

router.get('/trip', auth, async (req, res) => {
    const userid = req.session.passport.user.id;
    const tripData = await getTripByUserID(userid);
    if(tripData && tripData.length) {
        res.status(200);
        res.json({ success: true, trip: tripData });
    } else {
        res.json({ success: false });
    }
});

module.exports = router;