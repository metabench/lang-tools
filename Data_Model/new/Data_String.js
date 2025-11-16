const Data_Value = require('./Data_Value');
const Validation_Success = require('./Validation_Success');
const Validation_Failure = require('./Validation_Failure');

const is_plain_object = value => value !== null && typeof value === 'object' && !Array.isArray(value);

const build_spec = (args) => {
    if (args.length === 1) {
        const first = args[0];
        if (is_plain_object(first)) {
            return {
                ...first,
                data_type: first.data_type || String
            };
        }
        if (typeof first !== 'undefined') {
            return {value: first, data_type: String};
        }
    } else if (args.length > 1) {
        return {value: args[0], data_type: String};
    }
    return {data_type: String};
};

class Data_String extends Data_Value {
    constructor(...a) {
        const spec = build_spec(a);
        super(spec);

        const default_transform = this.transform_validate_value;
        this.transform_validate_value = (value) => {
            if (value === undefined || value === null) {
                return {value, validation: new Validation_Failure({value})};
            }
            if (typeof default_transform === 'function') {
                return default_transform.call(this, value);
            }
            return {value, validation: new Validation_Success()};
        };

        if (spec && Object.prototype.hasOwnProperty.call(spec, 'value')) {
            this.value = spec.value;
        }
    }
}

module.exports = Data_String;