Status: WIP
Last-Updated: 2025-11-15
Owner: @unassigned

# Move features upstream to `lang-mini` — workflow & example

This guide explains how to evaluate, propose, and migrate reusable features from `lang-tools` into `lang-mini`.

Why move features upstream?
- Reduces duplication across repos and implementations
- Improves consistency and discoverability of core primitives
- Ensures cross-repo benefit and fewer maintenance points

When to propose
- The feature is generic (not domain-specific to `lang-tools`)
- The feature helps other consumers (`jsgui`, `apps`) or is a general utility
- The feature's API is stable and can be tested in a standalone way

Step-by-step migration flow

1) Evaluate & define API
- Identify the feature’s public surface (`more_general_equals`, `collective`, etc.)
- Decide a clear API signature and name (e.g., `lang-mini.equals(a, b)`).
- Capture edge cases and expected behavior with example inputs.

2) Extract tests from `lang-tools`
- Copy or reword relevant unit tests into `lang-mini` format. Tests must demonstrate correct behavior for primitives, arrays, objects, and `Data_Model`-like objects.
- Example tests to add in `lang-mini` (pseudocode):
  - `expect(equals(1, 1)).toBe(true)`
  - `expect(equals([1,2], [1,2])).toBe(true)`
  - `expect(equals({a:1}, {a:1})).toBe(true)`
  - `expect(equals(data_model_a, data_model_b)).toBe(true)` (if the candidate supports `toJSON()` / `equals()` callbacks)

3) Draft `lang-mini` PR (fast-fail step)
- Implement a small, well-named function in `lang-mini` (e.g., `equals`) with tests.
- Add documentation and simple examples.
- If the behavior needs `Data_Model` awareness, make the function accept a `toJSON()`-able object or allow hooking into `value.equals()` if present.

4) Implement a wrapper in `lang-tools` and keep backwards compatibility
- Update `lang-tools` to read `equals` from `lang-mini`:
  - Temporary: keep local `more_general_equals` as a wrapper, or do `lang_mini.equals = require('lang-mini').equals`.
  - Replace local usages with `lang-mini.equals` in `lang-tools` files.
- In `lang-tools`, capture `--listTests` output (global + impacted files) via `npx jest --listTests` or `npm run test:list -- <files>`, and then run `npm test`; also run `npm run test:legacy`. Mirror the same discipline inside `lang-mini` before posting the PR.

5) Finalize & remove duplication
- After `lang-mini` PR lands and a release is cut, remove local duplicates from `lang-tools` and update `lang.js` to use the upstream helper.
- Update docs and `README.md` to link to `lang-mini` documentation.

6) Release & Rollout plan
- Add a deprecation note if you are removing a local helper previously exported in `lang-tools`.
- Update `changelog` or `roadmap.md` with migration notes.

Example: Migrating `more_general_equals` (detailed)

1) Assessment
- File: `Data_Model/new/tools.js` contains `more_general_equals`. It's used by `Data_Value` variants and `Immutable_*` classes.
- It returns deep equality across primitives, arrays, and for `Data_Model` instances, compares `toJSON()` results.

2) Desired API
- Proposed function: `lang-mini.equals(a, b)`
- Behavior:
  - Primitive equality (numbers, strings, booleans)
  - Array deep equality (recursing if elements are Data_Models)
  - If object has `toJSON()` use `toJSON()` return for comparison
  - If object has `equals()` method, call that as a primary check

3) Basic `lang-mini` implementation sketch
- Pseudocode:
  - If both are primitive and === return true
  - If both are arrays, ensure same length and recursively compare elements
  - If both are objects and `a.equals` is a function, call it and compare
  - If both have `toJSON()`, compare their JSON outputs
  - Fallback to false

4) Tests to port from `lang-tools`
- `test/data_value.test.js` adds cases for typed values and immutables.
- `test/util.test.js` tests object and array comparisons.
- Copy minimal tests for `equals` behavior into `lang-mini`'s test suite.

5) lang-tools changes (temporary compatibility)
- In `lang.js` replace the line that sets `lang_mini.equals` from `more_general_equals` to directly import from `lang-mini` once `lang-mini` is available:
```js
const {equals} = require('lang-mini');
lang_mini.equals = equals; // or remove if lang-mini exports via Evented_Class
```
- Keep `Data_Model/new/tools.js` wrapper while testing. For e.g.:
```js
const {equals: lang_equals} = require('lang-mini');
const more_general_equals = (...a) => lang_equals(...a);
module.exports = { more_general_equals };
```

6) Migration checklist
- [ ] `lang-mini` PR adds `equals` and tests
- [ ] `lang-tools` uses `lang-mini.equals` via temporary wrapper
- [ ] Validation tests in `lang-tools` succeed
- [ ] `lang-mini` PR merged and released
- [ ] `lang-tools` removes wrapper & duplicate code

Notes & edge cases
- Data_Model nuances: If `toJSON()` has non-deterministic ordering (object key order) or custom `toJSON()` semantics, the implementation in `lang-mini` should define deterministic comparison (sort object keys, canonicalize arrays). Document the `equals` semantics and edge cases.
- Performance: For deep comparisons, add a complexity note and ensure tests cover large arrays/objects to detect regressions.

Presenting to `lang-mini` reviewers
- Link the `lang-tools` files that originally implemented the function and test cases (source-anchors for language maintainers):
  - `Data_Model/new/tools.js` (helper implementation)
  - `Data_Model/new/Data_Value.js` (usage)
  - `Data_Model/new/Immutable_Data_Value.js` (usages)
  - A minimal test set copying deep equality cases from `test/data_value.test.js` and `test/util.test.js`.

Final tip
- If unsure about API naming or semantics, submit a design issue in `lang-mini` first and collect feedback. That saves rework and speeds final implementation.
