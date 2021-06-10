const mongoose = require('mongoose');
const yup = require('yup');

// exports model
exports.NotificationModel = new mongoose.model('Notification', new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    /* userId: {
        type: String,
        required: true
    }, */
    title: {
        type: String,
        require: true
    },
    body: {
        type: String,
        require: true
    },
    source: {
        type: String,
        require: true
    },
    status: {
        type: String,
        default: 'unread'
    },
    createDate: {
        type: Date,
        require: true,
        default: Date.now
    }    
}));

// export validator
/* exports.NotificationValidator = (balObj) => {
    let schema = yup.object().shape({
        userId: yup.string().required('UserId is required'),
        balance: yup.number().required('Amount is require'),
        modifyDate: yup.date().required('Transaction date is required').default(() => {
            return new Date();
        })
    })

    return schema.validate(balObj).then(bal => bal).catch(error => {
        return {
            message: error.message
        }
    });
} */