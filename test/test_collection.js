const test = require('node:test');
const assert = require('node:assert/strict');
const Collection = require('../lang').Collection;
//const Data_Value = require('../Data_Model/Data_Value');

test('Collection push, get, and each', (t) => {
    const coll = new Collection();
    coll.push('First');
    coll.push(123);
    coll.push({ name: "Test" });
    assert.strictEqual(coll.length(), 3);
    let count = 0;
    coll.each((item, key) => {
        count++;
        // Check that each item has a defined value (assume wrapping in Data_Value for primitives).
        assert.ok(item !== undefined);
    });
    assert.strictEqual(count, 3);
});

test('Collection insert and remove methods', (t) => {
    const coll = new Collection(['A', 'B', 'C']);
    // Insert an item at position 1.
    coll.insert("X", 1);
    // Check that the inserted item is present.
    assert.strictEqual(coll.get(1).value, "X");
    // Remove the new item.
    coll.remove(1);
    assert.strictEqual(coll.length(), 3);
});

test('Collection swap method (if implemented)', (t) => {
    const coll = new Collection(['One', 'Two']);
    if (typeof coll.swap === 'function') {
        // Dummy objects to test swap without full control implementation.
        // Here we simply ensure that the method can be called without error.
        assert.doesNotThrow(() => { coll.swap('dummy', 'dummy'); });
    }
});

test('Collection values and toObject methods', (t) => {
    const coll = new Collection(['A', 'B']);
    const vals = coll.value();
    assert.ok(Array.isArray(vals));
    // If items have a toObject method then toObject should return an array as well.
    const objs = coll.toObject();
    assert.ok(Array.isArray(objs));
});
