const express = require('express');
const router = express.Router();
const Deposit = require('./../controllers/deposit/deposit');
const verifyToken = require('../controllers/verify-user')


// save deposit
router.post('/card', verifyToken, Deposit.card);

// save deposit
router.get('/balance/:userId', verifyToken, Deposit.getBalance);
module.exports = router;