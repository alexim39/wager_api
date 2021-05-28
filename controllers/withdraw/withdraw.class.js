module.exports = class WithdrawClass  { 

    constructor() {}

    isOutOfRange(amount) {
        if ( amount >= 1000 && amount <= 1000000 ) { 
            return false;
        } else { 
            return true;
        }
    }

}