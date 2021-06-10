const express = require('express');
const router = express.Router();
const Notification = require('./../controllers/notification');
const verifyToken = require('../controllers/verify-user');

// create notifcations
//router.post('/', verifyToken, Notification.create);
// get user notifcations
router.get('/:userId', verifyToken, Notification.fetch);
// mark notification as reas
router.get('/mark-as-read/:id', verifyToken, Notification.markAsRead);
// delete notifcations
router.delete('/:id', verifyToken, Notification.deleteNotification);

module.exports = router;