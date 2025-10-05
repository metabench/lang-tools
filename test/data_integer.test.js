const Data_Integer = require('../Data_Model/new/Data_Integer');
const Data_String = require('../Data_Model/new/Data_String');

describe('Data_Integer - Creation and Basic Values', () => {
  test('should create Data_Integer with number literal', () => {
    const di = new Data_Integer(3);
    expect(di.value).toBe(3);
  });

  test('should create Data_Integer with spec object', () => {
    const di = new Data_Integer({value: 42});
    expect(di.value).toBe(42);
  });

  test('should create Data_Integer with zero', () => {
    const di = new Data_Integer(0);
    expect(di.value).toBe(0);
  });

  test('should create Data_Integer with negative number', () => {
    const di = new Data_Integer(-5);
    expect(di.value).toBe(-5);
  });

  test('should create Data_Integer with large number', () => {
    const di = new Data_Integer(1000000);
    expect(di.value).toBe(1000000);
  });
});

describe('Data_Integer - Type Conversion and Validation', () => {
  test('should convert numeric string to integer', () => {
    const di = new Data_Integer(10);
    di.value = '20';
    expect(typeof di.value).toBe('number');
    expect(di.value).toBe(20);
  });

  test('should convert string to integer on creation', () => {
    const di = new Data_Integer('42');
    expect(typeof di.value).toBe('number');
    expect(di.value).toBe(42);
  });

  test('should handle negative numeric strings', () => {
    const di = new Data_Integer('-15');
    expect(di.value).toBe(-15);
  });

  test('should reject non-numeric strings', () => {
    const di = new Data_Integer(1);
    expect(() => {
      di.value = 'not a number';
    }).toThrow();
  });

  test('should reject null assignment', () => {
    const di = new Data_Integer(1);
    expect(() => {
      di.value = null;
    }).toThrow();
  });

  test('should reject undefined assignment', () => {
    const di = new Data_Integer(1);
    expect(() => {
      di.value = undefined;
    }).toThrow();
  });

  test('should reject object assignment', () => {
    const di = new Data_Integer(1);
    expect(() => {
      di.value = {a: 1};
    }).toThrow();
  });

  test('should reject array assignment', () => {
    const di = new Data_Integer(1);
    expect(() => {
      di.value = [1, 2, 3];
    }).toThrow();
  });
});

describe('Data_Integer - Sequential Reassignments', () => {
  test('should handle sequential number assignments', () => {
    const di = new Data_Integer(0);
    for (let i = 1; i <= 10; i++) {
      di.value = i;
      expect(di.value).toBe(i);
    }
  });

  test('should handle sequential string to integer conversions', () => {
    const di = new Data_Integer(0);
    for (let i = 1; i <= 10; i++) {
      di.value = i.toString();
      expect(di.value).toBe(i);
    }
  });

  test('should handle alternating positive and negative values', () => {
    const di = new Data_Integer(0);
    const values = [5, -3, 10, -7, 0, 15];
    
    values.forEach(val => {
      di.value = val;
      expect(di.value).toBe(val);
    });
  });

  test('should handle rapid reassignments', () => {
    const di = new Data_Integer(1);
    for (let i = 0; i < 100; i++) {
      di.value = i;
      expect(di.value).toBe(i);
    }
  });
});

describe('Data_Integer - Change Events', () => {
  test('should emit change event when value changes', (done) => {
    const di = new Data_Integer(10);
    
    di.on('change', (e) => {
      expect(e.old).toBe(10);
      expect(e.value).toBe(20);
      done();
    });
    
    di.value = 20;
  });

  test('should not emit change event for same value', () => {
    const di = new Data_Integer(10);
    let changeCount = 0;
    
    di.on('change', () => {
      changeCount++;
    });
    
    di.value = 10;
    di.value = 10;
    
    expect(changeCount).toBe(0);
  });

  test('should emit events for multiple changes', () => {
    const di = new Data_Integer(1);
    const changes = [];
    
    di.on('change', (e) => {
      changes.push({old: e.old, new: e.value});
    });
    
    di.value = 2;
    di.value = 3;
    di.value = 4;
    
    expect(changes).toHaveLength(3);
    expect(changes[0]).toEqual({old: 1, new: 2});
    expect(changes[1]).toEqual({old: 2, new: 3});
    expect(changes[2]).toEqual({old: 3, new: 4});
  });

  test('should emit events when converting from string', () => {
    const di = new Data_Integer(5);
    let eventFired = false;
    
    di.on('change', (e) => {
      expect(e.old).toBe(5);
      expect(e.value).toBe(10);
      eventFired = true;
    });
    
    di.value = '10';
    expect(eventFired).toBe(true);
  });
});

