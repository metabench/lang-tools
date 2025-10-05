
Planned: Version 0.0.10
    Making this use fnl.
        Seems best at this stage.

    Transformer
        Compiler
        Codec
    Encoding_Type?
    Encoding
        - Language short name
        - Version short string
        - (Further encoding options?)

        // eg 'js', '2022'.    could give js versions by dates.
        //    'js', '2018' may be more realistic for browser support.

    Input encoding
    Output encoding

[2025 - Major API Modernization]

**BREAKING CHANGE - Collection .value() → .value getter property**

Status: Planned (not yet implemented)
Priority: High - but requires careful migration planning
Scope: Large codebase impact

Current Behavior:
    Collection items (old Data_Value) use .value() as a METHOD
    Example: collection.get(0).value() returns the actual value
    Alternative: collection.get(0)._ accesses internal storage directly

New Behavior:
    Migrate to .value as a GETTER property (matching new Data_Value API)
    Example: collection.get(0).value will return the actual value
    Consistent with modern Data_Value, Data_String, Data_Integer classes

Rationale:
    - API consistency across old and new data model implementations
    - Modern ES6 getter pattern more intuitive than method calls
    - Aligns with new/ directory implementations
    - Reduces cognitive load when switching between Collection and Data_Value

Migration Challenges:
    - Collection uses old/Data_Value.js internally
    - Need to update or replace old/Data_Value.js with getter-based .value
    - Large downstream impact: jsgui and other dependent projects use .value() extensively
    - Cannot be done incrementally - breaking change requires coordinated update
    - Need migration guide and deprecation warnings

Implementation Steps:
    1. Create new Data_Value implementation with .value getter in old/ directory
       OR modify existing old/Data_Value.js to add getter while keeping method
    2. Add deprecation warnings to .value() method: "Use .value property instead"
    3. Update all lang-tools internal code to use .value property
    4. Test suite already expects .value property (can validate migration)
    5. Document breaking change in CHANGELOG
    6. Update dependent projects (jsgui, etc.) in coordinated release
    7. Remove .value() method in next major version

Timeline Estimate:
    - Internal changes: 2-3 days
    - Dependent project updates: 1-2 weeks (coordinate with jsgui team)
    - Testing and validation: 1 week
    - Total: ~3-4 weeks for complete migration

See: TEST_ANALYSIS.md for detailed analysis of current .value() vs .value usage

---

**BUG FIX - Collection should accept null/undefined/boolean values**

Status: Bug identified, not yet fixed
Priority: Medium
File: Data_Model/old/Collection.js - push() method
Issue: Collection.push() silently filters out null, undefined, and boolean values

Current Behavior:
    collection.push(null)       // Silently ignored, length stays 0
    collection.push(undefined)  // Silently ignored, length stays 0
    collection.push(true)       // Silently ignored, length stays 0
    collection.push(false)      // Silently ignored, length stays 0

Expected Behavior:
    All primitive values should be accepted and wrapped in Data_Value
    null, undefined, and booleans are valid data that may need to be stored

Root Cause:
    The push() method only handles these type cases:
    - 'object' or 'function' → stored directly
    - 'array' → wrapped in new Collection
    - 'string' or 'number' → wrapped in Data_Value
    - 'data_object', 'control', 'collection' → stored directly
    
    Missing: 'boolean', 'null', 'undefined' fall through without handling

Proposed Fix:
    Add handling for boolean/null/undefined in push() method:
    ```javascript
    if (tv === 'string' || tv === 'number' || tv === 'boolean' || 
        tv === 'null' || tv === 'undefined') {
        const dv = new Data_Value({
            'value': value
        });
        pos = this._arr.length;
        this._arr.push(dv);
        // ... raise change event
    }
    ```

Impact:
    - Low risk - adds functionality without breaking existing behavior
    - Would allow Collections to be used for checkbox states, optional values, etc.
    - Fixes 3 failing test cases in test/collection.test.js

Related Tests:
    - test/collection.test.js: "should handle null values"
    - test/collection.test.js: "should handle undefined values"  
    - test/collection.test.js: "should handle boolean values"

