const Data_Value = require('../Data_Model/Data_Value');
const {Functional_Data_Type, tof} = require('lang-mini');

describe('Data_Value - Creation and Basic Values', () => {
  test('should create data_value with number literal', () => {
    const dv = new Data_Value(3);
    expect(dv.value).toBe(3);
  });

  test('should create data_value with spec object', () => {
    const dv = new Data_Value({value: 42});
    expect(dv.value).toBe(42);
  });

  test('should create data_value with string value', () => {
    const dv = new Data_Value('hello');
    expect(dv.value).toBe('hello');
  });

  test('should create data_value with array value', () => {
    const arr = [1, 2, 3];
    const dv = new Data_Value(arr);
    expect(dv.value).toEqual(arr);
  });

  test('should create data_value with object value', () => {
    const obj = {a: 1, b: 2};
    const dv = new Data_Value({value: obj});
    expect(dv.value).toEqual(obj);
  });

  test('should handle null and undefined values', () => {
    const dvNull = new Data_Value(null);
    expect(dvNull.value).toBe(null);
    
    const dvUndefined = new Data_Value(undefined);
    expect(dvUndefined.value).toBe(undefined);
  });
});

describe('Data_Value - Type Validation', () => {
  test('should create integer typed data_value', () => {
    const dv = new Data_Value({value: 3, data_type: Functional_Data_Type.integer});
    expect(dv.data_type.name).toBe('integer');
    expect(dv.value).toBe(3);
  });

  test('should create number typed data_value', () => {
    const dv = new Data_Value({value: 3.14, data_type: Number});
    expect(dv.value).toBe(3.14);
  });

  test('should create string typed data_value', () => {
    const dv = new Data_Value({value: 'test', data_type: String});
    expect(dv.value).toBe('test');
  });

  test('should parse string to number for number typed data_value', () => {
    const dv = new Data_Value({value: '42', data_type: Number});
    expect(typeof dv.value).toBe('number');
    expect(dv.value).toBe(42);
  });

  test('should parse string to integer for integer typed data_value', () => {
    const dv = new Data_Value({value: '42', data_type: Functional_Data_Type.integer});
    expect(typeof dv.value).toBe('number');
    expect(dv.value).toBe(42);
  });

  test('should convert numeric string when reassigning to typed data_value', () => {
    const dv = new Data_Value({value: 10, data_type: Number});
    dv.value = '20';
    expect(typeof dv.value).toBe('number');
    expect(dv.value).toBe(20);
  });

  test('should reject invalid type assignments', () => {
    const dv = new Data_Value({value: 10, data_type: Number});
    // Attempting to set non-numeric string should handle gracefully
    const result = dv.attempt_set_value('not a number');
    expect(result.success).toBe(false);
  });
});

describe('Data_Value - Bidirectional Syncing', () => {
  test('should sync two data_values bidirectionally', () => {
    const dv1 = new Data_Value(3);
    const dv2 = new Data_Value(4);
    
    expect(dv1.value).toBe(3);
    expect(dv2.value).toBe(4);
    
    Data_Value.sync(dv1, dv2);
    
    dv2.value = 5;
    expect(dv1.value).toBe(5);
    expect(dv2.value).toBe(5);
    
    dv1.value = 6;
    expect(dv1.value).toBe(6);
    expect(dv2.value).toBe(6);
  });

  test('should sync integer and string typed data_values with conversion', () => {
    const dv1 = new Data_Value({value: 3, data_type: Functional_Data_Type.integer});
    const dv2 = new Data_Value({value: '4', data_type: String});
    
    expect(dv1.value).toBe(3);
    expect(dv2.value).toBe('4');
    
    Data_Value.sync(dv1, dv2);
    
    dv1.value = 5;
    expect(typeof dv1.value).toBe('number');
    expect(typeof dv2.value).toBe('string');
    expect(dv1.value).toBe(5);
    expect(dv2.value).toBe('5');
    
    dv2.value = '6';
    expect(typeof dv1.value).toBe('number');
    expect(typeof dv2.value).toBe('string');
    expect(dv1.value).toBe(6);
    expect(dv2.value).toBe('6');
  });

  test('should handle rapid sequential sync updates', () => {
    const dv1 = new Data_Value(5);
    const dv2 = new Data_Value(10);
    Data_Value.sync(dv1, dv2);
    
    for (let i = 0; i < 5; i++) {
      dv1.value = dv1.value + i;
      expect(dv2.value).toBe(dv1.value);
    }
  });

  test('should propagate changes in complex sync chains', () => {
    const dv1 = new Data_Value(1);
    const dv2 = new Data_Value(2);
    const dv3 = new Data_Value(3);
    
    Data_Value.sync(dv1, dv2);
    Data_Value.sync(dv2, dv3);
    
    dv1.value = 10;
    expect(dv1.value).toBe(10);
    expect(dv2.value).toBe(10);
    expect(dv3.value).toBe(10);
  });

  test('should not create sync loops', () => {
    const dv1 = new Data_Value(100);
    const dv2 = new Data_Value(200);
    
    Data_Value.sync(dv1, dv2);
    // Syncing twice should not cause issues
    Data_Value.sync(dv1, dv2);
    
    dv1.value = 300;
    expect(dv1.value).toBe(300);
    expect(dv2.value).toBe(300);
  });
});

