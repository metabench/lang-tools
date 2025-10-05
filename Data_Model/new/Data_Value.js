var jsgui = require('lang-mini');
const {more_general_equals} = require('./tools');
const Base_Data_Value = require('./Base_Data_Value');
const Value_Set_Attempt = require('./Value_Set_Attempt');
const Data_Model = require('../Data_Model');
const Immutable_Data_Model = require('./Immutable_Data_Model');
const Immutable_Data_Value = require('./Immutable_Data_Value');
const {is_defined, input_processors, field, tof, each, is_array, Data_Type} = jsgui;



const setup_data_value_data_type_set = require('./setup_data_value_data_type_set');
// Maybe make a more universal Data_Model system???


// For the moment improve, test, and refactor this.

// Do want to have some kind of validation status updates.

// Maybe deal with 2 models as a pair.
//   Synced, but possibly different data types.
let util;
if (typeof window === 'undefined') {
    const str_utl = 'util';
    util = require(str_utl);    
}
const lpurple = x => '\x1b[38;5;129m' + x + '\x1b[0m';
const validate_data_value = data_value => {
    const {data_type} = data_value;
    if (data_type) {
        return data_type.validate(data_value);
    } else {
        return true;
    }
}

// And attempt_set_value...

// Maybe we need a Value_Set_Operator class?
// Operator class carries out an operation on something.

// Data_Value_Set_Operator???
//  Data_Value_Set_Operator_Validator
//  Data_Value_Set_Operator_Input_Transformer (eg parser)
//  

// Data_Model_Property class even???

// data value synchronisation....????


// And a Base_Data_Value too perhaps, that Data_Number and Data_String would inherit from???



// Want to define relatively simply what this needs to do.
//   Store a value.
//   Store a value with a specified type.
//   Validate changes
//   Raise change events when the value is changed


// May well be worth reimplementing this with simpler code.
//   However, want to better test this, and syncing them where types differ.

// Automatic conversion of types - while keeping the code simple / compact?

// How could parts of this be moved to a separate file?
//  eg setup_Data_Value_typed_set ????

// Maybe when .set is called, always run create_set, always make a Value_Set_Attempt object, raise various events concerning setting
// eg begin-set-attempt
//    validate-set-attempt

// ????





// Making a Data_Array or Data_Object could help a lot here, keeping the Data_Value code itself simple.
//   Or continue with this, making the test cases, and fixing the error(s) that stops it working properly.
//   Refactoring code to helper file(s) could help a lot.

// Maybe something like a mixin for Data_Value functionality?
//   Only uses the mixin function if appropriate to the data_type / other settings.

// // Want a really simple high-level API if possible.
// See about making a greatly simplified Data_Value.
//   Maybe working on some lower level code will help most, such as field, property?
//   Data types and validation in lang-mini, use it here????

// Supporting Data_Type should be relatively simple, see what functionality in Data_Type will help.
//   Should be able to avoid needing hugh functions and code paths.

// Maybe need a bit more API complexity to do with imput parsing / transformations.

// or a plan_set function, produces a set_plan, which would include the parsing having been done already.

// 

