const collective = require('../collective');

describe('Collective - Basic Property Access', () => {
  test('should access property on all array items', () => {
    const arr = [{name: 'Alice'}, {name: 'Bob'}, {name: 'Charlie'}];
    const result = collective(arr).name;
    expect(result).toEqual(['Alice', 'Bob', 'Charlie']);
  });

  test('should access numeric properties', () => {
    const arr = [{value: 10}, {value: 20}, {value: 30}];
    const result = collective(arr).value;
    expect(result).toEqual([10, 20, 30]);
  });

  test('should access nested properties', () => {
    const arr = [{data: {id: 1}}, {data: {id: 2}}];
    const result = collective(arr).data;
    expect(result).toEqual([{id: 1}, {id: 2}]);
  });

  test('should handle undefined properties', () => {
    const arr = [{name: 'Alice'}, {name: 'Bob'}];
    const result = collective(arr).age;
    expect(result).toEqual([undefined, undefined]);
  });

  test('should access boolean properties', () => {
    const arr = [{active: true}, {active: false}, {active: true}];
    const result = collective(arr).active;
    expect(result).toEqual([true, false, true]);
  });
});

describe('Collective - Method Calls', () => {
  test('should call method on all array items', () => {
    const arr = [
      {getValue: () => 10},
      {getValue: () => 20},
      {getValue: () => 30}
    ];
    const result = collective(arr).getValue();
    expect(result).toEqual([10, 20, 30]);
  });

  test('should call method with arguments', () => {
    const arr = [
      {add: (n) => 1 + n},
      {add: (n) => 2 + n},
      {add: (n) => 3 + n}
    ];
    const result = collective(arr).add(10);
    expect(result).toEqual([11, 12, 13]);
  });

  test('should call method with multiple arguments', () => {
    const arr = [
      {sum: (a, b) => a + b + 1},
      {sum: (a, b) => a + b + 2}
    ];
    const result = collective(arr).sum(10, 5);
    expect(result).toEqual([16, 17]);
  });

  test('should call string methods', () => {
    const arr = ['hello', 'world', 'test'];
    const result = collective(arr).toUpperCase();
    expect(result).toEqual(['HELLO', 'WORLD', 'TEST']);
  });

  test('should chain method calls', () => {
    const arr = ['  hello  ', '  world  '];
    const result = collective(arr).trim();
    expect(result).toEqual(['hello', 'world']);
  });

  test('should call methods that return objects', () => {
    const arr = [
      {getData: () => ({value: 1})},
      {getData: () => ({value: 2})}
    ];
    const result = collective(arr).getData();
    expect(result).toEqual([{value: 1}, {value: 2}]);
  });
});

describe('Collective - Array Method Access', () => {
  test('should preserve array methods', () => {
    const arr = [1, 2, 3];
    const coll = collective(arr);
    expect(coll.length).toBe(3);
  });

  test('should handle array indexing', () => {
    const arr = [{name: 'A'}, {name: 'B'}, {name: 'C'}];
    const coll = collective(arr);
    expect(coll[0]).toEqual({name: 'A'});
  });

  test('should support iteration', () => {
    const arr = [1, 2, 3];
    const coll = collective(arr);
    const sum = coll.reduce((acc, val) => acc + val, 0);
    expect(sum).toBe(6);
  });
});

describe('Collective - Complex Objects', () => {
  test('should handle objects with multiple properties', () => {
    const arr = [
      {x: 10, y: 20, name: 'A'},
      {x: 30, y: 40, name: 'B'}
    ];
    expect(collective(arr).x).toEqual([10, 30]);
    expect(collective(arr).y).toEqual([20, 40]);
    expect(collective(arr).name).toEqual(['A', 'B']);
  });

  test('should handle objects with methods', () => {
    class Point {
      constructor(x, y) {
        this.x = x;
        this.y = y;
      }
      getX() { return this.x; }
      getY() { return this.y; }
      sum() { return this.x + this.y; }
    }
    
    const arr = [new Point(1, 2), new Point(3, 4), new Point(5, 6)];
    expect(collective(arr).getX()).toEqual([1, 3, 5]);
    expect(collective(arr).getY()).toEqual([2, 4, 6]);
    expect(collective(arr).sum()).toEqual([3, 7, 11]);
  });

  test('should handle arrays of different object types', () => {
    const arr = [
      {type: 'A', getValue: () => 1},
      {type: 'B', getValue: () => 2}
    ];
    expect(collective(arr).type).toEqual(['A', 'B']);
    expect(collective(arr).getValue()).toEqual([1, 2]);
  });
});

