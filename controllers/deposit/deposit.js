const { DepositModel, DepositValidator } = require('./../../models/deposit');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const  DepositClass = require('./deposit.class');
const Balance = require('./../balance');


module.exports = class Deposit extends DepositClass {

    constructor() {
        super()
    }

    // save coinout
    static async card(req, res) {
        try {
            //const decoded = jwt.verify(req.token, config.server.token);
            jwt.verify(req.token, config.server.token);

            // check if deposit is within rage
            const depositClass = new DepositClass();
            if (depositClass.isOutOfDepositRange(req.body.amount)) return res.status(500).json({ msg: `Deposit amount is out of range`, code: 500 });
                
            // validate inputs
            const depositValidationError = await DepositValidator(req.body);
            if (depositValidationError.message) return res.status(400).send(depositValidationError.message);

            //const balValidatorError = await BalanceValidator({ userId: req.body.userId, balance: req.body.amount });
            //if (balValidatorError.message) return res.status(400).send(balValidatorError.message);
                
            const deposit = await new DepositModel({
                userId: req.body.userId,
                amount: req.body.amount,
                transactionId: req.body.transactionId,
                transactionMethod: req.body.transactionMethod,
                transactionStatus: req.body.transactionStatus
            }).save();

            if (!deposit) return res.status(404).json({ msg: `Deposit process failed`, code: 404 });
            return res.status(200).json({ msg: `Deposit successful`, code: 200, obj: deposit }); 

            // check if user already exist
            /* const user = await BalanceModel.findById(req.body.userId);
            if (user.userId) { // first time deposit

                const currentBalance  = +req.body.amount + +user.balance // + cast values into numbers
                console.log(currentBalance)
                // update the balance value
                const balance = await BalanceModel.findByIdAndUpdate(req.body.userId, { balance: currentBalance });
                if (!balance) return  res.status(404).json({ msg: `Error while updating deposit balance`, code: 404 });
                return res.status(200).json({ msg: `Deposit successful`, code: 200, obj: balance });
                
            } else {
                const initBal = await new BalanceModel({ 
                    userId: req.body.userId, 
                    balance: req.body.amount 
                }).save();
                if (!initBal) return  res.status(404).json({ msg: `Error while updating deposit balance`, code: 404 });
                return res.status(200).json({ msg: `Deposit successful`, code: 200, obj: initBal }); 
            } */
        } catch (error) {
            return res.status(500).json({ msg: `Deposit process failed`, code: 500 });
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

}