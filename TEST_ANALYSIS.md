# lang-tools Test Analysis and Bug Report

**Generated after comprehensive Jest migration and initial bug fixes**

## Executive Summary

**Total Tests**: 280  
**Current Status**: 162 passing / 118 failing (58% pass rate)  
**Core Library Status**: ✅ Production Ready (collective, core util functions)  
**Data Model Status**: ⚠️ Mixed (Data_Value mostly working, Collection needs test fixes, Data_String/Integer incomplete)

---

## Critical Findings

### 1. TEST MISUNDERSTANDING - Collection API (HIGH PRIORITY)

**Issue**: Tests use `collection.get(0).value` but Collection uses **old** Data_Value where `.value()` is a METHOD, not a property.

**Evidence**:
```javascript
const Collection = require('./Data_Model/old/Collection');
const c = new Collection(['a', 'b', 'c']);
const item = c.get(0);

// item.value is a FUNCTION
console.log(item.value);        // [Function: value]

// To get actual value, use:
console.log(item.value());      // 'a' ✅
console.log(item._);            // 'a' ✅ (internal storage)
```

**Impact**: ~26 Collection test failures are **TEST BUGS**, not library bugs!

**Required Action**: Fix all Collection tests to use:
- `coll.get(0).value()` instead of `coll.get(0).value`
- OR `coll.get(0)._` for direct access

**Files to Fix**:
- `test/collection.test.js` - Lines 49, 56, 64, 72, 79, 80, 81, 86, 87, 88, 134-137, 166, 172, 173, 179, 185-187, 195-196, 205-206, 213, 220-221, 259, 305, 312-313, 426-427

---

### 2. REAL LIBRARY BUGS FOUND

#### Bug A: Data_Value.attempt_set_value - Undefined Variable (CRITICAL)
**File**: `Data_Model/new/Data_Value.js`  
**Line**: 187  
**Issue**: `local_js_value` is not defined in `get_local_js_value_copy()`

```javascript
const get_local_js_value_copy = () => {
    const tljsv = tof(local_js_value);  // ❌ ReferenceError: local_js_value is not defined
```

**Test Failures**:
- "Data_Value - attempt_set_value Method › should validate before setting value"
- "Data_Value - attempt_set_value Method › should return Value_Set_Attempt result object"

**Status**: Clearly broken, needs investigation into what `local_js_value` should reference.

---

#### Bug B: Immutable Data_Value doesn't prevent changes (HIGH PRIORITY)
**File**: `Data_Model/new/Immutable_Data_Value.js` or value property setup  
**Issue**: Setting `.value` on immutable doesn't throw error

```javascript
const dv = new Data_Value({value: 10});
const immutable = dv.toImmutable();
immutable.value = 100;  // ❌ Should throw, but doesn't
```

**Expected**: Setter should throw TypeError or prevent assignment  
**Actual**: Value changes silently

---

#### Bug C: util.npx() doesn't parse px values (LOW PRIORITY - Feature Incomplete?)
**File**: `util.js` - `npx` function  
**Test Failures**:
```javascript
expect(util.npx('10px')).toBe(10);      // ❌ Returns '10px'
expect(util.npx('0px')).toBe(0);        // ❌ Returns '0px'  
expect(util.npx('12.5px')).toBe(12.5);  // ❌ Returns '12.5px'
```

**Question**: Is `npx` meant to strip 'px' suffix? Or is test assumption wrong?

---

#### Bug D: util.filter_map_by_regex() - Arguments Reversed
**File**: `util.js` line 150  
**Issue**: Calling `i.match(regex)` but `i` might not be a string (could be number/index)

```javascript
each(map, function(i, v) {  // i = key, v = value in each()
    if (i.match(regex)) {   // ❌ TypeError: i.match is not a function
```

**Root Cause**: `each` from lang-mini calls callback with `(index, value)` not `(key, value)` for objects.

---

