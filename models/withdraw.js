const mongoose = require('mongoose');
const yup = require('yup');

// exports model
exports.WithdrawModel = new mongoose.model('Withdraw', new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    /* userId: {
        type: String,
        required: true
    }, */
    amount: {
        type: Number,
        required: true
    },
    /* transactionId: {
        type: Number,
        required: true,
        unique: true,
        index: { unique: true }
    }, */
    bankName: {
        type: String,
        required: true,
    },
    accountNo: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        default: 'Pending'
    },
    withdrawDate: {
        type: Date,
        require: true,
        default: Date.now
    }
}));

// export validator
exports.WithdrawValidator = (withdrawObj) => {
    let schema = yup.object().shape({
        userId: yup.string().required('UserId is required'),
        amount: yup.number().required('Amount is require'),
        bankName: yup.string().required('Transaction ID is required'),
        accountNo: yup.string().required('Source of lay is required'),
        withdrawDate: yup.date().required('Transaction date is required').default(() => {
            return new Date();
        })
    })

    return schema.validate(withdrawObj).then(withdraw => withdraw).catch(error => {
        return {
            message: error.message
        }
    });
}