const test = require('node:test');
const assert = require('node:assert/strict');
const Data_Value = require('../Data_Model/Data_Value');

// And some more complex syncing tests too possibly.
//   Need to investigate why some syncing on the UI fails when updating a field that's already been set by syncing.

// Maybe have some kind of 'debug mode' controls?
//   Or options for when in debug mode?
//     More logging?

// Something like a Data_Model_Instruction_Log could help.
// Data_Model_Change_Log???

// Data_Model_Update?????

// May be best to get much more specific about some things.

// The syncing code could be improved / have extra logging put in place.
//   Want to see exactly when a change fails.












const {Functional_Data_Type, tof, get_a_sig, get_item_sig, deep_sig} = require('lang-mini');

test('create data_value(3)', (t) => {
    // This test passes because it does not throw an exception.
    //assert.strictEqual(1, 1);

    // But better to specify the value????
    //   More explicitly?
    //     Though maybe if given an object, always treat that as the spec.

    const dv = new Data_Value(3);
    //console.log('dv', dv);
    assert.strictEqual(dv.value, 3);

});


test('create data_value(3), create data_value(4), sync them, modify their values, check syncing is working', (t) => {
    // This test passes because it does not throw an exception.
    //assert.strictEqual(1, 1);

    // But better to specify the value????
    //   More explicitly?
    //     Though maybe if given an object, always treat that as the spec.

    const [dv1, dv2] = [new Data_Value(3), new Data_Value(4)];

    //console.log('[dv1, dv2]', [dv1, dv2]);

    assert.strictEqual(dv1.value, 3);
    assert.strictEqual(dv2.value, 4);

    // Making a sync function could help (a lot).

    Data_Value.sync(dv1, dv2);

    // Will sync changes....

    dv2.value = 5;
    assert.strictEqual(dv1.value, 5);
    assert.strictEqual(dv2.value, 5);
    //console.log('[dv1, dv2]', [dv1, dv2]);

    dv1.value = 6;
    assert.strictEqual(dv1.value, 6);
    assert.strictEqual(dv2.value, 6);

    //console.log('[dv1, dv2]', [dv1, dv2]);

    dv2.value = 7;
    assert.strictEqual(dv1.value, 7);
    assert.strictEqual(dv2.value, 7);
    //console.log('[dv1, dv2]', [dv1, dv2]);
});



test('create integer typed data_value(3)', (t) => {
    // This test passes because it does not throw an exception.
    //assert.strictEqual(1, 1);

    // But better to specify the value????
    //   More explicitly?
    //     Though maybe if given an object, always treat that as the spec.

    const dv = new Data_Value({value: 3, data_type: Functional_Data_Type.integer});
    //console.log('dv', dv);
    //console.log('dv.data_type.name', dv.data_type.name);
    assert.strictEqual(dv.data_type.name, 'integer');
    assert.strictEqual(dv.value, 3);

});



test('create integer typed data_value(3), string data_value("4"), syncing tests', (t) => {
    // This test passes because it does not throw an exception.
    //assert.strictEqual(1, 1);

    // But better to specify the value????
    //   More explicitly?
    //     Though maybe if given an object, always treat that as the spec.

    const dv1 = new Data_Value({value: 3, data_type: Functional_Data_Type.integer});
    //console.log('dv', dv);
    //console.log('dv.data_type.name', dv.data_type.name);
    assert.strictEqual(dv1.data_type.name, 'integer');
    assert.strictEqual(dv1.value, 3);


    const dv2 = new Data_Value({value: '4', data_type: String});

    assert.strictEqual(dv2.value, '4');

    // Then sync them, see how they update. Can they assign the correct types?




    //console.log('dv2', dv2);


    Data_Value.sync(dv1, dv2);
    //console.log('[dv1, dv2]', [dv1, dv2]);

    dv1.value = 5;

    // When the number dv is set, it must update the string dv too.
    //   Perhaps Data_Value should be redone.


    //console.log('[dv1, dv2]', [dv1, dv2]);
    //console.log('[dv1.value, dv2.value]', [dv1.value, dv2.value]);



    assert.strictEqual(typeof dv1.value, 'number');
    assert.strictEqual(typeof dv2.value, 'string');

    assert.strictEqual(dv1.value, 5);
    assert.strictEqual(dv2.value, '5'); // So this has detected a bug.
    // Need to investigate why the syncing (when setting the integer one) does not cause the update in the string one.

    dv2.value = '6';

    assert.strictEqual(typeof dv1.value, 'number');
    assert.strictEqual(typeof dv2.value, 'string');

    assert.strictEqual(dv1.value, 6);
    assert.strictEqual(dv2.value, '6');

    //console.log('[dv1, dv2]', [dv1, dv2]);
    //console.log('[dv1.value, dv2.value]', [dv1.value, dv2.value]);

});


// See about syncing both 


// And then syncing between multiple types?
//   Simulated controls possibly.

// Number typed Data_Value.
//   Or integer.

// Perhaps Data_Number will help to keep some things simple too.
// Data_Value may be an attempt to be too versitile. At least for the moment.

// Using Data_Number, even Data_Integer, as a simpler to implement type of Data_Value with a more restricted and precise API.



// This seems like a good way to get into exploring the update procedures, the various code paths, and why they sometimes fail.