describe('Data_Integer - Syncing with Data_String', () => {
  test('should sync Data_Integer and Data_String bidirectionally', () => {
    const di = new Data_Integer(10);
    const ds = new Data_String('10');
    
    Data_Integer.sync(di, ds);
    
    di.value = 50;
    expect(di.value).toBe(50);
    expect(ds.value).toBe('50');
    expect(typeof ds.value).toBe('string');
  });

  test('should sync from Data_String to Data_Integer', () => {
    const di = new Data_Integer(10);
    const ds = new Data_String('10');
    
    Data_Integer.sync(di, ds);
    
    ds.value = '75';
    expect(di.value).toBe(75);
    expect(ds.value).toBe('75');
  });

  test('should maintain types during sync', () => {
    const di = new Data_Integer(100);
    const ds = new Data_String('200');
    
    Data_Integer.sync(di, ds);
    
    di.value = 300;
    expect(typeof di.value).toBe('number');
    expect(typeof ds.value).toBe('string');
    expect(di.value).toBe(300);
    expect(ds.value).toBe('300');
  });

  test('should handle negative values in sync', () => {
    const di = new Data_Integer(-5);
    const ds = new Data_String('-5');
    
    Data_Integer.sync(di, ds);
    
    di.value = -10;
    expect(di.value).toBe(-10);
    expect(ds.value).toBe('-10');
    
    ds.value = '-20';
    expect(di.value).toBe(-20);
    expect(ds.value).toBe('-20');
  });

  test('should handle zero in sync', () => {
    const di = new Data_Integer(1);
    const ds = new Data_String('1');
    
    Data_Integer.sync(di, ds);
    
    di.value = 0;
    expect(di.value).toBe(0);
    expect(ds.value).toBe('0');
  });
});

describe('Data_Integer - Immutability', () => {
  test('should create immutable copy', () => {
    const di = new Data_Integer(42);
    const immutable = di.toImmutable();
    
    expect(immutable.__immutable).toBe(true);
    expect(immutable.value).toBe(42);
  });

  test('immutable copy should not allow changes', () => {
    const di = new Data_Integer(42);
    const immutable = di.toImmutable();
    
    expect(() => {
      immutable.value = 100;
    }).toThrow();
  });

  test('original should remain mutable after toImmutable', () => {
    const di = new Data_Integer(10);
    const immutable = di.toImmutable();
    
    di.value = 20;
    expect(di.value).toBe(20);
    expect(immutable.value).toBe(10);
  });
});

describe('Data_Integer - Edge Cases', () => {
  test('should handle MAX_SAFE_INTEGER', () => {
    const di = new Data_Integer(Number.MAX_SAFE_INTEGER);
    expect(di.value).toBe(Number.MAX_SAFE_INTEGER);
  });

  test('should handle MIN_SAFE_INTEGER', () => {
    const di = new Data_Integer(Number.MIN_SAFE_INTEGER);
    expect(di.value).toBe(Number.MIN_SAFE_INTEGER);
  });

  test('should handle zero correctly', () => {
    const di = new Data_Integer(0);
    expect(di.value).toBe(0);
    expect(Object.is(di.value, 0)).toBe(true);
  });

  test('should reject floating point strings', () => {
    const di = new Data_Integer(1);
    expect(() => {
      di.value = '10.5';
    }).toThrow();
  });

  test('should reject boolean values', () => {
    const di = new Data_Integer(1);
    expect(() => {
      di.value = true;
    }).toThrow();
  });
});
