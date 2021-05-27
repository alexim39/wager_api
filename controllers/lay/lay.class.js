module.exports = class LayClass  { 

    constructor() {}

    isOutOfCoinUpRange(amount) {
        if ( amount >= 3000 && amount <= 100000 ) { 
            return false;
        } else { 
            return true;
        }
    }

    isOutOfCoinOutRange(amount) {
        if ( amount >= 5000 && amount <= 100000 ) { 
            return false;
        } else { 
            return true;
        }
    }

}