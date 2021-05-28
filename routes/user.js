const express = require('express');
const router = express.Router();
const User = require('./../controllers/user');
const verifyToken = require('../controllers/verify-user')


// get user
router.get('/', verifyToken, User.getUser);
// get users
router.get('/all', verifyToken, User.getUsers);

// update user
router.put('/', verifyToken, User.updateUser);
// update user bank
router.put('/bank', verifyToken, User.updateUserBank);
// delete user
router.delete('/:userId', verifyToken, User.deleteUser);

module.exports = router;