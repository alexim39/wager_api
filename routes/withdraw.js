const express = require('express');
const router = express.Router();
const Withdraw = require('./../controllers/withdraw/withdraw');
const verifyToken = require('../controllers/verify-user');

// create withdraw
router.post('/', verifyToken, Withdraw.create);

module.exports = router;