const util = require('../util');

describe('Util - Vector Addition (v_add)', () => {
  test('should add two numbers', () => {
    expect(util.v_add(3, 5)).toBe(8);
  });

  test('should add two vectors', () => {
    expect(util.v_add([1, 2], [3, 4])).toEqual([4, 6]);
  });

  test('should add vector and scalar', () => {
    expect(util.v_add([1, 2, 3], 5)).toEqual([6, 7, 8]);
  });

  test('should add three numbers', () => {
    expect(util.v_add(1, 2, 3)).toBe(6);
  });

  test('should add multiple vectors', () => {
    expect(util.v_add([1, 1], [2, 2], [3, 3])).toEqual([6, 6]);
  });

  test('should handle negative numbers', () => {
    expect(util.v_add(-5, 3)).toBe(-2);
    expect(util.v_add([1, -2], [3, 4])).toEqual([4, 2]);
  });

  test('should handle zero', () => {
    expect(util.v_add(0, 5)).toBe(5);
    expect(util.v_add([0, 0], [1, 1])).toEqual([1, 1]);
  });
});

describe('Util - Vector Subtraction (v_subtract)', () => {
  test('should subtract two numbers', () => {
    expect(util.v_subtract(10, 3)).toBe(7);
  });

  test('should subtract two vectors', () => {
    expect(util.v_subtract([5, 8], [2, 3])).toEqual([3, 5]);
  });

  test('should subtract scalar from vector', () => {
    expect(util.v_subtract([10, 20, 30], 5)).toEqual([5, 15, 25]);
  });

  test('should subtract multiple numbers', () => {
    expect(util.v_subtract(10, 2, 3)).toBe(5);
  });

  test('should handle negative results', () => {
    expect(util.v_subtract(3, 5)).toBe(-2);
    expect(util.v_subtract([1, 2], [5, 10])).toEqual([-4, -8]);
  });

  test('should handle zero', () => {
    expect(util.v_subtract(5, 0)).toBe(5);
    expect(util.v_subtract([5, 5], [0, 0])).toEqual([5, 5]);
  });
});

describe('Util - Vector Multiplication (v_multiply)', () => {
  test('should multiply two numbers', () => {
    expect(util.v_multiply(3, 4)).toBe(12);
  });

  test('should multiply two vectors element-wise', () => {
    expect(util.v_multiply([2, 3], [4, 5])).toEqual([8, 15]);
  });

  test('should scale vector by scalar', () => {
    expect(util.v_multiply([1, 2, 3], 3)).toEqual([3, 6, 9]);
  });

  test('should multiply multiple numbers', () => {
    expect(util.v_multiply(2, 3, 4)).toBe(24);
  });

  test('should handle zero', () => {
    expect(util.v_multiply(5, 0)).toBe(0);
    expect(util.v_multiply([5, 10], 0)).toEqual([0, 0]);
  });

  test('should handle negative numbers', () => {
    expect(util.v_multiply(-2, 3)).toBe(-6);
    expect(util.v_multiply([1, -2], [3, 4])).toEqual([3, -8]);
  });
});

describe('Util - Vector Division (v_divide)', () => {
  test('should divide two numbers', () => {
    expect(util.v_divide(12, 3)).toBe(4);
  });

  test('should divide two vectors element-wise', () => {
    expect(util.v_divide([12, 20], [3, 4])).toEqual([4, 5]);
  });

  test('should divide vector by scalar', () => {
    expect(util.v_divide([10, 20, 30], 5)).toEqual([2, 4, 6]);
  });

  test('should handle division by one', () => {
    expect(util.v_divide(5, 1)).toBe(5);
    expect(util.v_divide([5, 10], 1)).toEqual([5, 10]);
  });

  test('should handle floating point results', () => {
    expect(util.v_divide(7, 2)).toBe(3.5);
  });

  test('should handle negative numbers', () => {
    expect(util.v_divide(-10, 2)).toBe(-5);
    expect(util.v_divide([10, -20], 2)).toEqual([5, -10]);
  });
});

