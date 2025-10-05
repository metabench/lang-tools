const Data_String = require('../Data_Model/new/Data_String');
const Data_Integer = require('../Data_Model/new/Data_Integer');

describe('Data_String - Creation and Basic Values', () => {
  test('should create Data_String with string literal', () => {
    const ds = new Data_String('hello');
    expect(ds.value).toBe('hello');
  });

  test('should create Data_String with spec object', () => {
    const ds = new Data_String({value: 'world'});
    expect(ds.value).toBe('world');
  });

  test('should create Data_String with empty string', () => {
    const ds = new Data_String('');
    expect(ds.value).toBe('');
  });

  test('should create Data_String with whitespace', () => {
    const ds = new Data_String('   ');
    expect(ds.value).toBe('   ');
  });

  test('should create Data_String with special characters', () => {
    const ds = new Data_String('hello\nworld\ttab');
    expect(ds.value).toBe('hello\nworld\ttab');
  });

  test('should create Data_String with unicode characters', () => {
    const ds = new Data_String('Hello 世界 🌍');
    expect(ds.value).toBe('Hello 世界 🌍');
  });
});

describe('Data_String - Type Conversion and Validation', () => {
  test('should convert number to string', () => {
    const ds = new Data_String('hello');
    ds.value = 123;
    expect(typeof ds.value).toBe('string');
    expect(ds.value).toBe('123');
  });

  test('should convert number on creation', () => {
    const ds = new Data_String(456);
    expect(typeof ds.value).toBe('string');
    expect(ds.value).toBe('456');
  });

  test('should convert negative numbers to string', () => {
    const ds = new Data_String(-42);
    expect(ds.value).toBe('-42');
  });

  test('should convert zero to string', () => {
    const ds = new Data_String(0);
    expect(ds.value).toBe('0');
  });

  test('should convert floating point numbers to string', () => {
    const ds = new Data_String(3.14);
    expect(ds.value).toBe('3.14');
  });

  test('should reject undefined assignment', () => {
    const ds = new Data_String('init');
    expect(() => {
      ds.value = undefined;
    }).toThrow();
  });

  test('should reject null assignment', () => {
    const ds = new Data_String('init');
    expect(() => {
      ds.value = null;
    }).toThrow();
  });

  test('should reject object assignment', () => {
    const ds = new Data_String('init');
    expect(() => {
      ds.value = {a: 1};
    }).toThrow();
  });

  test('should reject array assignment', () => {
    const ds = new Data_String('init');
    expect(() => {
      ds.value = [1, 2, 3];
    }).toThrow();
  });
});

describe('Data_String - Sequential Reassignments', () => {
  test('should handle sequential string assignments', () => {
    const ds = new Data_String('first');
    const values = ['second', 'third', 'fourth', 'fifth'];
    
    values.forEach(val => {
      ds.value = val;
      expect(ds.value).toBe(val);
    });
  });

  test('should handle sequential number to string conversions', () => {
    const ds = new Data_String('0');
    for (let i = 1; i <= 10; i++) {
      ds.value = i;
      expect(ds.value).toBe(i.toString());
    }
  });

  test('should handle alternating string and number assignments', () => {
    const ds = new Data_String('init');
    
    ds.value = 'text';
    expect(ds.value).toBe('text');
    
    ds.value = 42;
    expect(ds.value).toBe('42');
    
    ds.value = 'more text';
    expect(ds.value).toBe('more text');
    
    ds.value = 100;
    expect(ds.value).toBe('100');
  });

  test('should handle rapid reassignments', () => {
    const ds = new Data_String('start');
    for (let i = 0; i < 100; i++) {
      ds.value = `value_${i}`;
      expect(ds.value).toBe(`value_${i}`);
    }
  });
});

describe('Data_String - String Manipulation', () => {
  test('should handle trim operation', () => {
    const ds = new Data_String(' test ');
    ds.value = ds.value.trim();
    expect(ds.value).toBe('test');
  });

  test('should handle uppercase conversion', () => {
    const ds = new Data_String('hello');
    ds.value = ds.value.toUpperCase();
    expect(ds.value).toBe('HELLO');
  });

  test('should handle lowercase conversion', () => {
    const ds = new Data_String('WORLD');
    ds.value = ds.value.toLowerCase();
    expect(ds.value).toBe('world');
  });

  test('should handle string concatenation', () => {
    const ds = new Data_String('Hello');
    ds.value = ds.value + ' World';
    expect(ds.value).toBe('Hello World');
  });

  test('should handle substring operations', () => {
    const ds = new Data_String('Hello World');
    ds.value = ds.value.substring(0, 5);
    expect(ds.value).toBe('Hello');
  });

  test('should handle replace operations', () => {
    const ds = new Data_String('Hello World');
    ds.value = ds.value.replace('World', 'Universe');
    expect(ds.value).toBe('Hello Universe');
  });
});

