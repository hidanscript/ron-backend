const { Router } = require('express');
const router = Router();

router.use('/user', require('./user'));
router.use('/driver', require('./driver'));
router.use('/trip', require('./trip'));

module.exports = router;