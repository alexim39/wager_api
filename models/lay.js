const mongoose = require('mongoose');
const yup = require('yup');

// exports model
exports.LayModel = new mongoose.model('Lay', new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true,
        trim: true
    },
    layedFrom: {
        type: String,
        required: true
    },
    period: {
        type: Number,
        required: true,
        trim: true
    },
    transactionId: { // Note: used as transaction id
        type: Number,
        required: true,
        unique: true
    },
    plan: {
        type: String,
        required: true
    },
    transactionStatus: {
        type: String,
        required: true
    },
    start: {
        type: Date,
        default: Date.now
    }
}));

// export validator
exports.LayValidator = (layObj) => {
    let schema = yup.object().shape({
        userId: yup.string().required('UserId is required'),
        amount: yup.number().required('Lay Amount is require').min(4, 'Amount is too small').max(6, 'Amount is too large'),
        layedFrom: yup.string().required('Source of lay is required'),
        period: yup.number().required('Lay period is requred'),
        transactionId: yup.number().required('Transaction ID is required'),
        plan: yup.string().required('Plan is required'),
        start: yup.date().required('Transaction date is required'),
        transactionStatus: yup.string().required('Transaction status not yet')
    })

    return schema.validate(layObj).then(lay => lay).catch(error => {
        return {
            message: error.message
        }
    });
}