class Data_Value extends Base_Data_Value {
    constructor(spec = {}) {

        //let using_value_as_spec;
        if (typeof spec !== 'object') {
            spec = {
                value: spec
            }
        }

        super(spec);


        this.__data_value = true;
        this.__type_name = 'data_value';
        const that = this;
        if (spec.data_type) {
            this.data_type = spec.data_type;
        } else if (spec.value?.data_type) {
            this.data_type = spec.value.data_type;
        }
        if (spec.context) {
            this.context = spec.context;
        }
        const {data_type, context} = this;
        

        // If it previously did not validate, but it then does....
        // Maybe some other issues with why 'set' is not working properly accross cases.

        // Sure gets complex here!!!!

        // Maybe better to break down the parts into smaller and separate and named logic.
        //   Typed_Data_Value perhaps????
        //     Then the type specific coding in there...???



        if (data_type) {
            //console.log('data_type', data_type);


            setup_data_value_data_type_set(this, data_type);

            // string typed??? String typed????

            
            if (spec.value) {
                this.value = spec.value;
            }
            
        } else {

            // just a field????
            //   maybe it's not properly recohered on the client-side.

            //console.log('* Data_Value setting .value as a field');
            //  does not seem to be working properly here.
            //    maybe look into this further, when not using a data_type.

            // A more advanced system here than just 'field'?

            // Some kind of pre-set event. Validation could then take place, and send something back to the code that would
            //   do the set, giving a reason why the set operation will / should not take place.


            field(this, 'value', spec.value);
        }
        

        // This could use some functions that get generalised from the setter.
        //   Could use the same code paths / use attempt_set_value when set is called.

        // maybe a .last_set_succeeded value.
        //   also the 'validate' event.

        // Should break things up into their more logical pieces, allowing code reuse.
        //   Being much more explicit would help with some things too.




        
        const attempt_set_value = this.attempt_set_value = (value) => {
            const get_local_js_value_copy = () => {
                // TODO <BUG001>: local_js_value is not defined - should this be 'value' or 'this._'?
                // See BUGS.md for details and proposed fixes
                const tljsv = tof(local_js_value);
                if (tljsv === 'undefined' || tljsv === 'string' || tljsv === 'number') {
                    return local_js_value;
                } else {
                    console.log('local_js_value', local_js_value);
                    console.log('tljsv', tljsv);
                    console.trace();
                    throw 'stop';
                }
            }

            // There will be some kind of parsing going on somehow.

            const old_local_js_value = get_local_js_value_copy();
            const old_equals_new = more_general_equals(old_local_js_value, value);
            if (old_equals_new === true) {

                // But no validation event raised....

                return new Value_Set_Attempt({success: false, equal_values: true});
            } else {
                if (this.data_type === undefined) {
                    local_js_value = value;
                    const o_change = {
                        name: 'value',
                        old: old_local_js_value,
                        value
                    }
                    this.raise('change', o_change);
                    return new Value_Set_Attempt({success: true, value});
                } else if (this.data_type instanceof Data_Type) {
                    const t_value = tof(value);
                    if (t_value === 'string') {
                        if (this.data_type.parse_string) {
                            const parsed_value = this.data_type.parse_string(value);
                            if (parsed_value !== undefined) {
                                const res = attempt_set_value(parsed_value);
                                res.parsed = true;
                                return res;
                            } else {
                                return new Value_Set_Attempt({success: false, value});
                            }
                        } else {
                            console.trace();
                            throw 'NYI';
                        }
                    } else {
                        if (t_value === 'number') {
                            const validation = this.data_type.validate(value);
                            if (validation === true) {
                                local_js_value = value;
                                const o_change = {
                                    name: 'value',
                                    old: old_local_js_value,
                                    value
                                }
                                this.raise('change', o_change);
                                return new Value_Set_Attempt({success: true, old: old_local_js_value, value});
                            } else {
                                return new Value_Set_Attempt({success: false, value});
                            }
                        } else {
                            console.log('t_value', t_value);
                            console.trace();
                            throw 'NYI';
                        }
                    }
                } else if (this.data_type === String) {
                    if (typeof value === 'number') {
                        const res = attempt_set_value(value + '');
                        res.data_type_transformation = ['number', 'string'];
                        return res;
                    } else if (typeof value === 'string') {
                        local_js_value = value;
                        const o_change = {
                            name: 'value',
                            old: old_local_js_value,
                            value
                        }
                        this.raise('change', o_change);
                        return new Value_Set_Attempt({success: true, old: old_local_js_value, value});
                    } else {
                        console.trace();
                        throw 'NYI';
                    }
                } else {
                    console.log('this.data_type', this.data_type);
                    console.trace();
                    throw 'NYI';
                }
            }
        }
        this.__type = 'data_value';
        this._relationships = {};
    }
    toImmutable() {
        const {context, data_type, value} = this;
        const res = new Immutable_Data_Value({
            context, data_type, value
        });
        return res;
    }
    'toObject'() {
        return this._;
    }
    'set'(val) {
        this.value = val;
    }
    'get'() {
        return this.value;
    }
    equals(other) {
        return more_general_equals(this, other);
    }
    'toString'() {
        return this.get() + '';
    }
    'toJSON'() {
        const t_value = tof(this.value);
        if (t_value === 'string') {
            return JSON.stringify(this.value);
        } else
        if (t_value === 'number') {
            return this.value + '';
        } else if (t_value === 'boolean' ) {
            this.value ? 'true' : 'false'
        } else if (t_value === 'array') {
            return JSON.stringify(this.value);
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
    }
    'clone'() {
        console.trace();
        throw 'NYI';
        var res = new Data_Value({
            'value': this._
        });
        return res;
    }
    '_id'() {
        if (this.__id) return this.__id;
        if (this.context) {
            this.__id = this.context.new_id(this.__type_name || this.__type);
        } else {
            if (!is_defined(this.__id)) {
                throw 'Data_Value should have context';
                this.__id = new_data_value_id();
            }
        }
        return this.__id;
    }
};

Data_Value.sync = (a, b) => {
    if (a instanceof Base_Data_Value && b instanceof Base_Data_Value) {

        a.on('change', e => {
            const {name, old, value} = e;
            if (name === 'value') {
                b.value = value;
            }
        });

        b.on('change', e => {
            const {name, old, value} = e;
            if (name === 'value') {
                a.value = value;
            }
        });

    } else {
        console.trace();
        throw 'Unexpected types';
    }

}

if (util) {
    Data_Value.prototype[util.inspect.custom] = function(depth, opts) {
        const {value} = this;
        const tv = tof(value);
        if (tv === 'number' || tv === 'string' || tv === 'boolean') {
            return lpurple(value);
        } else {
            if (value instanceof Array) {
                let res = lpurple('[ ');
                let first = true;
                each(value, item => {
                    if (!first) {
                        res = res + lpurple(', ');
                    } else {
                        first = false;
                    }
                    if (item instanceof Data_Model) {
                        const item_value = item.value;
                        res = res + lpurple(item_value)
                    } else [
                        res = res + lpurple(item)
                    ]
                })
                res = res + lpurple(' ]');
                return res;
            } else if (value instanceof Data_Model) {
                return value[util.inspect.custom]();
            } else {
                return lpurple(this.value);
            }
        }
    }
}
module.exports = Data_Value;
