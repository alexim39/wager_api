const { WithdrawModel, WithdrawValidator } = require('../../models/withdraw');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const WithdrawClass = require('./withdraw.class');
const Balance = require('./../balance');

module.exports = class Withdraw extends WithdrawClass  {

    // Create comment
    static async create(req, res) {
        try {
            

            jwt.verify(req.token, config.server.token);

            // validate inputs
            const withdrawValidatorError = await WithdrawValidator(req.body);
            if (withdrawValidatorError.message) return res.status(400).send(withdrawValidatorError.message);

            // check if amount is out of range
            const withdrawClass = new WithdrawClass();
            if (withdrawClass.isOutOfRange(req.body.amount)) return res.status(500).json({ msg: `Withdraw amount is out of range`, code: 500 });

            const BalanceClass = new Balance();
            const balancePromise = BalanceClass.accountBalance(req.body.userId);
            const currentBalance = await balancePromise.then((amount) => { return amount })

            // check if user have enough balance
            if (req.body.amount > currentBalance) return res.status(404).json({ msg: `Insufficient account balance`, code: 404 });

            const withdraw = await new WithdrawModel(req.body).save();

            if (withdraw) return res.status(200).json({ msg: `Withdraw request placed successully `, code: 200, obj: withdraw });
            return res.status(404).json({ msg: `Withdraw request failed`, code: 404 });
            
        } catch (error) {
            console.log(error)
            return res.status(500).json({ msg: `Withdraw process failed`, code: 500 });
        }

    }

}