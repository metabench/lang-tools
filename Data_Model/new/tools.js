const Data_Model = require('../Data_Model');
const {tof} = require('lang-mini');

const more_general_equals = (that, other) => {

    if (other instanceof Data_Model) {
        // Compare the values???

        // For the moment, get them as JSON....

        // Though it looks like getting the values as JSON is not working properly in some cases.

        

        const my_json = that.toJSON();
        const other_json = other.toJSON();



        //console.log('[my_json, other_json]', [my_json, other_json]);

        //console.trace();
        //throw 'stop';

        return my_json === other_json;

    } else {
        // what type is being stored in this????

        // look at .value????
        //   or the unwrapped value....?

        // Does it have a .value????

        //console.log('[that, other]', [that, other]);

        if (that === other) {
            return true;
        } else {

            if (that === undefined) {
                return false;
            } else {
                const {value} = that;

                const t_value = tof(value), t_other = tof(other);

                console.log('[t_value, t_other]', [t_value, t_other]);
                //console.log('*** [value, other]', [value, other]);

                if (t_value === t_other) {
                    console.log('*** [value, other]', [value, other]);

                    if (value === other) {
                        return true;
                    } else {
                        if (typeof value.equals === 'function' && typeof other.equals === 'function') {
                            return value.equals(other);
                        } else {

                            if (value === other) {
                                return true;
                            } else {

                                if (t_value === 'number' || t_value === 'string' || t_value === 'boolean') {
                                    return value === other;
                                } else {

                                    if (t_value === 'array') {
                                        // or tostring / tojson???

                                        if (value.length === other.length) {
                                            // compare each of them....

                                            let res = true, c = 0, l = value.length;

                                            do {
                                                res = more_general_equals(value[c], other[c]);
                                                c++;
                                            } while (res === true && c < l)
                                            return res;

                                        } else {
                                            return false;
                                        }

                                    } else {
                                        console.log('[value, other]', [value, other]);
                                        console.trace();
                                        throw 'NYI';

                                    }
                                }
                            }
                        }
                    }


                    
                } else {
                    // But number parsing etc....
                    return false;
                }


            }


            
        }




        
    }
}

module.exports = {
    more_general_equals


}