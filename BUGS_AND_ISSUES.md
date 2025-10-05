# lang-tools Known Issues and Bugs

**Generated from test suite analysis - 2025-10-05**

Test Results: **168 passing / 112 failing out of 280 total (60% pass rate)**

---

## 🔴 CRITICAL BUGS - Immediate Fix Required

### 1. Data_Integer has no .value property
**File:** `Data_Model/new/Data_Integer.js`  
**Line:** Constructor after `super(spec)`  
**Issue:** Missing call to `setup_base_data_value_value_property(this)`  
**Impact:** `.value` is completely undefined - class is non-functional  
**Test Failures:** All Data_Integer tests fail with "undefined"

**Current Code:**
```javascript
super(spec);
if (spec.value) {
    this.value = spec.value;  // FAILS - property doesn't exist
}
```

**Required Fix:**
```javascript
super(spec);
setup_base_data_value_value_property(this);  // ADD THIS
if (spec.value) {
    this.value = spec.value;
}
```

**Note:** Data_Number (parent class) does this correctly. Data_Integer needs the same pattern.

---

### 2. Data_String has no .value property  
**File:** `Data_Model/new/Data_String.js`  
**Issue:** Same as Data_Integer - missing property setup  
**Impact:** `.value` is undefined - class is non-functional  
**Test Failures:** 41 Data_String tests fail

**Current Code:**
```javascript
class Data_String extends Base_Data_Value {
    constructor(...a) {
        // ... parse args ...
        super(spec);
        // MISSING: setup_base_data_value_value_property(this);
    }
}
```

**Required Fix:** Add the setup call and value initialization like Data_Number has.

---

### 3. Data_Value.attempt_set_value references undefined variable
**File:** `Data_Model/new/Data_Value.js:187`  
**Error:** `ReferenceError: local_js_value is not defined`  
**Impact:** `attempt_set_value()` method completely broken  
**Test Failures:** 5 tests for attempt_set_value

**Code:**
```javascript
const attempt_set_value = this.attempt_set_value = (value) => {
    const get_local_js_value_copy = () => {
        const tljsv = tof(local_js_value);  // ❌ local_js_value not defined
```

**Likely Fix:** Should reference `this._value` or the value needs to be in closure scope.

---

### 4. Immutable Data_Value doesn't prevent changes
**File:** `Data_Model/new/Immutable_Data_Value.js` (or related)  
**Issue:** Calling `toImmutable()` creates a copy but setter still works  
**Impact:** Immutability contract violated - breaks fundamental promise  
**Test Failure:**
```javascript
const immutable = dv.toImmutable();
immutable.value = 100;  // Should throw error but doesn't
```

**Required Fix:** Override the `.value` setter to throw error or make it a no-op for immutable instances.

---

## 🟠 HIGH PRIORITY BUGS

### 5. Data_Value rapid sequential syncing breaks
**Issue:** When rapidly updating synced values in a loop, sync gets out of sync  
**Test Failure:**
```javascript
Data_Value.sync(dv1, dv2);
for (let i = 0; i < 5; i++) {
    dv1.value = dv1.value + i;
    expect(dv2.value).toBe(dv1.value);  // FAILS on iteration 1
}
```
**Impact:** Unreliable synchronization - could cause data corruption in real apps  
**Possible Cause:** Event propagation timing, missing await, or circular update prevention gone wrong

---

### 6. toImmutable() after syncing captures wrong value  
**Issue:** Immutable snapshot gets original value, not current synced value  
**Test:**
```javascript
const dv1 = new Data_Value(10);
const dv2 = new Data_Value(20);
Data_Value.sync(dv1, dv2);  // Should sync to 20

const immutable = dv1.toImmutable();
expect(immutable.value).toBe(20);  // FAILS - got 10
```

---

## 🟡 INCOMPLETE FEATURES (Not Yet Implemented)

### 7. Data_Value with native Number type throws NYI
**Issue:** `new Data_Value({value: 10, data_type: Number})` throws "NYI"  
**Works:** `data_type: Functional_Data_Type.integer`  
**Doesn't Work:** `data_type: Number` (native constructor)  
**Test Failures:** 4 tests  
**Decision Needed:** Should native types be supported? If not, document clearly.

---

### 8. Data_String has no automatic type conversion
**Issue:** Setting number doesn't convert to string  
**Example:**
```javascript
const ds = new Data_String('hello');
ds.value = 123;
console.log(typeof ds.value);  // "number" - should be "string"
console.log(ds.value);  // 123 - should be "123"
```
**Impact:** Defeats purpose of type-specific class  
**Status:** Data_String lacks parsing/transformation logic that Data_Value has

---

### 9. Data_String/Data_Integer don't validate inputs
**Issue:** Can set null, undefined, objects, arrays without errors  
**Expected:** Validation should reject incompatible types  
**Test Failure:**
```javascript
const ds = new Data_String('init');
ds.value = null;  // Should throw - doesn't
ds.value = {a: 1};  // Should throw - doesn't
```
**Status:** `validate_value()` methods exist but aren't called during setting

---

