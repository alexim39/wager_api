const { NotificationModel } = require('./../models/notification');
const config = require('./../config/config');
const jwt = require('jsonwebtoken');


module.exports = class Notification {

    // get user notifications
    static async fetch(req, res) {
        try {
            jwt.verify(req.token, config.server.token);

            const notify = await NotificationModel.find({userId: req.params.userId});
            if (!notify) return res.status(404).json({ msg: `Notification not found`, code: 404 });
            return res.status(200).json({ msg: `Notification found `, code: 200, obj: notify });
            
        } catch (error) {
            return res.status(500).json({ msg: `Notification process failed`, code: 500 });
        }
    }

    // create notifications
    async create(notificationObj) {
        try {
            //jwt.verify(req.token, config.server.token);

            const notify = await new NotificationModel(notificationObj).save();

            //if (notify) return res.status(200).json({ msg: `Notification saved `, code: 200, obj: notify });
            if (notify) return true;
            //return res.status(404).json({ msg: `Notification was not saved`, code: 404 });  
            return false;         
        } catch (error) {
            console.log(error)
            //return res.status(500).json({ msg: `Notification creation process failed`, code: 500 });
        }
    }

    // mark notifications as read
    static async markAsRead(req, res) {
        try {
            jwt.verify(req.token, config.server.token);

            const updatedNotification = await NotificationModel.findByIdAndUpdate(req.params.id, {
                status: 'read'
            }, { new: true });

            if (updatedNotification) return res.status(200).json({ msg: `Notification is marked as read`, code: 200, obj: updatedNotification });
            return res.status(404).json({ msg: `This notification does not exist`, code: 404 });

        } catch (error) {
            return res.status(500).json({ msg: `Notification creation process failed`, code: 500 });
        }
    }

    // delete notification
    static async deleteNotification(req, res) {
        try {
            jwt.verify(req.token, config.server.token);

            const notify = await NotificationModel.findByIdAndDelete(req.params.id);
            if (notify) return res.status(200).json({ msg: `Notification deleted`, code: 200, obj: notify });
            return res.status(404).json({ msg: `Notification does not exist`, code: 404 });

        } catch (error) {
            return res.status(500).json({ msg: `Notification creation process failed`, code: 500 });
        }
    }

}