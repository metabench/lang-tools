const Data_Value = require('./Data_Value');

const is_plain_object = value => value !== null && typeof value === 'object' && !Array.isArray(value);

const coerce_number_input = input => {
    if (typeof input === 'string') {
        const parsed = parseFloat(input);
        if (!Number.isNaN(parsed)) {
            return parsed;
        }
    }
    return input;
};

const build_spec = (args) => {
    if (args.length === 1) {
        const first = args[0];
        if (is_plain_object(first)) {
            const spec = {...first};
            spec.data_type = spec.data_type || Number;
            if (Object.prototype.hasOwnProperty.call(spec, 'value')) {
                spec.value = coerce_number_input(spec.value);
            }
            return spec;
        }
        if (typeof first !== 'undefined') {
            return {value: coerce_number_input(first), data_type: Number};
        }
    } else if (args.length > 1) {
        return {value: coerce_number_input(args[0]), data_type: Number};
    }
    return {data_type: Number};
};

class Data_Number extends Data_Value {
    constructor(...a) {
        super(build_spec(a));
    }
}

module.exports = Data_Number;