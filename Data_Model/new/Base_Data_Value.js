var jsgui = require('lang-mini');
//var Evented_Class = require('./_evented-class');
const {more_general_equals} = require('./tools');
const Data_Model = require('../Data_Model');
const Immutable_Data_Model = require('./Immutable_Data_Model');

const {is_defined, input_processors, field, tof, each} = jsgui;

const setup_base_data_value_value_property = require('./setup_base_data_value_value_property');

// What type is the value???

// Examples / tests of using this in this module could help.
//   Benchmarks too?
let util;
if (typeof window === 'undefined') {
    const str_utl = 'util';
    util = require(str_utl);    
}


const lpurple = x => '\x1b[38;5;129m' + x + '\x1b[0m';
const ldarkPurple = x => `\x1b[38;5;54m${x}\x1b[0m`;

// Possibly do some (much?) simpler tests to start with...

// Copy the value when it gets set somehow.

// Not actually all that much shared between the mutable and immutable versions right now.
//   Could come back to this later.



class Base_Data_Value extends Data_Model {

    constructor(spec = {}) {
        super(spec);
        this.__data_value = true;

        if (spec.data_type) this.data_type = spec.data_type;
        if (spec.context) {
            this.context = spec.context;
        }
        this.__type = 'data_value';

        // this.__data_type = ...
        // this.__data_type_name = ... ?

        //this._bound_events = {};
        this._relationships = {};

        //console.log('Base_Data_Value spec', spec);

        // Does not have the field for 'value' though....

        // this.setup_value_property????


        


        // So here field ('value') is doing most of the work here.

        //  Do want to see about setting up the sub-fields too....

        const {data_type, context} = this;

        
        setup_base_data_value_value_property(this);


        // Defining the property here could work....




        // Some kind of post-constructor function?????

        // or use an event handler and event????


        //setImmediate(() => {
        //    if (spec.value) {
        //        this.value = spec.value;
        //    }
        //})

    }

    

    equals(other) {
        // Are they both Data_Values???

        // or use Data_Model ???

        // make a general equals here, give it this for the moment.
        //   the more general equals will be used recursively for comparing arrays.

        return more_general_equals(this, other);

    }

    // Maybe see about immutable mode Data_Values / Data_Models.
    //   Or do make the immutable versions of all of them!!!
    //     And could make core functionality for both the immutable and mutable versions.
    //       Mutability Independent Code.


    // Immutable_Data_Integer does seem like it would in principle be (really?) simple.








    /*
    toImmutable() {
        // May be slightly difficult / tricky / complex.
        const {context, data_type, value} = this;

        // Create the new item...
        // Needs to copy the inner value....?

        const res = new Immutable_Data_Value({
            context, data_type, value
        });
        return res;
    }
    */

    
    'get'() {
        return this.value;
    }

    'toString'() {
        //return stringify(this.get());
        // con
        //console.log('this._val ' + stringify(this._val));
        //throw 'stop';
        return this.get() + '';
    }
    // Maybe a particular stringify function?
    'toJSON'() {
        return JSON.stringify(this.get());
    }

    // Need to copy / clone the ._ value
    /*
    'clone'() {

        //return this.toImmutable();
    }
    */

    // This is important to the running of jsgui3.
    //   Move to the lower level of Data_Model?


    '_id'() {
        if (this.__id) return this.__id;
        if (this.context) {
            this.__id = this.context.new_id(this.__type_name || this.__type);
            return this.__id;
        }
        // Return undefined when no context - don't throw
        // This allows Data_Value instances to exist without a context
        return undefined;
    }

}

module.exports = Base_Data_Value;