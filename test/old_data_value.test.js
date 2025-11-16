const OldDataValue = require('../Data_Model/old/Data_Value');
const Mini_Context = require('../Data_Model/Mini_Context');

const describeLegacy = process.env.RUN_LEGACY_TESTS === '1' ? describe : describe.skip;

describeLegacy('Old Data_Value - Legacy API tests', () => {
  test('constructor and get/value() methods', () => {
    const dv = new OldDataValue(10);
    expect(typeof dv.get).toBe('function');
    expect(typeof dv.value).toBe('function');
    expect(dv.get()).toBe(10);
    expect(dv.value()).toBe(10);
  });

  test('set() updates value and emits change', (done) => {
    const dv = new OldDataValue(5);
    dv.on('change', (e) => {
      expect(e.old).toBe(5);
      expect(e.value).toBe(15);
      done();
    });
    dv.set(15);
  });

  test('clone returns a new value with same contents', () => {
    const dv = new OldDataValue({a: 1});
    const clone = dv.clone();
    expect(clone).not.toBe(dv);
    expect(clone.get()).toEqual({a: 1});
  });

  test('_id() uses context when provided', () => {
    const ctx = new Mini_Context();
    const dv = new OldDataValue({value: 42, context: ctx});
    const id = dv._id();
    expect(typeof id).toBe('string');
    expect(id.length).toBeGreaterThan(0);
  });

  test('toJSON returns proper representation', () => {
    const dvStr = new OldDataValue('abc');
    const dvNum = new OldDataValue(123);
    expect(dvStr.toJSON()).toBe('"abc"');
    expect(dvNum.toJSON()).toBe(123);
  });
});
