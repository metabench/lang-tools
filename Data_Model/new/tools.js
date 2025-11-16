const Data_Model = require('../Data_Model');
const {tof} = require('lang-mini');

const more_general_equals = (that, other) => {
    const t_that = tof(that), t_other = tof(other);

    if (t_that !== t_other) return false;

    // Handle primitives and simple cases first
    if (t_that === 'number' || t_that === 'string' || t_that === 'boolean' || t_that === 'undefined' || t_that === 'null') {
        return Object.is(that, other);
    }

    // Arrays: deep compare
    if (t_that === 'array') {
        if (!Array.isArray(other) || that.length !== other.length) return false;
        for (let i = 0; i < that.length; i++) {
            if (!more_general_equals(that[i], other[i])) return false;
        }
        return true;
    }

    // Data_Model instances: compare via toJSON to avoid possible equals recursion
    if (that instanceof Data_Model && other instanceof Data_Model) {
        if (typeof that.toJSON === 'function' && typeof other.toJSON === 'function') {
            return that.toJSON() === other.toJSON();
        }
        // Fall back to shallow equality
        if (that === other) return true;
        return false;
    }

    // If `that` has a `value` property (eg Data_Value wrapper), compare inner value
    if (t_that === 'object' && 'value' in that) {
        return more_general_equals(that.value, other);
    }

    // Generic object deep-compare (shallow keys)
    if (t_that === 'object') {
        const keysA = Object.keys(that);
        const keysB = Object.keys(other);
        if (keysA.length !== keysB.length) return false;
        for (const k of keysA) {
            if (!Object.prototype.hasOwnProperty.call(other, k)) return false;
            if (!more_general_equals(that[k], other[k])) return false;
        }
        return true;
    }

    // Fallback
    return Object.is(that, other);
};

module.exports = {
    more_general_equals
};