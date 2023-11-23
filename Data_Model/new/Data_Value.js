var jsgui = require('lang-mini');

// a Data_Model util module....?

const {more_general_equals} = require('./tools');

const Data_Model = require('../Data_Model');
const Immutable_Data_Model = require('./Immutable_Data_Model');
const Immutable_Data_Value = require('./Immutable_Data_Value');
const {is_defined, input_processors, field, tof, each, is_array, Data_Type} = jsgui;

// Only in node.js

let util;

if (typeof window === 'undefined') {
    const str_utl = 'util';
    util = require(str_utl);    
}


// Code not so long overall - but need to be very clear about what the code is for.
//   Code needs to handle a veriety of situations.


// Returning the old value as an, or using an immutable Data_Value may help.
//   But the js value itself could be an array.
//     Be able to respond to the whole thing being replaced and to changes within it.




const lpurple = x => '\x1b[38;5;129m' + x + '\x1b[0m';

// extends Base_Data_Value (either mutable or immutable, the shared functionality of them both)

// Be able to say if it's validating / autovalidating?
// Only can set the value to valid values?
// Also, may want to be aware of keeping within the same type(s) even when the values are not valid.
//   Maybe also some other limitations, like only 32 characters total.
//   Could possibly choose which validation rules can be broken (making its state invalid)
//     and which must be enforced so that its value never gets set to an invalid value.
//     That's how a control.data.model and control.view.data.model would have different rules in many cases.
//       Display the invalid data on the screen, but don't save it or use it for the application state.

// Maybe also a confirmed or user_confirmed state.

// Maybe the states could themselves be a simpler version of Data_Value.
//   Data_Validation_State even, and it would be an Evented_Class that raises change events.
//     .value as true or false.
//     


// Something that listens to changes and makes validation state changes?

// Currently it won't set the value if it fails validation.

// May also want partial validation, eg no more than 32 chrs but do display letters even when only digits are valid.

// view model validation rules and data model validation rules will be different.
//   don't enforce (but do use) the data model validation rules in the view model.

// ctrl.view.model.validation ???
// ctrl.view.model.validation.rules.add(...)???


// Definitely looks like we can have very explicit, concise and precise syntax.
//   That would be much / all about the control.

// There need to be underlying data model validation rules - though some may get suspended in the view.
//   Or just ignore these rules (by default) in the view rule enforcement, but indicate the status as to while the data model
//     can not update.












const validate_data_value = data_value => {
    const {data_type} = data_value;
    if (data_type) {
        return data_type.validate(data_value);
    } else {
        return true;
    }
}










