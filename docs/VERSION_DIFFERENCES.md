# Old vs New Infrastructure Versions

This document provides an overview of the data model versions in lang-tools.

## Overview

**Migration Status: COMPLETE** - All core components now use the modern (new/) implementations.

| Component | Location | Status |
|-----------|----------|--------|
| Data_Value | `Data_Model/new/Data_Value.js` | **Modern** |
| Data_Object | `Data_Model/new/Data_Object.js` | **Modern** |
| Collection | `Data_Model/new/Collection.js` | **Modern** |

Legacy implementations (`Data_Model/old/Data_Value.js`, `Data_Model/old/Data_Object.js`) are retained for comparison tests only.

## Key Differences

### Data_Value

The most significant change is the shift from method-based to property-based API:

| Operation | Old API | New API |
|-----------|---------|---------|
| Get value | `dv.value()` | `dv.value` |
| Set value | `dv.set(x)` or `dv.value(x)` | `dv.value = x` |
| Clone | `dv.clone()` | `dv.toImmutable()` |

**Old Implementation Characteristics:**
- Method-based access: `dv.value()` returns the underlying value
- Internal `_value` slot with `.set()` and `.get()` methods
- Ad hoc input processors per invocation
- `clone()` returns mutable copy

**New Implementation Characteristics:**
- Property-based access: `dv.value` getter/setter
- ES6 property descriptors via `setup_base_data_value_value_property`
- Type system with `data_type` parameter (String, Number, Integer)
- Validation framework (`Validation_Success`, `Validation_Failure`)
- `Value_Set_Attempt` tracking for state changes
- `toImmutable()` returns frozen `Immutable_Data_Value`

### Data_Object

| Dimension | Old | New |
|-----------|-----|-----|
| Field access | `.get(key)` returns old Data_Value | Returns new Data_Value with `.value` property |
| Value wrapping | Auto-wraps primitives in old Data_Value | Uses new Data_Value with property access |
| Serialization | `toJSON()` may return JSON string | Returns plain JS object |
| Type metadata | Store anything | Stricter, prefers explicit `data_type` |

### Collection

Currently only exists in the old implementation. Uses old Data_Value internally. A compatibility test exists at `test/collection_new_data_value_compat.test.js` for future migration.

## New-Only Features

### Typed Data Values

New implementations include specialized typed classes:
- `Data_Integer.js` - Integer values with validation
- `Data_Number.js` - Numeric values
- `Data_String.js` - String values

### Immutable Variants

New infrastructure supports immutability:
- `Immutable_Data_Value.js`
- `Immutable_Data_Integer.js`
- `Immutable_Data_Number.js`
- `Immutable_Base_Data_Value.js`

These throw `TypeError('Cannot modify immutable Data_Value')` on modification attempts.

### Validation System

New files supporting validation:
- `Validation_Success.js` / `Validation_Failure.js`
- `Value_Set_Attempt.js` / `Value_Set_Attempt_Success.js` / `Value_Set_Attempt_Failure.js`
- `setup_data_value_data_type_set.js` - Core type validation

## Current State (v0.0.42+)

From `lang.js` exports:
```javascript
Collection = require('./Data_Model/new/Collection');      // NEW (migrated)
Data_Object = require('./Data_Model/new/Data_Object');    // NEW
Data_Value = require('./Data_Model/new/Data_Value');      // NEW
Immutable_Data_Value = require('./Data_Model/new/Immutable_Data_Value'); // NEW
```

Proxy modules in `Data_Model/` root re-export from new/:
- `Data_Model/Data_Value.js` -> `./new/Data_Value`
- `Data_Model/Data_Object.js` -> `./new/Data_Object`
- `Data_Model/Collection.js` -> `./new/Collection`

## Migration Examples

### Value Access
```javascript
// Old
const val = dv.value();

// New
const val = dv.value;
```

### Value Assignment
```javascript
// Old
dv.set(newValue);
// or
dv.value(newValue);

// New
dv.value = newValue;
```

### Collection Item Access
```javascript
// Old (still current)
coll.get(0).value()

// After migration
coll.get(0).value
```

## Test Coverage

| Test File | Purpose |
|-----------|---------|
| `test/data_model_comparison.test.js` | Compares old vs new behavior |
| `test/collection_new_data_value_compat.test.js` | Collection + new Data_Value compatibility |
| `test/old_data_value.test.js` | Legacy API tests (skipped unless `RUN_LEGACY_TESTS=1`) |
| `test/old_data_object.test.js` | Old Data_Object tests |
| `test/new_data_object.test.js` | New Data_Object tests |
| `test/data_value.test.js` | Modern Data_Value tests |

## Related Documentation

- [Detailed migration notes](content/data-model-differences.md)
- [Migration workflow](workflows/migrate-to-modern-data-model.md)
