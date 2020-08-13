const { Router } = require('express');
const multer = require('multer');
const db = require('../../../lib/db_connection');
const nodemailer = require('nodemailer');
const auth = require('../../../lib/auth');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.png')
    }
});

let smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "ronwebsiteapp@gmail.com",
        pass: "manzana22Ok"
    }
});

let mailOptions;

const router = Router();

router.get('/get-pending-drivers', async (req, res) => {
    const driverList = await db.query('SELECT * FROM Driver WHERE DriverApproved = 0 and Deleted = 0');
    res.json([ ...driverList ]);
});

router.post('/delete-driver', async (req, res) => {
    const { id } = req.body;
    const result = await db.query('UPDATE Driver SET Deleted = 1 WHERE DriverID = ?', [id]);
    res.json({ result, success: true });
});

router.post('/recover-password', async (req, res) => {
    const { email } = req.body;
    const query = await db.query('SELECT * FROM User WHERE Email = ?', email);
    const user = query[0];
    if(user) {
        const newPassword = 'XlbMy1';
        const encryptedPassword = auth.encryptPassword(newPassword);
        await db.query('UPDATE User SET Password = ? WHERE Email = ?', [ encryptedPassword, email ]);

        mailOptions = {
            to : email,
            subject : "Recuperación de contraseña",
            html : '<h1 style="text-align:center;"><b>Contraseña recuperada</b></h1><br><h2 style="text-align:center;">Su nueva contraseña es: ' + newPassword + '</h2>'
        }
    
        smtpTransport.sendMail(mailOptions, function(error, response){ });
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

router.post('/approve-driver', async (req, res) => {
    const { id } = req.body;
    const result = await db.query('UPDATE Driver SET DriverApproved = 1 WHERE DriverID = ?', [id]);
    res.json({ result, success: true });
});

module.exports = router;