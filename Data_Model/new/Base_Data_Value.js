var jsgui = require('lang-mini');
//var Evented_Class = require('./_evented-class');
const {more_general_equals} = require('./tools');
const Data_Model = require('../Data_Model');
const Immutable_Data_Model = require('./Immutable_Data_Model');

const {is_defined, input_processors, field, tof, each} = jsgui;

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


        // So here field ('value') is doing most of the work here.

        //  Do want to see about setting up the sub-fields too....

        const {data_type, context} = this;

        const possibly_unneeded = () => {
            if (data_type) {

                const {wrap_properties, property_names, property_data_types, wrap_value_inner_values, value_js_type,
                    abbreviated_property_names, named_property_access, numbered_property_access} = data_type;


                let num_properties;

                if (property_names) {

                    if (property_data_types) {
                        if (property_names.length === property_data_types.length) {
                            num_properties = property_names.length;
        
        
                        }
                    }
                    
                }
                
                //console.log('Data_Value 2.0 data_type.value_js_type', value_js_type);

                // Need to recreate an array from the spec value.
                //  Or some other things... copy / clone objects, and copy / clone everything inside objects and arrays.


                // parse_to_immutable???

                // so if the value is an array, if it's an object, number, string, boolean....?

                // potentially_recreate_spec_value???

                // clone_spec_value???



                //const value = spec.value;




                //const local_js_value = value; //const????
                // data_type.value_js_type perhaps??

                /*

                const to_local_js_value = (value) => {
                    //
                    if (value !== undefined) {
                        const t = tof(value);
                        //

                        if (t === 'number' || t === 'string' || t === 'boolean') {
                            return value;
                        } else {

                            // So if it's an array....
                            //   Would need to create the items inside it.
                            //     Receate inner items when making a copy of an array, as they could be Data_Values we would need to
                            //     get the value of, or the bare values....

                            // Does seem a bit laborious here, go through array, depending on type of item copy it in different way.
                            //   As in with the inner strings, numbers and booleans we can do the direct = assignment because they
                            //   dont (?) share actual objects.

                            if (t === 'array') {
                                // go through it....
                                //const arr_value = value;
                                const l = value.length;
                                const res = new Array(l);
                                for (let c = 0; c < l; c++) {
                                    res[c] = to_local_js_value(value[c]);
                                }
                                return res;
                            } else if (t === 'data_value') {
                                return value.toImmutable();
                            } else {

                                // If it's a Data_Value (in the/an array???) we need to get an immutable version of it.
                                console.log('to_local_js_value value', value);
                                console.log('t', t);
                                
                                console.trace();
                                throw 'NYI';
                            }
                        }
                    }
                }
                
                const local_js_value = to_local_js_value(spec.value);
                */

                //  inner_js_type ???

                // inner_value could help....
                /*
                Object.defineProperty(this, 'value', {
                    get() {
                        return local_js_value;
                        //return _prop_value;
                    }
                });
                */
                
                // Probably will not be wrapping inner values?
                //   Or do so to be compatible with normal Data_Value

                /*
                if (wrap_value_inner_values) {

                    if (property_names) {

                        const num_properties = property_names.length;
                        for (let index = 0; index < num_properties; index++) {
                            const name = property_names[index];
                            const data_type = property_data_types[index];
                        }

                    }


                }
                */

                /*
                if (data_type.numbered_property_access === true) {
                    // Then need to make an array, and create accessors for that array.

                    // Only if the properties are named for the moment, as that's the only way we know how many...

                    if (data_type.property_names) {
                        if (data_type.property_names.length <= 256) {
                            // Go through them creating accessors to the inner value...

                            //console.log('should set up Data_Value 2.0 numbered property access');

                        }
                    }
                }
                */
            } else {
                // Just as a Field?
                //   Possibly would want to wrap inner value(s).



                // it's read-only!

                //console.log('Data_Value spec.value', spec.value);

                // A read-only field???

                // But need to clone / copy that value???

                // And if it contains wrapped items, need to get the Immutable_Data_Value versions that wrap them instead.
                //   

                // Would need to copy / clone a local value from the spec.

                /*
                let value;



                // then if it's an array, would need to slice it, and (possibly) wrap inner items as being immutable too.

                if (spec.value instanceof Array) {
                    value = spec.value.map(x => {
                        if (x instanceof Data_Model) {
                            return x.toImmutable();
                        } else {
                            return x;
                        }
                    })
                } else {
                    value = spec.value;
                }

                Object.defineProperty(this, 'value', {
                    get() {
                        return value
                    }
                })
                */

                //field(this, 'value', spec.value);
            }
        

        }
        
            


    }

    equals(other) {
        // Are they both Data_Values???

        // or use Data_Model ???

        // make a general equals here, give it this for the moment.
        //   the more general equals will be used recursively for comparing arrays.

        

        return more_general_equals(this, other);



        

    }

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
            //console.log('this.__type ' + this.__type);
            //throw 'stop';
            this.__id = this.context.new_id(this.__type_name || this.__type);
        } else {
            if (!is_defined(this.__id)) {
                throw 'Data_Value should have context';
                this.__id = new_data_value_id();
            }
        }
        return this.__id;
    }

}

module.exports = Base_Data_Value;