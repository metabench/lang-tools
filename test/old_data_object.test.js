const OldDataObject = require('../Data_Model/old/Data_Object');
const OldDataValue = require('../Data_Model/old/Data_Value');

const describeLegacy = process.env.RUN_LEGACY_TESTS === '1' ? describe : describe.skip;

describeLegacy('Old Data_Object - Legacy behavior', () => {
  test('set and get create Data_Value wrappers for primitives', () => {
    const obj = new OldDataObject();
    obj.set('name', 'Alice');
    const got = obj.get('name');
    expect(got).toBeInstanceOf(OldDataValue);
    expect(got.value()).toBe('Alice');
  });

  test('set object as nested object value stores object reference', () => {
    const obj = new OldDataObject();
    const nested = {x: 1};
    obj.set('nested', nested);
    const got = obj.get('nested');
    expect(got).toBeInstanceOf(OldDataValue);
    expect(got.value()).toEqual(nested);
  });

  test('keys and toJSON', () => {
    const obj = new OldDataObject();
    obj.set('a', 1);
    obj.set('b', 'two');
    const keys = obj.keys();
    expect(keys).toContain('a');
    expect(keys).toContain('b');
    expect(obj.toJSON()).toEqual(expect.stringContaining('{"a":1,"b":"two"}'));
  });
});
