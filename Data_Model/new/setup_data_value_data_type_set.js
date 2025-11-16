var jsgui = require('lang-mini');
const {more_general_equals} = require('./tools');
const Base_Data_Value = require('./Base_Data_Value');
const Data_Model = require('../Data_Model');
const Immutable_Data_Model = require('./Immutable_Data_Model');
const Immutable_Data_Value = require('./Immutable_Data_Value');
const {is_defined, input_processors, field, tof, each, is_array} = jsgui;
const Validation_Success = require('./Validation_Success');

const setup_data_value_data_type_set = (data_value, data_type) => {
    let local_js_value;

    const validation_success = (value, transformed_value) => {
        const res = {
            validation: new Validation_Success(),
            value
        };
        if (transformed_value !== undefined) {
            res.transformed_value = transformed_value;
        }
        return res;
    };

    const unwrap_data_value = (value) => value instanceof Base_Data_Value ? value.value : value;
    const is_functional_data_type = (dt) => !!dt && typeof dt.validate === 'function';

    const define_string_value_property = () => {

        // Only define the property if it does not already exist
        if (!Object.getOwnPropertyDescriptor(data_value, 'value')) {
        Object.defineProperty(data_value, 'value', {
            get() {
                return local_js_value;
            },
            set(value) {

                // Than in 'inner set'???
                




                //console.log('1) set(value)');

                const old_value = local_js_value;

                //console.log('old_value (local_js_value)', old_value);

                const immu = data_value.toImmutable();

                //console.log('immu', immu);
                //console.log('value', value);

                const value_equals_current = immu.equals(value);
                //console.log('value_equals_current', value_equals_current);
                if (!value_equals_current) {
                    const t_value = tof(value);
                    //console.log('t_value', t_value);
                    let made_change = false;
                    if (t_value === 'string') {
                        if (local_js_value instanceof Base_Data_Value) {
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
                        if (value instanceof Base_Data_Value) {
                            console.log('t_value', t_value);
                            console.log('value', value);
                            console.trace();
                            throw 'stop';
                        } else {


                            const tval = tof(value);

                            if (tval === 'number') {
                                local_js_value = value + '';
                                made_change = true;

                            } else {

                                console.log('-- INVALID TYPE --');

                                // Maybe need more handling here though....

                                console.log('tof(old_value)', tof(old_value));
                                console.log('tof(value)', tof(value));



                                data_value.raise('validate', {
                                    valid: false,
                                    reason: 'Invalid Type',
                                    value,
                                    old: local_js_value
                                });

                            }

                            
                        }
                    }
                    if (made_change) {
                        const my_e = {
                            name: 'value',
                            old: old_value,
                            value: local_js_value
                        }
                        data_value.raise('change', my_e);
                    }
                }
            }
        });
        } else {
            const transform_string_value = (raw) => {
                const candidate = unwrap_data_value(raw);
                if (candidate === undefined || candidate === null) {
                    return validation_success(candidate);
                }
                if (typeof candidate === 'string') {
                    return validation_success(candidate);
                }
                if (typeof candidate === 'number' || typeof candidate === 'boolean') {
                    return validation_success(candidate, candidate + '');
                }
                return {
                    validation: false,
                    value: candidate
                };
            }
            data_value.transform_validate_value = transform_string_value;
        }
    }

    const define_number_value_property = () => {
        const transform_number_value = (raw) => {
            const candidate = unwrap_data_value(raw);
            if (candidate === undefined || candidate === null) {
                return validation_success(candidate);
            }
            if (typeof candidate === 'number') {
                if (Number.isNaN(candidate)) {
                    return {
                        validation: false,
                        value: candidate
                    };
                }
                return validation_success(candidate);
            }
            if (typeof candidate === 'string') {
                const trimmed = candidate.trim();
                if (trimmed.length === 0) {
                    return {
                        validation: false,
                        value: candidate
                    };
                }
                const parsed = Number(trimmed);
                if (!Number.isNaN(parsed)) {
                    return validation_success(candidate, parsed);
                }
                return {
                    validation: false,
                    value: candidate
                };
            }
            return {
                validation: false,
                value: candidate
            };
        }
        data_value.transform_validate_value = transform_number_value;
    }

    const define_data_type_typed_value_property = () => {
        const descriptor = Object.getOwnPropertyDescriptor(data_value, 'value');
        if (descriptor) {
            const transform_data_type_value = (raw) => {
                const candidate = unwrap_data_value(raw);
                if (data_type.validate(candidate)) {
                    return validation_success(candidate);
                }
                if (typeof candidate === 'string' && typeof data_type.parse_string === 'function') {
                    const parsed = data_type.parse_string(candidate);
                    if (parsed !== undefined && data_type.validate(parsed)) {
                        return validation_success(candidate, parsed);
                    }
                }
                return {
                    validation: false,
                    value: candidate
                };
            }
            data_value.transform_validate_value = transform_data_type_value;
            return;
        }
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



        Object.defineProperty(data_value, 'value', {
            get() {
                return local_js_value;
            },
            set(value) {
                const immu = data_value.toImmutable();
                const value_equals_current = immu.equals(value);
                //console.log('2) set(value)');

                if (value_equals_current) {

                    //console.log('value_equals_current', value_equals_current);

                    // Don't even validate. Maybe raise event saying set-refused?
                    //   set_to_current event possibly???


                } else {
                    const passed_first_validation = data_type.validate(value);
                    //console.log('value', value);
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
                        data_value.raise('validate', {
                            valid: true,
                            value
                        });
                    } else {
                        data_value.raise('validate', {
                            valid: false,
                            value
                        });
                    }


                    if (passed_validation) {
                        const do_actual_set = (value) => {
                            //console.log('do_actual_set');
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
                                                                            current_outer_value = data_value.toImmutable();
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
                                                                            data_value.raise('change', my_e);
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
                                                                    value: data_value.toImmutable()
                                                                }
                                                                data_value.raise('change', my_e);
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
                                                                        value: data_value.toImmutable()
                                                                    }
                                                                    if (property_name) {
                                                                        my_e.property_name = property_name;
                                                                    }
                                                                    my_e.property_index = property_index;
                                                                    data_value.raise('change', my_e);
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
                                if (local_js_value instanceof Base_Data_Value) {
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
                                                        Object.defineProperty(data_value, i_property, {
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
                                                    Object.defineProperty(data_value, 'length', {
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
                                                                Object.defineProperty(data_value, name, {
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
                                                                Object.defineProperty(data_value, name, {
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
                                        if (value.data_type === data_value.data_type) {
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
                                    data_value.raise('change', {
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
    } else if (data_type === Number) {
        define_number_value_property();
    } else if (is_functional_data_type(data_type)) {
        define_data_type_typed_value_property();
    } else {
        console.trace();
        throw 'NYI';
    }


}

module.exports = setup_data_value_data_type_set;