#### Bug E: util.execute_on_each_simple() wrong argument order
**File**: `util.js` line 139-140  
**Issue**: Similar to Bug D - callback receives wrong arguments

```javascript
// Test expects: [1,2,3].map(x => x*2) = [2,4,6]
// Actual: [0,2,4] - using index not value!

util.execute_on_each_simple([1, 2, 3], (x) => x * 2);
// Returns [0, 2, 4] instead of [2, 4, 6]
```

---

#### Bug F: util.arr_rgb_to_css_hex_6() case mismatch
**File**: `util.js`  
**Issue**: Returns uppercase hex `#FF0000` but tests expect lowercase `#ff0000`

**Question**: Is this a bug or test assumption error?

---

### 3. INCOMPLETE FEATURES (Not Bugs)

#### Data_Value with Native Types (Number, String)
**Status**: Throws "NYI" (Not Yet Implemented)

```javascript
new Data_Value({value: 10, data_type: Number});  // ❌ throws "NYI"
```

**Test Failures**: 5 tests fail with "thrown: NYI"  
**Action Required**: Either implement or document as unsupported

---

#### Data_String & Data_Integer Incomplete Features
**Status**: Basic .value property now works (after fix), but missing:
- Type conversion for assignment
- Validation on set
- Change events
- Sync method
- toImmutable method

**Tests Affected**: ~59 tests fail due to missing features

---

### 4. EDGE CASE BUGS

#### Data_Value with null spec
**Test**: `new Data_Value(null);`  
**Error**: `TypeError: Cannot read properties of null (reading 'context')`  
**File**: `Data_Model/Data_Model.js` line 31

**Fix**: Add null check:
```javascript
if (spec && spec.context) {
    this.context = spec.context;
}
```

---

#### Collection doesn't accept null/undefined/boolean
**Tests**: 3 failing tests

```javascript
coll.push(null);       // Length stays 0
coll.push(undefined);  // Length stays 0  
coll.push(true);       // Length stays 0
```

**Question**: Is this intentional filtering or a bug?

---

#### Rapid Sequential Syncing timing issue
**Test**: Loop updating synced Data_Values  
**Expected**: `dv2.value === dv1.value` after each iteration  
**Actual**: Values lag behind (sync not immediate?)

---

## Test-by-Test Breakdown

### collective.js - 33/33 Passing ✅
**Status**: Production ready, no issues found

---

### util.js - ~54/66 Tests (82%)

**Passing**: Vector math (v_add, v_subtract, vector_magnitude), type checking, color conversions (mostly)