describe('Collective - Edge Cases', () => {
  test('should handle empty array', () => {
    const arr = [];
    const result = collective(arr).name;
    expect(result).toEqual([]);
  });

  test('should handle single item array', () => {
    const arr = [{value: 42}];
    const result = collective(arr).value;
    expect(result).toEqual([42]);
  });

  test('should handle null values in array', () => {
    const arr = [{value: 1}, null, {value: 3}];
    expect(() => {
      collective(arr).value;
    }).toThrow();
  });

  test('should handle undefined values in array', () => {
    const arr = [{value: 1}, undefined, {value: 3}];
    expect(() => {
      collective(arr).value;
    }).toThrow();
  });

  test('should throw error for non-array input', () => {
    expect(() => {
      collective({not: 'array'});
    }).toThrow();
  });

  test('should handle very large arrays', () => {
    const arr = Array(1000).fill(0).map((_, i) => ({value: i}));
    const result = collective(arr).value;
    expect(result.length).toBe(1000);
    expect(result[0]).toBe(0);
    expect(result[999]).toBe(999);
  });
});

describe('Collective - Method Context', () => {
  test('should preserve method context', () => {
    class Counter {
      constructor(start) {
        this.count = start;
      }
      increment() {
        return ++this.count;
      }
      getCount() {
        return this.count;
      }
    }
    
    const arr = [new Counter(0), new Counter(10), new Counter(20)];
    const result = collective(arr).increment();
    expect(result).toEqual([1, 11, 21]);
  });

  test('should handle this context in methods', () => {
    const arr = [
      {value: 5, double: function() { return this.value * 2; }},
      {value: 10, double: function() { return this.value * 2; }}
    ];
    const result = collective(arr).double();
    expect(result).toEqual([10, 20]);
  });
});

describe('Collective - Return Value Types', () => {
  test('should collect string return values', () => {
    const arr = [
      {toString: () => 'first'},
      {toString: () => 'second'}
    ];
    const result = collective(arr).toString();
    expect(result).toEqual(['first', 'second']);
  });

  test('should collect number return values', () => {
    const arr = [
      {calculate: () => 42},
      {calculate: () => 100}
    ];
    const result = collective(arr).calculate();
    expect(result).toEqual([42, 100]);
  });

  test('should collect boolean return values', () => {
    const arr = [
      {isValid: () => true},
      {isValid: () => false},
      {isValid: () => true}
    ];
    const result = collective(arr).isValid();
    expect(result).toEqual([true, false, true]);
  });

  test('should collect array return values', () => {
    const arr = [
      {getArray: () => [1, 2]},
      {getArray: () => [3, 4]}
    ];
    const result = collective(arr).getArray();
    expect(result).toEqual([[1, 2], [3, 4]]);
  });

  test('should collect null return values', () => {
    const arr = [
      {getValue: () => null},
      {getValue: () => null}
    ];
    const result = collective(arr).getValue();
    expect(result).toEqual([null, null]);
  });
});

describe('Collective - Practical Use Cases', () => {
  test('should get bounding client rects from elements', () => {
    // Simulating DOM elements
    const elements = [
      {getBoundingClientRect: () => ({x: 0, y: 0, width: 100, height: 50})},
      {getBoundingClientRect: () => ({x: 100, y: 0, width: 200, height: 75})}
    ];
    const rects = collective(elements).getBoundingClientRect();
    expect(rects).toHaveLength(2);
    expect(rects[0].width).toBe(100);
    expect(rects[1].width).toBe(200);
  });

  test('should collect property values for filtering', () => {
    const items = [
      {id: 1, active: true},
      {id: 2, active: false},
      {id: 3, active: true}
    ];
    const ids = collective(items).id;
    const activeStates = collective(items).active;
    expect(ids).toEqual([1, 2, 3]);
    expect(activeStates).toEqual([true, false, true]);
  });

  test('should batch call methods with same arguments', () => {
    const controls = [
      {setVisible: (v) => v, visible: false},
      {setVisible: (v) => v, visible: false}
    ];
    const results = collective(controls).setVisible(true);
    expect(results).toEqual([true, true]);
  });
});
