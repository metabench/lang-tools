# Migration Checklist for AI Agents

## Overview

This checklist is for AI agents updating codebases that depend on `lang-tools` after the v0.0.41+ migration. The core data model classes (`Collection`, `Data_Value`, `Data_Object`) have moved from legacy method-based APIs to modern property-based APIs.

**Critical Change Summary:**
- `Collection` now uses modern `Data_Value` internally (moved to `Data_Model/new/Collection.js`)
- `Data_Value.value()` method → `Data_Value.value` property
- `Data_Value.set(x)` method → `Data_Value.value = x` assignment
- `clone()` → `toImmutable()` for immutable snapshots

---

## Pre-Migration Assessment

### 1. Identify Affected Code

- [ ] Search for all imports/requires of `lang-tools` or `lang-mini`
- [ ] Search for `Collection` usage patterns
- [ ] Search for `Data_Value` usage patterns
- [ ] Search for `Data_Object` usage patterns
- [ ] Grep for `.value()` calls (method invocations that need updating)
- [ ] Grep for `.set(` calls on Data_Value instances
- [ ] Grep for `.clone()` calls
- [ ] Grep for `.get(` calls on Collections and Data_Objects

```bash
# Recommended search patterns
grep -rn "\.value()" --include="*.js"
grep -rn "\.set(" --include="*.js"
grep -rn "\.clone()" --include="*.js"
grep -rn "new Collection" --include="*.js"
grep -rn "new Data_Value" --include="*.js"
grep -rn "require.*lang-tools" --include="*.js"
```

### 2. Check Current lang-tools Version

- [ ] Verify `package.json` dependency version
- [ ] Run `npm ls lang-tools` to confirm installed version
- [ ] If < 0.0.41, plan upgrade path

---

## Data_Value Migration

### Method-to-Property Access Changes

| Old Pattern | New Pattern | Notes |
|-------------|-------------|-------|
| `dv.value()` | `dv.value` | Most common change |
| `dv.set(x)` | `dv.value = x` | Assignment replaces method |
| `dv.value(newVal)` | `dv.value = newVal` | Old setter pattern |
| `dv.clone()` | `dv.toImmutable()` | Returns frozen copy |

### Checklist

- [ ] **Replace `.value()` with `.value`**
  ```javascript
  // OLD
  const val = dataValue.value();

  // NEW
  const val = dataValue.value;
  ```

- [ ] **Replace `.set(x)` with assignment**
  ```javascript
  // OLD
  dataValue.set(42);

  // NEW
  dataValue.value = 42;
  ```

- [ ] **Replace `.clone()` with `.toImmutable()`**
  ```javascript
  // OLD
  const copy = dataValue.clone();
  copy.set(100); // Worked - mutable clone

  // NEW
  const immutable = dataValue.toImmutable();
  immutable.value = 100; // THROWS TypeError - immutable!

  // If you need a mutable copy:
  const mutableCopy = new Data_Value(dataValue.value);
  ```

- [ ] **Update event handler payloads** (if inspecting event internals)
  - Old: `{value, old}` with raw JS values
  - New: May include `Value_Set_Attempt` metadata

- [ ] **Handle type validation changes**
  - New `Data_Value` supports `data_type` parameter for strict typing
  - Use `attempt_set_value()` for validation-aware setting
  ```javascript
  const result = dv.attempt_set_value('invalid');
  if (!result.success) {
    console.log('Validation failed:', result);
  }
  ```

---

## Collection Migration

### Key Behavioral Changes

| Aspect | Before (Legacy) | After (Modern) |
|--------|-----------------|----------------|
| Internal storage | Old `Data_Value` | New `Data_Value` |
| Item access | `coll.get(0).value()` | `coll.get(0).value` |
| Primitive wrapping | Wrapped in old Data_Value | Wrapped in new Data_Value |
| Objects | Stored directly (not wrapped) | Stored directly (not wrapped) |

### Checklist

- [ ] **Update item value access**
  ```javascript
  // OLD
  const val = collection.get(0).value();

  // NEW
  const val = collection.get(0).value;
  ```

- [ ] **Update iteration patterns**
  ```javascript
  // OLD
  collection.each((item, index) => {
    console.log(item.value()); // Method call
  });

  // NEW
  collection.each((item, index) => {
    // For primitives (wrapped in Data_Value):
    if (item && typeof item.value !== 'undefined') {
      console.log(item.value); // Property access
    } else {
      // Objects are not wrapped
      console.log(item);
    }
  });
  ```