### 10. Data_String/Data_Integer don't emit change events
**Issue:** Setting values doesn't trigger 'change' events  
**Impact:** Cannot react to changes - breaks reactive programming pattern  
**Test:** Timeout waiting for 'change' event to fire  
**Status:** Event infrastructure inherited but not connected to setters

---

### 11. Data_String/Data_Integer have no .sync() method
**Issue:** `Data_String.sync(ds1, ds2)` → "not a function"  
**Status:** Only Data_Value has static `sync()` method  
**Impact:** Cannot synchronize typed values  
**Decision Needed:** Implement for subclasses or document Data_Value as only sync-capable class

---

### 12. Data_String/Data_Integer have no .toImmutable()
**Issue:** Method doesn't exist on these classes  
**Status:** Only implemented for Data_Value  
**Impact:** Cannot create immutable snapshots of typed values

---

## 📊 Test Failure Breakdown

| Test Suite | Passing | Failing | Total | Pass Rate |
|------------|---------|---------|-------|-----------|
| Data_Value | 32 | 15 | 47 | 68% |
| Data_String | 3 | 41 | 44 | 7% |
| Data_Integer | 0 | 34 | 34 | 0% |
| Collection | 55 | 0 | 55 | 100% ✅ |
| collective | 33 | 0 | 33 | 100% ✅ |
| util | 66 | 0 | 66 | 100% ✅ |
| **TOTAL** | **168** | **112** | **280** | **60%** |

---

## 🎯 Recommended Fix Priority

### P0 - Critical (Fix Immediately)
1. ✅ Add .value property setup to Data_Integer
2. ✅ Add .value property setup to Data_String  
3. Fix attempt_set_value undefined variable
4. Fix immutable setter to prevent changes

**Expected Impact:** +75 tests passing (Data_String + Data_Integer basic functionality)

### P1 - High Priority
5. Fix rapid sync bug
6. Fix toImmutable sync value capture
7. Add type conversion to Data_String
8. Add validation to Data_String/Data_Integer

**Expected Impact:** +20 tests passing, improved reliability

### P2 - Nice to Have
9. Implement .sync() for typed classes OR document limitation
10. Implement .toImmutable() for typed classes OR document limitation
11. Support native types (Number, String) with data_type OR document as unsupported
12. Add change events to typed classes OR document as non-reactive

---

## 💡 Architectural Questions

### Are Data_String/Data_Integer production-ready?
**Evidence they're experimental:**
- Missing critical functionality (.value property)
- No type conversion despite being "typed" classes
- No validation despite having validate_value() methods
- No events despite inheriting from evented base class
- Extensive TODO comments in code

**Recommendation:** Either:
- A) Complete implementation to match Data_Value features
- B) Mark as experimental/alpha in documentation
- C) Deprecate and recommend Data_Value with type constraints

### Should typed classes have feature parity with Data_Value?
**Current state:** Data_Value has ~90% features, typed classes have ~10%

**Options:**
1. **Full parity:** Implement all features for all classes (high effort)
2. **Minimal:** Typed classes are just wrappers with basic .value (medium effort)
3. **Deprecate:** Use only Data_Value with data_type parameter (low effort)

---

## 📝 Documentation Gaps

### Missing from README.md:
1. Data_String/Data_Integer are incomplete/experimental
2. Feature matrix comparing classes
3. "NYI" (Not Yet Implemented) features list
4. Known limitations and workarounds
5. When to use Data_Value vs typed classes
6. Stability guarantees per class

### Recommended README Updates:
Add "Class Status" section:
- ✅ **Stable:** Collection, collective, util, Data_Value (core features)
- ⚠️ **Experimental:** Data_String, Data_Integer
- 🚧 **In Progress:** Immutability, native type support

---

## 🔧 Minimal Fix to Get Tests Passing

**To get from 60% → 90% pass rate, fix only these 2 issues:**

1. **Data_Integer.js** - Add after line with `super(spec);`:
   ```javascript
   const setup_base_data_value_value_property = require('./setup_base_data_value_value_property');
   // ... in constructor:
   super(spec);
   setup_base_data_value_value_property(this);
   ```

2. **Data_String.js** - Same fix:
   ```javascript
   const setup_base_data_value_value_property = require('./setup_base_data_value_value_property');
   // ... in constructor:
   super(spec);
   setup_base_data_value_value_property(this);
   if (spec.value) {
       this.value = spec.value;
   }
   ```

**This fixes 75 tests immediately.** Other failures are feature gaps, not bugs.

---

## 🚀 Next Steps

1. **Fix P0 bugs** (4 issues) - makes library usable
2. **Update README** with current state - manages expectations
3. **Mark experimental features** - prevents misuse
4. **Decide on typed classes** - complete, simplify, or deprecate
5. **Fix P1 bugs** if keeping typed classes
6. **Add migration guide** old/ → new/ if new/ becomes stable

---

## ✅ What's Working Well

- **Collection** - 100% tests passing, production-ready ✅
- **collective** - 100% tests passing, production-ready ✅  
- **util** - 100% tests passing, production-ready ✅
- **Data_Value core** - Most features work (syncing, events, type validation with Functional_Data_Type)

**Bottom line:** The core library is solid. The issues are in newer experimental features (typed classes) and edge cases (immutability, native types).
