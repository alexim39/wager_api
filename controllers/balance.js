const { DepositModel } = require('../models/deposit');
const { LayModel } = require('./../models/lay');

module.exports = class BalanceClass  { 

    constructor() {}

    async accountBalance(userId) { 
        try {

            const deposits = await DepositModel.find({userId: userId});
            const lays = await LayModel.find({userId: userId});
            if (!deposits) return 0;
            if (!lays) return 0;
            
            let totalDeposits = 0;
            let totalLays = 0;

            deposits.forEach((deposit) => {
                totalDeposits = totalDeposits + deposit.amount
            })

            lays.forEach((lay) => {
                totalLays = totalLays + lay.amount
            })

            const accountBalance = totalDeposits - totalLays;
            //console.log(totalDeposits)
            //console.log(totalLays)
            //console.log(accountBalance)
            return accountBalance
            
        } catch (error) {
            console.log(error)
            //return error.error(error.name + ': ' + error.message)
        }
    }

}