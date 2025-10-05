
const Data_Number = require('./Data_Number');
const {Functional_Data_Type, tof, get_a_sig, get_item_sig, deep_sig} = require('lang-mini');
const setup_base_data_value_value_property = require('./setup_base_data_value_value_property');

const Validation_Success = require('./Validation_Success');
const Validation_Failure = require('./Validation_Failure');


// Need to better integrate validation and parsing.
//   A few functions that can be made easily and to a standard that specifies specific things for these fairly
//   simple typed Data_Model (single) value objects.

// These will all use .value

// Don't want to have to write more setter code here.
//   More general setter code can make use of parsing etc.


// An implementation in not too many lines here :)





class Data_Integer extends Data_Number {


    // And a specific test (in constructor?) to see that it's an integer????

    // Number.isInteger(n);

    constructor(...a) {
        const l = a.length;

        //const init_with_spec = spec => {
        //    super(spec);
        //}

        let spec;

        if (l === 1) {
            const ta0 = tof(a[0]);
            if (ta0 === 'object') {
                //init_with_spec(a[0]);
                spec = a[0];
            } else if (ta0 === 'number') {

                if (Number.isInteger(a[0])) {
                    spec = {value: a[0]};
                }

                
                //init_with_spec(spec);
            } else if (ta0 === 'string') {
                // Attempt to parse it....
                //   And still create the Data_Number when it's given something invalid to start?
                //     Seems best to. Maybe make some kind of data set / validation / type error.

                const parsed = parseFloat(a[0]);

                if (!Number.isNaN(parsed) && Number.isInteger(parsed)) {
                    spec = {value: parsed};
                }

                //init_with_spec(spec);
            }
        }
        super(spec);

        setup_base_data_value_value_property(this);

        if (spec.value) {
            this.value = spec.value;
        }
    }

    // Need a clearly structured system for validating what gets parsed.
    //   Validation_Success_But_Requires_Transformation ????

    // strict-input-type validation?

    // flexible input type validation???
    
    // more than validation???

    // parse_and_validate?

    // validate_possibly_transformed_value???

    // validate_value (enable_input_transform)

    // determine_input_transformation_appropriate_for_value ????

    // input transformation potential determination?

    // transform_input function????


    // Is worth being specific about input transformations.
    //   A relatively simple API may help... but do include a few key functions that can be called at the right times.

    // assess_input_validity???
    // 

    // transform_aware_validate_value????

    // but pre_set operations are determining if it can be transformed / parsed, then doing so if needed,
    // then validating data that gets through the input transformation (will often be parsing).

    // some pre_set_input_transform function(s)???

    // Does seem like this kind of lower level / mid level code could integrate well with low and high level code.

    // Just don't want too many class methods.
    //   Long class method names are space inefficient. Though could use shorthands when clear what they'd be.

    // assess_value?
    // assess_input_value???


    // parse_value(value) could help.
    //   always from string. maybe from JSON???


    //set_with_valid_value(value)

    //transform_value(value)

    // could_try_parsing_value ????
    // validation of the value type in terms of if it can be parsed?


    // Need a few specific ('helper?') functions to help with a more general set operation.
    //   Code that can be called to do some very specific tests / checks / processes.
    //   Don't want too many of them - but do need to be explicit about them.



    // set_value_with_valid_and_changed_value(value)
    //   A simple function that actually does the set would help, may well be lower level though.




    transform_validate_value(value) {

        // And explicitly check if it's different to the current????

        // And returns an object {value, transformed_value, validation}

        // Does it need to parse the value?

        let correctly_typed_value;
        // used transformation / parsing???

        let used_transformation = false;
        let has_correctly_typed_value = false;

        if (this.is_value_correct_type(value)) {
            correctly_typed_value = value;
            has_correctly_typed_value = true;
        } else {
            // can parse it....?

            if (this.can_value_be_parsed_to_correct_type(value)) {
                correctly_typed_value = this.parse_value(value);
                used_transformation = true;
                has_correctly_typed_value = true;
            }


        }

        if (has_correctly_typed_value) {

            const value_validation = this.validate_value(correctly_typed_value);

            if (value_validation instanceof Validation_Success) {

                if (used_transformation) {
                    return {value, transformed_value: correctly_typed_value, validation: value_validation}
                } else {
                    return {value, validation: value_validation}
                }

                
                

            } else if (value_validation instanceof Validation_Failure) {
                

                if (used_transformation) {
                    return {value, transformed_value: correctly_typed_value, validation: value_validation}
                } else {
                    return {value, validation: value_validation}
                }

            }

        }

        

    }

    // attempt_parse_value
    //   returns a Value_Parse_Attempt....
    //     This very specific typing could help a lot.

    is_value_correct_type(value) {
        const t_value = tof(value);

        if (t_value === 'number') {
            return true;

            //return value;
        }
        return false;
    }
    can_value_be_parsed_to_correct_type(value) {

        const t_value = tof(value);

        if (t_value === 'string') {
            return true;
        } else if (t_value === 'number') {
            return true;
        }
        return false;

    }

    parse_value(value) {

        // Parsing_Success???
        // Parsing_Failure???


        const t_value = tof(value);

        if (t_value === 'string') {
            const parsed = parseFloat(value);

            if (!Number.isNaN(parsed) && Number.isInteger(parsed)) {
                //spec = {value: parsed};
                return parsed;
            }
        } else if (t_value === 'number') {
            // Same check as above????
            if (!Number.isNaN(value) && Number.isInteger(value)) {
                //spec = {value: parsed};
                return value;
            }

            //return value;
        }

    }



    validate_value(value) {

        // More complex validation that is sure to return useful info on its success or failure, and reason(s).

        // Check it's a number????

        if (Number.isNaN(value)) {
            return new Validation_Failure();
        } else if (!Number.isInteger(value)) {
            return new Validation_Failure();
        }

        return new Validation_Success();


        //return (!Number.isNaN(value) && Number.isInteger(value))

        // And what about parsing it????




    }


    // Some 'validate' function here????
    // Something that helps the setter / the set attempt function(s).







}
let util;
if (typeof window === 'undefined') {
    const str_utl = 'util';
    util = require(str_utl);    
}

if (util) {
    const l_purple = x => '\x1b[38;5;129m' + x + '\x1b[0m';
    const l_light_brown = x => '\x1b[38;5;130m' + x + '\x1b[0m';
    const l_light_yellowy_brown = x => '\x1b[38;5;173m' + x + '\x1b[0m';

    const l_color = l_light_yellowy_brown;
    Data_Integer.prototype[util.inspect.custom] = function(depth, opts) {
        const {value} = this;
        const tv = tof(value);
        if (tv === 'number' || tv === 'string' || tv === 'boolean') {
            return l_color(value);
        } else {
            if (value instanceof Array) {
                let res = l_color('[ ');
                let first = true;
                each(value, item => {
                    if (!first) {
                        res = res + l_color(', ');
                    } else {
                        first = false;
                    }
                    if (item instanceof Data_Model) {
                        const item_value = item.value;
                        res = res + l_color(item_value)
                    } else [
                        res = res + l_color(item)
                    ]
                })
                res = res + l_color(' ]');
                return res;
            } else if (value instanceof Data_Model) {
                return value[util.inspect.custom]();
            } else {
                return l_color(this.value);
            }
        }
    }
}

module.exports = Data_Integer;