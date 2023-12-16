const Base_Data_Value = require('./Base_Data_Value');
const {Functional_Data_Type, tof, get_a_sig, get_item_sig, deep_sig} = require('lang-mini');

// Maybe making a much simpler, cut down version of Data_Value would help.
//   That code has become too complex to follow properly right now.
//   Making examples that use more specifically typed classes of Data may help.

// Data_Number_Array perhaps???
// Data_Number_Matrix?
// Data_Number_Tensor????

// input analysis...???
// get the parsed input, if it parses
// get some info about what type was parsed to what type
//   Parse_Info?
//   Successful_Parse object???
// whether the parsed value matches the current / old value, so there is no need to carry out any set operation.
//   Value_Set_Successful_Attempt
//   Value_Set_Failed_Attempt

// whether the parsed value is then valid

// prepare_potential_set_operation ???

// then determines whether / how to proceed???


// set_valid_value(value) ???





const setup_base_data_value_value_property = require('./setup_base_data_value_value_property');
// .validate_value


class Data_Number extends Base_Data_Value {
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
                spec = {value: a[0]};
                //init_with_spec(spec);
            } else if (ta0 === 'string') {
                // Attempt to parse it....
                //   And still create the Data_Number when it's given something invalid to start?
                //     Seems best to. Maybe make some kind of data set / validation / type error.

                const parsed = parseFloat(a[0]);

                if (!Number.isNaN(parsed)) {
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
}

module.exports = Data_Number;