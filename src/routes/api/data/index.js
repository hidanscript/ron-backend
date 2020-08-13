const { Router } = require('express');
const multer = require('multer');
const db = require('../../../lib/db_connection');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.png')
    }
});

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

router.post('/approve-driver', async (req, res) => {
    const { id } = req.body;
    const result = await db.query('UPDATE Driver SET DriverApproved = 1 WHERE DriverID = ?', [id]);
    res.json({ result, success: true });
});

module.exports = router;