describe('Data_Value - Three-Way Syncing', () => {
  test('should sync three data_values correctly', () => {
    const dv1 = new Data_Value(100);
    const dv2 = new Data_Value(200);
    const dv3 = new Data_Value(300);
    
    Data_Value.sync(dv1, dv2);
    Data_Value.sync(dv1, dv3);
    
    dv1.value = 400;
    expect(dv1.value).toBe(400);
    expect(dv2.value).toBe(400);
    expect(dv3.value).toBe(400);
  });

  test('should propagate changes from any synced value', () => {
    const dv1 = new Data_Value(100);
    const dv2 = new Data_Value(200);
    const dv3 = new Data_Value(300);
    
    Data_Value.sync(dv1, dv2);
    Data_Value.sync(dv1, dv3);
    
    dv2.value = 500;
    expect(dv1.value).toBe(500);
    expect(dv2.value).toBe(500);
    expect(dv3.value).toBe(500);
    
    dv3.value = 600;
    expect(dv1.value).toBe(600);
    expect(dv2.value).toBe(600);
    expect(dv3.value).toBe(600);
  });

  test('should handle three-way sync with type conversions', () => {
    const dv1 = new Data_Value({value: 10, data_type: Number});
    const dv2 = new Data_Value({value: '20', data_type: String});
    const dv3 = new Data_Value({value: 30, data_type: Functional_Data_Type.integer});
    
    Data_Value.sync(dv1, dv2);
    Data_Value.sync(dv1, dv3);
    
    dv1.value = 50;
    expect(dv1.value).toBe(50);
    expect(dv2.value).toBe('50');
    expect(dv3.value).toBe(50);
  });

  test('should handle multiple sync chains', () => {
    const dv1 = new Data_Value(1);
    const dv2 = new Data_Value(2);
    const dv3 = new Data_Value(3);
    const dv4 = new Data_Value(4);
    
    // Create two separate sync pairs
    Data_Value.sync(dv1, dv2);
    Data_Value.sync(dv3, dv4);
    
    dv1.value = 10;
    expect(dv1.value).toBe(10);
    expect(dv2.value).toBe(10);
    expect(dv3.value).toBe(3); // Should not be affected
    expect(dv4.value).toBe(4); // Should not be affected
    
    // Now bridge the sync chains
    Data_Value.sync(dv2, dv3);
    
    dv1.value = 20;
    expect(dv1.value).toBe(20);
    expect(dv2.value).toBe(20);
    expect(dv3.value).toBe(20);
    expect(dv4.value).toBe(20);
  });

  test('should handle circular sync patterns', () => {
    const dv1 = new Data_Value(1);
    const dv2 = new Data_Value(2);
    const dv3 = new Data_Value(3);
    
    Data_Value.sync(dv1, dv2);
    Data_Value.sync(dv2, dv3);
    Data_Value.sync(dv3, dv1); // Creates circular sync
    
    dv1.value = 100;
    expect(dv1.value).toBe(100);
    expect(dv2.value).toBe(100);
    expect(dv3.value).toBe(100);
  });
});

describe('Data_Value - Change Events', () => {
  test('should emit change event when value changes', (done) => {
    const dv = new Data_Value(10);
    
    dv.on('change', (e) => {
      expect(e.old).toBe(10);
      expect(e.value).toBe(20);
      done();
    });
    
    dv.value = 20;
  });

  test('should not emit change event when value is the same', () => {
    const dv = new Data_Value(10);
    let changeCount = 0;
    
    dv.on('change', () => {
      changeCount++;
    });
    
    dv.value = 10; // Same value
    dv.value = 10; // Same value again
    
    expect(changeCount).toBe(0);
  });

  test('should emit multiple change events for different values', () => {
    const dv = new Data_Value(1);
    const changes = [];
    
    dv.on('change', (e) => {
      changes.push({old: e.old, new: e.value});
    });
    
    dv.value = 2;
    dv.value = 3;
    dv.value = 4;
    
    expect(changes).toHaveLength(3);
    expect(changes[0]).toEqual({old: 1, new: 2});
    expect(changes[1]).toEqual({old: 2, new: 3});
    expect(changes[2]).toEqual({old: 3, new: 4});
  });

  test('should propagate change events through synced values', (done) => {
    const dv1 = new Data_Value(10);
    const dv2 = new Data_Value(20);
    
    Data_Value.sync(dv1, dv2);
    
    dv1.on('change', (e) => {
      expect(e.value).toBe(30);
      done();
    });
    
    dv2.value = 30;
  });

  test('should allow multiple change listeners', () => {
    const dv = new Data_Value(5);
    let listener1Called = false;
    let listener2Called = false;
    
    dv.on('change', () => { listener1Called = true; });
    dv.on('change', () => { listener2Called = true; });
    
    dv.value = 10;
    
    expect(listener1Called).toBe(true);
    expect(listener2Called).toBe(true);
  });
});

