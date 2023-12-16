const Base_Data_Value = require('./Base_Data_Value');
const {tof} = require('lang-mini');

class Data_String extends Base_Data_Value {
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
            } else if (ta0 === 'string') {
                spec = {value: a[0]};
                //init_with_spec(spec);
            }
        }
        super(spec);

    }
}

module.exports = Data_String;