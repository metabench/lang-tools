

const Validation_Result = require('./Validation_Result');


class Validation_Failure extends Validation_Result {
    constructor(spec) {

        super(spec);

    }
}

module.exports = Validation_Failure;