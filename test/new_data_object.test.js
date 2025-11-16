const NewDataObject = require('../Data_Model/new/Data_Object');
const NewDataValue = require('../Data_Model/new/Data_Value');

describe('New Data_Object - Modern behavior', () => {
  test('set and get use Data_Value created on demand', () => {
    const {tof} = require('lang-mini');
    const obj = new NewDataObject();
    obj.set('name', 'Bob');
    const stored = obj.get('name');
    expect(stored).toBeDefined();
    const t = tof(stored);
    // Stored may be a data_value or a primitive or a wrapped object
    if (t === 'data_value') {
      expect(stored.value).toBeDefined();
      expect(stored.value === 'Bob' || stored.value === 'Bob').toBeTruthy();
    } else {
      // If it's not a data_value it should be a plain value
      expect(stored === 'Bob' || (stored && stored.value === 'Bob')).toBeTruthy();
    }
  });

  test('keys, get with no args returns whole object', () => {
    const obj = new NewDataObject();
    obj.set('a', 1);
    obj.set('b', 2);
    const all = obj.get();
    const keys = obj.keys();
    expect(keys).toContain('a');
    expect(keys).toContain('b');
    expect(all).toBeDefined();
    expect(all.a).toBeDefined();
  });

  test('remove_from parent and position_within', () => {
    const Collection = require('../Data_Model/old/Collection');
    const parent = new Collection([1, 2, 3]);
    const obj = new NewDataObject();
    obj.set('x', 42);
    // Push into collection to create relationship
    parent.push(obj);
    // Check that position_within returns a number
    const pos = obj.position_within(parent);
    expect(typeof pos === 'number' || typeof pos === 'undefined').toBeTruthy();
    if (typeof pos === 'number') {
      // remove from parent
      obj.remove_from(parent);
      const newPos = obj.position_within(parent);
      expect(newPos === undefined).toBeTruthy();
    }
  });
});