describe('Util - Vector Magnitude', () => {
  test('should calculate magnitude of 2D vector', () => {
    expect(util.vector_magnitude([3, 4])).toBe(5);
  });

  test('should calculate magnitude of unit vector', () => {
    expect(util.vector_magnitude([1, 0])).toBe(1);
  });

  test('should handle zero vector', () => {
    expect(util.vector_magnitude([0, 0])).toBe(0);
  });

  test('should handle negative components', () => {
    const mag = util.vector_magnitude([-3, -4]);
    expect(mag).toBe(5);
  });

  test('should calculate magnitude correctly', () => {
    const mag = util.vector_magnitude([6, 8]);
    expect(mag).toBe(10);
  });

  test('should handle floating point vectors', () => {
    const mag = util.vector_magnitude([1.5, 2.0]);
    expect(mag).toBeCloseTo(2.5, 5);
  });
});

describe('Util - Distance Between Points', () => {
  test('should calculate distance between two points', () => {
    const points = [[0, 0], [3, 4]];
    expect(util.distance_between_points(points)).toBe(5);
  });

  test('should handle same point', () => {
    const points = [[5, 5], [5, 5]];
    expect(util.distance_between_points(points)).toBe(0);
  });

  test('should handle negative coordinates', () => {
    const points = [[0, 0], [-3, -4]];
    expect(util.distance_between_points(points)).toBe(5);
  });

  test('should calculate horizontal distance', () => {
    const points = [[0, 0], [5, 0]];
    expect(util.distance_between_points(points)).toBe(5);
  });

  test('should calculate vertical distance', () => {
    const points = [[0, 0], [0, 7]];
    expect(util.distance_between_points(points)).toBe(7);
  });

  test('should handle floating point coordinates', () => {
    const points = [[0, 0], [1.5, 2.0]];
    expect(util.distance_between_points(points)).toBeCloseTo(2.5, 5);
  });
});

// Fixed <TEST001>: Corrected npx() test assumptions
// npx() ADDS 'px' to numbers (e.g., 100 → '100px')
// Use no_px() to STRIP 'px' from strings (e.g., '100px' → 100)
describe('Util - Type Conversion (npx)', () => {
  test('should add px to number', () => {
    expect(util.npx(100)).toBe('100px');
  });

  test('should pass through pixel strings unchanged', () => {
    expect(util.npx('100px')).toBe('100px');
  });

  test('should add px to array of numbers', () => {
    expect(util.npx([10, 20])).toEqual(['10px', '20px']);
  });

  test('should handle negative values', () => {
    expect(util.npx(-10)).toBe('-10px');
  });

  test('should handle zero', () => {
    expect(util.npx(0)).toBe('0px');
  });

  test('should handle floating point values', () => {
    expect(util.npx(12.5)).toBe('12.5px');
  });
});

describe('Util - Type Conversion (no_px)', () => {
  test('should remove px from pixel string', () => {
    expect(util.no_px('100px')).toBe(100);
  });

  test('should convert array of pixel strings', () => {
    expect(util.no_px(['10px', '20px'])).toEqual([10, 20]);
  });

  test('should handle numbers directly', () => {
    expect(util.no_px(50)).toBe(50);
  });

  test('should handle negative values', () => {
    expect(util.no_px('-15px')).toBe(-15);
  });

  test('should handle zero', () => {
    expect(util.no_px('0px')).toBe(0);
  });
});

describe('Util - Filter Map by Regex', () => {
  test('should filter map by matching keys', () => {
    const map = {foo: 1, bar: 2, baz: 3};
    const result = util.filter_map_by_regex(map, /^ba/);
    expect(result).toEqual({bar: 2, baz: 3});
  });

  test('should return empty object for no matches', () => {
    const map = {foo: 1, bar: 2};
    const result = util.filter_map_by_regex(map, /^xyz/);
    expect(result).toEqual({});
  });

  test('should handle complex regex patterns', () => {
    const map = {test1: 1, test2: 2, prod1: 3};
    const result = util.filter_map_by_regex(map, /test\d/);
    expect(result).toEqual({test1: 1, test2: 2});
  });

  test('should handle empty map', () => {
    const result = util.filter_map_by_regex({}, /test/);
    expect(result).toEqual({});
  });

  test('should preserve values', () => {
    const map = {key1: {nested: 'value'}, key2: [1, 2]};
    const result = util.filter_map_by_regex(map, /key/);
    expect(result.key1).toEqual({nested: 'value'});
    expect(result.key2).toEqual([1, 2]);
  });
});

