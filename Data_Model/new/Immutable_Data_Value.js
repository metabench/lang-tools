var jsgui = require('lang-mini');
//var Evented_Class = require('./_evented-class');
const {more_general_equals} = require('./tools');
const Data_Model = require('../Data_Model');
const Immutable_Data_Model = require('./Immutable_Data_Model');
const Immutable_Base_Data_Value = require('./Immutable_Base_Data_Value');
const throw_immutable_assignment = () => {
    throw new TypeError('Cannot modify immutable Data_Value');
};

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

class Immutable_Data_Value extends Immutable_Base_Data_Value {

    constructor(spec = {}) {
        super(spec);
        this.__data_value = true;
        this.__immutable = true;
        this.__type_name = 'data_value';

        if (spec.data_type) this.data_type = spec.data_type;
        if (spec.context) {
            this.context = spec.context;
        }

        const {data_type, context} = this;
        
        if (data_type) {
            

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

            // TODO <BUG002>: Immutable Data_Value should have a setter that throws an error
            // Currently only has getter, so assignments silently succeed
            // See BUGS.md for proposed fix
            Object.defineProperty(this, 'value', {
                get() {
                    return local_js_value;
                    //return _prop_value;
                },
                set: throw_immutable_assignment
            });
            
        } else {
            
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
            // TODO <BUG002>: This property definition also needs a setter that throws
            // See BUGS.md for proposed fix
            Object.defineProperty(this, 'value', {
                get() {
                    return value
                },
                set: throw_immutable_assignment
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
