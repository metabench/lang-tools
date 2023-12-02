var jsgui = require('lang-mini');
const {more_general_equals} = require('./tools');
const Value_Set_Attempt = require('./Value_Set_Attempt');
const Data_Model = require('../Data_Model');
const Immutable_Data_Model = require('./Immutable_Data_Model');
const Immutable_Data_Value = require('./Immutable_Data_Value');
const {is_defined, input_processors, field, tof, each, is_array, Data_Type} = jsgui;
let util;

// Maybe make a more universal Data_Model system???


// For the moment improve, test, and refactor this.






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




class Data_Value extends Data_Model {
    constructor(spec = {}) {
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
        let local_js_value;

        if (data_type) {
            const that = this;
            const define_string_value_property = () => {

                Object.defineProperty(this, 'value', {
                    get() {
                        return local_js_value;
                    },
                    set(value) {
                        const old_value = local_js_value;
                        const immu = that.toImmutable();
                        const value_equals_current = immu.equals(value);
                        if (!value_equals_current) {
                            const t_value = tof(value);
                            let made_change = false;
                            if (t_value === 'string') {
                                if (local_js_value instanceof Data_Value) {
                                    console.log('existing local_js_value instanceof Data_Value');
                                    console.log('local_js_value.value', local_js_value.value);
                                    console.log('local_js_value.data_type.name', local_js_value.data_type.name);
                                    console.trace();
                                    throw 'NYI';
                                } else if (local_js_value === undefined) {
                                    local_js_value = value;
                                    made_change = true;
                                } else if (typeof local_js_value === 'string') {
                                    local_js_value = value;
                                    made_change = true;
                                } else {
                                    console.trace();
                                    throw 'stop';
                                }
                            } else {
                                if (value instanceof Data_Value) {
                                    console.log('t_value', t_value);
                                    console.log('value', value);
                                    console.trace();
                                    throw 'stop';
                                } else {
                                    that.raise('validate', {
                                        valid: false,
                                        reason: 'Invalid Type',
                                        value,
                                        old: local_js_value
                                    });
                                }
                            }
                            if (made_change) {
                                const my_e = {
                                    name: 'value',
                                    old: old_value,
                                    value: local_js_value
                                }
                                that.raise('change', my_e);
                            }
                        }
                    }
                });

            }

            const define_data_type_typed_value_property = () => {
                const {wrap_properties, property_names, property_data_types, wrap_value_inner_values, value_js_type,
                    abbreviated_property_names, named_property_access, numbered_property_access, parse_string} = data_type;
                let num_properties;
                if (property_names && property_data_types) {
                    if (property_names.length === property_data_types.length) {
                        num_properties = property_names.length;
                        if (numbered_property_access) {
                        }
                    }
                } else if (property_names) {
                    num_properties = property_names.length;
                }
                let _current_immutable_value, _previous_immutable_value;
                let prev_outer_value, current_outer_value;
                let _numbered_property_access_has_been_set_up = false, _named_property_access_has_been_set_up = false;



                Object.defineProperty(this, 'value', {
                    get() {
                        return local_js_value;
                    },
                    set(value) {
                        const immu = that.toImmutable();
                        const value_equals_current = immu.equals(value);


                        if (value_equals_current) {

                            // Don't even validate. Maybe raise event saying set-refused?
                            //   set_to_current event possibly???


                        } else {
                            const passed_first_validation = data_type.validate(value);
                            //console.log('passed_first_validation', passed_first_validation);
                            let passed_validation = passed_first_validation;
                            if (!passed_first_validation) {
                                const t_value = tof(value);
                                //console.log('failed first validation t_value:', t_value);
                                if (t_value === 'string' && data_type.parse_string) {
                                    const parsed_value = data_type.parse_string(value);
                                    if (parsed_value !== undefined) {
                                        if (data_type.validate(parsed_value)) {
                                            if (!immu.equals(parsed_value)) {
                                                value = parsed_value;
                                                passed_validation = true;
                                            }
                                        }
                                    }
                                }
                                // 
                            }
                            //console.log('passed_validation', passed_validation);
                            if (passed_validation) {
                                that.raise('validate', {
                                    valid: true,
                                    value
                                });
                            } else {
                                that.raise('validate', {
                                    valid: false,
                                    value
                                });
                            }
                            if (passed_validation) {
                                const do_actual_set = (value) => {
                                    const array_specific_value_processing = () => {
                                        if (value_js_type === Array) {
                                            let t = tof(local_js_value);
                                            if (t === 'undefined') {
                                                const create_array_with_wrapped_items = () => {
                                                    if (num_properties) {
                                                        if (wrap_value_inner_values) {
                                                            if (property_data_types) {
                                                                let i = 0;
                                                                if (value.__immutable) {
                                                                    const l = value.length;
                                                                    const arr_wrapped_value_values = new Array(l);
                                                                    const value_value = value.value;
                                                                    do_actual_set(value_value);
                                                                } else {
                                                                    if (value instanceof Data_Value) {
                                                                        const arr_wrapped_value_values = new Array(num_properties);
                                                                        const arr_dv_value = value.value;
                                                                        console.log('arr_dv_value', arr_dv_value);
                                                                        console.trace();
                                                                        throw 'stop';
                                                                    } else if (is_array(value)) {
                                                                        const arr_wrapped_value_values = value.map(value => {
                                                                            const property_index = i;
                                                                            let property_name;
                                                                            if (property_names) {
                                                                                property_name = property_names[property_index];
                                                                            }
                                                                            const wrapped_value = new Data_Value({context, value, data_type: property_data_types[i]});
                                                                            wrapped_value.on('change', e => {
                                                                                const {name} = e;
                                                                                if (name === 'value') {
                                                                                    current_outer_value = that.toImmutable();
                                                                                    const my_e = {
                                                                                        name,
                                                                                        event_originator: wrapped_value,
                                                                                        parent_event: e,
                                                                                        value: current_outer_value
                                                                                    }
                                                                                    if (property_name) {
                                                                                        my_e.property_name = property_name;
                                                                                    }
                                                                                    my_e.property_index = property_index;
                                                                                    that.raise('change', my_e);
                                                                                    prev_outer_value = current_outer_value;
                                                                                }
                                                                            })
                                                                            i++;
                                                                            return wrapped_value;
                                                                        });
                                                                        local_js_value = arr_wrapped_value_values;
                                                                        const my_e = {
                                                                            name: 'value',
                                                                            old: _previous_immutable_value,
                                                                            value: that.toImmutable()
                                                                        }
                                                                        that.raise('change', my_e);
                                                                    }
                                                                }
                                                            } else {
                                                                let i = 0;
                                                                const arr_wrapped_value_values = value.map(value => {
                                                                    const property_index = i;
                                                                    let property_name;
                                                                    if (property_names) {
                                                                        property_name = property_names[property_index];
                                                                    }
                                                                    const wrapped_value = new Data_Value({context, value});
                                                                    wrapped_value.on('change', e => {
                                                                        const {name} = e;
                                                                        if (name === 'value') {
                                                                            const my_e = {
                                                                                name,
                                                                                event_originator: wrapped_value,
                                                                                parent_event: e,
                                                                                value: that.toImmutable()
                                                                            }
                                                                            if (property_name) {
                                                                                my_e.property_name = property_name;
                                                                            }
                                                                            my_e.property_index = property_index;
                                                                            that.raise('change', my_e);
                                                                        }
                                                                    })
                                                                    i++;
                                                                    return wrapped_value;
                                                                });
                                                                local_js_value = arr_wrapped_value_values;
                                                            }
                                                        } else {
                                                            local_js_value = value;
                                                        }
                                                    } else {
                                                        console.trace();
                                                        throw 'stop - number of properties not found';
                                                    }
                                                }
                                                create_array_with_wrapped_items();
                                            } else if (t === 'array') {
                                                const t_value = tof(value);
                                                if (t_value === 'data_value') {
                                                    if (is_array(value.value)) {
                                                        if (value.value.length === local_js_value.length) {
                                                            each(value.value, (inner_value, idx) => {
                                                                if (inner_value instanceof Data_Model) {
                                                                    const matching_local_inner_value = local_js_value[idx];
                                                                    if (inner_value.equals(matching_local_inner_value)) {
                                                                    } else {
                                                                        matching_local_inner_value.value = inner_value;
                                                                    }
                                                                } else {
                                                                    console.trace();
                                                                    throw 'NYI';
                                                                }
                                                            })
                                                        } else {
                                                            console.trace();
                                                            throw 'NYI';
                                                        }
                                                    } else {
                                                        console.trace();
                                                        throw 'NYI';
                                                    }
                                                } else {
                                                    if (t_value === 'array') {
                                                        if (local_js_value.length === value.length) {
                                                            const l = value.length;
                                                            let all_local_js_items_are_data_model = true, c = 0;
                                                            do {
                                                                const local_item = local_js_value[c];
                                                                if (!(local_item instanceof Data_Model)) {
                                                                    all_local_js_items_are_data_model = false;
                                                                }
                                                                c++;
                                                            } while (all_local_js_items_are_data_model && c < l);
                                                            if (all_local_js_items_are_data_model) {
                                                                let c = 0;
                                                                do {
                                                                    const local_item = local_js_value[c];
                                                                    local_item.value = value[c];
                                                                    c++;
                                                                } while (c < l);
                                                            } else {
                                                                console.trace();
                                                                throw 'NYI';
                                                            }
                                                        } else {
                                                            console.trace();
                                                            throw 'NYI';
                                                        }
                                                    } else {
                                                        console.log('value', value);
                                                        console.trace();
                                                        throw 'NYI';
                                                    }
                                                }
                                            } else {
                                            }
                                        } else {
                                        }
                                    }
                                    array_specific_value_processing();
                                    const general_value_processing = () => {
                                        if (local_js_value instanceof Data_Value) {
                                            console.log('existing local_js_value instanceof Data_Value');
                                            console.log('local_js_value.value', local_js_value.value);
                                            console.log('local_js_value.data_type.name', local_js_value.data_type.name);
                                            console.trace();
                                            throw 'NYI';
                                        } else if (local_js_value instanceof Array) {
                                            if (value instanceof Data_Model) { 
                                                if (value.equals(local_js_value)) {
                                                } else {
                                                    console.log('value', value);
                                                    console.log('local_js_value', local_js_value);
                                                    console.trace();
                                                    throw 'NYI';
                                                }
                                            } else if (value instanceof Array) {
                                                if (property_names.length === value.length) {
                                                    if (property_data_types) {
                                                        const num_properties = property_names.length;
                                                        for (let i_property = 0; i_property < num_properties; i_property++) {
                                                            const name = property_names[i_property];
                                                            const data_type = property_data_types[i_property];
                                                            if (local_js_value[i_property] instanceof Data_Value) {
                                                                local_js_value[i_property].value = value[i_property];
                                                            } else {
                                                                console.trace();
                                                                throw 'NYI';
                                                            }
                                                        }
                                                        if (numbered_property_access && !_numbered_property_access_has_been_set_up) {
                                                            for (let i_property = 0; i_property < num_properties; i_property++) {
                                                                const name = property_names[i_property];
                                                                const data_type = property_data_types[i_property];
                                                                Object.defineProperty(this, i_property, {
                                                                    get() {
                                                                        return local_js_value[i_property];
                                                                    },
                                                                    set(value) {
                                                                        const item_already_there = local_js_value[i_property];
                                                                        if (item_already_there instanceof Data_Model) {
                                                                            item_already_there.value = value;
                                                                        } else {
                                                                            console.log('item_already_there', item_already_there);
                                                                            console.trace();
                                                                            throw 'stop';
                                                                        }
                                                                        if (value instanceof Data_Model) {
                                                                        } else {
                                                                        }
                                                                    }
                                                                })
                                                            }
                                                            Object.defineProperty(this, 'length', {
                                                                get() {
                                                                    return local_js_value.length;
                                                                }
                                                            });
                                                            _numbered_property_access_has_been_set_up = true;
                                                        }
                                                        if (named_property_access && !_named_property_access_has_been_set_up) {
                                                            if (numbered_property_access) {
                                                                if (property_names) {
                                                                    for (let i_property = 0; i_property < num_properties; i_property++) {
                                                                        const name = property_names[i_property];
                                                                        const data_type = property_data_types[i_property];
                                                                        Object.defineProperty(this, name, {
                                                                            get() {
                                                                                return local_js_value[i_property];
                                                                            },
                                                                            set(value) {
                                                                                const item_already_there = local_js_value[i_property];
                                                                                if (item_already_there instanceof Data_Model) {
                                                                                    item_already_there.value = value;
                                                                                } else {
                                                                                    console.log('item_already_there', item_already_there);
                                                                                    console.trace();
                                                                                    throw 'stop';
                                                                                }
                                                                            }
                                                                        })
                                                                    }
                                                                }
                                                                if (abbreviated_property_names) {
                                                                    for (let i_property = 0; i_property < num_properties; i_property++) {
                                                                        const name = abbreviated_property_names[i_property];
                                                                        const data_type = property_data_types[i_property];
                                                                        Object.defineProperty(this, name, {
                                                                            get() {
                                                                                return local_js_value[i_property];
                                                                            },
                                                                            set(value) {
                                                                                const item_already_there = local_js_value[i_property];
                                                                                if (item_already_there instanceof Data_Model) {
                                                                                    item_already_there.value = value;
                                                                                } else {
                                                                                    console.log('item_already_there', item_already_there);
                                                                                    console.trace();
                                                                                    throw 'stop';
                                                                                }
                                                                                if (value instanceof Data_Model) {
                                                                                } else {
                                                                                }
                                                                            }
                                                                        })
                                                                    }
                                                                }
                                                            }
                                                            _named_property_access_has_been_set_up = true;
                                                        }
                                                    }
                                                } else {
                                                    console.trace();
                                                    throw 'NYI';
                                                }
                                            } else {
                                                console.log('value', value);
                                                console.log('local_js_value', local_js_value);
                                                console.log('value_equals_current', value_equals_current);
                                                console.log('immu', immu);
                                                console.trace();
                                                throw 'NYI';
                                            }
                                        } else {
                                            if (value instanceof Data_Model) {
                                                if (value.data_type === that.data_type) {
                                                    const tvv = tof(value.value);
                                                    if (tvv === 'number' || tvv === 'string' || tvv === 'boolean') {
                                                        local_js_value = value.value;
                                                    } else {
                                                        console.trace();
                                                        throw 'NYI';
                                                    }
                                                } else {
                                                    console.trace();
                                                    throw 'NYI';
                                                }
                                            } else {
                                                local_js_value = value;
                                            }
                                            that.raise('change', {
                                                name: 'value',
                                                old: immu,
                                                value: value
                                            });
                                            prev_outer_value = current_outer_value;
                                        }
                                    }
                                    general_value_processing();
                                }
                                do_actual_set(value);
                            } else {
                            }
                            
                        }
                    }
                });
            }

            if (data_type === String) {
                define_string_value_property();
            } else if (data_type instanceof Data_Type) {
                define_data_type_typed_value_property();
            } else {
                console.trace();
                throw 'NYI';
            }
            if (spec.value) {
                this.value = spec.value;
            }
        } else {
            field(this, 'value', spec.value);
        }

        // This could use some functions that get generalised from the setter.
        //   Could use the same code paths / use attempt_set_value when set is called.

        // maybe a .last_set_succeeded value.
        //   also the 'validate' event.

        
        const attempt_set_value = this.attempt_set_value = (value) => {
            const get_local_js_value_copy = () => {
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
