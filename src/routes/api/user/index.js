const { Router } = require('express');
const { auth } = require('../../auth');
const { getUserById } = require('../../../services/user/lib');
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
        html : "<h1><b>¡Bienvenido a RON!</b></h1><br><h2>¡Muchas gracias por registrarse!<br>¡Se le será notificado por este medio cuando la app esté disponible en su país!</h2>" 
    }

    smtpTransport.sendMail(mailOptions, function(error, response){ });
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