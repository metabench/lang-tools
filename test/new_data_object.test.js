const NewDataObject = require('../Data_Model/new/Data_Object');
const NewDataValue = require('../Data_Model/new/Data_Value');

describe('New Data_Object - Modern behavior', () => {
  test('set and get use Data_Value created on demand', () => {
    const { tof } = require('lang-mini');
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

  test('set updates existing Data_Value without calling .value() as a function', () => {
    const { tof } = require('lang-mini');
    const obj = new NewDataObject();
    obj.set('name', 'Bob');
    expect(() => obj.set('name', 'Alice')).not.toThrow();
    const stored = obj.get('name');
    const t = tof(stored);
    if (t === 'data_value') {
      expect(stored.value).toBe('Alice');
    } else {
      expect(stored === 'Alice' || (stored && stored.value === 'Alice')).toBeTruthy();
    }
  });

  test('set supports null and can update after null', () => {
    const { tof } = require('lang-mini');
    const obj = new NewDataObject();
    expect(() => obj.set('x', null)).not.toThrow();
    const stored1 = obj.get('x');
    const t1 = tof(stored1);
    if (t1 === 'data_value') {
      expect(stored1.value).toBe(null);
    } else {
      expect(stored1).toBe(null);
    }

    expect(() => obj.set('x', 5)).not.toThrow();
    const stored2 = obj.get('x');
    const t2 = tof(stored2);
    if (t2 === 'data_value') {
      expect(stored2.value).toBe(5);
    } else {
      expect(stored2 === 5 || (stored2 && stored2.value === 5)).toBeTruthy();
    }
  });

  test('ensure_data_value provides a stable node and change event includes data_value', () => {
    const obj = new NewDataObject();

    const dv1 = obj.ensure_data_value('name');
    expect(dv1).toBeDefined();
    expect(dv1.__data_value).toBeTruthy();

    let last_event;
    obj.on('change', (e) => last_event = e);

    obj.set('name', 'Bob');
    const dv2 = obj.get('name');
    expect(dv2).toBe(dv1);
    expect(dv2.value).toBe('Bob');

    expect(last_event).toBeDefined();
    expect(last_event.name).toBe('name');
    expect(last_event.value).toBe('Bob');
    expect(last_event.data_value).toBe(dv1);

    obj.set('name', 'Alice');
    const dv3 = obj.get('name');
    expect(dv3).toBe(dv1);
    expect(dv3.value).toBe('Alice');
    expect(last_event.value).toBe('Alice');
    expect(last_event.data_value).toBe(dv1);
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
    const Collection = require('../Data_Model/new/Collection');
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

describe('Data_Object.set() — old field in change events', () => {
  test('old is undefined when setting a new key', () => {
    const obj = new NewDataObject();
    let last_event;
    obj.on('change', (e) => last_event = e);

    obj.set('name', 'Bob');
    expect(last_event).toBeDefined();
    expect(last_event.name).toBe('name');
    expect(last_event.old).toBeUndefined();
  });

  test('old contains the previous unwrapped value on update', () => {
    const obj = new NewDataObject();
    obj.set('name', 'Bob');

    let last_event;
    obj.on('change', (e) => last_event = e);

    obj.set('name', 'Alice');
    expect(last_event).toBeDefined();
    expect(last_event.name).toBe('name');
    expect(last_event.old).toBe('Bob');
  });

  test('old contains previous value when Data_Value is used', () => {
    const obj = new NewDataObject();
    const dv = obj.ensure_data_value('count', 0);

    let last_event;
    obj.on('change', (e) => last_event = e);

    obj.set('count', 10);
    expect(last_event).toBeDefined();
    expect(last_event.old).toBe(0);

    obj.set('count', 20);
    expect(last_event.old).toBe(10);
  });

  test('old is present in bubbled (dotted-path) change events', () => {
    const obj = new NewDataObject();
    const child = new NewDataObject();
    obj.set('child', child);
    child.set('x', 1);

    let last_event;
    obj.on('change', (e) => last_event = e);

    obj.set('child.x', 99);
    expect(last_event).toBeDefined();
    expect(last_event.name).toBe('child.x');
    expect(last_event.bubbled).toBe(true);
    expect(last_event.old).toBe(1);
  });
});

describe('Data_Object.set() — property accessor creation', () => {
  test('obj.x = 2 triggers change event after obj.set("x", 1)', () => {
    const obj = new NewDataObject();
    obj.set('x', 1);

    let last_event;
    obj.on('change', (e) => last_event = e);

    obj.x = 2;
    expect(last_event).toBeDefined();
    expect(last_event.name).toBe('x');
  });

  test('obj.get("x") returns updated value after obj.x = 2', () => {
    const obj = new NewDataObject();
    obj.set('x', 1);
    obj.x = 2;
    // get() returns the internal stored value (Data_Value or raw)
    const stored = obj.get('x');
    const val = (stored && stored.__data_value) ? stored.value : stored;
    expect(val).toBe(2);
  });

  test('obj.x returns unwrapped value via property accessor', () => {
    const obj = new NewDataObject();
    obj.set('x', 42);
    expect(obj.x).toBe(42);
  });

  test('private keys (_foo) do not get accessors', () => {
    const obj = new NewDataObject();
    obj.set('_foo', 'secret');
    const desc = Object.getOwnPropertyDescriptor(obj, '_foo');
    // Should either not exist as accessor, or not have a getter
    expect(!desc || typeof desc.get !== 'function').toBe(true);
  });

  test('double-underscore keys (__bar) do not get accessors', () => {
    const obj = new NewDataObject();
    // __bar may be reserved, but set should not create an accessor
    obj.set('__bar', 'hidden');
    const desc = Object.getOwnPropertyDescriptor(obj, '__bar');
    expect(!desc || typeof desc.get !== 'function').toBe(true);
  });

  test('dotted paths (a.b) do not get accessors on the dotted name', () => {
    const obj = new NewDataObject();
    const child = new NewDataObject();
    obj.set('a', child);
    obj.set('a.b', 5);
    // 'a.b' as a single property name should NOT have an accessor
    const desc = Object.getOwnPropertyDescriptor(obj, 'a.b');
    expect(!desc || typeof desc.get !== 'function').toBe(true);
  });

  test('existing getter/setter descriptors are not overwritten', () => {
    const obj = new NewDataObject();
    let custom_val = 'original';
    Object.defineProperty(obj, 'custom', {
      enumerable: true,
      configurable: true,
      get() { return custom_val; },
      set(v) { custom_val = v; }
    });

    // set() should not overwrite the custom accessor
    obj.set('custom', 'new_value');
    // The custom getter should still be intact
    const desc = Object.getOwnPropertyDescriptor(obj, 'custom');
    expect(typeof desc.get).toBe('function');
    // The custom getter should still return 'original' (not routed through Data_Object internals)
    expect(obj.custom).toBe('original');
  });
});
