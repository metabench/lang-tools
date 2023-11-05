//var jsgui = require('lang-mini');
//var Evented_Class = require('./_evented-class');

//var j = jsgui;
//var Evented_Class = j.Evented_Class;

// What type is the value?


const Evented_Class = require('lang-mini');


/*
    Possible code inclusions:

    Could define some things as being more stable in the 2.0.
    All the data model items being given an ID could wind up being very useful.
        Maybe even some kind of 128 or 256 bit GUID / key.
    Though of course it would lower performance for some things.
    However, supporting very large data throughput won't be the objective of this framework.
    Easily supporting large amounts of data could help though.

    


if (spec.id) {
    this.__id = spec.id;
}
if (spec.__id) {
    this.__id = spec.__id;
}

*/

class Data_Model extends Evented_Class {
    constructor(spec = {}) {
        super(spec);
        this.__data_model = true;
        if (spec.context) {
            this.context = spec.context;

        }
        this.__type = 'data_model';
    }
    
};

module.exports = Data_Model;
