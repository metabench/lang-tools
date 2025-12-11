# Data Architecture

## Core Entities

### Data_Value (New)
- **Purpose**: Reactive container for a single typed value.
- **Fields**:
  - `value`: The primitive value (getter/setter).
  - `data_type`: `Functional_Data_Type` definition.
- **Key Behaviors**:
  - Emits `change` events.
  - Supports `toImmutable()` snapshots.
  - Validates assignments via `attempt_set_value`.

### Collection (Old/Hybrid)
- **Purpose**: Reactive list of items.
- **Fields**:
  - `_arr`: Internal array of `Data_Value` wrappers.
  - `_index`: `Sorted_KVS` for fast lookups.
- **Key Behaviors**:
  - `push`, `remove`, `insert` trigger events.
  - `each` iterates over wrappers.

### Data_Object (Old/Hybrid)
- **Purpose**: Reactive key-value map.
- **Fields**:
  - Internal map of field names to `Data_Value` instances.
- **Key Behaviors**:
  - `set(key, value)` / `get(key)`.
  - Propagates change events from children.

## Relationships
- `Collection` extends `Data_Object`.
- `Data_Object` contains `Data_Value`s.
- All classes inherit from `Evented_Class` (via `lang-mini`).

## Schema Example
```javascript
const user = new Data_Object();
user.set('name', new Data_String('Alice'));
user.set('score', new Data_Integer(100));
user.set('tags', new Collection(['admin', 'beta']));
```
