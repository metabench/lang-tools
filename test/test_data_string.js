const assert = require('node:assert/strict');
const test = require('node:test');
const Data_String = require('../Data_Model/new/Data_String');
// Optionally, if syncing is supported between Data_String and Data_Integer:
const Data_Integer = require('../Data_Model/new/Data_Integer');

test('create Data_String and basic assignments', () => {
    let ds = new Data_String("hello");
    assert.strictEqual(ds.value, "hello");

    // Change the string
    ds.value = "world";
    assert.strictEqual(ds.value, "world");

    // Assign a number and assume conversion to string
    ds.value = 123;
    assert.strictEqual(ds.value, "123");

    // Invalid assignment should throw an error, e.g. undefined input
    assert.throws(() => { ds.value = undefined; }, /error/i);
});

test('sync between Data_String and Data_Integer', () => {
    // Create a string and integer pair that sync: integer sets should update string.
    let ds = new Data_String("10");
    let di = new Data_Integer(10);
    
    Data_String.sync(ds, di);
    // Change integer value should update string version.
    di.value = 50;
    assert.strictEqual(di.value, 50);
    assert.strictEqual(ds.value, "50");

    // Change string value (numeric string) should update integer version.
    ds.value = "75";
    // di may convert the string, so check numeric equality.
    assert.strictEqual(di.value, 75);
    assert.strictEqual(typeof ds.value, 'string');
});

test('Data_String special characters manipulation', () => {
    let ds = new Data_String(" test ");
    // Trim spaces and check result.
    ds.value = ds.value.trim();
    assert.strictEqual(ds.value, "test");
});

test('Data_String error on assigning a non-convertible object', () => {
    let ds = new Data_String("init");
    assert.throws(() => { ds.value = { a: 1 }; }, /error/i);
});
