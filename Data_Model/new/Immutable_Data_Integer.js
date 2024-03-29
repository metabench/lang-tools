
const Immutable_Data_Number = require('./Immutable_Data_Number');


class Immutable_Data_Integer extends Immutable_Data_Number {


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

    }



}

module.exports = Immutable_Data_Integer;