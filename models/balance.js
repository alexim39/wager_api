/* const mongoose = require('mongoose');
const yup = require('yup');

// exports model
exports.BalanceModel = new mongoose.model('Balance', new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
        index: { unique: true }
    },
    balance: {
        type: Number,
        required: true,
        trim: true
    },
    modifyDate: {
        type: Date,
        default: Date.now
    }
}));

// export validator
exports.BalanceValidator = (balObj) => {
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