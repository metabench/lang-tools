
const {each, is_array} = require('lang-mini');

// collective(arr).bcr() for example.... would call the bcr function on every item in the array (or collection?) 

// would help to make ut support other data types.
//.  possibly ones that can expose an array interface???


// eg collect(ctrl.siblings).bcr().overlaps(ctrl.bcr().extend('left', 80)).max('width') >= 80 ????

// or do:

// ctrl.bcr().extend('left', 80).overlaps(collect(ctrl.siblings).bcr()).max('width') >= 80

// or:

//. Will be nice to allow dense syntax in an unambiguous way where possible.
//.   Would automatically carry out the 'collect' operation, but that could be a more advanced stage of the implementation doing that.

// Really concise syntax to express the things which would take quite a lot of likes of JS, but simple enough to be able
//.  to be expressed in one dense and very readable line.

// This would be a good piece of code for the Window control to express looking to its left and seeing if it overlaps any siblings
//.  within 80 px, and what the overlap is with similar syntax.



// ctrl.bcr().extend('left', 80).overlaps(ctrl.siblings).max('width') > 0

// A direct and readable syntax will help...
// ctrl.bcr.extend('left', 80).overlaps(ctrl.siblings).max('width') > 0



const collective = (arr) => {

    /*
    each(arr, (item) => {

    })
    */

    if (is_array(arr)) {
        //const ref_arr = [];
        

        const target = {
          };
          
        const handler2 = {
            get(target, prop, receiver) {
                // For item method calls (e.g., obj.method()), map the call to each item.
                if (arr.length > 0 && arr[0] && typeof arr[0][prop] === 'function') {
                    return (...a) => {
                        const res = [];
                        each(arr, item => {
                            res.push(item[prop](...a));
                        });
                        return res;
                    };
                }
                // Prefer direct properties, including array methods and indices.
                if (prop in arr) {
                    const val = arr[prop];
                    if (typeof val === 'function') return val.bind(arr);
                    return val;
                }
                // Otherwise collect property values from each item.
                const res = [];
                each(arr, item => {
                    res.push(item[prop]);
                });
                return res;
            }
        };
          
          const proxy2 = new Proxy(target, handler2);
          return proxy2;


    } else {
        console.trace();
        throw 'NYI';
    }


}

module.exports = collective;