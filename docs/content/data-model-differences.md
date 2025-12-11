Status: WIP
Last-Updated: 2025-12-11
Owner: @unassigned

# lang-tools Full Stack Documentation

This document provides comprehensive documentation about the lang-tools module, its dependencies, class hierarchies, and how all components fit together.

---

## Table of Contents

1. [Stack Overview](#stack-overview)
2. [Dependency Graph](#dependency-graph)
3. [lang-mini - Core Foundation](#lang-mini---core-foundation)
4. [Data Model Class Hierarchy](#data-model-class-hierarchy)
5. [Data_Value - Reactive Typed Values](#data_value---reactive-typed-values)
6. [Data_Object - Reactive Objects](#data_object---reactive-objects)
7. [Collection - Reactive Arrays](#collection---reactive-arrays)
8. [Supporting Data Structures](#supporting-data-structures)
9. [Utility Functions](#utility-functions)
10. [Old vs New API Migration](#old-vs-new-api-migration)
11. [Application Layer](#application-layer)

---

## Stack Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        APPLICATION LAYER                            │
│  apps/docs-browser (Express + jsgui3-html + markdown-it)           │
├─────────────────────────────────────────────────────────────────────┤
│                         LANG-TOOLS                                  │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │                    Data Model System                          │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐   │ │
│  │  │ Data_Value  │  │ Data_Object │  │     Collection      │   │ │
│  │  │ Data_Number │  │             │  │                     │   │ │
│  │  │ Data_Integer│  │             │  │                     │   │ │
│  │  │ Data_String │  │             │  │                     │   │ │
│  │  └─────────────┘  └─────────────┘  └─────────────────────┘   │ │
│  │         ▲                ▲                   ▲                │ │
│  │         └────────────────┼───────────────────┘                │ │
│  │                          │                                    │ │
│  │                   ┌──────┴──────┐                             │ │
│  │                   │ Data_Model  │                             │ │
│  │                   └──────┬──────┘                             │ │
│  └──────────────────────────┼────────────────────────────────────┘ │
│  ┌──────────────────────────┼────────────────────────────────────┐ │
│  │        Supporting Structures         │                        │ │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────┐                 │ │
│  │  │ Sorted_KVS│  │B_Plus_Tree│  │Ordered_KVS│                 │ │
│  │  └───────────┘  └───────────┘  └───────────┘                 │ │
│  └───────────────────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │                    Utilities                                  │ │
│  │  collective.js  │  util.js (vector math, conversions)        │ │
│  └───────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────┤
│                         LANG-MINI                                   │
│  Evented_Class │ tof │ each │ fp │ Functional_Data_Type │ field   │
│  is_defined │ is_array │ mapify │ arrayify │ get_a_sig │ stringify │
├─────────────────────────────────────────────────────────────────────┤
│                         NODE.JS                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Dependency Graph

### Runtime Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| **lang-mini** | ^0.0.46 | Core foundation - events, types, utilities |
| **fnl** | ^0.0.37 | Functional/reactive patterns |

### Internal Modules (not npm packages)

| Module | Purpose |
|--------|---------|
| **sorted-kvs** | B+ tree-backed sorted key-value storage |
| **b-plus-tree** | Self-balancing tree implementation |
| **ordered-kvs** | Insertion-ordered key-value storage |
| **doubly-linked-list** | Double-ended linked list |

### Dev Dependencies

| Package | Version | Purpose | Usage Location |
|---------|---------|---------|----------------|
| **jest** | ^30.2.0 | Testing framework | test/ |
| **express** | ^5.1.0 | Web server | apps/docs-browser |
| **jsgui3-html** | ^0.0.170 | HTML generation | apps/docs-browser |
| **jsgui3-client** | ^0.0.120 | Client-side framework | apps/docs-browser |
| **markdown-it** | ^14.1.0 | Markdown parsing | apps/docs-browser |

> **Note:** jsgui3-html and jsgui3-client are devDependencies because they depend on lang-tools.
> The apps/docs-browser is a development tool, not part of the core library.

### Internal Module Dependencies

```
lang.js (main entry point)
├── lang-mini (foundation)
├── Data_Model/new/Collection.js
│   ├── Data_Model/new/Data_Object.js
│   │   ├── Data_Model/Data_Model.js
│   │   │   └── lang-mini.Evented_Class
│   │   └── Data_Model/new/Data_Value.js
│   │       └── Data_Model/new/Base_Data_Value.js
│   └── sorted-kvs.js
│       └── b-plus-tree/b-plus-tree.js
├── Data_Model/new/Data_Object.js
├── Data_Model/new/Data_Value.js
├── Data_Model/new/Immutable_Data_Value.js
├── collective.js
├── util.js
├── doubly-linked-list.js
├── ordered-kvs.js
└── sorted-kvs.js
```

---

## lang-mini - Core Foundation

**lang-mini** is the foundational platform that provides core utilities, type system, and event infrastructure. All Data_Model classes ultimately depend on lang-mini.

### Key Exports Used by lang-tools

#### Evented_Class - Event System Base

The foundation for all reactive classes. Provides `on()`, `raise()`, `trigger()` methods.

```javascript
const {Evented_Class} = require('lang-mini');

class Data_Model extends Evented_Class {
    constructor(spec = {}) {
        super(spec);
        // Now has event capabilities: .on(), .raise(), .trigger()
    }
}
```

**Used in:**
- `Data_Model/Data_Model.js` - Base class for all data models
- `lang.js` - Creates root evented instance

#### Type Detection Functions

| Function | Purpose | Example |
|----------|---------|---------|
| `tof(value)` | Enhanced typeof | `tof([]) → 'array'`, `tof(dv) → 'data_value'` |
| `get_a_sig(args)` | Argument signature | `get_a_sig([1, 'a']) → '[n,s]'` |
| `get_item_sig(item)` | Single item signature | `get_item_sig({}) → 'o'` |
| `is_defined(val)` | Not null/undefined | `is_defined(0) → true` |
| `is_array(val)` | Array check | `is_array([]) → true` |

**Signature codes:**
- `s` = string, `n` = number, `i` = integer, `o` = object, `a` = array
- `f` = function, `D` = Data_Object, `c` = control

```javascript
const {tof, get_a_sig, is_defined} = require('lang-mini');

// Type detection
tof('hello')        // 'string'
tof(42)             // 'number'
tof([1,2,3])        // 'array'
tof(new Data_Value) // 'data_value'
tof(new Collection) // 'collection'

// Signature matching for polymorphic functions
function polymorphic() {
    const sig = get_a_sig(arguments);
    if (sig === '[s,n]') { /* string, number */ }
    if (sig === '[o]')   { /* object */ }
}
```

**Used in:**
- `Data_Model/new/Data_Value.js` - Type validation
- `Data_Model/new/Data_Object.js` - Polymorphic get/set
- `Data_Model/new/Collection.js` - Type-aware push/get
- `util.js` - Vector math polymorphism

#### Functional_Data_Type - Type Validation System

Defines data types with parsing, validation, and transformation capabilities.

```javascript
const {Functional_Data_Type} = require('lang-mini');

// Built-in types
Functional_Data_Type.integer  // Integer validation + parsing
Functional_Data_Type.string   // String validation
Functional_Data_Type.number   // Number validation + parsing

// Usage in Data_Value
const dv = new Data_Value({
    value: '42',
    data_type: Functional_Data_Type.integer
});
// dv.value is now 42 (parsed from string)
```

**Used in:**
- `Data_Model/new/Data_Integer.js` - Integer type enforcement
- `Data_Model/new/Data_Number.js` - Number type enforcement
- `Data_Model/new/setup_data_value_data_type_set.js` - Type validation

#### Iteration and Collection Utilities

| Function | Purpose | Example |
|----------|---------|---------|
| `each(arr, fn)` | Iterate arrays/objects | `each([1,2], (v,i) => ...)` |
| `mapify(fn)` | Create map-accepting function | Enables `fn({a:1, b:2})` |
| `arrayify(fn)` | Create array-accepting function | Enables `fn([1, 2, 3])` |
| `fp(fn)` | Functional polymorphism | Multi-signature functions |

```javascript
const {each, mapify, fp} = require('lang-mini');

// Iteration
each([1, 2, 3], (value, index) => {
    console.log(index, value);
});

each({a: 1, b: 2}, (value, key) => {
    console.log(key, value);
});

// Mapify - used by Sorted_KVS.put()
Sorted_KVS.prototype.put = mapify(function(key, value) {
    this.tree.insert(key, value);
});
// Now supports: kvs.put('key', 'value') AND kvs.put({a: 1, b: 2})
```

**Used in:**
- `Data_Model/new/Collection.js` - Item iteration
- `Data_Model/new/Data_Object.js` - Field iteration
- `sorted-kvs.js` - Polymorphic put()
- `util.js` - Vectorized functions

#### Property and Field Utilities

| Function | Purpose |
|----------|---------|
| `field(obj, name, spec)` | Define reactive property |
| `ll_get(obj, path)` | Deep property access |
| `ll_set(obj, path, val)` | Deep property set |
| `input_processors` | Type-specific input transformation |

```javascript
const {field, ll_get, input_processors} = require('lang-mini');

// Deep access
ll_get(obj, 'user.profile.name')  // Gets nested property

// Input processors for type coercion
input_processors.number('42')  // Returns 42 (number)
```

**Used in:**
- `Data_Model/new/Base_Data_Value.js` - Property setup
- `Data_Model/new/Data_Object.js` - Deep get/set

---

## Data Model Class Hierarchy

### Inheritance Tree

```
Evented_Class (lang-mini)
│
└── Data_Model
    │   Location: Data_Model/Data_Model.js
    │   Purpose: Base class with context, name, __type
    │
    ├── Base_Data_Value
    │   │   Location: Data_Model/new/Base_Data_Value.js
    │   │   Purpose: Shared value property setup, equals(), _id()
    │   │
    │   ├── Data_Value
    │   │   │   Location: Data_Model/new/Data_Value.js
    │   │   │   Purpose: Full reactive value with type validation
    │   │   │
    │   │   ├── Data_Number
    │   │   │       Location: Data_Model/new/Data_Number.js
    │   │   │       Purpose: Number-typed reactive value
    │   │   │
    │   │   └── Data_Integer
    │   │           Location: Data_Model/new/Data_Integer.js
    │   │           Purpose: Integer-typed reactive value
    │   │
    │   └── Data_String
    │           Location: Data_Model/new/Data_String.js
    │           Purpose: String-typed reactive value
    │
    ├── Data_Object
    │   │   Location: Data_Model/new/Data_Object.js
    │   │   Purpose: Reactive object with get/set, field support
    │   │
    │   └── Collection
    │           Location: Data_Model/new/Collection.js
    │           Purpose: Reactive array with indexing, events
    │
    └── Immutable_Data_Model
        │   Location: Data_Model/new/Immutable_Data_Model.js
        │   Purpose: Base for frozen data structures
        │
        ├── Immutable_Base_Data_Value
        │       Location: Data_Model/new/Immutable_Base_Data_Value.js
        │
        └── Immutable_Data_Value
                Location: Data_Model/new/Immutable_Data_Value.js
                Purpose: Frozen value snapshot
```

### Data_Model - Base Class

**File:** `Data_Model/Data_Model.js`

The root class for all data model types. Extends `Evented_Class` to provide event capabilities.

```javascript
class Data_Model extends Evented_Class {
    constructor(spec = {}) {
        super(spec);
        this.__data_model = true;       // Type flag
        this.__type = 'data_model';     // Type name
        if (spec.context) this.context = spec.context;
        if (spec.name) this.name = spec.name;
    }
}
```

**Key Properties:**
| Property | Type | Purpose |
|----------|------|---------|
| `__data_model` | boolean | Type identification flag |
| `__type` | string | Type name for `tof()` detection |
| `context` | Mini_Context | ID generation and object registry |
| `name` | string | Optional instance name |

**Inherited from Evented_Class:**
- `on(event, handler)` - Register event listener
- `raise(event, data)` - Emit event to listeners
- `trigger(event, data)` - Alias for raise

---

## Data_Value - Reactive Typed Values

### Class Structure

**File:** `Data_Model/new/Data_Value.js`

```javascript
class Data_Value extends Base_Data_Value {
    constructor(spec = {}) {
        // Accepts: new Data_Value(42) or new Data_Value({value: 42, data_type: Number})
        const actual_spec = spec !== null && typeof spec === 'object' && !Array.isArray(spec)
            ? spec : {value: spec};
        super(actual_spec);

        // Type validation setup
        if (this.data_type) {
            setup_data_value_data_type_set(this, this.data_type);
        }

        // Set initial value
        if (initial_value_is_present) {
            this.value = initial_value;
        }

        this.__type = 'data_value';
    }
}
```

### API Reference

| Method/Property | Type | Description |
|-----------------|------|-------------|
| `.value` | getter/setter | Access/modify the stored value |
| `.data_type` | property | Functional_Data_Type for validation |
| `.attempt_set_value(val)` | method | Try to set value, returns Value_Set_Attempt |
| `.toImmutable()` | method | Returns frozen Immutable_Data_Value |
| `.toJSON()` | method | JSON representation |
| `.toString()` | method | String representation |
| `.equals(other)` | method | Deep equality check |
| `.get()` | method | Alias for .value getter |
| `.set(val)` | method | Alias for .value = val |

### Value Property Implementation

**File:** `Data_Model/new/setup_base_data_value_value_property.js`

The `.value` property is defined with a custom getter/setter that:
1. Stores value in closure (not `this._`)
2. Fires `change` events on modification
3. Supports type validation via `data_type`

```javascript
// Internal implementation (simplified)
Object.defineProperty(data_value, 'value', {
    get() {
        return internal_value;
    },
    set(new_value) {
        const old = internal_value;
        if (!equals(old, new_value)) {
            internal_value = new_value;
            data_value.raise('change', {
                name: 'value',
                value: new_value,
                old: old
            });
        }
    }
});
```

### Typed Data Values

#### Data_Integer

**File:** `Data_Model/new/Data_Integer.js`

```javascript
const intVal = new Data_Integer(42);
intVal.value = '100';  // Parsed to 100 (integer)
intVal.value = 3.14;   // Throws or truncates (depending on strict mode)
```

#### Data_Number

**File:** `Data_Model/new/Data_Number.js`

```javascript
const numVal = new Data_Number(3.14);
numVal.value = '2.5';  // Parsed to 2.5 (number)
```

#### Data_String

**File:** `Data_Model/new/Data_String.js`

```javascript
const strVal = new Data_String('hello');
strVal.value = 42;  // Converted to '42' (string)
```

### Bidirectional Syncing

**Static Method:** `Data_Value.sync(a, b)`

Synchronizes two Data_Values so changes to either propagate to the other.

```javascript
const num = new Data_Value(10);
const str = new Data_Value('10');

Data_Value.sync(num, str);

num.value = 50;
console.log(str.value); // '50' (auto-converted)

str.value = '75';
console.log(num.value); // 75 (if num has number type)
```

**Implementation details:**
- Uses `__sync_state` with `updatingFrom` Set to prevent infinite loops
- Aligns initial values on sync setup
- Fires change events normally

---

## Data_Object - Reactive Objects

### Class Structure

**File:** `Data_Model/new/Data_Object.js`

```javascript
class Data_Object extends Data_Model {
    constructor(spec = {}, fields) {
        super(spec);
        this._ = {};                        // Internal storage
        this.__type_name = 'data_object';
        this.__data_object = true;

        if (fields) this.set_fields_from_spec(fields, spec);
        if (spec.parent) this.parent = spec.parent;
    }
}
```

### API Reference

| Method/Property | Type | Description |
|-----------------|------|-------------|
| `.get(key)` | method | Get field value (returns Data_Value) |
| `.set(key, val)` | method | Set field value |
| `.has(key)` | method | Check if field exists |
| `.keys()` | method | Get all field names |
| `.each(fn)` | method | Iterate over fields |
| `.parent` | property | Parent object reference |
| `._id()` | method | Get/generate unique ID |
| `.toJSON()` | method | JSON representation |

### Field Access Patterns

```javascript
const obj = new Data_Object();

// Set values
obj.set('name', 'Alice');
obj.set('age', 30);

// Get values (returns Data_Value wrapper)
const nameField = obj.get('name');
console.log(nameField.value);  // 'Alice'

// Deep access
obj.set('user.profile.name', 'Bob');
const name = obj.get('user.profile.name');

// Iteration
obj.each((value, key) => {
    console.log(key, value);
});
```

### Change Events

```javascript
const obj = new Data_Object();

obj.on('change', (event) => {
    console.log('Field changed:', event.name);
    console.log('New value:', event.value);
});

obj.set('status', 'active');  // Triggers change event
```

---

## Collection - Reactive Arrays

### Class Structure

**File:** `Data_Model/new/Collection.js`

```javascript
class Collection extends Data_Object {
    constructor(spec = {}, arr_values) {
        super(spec);
        this.__type = 'collection';
        this._arr = [];                    // Internal array storage
        this._arr_idx = 0;                 // Index counter
        this.index = new Sorted_KVS();     // B+ tree index
        this.fn_index = spec.fn_index;     // Custom index function

        if (spec.load_array) {
            this.load_array(spec.load_array);
        }
    }
}
```

### API Reference

| Method | Description |
|--------|-------------|
| `.push(item)` | Add item to end (wraps primitives in Data_Value) |
| `.insert(item, pos)` | Insert at position (does NOT wrap primitives) |
| `.get(index)` | Get item at index |
| `.remove(index)` | Remove item at index |
| `.clear()` | Remove all items |
| `.length()` | Get item count |
| `.len` | Property alias for length |
| `.each(fn)` | Iterate: `fn(item, index)` |
| `.find(key)` | Find by index key |
| `.has(key)` | Check existence in index |
| `.set(value)` | Replace contents with array or single value |
| `.value()` | Get array of unwrapped values |
| `.values()` | Get internal `_arr` array |
| `.toObject()` | Convert items to plain objects |

### Item Wrapping Behavior

**Important:** Different methods have different wrapping behaviors:

| Method | Primitives | Objects | Data_Value |
|--------|------------|---------|------------|
| `push()` | Wrapped in Data_Value | Stored directly | Stored directly |
| `insert()` | Stored directly (raw) | Stored directly | Stored directly |

```javascript
const coll = new Collection();

// push() wraps primitives
coll.push('hello');
coll.get(0).value;  // 'hello' (via Data_Value.value property)

// push() doesn't wrap objects
coll.push({name: 'test'});
coll.get(1);        // {name: 'test'} (raw object)

// insert() doesn't wrap anything
coll.insert('raw', 0);
coll.get(0);        // 'raw' (not wrapped)
```

### Indexing with Sorted_KVS

Collections use a B+ tree-backed sorted key-value store for fast lookups.

```javascript
// Custom index function
const coll = new Collection({
    fn_index: (item) => item.id
});

coll.push({id: 'user_1', name: 'Alice'});
coll.push({id: 'user_2', name: 'Bob'});

// Fast lookup by indexed key
const user = coll.find('user_1');
```

### Change Events

```javascript
const coll = new Collection();

coll.on('change', (event) => {
    switch(event.name) {
        case 'insert':
            console.log('Added:', event.value, 'at', event.position);
            break;
        case 'remove':
            console.log('Removed:', event.value, 'from', event.position);
            break;
        case 'clear':
            console.log('Collection cleared');
            break;
    }
});

coll.push('item');   // insert event
coll.remove(0);      // remove event
coll.clear();        // clear event
```

### Silent Mode

Suppress events for batch operations:

```javascript
coll.silent = true;
coll.push('a');
coll.push('b');
coll.push('c');
coll.silent = false;
// No change events fired during silent mode
```

---

## Supporting Data Structures

### Sorted_KVS - Sorted Key-Value Store

**File:** `sorted-kvs.js`

B+ tree-backed sorted key-value storage with O(log n) operations.

```javascript
const Sorted_KVS = require('./sorted-kvs');
const kvs = new Sorted_KVS();

// Operations
kvs.put('key', 'value');              // Insert/update
kvs.get('key');                       // Returns [values] array
kvs.has('key');                       // Boolean check
kvs.out('key');                       // Remove
kvs.clear();                          // Remove all

// Iteration
kvs.keys();                           // All keys in sorted order
kvs.keys_and_values();                // Array of [key, value] pairs
kvs.each((value, key) => { ... });    // Iterate all

// Prefix queries (autocomplete-style)
kvs.get_keys_by_prefix('use');        // ['user', 'username', ...]
kvs.get_by_prefix('use');             // Values for matching keys

// Counting
kvs.key_count();                      // Total key count
kvs.key_count('specific');            // Count for specific key
```

**Used by:**
- Collection.index for fast item lookups

### B_Plus_Tree - Self-Balancing Tree

**File:** `b-plus-tree/b-plus-tree.js`

Underlying storage for Sorted_KVS. Order-12 B+ tree implementation.

```javascript
const B_Plus_Tree = require('./b-plus-tree/b-plus-tree');
const tree = B_Plus_Tree(12);  // Order 12

tree.insert(key, value);
tree.get_values_by_key(key);
tree.remove(key);
tree.keys();
tree.count();
tree.clear();
```

### Ordered_KVS - Insertion-Ordered Storage

**File:** `ordered-kvs.js`

Maintains insertion order using doubly-linked list.

```javascript
const Ordered_KVS = require('./ordered-kvs');
const kvs = new Ordered_KVS();

kvs.set('a', 1);
kvs.set('b', 2);
kvs.keys();  // ['a', 'b'] - insertion order preserved
```

### Doubly_Linked_List

**File:** `doubly-linked-list.js`

Double-ended list with O(1) head/tail operations.

```javascript
const Doubly_Linked_List = require('./doubly-linked-list');
const list = new Doubly_Linked_List();

list.push_head(value);
list.push_tail(value);
list.pop_head();
list.pop_tail();
```

---

## Utility Functions

### collective.js - Batch Array Operations

**File:** `collective.js`

Proxy-based utility for batch operations on arrays.

```javascript
const {collective} = require('lang-tools');

const people = [
    {name: 'Alice', greet: () => 'Hi!'},
    {name: 'Bob', greet: () => 'Hello!'}
];

// Batch property access
collective(people).name;          // ['Alice', 'Bob']

// Batch method calls
collective(people).greet();       // ['Hi!', 'Hello!']

// Preserves array methods
collective(people).length;        // 2
collective(people)[0];            // {name: 'Alice', ...}
```

### util.js - Vector Math and Conversions

**File:** `util.js`

#### Vector Operations

```javascript
const {util} = require('lang-tools');

// Vector addition (polymorphic)
util.v_add(1, 2);               // 3
util.v_add([1,2], [3,4]);       // [4, 6]
util.v_add([1,2], 10);          // [11, 12]

// Vector subtraction
util.v_subtract([10,20], [3,5]); // [7, 15]

// Vector multiplication (element-wise)
util.v_multiply([2,3], [4,5]);  // [8, 15]
util.v_multiply([2,3], 10);     // [20, 30]

// Vector division
util.v_divide([10,20], [2,4]);  // [5, 5]

// Magnitude and distance
util.vector_magnitude([3, 4]);             // 5
util.distance_between_points([[0,0], [3,4]]); // 5
```

#### Type Conversions

```javascript
// Remove 'px' suffix
util.npx('100px');              // 100
util.npx(['10px', '20px']);     // [10, 20]
util.no_px('50px');             // 50 (alias)

// RGB to CSS hex
util.arr_rgb_to_css_hex_6([255, 0, 0]);   // '#ff0000'
util.arr_rgb_to_css_hex_6([0, 255, 0]);   // '#00ff00'

// Hex string to integer
util.str_hex_to_int('ff');      // 255

// Filter object by regex
util.filter_map_by_regex({a: 1, ab: 2, b: 3}, /^a/);  // {a: 1, ab: 2}
```

---

## Old vs New API Migration

### Summary of Changes

| Aspect | Old API | New API |
|--------|---------|---------|
| Value access | `dv.value()` method | `dv.value` property |
| Value set | `dv.set(x)` method | `dv.value = x` assignment |
| Clone | `dv.clone()` | `dv.toImmutable()` |
| Collection items | `coll.get(i).value()` | `coll.get(i).value` |
| Internal storage | Old Data_Value | New Data_Value |

### File Locations

| Component | Old Location | New Location (Active) |
|-----------|--------------|----------------------|
| Data_Value | `Data_Model/old/Data_Value.js` | `Data_Model/new/Data_Value.js` |
| Data_Object | `Data_Model/old/Data_Object.js` | `Data_Model/new/Data_Object.js` |
| Collection | `Data_Model/old/Collection.js` | `Data_Model/new/Collection.js` |

### Proxy Modules

Root-level files re-export from `new/`:

```javascript
// Data_Model/Data_Value.js
module.exports = require('./new/Data_Value');

// Data_Model/Data_Object.js
module.exports = require('./new/Data_Object');

// Data_Model/Collection.js
module.exports = require('./new/Collection');
```

### Migration Examples

```javascript
// OLD
const val = dataValue.value();
dataValue.set(42);
const clone = dataValue.clone();
const itemVal = collection.get(0).value();

// NEW
const val = dataValue.value;
dataValue.value = 42;
const immutable = dataValue.toImmutable();
const itemVal = collection.get(0).value;
```

### API Compatibility Matrix

| Feature | Old API | New API | Notes |
|---------|---------|---------|-------|
| Access primitive value | `dv.value()` method | `dv.value` (property) | Search/replace: `dv.value()` -> `dv.value` |
| Set primitive value | `dv.set(value)` | `dv.value = value` | Convert to property assignment |
| Create typed value | `new Data_Value({value, data_type})` | Same | New supports Functional_Data_Type |
| Clone / Immutable | `dv.clone()` | `dv.toImmutable()` | Returns frozen snapshot |
| Events | `dv.on('change', fn)` | Same | Payload may include Value_Set_Attempt |

### Detailed Comparison Tables

#### Data_Value

| Dimension | old/Data_Value | new/Data_Value |
|-----------|----------------|----------------|
| Storage | Internal `_value` slot | ES getter/setter backed by closure |
| Mutation API | `.set(value)` and `.value(newValue)` | `dv.value = newValue` + `attempt_set_value` |
| Type validation | Ad hoc processors | `Functional_Data_Type` + `setup_data_value_data_type_set.js` |
| Immutability | `clone()` returns mutable copy | `toImmutable()` returns frozen `Immutable_Data_Value` |
| Sync | Manual event listeners | `Data_Value.sync` helper |

#### Data_Object

| Dimension | old/Data_Object | new/Data_Object |
|-----------|-----------------|-----------------|
| Field access | `.get(key)` returns old Data_Value | Returns new Data_Value with `.value` property |
| Iteration | `.each(fn)` yields Data_Value wrappers | Same pattern |
| Serialization | `toJSON()` may return JSON string | Returns plain JS object |
| Type strictness | "Store anything" | Prefers explicit `data_type` |

See [MIGRATION_CHECKLIST_FOR_AI_AGENTS.md](../MIGRATION_CHECKLIST_FOR_AI_AGENTS.md) for complete migration guide.

---

## Application Layer

### docs-browser App

**File:** `apps/docs-browser/server.js`

Express-based documentation viewer using jsgui3-html for rendering.

#### Dependencies Used

| Package | Purpose |
|---------|---------|
| express | HTTP server (port 3001) |
| jsgui3-html | HTML document/control generation |
| jsgui3-client | Client-side framework (served static) |
| markdown-it | Markdown to HTML conversion |

#### Architecture

```javascript
const express = require('express');
const jsgui = require('jsgui3-html');
const markdownit = require('markdown-it');

const app = express();
const md = markdownit({html: true, linkify: true, typographer: true});

// Serve jsgui3-client static files
app.use('/jsgui3-client', express.static(jsgui_client_path));

// Dynamic markdown rendering
app.get('/docs/:file', (req, res) => {
    const content = fs.readFileSync(path);
    const html = md.render(content);

    // Build HTML document using jsgui
    const doc = new jsgui.Blank_HTML_Document();
    const body = doc.body;
    body.add(new jsgui.Control({el: 'div', innerHTML: html}));

    res.send(doc.all_html_btc());
});

app.listen(3001);
```

---

## Testing

### Test Files

| File | Coverage |
|------|----------|
| `test/data_value.test.js` | Data_Value functionality |
| `test/data_integer.test.js` | Data_Integer specifics |
| `test/data_string.test.js` | Data_String specifics |
| `test/collection.test.js` | Collection operations |
| `test/collective.test.js` | collective utility |
| `test/util.test.js` | util.js functions |
| `test/new_data_object.test.js` | New Data_Object |
| `test/data_model_comparison.test.js` | Old vs new comparison |

### Running Tests

```bash
# List tests (dry run)
npx jest --listTests

# Run all tests
npm test

# Run specific file
npx jest --runInBand --runTestsByPath test/collection.test.js

# Run with coverage
npm run test:coverage

# Run legacy tests
RUN_LEGACY_TESTS=1 npx jest --runInBand
```

---

## Quick Reference

### Imports

```javascript
const lang = require('lang-tools');

// Classes
const {Collection, Data_Value, Data_Object} = lang;
const {Data_Integer, Data_String, Data_Number} = lang;
const {Immutable_Data_Value, Immutable_Data_Model} = lang;

// Utilities
const {collective, collect} = lang;
const {util} = lang;

// Data structures
const {Sorted_KVS, Ordered_KVS, B_Plus_Tree} = lang;

// From lang-mini (re-exported)
const {tof, each, is_defined, Evented_Class} = lang;
const {Functional_Data_Type, fp, mapify} = lang;
```

### Common Patterns

```javascript
// Reactive value with events
const count = new Data_Value(0);
count.on('change', e => console.log('Count:', e.value));
count.value = 10;

// Typed value with validation
const age = new Data_Integer(25);
age.value = '30';  // Parsed to 30

// Bidirectional sync
const source = new Data_Value(100);
const display = new Data_String('100');
Data_Value.sync(source, display);

// Reactive collection
const items = new Collection(['a', 'b', 'c']);
items.on('change', e => console.log('Changed:', e.name));
items.push('d');

// Immutable snapshot
const snapshot = count.toImmutable();
snapshot.value = 999;  // Throws TypeError
```

---

## Retirement Plan for Old Implementations

1. **Feature parity audit**
   - [ ] Re-run focused suites with new stack
   - [ ] Expand modern tests for legacy-only behaviors

2. **Deprecation messaging**
   - [ ] Add warnings in `Data_Model/old/*` constructors
   - [ ] Update README + docs with deprecation notices

3. **Consumer migration**
   - [x] Update `lang.js` exports to prefer new classes *(Done: Nov 21, 2025)*
   - [ ] Provide codemods for method-to-property conversion

4. **Test transition**
   - [ ] Port critical `test/old_*` assertions to new suites
   - [ ] Remove legacy Jest files after parity confirmed

5. **Code removal**
   - [ ] Delete `Data_Model/old/*` after deprecation period
   - [x] Clean up export indirection *(Done: Nov 21, 2025)*

6. **Post-removal verification**
   - [ ] Run full test suite
   - [ ] Bump package version and document in CHANGELOG
