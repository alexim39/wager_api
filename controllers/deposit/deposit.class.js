module.exports = class DepositClass  { 

    constructor() {}

    isOutOfDepositRange(amount) {
        if ( amount >= 3000 && amount <= 100000 ) { // Only activate btn when value is >= 3000
            return false;
        } else { //  if ( value < 3000 ) {
            return true;
        }
    }

}