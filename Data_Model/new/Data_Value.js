var jsgui = require('lang-mini');
const {more_general_equals} = require('./tools');
const Base_Data_Value = require('./Base_Data_Value');
const Value_Set_Attempt = require('./Value_Set_Attempt');
const Data_Model = require('../Data_Model');
const Immutable_Data_Model = require('./Immutable_Data_Model');
const Immutable_Data_Value = require('./Immutable_Data_Value');
const {is_defined, input_processors, tof, each, is_array, Data_Type} = jsgui;



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

        const spec_is_plain_object = spec !== null && typeof spec === 'object' && !Array.isArray(spec);
        const actual_spec = spec_is_plain_object ? spec : {value: spec};
        super(actual_spec);

        const initial_value_is_present = Object.prototype.hasOwnProperty.call(actual_spec, 'value');
        const initial_value = initial_value_is_present ? actual_spec.value : undefined;

        const {data_type} = this;
        

        // If it previously did not validate, but it then does....
        // Maybe some other issues with why 'set' is not working properly accross cases.

        // Sure gets complex here!!!!

        // Maybe better to break down the parts into smaller and separate and named logic.
        //   Typed_Data_Value perhaps????
        //     Then the type specific coding in there...???



        if (data_type) {
            //console.log('data_type', data_type);


            setup_data_value_data_type_set(this, data_type);

            if (initial_value_is_present && is_defined(initial_value)) {
                this.value = initial_value;
            }
            
        } else {
            if (initial_value_is_present) {
                this.value = actual_spec.value;
            }
        }
        

        // This could use some functions that get generalised from the setter.
        //   Could use the same code paths / use attempt_set_value when set is called.

        // maybe a .last_set_succeeded value.
        //   also the 'validate' event.

        // Should break things up into their more logical pieces, allowing code reuse.
        //   Being much more explicit would help with some things too.




        
        const attempt_set_value = this.attempt_set_value = (value) => {
            const get_local_js_value_copy = () => {
                const lv = this.value;
                const tljsv = tof(lv);
                if (tljsv === 'undefined' || tljsv === 'string' || tljsv === 'number' || tljsv === 'array' || tljsv === 'object' || tljsv === 'data_value') {
                    return lv;
                } else {
                    return lv;
                }
            }

            const old_local_js_value = get_local_js_value_copy();
            const old_equals_new = more_general_equals(old_local_js_value, value);
            if (old_equals_new === true) {
                return new Value_Set_Attempt({success: false, equal_values: true});
            }

            try {
                this.value = value;
            } catch (error) {
                return new Value_Set_Attempt({success: false, value: old_local_js_value, error});
            }

            const new_local_js_value = get_local_js_value_copy();
            const changed = !more_general_equals(old_local_js_value, new_local_js_value);
            return new Value_Set_Attempt({
                success: changed,
                old: old_local_js_value,
                value: new_local_js_value
            });
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

const ensure_sync_state = (data_value) => {
    if (!data_value.__sync_state) {
        Object.defineProperty(data_value, '__sync_state', {
            value: {
                updatingFrom: new Set()
            },
            enumerable: false
        });
    }
    return data_value.__sync_state;
};

const has_defined_value = (data_value) => typeof data_value.value !== 'undefined';

const copy_initial_value = (from, to) => {
    const source_state = ensure_sync_state(from);
    source_state.updatingFrom.add(to);
    try {
        to.value = from.value;
    } finally {
        source_state.updatingFrom.delete(to);
    }
};

const propagate_sync_value = (source, target) => {
    source.on('change', e => {
        if (e.name !== 'value') {
            return;
        }
        const {updatingFrom} = ensure_sync_state(target);
        if (updatingFrom.has(source)) {
            return;
        }
        updatingFrom.add(source);
        try {
            target.value = e.value;
        } finally {
            updatingFrom.delete(source);
        }
    });
};

const align_initial_values = (a, b) => {
    const a_has_value = has_defined_value(a);
    const b_has_value = has_defined_value(b);
    if (a_has_value && !b_has_value) {
        copy_initial_value(a, b);
    } else if (!a_has_value && b_has_value) {
        copy_initial_value(b, a);
    }
};

Data_Value.sync = (a, b) => {
    if (a instanceof Base_Data_Value && b instanceof Base_Data_Value) {

        propagate_sync_value(a, b);
        propagate_sync_value(b, a);

        align_initial_values(a, b);

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
