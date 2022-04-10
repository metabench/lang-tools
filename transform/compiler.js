
const Transformer = require('./transformer');

// Possibly this should be higher level, using fnl as a platform?
//  Being able to use observables at least.

// Should be able to use streams & more complex suitable data types.



class Compiler extends Transformer {
    constructor(spec) {

        super(spec);

    }
}

module.exports = Compiler;