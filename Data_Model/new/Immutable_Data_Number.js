const Immutable_Base_Data_Value = require('./Immutable_Base_Data_Value');
const {is_defined, input_processors, field, tof, each} = require('lang-mini');

// Maybe making a much simpler, cut down version of Data_Value would help.
//   That code has become too complex to follow properly right now.
//   Making examples that use more specifically typed classes of Data may help.

// Data_Number_Array perhaps???
// Data_Number_Matrix?
// Data_Number_Tensor????

class Immutable_Data_Number extends Immutable_Base_Data_Value {
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

    }
}

module.exports = Immutable_Data_Number;