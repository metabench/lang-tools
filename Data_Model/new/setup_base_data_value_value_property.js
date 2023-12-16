const Validation_Success = require("./Validation_Success");


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


    Object.defineProperty(data_value, 'value', {

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
                //console.log('obj_transform_and_validate_value_results', obj_transform_and_validate_value_results);

                if (obj_transform_and_validate_value_results.validation instanceof Validation_Success) {
                    // need to check that it's changed....


                    if (obj_transform_and_validate_value_results.transformed_value !== undefined) {
                        const value_has_changed = local_js_value !== obj_transform_and_validate_value_results.transformed_value;

                        if (value_has_changed) {
                            set_value_with_valid_and_changed_value(obj_transform_and_validate_value_results.transformed_value);
                        } else {
                            // maybe nothing here now.

                        }
                    } else {
                        const value_has_changed = local_js_value !== obj_transform_and_validate_value_results.value;

                        if (value_has_changed) {
                            set_value_with_valid_and_changed_value(obj_transform_and_validate_value_results.value);
                        } else {
                            // maybe nothing here now.

                        }
                    }

                    

                }



            } else {
                set_value_with_valid_and_changed_value(value);
            }

            // Will make use of various subclass helper functions when they are available.




            // transform_validate_value
            // parse_validate_value

            //if (data_value.validate_value)

        }

    })


}

module.exports = setup_base_data_value_value_property;