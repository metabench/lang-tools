# AI Agent Instructions for lang-tools

Fast on-ramp (first 5 minutes)
- Read `README.md` for overall intent and `lang.js` for exports.
- Search for active bug IDs: `grep -r "<BUG" .` and open `BUGS.md`.
- Run a smoke test by first listing the targeted suite: `npx jest --runTestsByPath test/data_value.test.js --listTests` (shortcut: `npm run test:list -- test/data_value.test.js`). Only run `npx jest --runInBand --runTestsByPath test/data_value.test.js` if you truly need live output.
 - Read `docs/agent-on-ramp.md` for a step-by-step onboarding checklist.
 - Use `docs/templates/agent-pr-template.md` as the PR skeleton for agent-created PRs.

This document provides instructions for AI agents working on the lang-tools codebase, particularly for bug fixing and feature development.

## Bug Tracking System

lang-tools uses a **searchable bug ID system** for tracking issues:

### Bug ID Format
- Critical bugs: `<BUG001>`, `<BUG002>`, etc.
- Test issues: `<TEST001>`, `<TEST002>`, etc.

### How the System Works

1. **BUGS.md** - Central bug registry
   - Contains detailed descriptions of each bug
   - Includes proposed fixes and investigation notes
   - Organized by priority (P0=Critical, P1=High, P2=Medium)
   - Links to test failures and source file locations

2. **Source Code TODO Comments** - In-code markers
   - Format: `// TODO <BUG###>: Brief description`
   - Marks the exact location where the bug exists
   - References BUGS.md for full details

3. **Test Files** - May contain `<TEST###>` markers
   - Indicates test assumptions that need correction
   - Not library bugs, but test code issues

### Example Bug Entry

**In BUGS.md:**
```markdown
### <BUG001> Data_Value.attempt_set_value - Undefined Variable

**File**: `Data_Model/new/Data_Value.js:187`  
**Issue**: Variable `local_js_value` is not defined
**Proposed Fix**: Replace with `value` parameter
**Code Location**: Search for `<BUG001>`
```

**In Source Code (Data_Model/new/Data_Value.js):**
```javascript
// TODO <BUG001>: local_js_value is not defined - should this be 'value' or 'this._'?
// See BUGS.md for details and proposed fixes
const tljsv = tof(local_js_value);  // ❌ Bug here
```

## Workflow for Fixing Bugs

### Step 1: Identify the Bug
```bash
# Search for the bug ID across all files
grep -r "<BUG001>" .
```

Or use your editor's search: Search for `<BUG001>` globally

### Step 2: Read the Bug Documentation
1. Open `BUGS.md`
2. Find the bug section (e.g., `<BUG001>`)
3. Read:
   - Full description of the issue
   - Root cause analysis
   - Proposed fix (if available)
   - Investigation notes (what needs to be checked)

### Step 3: Locate the Bug in Source Code
- The `Code Location` field in BUGS.md tells you which file
- The TODO comment in the source marks the exact line
- Read surrounding code for context

### Step 4: Implement the Fix

**For bugs with "Proposed Fix":**
- Implement the suggested fix
- Test thoroughly
- Verify no regressions

**For bugs marked "Investigation Needed":**
- Research the codebase to understand intent
- Check related code and tests
- Propose a fix in discussion or PR
- Document your findings in BUGS.md

### Step 5: Test the Fix
```bash
# Dry-run specific test file (no execution)
npx jest --runTestsByPath test/data_value.test.js --listTests

# Dry-run entire suite (also no execution)
npx jest --runInBand --listTests

# Once the selection looks correct, run the matching commands
npx jest --runInBand --runTestsByPath test/data_value.test.js
npm test
```

### Step 6: Update Documentation
1. **In BUGS.md**: 
   - Change status from "Not Fixed" to "Fixed"
   - Add "Fixed by: [Your name/PR]"
   - Document any deviations from proposed fix
   