**Failing**:
- 3x npx tests (doesn't strip 'px')
- 4x filter_map_by_regex tests (i.match not a function)
- 4x execute_on_each_simple tests (wrong argument order)
- 5x arr_rgb_to_css_hex_6 tests (case mismatch)

---

### Collection - ~29/55 Tests (53% but really ~95%)

**Actual Status**: Collection works fine, tests have API misunderstanding

**Passing**: Creation, length, clear, iteration (when not checking `.value`)

**Failing (Test Bugs)**:
- All tests checking `.value` instead of `.value()` or `._`
- Tests for push/get/insert/remove/set checking value property

**Failing (Real Bugs)**:
- `coll.set(single_value)` throws TypeError (tries to access undefined `.super`)
- `coll.index.size()` not a function (index may not have .size method)
- null/undefined/boolean not accepted in push

---

### Data_Value - ~27/47 Tests (57%)

**Passing**:
- Creation with simple values (except null)
- Functional_Data_Type typed values (integer, string)
- Basic syncing between typed values
- Change events
- toImmutable() creation (but not enforcement)

**Failing**:
- Native type support (Number, String) - throws "NYI"
- Array/object value access (returns undefined)
- Null spec handling
- attempt_set_value (undefined variable bug)
- Immutable enforcement (doesn't prevent changes)
- Rapid sequential sync (timing issue)
- toImmutable with synced value capture

---

### Data_String - ~10/44 Tests (23%)

**Fixed**: ✅ .value property now works (added setup_base_data_value_value_property)

**Still Failing**:
- String-specific validation
- String manipulation methods
- Type conversion on assignment
- Case sensitivity handling
- Trim/length operations
- toUpperCase/toLowerCase integration
- All NYI features

---

### Data_Integer - ~9/34 Tests (26%)

**Fixed**: ✅ .value property now works (added setup_base_data_value_value_property)

**Still Failing**:
- Integer-specific validation (rejects floats)
- Range constraints
- String to int parsing
- Negative number handling
- Math operations
- toImmutable specialized behavior
- All NYI features

---

## Priority Matrix

### P0 - Fix Immediately (Clear Bugs with Clear Fixes)

1. **Collection Tests** - Fix `.value` → `.value()` in all tests (NOT a library bug)
2. **util.filter_map_by_regex** - Fix argument order in `each` callback
3. **util.execute_on_each_simple** - Fix argument order in callback
4. **Data_Value null spec** - Add null check in Data_Model constructor

### P1 - Fix Soon (Clear Bugs, Needs Investigation)

1. **Data_Value.attempt_set_value** - Fix undefined `local_js_value` variable
2. **Immutable Data_Value** - Make setter throw on immutable values
3. **Collection.set(single_value)** - Fix undefined `.super` reference

### P2 - Design Decision Required

1. **util.npx()** - Clarify if should strip 'px' suffix
2. **util.arr_rgb_to_css_hex_6** - Lowercase vs uppercase hex
3. **Native type support** - Implement Number/String or document as unsupported
4. **Collection null/undefined/boolean** - Accept these values or document filtering
5. **Data_String/Data_Integer** - Complete implementation or mark experimental

### P3 - Enhancement/Feature Requests

1. Rapid sequential sync timing improvements
2. toImmutable sync value capture
3. Three-way sync with type conversion edge cases

---

## Recommended Next Steps

### For Test Suite (High Priority)
1. Fix all Collection tests to use correct `.value()` API ← **Will improve pass rate by ~26 tests**
2. Fix/remove util tests if functions are NYI (npx, case sensitivity)
3. Add null checks where needed
4. Mark "NYI" tests as `.skip()` until features implemented

### For Library (Only Fix Obvious Bugs)
1. ✅ DONE: Data_Integer .value property
2. ✅ DONE: Data_String .value property  
3. Fix: Data_Value null spec handling (add null check)
4. Fix: util.filter_map_by_regex argument order
5. Fix: util.execute_on_each_simple argument order
6. Fix: Data_Value.attempt_set_value undefined variable
7. Investigate: Immutable setter enforcement

### For Documentation
1. Document old vs new Data_Value API differences (`.value()` vs `.value`)
2. Mark Data_String/Data_Integer as experimental if incomplete
3. Clarify native type support status (NYI or won't implement)
4. Add Collection API examples to README

---

## Updated Test Expectations

**After Fixing Collection Tests**: Expected ~188/280 passing (67%)  
**After Fixing util bugs**: Expected ~200/280 passing (71%)  
**After Fixing P0 bugs**: Expected ~205/280 passing (73%)  
**With P1 fixes**: Expected ~215/280 passing (77%)  
**With Data_String/Integer completion**: Would reach ~260/280 passing (93%)

**Realistic Near-Term Goal**: 200-215 passing (71-77%) by fixing test bugs and obvious library bugs

---

## Conclusion

**Core library is solid**: collective (100%), most util functions work (82%), Collection works but tests need fixing.

**Main issues**:
1. **Test bugs** (Collection API misunderstanding) - High impact, easy fix
2. **Real util bugs** (argument order) - Medium impact, easy fix
3. **Incomplete features** (Data_String/Integer, native types) - Low priority, need design decisions
4. **Edge cases** (null handling, immutability) - Medium priority, need investigation

**Next Action**: Fix Collection tests first (biggest impact), then fix obvious util bugs, then decide on incomplete features.
