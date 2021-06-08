const express = require('express');
const router = express.Router();
const Deposit = require('./../controllers/deposit/deposit');
const verifyToken = require('../controllers/verify-user')


// verify deposit
router.get('/verify/:reference/:userId', Deposit.verifyPaystack);

// get deposit balance
router.get('/balance/:userId', verifyToken, Deposit.getBalance);

// get deposits
router.get('/:userId', verifyToken, Deposit.getDeposits);

module.exports = router;