2. **In Source Code**:
   - Remove or update the TODO comment
   - Add explanatory comments if the fix is complex

3. **In TEST_ANALYSIS.md** or **roadmap.md** (if referenced):
   - Update status of related features

### Step 7: Commit and PR
```bash
git add .
git commit -m "Fix <BUG001>: Data_Value.attempt_set_value undefined variable

- Replaced local_js_value with value parameter
- Added null check for safety
- All related tests now passing

Fixes BUG001 as documented in BUGS.md"
```

## Priority Guide

### P0 - Critical (Fix Immediately)
- **Security issues**
- **Data loss bugs** (like <BUG003> Collection filtering)
- **Crashes** (like <BUG004> Collection.set)
- **Undefined variable errors** (like <BUG001>)

**Action**: Fix ASAP, even if it requires breaking changes (with proper documentation)

### P1 - High Priority (Fix Soon)
- **Incorrect behavior** that affects core functionality
- **API inconsistencies** that confuse users
- **Performance issues** in common operations
- **Missing error handling**

**Action**: Fix in next sprint or minor release

### P2 - Medium Priority (Plan and Fix)
- **Incomplete features** (like <BUG009> Data_String)
- **Nice-to-have improvements**
- **Edge case handling**

**Action**: Requires design discussion, may wait for major version

### Test Issues (Fix Tests, Not Code)
- **Test assumptions wrong** (like <TEST001> npx expectations)
- **API misunderstandings in tests**
- **Test code bugs**

**Action**: Fix test code to match actual (correct) behavior

## Common Patterns in lang-tools

### 1. Data Wrapping in Collection
```javascript
// Primitives (string, number) → wrapped in Data_Value
coll.push('text');  // Internally becomes Data_Value
coll.get(0).value() // Returns 'text'

// Objects → stored directly
coll.push({x: 1});  // Stored as-is
coll.get(0)  // Returns {x: 1}

// Arrays → wrapped in Collection
coll.push([1, 2]);  // Becomes new Collection
coll.get(0).length() // Returns 2
```

### 2. Old vs New Data_Value
```javascript
// OLD (in Collection): .value() is a METHOD
const item = collection.get(0);
const val = item.value();  // ✅ Call method

// NEW (in Data_Value/Data_String/Data_Integer): .value is a PROPERTY
const dv = new Data_Value({value: 10});
const val = dv.value;  // ✅ Access property
```

### 3. lang-mini's each() Callback Signatures
```javascript
// For arrays: (value, index)
each([10, 20, 30], (val, idx) => {
    console.log(val);  // 10, 20, 30
    console.log(idx);  // 0, 1, 2
});

// For objects: (value, key) - SAME ORDER!
each({a: 1, b: 2}, (val, key) => {
    console.log(val);  // 1, 2
    console.log(key);  // 'a', 'b'
});
```

### 4. Type Checking with tof()
```javascript
const {tof} = require('lang-mini');

tof('text')  // 'string'
tof(123)  // 'number'
tof(true)  // 'boolean'
tof([1, 2])  // 'array'
tof({x: 1})  // 'object'
tof(null)  // 'null'
tof(undefined)  // 'undefined'
tof(new Data_Value())  // 'data_value'
tof(new Collection())  // 'collection'
```

## Testing Guidelines

### Running Tests (list-first)
```bash
# Dry-run everything (no execution)
npx jest --runInBand --listTests

# Dry-run a specific file
npx jest --runTestsByPath test/collection.test.js --listTests

# Capture an auditable artifact
node scripts/capture-list-tests.js docs/docs/reports/jest/list_tests/manual.collection.json -- --runTestsByPath test/collection.test.js

# Shortcut via npm script
npm run test:list -- test/collection.test.js
```

After the dry-run matches expectations, run the actual command. Avoid `npm run test:watch` in agent sessions because it never terminates on its own.

