
const {each, is_array} = require('lang-mini');

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
                if (arr.hasOwnProperty(prop)) {
                    return arr[prop];
                } else {
                    
                    if (typeof arr[0][prop] === 'function') {

                        return (...a) => {
                            const res = [];
                            each(arr, item => {
                                res.push(item[prop](...a));
                            })
                            return res;
                        }

                        // Call the function on all of them
                    } else {
                        const res = [];
                        each(arr, item => {
                            res.push(item[prop]);
                        })
                        return res;
                    }

                    
                }

              //return "world";
            },
          };
          
          const proxy2 = new Proxy(target, handler2);
          return proxy2;


    } else {
        console.trace();
        throw 'NYI';
    }


}

module.exports = collective;