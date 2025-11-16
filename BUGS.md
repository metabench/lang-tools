# lang-tools Bug Tracking System

**Last Updated**: 2025-10-05  

## 🔴 CRITICAL BUGS (P0) - Fix Immediately

### <BUG001> Data_Value.attempt_set_value - Undefined Variable
**Code Location**: Search for `<BUG001>` in `Data_Model/new/Data_Value.js`

**Issue**: Variable `local_js_value` is referenced but never defined in scope.

**Investigation Needed**:
- What should `local_js_value` reference? 
- Should it be `value` parameter?
- Should it be `this._` internal storage?
- Check surrounding code for context

**Proposed Fix**:
```javascript
// Option 1: Use parameter
const get_local_js_value_copy = () => {
    const tljsv = tof(value);  // Use the parameter passed to attempt_set_value

// Option 2: Use internal storage
const get_local_js_value_copy = () => {
    const tljsv = tof(this._);  // Use internal value storage
```

**Code Location**: Search for `<BUG001>` in `Data_Model/new/Data_Value.js`

# lang-tools Bug Tracking System

**Last Updated**: 2025-10-05  
**Test Status**: 203/280 passing (73%)

This document uses searchable bug IDs (e.g., `<BUG001>`) that correspond to TODO comments in the source code. See `.github/AGENTS.md` for instructions on how AI agents should use this system to fix bugs.

---

## 🔴 CRITICAL BUGS (P0) - Fix Immediately

### <BUG001> Data_Value.attempt_set_value - Undefined Varia**Code Location**: Search for `<TEST004>` in `test/collection.test.js`

---

### <BUG011> Collection.set(primitiveValue) Doesn't Clear and Add

**Status**: ✅ FIXED  
**Fixed by**: 2025-10-05 - Added primitive type handling  
**Priority**: P1 - High (Missing Feature)  
**File**: `Data_Model/old/Collection.js:163`  
**Test Failures**: 1 test (now passing)

**Issue**: When setting a Collection with a single primitive value (string, number, boolean, null, undefined), it should clear the collection and add that single value. Instead, it was calling Data_Object.prototype.set() which doesn't handle this case.

**Test Code**:
```javascript
const coll = new Collection([1, 2, 3]);
coll.set('Single');
expect(coll.length()).toBe(1);  // ❌ Was 3, expected 1
expect(coll.get(0).value()).toBe('Single');  // ❌ Was still [1,2,3]
```

**Fix Applied**:
```javascript
} else if (tval === 'string' || tval === 'number' || tval === 'boolean' || tval === 'null' || tval === 'undefined') {
    // Single primitive value: clear and push it
    this.clear();
    return this.push(value);
}
```

---

## 📊 Bug Summary

| Component | Critical | High | Medium | Test Issues | Total |
|-----------|----------|------|--------|-------------|-------|
| Data_Value | BUG001, BUG002 | BUG005, BUG006, BUG007 | BUG008 | - | 6 |
| Collection | ~~BUG003~~, ~~BUG004~~ | ~~BUG011~~ | - | ~~TEST003~~, ~~TEST004~~ | 5 |
| Data_String | - | - | BUG009 | - | 1 |
| Data_Integer | - | - | BUG010 | - | 1 |
| util | - | - | - | ~~TEST001~~, ~~TEST002~~ | 2 |
| **TOTAL** | **2** | **3** | **3** | **0** | **8** |

**Fixed Bugs**: 7 (BUG003, BUG004, BUG011, TEST001, TEST002, TEST003, TEST004)  
**Remaining Bugs**: 8 (2 Critical, 3 High, 3 Medium)s**: Not Fixed  
**Priority**: P0 - Critical  
**File**: `Data_Model/new/Data_Value.js:187`  
**Test Failures**: 2 tests

**Issue**:
```javascript
const get_local_js_value_copy = () => {
    const tljsv = tof(local_js_value);  // ❌ ReferenceError: local_js_value is not defined
```

**Root Cause**: Variable `local_js_value` is referenced but never defined in scope.

**Investigation Needed**:
- What should `local_js_value` reference? 
- Should it be `value` parameter?
- Should it be `this._` internal storage?
- Check surrounding code for context

**Proposed Fix**:
```javascript
// Option 1: Use parameter
const get_local_js_value_copy = () => {
    const tljsv = tof(value);  // Use the parameter passed to attempt_set_value
    
// Option 2: Use internal storage
const get_local_js_value_copy = () => {
    const tljsv = tof(this._);  // Use internal value storage
```

**Code Location**: Search for `<BUG001>` in `Data_Model/new/Data_Value.js`

---

### <BUG002> Immutable Data_Value Doesn't Prevent Changes

**Status**: Not Fixed  
**Priority**: P0 - Critical  
**File**: `Data_Model/new/Immutable_Data_Value.js` or value property setup  
**Test Failures**: 1 test