```bash
# All tests
npm test

# Specific file
npx jest --runInBand --runTestsByPath test/collection.test.js
npm run test:careful -- test/collection.test.js

# Specific test name filter (combine with by-path when possible)
npx jest --runInBand --runTestsByPath test/collection.test.js -t "should push numbers"

# Coverage
npm run test:coverage
```

### Writing Tests
```javascript
// Use descriptive test names
test('should wrap primitive values in Data_Value', () => {
    // Arrange
    const coll = new Collection();
    
    // Act
    coll.push(42);
    
    // Assert
    expect(coll.get(0).value()).toBe(42);
});

// Document known bugs in tests
test('should accept null values', () => {
    const coll = new Collection();
    coll.push(null);
    // BUG: Collection currently filters out null - should accept it
    expect(coll.length()).toBe(1);  // Currently fails
});
```

## Code Style

### Formatting
- **Indentation**: Tabs (existing style)
- **Semicolons**: Optional (existing style varies)
- **Strings**: Single quotes preferred
- **Naming**: snake_case for most identifiers

### Comments
```javascript
// Good: Explain WHY, not WHAT
// TODO <BUG001>: Variable undefined - needs investigation
// Proposed fix: use 'value' parameter instead

// Avoid: Restating the code
// This sets x to 5
x = 5;
```

### Error Handling
```javascript
// Good: Specific error messages
if (!value) {
    throw new TypeError('Collection.push requires a value');
}

// Avoid: Generic errors
throw 'Error';  // Don't do this
```

## Getting Help

### Understanding Codebase
1. **Read architecture docs**: `.github/copilot-instructions.md`
2. **Check examples**: `examples/` directory
3. **Run examples**: `node examples/ex_data_value.js`
4. **Read tests**: Often best documentation of behavior

### When Stuck
1. **Search for similar code**: Use grep/search for similar patterns
2. **Check git history**: `git log --follow <file>` to see evolution
3. **Look at related features**: Often copy/paste with modifications
4. **Ask in PR**: If proposing fix, explain uncertainty

### Common Gotchas
- **Don't assume .value is a property** - check if it's a method in old code
- **insert() doesn't wrap** - unlike push(), it's a low-level operation
- **each() parameter order** - (value, index/key) not (index/key, value)
- **Context required** - many classes need `context` for ID generation
- **Immutability** - some classes have immutable variants

## Bug Fixing Checklist

Before marking a bug as fixed:

- [ ] Bug code in source file is corrected
- [ ] TODO comment removed or updated
- [ ] All related tests pass
- [ ] No new test failures introduced
- [ ] BUGS.md updated (status changed to "Fixed")
- [ ] Fix documented in commit message
- [ ] Code comments explain non-obvious fixes
- [ ] Manual testing performed (not just unit tests)
- [ ] Related documentation updated (README, roadmap, etc.)

## Special Notes

### NYI ("Not Yet Implemented") vs Bugs
- **NYI**: Feature deliberately not implemented yet (e.g., native Number/String types)
  - Often throws `throw 'NYI';`
  - Document in BUGS.md as P2 (design decision needed)
  - May require architecture discussion

- **Bug**: Something broken that should work
  - Fix if clear how it should behave
  - Investigate if unclear

### Breaking Changes
Some bug fixes may require breaking changes:
1. Document in BUGS.md
2. Add to roadmap.md with migration notes
3. Update CHANGELOG.md
4. Consider deprecation period
5. Update dependent projects (jsgui)

### Coordinating with jsgui
lang-tools is used by jsgui (GUI framework):
- API changes affect jsgui
- Test changes in jsgui before releasing
- Coordinate major changes with jsgui team
- See roadmap.md for migration planning

---

**Remember**: The bug ID system (`<BUG###>`) is designed to make finding and fixing bugs easy. Always search for the ID first, read the documentation, then fix confidently!

Happy bug hunting! 🐛
