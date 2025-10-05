# lang-tools

[![npm version](https://img.shields.io/npm/v/lang-tools.svg)](https://www.npmjs.com/package/lang-tools)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

General purpose JavaScript data structures and utilities library. Provides reactive data models, collections, vector math, and functional programming utilities. Built on the `lang-mini` platform.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Core Features](#core-features)
  - [collective - Batch Operations on Arrays](#collective---batch-operations-on-arrays)
  - [Collection - Reactive Data Structure](#collection---reactive-data-structure)
  - [Data_Value - Reactive Typed Values](#data_value---reactive-typed-values)
  - [Data_Integer & Data_String - Specialized Types](#data_integer--data_string---specialized-types)
  - [Vector Math Utilities](#vector-math-utilities)
  - [Type Conversion Utilities](#type-conversion-utilities)
- [API Reference](#api-reference)
- [Examples](#examples)
- [Testing](#testing)
- [Architecture](#architecture)
- [License](#license)

## Installation

```bash
npm install lang-tools
```

**Requirements:** Node.js >= 12.0.0

## Quick Start

```javascript
const lang = require('lang-tools');

// Use collective for batch operations
const items = [{value: 10}, {value: 20}, {value: 30}];
const values = lang.collective(items).value;
console.log(values); // [10, 20, 30]

// Use Collection for reactive data management
const collection = new lang.Collection(['A', 'B', 'C']);
collection.on('change', (e) => console.log('Collection changed!'));
collection.push('D'); // Triggers change event

// Use Data_Value for reactive typed values
const dv = new lang.Data_Value({value: 42, data_type: Number});
dv.on('change', (e) => console.log('Value changed:', e.value));
dv.value = 100; // Triggers change event

// Use vector math utilities
const sum = lang.util.v_add([1, 2, 3], [4, 5, 6]);
console.log(sum); // [5, 7, 9]
```

## Core Features

### collective - Batch Operations on Arrays

The `collective` utility (also available as `collect`) provides a **Proxy-based wrapper** for performing batch operations on arrays. It enables concise, readable syntax for calling methods or accessing properties on all items in an array simultaneously.

#### Why Use collective?

Instead of writing verbose loops or map operations, `collective` lets you write natural, chainable code:

```javascript
const {collective} = require('lang-tools');

// Without collective - verbose
const elements = document.querySelectorAll('.item');
const widths = [];
elements.forEach(el => widths.push(el.getBoundingClientRect().width));

// With collective - concise and readable
const widths = collective(Array.from(elements)).getBoundingClientRect().map(r => r.width);
```

#### API

**`collective(array)`** - Returns a Proxy that intercepts property access and method calls.

- **Property Access**: Returns array of property values from all items
- **Method Calls**: Calls method on all items, returns array of results
- **Array Methods**: Preserves native array methods like `length`, indexing, `reduce`, etc.

#### Examples

**Accessing Properties:**

```javascript
const people = [
  {name: 'Alice', age: 30},
  {name: 'Bob', age: 25},
  {name: 'Charlie', age: 35}
];

const names = collective(people).name;
// ['Alice', 'Bob', 'Charlie']

const ages = collective(people).age;
// [30, 25, 35]
```

**Calling Methods:**

```javascript
const counters = [
  {count: 5, increment: function() { return ++this.count; }},
  {count: 10, increment: function() { return ++this.count; }},
  {count: 15, increment: function() { return ++this.count; }}
];

const results = collective(counters).increment();
// [6, 11, 16]
```

**Method Calls with Arguments:**

```javascript
const calculators = [
  {add: (a, b) => a + b + 1},
  {add: (a, b) => a + b + 2},
  {add: (a, b) => a + b + 3}
];

const sums = collective(calculators).add(10, 5);
// [16, 17, 18]
```

**Working with Strings:**

```javascript
const strings = ['hello', 'world', 'test'];

const uppercase = collective(strings).toUpperCase();
// ['HELLO', 'WORLD', 'TEST']

const lengths = collective(strings).length;
// [5, 5, 4]
```

**Real-World Use Case - DOM Manipulation:**

```javascript
// Get bounding rectangles for all elements
const elements = document.querySelectorAll('.box');
const rects = collective(Array.from(elements)).getBoundingClientRect();

// Get all widths
const widths = rects.map(r => r.width);

// Check if any element overlaps with a target area
const target = {left: 100, right: 200};
const overlaps = rects.some(r => r.left < target.right && r.right > target.left);
```

**Preserving Array Methods:**

```javascript
const items = [{value: 10}, {value: 20}, {value: 30}];
const coll = collective(items);

console.log(coll.length); // 3
console.log(coll[0]); // {value: 10}

// Use native array methods
const sum = coll.reduce((acc, item) => acc + item.value, 0);
// 60
```

#### Technical Details

- Uses ES6 Proxy for dynamic property interception
- Maintains `this` context when calling methods on items
- Returns arrays for both property access and method calls
- Throws error if called with non-array input
- Zero overhead for standard array operations (length, indexing, etc.)

#### When to Use collective

✅ **Good Use Cases:**
- Batch property access from array of objects
- Calling same method on multiple objects with same arguments
- Working with collections of DOM elements
- Data extraction/transformation pipelines
- Reducing boilerplate in loops

❌ **Not Recommended For:**
- Arrays with heterogeneous objects (different property sets)
- Performance-critical tight loops (use native for loops)
- Cases where you need to handle errors per-item
- Single-item operations

---

### Collection - Reactive Data Structure

`Collection` is a **reactive array-like data structure** that extends `Data_Object`. It provides event-driven management of collections with automatic change notifications, indexing, constraints, and relationships.

#### Why Use Collection?

Collections are designed for data binding, UI synchronization, and reactive programming patterns where you need to respond to changes in your data.

```javascript
const {Collection} = require('lang-tools');

const users = new Collection();

// Listen for changes
users.on('change', (event) => {
  console.log('Collection changed:', event.name);
  updateUI(users);
});

users.push({name: 'Alice', role: 'admin'}); // Triggers 'change' event
users.remove(0); // Triggers 'change' event
users.clear(); // Triggers 'change' event with name: 'clear'
```

#### API

**Constructor:**

```javascript
// Empty collection
const coll = new Collection();

// From array
const coll = new Collection(['A', 'B', 'C']);

// With spec object
const coll = new Collection({
  load_array: [1, 2, 3],
  fn_index: (item) => item.value // Custom indexing function
});
```

**Core Methods:**

- **`push(item)`** - Add item to end of collection
- **`insert(item, index)`** - Insert item at specific position
- **`remove(index)`** - Remove item at index
- **`get(index)`** - Get item at index (returns Data_Value wrapper)
- **`clear()`** - Remove all items, triggers 'change' event with name: 'clear'
- **`length()`** - Get number of items
- **`each(fn)`** - Iterate over items: `fn(item, index)`
- **`set(value)`** - Replace entire collection with new array or single value
- **`value()`** - Get array of values
- **`toObject()`** - Convert to object array representation

**Events:**

- **`'change'`** - Fired on push, insert, remove, set, clear operations

#### Examples

**Basic Operations:**

```javascript
const tasks = new Collection();

// Add items
tasks.push('Write docs');
tasks.push('Run tests');
tasks.push('Deploy');

console.log(tasks.length()); // 3

// Insert at position
tasks.insert('Review code', 1);
console.log(tasks.length()); // 4

// Get items
console.log(tasks.get(0).value); // 'Write docs'
console.log(tasks.get(1).value); // 'Review code'

// Remove items
tasks.remove(1);
console.log(tasks.length()); // 3

// Clear all
tasks.clear();
console.log(tasks.length()); // 0
```

**Iteration:**

```javascript
const numbers = new Collection([10, 20, 30, 40, 50]);

// Iterate through items
numbers.each((item, index) => {
  console.log(`Item ${index}: ${item.value}`);
});

// Collect values
const values = [];
numbers.each((item) => {
  values.push(item.value * 2);
});
console.log(values); // [20, 40, 60, 80, 100]
```

**Change Events:**

```javascript
const products = new Collection();

let changeCount = 0;
products.on('change', (event) => {
  changeCount++;
  console.log('Change event:', event.name);
});

products.push({name: 'Widget', price: 9.99}); // Change event
products.push({name: 'Gadget', price: 19.99}); // Change event
products.clear(); // Change event: clear

console.log('Total changes:', changeCount); // 3
```

**Set Operations:**

```javascript
const colors = new Collection(['red', 'green']);

// Replace entire collection
colors.set(['blue', 'yellow', 'purple']);
console.log(colors.length()); // 3

// Set single value
colors.set('orange');
console.log(colors.length()); // 1
```

**Type Constraints:**

```javascript
// Collection of numbers
const scores = new Collection({constraint: Number});

// Collection of strings with indexing
const names = new Collection({
  constraint: String,
  index_by: 'value'
});
```

**Working with Objects:**

```javascript
const people = new Collection([
  {name: 'Alice', age: 30},
  {name: 'Bob', age: 25},
  {name: 'Charlie', age: 35}
]);

// Convert to plain object array
const plainArray = people.toObject();

// Get values array
const values = people.value();

// Access via iteration
people.each((person, idx) => {
  console.log(`${person.value.name} is ${person.value.age} years old`);
});
```

#### Technical Details

- Extends `Data_Object` from the Data Model system
- Items are wrapped in `Data_Value` for consistency
- Internal `_arr` array stores actual items
- `Sorted_KVS` used for indexing
- Supports custom indexing via `fn_index` function
- Emits change events for all modifications
- Provides both getter/setter and direct access patterns

#### Collection vs collective

**Collection** is a reactive data structure class:
- For managing changing data with events
- Extends Data_Object
- Items wrapped in Data_Value
- Has methods: push, remove, clear, etc.
- Use when you need: change notifications, data binding, reactive UI updates

**collective** is a Proxy-based utility function:
- For batch operations on existing arrays
- Does NOT modify original array structure
- Does NOT emit events
- Returns results of operations
- Use when you need: concise batch property access, method calling on array items

---

### Data_Value - Reactive Typed Values

`Data_Value` provides **type-safe, reactive value containers** with validation, change events, and bidirectional synchronization.

#### Key Features

- Type validation using `Functional_Data_Type` from lang-mini
- Automatic string-to-type parsing (e.g., "42" → 42 for numbers)
- Change events only when values actually differ
- Bidirectional syncing between multiple Data_Values
- Immutable snapshots via `toImmutable()`
- Validation attempts via `attempt_set_value()`

#### Examples

**Basic Usage:**

```javascript
const {Data_Value, Functional_Data_Type} = require('lang-tools');

// Create typed value
const dv = new Data_Value({
  value: 42,
  data_type: Functional_Data_Type.integer
});

console.log(dv.value); // 42

// Change events
dv.on('change', (e) => {
  console.log('Changed from', e.old, 'to', e.value);
});

dv.value = 100; // Triggers change event
```

**Type Validation:**

```javascript
const numValue = new Data_Value({value: 10, data_type: Number});

// Automatic string parsing
numValue.value = '20'; // Converts to 20 (number)
console.log(typeof numValue.value); // 'number'

// Validation attempt
const result = numValue.attempt_set_value('not a number');
console.log(result.success); // false
console.log(numValue.value); // Still 20 (unchanged)
```

**Bidirectional Syncing:**

```javascript
const dv1 = new Data_Value(10);
const dv2 = new Data_Value(20);

// Sync them
Data_Value.sync(dv1, dv2);

// Changes propagate
dv1.value = 50;
console.log(dv2.value); // 50

dv2.value = 75;
console.log(dv1.value); // 75
```

**Three-Way Syncing with Type Conversion:**

```javascript
const numValue = new Data_Value({value: 10, data_type: Number});
const strValue = new Data_Value({value: '10', data_type: String});
const intValue = new Data_Value({value: 10, data_type: Functional_Data_Type.integer});

Data_Value.sync(numValue, strValue);
Data_Value.sync(numValue, intValue);

numValue.value = 42;
console.log(strValue.value); // '42' (string)
console.log(intValue.value); // 42 (number/integer)
```

**Immutability:**

```javascript
const original = new Data_Value(100);
const immutable = original.toImmutable();

console.log(immutable.value); // 100

// Immutable copy cannot be changed
immutable.value = 200; // Throws error

// Original remains mutable
original.value = 200; // Works fine
console.log(immutable.value); // Still 100
```

---

### Data_Integer & Data_String - Specialized Types

Specialized subclasses of `Data_Value` with stricter type enforcement.

#### Data_Integer

```javascript
const {Data_Integer} = require('lang-tools');

const age = new Data_Integer(25);

// Automatic string-to-integer conversion
age.value = '30';
console.log(typeof age.value); // 'number'
console.log(age.value); // 30

// Rejects invalid values
age.value = 'not a number'; // Throws error
age.value = null; // Throws error
age.value = 10.5; // May throw error (float not integer)
```

#### Data_String

```javascript
const {Data_String} = require('lang-tools');

const name = new Data_String('Alice');

// Automatic number-to-string conversion
name.value = 123;
console.log(typeof name.value); // 'string'
console.log(name.value); // '123'

// Rejects invalid values
name.value = null; // Throws error
name.value = undefined; // Throws error
name.value = {obj: true}; // Throws error
```

#### Syncing Integer and String

```javascript
const count = new Data_Integer(10);
const display = new Data_String('10');

Data_Integer.sync(count, display);

count.value = 50;
console.log(display.value); // '50' (string)

display.value = '75';
console.log(count.value); // 75 (number)
```

---

### Vector Math Utilities

Polymorphic vector and scalar math operations.

#### API

- **`v_add(a, b, ...)`** - Addition
- **`v_subtract(a, b, ...)`** - Subtraction
- **`v_multiply(a, b, ...)`** - Element-wise multiplication (scaling)
- **`v_divide(a, b, ...)`** - Element-wise division
- **`vector_magnitude(vector)`** - Calculate magnitude of 2D vector
- **`distance_between_points(points)`** - Euclidean distance between two points

#### Examples

```javascript
const {util} = require('lang-tools');

// Scalar operations
util.v_add(5, 10); // 15
util.v_subtract(10, 3); // 7
util.v_multiply(4, 5); // 20

// Vector operations
util.v_add([1, 2, 3], [4, 5, 6]); // [5, 7, 9]
util.v_subtract([10, 20], [3, 5]); // [7, 15]
util.v_multiply([2, 3], [4, 5]); // [8, 15]

// Vector-scalar operations
util.v_add([1, 2, 3], 10); // [11, 12, 13]
util.v_multiply([2, 4, 6], 3); // [6, 12, 18]

// Multiple arguments
util.v_add(1, 2, 3, 4); // 10
util.v_add([1, 1], [2, 2], [3, 3]); // [6, 6]

// Magnitude and distance
util.vector_magnitude([3, 4]); // 5
util.vector_magnitude([6, 8]); // 10

const points = [[0, 0], [3, 4]];
util.distance_between_points(points); // 5
```

---

### Type Conversion Utilities

#### npx / no_px - Pixel String Conversion

```javascript
const {util} = require('lang-tools');

// Remove 'px' suffix and convert to number
util.npx('100px'); // 100
util.npx('12.5px'); // 12.5
util.npx('-10px'); // -10
util.npx('50'); // 50 (handles strings without px)

// Works with arrays
util.npx(['10px', '20px', '30px']); // [10, 20, 30]

// Alias
util.no_px('100px'); // 100
```

#### filter_map_by_regex

```javascript
const map = {
  user_name: 'Alice',
  user_email: 'alice@example.com',
  admin_name: 'Bob',
  admin_role: 'superuser'
};

// Get all user-related properties
const userProps = util.filter_map_by_regex(map, /^user/);
// {user_name: 'Alice', user_email: 'alice@example.com'}

// Get all admin properties
const adminProps = util.filter_map_by_regex(map, /^admin/);
// {admin_name: 'Bob', admin_role: 'superuser'}
```

#### execute_on_each_simple

```javascript
const numbers = [1, 2, 3, 4, 5];
const doubled = util.execute_on_each_simple(numbers, (n) => n * 2);
// [2, 4, 6, 8, 10]

const strings = ['hello', 'world'];
const upper = util.execute_on_each_simple(strings, (s) => s.toUpperCase());
// ['HELLO', 'WORLD']
```

#### arr_rgb_to_css_hex_6

```javascript
// Convert RGB array to CSS hex color
util.arr_rgb_to_css_hex_6([255, 0, 0]); // '#ff0000'
util.arr_rgb_to_css_hex_6([0, 255, 0]); // '#00ff00'
util.arr_rgb_to_css_hex_6([0, 0, 255]); // '#0000ff'
util.arr_rgb_to_css_hex_6([255, 255, 255]); // '#ffffff'
```

---

## API Reference

### Module Exports

```javascript
const lang = require('lang-tools');

// Utilities
lang.collective(array) // Proxy-based batch operations
lang.collect(array)    // Alias for collective
lang.util              // Utility functions object

// Data Structures
lang.Collection        // Reactive collection class
lang.B_Plus_Tree       // Self-balancing tree
lang.Doubly_Linked_List
lang.Ordered_KVS
lang.Sorted_KVS

// Data Models
lang.Data_Model        // Base reactive model
lang.Data_Object       // Complex objects with fields
lang.Data_Value        // Reactive typed values
lang.Data_Integer      // Integer-specific reactive value
lang.Data_String       // String-specific reactive value
lang.Mini_Context      // Context for ID management

// Immutable variants
lang.Immutable_Data_Model
lang.Immutable_Data_Value

// From lang-mini (re-exported)
lang.Evented_Class
lang.Functional_Data_Type
lang.each
lang.tof
lang.fp
// ... and all other lang-mini exports
```

### Utility Functions (lang.util)

```javascript
// Vector math
util.vectorify(fn)           // Create vectorized function
util.v_add(a, b, ...)        // Vector addition
util.v_subtract(a, b, ...)   // Vector subtraction
util.v_multiply(a, b, ...)   // Vector multiplication (scaling)
util.v_divide(a, b, ...)     // Vector division
util.vector_magnitude(vec)   // Calculate magnitude
util.distance_between_points([p1, p2]) // Distance calculation

// Type conversions
util.npx(value)              // Remove 'px' and convert to number
util.no_px(value)            // Alias for npx
util.atof(array)             // Array type-of

// Object/Array utilities
util.execute_on_each_simple(items, fn) // Map with context preservation
util.mapify(...)             // Convert to object/map
util.filter_map_by_regex(map, regex) // Filter object keys by regex
util.str_arr_mapify(...)     // String array to map
util.arr_ltrb(...)           // Array to left-top-right-bottom
util.true_vals(obj)          // Get truthy values from object
util.group(...)              // Group items

// Color conversion
util.str_hex_to_int(hex)     // Hex string to integer
util.arr_rgb_to_css_hex_6(rgb) // RGB array to CSS hex

// Type conversion for typed arrays
util.Ui16toUi32(arr)         // Uint16 to Uint32 conversion
util.Ui32toUi16(arr)         // Uint32 to Uint16 conversion

// Validators
util.validators              // Object containing validation functions
```

---

## Examples

See the `examples/` directory for runnable demonstrations:

- **`ex_collection.js`** - Collection usage patterns
- **`ex_data_object.js`** - Data_Object features
- **`ex_data_value.js`** - Comprehensive Data_Value examples
- **`ex_string_data_value.js`** - Data_String specifics
- **`ex_string_and_integer_data_values.js`** - Type syncing examples

Run examples:

```bash
node examples/ex_data_value.js
node examples/ex_collection.js
```

---

## Testing

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage

# Run legacy node:test suite
npm run test:legacy
```

### Test Coverage

The project includes comprehensive Jest tests:

- **Data_Value**: 47+ tests (validation, type conversion, syncing, events, immutability)
- **Data_Integer**: 34+ tests (creation, conversion, events, syncing with Data_String)
- **Data_String**: 44+ tests (creation, conversion, manipulation, syncing)
- **Collection**: 55+ tests (CRUD operations, iteration, events, indexing)
- **collective**: 33+ tests (property access, method calls, edge cases)
- **util**: 66+ tests (vector math, type conversions, utilities)

**Total: 279+ comprehensive tests**

### Test Structure

```
test/
  ├── setup.js              # Jest setup and custom matchers
  ├── data_value.test.js    # Data_Value tests
  ├── data_integer.test.js  # Data_Integer tests
  ├── data_string.test.js   # Data_String tests
  ├── collection.test.js    # Collection tests
  ├── collective.test.js    # collective utility tests
  ├── util.test.js          # Utility functions tests
  └── test-all.js           # Legacy node:test aggregator
```

---

## Architecture

### Directory Structure

```
lang-tools/
├── Data_Model/           # Core reactive data model system
│   ├── new/             # Active development (Data_Value, specialized types)
│   ├── old/             # Legacy implementations (Data_Object, Collection)
│   ├── Data_Model.js    # Base class
│   ├── Data_Object.js   # Thin wrapper → old/Data_Object.js
│   ├── Data_Value.js    # Thin wrapper → new/Data_Value.js
│   └── Collection.js    # Thin wrapper → old/Collection.js
├── b-plus-tree/         # B+ tree implementation
├── examples/            # Runnable examples
├── test/                # Jest test suite
├── collective.js        # Proxy-based batch operations utility
├── util.js              # Vector math and utility functions
├── lang.js              # Main entry point
└── package.json
```

### The "new" vs "old" Pattern

- **`new/`** - Modern implementations with improved APIs (Data_Value, Data_Integer, Data_String)
- **`old/`** - Legacy implementations still used by main exports (Data_Object, Collection)
- Root files are thin wrappers that require from `new/` or `old/`

### Data Model Hierarchy

```
Evented_Class (from lang-mini)
    └── Data_Model
        ├── Data_Value (new/)
        │   ├── Data_Integer
        │   └── Data_String
        ├── Immutable_Data_Value
        └── Data_Object (old/)
            └── Collection
```

### Key Concepts

1. **Reactivity**: Data models emit events on changes for UI binding
2. **Type Safety**: Functional_Data_Type provides validation
3. **Synchronization**: Bidirectional syncing between data values
4. **Immutability**: Deep immutable snapshots for state management
5. **Context**: Mini_Context manages IDs and object relationships

---

## Dependencies

- **lang-mini** (0.0.39): Platform providing Evented_Class, type checking, functional utilities
- **fnl** (^0.0.36): Functional programming library

---

## License

MIT License - see [LICENSE](LICENSE) file for details.

---

## Contributing

Contributions welcome! Please:

1. Run tests: `npm test`
2. Ensure coverage: `npm run test:coverage`
3. Follow existing code style
4. Add tests for new features
5. Update documentation

---

## Support

- **Issues**: https://github.com/metabench/lang-tools/issues
- **Repository**: https://github.com/metabench/lang-tools
- **Author**: James Vickers <james@metabench.com>

---

## Version

Current version: **0.0.36**

Requires Node.js >= 12.0.0
