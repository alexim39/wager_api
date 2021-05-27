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

            // init
            const balanceClass = new BalanceClass();
            const profitPromise = balanceClass.getLayTransactions(userId);
            const profits = await profitPromise.then((profit) => {return profit})
            let sumOfProfit = 0;
            profits.forEach((profit) => {
                sumOfProfit  = sumOfProfit + profit;
            })

            const accountBalance = (totalDeposits + sumOfProfit) - totalLays;
            //console.log(totalDeposits)
            //console.log(totalLays)
            //console.log(accountBalance)
            return accountBalance
            
        } catch (error) {
            console.error(error)
            //return error.error(error.name + ': ' + error.message)
        }
    }

    async getLayTransactions(userId) { 
        try {
            // init
            const balanceClass = new BalanceClass();

            const lays = await LayModel.find({userId: userId});
            if (!lays) return 0;

            let totalProfit = [];

            lays.forEach((lay) => {

                (async () => {
                    try {

                        const closedDealPromise = balanceClass.closedDeals(lay.start, lay.period);
                        const isClosedDeal = await closedDealPromise.then((status) => { return status })

                        // check if its closed deal
                        if (isClosedDeal) {

                            // check the plan type is coinout
                            if (lay.plan === 'Coinout') { // 2% per day interest
                                const interest = (2 / 100) * lay.amount;
                                const profit = interest * lay.period;
                                totalProfit.push(profit);
                                //totalProfit = totalProfit + profit;
                            }

                            // check the plan type is coinup
                            if (lay.plan === 'Coinup') { // 1% per day interest
                                const interest = (1 / 100) * lay.amount;
                                const profit = interest * lay.period;
                                totalProfit.push(profit);
                                //totalProfit = totalProfit + profit;
                            }
                        }

                    } catch (error) {
                        console.error(error);
                    }
                    
                })();

            })

            return totalProfit;

        } catch (error) {
            console.error(error)
            //return error.error(error.name + ': ' + error.message)
        }
    }

  // get the closed deals for each investment
  async closedDeals(startDate, period) {

    // The number of milliseconds in one day
    const oneDay = 1000 * 60 * 60 * 24;

    // Convert both dates to milliseconds
    const todayDate = new Date();
    const strtDate = new Date(startDate);

    // Days past since the day of registration in milliseconds
    const daysPast = (todayDate.getTime() - strtDate.getTime()) / (oneDay);

    // return days past in days
    const daysPastRoundUp =  Math.round(daysPast);

    // Days left
    const daysLeft =  period - daysPastRoundUp;
    if (daysLeft <= 0) return true;
    return false;
  }


}