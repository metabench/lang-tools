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


class Immutable_Data_Value extends Immutable_Data_Model {

    constructor(spec = {}) {
        super(spec);
        this.__data_value = true;
        this.__immutable = true;
        this.__type_name = 'data_value';

        if (spec.data_type) this.data_type = spec.data_type;
        if (spec.context) {
            this.context = spec.context;
        }

        // So here field ('value') is doing most of the work here.

        //  Do want to see about setting up the sub-fields too....

        const {data_type, context} = this;
        
        if (data_type) {

            const {wrap_properties, property_names, property_data_types, wrap_value_inner_values, value_js_type,
                abbreviated_property_names, named_property_access, numbered_property_access} = data_type;


            let num_properties;

            if (property_names) {
                if (property_names.length === property_data_types.length) {
                    num_properties = property_names.length;


                    if (numbered_property_access) {
                        //console.log('will (possibly later on) set up numbered property access - num_properties:', num_properties);




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

            //  inner_js_type ???

            // inner_value could help....

            Object.defineProperty(this, 'value', {
                get() {
                    return local_js_value;
                    //return _prop_value;
                }
            });
            
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

            //field(this, 'value', spec.value);
        }
        this.__type = 'data_value';

        // this.__data_type = ...
        // this.__data_type_name = ... ?

        //this._bound_events = {};
        this._relationships = {};


    }

    equals(other) {
        // Are they both Data_Values???

        // or use Data_Model ???

        // make a general equals here, give it this for the moment.
        //   the more general equals will be used recursively for comparing arrays.

        

        return more_general_equals(this, other);



        

    }

    
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

    

    // .value =
    //   Though .set could have more input, eg a format shifter????

    /*
    'set'(val) {
        this.value = val;
    }
    */
    'get'() {
        return this.value;
    }

    /*

    [util.inspect.custom](depth, opts) {
        //return 'foo = ' + this.foo.toUpperCase();

        // But then display it in a specific color....

        //return ldarkPurple(this.value);

        const {value} = this;

        if (value instanceof Array) {
            // could go through each item in that array.

            let res = '[ ';
            let first = true;

            each(value, item => {
                if (!first) {
                    res = res + ', ';
                } else {
                    first = false;
                }

                if (item instanceof Data_Model) {
                    const item_value = item.value;
                    res = res + ldarkPurple(item_value)

                } else [
                    res = res + ldarkPurple(item)
                ]

            })
            res = res + ' ]';
            return res;

        } else {
            return ldarkPurple(this.value);
        }
    }
    */

    'toString'() {
        //return stringify(this.get());
        // con
        //console.log('this._val ' + stringify(this._val));
        //throw 'stop';
        return this.get() + '';
    }
    // Maybe a particular stringify function?
    'toJSON'() {

        // Seems like cases where sometimes 

        const t_value = tof(this.value);

        if (t_value === 'string') {
            return JSON.stringify(this.value);
        } else
        if (t_value === 'number') {
            //
            return this.value + '';

        } else if (t_value === 'boolean' ) {
            this.value ? 'true' : 'false'
        } else if (t_value === 'array') {

            let res = '[';
            const l = this.value.length;
            for (let c = 0; c < l; c++) {
                const item = this.value[c];
                if (c > 0) res += ','
                if (item.toJSON) {
                    res += item.toJSON();
                } else {
                    res += JSON.stringify(item);
                }

            }

            res = res + ']';

            return res;
            //return JSON.stringify(this.value);
        } else if (t_value === 'data_value') {
            return this.value.toJSON();
        } else if (t_value === 'undefined') {
            return 'null'
        } else if (t_value === 'null') {
            return 'null'
        } else {
            console.log('toJSON this.value', this.value);
            console.log('t_value', t_value);
            console.trace();
            throw 'NYI';
        }

        

        //return JSON.stringify(this.value);
    }

    // Need to copy / clone the ._ value

    'clone'() {
        return this.toImmutable();
    }

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

    'toObject'() {
        return this._;

    }

    /*
    'parent'() {

        // Likely should (greatly) simplify this.
        //   Sometimes maybe would not be needed.


        var a = arguments; a.l = arguments.length; var sig = get_a_sig(a, 1);

        // .sibling_index instead. Clearer, matched HTML terminology in places.

        var obj, index;
        //console.log('parent sig', sig);
        if (a.l == 0) {
            return this._parent;
        } else if (a.l == 1) {
            obj = a[0];

            if (!this.context && obj.context) {
                this.context = obj.context;
            }

            var relate_by_id = function (that) {
                var obj_id = obj._id();
                that._relationships[obj_id] = true;
            }

            var relate_by_ref = function (that) {
                that._parent = obj;
            }
            relate_by_ref(this);
        } else if (a.l == 2) {
            obj = a[0];
            index = a[1];

            if (!this.context && obj.context) {
                this.context = obj.context;
            }

            this._parent = obj;
            this._index = index;
        }


        const unused_even_older_code = () => {
            if (is_defined(index)) {
                // I think we just set the __index property.
                //  I think a __parent property and a __index property would do the job here.
                //  Suits DOM heirachy.
                // A __relationships property could make sense for wider things, however, it would be easy (for the moment?)
                // to just have .__parent and .__index
                //
    
                // Not sure all Data_Objects will need contexts.
                //  It's mainly useful for Controls so far
            } else {
                // get the object's id...
    
                // setting the parent... the parent may have a context.
            }
        }
    }
    */
};


if (util) {
    Immutable_Data_Value.prototype[util.inspect.custom] = function(depth, opts) {
        //return 'foo = ' + this.foo.toUpperCase();

        // But then display it in a specific color....

        //return ldarkPurple(this.value);

        const {value} = this;

        if (value instanceof Array) {
            // could go through each item in that array.

            let res = ldarkPurple('[ ');
            let first = true;

            each(value, item => {
                if (!first) {
                    res = res + ldarkPurple(', ');
                } else {
                    first = false;
                }

                if (item instanceof Data_Model) {
                    const item_value = item.value;
                    res = res + ldarkPurple(item_value)

                } else [
                    res = res + ldarkPurple(item)
                ]

            })
            res = res + ldarkPurple(' ]');
            return res;

        } else {
            return ldarkPurple(this.value);
        }
    }
}

module.exports = Immutable_Data_Value;
