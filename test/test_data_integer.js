const test = require('node:test');
const assert = require('node:assert/strict');
const Data_Integer = require('../Data_Model/new/Data_Integer');


const {Functional_Data_Type, tof, get_a_sig, get_item_sig, deep_sig} = require('lang-mini');

test('create Data_Integer(3)', (t) => {
    // This test passes because it does not throw an exception.
    //assert.strictEqual(1, 1);

    // But better to specify the value????
    //   More explicitly?
    //     Though maybe if given an object, always treat that as the spec.

    const di = new Data_Integer(3);
    console.log('di', di);
    console.log('di.value', di.value);
    assert.strictEqual(di.value, 3);


    di.value = 4;
    console.log('di.value', di.value);
    assert.strictEqual(di.value, 4);


    // Setting the value of the Data_Integer should parse it to the correct type.
    //   Maybe have some kinds of smaller and more specific functions in the subclasses, such as validate_input_format_acceptable???
    //   is_input_format_acceptable???
    // . is_input_type_acceptable???
    //     eg parsable: true?
    //        acceptable: true,
    //        will_transform_from: 'string'????


    di.value = '5';
    console.log('di.value', di.value);
    assert.strictEqual(di.value, 5);




});


// and syncing it with a Data_String????
