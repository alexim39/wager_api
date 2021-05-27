const { LayModel, LayValidator } = require('../../models/lay');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const LayClass = require('./lay.class');
const Balance = require('./../balance');

module.exports = class Lay extends LayClass  {

    constructor() {
        super()
    }

    // save coinout
    static async coinout(req, res) {
        try {
            jwt.verify(req.token, config.server.token, (error, authData) => {
                if (error) return res.status(403).json({ msg: `Invalid access request`, code: 403 });

                // validate inputs
                const inputValidationError = LayValidator(req.body);
                if (inputValidationError.message) return res.status(400).send(inputValidationError.message);

                const layClass = new LayClass();
                if (layClass.isOutOfCoinOutRange(req.body.amount)) return res.status(500).json({ msg: `Lay amount is out of range`, code: 500 });

                // laying from deposit
                if (req.body.layedFrom === 'deposit') {
                    
                    const BalanceClass = new Balance();
                    const balancePromise = BalanceClass.accountBalance(req.body.userId);

                    (async () => {
                        try {
                            const currentBalance = await balancePromise.then((amount) => { return amount })

                            // check if user have enough balance
                            if (req.body.amount > currentBalance) return res.status(404).json({ msg: `Insufficient account balance`, code: 404 });

                            const lay = await new LayModel({
                                userId: req.body.userId,
                                amount: req.body.amount,
                                layedFrom: req.body.layedFrom,
                                period: req.body.period,
                                plan: req.body.plan,
                                transactionId: req.body.transactionId,
                                transactionStatus: req.body.transactionStatus
                            }).save();
                            if (!lay) return res.status(404).json({ msg: `Lay process failed`, code: 404 });
                            res.status(200).json({ msg: `Lay placed successfully`, code: 200, obj: lay });

                        } catch (error) {
                            res.status(500).json({ msg: `Error while processing lay`, code: 500 });
                        }
                        
                    })();
                    
                }

                // laying from withdrawable
                //if (req.body.layedFrom === 'withdrawable') {}

            })
        } catch (error) {
            return res.status(500).json({ msg: `User access process failed`, code: 500 });
        }
    }

    // save coinup
    static async coinup(req, res) {
        try {
            jwt.verify(req.token, config.server.token, (error, authData) => {
                if (error) return res.status(403).json({ msg: `Invalid access request`, code: 403 });

                // validate inputs
                const inputValidationError = LayValidator(req.body);
                if (inputValidationError.message) return res.status(400).send(inputValidationError.message);

                const layClass = new LayClass();
                if (layClass.isOutOfCoinUpRange(req.body.amount)) return res.status(500).json({ msg: `Lay amount is out of range`, code: 500 });

                // laying from deposit
                if (req.body.layedFrom === 'deposit') {

                    const BalanceClass = new Balance();
                    const balancePromise = BalanceClass.accountBalance(req.body.userId);

                    (async () => {
                        try {
                            const currentBalance = await balancePromise.then((amount) => { return amount })

                            // check if user have enough balance
                            if (req.body.amount > currentBalance) return res.status(404).json({ msg: `Insufficient account balance`, code: 404 });

                            const lay = await new LayModel({
                                userId: req.body.userId,
                                amount: req.body.amount,
                                layedFrom: req.body.layedFrom,
                                period: req.body.period,
                                plan: req.body.plan,
                                transactionId: req.body.transactionId,
                                transactionStatus: req.body.transactionStatus
                            }).save();
                            if (!lay) return res.status(404).json({ msg: `Lay process failed`, code: 404 });
                            res.status(200).json({ msg: `Lay placed successfully`, code: 200, obj: lay });

                        } catch (error) {
                            res.status(500).json({ msg: `Error while processing lay`, code: 500 });
                        }
                        
                    })();

                }

                // laying from withdrawable
                //if (req.body.layedFrom === 'withdrawable') {}

            })
        } catch (error) {
            return res.status(500).json({ msg: `Access process failed`, code: 500 });
        }
    }

    static async getLays(req, res) {
        try {
            jwt.verify(req.token, config.server.token);

            const lays = await LayModel.find({userId: req.params.userId});
            if (!lays) return res.status(404).json({ msg: `No lay found`, code: 404 });
             return res.status(200).json({ msg: `Lays found`, code: 200, obj: lays });

        } catch (error) {
            return res.status(500).json({ msg: `Access process failed`, code: 500 });
        }
    }

}