class Data_Value extends Data_Model {
    constructor(spec = {}) {
        super(spec);
        this.__data_value = true;
        this.__type_name = 'data_value';
        //console.log('Data_Value (2.0)  constructor');
        const that = this;
        if (spec.data_type) {
            this.data_type = spec.data_type;
        } else if (spec.value?.data_type) {
            this.data_type = spec.value.data_type;
        }

        // Could copy the Data_Type from spec.value.

        

        if (spec.context) {
            this.context = spec.context;
        }
        const {data_type, context} = this;
        if (data_type) {

            // Maybe make helper functions to call from below.

            let local_js_value;
            const that = this;

            if (data_type === String) {

                // Just enforce that it's a string type.
                //   Maybe do toString on input?
                //   Maybe reject non-strings.

                // Make sure it's a string (etc)

                // Relatively simple get and set I expect.
                //   Though likely still need to make it able to handle a variety of scenarios.

                // Though does need to follow a somewhat similar pattern to the code below.


                Object.defineProperty(this, 'value', {
                    get() {
                        return local_js_value;
                    },
                    set(value) {

                        // A string comparison may be simpler, not needing immutable data objects.
                        //   However, still using these immutable data objects to represent the state as standard could help.
                        //     Especially when it comes to storing and logging (incremental) operation ids and timestamps.

                        //const immu = that.toImmutable();

                        const old_value = local_js_value;

                        const immu = that.toImmutable();
                        const value_equals_current = immu.equals(value);


                        //console.log('(String data_type) immu', immu);
                        //console.log('(String data_type) Data_Value set value:', value);

                        //console.log('value_equals_current', value_equals_current);

                        
                        

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

                                // If it's a Data_Value???

                                if (value instanceof Data_Value) {

                                    console.log('t_value', t_value);
                                    console.log('value', value);
                                    console.trace();
                                    throw 'stop';

                                } else {

                                    // It's a type validation failure.

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
                                    //event_originator: wrapped_value,
                                    //parent_event: e,
                                    old: old_value,
                                    value: local_js_value
                                }


                                //if (property_name) {
                                //    my_e.property_name = property_name;
                                //}
                                //my_e.property_index = property_index;
                                that.raise('change', my_e);


                            }
                            // or could be a Data_Value or other Data_Model that has {data_type: String}





                            
                        }







                    }
                });






                //console.trace();
                //throw 'NYI';






            } else if (data_type instanceof Data_Type) {

                // Is it an instance of Data_Type??? That is in lang-mini.






                const {wrap_properties, property_names, property_data_types, wrap_value_inner_values, value_js_type,
                    abbreviated_property_names, named_property_access, numbered_property_access, parse_string} = data_type;


                let num_properties;



                if (property_names && property_data_types) {
                    //console.log('!!property_names', !!property_names);
                    //console.log('!!property_data_types', !!property_data_types);
                    if (property_names.length === property_data_types.length) {
                        num_properties = property_names.length;

                        if (numbered_property_access) {
                        }
                    }
                } else if (property_names) {
                    num_properties = property_names.length;
                }
                //console.log('Data_Value 2.0 data_type.value_js_type', value_js_type);
                
                let _current_immutable_value, _previous_immutable_value;


                let prev_outer_value, current_outer_value;

                /*
                const register_value_change = () => {
                    //console.log('---register_value_change---');
                    //console.trace();
                    _previous_immutable_value = _current_immutable_value;
                    _current_immutable_value = this.toImmutable();
                }
                */
                

                let _numbered_property_access_has_been_set_up = false, _named_property_access_has_been_set_up = false;


                // Define thr property itself....

                Object.defineProperty(this, 'value', {
                    get() {
                        return local_js_value;
                    },
                    set(value) {

                        //console.log('');
                        //console.log('Data_Value set value:', value);
                        //console.log('data_value.name', value.name);


                        // Validation....
                        // Is given value different to the current value it's set to?

                        // So could compare on an immutable copy of this.
                        //  
                        // 

                        const immu = that.toImmutable();
                        const value_equals_current = immu.equals(value);


                        //console.log('immu', immu);
                        //console.log('Data_Value set value:', value);

                        //console.log('value_equals_current', value_equals_current);

                        

                        if (!value_equals_current) {

                            // Should accept a Data_Value as valid though...
                            //   or maybe use a toPOJO function ???


                            const passed_first_validation = data_type.validate(value);
                            let passed_validation = passed_first_validation;

                            // Need to also try parse then validate.
                            //   Maybe we should have validate_string too perhaps???
                            //   Let's try to keep the code right here relatively simple.
                            //     Could mean putting explicitly named functions around code here.

                            // Then parsed or reprocessed value....
                            // 

                            // Can try to parse the value (maybe just if it's a string, for now)

                            if (!passed_first_validation) {
                                //console.log('did not pass validation 1');
                                //console.log('value_js_type', value_js_type);

                                const t_value = tof(value);
                                //console.log('t_value', t_value);

                                if (t_value === 'string' && data_type.parse_string) {
                                    //console.log('will try to parse the string');

                                    const parsed_value = data_type.parse_string(value);
                                    //console.log('parsed_value', parsed_value);

                                    if (parsed_value !== undefined) {
                                        if (data_type.validate(parsed_value)) {

                                            if (!immu.equals(parsed_value)) {
                                                value = parsed_value;
                                                passed_validation = true;
                                            }
                                        }
                                    }
                                }
                            }
                            //console.log('passed_validation', passed_validation);

                            // And say what data is invalid???
                            //   Could make more advanced validation statuses....
                            //   But for the moment, updating a UI control with whether it's valid or not will be helpful.


                            // Simple enough here for the moment.


                            if (passed_validation) {
                                that.raise('validate', {
                                    valid: true
                                });
                            } else {
                                that.raise('validate', {
                                    valid: false
                                });
                            }

                            if (passed_validation) {

                                // function to carry out the set (approved (as in its as change) and valid)

                                // do_actual_set ???

                                const do_actual_set = (value) => {

                                    //console.log('do_actual_set');

                                    const array_specific_value_processing = () => {

                                        

                                        if (value_js_type === Array) {

                                            //console.log('array_specific_value_processing');

                                            // then is the local value an instance of array?
                
                                            //console.log('value_js_type === Array');
                                            let t = tof(local_js_value);
                
                
                                            //console.log('t', t);
                
                                            if (t === 'undefined') {

                                                // Create array with wrapped items.

                                                const create_array_with_wrapped_items = () => {

                                                    if (num_properties) {
                                                        //console.log('num_properties', num_properties);
                                                        if (wrap_value_inner_values) {
                                                            if (property_data_types) {
                                                                let i = 0;
                    
                                                                //console.log('value', value);
                                                                //console.log('value.__immutable', value.__immutable);

                                                                // Need to copy over the values in this situation.

                                                                // if the value is an immutable Data_Value....
                                                                //   Getting immutable objects out of events / state changes should
                                                                //   help prevent bugs. Need to then copy the values from these immutable Data_Valurs
                                                                //   into new (for the moment only) non-immutable Data_Values


                                                                if (value.__immutable) {

                                                                    // And we already know it's an array type.
                                                                    const l = value.length;
                                                                    const arr_wrapped_value_values = new Array(l);

                                                                    // then go through it....

                                                                    const value_value = value.value;
                                                                    //console.log('value_value', value_value);

                                                                    // then could do_actual_set with that array....
                                                                    do_actual_set(value_value);


                                                                    //local_js_value = arr_wrapped_value_values;

                                                                    //console.log('arr_wrapped_value_values', arr_wrapped_value_values);

                                                                    //console.trace();
                                                                    //throw 'stop';





                                                                } else {

                                                                    if (value instanceof Data_Value) {

                                                                        // get the value out of that....

                                                                        // shall create the new array though....

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
                            
                            
                                                                            // Maybe do need to do more keeping / tracking of state.
                                                                            //   Though, what the value / immutable version was before the change event is fairly important.
                                                                            //   As in the immutable value prior to the change of the wrapped (inner) value.
                            
                                                                            // Simplified tracking of old values in change events somehow???
                            
                            
                                                                            // pre-change event maybe???
                                                                            //   when it knows it's going to change, so that then a copy of its data can be grabbed.
                            
                                                                            // Returning (old and new) states as Immutable could be useful.
                                                                            //   Though where they are number, string or bools, it may be best to return the
                                                                            //    unwrapped values which are immutable anyway.
                            
                            
                                                                            // Want to be able to think of setting the value in relatively simple terms too.
                                                                            
                            
                                                                            wrapped_value.on('change', e => {
                                                                                const {name} = e;
                                                                                if (name === 'value') {
                            
                            
                                                                                    // May want to somewhat limit the use of Immutable_Data_Value at times.
                                                                                    //   Getting the .value (maybe) should not always return such an object.
                                                                                    //     But maybe it should to better copy by value.
                            
                            
                                                                                    
                            
                            
                                                                                    // OK, but by this point the change to the wrapped value has hapenned already.
                            
                            
                                                                                    //console.log('wapped value change e', e);
                            
                            
                            
                                                                                    // Though maybe watching update value changes will work better....
                            
                            
                            
                                                                                    //register_value_change();
                            
                                                                                    // Maybe do need to be more specific about these....
                                                                                    //   A stack of immutable values....
                                                                                    //     Could keep track of all states it's been in.
                            
                                                                                    // maybe a .track_all_states option.
                                                                                    // .keep_all_
                                                                                    //states ???? clearer name.
                            
                                                                                    // and the prev value....
                            
                                                                                    //let prev_value, current_value;
                            
                                                                                    //prev_value = current_value;
                                                                                    //current_value = wrapped_value.toImmutable();
                            
                                                                                    // need own immutable value for comparison.
                            
                                                                                    // But still do want state tracking....
                                                                                    //   Maybe have it on set?
                                                                                    //     Though once it receives a change event from a wrapped item, it should treat that as a change.
                                                                                    //       But maybe there shuld be a pre-change where the higher up data model objects
                                                                                    //       can get an immutable copy of the current state, before the change.
                            
                                                                                    // A pre-change event could possibly help.
                                                                                    //   Maybe it would be the simplest / one of the simplest ways to do this.
                            
                                                                                    // Listen for pre-update, and then have it get an immutable copy of itself.
                                                                                    //   Pre-update may be necessary, as the update can be done on the inner item,
                                                                                    //    with the outer item needing to know the state beforehand.
                            
                                                                                    // Though maybe it could successfully get its last state on each update??
                                                                                    //   Not so sure of the effiency of pre-update.
                            
                                                                                    // Keeping the previous value on every update could make sense.
                                                                                    //   Data_Value could listen for its own value updates.
                                                                                    //    Try that for the moment.
                                                                                    //     No, the old and value must be given in those events.
                            
                                                                                    // pre-update does make sense after all.
                                                                                    //   gives a chance to make a copy of the latest value or hash.
                            
                            
                                                                                    current_outer_value = that.toImmutable();
                            
                            
                                                                                    
                            
                                                                                    
                            
                                                                                    const my_e = {
                                                                                        name,
                                                                                        event_originator: wrapped_value,
                                                                                        parent_event: e,
                            
                                                                                        //old: prev_outer_value,
                                                                                        value: current_outer_value
                                                                                        //old: prev,
                                                                                        //value: current_value
                                                                                    }
                                                                                    if (property_name) {
                                                                                        my_e.property_name = property_name;
                                                                                    }
                                                                                    my_e.property_index = property_index;
                            
                                                                                    
                                                                                    that.raise('change', my_e);
                            
                                                                                    // And need to set the current_outer_value in some other circumstances too.
                                                                                    
                                                                                    prev_outer_value = current_outer_value;
                            
                                                                                }
                                                                            })
                                                                            i++;
                                                                            return wrapped_value;
                                                                        });
                                                                        local_js_value = arr_wrapped_value_values;

                                                                        // And raise a change event???

                                                                        // OK, I think this has fixed the bug with the syncing example.

                                                                        const my_e = {
                                                                            name: 'value',
                                                                            //event_originator: wrapped_value,
                                                                            //parent_event: e,
                                                                            old: _previous_immutable_value,
                                                                            value: that.toImmutable()
                                                                        }
                
                
                                                                        //if (property_name) {
                                                                        //    my_e.property_name = property_name;
                                                                        //}
                                                                        //my_e.property_index = property_index;
                                                                        that.raise('change', my_e);

                                                                    }
                                                                }




                                                                

                                                                // But when the value itself / inside is a Data_Value....?
                                                                //   Generally will want to copy by value, and have data synced.
                                                                //    

                                                                // the Data_Value could (possibly) have a .map function.
                                                                //   Not now though. ????
                                                                //   May be very nice having it usable like an array.

                                                                

                                                                
                                                                
                    
                                                                
                                                                //register_value_change();
                                                            } else {
                    
                                                                // Just as Data_Values, no specific data_types.
                    
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
                                                                            //register_value_change();
                    
                                                                            // Need to sort out the tracking of the immutable values.
                    
                                                                            // Maybe only sort this out just prior to raising the change event here.
                                                                            //register_value_change();
                    
                                                                            // See about working out the current immutable value....
                    
                    
                                                                            const my_e = {
                                                                                name,
                                                                                event_originator: wrapped_value,
                                                                                parent_event: e,
                                                                                //old: _previous_immutable_value,
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
                                                                //register_value_change();
                    
                    
                    
                                                            }
                                                        } else {
                                                            // Don't wrap those inner values.
                                                            local_js_value = value;
                                                            //register_value_change();
                    
                                                        }
                                                    } else {
                                                        console.trace();
                                                        throw 'stop - number of properties not found';

                                                    }

                                                }
                                                create_array_with_wrapped_items();

                
                                                // Check conditions...
                                                //   setup (local) array of wrapped values.
                
                                                
                                            } else if (t === 'array') {

                                                // Yes, I think we can have cases where the array exists already.
                                                //   Would need to update that array / replace / update items within it.

                                                //console.log('local_js_value', local_js_value);
                                                //console.log('value', value);

                                                //console.trace();
                                                //throw 'stop';

                                                // So putting a Data_Value into an array....



                                                const t_value = tof(value);
                                                

                                                // so the value could be immutable.

                                                if (t_value === 'data_value') {
                                                    // then .length???

                                                    //console.log('value.value', value.value);

                                                    if (is_array(value.value)) {
                                                        // Go through each of them, using them to set the values in the existing array....

                                                        if (value.value.length === local_js_value.length) {

                                                            // go through that array, assigning to the existing array.

                                                            each(value.value, (inner_value, idx) => {
                                                                // Then if it's a Data_Value in that place...

                                                                // or Data_Model really...

                                                                if (inner_value instanceof Data_Model) {

                                                                    // Then see about setting the local_js_value[idx]
                                                                    //   And is that a Data_Model of some sort?

                                                                    // Does seem like there is quite a variety of possibilities
                                                                    //   and eventualities.

                                                                    // then set its value to the item in the local_js_value

                                                                    const matching_local_inner_value = local_js_value[idx];
                                                                    //console.log('matching_local_inner_value', matching_local_inner_value);

                                                                    if (inner_value.equals(matching_local_inner_value)) {

                                                                    } else {
                                                                        matching_local_inner_value.value = inner_value;
                                                                    }


                                                                    //console.log('inner_value', inner_value);
                                                                    //console.trace();
                                                                    //throw 'NYI';

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

                                                    //console.log('value.length', value.length);
                                                    //console.trace();
                                                    
                                                    // and maybe access inner_js_value to be clearer?



                                                } else {
                                                    //console.log('t_value', t_value);

                                                    if (t_value === 'array') {
                                                        // and the local_js_value....?

                                                        //console.log('local_js_value', local_js_value);

                                                        if (local_js_value.length === value.length) {
                                                            // go through that .value array???
                                                            const l = value.length;

                                                            // first check that local_js_value items are all Data_Model.
                                                            let all_local_js_items_are_data_model = true, c = 0;
                                                            do {
                                                                const local_item = local_js_value[c];
                                                                if (!(local_item instanceof Data_Model)) {
                                                                    all_local_js_items_are_data_model = false;
                                                                }
                                                                c++;
                                                            } while (all_local_js_items_are_data_model && c < l);

                                                            if (all_local_js_items_are_data_model) {
                                                                // then can set the values of these from the items we have....
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

                                                        // 

                                                        // already know it's an array.

                                                        // Set individually??

                                                        





                                                    } else {
                                                        console.log('value', value);

                                                        // Still part of 'set' code. 
                                                        //   Really long code now!



                                                        // The item already exists????
                                                        console.trace();
                                                        throw 'NYI';

                                                    }

                                                    
                                                }



                
                                                
                                            } else {
                
                
                                            }
                                        } else {
                                            // Not an array....
                
                                            // Then look at what the current value actually is....
                                            //   The value probably should not be an array here....
                                        }
                                    }
                                    array_specific_value_processing();

                                    const general_value_processing = () => {
                                        //console.log('general_value_processing local_js_value:', local_js_value);

                                        if (local_js_value instanceof Data_Value) {
                                            console.log('existing local_js_value instanceof Data_Value');
                                            console.log('local_js_value.value', local_js_value.value);
                                            console.log('local_js_value.data_type.name', local_js_value.data_type.name);
                
                                            console.trace();
                                            throw 'NYI';
                
                                        } else if (local_js_value instanceof Array) {

                                            // Still is array specific here....

                                            //console.log('existing local_js_value instanceof Array');
                                            //console.log('local_js_value.length', local_js_value.length);
                                            //console.log('');

                                            // An aside : perhaps 2 levels of View Model would help...
                                            //   But that's why we have the view.data.model.
                
                                            //console.log('**value', value);

                                            // is value is a Data_Model / Data_Value....
                                            //   Then use .equals to compare them to the array.
                                            //console.log('value', value);

                                            if (value instanceof Data_Model) { 

                                                //console.log('value is a Data_Model');
                                                
                                                if (value.equals(local_js_value)) {
                                                    //  Nothing to change in this case. Perhaps it should have been picked up sooner though.
                                                } else {

                                                    console.log('value', value);
                                                    console.log('local_js_value', local_js_value);

                                                    console.trace();
                                                    throw 'NYI';
                                                }

                                            } else if (value instanceof Array) {
                                                //console.log('value instanceof Array');
                                                //console.log('property_names.length', property_names.length);
                                                //console.log('value.length', value.length);

                                                if (property_names.length === value.length) {
                                                    //console.log('value array has correct number of items to fit the properties: ' + value.length);
                                                    if (property_data_types) {

                                                        const num_properties = property_names.length;
                                                        //let i_property = 0;
                                                        for (let i_property = 0; i_property < num_properties; i_property++) {
                                                            const name = property_names[i_property];
                                                            const data_type = property_data_types[i_property];
                                                            //console.log('[name, data_type]', [name, data_type]);


                                                            if (local_js_value[i_property] instanceof Data_Value) {
                                                                //console.log('found internal property Data_Value');
                                                                //console.log('value[i_property]', value[i_property]);

                                                                //console.log('pre set wrapped value to: ' + value[i_property]);


                                                                // But are we listening to the change events?
                                                                //   This change should be picked up.

                                                                local_js_value[i_property].value = value[i_property];





                                                                //console.log('local_js_value[i_property].value', local_js_value[i_property].value);
                                                            } else {
                                                                console.trace();
                                                                throw 'NYI';
                                                            }
                                                        }

                                                        // Need to be careful about something / fix it...
                                                        //   This needs to be clearly in some kind of 'setup' that only gets called once
                                                        //   when necessary

                                                        // Possibly some initialisation was does in the array specific value processing,
                                                        //   and this had worked before because it was run at this stage after the array
                                                        //   had been set up and filled with??? data_value instances.

                                                        // This may be a good sign in terms of the code path because it may be
                                                        //   trying to set a value of something (in an array??) that already has
                                                        //   the numbered property access set up.

                                                        //console.log('that', that);
                                                        // some kind of local variable like _numbered_property_access_has_been_set_up(_already);

                                                        // May only need to change / modify this when changing size of array.





                                                        if (numbered_property_access && !_numbered_property_access_has_been_set_up) {

                                                            // Check to see if it has the property already....?



                                                            // Need to make sure it wraps values on setting....

                                                            for (let i_property = 0; i_property < num_properties; i_property++) {
                                                                const name = property_names[i_property];
                                                                const data_type = property_data_types[i_property];


                                                                Object.defineProperty(this, i_property, {
                                                                    get() {
                                                                        //console.log('get i_property', i_property);
                                                                        return local_js_value[i_property];
                                                                    },
                                                                    set(value) {
                                                                        const item_already_there = local_js_value[i_property];

                                                                        //console.log('numbered_property_access item_already_there', item_already_there);

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
                                                                                    // Raise a change event???

                                                                                } else {
                                                                                    console.log('item_already_there', item_already_there);
                                                                                    console.trace();
                                                                                    throw 'stop';
                                                                                }

                                                                                /*
                                                                                if (value instanceof Data_Model) {
                                                                                } else {
                                                                                }
                                                                                */


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
                                                //console.log('');
                                            } else {
                                                console.log('value', value);
                                                console.log('local_js_value', local_js_value);

                                                console.log('value_equals_current', value_equals_current);
                                                console.log('immu', immu);
                                                // 

                                                // non-matching types.
                                                console.trace();
                                                throw 'NYI';
                
                                            }
                                        } else {
                                            //current_outer_value = that.toImmutable();

                                            
                                            // No, if it's a data_value, we get the value from that.
                                            //  And most likely need to do more processing to reconstruct inner things.

                                            // Create appropriate new Data_Value instances to represent values.

                                            if (value instanceof Data_Model) {

                                                // Need to look at the inner js value type of that Data_Model.

                                                // Check for data_type match / compatability...?

                                                if (value.data_type === that.data_type) {

                                                    const tvv = tof(value.value);
                                                    //console.log('tvv', tvv);
                                                    if (tvv === 'number' || tvv === 'string' || tvv === 'boolean') {
                                                        // set the inner js value with this....
                                                        local_js_value = value.value;

                                                    } else {
                                                        console.trace();
                                                        throw 'NYI';
                                                    }


                                                    //console.log('that.value', that.value);
                                                    //console.log('value.value', value.value);


                                                } else {
                                                    console.trace();
                                                    throw 'NYI';
                                                }

                                                //console.log('value.data_type', value.data_type);
                                            

                                                //onsole.log('that.data_type', that.data_type);
                                                //console.trace();
                                                //throw 'stop';

                                                
                                            } else {

                                                local_js_value = value;

                                            }



                                            

                                            // Not so sure about this here....
                                            //  
        
                                            // More specific ways to do with registering value changes....?
                                            //   Will work on that event system further.
        
                                            // Raise the value as an immutable too?

                                            // And it's working now, I think.

                                            // Not quite sure how efficient this overall system is / will be.
                                            //   Will be good for the intended use case I expect.
                                            //     Use case being UI integration.
                                            //       And then probably backend DB integration.
                                            //         More processing on the client to avoid making redundant updates,
                                            //         and to effiently send and receive information about the specific updates made.

                                            // Will do a bit more work on binding with server-side data.
                                            //   Need to consider access controls where necessary too.

                                            





        
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
                                //console.log('the value did not pass the 1st and later (parsed) stages of validation (data_value value set failed');


                            }
                            // Very longwinded set function?

                            // Can it be split logically?

                        } else {
                            //console.log('.set not making change because its been given the same value as it was (hence no change)');
                            // Seems to work now.

                        }
                        

                        
                    }
                });


            } else {

                console.trace();
                throw 'NYI';

            }


            

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
            if (data_type.numbered_property_access === true) {
                if (data_type.property_names) {
                    if (data_type.property_names.length <= 256) {
                        console.log('should set up Data_Value 2.0 numbered property access');
                    }
                }
            }
            */

            if (spec.value) {

                // 

                this.value = spec.value;


            }

        } else {


            //console.log('Data_Value spec.value', spec.value);
            field(this, 'value', spec.value);
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

    /*
    [util.inspect.custom](depth, opts) {
        const {value} = this;
        if (value instanceof Array) {
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
                    res = res + lpurple(item_value)
                } else [
                    res = res + lpurple(item)
                ]
            })
            res = res + ' ]';
            return res;
        } else {
            return lpurple(this.value);
        }
    }
    */

    // Seems OK for the moment, but worth bringing into a Base or Mutable_Or_Immutable_Data_Value.


    equals(other) {
        // Are they both Data_Values???
        // or use Data_Model ???

        // make a general equals here, give it this for the moment.
        //   the more general equals will be used recursively for comparing arrays.

        
        return more_general_equals(this, other);

    }


    'toString'() {
        return this.get() + '';
    }

    /*
    'toJSON'() {

        console.log('toJSON this.value', this.value);

        return JSON.stringify(this.value);
    }
    */

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

        

        //return JSON.stringify(this.value);
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
        //return 'foo = ' + this.foo.toUpperCase();
        // But then display it in a specific color....
        //return ldarkPurple(this.value);

        const {value} = this;

        const tv = tof(value);
        //console.log('tv', tv);

        if (tv === 'number' || tv === 'string' || tv === 'boolean') {
            return lpurple(value);
        } else {

            if (value instanceof Array) {
                // could go through each item in that array.
    
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
                //console.log('value instanceof Data_Model');
                //console.trace();
                //console.log('value', value);
                //throw 'stop';
                return value[util.inspect.custom]();
    
            } else {
    
                // Value could be a Data_Value / Data_Model....
                //console.log('other, this.value: ', this.value);
    
    
    
                return lpurple(this.value);
            }

        }

        
    }
}


module.exports = Data_Value;