---

**BUG FIX - Collection.set() with single value crashes**

Status: Bug identified, not yet fixed
Priority: Medium
File: Data_Model/old/Collection.js line 164
Issue: Calling collection.set(singleValue) throws "Cannot read properties of undefined (reading 'set')"

Current Behavior:
    const coll = new Collection(['A', 'B']);
    coll.set('X');  // ❌ TypeError: Cannot read properties of undefined (reading 'set')

Root Cause:
    Line 164: `return this.super.set(value);`
    The `this.super` property is undefined - should be using proper prototype chain

Proposed Fix:
    Replace `this.super.set(value)` with proper parent class method call:
    ```javascript
    } else {
        // Call parent Data_Object.set() method
        return Data_Object.prototype.set.call(this, value);
    }
    ```

Impact:
    - Low risk - fixes crash without changing behavior
    - Allows single value to be set on collection (delegates to parent)
    - Fixes 1 failing test case

Related Test:
    - test/collection.test.js: "should set with single value"

---

**TEST BUG - Collection index API assumptions**

Status: Test bug identified
Priority: Low
File: test/collection.test.js
Issue: Tests assume index.size() method exists, but Collection index may not have this method

Failing Tests:
    - "should update index on push" - calls coll.index.size()
    - "should handle custom index function" - incorrect fn_index signature

Investigation Needed:
    - What is the actual API for Collection.index?
    - Does index have a .size() method or should tests use different approach?
    - For custom index function, what signature should fn_index have?
    
Current Test Code (may be wrong):
    ```javascript
    expect(coll.index.size()).toBeGreaterThanOrEqual(0);  // Fails: size is not a function
    const fn_index = (item) => item.value();              // Fails: value not a function for some types
    ```

Action:
    - Research actual Collection indexing system API
    - Update tests to match actual implementation
    - OR fix Collection to provide expected index.size() method

---

2022 0.0.12 onwards:

Improvements that will help with the jsgui control MVC system.
The control is essentially the controller, however, could add a .controller property.
Do see the advantage in adding a .model property, and .view property.
Plan on doing both with mixins.
Maybe on all controls? Maybe not.
Maybe on MVC_Control.

[Late 2023
  Data_Object is at the core of the currently developing implementation of MVC (Control has: Data_Model, View_Model)
  Not yet using Data_Value properly.
  May make sense to use it as a single value within a Data_Model.
  // maybe ._ will be the value????
  // or .v ???
  
  // Defining the format of / for the Data_Value.

  // Maybe remake both of them in improved ways?
  //   Would need to define what their APIs are and make improved versions (first?)

  // Maybe some API changes...?
  //   .get being a different way to go about things than fields.

  //   .get(key, format) could help though.
  //   .get(key, other_function_to_call_before_returning_value)










]

MVC_Control may be the best platform on which to create controls in the future.
  A more clearly defined and documented API. ???
    Better document existing API???
  The API will be clearer within the code itself.
    Will be clearer that a calendar interacts with dates, yet also allows interaction with events that take place on specified dates.
      eg Date and Dated_Event class?
        May have a kind of list of the data types that it interacts with
          Date
          Calendar_Event
            start_date
            end_date
            location (string? any?)
            participants
              (their email addresses? phone numbers? could get quite in depth)
              user contacts from other apps...?

  .view has been described a lot. how it gets presented in different circumstances

  .controller ??? possibly some settings to do with how the control operates.
    logging perhaps
    logging to server perhaps
    being able to inject other function calls in various places
      so a subclass able to access the superclass's controller may have a useful means to upgrade...?
        though maybe those would be view functions or hooks anyway.

  Don't see much need in .controller.
    Should I try to find one? Or make the .model and .view which seem much more important?
      The control essentially is the controller.
        Maybe a controller would be of use for post-construct? But that still seems very much like view.
  Much of the existing logic falls within 'view' category.
  Model is not that much of a challenge as we can use a reference to an object. Want to now better define the type of Model data.

  



  







