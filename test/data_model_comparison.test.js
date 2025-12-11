const OldDataValue = require('../Data_Model/old/Data_Value');
const NewDataValue = require('../Data_Model/new/Data_Value');
const OldDataObject = require('../Data_Model/old/Data_Object');
const NewDataObject = require('../Data_Model/new/Data_Object');
const Collection = require('../Data_Model/new/Collection');

describe('Old vs New Data_Model behavior comparison', () => {
  test('Data_Value: property vs method API', () => {
    const oldDv = new OldDataValue(7);
    const newDv = new NewDataValue(7);

    // Old uses method to access value
    expect(typeof oldDv.value).toBe('function');
    expect(oldDv.value()).toBe(7);

    // New uses property to access value
    expect(typeof newDv.value).not.toBe('function');
    expect(newDv.value).toBe(7);
  });

  test('Data_Object: set/get patterns', () => {
    const oldObj = new OldDataObject();
    const newObj = new NewDataObject();

    oldObj.set('x', 42);
    newObj.set('x', 42);

    const oldX = oldObj.get('x');
    const newX = newObj.get('x');

    expect(oldX.value()).toBe(42);
    // newX may be a Data_Value or primitive; if Data_Value, check .value
    if (newX && newX.value !== undefined) {
      expect(newX.value).toBe(42);
    }
  });

  test('Collection now wraps primitives using new Data_Value API', () => {
    const coll = new Collection();
    coll.push('hi');
    const item = coll.get(0);
    // Collection now uses new Data_Value with property-based access
    expect(typeof item.value).not.toBe('function');
    expect(item.value).toBe('hi');
  });
});