describe('Data_String - Change Events', () => {
  test('should emit change event when value changes', (done) => {
    const ds = new Data_String('initial');
    
    ds.on('change', (e) => {
      expect(e.old).toBe('initial');
      expect(e.value).toBe('changed');
      done();
    });
    
    ds.value = 'changed';
  });

  test('should not emit change event for same value', () => {
    const ds = new Data_String('test');
    let changeCount = 0;
    
    ds.on('change', () => {
      changeCount++;
    });
    
    ds.value = 'test';
    ds.value = 'test';
    
    expect(changeCount).toBe(0);
  });

  test('should emit events for multiple changes', () => {
    const ds = new Data_String('first');
    const changes = [];
    
    ds.on('change', (e) => {
      changes.push({old: e.old, new: e.value});
    });
    
    ds.value = 'second';
    ds.value = 'third';
    ds.value = 'fourth';
    
    expect(changes).toHaveLength(3);
    expect(changes[0]).toEqual({old: 'first', new: 'second'});
    expect(changes[1]).toEqual({old: 'second', new: 'third'});
    expect(changes[2]).toEqual({old: 'third', new: 'fourth'});
  });

  test('should emit events when converting from number', () => {
    const ds = new Data_String('text');
    let eventFired = false;
    
    ds.on('change', (e) => {
      expect(e.old).toBe('text');
      expect(e.value).toBe('42');
      eventFired = true;
    });
    
    ds.value = 42;
    expect(eventFired).toBe(true);
  });
});

describe('Data_String - Syncing with Data_Integer', () => {
  test('should sync Data_String and Data_Integer bidirectionally', () => {
    const ds = new Data_String('10');
    const di = new Data_Integer(10);
    
    Data_String.sync(ds, di);
    
    di.value = 50;
    expect(di.value).toBe(50);
    expect(ds.value).toBe('50');
    expect(typeof ds.value).toBe('string');
  });

  test('should sync from Data_String to Data_Integer', () => {
    const ds = new Data_String('10');
    const di = new Data_Integer(10);
    
    Data_String.sync(ds, di);
    
    ds.value = '75';
    expect(di.value).toBe(75);
    expect(ds.value).toBe('75');
  });

  test('should maintain types during sync', () => {
    const ds = new Data_String('100');
    const di = new Data_Integer(100);
    
    Data_String.sync(ds, di);
    
    ds.value = '200';
    expect(typeof ds.value).toBe('string');
    expect(typeof di.value).toBe('number');
    expect(ds.value).toBe('200');
    expect(di.value).toBe(200);
  });

  test('should handle negative values in sync', () => {
    const ds = new Data_String('-5');
    const di = new Data_Integer(-5);
    
    Data_String.sync(ds, di);
    
    ds.value = '-10';
    expect(ds.value).toBe('-10');
    expect(di.value).toBe(-10);
    
    di.value = -20;
    expect(ds.value).toBe('-20');
    expect(di.value).toBe(-20);
  });

  test('should handle zero in sync', () => {
    const ds = new Data_String('1');
    const di = new Data_Integer(1);
    
    Data_String.sync(ds, di);
    
    ds.value = '0';
    expect(ds.value).toBe('0');
    expect(di.value).toBe(0);
  });

  test('should propagate changes through sync chain', () => {
    const ds1 = new Data_String('10');
    const di = new Data_Integer(10);
    const ds2 = new Data_String('10');
    
    Data_String.sync(ds1, di);
    Data_String.sync(di, ds2);
    
    ds1.value = '100';
    expect(ds1.value).toBe('100');
    expect(di.value).toBe(100);
    expect(ds2.value).toBe('100');
  });
});

describe('Data_String - Immutability', () => {
  test('should create immutable copy', () => {
    const ds = new Data_String('hello');
    const immutable = ds.toImmutable();
    
    expect(immutable.__immutable).toBe(true);
    expect(immutable.value).toBe('hello');
  });

  test('immutable copy should not allow changes', () => {
    const ds = new Data_String('hello');
    const immutable = ds.toImmutable();
    
    expect(() => {
      immutable.value = 'world';
    }).toThrow();
  });

  test('original should remain mutable after toImmutable', () => {
    const ds = new Data_String('hello');
    const immutable = ds.toImmutable();
    
    ds.value = 'world';
    expect(ds.value).toBe('world');
    expect(immutable.value).toBe('hello');
  });
});

describe('Data_String - Edge Cases', () => {
  test('should handle very long strings', () => {
    const longString = 'a'.repeat(10000);
    const ds = new Data_String(longString);
    expect(ds.value).toBe(longString);
    expect(ds.value.length).toBe(10000);
  });

  test('should handle newlines and tabs', () => {
    const ds = new Data_String('line1\nline2\tindented');
    expect(ds.value).toBe('line1\nline2\tindented');
  });

  test('should handle quotes and escapes', () => {
    const ds = new Data_String("It's \"quoted\"");
    expect(ds.value).toBe("It's \"quoted\"");
  });

  test('should handle backslashes', () => {
    const ds = new Data_String('path\\to\\file');
    expect(ds.value).toBe('path\\to\\file');
  });

  test('should handle boolean conversion', () => {
    const ds = new Data_String(true);
    expect(ds.value).toBe('true');
    
    ds.value = false;
    expect(ds.value).toBe('false');
  });

  test('should handle numeric edge cases', () => {
    const ds = new Data_String(Infinity);
    expect(ds.value).toBe('Infinity');
    
    ds.value = -Infinity;
    expect(ds.value).toBe('-Infinity');
    
    ds.value = NaN;
    expect(ds.value).toBe('NaN');
  });
});