- [ ] **Handle mixed types correctly**
  ```javascript
  // Primitives (string, number, boolean, null, undefined) → wrapped in Data_Value
  // Objects, functions, Data_Value instances → stored directly

  collection.each((item, index) => {
    // Safe access pattern for both wrapped and unwrapped items:
    const val = (item && typeof item.value !== 'undefined')
      ? item.value
      : item;
  });
  ```

- [ ] **Update `.value()` method calls on Collection itself**
  ```javascript
  // Collection.value() returns array of unwrapped values
  // This method-based call is CORRECT and unchanged
  const allValues = collection.value(); // Returns array
  ```

- [ ] **Check `insert()` vs `push()` behavior**
  - `push()` wraps primitives in Data_Value
  - `insert()` does NOT wrap primitives
  ```javascript
  coll.push('text');     // → coll.get(0).value === 'text'
  coll.insert('text', 0); // → coll.get(0) === 'text' (raw)
  ```

- [ ] **Verify event listeners still work**
  ```javascript
  collection.on('change', (event) => {
    // event.name: 'insert', 'remove', 'clear'
    // event.value: the affected item
    // event.position: index (for insert/remove)
  });
  ```

---

## Data_Object Migration

### Key Changes

| Aspect | Before (Legacy) | After (Modern) |
|--------|-----------------|----------------|
| Field access | `.get(key)` returns old Data_Value | Returns new Data_Value |
| Value retrieval | `.get(key).value()` | `.get(key).value` |
| Serialization | `toJSON()` may return JSON string | Returns plain JS object |
| Type strictness | "Store anything" | Prefers explicit `data_type` |

### Checklist

- [ ] **Update field value access**
  ```javascript
  // OLD
  const name = dataObject.get('name').value();

  // NEW
  const name = dataObject.get('name').value;
  ```

- [ ] **Update nested access patterns**
  ```javascript
  // OLD
  const nested = dataObject.get('parent').value().get('child').value();

  // NEW
  const nested = dataObject.get('parent').value.get('child').value;
  ```

- [ ] **Check serialization consumers**
  ```javascript
  // OLD: toJSON() might return a string
  const json = JSON.parse(dataObject.toJSON());

  // NEW: toJSON() returns plain object
  const obj = dataObject.toJSON();
  // Can directly pass to JSON.stringify if needed
  ```

---

## Common Code Patterns to Update

### Pattern 1: Value Extraction Loop

```javascript
// OLD
const values = [];
collection.each((item) => {
  values.push(item.value());
});

// NEW
const values = [];
collection.each((item) => {
  if (item && typeof item.value !== 'undefined') {
    values.push(item.value);
  } else {
    values.push(item);
  }
});

// BETTER: Use built-in method
const values = collection.value();
```

### Pattern 2: Conditional Value Access

```javascript
// OLD
if (dv && dv.value) {
  const val = dv.value();  // Assumed method
}

// NEW
if (dv && typeof dv.value !== 'undefined') {
  const val = dv.value;  // Property access
}
```

### Pattern 3: Data Binding / UI Updates

```javascript
// OLD
dataValue.on('change', (e) => {
  element.textContent = e.value;  // This still works
});

// Value access elsewhere:
// OLD: dataValue.value()
// NEW: dataValue.value
```

### Pattern 4: Cloning for State Management

```javascript
// OLD
const snapshot = dataValue.clone();
// snapshot is mutable

// NEW
const immutableSnapshot = dataValue.toImmutable();
// immutableSnapshot.value = x; // THROWS!

// If you need mutable copy:
const mutableCopy = new Data_Value({
  value: dataValue.value,
  data_type: dataValue.data_type
});
```

### Pattern 5: Collection Index Access with Default

```javascript
// OLD
const item = collection.get(index);
const val = item ? item.value() : defaultValue;

// NEW
const item = collection.get(index);
const val = (item && typeof item.value !== 'undefined')
  ? item.value
  : (item !== undefined ? item : defaultValue);
```

---

## Testing Strategy

### Pre-Migration

- [ ] Run existing test suite to establish baseline
- [ ] Document any existing test failures

### During Migration

- [ ] Update test assertions for new API patterns
- [ ] Add compatibility tests if supporting both patterns temporarily