describe('Util - Execute on Each Simple', () => {
  test('should execute function on each item', () => {
    const items = [1, 2, 3];
    const result = util.execute_on_each_simple(items, (x) => x * 2);
    expect(result).toEqual([2, 4, 6]);
  });

  test('should handle string transformations', () => {
    const items = ['a', 'b', 'c'];
    const result = util.execute_on_each_simple(items, (x) => x.toUpperCase());
    expect(result).toEqual(['A', 'B', 'C']);
  });

  test('should handle empty array', () => {
    const result = util.execute_on_each_simple([], (x) => x * 2);
    expect(result).toEqual([]);
  });

  test('should handle object transformations', () => {
    const items = [{x: 1}, {x: 2}];
    const result = util.execute_on_each_simple(items, (obj) => obj.x * 10);
    expect(result).toEqual([10, 20]);
  });

  test('should preserve function context', () => {
    const items = [1, 2, 3];
    const context = {multiplier: 5};
    const result = util.execute_on_each_simple.call(context, items, function(x) {
      return x * this.multiplier;
    });
    expect(result).toEqual([5, 10, 15]);
  });
});

describe('Util - Validators', () => {
  test('should have validators object', () => {
    expect(util.validators).toBeDefined();
    expect(typeof util.validators).toBe('object');
  });

  test('validators should contain validation functions', () => {
    // Check that validators has some properties
    const keys = Object.keys(util.validators);
    expect(keys.length).toBeGreaterThan(0);
  });
});

describe('Util - Group Function', () => {
  test('should have group function', () => {
    expect(util.group).toBeDefined();
    expect(typeof util.group).toBe('function');
  });
});

// Fixed <TEST002>: Corrected hex case expectations - function returns uppercase
// Both uppercase and lowercase are valid CSS hex colors
// Implementation uses uppercase hex chars ['A', 'B', 'C', 'D', 'E', 'F']
describe('Util - Hex Color Conversion', () => {
  test('should convert RGB array to CSS hex', () => {
    const rgb = [255, 0, 0];
    const hex = util.arr_rgb_to_css_hex_6(rgb);
    expect(hex).toBe('#FF0000');
  });

  test('should handle green color', () => {
    const rgb = [0, 255, 0];
    const hex = util.arr_rgb_to_css_hex_6(rgb);
    expect(hex).toBe('#00FF00');
  });

  test('should handle blue color', () => {
    const rgb = [0, 0, 255];
    const hex = util.arr_rgb_to_css_hex_6(rgb);
    expect(hex).toBe('#0000FF');
  });

  test('should handle white color', () => {
    const rgb = [255, 255, 255];
    const hex = util.arr_rgb_to_css_hex_6(rgb);
    expect(hex).toBe('#FFFFFF');
  });

  test('should handle black color', () => {
    const rgb = [0, 0, 0];
    const hex = util.arr_rgb_to_css_hex_6(rgb);
    expect(hex).toBe('#000000');
  });
});

describe('Util - Edge Cases', () => {
  test('should handle very large numbers in vector operations', () => {
    const large = 1e10;
    expect(util.v_add(large, large)).toBe(2e10);
  });

  test('should handle very small numbers', () => {
    const small = 1e-10;
    expect(util.v_add(small, small)).toBeCloseTo(2e-10, 15);
  });

  test('should handle mixed vector dimensions', () => {
    // Behavior depends on implementation
    expect(() => {
      util.v_add([1, 2], [3, 4, 5]);
    }).not.toThrow();
  });
});