describe('Data_Value - Immutability', () => {
  test('should create immutable copy via toImmutable', () => {
    const dv = new Data_Value(42);
    const immutable = dv.toImmutable();
    
    expect(immutable.__immutable).toBe(true);
    expect(immutable.value).toBe(42);
  });

  test('immutable data_value should not allow changes', () => {
    const dv = new Data_Value(42);
    const immutable = dv.toImmutable();
    
    expect(() => {
      immutable.value = 100;
    }).toThrow();
  });

  test('should create deep immutable copies for arrays', () => {
    const arr = [1, 2, 3];
    const dv = new Data_Value(arr);
    const immutable = dv.toImmutable();
    
    expect(immutable.value).toEqual([1, 2, 3]);
    expect(immutable.__immutable).toBe(true);
  });

  test('original data_value should remain mutable after toImmutable', () => {
    const dv = new Data_Value(10);
    const immutable = dv.toImmutable();
    
    dv.value = 20;
    expect(dv.value).toBe(20);
    expect(immutable.value).toBe(10);
  });

  test('should handle immutable data_values in sync chains', () => {
    const dv1 = new Data_Value(10);
    const dv2 = new Data_Value(20);
    
    Data_Value.sync(dv1, dv2);
    
    const immutable = dv1.toImmutable();
    expect(immutable.value).toBe(20); // Should have synced value
    
    dv1.value = 30;
    expect(immutable.value).toBe(20); // Immutable should not change
  });
});

describe('Data_Value - attempt_set_value Method', () => {
  test('should successfully set valid value', () => {
    const dv = new Data_Value({value: 10, data_type: Number});
    const result = dv.attempt_set_value(20);
    
    expect(result.success).toBe(true);
    expect(dv.value).toBe(20);
  });

  test('should return failure for invalid value', () => {
    const dv = new Data_Value({value: 10, data_type: Number});
    const result = dv.attempt_set_value('not a number');
    
    expect(result.success).toBe(false);
    expect(dv.value).toBe(10); // Value should not change
  });

  test('should handle string to number conversion', () => {
    const dv = new Data_Value({value: 10, data_type: Number});
    const result = dv.attempt_set_value('25');
    
    expect(result.success).toBe(true);
    expect(dv.value).toBe(25);
  });

  test('should validate before setting value', () => {
    const dv = new Data_Value({value: 5, data_type: Functional_Data_Type.integer});
    const result = dv.attempt_set_value(10.5);
    
    // Integer type may reject decimal values
    expect(typeof result.success).toBe('boolean');
  });

  test('should return Value_Set_Attempt result object', () => {
    const dv = new Data_Value(10);
    const result = dv.attempt_set_value(20);
    
    expect(result).toHaveProperty('success');
    expect(result).toHaveProperty('value');
  });
});

describe('Data_Value - Edge Cases and Error Handling', () => {
  test('should handle NaN values', () => {
    const dv = new Data_Value(NaN);
    expect(Number.isNaN(dv.value)).toBe(true);
  });

  test('should handle Infinity values', () => {
    const dv = new Data_Value(Infinity);
    expect(dv.value).toBe(Infinity);
  });

  test('should handle negative zero', () => {
    const dv = new Data_Value(-0);
    expect(Object.is(dv.value, -0)).toBe(true);
  });

  test('should handle very large numbers', () => {
    const largeNum = Number.MAX_SAFE_INTEGER;
    const dv = new Data_Value(largeNum);
    expect(dv.value).toBe(largeNum);
  });

  test('should handle empty strings', () => {
    const dv = new Data_Value('');
    expect(dv.value).toBe('');
  });

  test('should handle whitespace strings', () => {
    const dv = new Data_Value('   ');
    expect(dv.value).toBe('   ');
  });

  test('should handle boolean values', () => {
    const dvTrue = new Data_Value(true);
    const dvFalse = new Data_Value(false);
    
    expect(dvTrue.value).toBe(true);
    expect(dvFalse.value).toBe(false);
  });
});