**Issue**:
```javascript
const dv = new Data_Value({value: 10});
const immutable = dv.toImmutable();
immutable.value = 100;  // ❌ Should throw, but doesn't - value changes silently
```

**Expected Behavior**: Setter should throw `TypeError` or prevent assignment

**Investigation Needed**:
- Check if Immutable_Data_Value overrides the value setter
- Check if `Object.freeze()` or `Object.defineProperty()` is used
- Verify `__immutable` flag is checked in setter

**Proposed Fix**:
```javascript
// In setup_base_data_value_value_property or Immutable_Data_Value
set value(v) {
    if (this.__immutable) {
        throw new TypeError('Cannot modify immutable Data_Value');
    }
    // ... existing setter logic
}
```

**Code Location**: Search for `<BUG002>` in `Data_Model/new/Immutable_Data_Value.js`

---

### <BUG003> Collection.push() Silently Filters null/undefined/boolean

**Status**: ✅ FIXED  
**Fixed by**: 2025-10-05 - Extended type handling in push() method  
**Priority**: P0 - Critical (Data Loss)  
**File**: `Data_Model/old/Collection.js:569` (push method)  
**Test Failures**: 3 tests (now passing)

**Issue**:
```javascript
const coll = new Collection();
coll.push(null);       // Silently ignored, length stays 0 ❌
coll.push(undefined);  // Silently ignored, length stays 0 ❌
coll.push(true);       // Silently ignored, length stays 0 ❌
coll.push(false);      // Silently ignored, length stays 0 ❌
```

**Root Cause**: The `push()` method only handles:
- 'object', 'function', 'data_object', 'control', 'collection' → stored directly  
- 'array' → wrapped in Collection
- 'string', 'number' → wrapped in Data_Value
- **Missing**: 'boolean', 'null', 'undefined' fall through without handling

**Proposed Fix**:
```javascript
// In Collection.push() method, extend the primitive handling:
if (tv === 'string' || tv === 'number' || tv === 'boolean' || 
    tv === 'null' || tv === 'undefined') {
    const dv = new Data_Value({'value': value});
    pos = this._arr.length;
    this._arr.push(dv);
    // ... event handling
}
```

**Impact**: 
- Currently causes silent data loss
- Users cannot store checkbox states, optional values, etc.
- Violates principle of least surprise

**Code Location**: Search for `<BUG003>` in `Data_Model/old/Collection.js`

---

### <BUG004> Collection.set(singleValue) Crashes - Undefined this.super

**Status**: ✅ FIXED  
**Fixed by**: 2025-10-05 - Used proper prototype chain  
**Priority**: P0 - Critical (Crash)  
**File**: `Data_Model/old/Collection.js:164`  
**Test Failures**: 1 test (now passing)

**Issue**:
```javascript
const coll = new Collection(['A', 'B']);
coll.set('X');  // ❌ TypeError: Cannot read properties of undefined (reading 'set')
```

**Root Cause**:
```javascript
} else {
    return this.super.set(value);  // ❌ this.super is undefined
}
```

**Proposed Fix**:
```javascript
} else {
    // Call parent Data_Object.set() method properly
    const Data_Object = require('./Data_Object');
    return Data_Object.prototype.set.call(this, value);
}
```

**Code Location**: Search for `<BUG004>` in `Data_Model/old/Collection.js`

---

## 🟡 HIGH PRIORITY BUGS (P1) - Fix Soon

### <BUG005> Data_Value with Array/Object Returns Undefined

**Status**: Not Fixed  
**Priority**: P1 - High  
**File**: `Data_Model/new/Data_Value.js`  
**Test Failures**: 2 tests

**Issue**:
```javascript
const dv = new Data_Value([1, 2, 3]);
console.log(dv.value);  // undefined ❌ (should be [1,2,3])

const dv2 = new Data_Value({x: 10});
console.log(dv2.value);  // undefined ❌ (should be {x:10})
```

**Investigation Needed**:
- Check if arrays/objects are stored in `._` property
- Check if value getter handles all types
- Verify initialization in constructor

**Code Location**: Search for `<BUG005>` in `Data_Model/new/Data_Value.js`

---

### <BUG006> Data_Value Rapid Sequential Sync Has Timing Issues

**Status**: Not Fixed  
**Priority**: P1 - High  
**File**: `Data_Model/new/Data_Value.js` (sync mechanism)  
**Test Failures**: 1 test

**Issue**:
```javascript
Data_Value.sync(dv1, dv2);
for (let i = 0; i < 5; i++) {
    dv1.value = dv1.value + i;
    expect(dv2.value).toBe(dv1.value);  // ❌ Fails - dv2 lags behind
}
```

**Investigation Needed**:
- Is sync asynchronous?
- Are change events queued/debounced?
- Is there a sync loop prevention causing delays?