### Post-Migration

- [ ] Run full test suite
- [ ] Test event handling
- [ ] Test serialization/deserialization
- [ ] Test edge cases (null, undefined, boolean values in Collections)

### Recommended Test Commands

```bash
# List tests first (dry run)
npx jest --listTests

# Run specific test file
npx jest --runInBand --runTestsByPath test/collection.test.js

# Run with coverage
npm run test:coverage
```

---

## Regex-Based Search and Replace

**CAUTION**: These patterns are approximate. Always review changes manually.

### Find `.value()` Method Calls

```regex
Pattern: \.value\(\s*\)
Replace with: .value
```

### Find `.set(x)` on Data_Value

```regex
Pattern: (\w+)\.set\(([^)]+)\)
Review: Check if $1 is a Data_Value, then replace with: $1.value = $2
```

### Find `.clone()` Calls

```regex
Pattern: \.clone\(\s*\)
Replace with: .toImmutable()
```

---

## Breaking Change Warnings

### 1. Immutable Returns

`toImmutable()` returns a frozen object. Code that modified clones will break:

```javascript
// THIS WILL THROW:
const copy = dv.toImmutable();
copy.value = 100; // TypeError: Cannot modify immutable Data_Value
```

### 2. Type Strictness

New `Data_Value` with `data_type` enforces types:

```javascript
const numDv = new Data_Value({value: 10, data_type: Number});
numDv.value = 'not a number'; // May throw or reject
```

### 3. Event Payload Shape

If code inspects event internals beyond `.value` and `.old`:

```javascript
dv.on('change', (e) => {
  // OLD: {value, old}
  // NEW: May include Value_Set_Attempt details
});
```

### 4. Collection Primitive Wrapping

All primitives pushed to Collection are now wrapped in modern Data_Value:

```javascript
coll.push(42);
const item = coll.get(0);
// item.value (property) NOT item.value() (method)
```

---

## Compatibility Shim (Temporary)

If gradual migration is needed, create a shim:

```javascript
// compatibility-shim.js
function getValue(dataValueOrPrimitive) {
  if (dataValueOrPrimitive === null || dataValueOrPrimitive === undefined) {
    return dataValueOrPrimitive;
  }

  // New Data_Value: has .value property
  if (typeof dataValueOrPrimitive.value !== 'undefined' &&
      typeof dataValueOrPrimitive.value !== 'function') {
    return dataValueOrPrimitive.value;
  }

  // Old Data_Value: has .value() method
  if (typeof dataValueOrPrimitive.value === 'function') {
    return dataValueOrPrimitive.value();
  }

  // Raw primitive or object
  return dataValueOrPrimitive;
}

module.exports = { getValue };
```

---

## Post-Migration Verification

- [ ] All tests pass
- [ ] No runtime errors in production
- [ ] Event listeners fire correctly
- [ ] Data binding works (UI updates)
- [ ] Serialization produces expected output
- [ ] No `TypeError: x.value is not a function` errors
- [ ] No `TypeError: Cannot modify immutable` errors (unless expected)
- [ ] Remove compatibility shims if used
- [ ] Update documentation

---

## Quick Reference Card

| Operation | Old API | New API |
|-----------|---------|---------|
| Get value | `dv.value()` | `dv.value` |
| Set value | `dv.set(x)` | `dv.value = x` |
| Clone | `dv.clone()` | `dv.toImmutable()` |
| Collection item | `coll.get(i).value()` | `coll.get(i).value` |
| Data_Object field | `obj.get(k).value()` | `obj.get(k).value` |
| Collection values | `coll.value()` | `coll.value()` (unchanged) |

---

## Version Compatibility Matrix

| lang-tools Version | Data_Value API | Collection Internal | Notes |
|--------------------|----------------|---------------------|-------|
| < 0.0.41 | Method-based | Old Data_Value | Legacy |
| 0.0.41+ | Property-based | New Data_Value | Modern (current) |

---

## Contact and Resources

- [VERSION_DIFFERENCES.md](VERSION_DIFFERENCES.md) - Version overview
- [data-model-differences.md](content/data-model-differences.md) - Detailed migration notes
- [migrate-to-modern-data-model.md](workflows/migrate-to-modern-data-model.md) - Step-by-step workflow
- Test files: `test/collection.test.js`, `test/data_value.test.js`
