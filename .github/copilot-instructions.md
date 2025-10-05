# lang-tools AI Agent Instructions

## Project Overview
lang-tools is a JavaScript data structures and utilities library that extends `lang-mini` with advanced data modeling capabilities. The core focus is on **reactive data models** (Data_Model, Data_Value, Data_Object) that provide event-driven, typed data structures with validation and synchronization support.

📊 **[View Architecture Diagrams](./architecture-diagrams.md)** - Detailed SVG visualizations of class hierarchy, directory patterns, data flow, and module dependencies.

🐛 **[Bug Tracking System](../BUGS.md)** - Searchable bug registry with IDs like `<BUG001>`. See **[AGENTS.md](./AGENTS.md)** for bug fixing workflow and instructions.

## Architecture: The Data Model System

### Core Hierarchy
The project centers on a data model inheritance chain:
- **Data_Model** (base class, extends `Evented_Class` from lang-mini) - provides event infrastructure
- **Data_Object** (`Data_Model/old/Data_Object.js`) - complex objects with fields, relationships, and hierarchies
- **Data_Value** (`Data_Model/new/Data_Value.js`) - typed values with validation, change events, and sync capabilities
- **Immutable_Data_Value** / **Immutable_Data_Model** - immutable counterparts for snapshots and safe state passing

### The "new" vs "old" Pattern
Files in `Data_Model/new/` represent active development with improved APIs:
- `new/` contains current implementations (Data_Value, Base_Data_Value, specialized types like Data_String, Data_Integer)
- `old/` contains legacy implementations (Data_Object, Collection) still used by main exports
- Main files like `Data_Object.js` and `Data_Value.js` at Data_Model root are **thin wrappers** that `require()` from old/ or new/

### Key Data Structures
- **B_Plus_Tree** (`b-plus-tree/`) - self-balancing tree for sorted data
- **Collection** (`Data_Model/old/Collection.js`) - array-like with indexing, constraints, relationships
- **Doubly_Linked_List**, **Ordered_KVS**, **Sorted_KVS** - specialized collections
- **collective** (`collective.js`) - Proxy-based utility for batch operations on arrays (e.g., `collective(arr).method()` calls method on all items)

## Critical Concepts for AI Agents

### 1. Data_Value Reactivity Model
Data_Values are **reactive wrappers** with sophisticated behavior:
```javascript
// Typed data value with validation
const dv = new Data_Value({value: 3, data_type: Functional_Data_Type.integer});
dv.on('change', e => { /* react to changes */ });
dv.value = 5; // Triggers change event if valid

// Syncing between data values (even different types)
Data_Value.sync(dv1, dv2); // Bidirectional sync with automatic type conversion
```

**Key insight**: Data_Value handles:
- Type validation via `Functional_Data_Type` from lang-mini
- String parsing (e.g., "5" → 5 for numeric types)
- Change events only when values actually differ (uses `more_general_equals`)
- Immutable copies via `.toImmutable()` for state snapshots

### 2. Context and ID Management
Many objects require a `context` (Mini_Context) for ID generation:
```javascript
const dv = new Data_Value({value: 10, context: myContext});
dv._id(); // Gets/generates unique ID via context
```
This pattern is **pervasive** - without context, ID-dependent features fail.

### 3. Field Definition Pattern
Data_Objects use field arrays for property setup:
```javascript
// fields: [[name, type, default_value], ...]
const fields = [['width', 'number', 0], ['height', 'number', 0]];
const obj = new Data_Object({}, fields);
```
However, `obext` fields (from lang-mini) are preferred for newer code.

### 4. The "old" vs "set" Dilemma
Legacy Data_Object uses `.get()` / `.set()` methods with complex polymorphism. **Modern code** should use direct property access:
```javascript
// Old style (still works but verbose)
obj.set('width', 100);
const w = obj.get('width');

// Preferred (ES6 properties)
obj.width = 100;
const w = obj.width;
```

## Development Workflows

### Running Tests
```bash
npm test              # Runs test/test-all.js
node test/test-all.js # Aggregates all test_*.js files using node:test
```
Tests use Node's built-in `node:test` and `node:assert/strict`. See `test/test_data_value.js` for examples.

### Examples Directory
`examples/` contains runnable demonstrations:
- `ex_data_value.js` - Comprehensive Data_Value features (type validation, syncing, mutability)
- `ex_string_data_value.js` - String type specifics
- Run with `node examples/ex_data_value.js`

### Project Structure
- **Root modules** (`lang.js`) export via `lang-mini` augmentation
- **Dependencies**: `lang-mini` (platform), `fnl` (functional library)
- No build process - direct Node.js execution

## Coding Conventions

### Module Pattern
```javascript
// Standard requires
const {Evented_Class, each, tof} = require('lang-mini');

// Class definition
class MyClass extends Evented_Class {
    constructor(spec = {}) {
        super(spec);
        // Setup...
    }
}

module.exports = MyClass;
```

### Event Naming
- `'change'` - primary event for value/property changes
- `'validate'` - fired during validation attempts
- Event objects include: `{name, old, value}` for changes

### Type Checking
Use `tof()` (type of) from lang-mini, NOT `typeof`:
```javascript
const t = tof(value); // Returns: 'string', 'number', 'array', 'data_value', 'data_object', etc.
```

### Signatures
Functions often use `get_a_sig(arguments)` for polymorphic dispatch:
```javascript
const sig = get_a_sig(a, 1); // e.g., '[s]', '[n,n]', '[V,V]'
```

## Important Gotchas

1. **Immutability is deep**: When creating `Immutable_Data_Value`, inner array items also become immutable
2. **Change event suppression**: Setting identical values won't trigger change events (uses `more_general_equals`)
3. **Proxy usage**: `collective.js` uses Proxy for dynamic property access - may have performance implications
4. **Legacy code mixing**: Data_Object still has complex `.get()/.set()` - avoid extending those patterns
5. **Context requirement**: Many classes fail silently or throw errors without proper `context` initialization

## MVC/MVVM Context (from roadmap.md)
This library is evolving toward an MVC framework where:
- **Model** = Data_Model/Data_Object/Data_Value
- **View** = (separate project, jsgui)
- **Controller** = Control objects that use these data models

Understanding this helps explain why Data_Value is so feature-rich - it's designed for UI binding with validation, syncing between view and model representations.

## When Modifying Code

- **Tests first**: Add test cases in `test/test_*.js` before implementing features
- **Examples**: Update relevant examples/ files to demonstrate new features
- **Backward compatibility**: Consider that `old/` implementations are still used - breaking changes need migration
- **Documentation**: Complex features like Data_Value syncing deserve inline examples
- **Type validation**: Use or extend `Functional_Data_Type` from lang-mini for new data types

## Quick Reference: Key Files

| File | Purpose |
|------|---------|
| `lang.js` | Main entry point, augments lang-mini with all exports |
| `Data_Model/new/Data_Value.js` | Core reactive value class |
| `Data_Model/old/Data_Object.js` | Legacy complex object system |
| `collective.js` | Batch operation utility (Proxy-based) |
| `util.js` | Vector math, type conversions, group operations |
| `examples/ex_data_value.js` | Most comprehensive usage examples |
| `test/test_data_value.js` | Test patterns and edge cases |
