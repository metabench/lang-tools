const Validation_Success = require("./Validation_Success");
const Validation_Failure = require("./Validation_Failure");


const setup_base_data_value_value_property = (data_value) => {

    let local_js_value;

    // but the old value too???
    //   do we need more complex usage of isomorphic code????

    const set_value_with_valid_and_changed_value = (valid_and_changed_value) => {

        const old = local_js_value;
        local_js_value = valid_and_changed_value;

        data_value.raise('change', {
            name: 'value',
            old,
            value: local_js_value
        })




    }


    const create_validation_error = (validation, value) => {
        const failure = validation instanceof Validation_Failure ? validation : new Validation_Failure({value});
        const error = new Error('Validation failed for value assignment');
        error.validation = failure;
        error.value = value;
        return error;
    }


    Object.defineProperty(data_value, 'value', {
        configurable: true,

        get() {
            return local_js_value;
        },
        set(value) {

            if (data_value.transform_validate_value) {

                // otherwise????
                //   nothing yet.

                // assume the other functions:
                // is_value_correct_type
                // can_value_be_parsed_to_correct_type
                // parse_value
                // validate_value


                // .assess_set ????

                // maybe a set_with_valid_value function?

                // get the transform and validare result obj

                const obj_transform_and_validate_value_results = data_value.transform_validate_value(value);
                const validation = obj_transform_and_validate_value_results && obj_transform_and_validate_value_results.validation;

                if (!(validation instanceof Validation_Success)) {
                    throw create_validation_error(validation, value);
                }

                const next_value = Object.prototype.hasOwnProperty.call(obj_transform_and_validate_value_results, 'transformed_value')
                    ? obj_transform_and_validate_value_results.transformed_value
                    : obj_transform_and_validate_value_results.value;

                if (!Object.is(local_js_value, next_value)) {
                    set_value_with_valid_and_changed_value(next_value);
                }



            } else {
                if (!Object.is(local_js_value, value)) {
                    set_value_with_valid_and_changed_value(value);
                }
            }

            // Will make use of various subclass helper functions when they are available.




            // transform_validate_value
            // parse_validate_value

            //if (data_value.validate_value)

        }

    })


}

module.exports = setup_base_data_value_value_property;