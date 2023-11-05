
// Need to test Data_Object too.

// Data_Value

// Want to define data models and data values easily and intuitively, and automatically in some cases.
//   Would be nice to (automatically) allow single property read / read/write access to some properties.
//     Eg don't provide write access to a user id etc...
//       Don't give the client write access to prices set by the storefront.
//         Though server-side validation should prevent that hack from working, but it would make sense applying that principle.










const Collection = require('../collection');


const test_Collection = () => {
    const coll = new Collection();
    const arr_coll_keys = Object.keys(coll);
    console.log('arr_coll_keys', arr_coll_keys);

    coll.push('Item 1'); // Automatically wrapped in Data_Value. Major behaviour, keep that. May be very useful for some types of storage (in fact).
    coll.push('Item 2');
    coll.push('Item 3');

    let l = coll.length();
    console.log('l', l);

    coll.each((value, key) => {
        //console.log([value, key]);
        console.log('[key, value]', [key, value]);
    })

    // Length should be a getter, not function that needs calling.
    // . Possibly fix later after making more tests to see if it / what gets broken upstream.

    // Would be a breaking change in various places.
    // . Could use coll.len, with a new length function.
    // .  .len could maybe be introduced elsewhere. When the changeover is complete it will be shorthand for .length.

    // Keep things working for the moment.





}

test_Collection();