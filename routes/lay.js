const express = require('express');
const router = express.Router();
const Lay = require('./../controllers/lay/lay');
const verifyToken = require('../controllers/verify-user');


// save coinout deposit
router.post('/coinout/deposit', verifyToken, Lay.coinout);
// save coinout withdrawable
//router.post('/coinout/withdrawable', verifyToken, Lay.coinout);
// save coinup deposit
router.post('/coinup/deposit', verifyToken, Lay.coinup);
// save coinup withdrawable
//router.post('/coinup/withdrawable', verifyToken, Lay.coinup);

// get lay transactions
router.get('/transactions/lay/:userId', verifyToken, Lay.getLays);

module.exports = router;