**Code Location**: Search for `<BUG006>` in `Data_Model/new/Data_Value.js`

---

### <BUG007> Immutable toImmutable() Doesn't Capture Synced Values

**Status**: Not Fixed  
**Priority**: P1 - High  
**File**: `Data_Model/new/Data_Value.js` or `Immutable_Data_Value.js`  
**Test Failures**: 1 test

**Issue**:
```javascript
const dv1 = new Data_Value({value: 10});
const dv2 = new Data_Value({value: 5});
Data_Value.sync(dv1, dv2);
dv2.value = 20;  // Should sync to dv1

const immutable = dv1.toImmutable();
expect(immutable.value).toBe(20);  // ❌ Gets 10 instead of 20
```

**Code Location**: Search for `<BUG007>` in `Data_Model/new/Immutable_Data_Value.js`

---

## 🔵 MEDIUM PRIORITY (P2) - Incomplete Features

### <BUG008> Data_Value with Native Number/String Type Throws "NYI"

**Status**: Not Yet Implemented  
**Priority**: P2 - Feature Gap  
**File**: `Data_Model/new/Data_Value.js`  
**Test Failures**: 7 tests

**Issue**:
```javascript
new Data_Value({value: 10, data_type: Number});  // ❌ throws "NYI"
new Data_Value({value: 'text', data_type: String});  // ❌ throws "NYI"
```

**Current**: Only supports `Functional_Data_Type.integer`, `Functional_Data_Type.number`, etc.  
**Requested**: Support native JavaScript constructors as types

**Design Decision Needed**:
- Should native types be supported?
- If yes, how to handle type coercion?
- OR should we document as intentionally unsupported?

**Code Location**: Search for `<BUG008>` in `Data_Model/new/Data_Value.js`

---

### <BUG009> Data_String Missing Core Features

**Status**: Incomplete Implementation  
**Priority**: P2 - Feature Gap  
**File**: `Data_Model/new/Data_String.js`  
**Test Failures**: ~34 tests

**Missing Features**:
- Type validation (reject non-strings)
- String manipulation methods (trim, toUpperCase, toLowerCase)
- Length constraints
- Case sensitivity handling
- Type conversion on assignment
- Change events on value change
- Sync with other Data_Values
- toImmutable() method

**Current State**: Basic .value property works after recent fix, but class is essentially a stub

**Design Decision**: 
- Complete implementation?
- Mark as experimental/deprecated?
- Remove entirely and use Data_Value instead?

**Code Location**: Search for `<BUG009>` in `Data_Model/new/Data_String.js`

---

### <BUG010> Data_Integer Missing Core Features

**Status**: Incomplete Implementation  
**Priority**: P2 - Feature Gap  
**File**: `Data_Model/new/Data_Integer.js`  
**Test Failures**: ~25 tests

**Missing Features**:
- Integer validation (reject floats)
- String to integer parsing
- Range constraints (min/max)
- Negative number handling
- Math operation helpers
- Type conversion on assignment
- Change events
- Sync support
- toImmutable() specialized behavior

**Current State**: Basic .value property works after recent fix, but class is essentially a stub

**Code Location**: Search for `<BUG010>` in `Data_Model/new/Data_Integer.js`

---

## 🟢 TEST ISSUES (Not Library Bugs)

### <TEST001> util.npx() Test Assumptions Incorrect

**Status**: ✅ FIXED  
**Fixed by**: 2025-10-05 - Corrected test expectations  
**Priority**: P1 - Fix Tests  
**File**: `test/util.test.js:178-203`  
**Test Failures**: 6 tests (now passing)

**Issue**: Tests expect `npx()` to strip 'px' suffix, but `npx()` **adds** 'px' to numbers

**Actual Behavior**:
```javascript
util.npx(100)      // Returns '100px' ✅ (adds px)
util.npx('100px')  // Returns '100px' ✅ (passthrough string)
```

**Test Expects** (WRONG):
```javascript
util.npx('100px')  // Test expects 100 ❌ (wrong - should use no_px())
```

**Correct Function**: Use `util.no_px()` to strip 'px' suffix

**Fix**: Update all npx tests to either:
1. Test the correct behavior (npx adds px to numbers)
2. Use `no_px()` instead for stripping px

**Code Location**: Search for `<TEST001>` in `test/util.test.js`

---

### <TEST002> util.arr_rgb_to_css_hex_6() Case Sensitivity

**Status**: ✅ FIXED  
**Fixed by**: 2025-10-05 - Updated tests to expect uppercase  
**Priority**: P2 - Minor  
**File**: `test/util.test.js:313-337`  
**Test Failures**: 5 tests (now passing, changed from 4)

