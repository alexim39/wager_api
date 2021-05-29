const express = require('express');
const router = express.Router();
const Withdraw = require('./../controllers/withdraw/withdraw');
const verifyToken = require('../controllers/verify-user');

// create withdraw
router.post('/', verifyToken, Withdraw.create);
// get withdraws
router.get('/request/:userId', verifyToken, Withdraw.getAllRequest);
// cancel withdraw
router.get('/cancel/:withrawId', verifyToken, Withdraw.cancel);

module.exports = router;