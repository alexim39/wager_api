const { DepositModel, DepositValidator } = require('./../../models/deposit');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const DepositClass = require('./deposit.class');
const Balance = require('./../balance');
const PayStack = require('paystack-node');


module.exports = class Deposit extends DepositClass {

    constructor() {
        super()
    }

    // verify paystack payment
    static async verifyPaystack(req, res) {
        try {

            const APIKEY = config.server.paystack_api;
            const paystack = new PayStack(APIKEY, config.server.environment)

            // verifyTransaction
            const paystackVerifyPromise = paystack.verifyTransaction({
                reference: req.params.reference.toString(),
            })
            
            paystackVerifyPromise.then( (response) => {

                if (response.body.data.status === 'success') { // if deposit was completed successfuly

                    (async () => {
                        try {

                            // check if deposit is within range
                            //const depositClass = new DepositClass();
                            //if (depositClass.isOutOfDepositRange(req.body.amount)) return res.status(500).json({ msg: `Deposit amount is out of range`, code: 500 });

                            // validate inputs
                            //const depositValidationError = await DepositValidator(req.body);
                            //if (depositValidationError.message) return res.status(400).send(depositValidationError.message);


                            const deposit = await new DepositModel({
                                userId: req.params.userId,
                                amount: response.body.data.amount / 100,
                                transactionId: response.body.data.reference,
                                transactionMethod: response.body.data.channel,
                                transactionStatus: "Success"
                            }).save();
                
                            if (deposit) return res.status(200).json({ msg: `Deposit successful`, code: 200, obj: response.body });

                        } catch (error) {
                            console.error(error);
                        }
                    })();
                } else {
                    return res.status(500).json({ msg: `Deposit was not successful`, code: 500, obj: response.body });
                }
            }).catch( (error) => {
                // deal with error
                console.error(error)
                return res.status(404).json({ msg: `Paystack verification failed`, code: 404 });
            })


        } catch (error) {
            return res.status(500).json({ msg: `Deposit verification Process failed`, code: 500 });
        }
    }

    // balance
    static async getBalance(req, res) {
        try {
            jwt.verify(req.token, config.server.token);

            const BalanceClass = new Balance()
            const balance = BalanceClass.accountBalance(req.params.userId);
            balance.then((amount) => {
                if (amount === 0) return res.status(404).json({ msg: `No balance found`, code: 404 });
                return res.status(200).json({ msg: `Balance found`, code: 200, obj: amount });
            })

        } catch (error) {
            return res.status(500).json({ msg: `Process failed`, code: 500 });
        }
    }

    // get deposits
    static async getDeposits(req, res) {
        try {
            jwt.verify(req.token, config.server.token);

            const deposits = await DepositModel.find({ userId: req.params.userId });

            if (!deposits) return res.status(404).json({ msg: `No deposit found`, code: 404 });
            return res.status(200).json({ msg: `Deposit found`, code: 200, obj: deposits });

        } catch (error) {
            return res.status(500).json({ msg: `Process failed`, code: 500 });
        }
    }

}