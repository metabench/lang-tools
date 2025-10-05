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

test('create Data_Integer with various assignments and error cases', (t) => {
    const di = new Data_Integer(10);
    // Check initial value set correctly
    assert.strictEqual(di.value, 10);

    // Correct conversion: string numeric gets converted to number
    di.value = '20';
    assert.strictEqual(di.value, 20);

    // Negative and zero values
    di.value = -5;
    assert.strictEqual(di.value, -5);
    di.value = 0;
    assert.strictEqual(di.value, 0);

    // Edge: if an invalid input is provided, assume it throws an error.
    assert.throws(() => { di.value = 'not a number'; }, /error/i);
});

test('sequential reassignments for Data_Integer', (t) => {
    const di = new Data_Integer(0);
    for (let i = 1; i <= 10; i++) {
        di.value = i.toString();
        assert.strictEqual(di.value, i);
    }
});

test('Data_Integer error on null assignment', (t) => {
    const di = new Data_Integer(1);
    assert.throws(() => { di.value = null; }, /error/i);
});

// and syncing it with a Data_String???