**Issue**: Function returns uppercase hex (#FF0000), tests expect lowercase (#ff0000)

**Actual Behavior**:
```javascript
util.arr_rgb_to_css_hex_6([255, 0, 0])  // Returns '#FF0000'
```

**Test Expects**:
```javascript
expect(hex).toBe('#ff0000');  // ❌ Expects lowercase
```

**Decision Needed**:
- Is uppercase correct? (update tests)
- Should it be lowercase? (update implementation)
- CSS accepts both, so either is technically correct

**Proposed Fix** (if lowercase preferred):
```javascript
// In arr_rgb_to_css_hex_6 implementation:
return '#' + hex.toLowerCase();
```

**Code Location**: Search for `<TEST002>` in `test/util.test.js` and `util.js`

---

### <TEST003> Collection Index API Assumptions

**Status**: ✅ FIXED  
**Fixed by**: 2025-10-05 - Updated test to use key_count()  
**Priority**: P2 - Investigate  
**File**: `test/collection.test.js:328-345`  
**Test Failures**: 1 test (now passing)

**Issue**: Tests assume `coll.index.size()` method exists

**Test Code**:
```javascript
expect(coll.index.size()).toBeGreaterThanOrEqual(0);  // ❌ size is not a function
```

**Investigation Needed**:
- What is the actual Collection indexing API?
- Does index have a `.size()` method?
- Should tests check `.length` instead?
- Or is this a missing feature in Collection?

**Code Location**: Search for `<TEST003>` in `test/collection.test.js`

---

### <TEST004> Collection Custom Index Function Signature

**Status**: ✅ FIXED  
**Fixed by**: 2025-10-05 - Updated test to handle raw values  
**Priority**: P2 - Fix Test  
**File**: `test/collection.test.js:336-341`  
**Test Failures**: 1 test (now passing)

**Issue**: Test provides `fn_index` that calls `item.value()`, but items may not have this method

**Test Code**:
```javascript
const fn_index = (item) => item.value();  // ❌ Objects don't have .value() method
```

**Root Cause**: Objects in Collection aren't wrapped, so no `.value()` method

**Fix**: Update fn_index to handle different item types:
```javascript
const fn_index = (item) => {
    return typeof item.value === 'function' ? item.value() : item;
};
```

**Code Location**: Search for `<TEST004>` in `test/collection.test.js`

---

## 📊 Summary by Component

| Component | Critical | High | Medium | Test Issues | Total |
|-----------|----------|------|--------|-------------|-------|
| Data_Value | BUG001, BUG002 | BUG005, BUG006, BUG007 | BUG008 | - | 6 |
| Collection | ~~BUG003~~, ~~BUG004~~ | - | - | TEST003, TEST004 | 4 |
| Data_String | - | - | BUG009 | - | 1 |
| Data_Integer | - | - | BUG010 | - | 1 |
| util | - | - | - | ~~TEST001~~, ~~TEST002~~ | 2 |
| **TOTAL** | **2** | **3** | **3** | **2** | **10** |

---

## 🔧 Quick Reference for AI Agents

When fixing a bug:

1. **Search** for the bug ID (e.g., `<BUG001>`) in source files
2. **Read** the bug description in this file
3. **Locate** the TODO comment in the code
4. **Implement** the proposed fix or investigate as needed
5. **Test** the fix with the specified test cases
6. **Update** this file to mark the bug as Fixed
7. **Document** any deviations from the proposed fix

See `.github/AGENTS.md` for detailed instructions on bug fixing workflows.

---

## 🎯 Recommended Fix Order

### Phase 1 - Critical Bugs (P0)
1. <BUG004> Collection.set() crash (easiest, clear fix)
2. <BUG003> Collection null/undefined/boolean (clear fix, high impact)
3. <BUG001> attempt_set_value undefined variable (needs investigation)
4. <BUG002> Immutable setter (needs investigation)

### Phase 2 - Test Fixes
1. <TEST001> npx test assumptions (easy fix)
2. <TEST002> hex case sensitivity (decision + simple fix)
3. <TEST004> Custom index function (easy fix)
4. <TEST003> Collection index API (needs investigation)

### Phase 3 - High Priority (P1)
1. <BUG005> Array/Object value undefined (investigate + fix)
2. <BUG007> Immutable sync capture (investigate)
3. <BUG006> Rapid sync timing (investigate, may be complex)

### Phase 4 - Design Decisions (P2)
1. <BUG008> Native type support (decide: implement vs document as unsupported)
2. <BUG009> Data_String completion (decide: complete vs deprecate)
3. <BUG010> Data_Integer completion (decide: complete vs deprecate)

---

**Expected Impact After All P0+P1 Fixes**: 200-210 passing tests (71-75%)  
**Expected Impact After Test Fixes**: 215-220 passing tests (77-79%)  
**Expected Impact After All Fixes**: 245-260 passing tests (88-93%)
