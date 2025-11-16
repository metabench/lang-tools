Status: WIP
Last-Updated: 2025-11-15
Owner: @unassigned

# Bug Fix Playbook: Detailed plan, checklists, and workflows for agents

Purpose
- This document centralizes the main bug fixes surfaced by the test-suite run and exploratory checks. It gives agents specific steps, test coverage tasks, and an ordered workflow to implement fixes safely with minimal downstream disruption.

Context
- Test run summary:
  - 12 test suites, 2 passed, 10 failed
  - 212 tests passed, 88 failed
  - Key failures: new Data_Value missing property wiring, BUG001 local_js_value undefined, NYI branches in typed handling, Data_Value.sync behavior, old Collection compatibility with new Data_Value, and immutability tests failing.

How to use this document
- Read the itemized bug list below.
- Pick a bug item and follow the numbered steps under Fix Workflow and Tests to add/modify.
- Run the tests and update `BUGS.md` accordingly. Use the PR template for submissions (`docs/templates/agent-pr-template.md`).

### Test command safety
- Always dry-run first: `npx jest --runInBand --listTests` (or `npx jest --runTestsByPath <file> --listTests`) before executing any suite. This guarantees Jest exits immediately and prevents Copilot sessions from hanging.
- Prefer the wrapper script when possible: `npm run test:list -- <files>` uses `scripts/jest_careful_runner.mjs` so you do not have to memorize the guard flags.
- Persist the dry-run output via `node scripts/capture-list-tests.js <output> -- <args>` whenever you touch a new suite; reviewers rely on those artifacts.
- Avoid `npm run test:watch` or long-lived processes while acting as an agent.

High-level priorities
1) Fix property wiring for `Data_Value` (most tests impacted)
2) Fix `attempt_set_value` (`BUG001`) and validation flows
3) Implement Number/String/Integer parsing and validation branches
4) Add more robust sync guard logic and checks
5) Make `Collection.push` accept `new Data_Value` instances
6) Fix immutability behavior and tests
7) Leak detection / test cleanup (--detectOpenHandles)

Detailed bug list & playbook

BUG #1 — New `Data_Value` property `value` not wired
Location(s):
- `Data_Model/new/Base_Data_Value.js`
- `Data_Model/new/setup_base_data_value_value_property.js`

Symptoms:
- dv.value is undefined for array/object initial values; many tests expect dv.value get/return.

Fix workflow (priority: high)
1. Ensure `setup_base_data_value_value_property(this)` is invoked in `Base_Data_Value` constructor.
2. Ensure `setup_base_data_value_value_property` correctly defines `value` property with local JS value closure and `get`/`set` semantics.
3. Ensure all code paths that set initial value call the setter or set the closure variable consistently.
4. Add unit tests: create `Data_Value` with primitive/literal, array, object spec, and with `data_type` and confirm `dv.value` property returns correct type/contents.

Tests to add/update
- Expand `test/data_value.test.js` to assert `dv.value` exists for all constructor signatures.
- Add test verifying that `dv.value` setter triggers `change` event (both pre-existing and new `Data_Value` variant).

Acceptance criteria
- `dv.value` exists and returns expected contents for all constructor variants
- No regression of old tests
- New unit tests included and passing

Checklist for PR
- [ ] Capture `--listTests` output for affected suites (e.g., `node scripts/capture-list-tests.js docs/docs/reports/jest/list_tests/<suite>.json -- --runTestsByPath test/data_value.test.js`) and run the matching commands (`npm test`, `npx jest --runInBand --runTestsByPath ...`).
- [ ] Add tests for `dv.value` construction variants
- [ ] Update `BUGS.md` with this bug status and resolution plan
- [ ] Add code comments explaining why `setup_base_data_value_value_property` is called in `Base_Data_Value` constructor

BUG #2 — `BUG001`: `local_js_value` undefined in `attempt_set_value`
Location(s):
- `Data_Model/new/Data_Value.js` (attempt_set_value, get_local_js_value_copy)
- `Data_Model/new/setup_base_data_value_value_property.js` (local_js_value closure)

Symptoms:
- ReferenceError thrown during `attempt_set_value` when `local_js_value` is referenced

Fix workflow (priority: high)
1. Decide on consistent value storage approach
   - Option A: Use `this.value` property consistently inside `attempt_set_value` (simplest and visible). If we use property access, tests and code referencing `value` should all pass.
   - Option B: If using `local_js_value` closure, ensure `attempt_set_value` is within the same closure or `setup_base_data_value_value_property` provides shim functions/ an API to interact with the closure.
2. Implement fix accordingly (prefer Option A to minimize closure scope complexity).
3. Update `attempt_set_value` to read the old value via `this.value` and perform validation and events using setter.
4. Add unit tests verifying attempt_set_value success/failure and that no ReferenceError occurs.

Tests to add/update
- Update `test/data_value.test.js` `attempt_set_value` cases to assert `result.success` for valid assignments and `false` for invalid ones — this was already part of the test set but was blocked by ReferenceError.

Acceptance criteria
- `attempt_set_value` no longer throws a `ReferenceError` and returns structured `Value_Set_Attempt` objects.
- Existing `attempt_set_value` tests pass and validate expected behavior.

BUG #3 — Unimplemented NYI sections for typed handling (Number/String/Integer parsing)
Location(s):
- `Data_Model/new/Data_Value.js` (many branches using `throw 'NYI';`)
- `Data_Model/new/setup_data_value_data_type_set.js`

Symptoms:
- Tests for typed behavior (parsing string to number, integer validation) throw `'NYI'` instead of performing conversions.

Fix workflow (priority: medium-high)
1. Implement parsing and validation behavior for Number / String / Functional_Data_Type.integer.
2. Use `Functional_Data_Type` where possible from `lang-mini` to validate and parse string inputs.
3. Keep `attempt_set_value` logic up-to-date and return `Value_Set_Attempt` with parsed values flagged.
4. Add tests for typed behavior for Number and Integer conversions and negative cases.

Tests to add/update
- Update `data_value.test.js` typed tests so that they assert conversions and validation behavior and replicate failure cases.

Acceptance criteria
- Type conversions pass tests; string->number conversions produce numeric values.
- Integer validation rejects decimals as expected.

BUG #4 — Sync guards and redundant assignment causing inconsistent sync
Location(s):
- `Data_Model/new/Data_Value.js` (Data_Value.sync and change event handlers)
- `Data_Model/new/tools.js` for `more_general_equals` guard

Symptoms:
- Rapid sequential updates fail; redundant assignments cause inconsistent DV state or missing updates.

Fix workflow (priority: medium)
1. Modify `Data_Value.sync` to verify new values via `more_general_equals` before assigning `b.value = value` to avoid redundant assignments.
2. Ensure `more_general_equals` handles `Data_Value`/`Data_Object` vs primitives consistently.
3. Add tests that simulate rapid updates (loop of assignments) and assert that synced values remain consistent across `Data_Value` instances.

Tests to add/update
- Add tests to simulate rapid updates and assert dv1 === dv2 after each loop
- Add tests for three-way sync chains and circular syncs verifying no infinite loops and consistent final state

Acceptance criteria
- Rapid updates pass
- No infinite loops occur and sync chains propagate as expected

BUG #5 — Legacy Collection doesn't accept `new Data_Value` instances
Location(s):
- `Data_Model/old/Collection.js` (push, insert, set logic)

Symptoms:
- When `new Data_Value` instances are pushed into `old Collection`, they may be wrapped, dropped, or pushed as undefined due to assumption of legacy types.

Fix workflow (priority: medium)
1. Update `Collection.push` to handle the `Data_Value` case (tv === 'data_value' or `instanceof Data_Model`), avoid rewrapping, and preserve `value` semantics.
2. Add tests verifying pushing `new Data_Value` objects into `Collection` stores them as-is.
3. Add test verifying `change` events raised with `insert` payloads and items preserved.

Tests to add/update
- `collection_new_data_value_compat.test.js` (already added) should pass: assert `coll.get(0) === dv` and event fired. Add smaller unit tests for `insert`, `set`, and `clear` cases with `new Data_Value`.

Acceptance criteria
- `Collection` can accept `new Data_Value` instances without rewrapping or data loss
- All `Collection` integration tests pass for both old and new Data_Value use cases

BUG #6 — toImmutable/Immutable_Data_Value: missing value and setter not blocked
Location(s):
- `Data_Model/new/Immutable_Data_Value.js`
- `Data_Model/new/Base_Data_Value.js` or `setup_base_data_value_value_property.js` for setup

Symptoms:
- `Immutable_Data_Value` lacks `value` or `value` doesn't block setter: `immutable.value = 100` doesn't throw, or `immutable.value` returns undefined.

Fix workflow (priority: medium)
1. Ensure `toImmutable()` copies the underlying JS value into `Immutable_Data_Value` and that property `value` is an accessor that throws when written.
2. Make sure `toImmutable()` calls the base `setup_base_data_value_value_property` but with setter disabled or throw when attempted.
3. Add tests: `immutable.value` exists and equals original value; attempting to assign should throw.

Tests to add/update
- Extend the immutability tests in `data_value.test.js` to assert assignment throws and that nested arrays/objects are deep-frozen.

Acceptance criteria
- Immutable values return content via `value` and throw on setter assignment
- Deeply nested arrays/objects are read-only (cloning required to mutate)

BUG #7 — Test leaking and open handles
Location(s):
- Tests and code that register long-running handlers without teardown (e.g., event listeners not removed) or timers not cleared.

Symptoms:
- Jest warns about open handles and forcibly exits; some tests exceed timeouts waiting for `done()` (like event-based tests for change) and do not call `done()` or unregistered events.

Fix workflow (priority: low)
1. Dry-run `npx jest --runInBand --detectOpenHandles --listTests` (or add `--runTestsByPath <file>`). After confirming the selection, run `npm test -- --detectOpenHandles` only if you need the live diagnostics.
2. Fix test suites to properly cleanup event handlers or use local contexts that auto-destroy.
3. Ensure tests using `done()` always trigger done() or use Promise-returning tests.

Tests to add/update
- Add teardown hooks where needed; verify `on('change')` subscriptions do not persist across tests.

Acceptance criteria
- No open handles reported by Jest; all tests exit gracefully

Documenting bug fixes in `BUGS.md`
- When an agent works on any bug, they must:
  1. Add a short entry to `BUGS.md` with `- Status: WIP` and link to the PR
  2. Add `TODO <BUG###>` comments on relevant files where appropriate
  3. Update `BUGS.md` status to `Fixed` upon successful merge and include commit and PR number

Agent test & PR workflow (for each bug)
1. Pick a bug and claim it (update `BUGS.md` and internal work board).
2. Create a branch: `fix/BUG###-short-desc`.
3. Implement minimal fix with a conservative test-first approach (update/add tests, then code).
4. For Jest, capture `--listTests` output (global + file-level) and then run `npm test`. For the legacy harness, simply run `npm run test:legacy` (no watch mode available).
5. Create a PR following `docs/templates/agent-pr-template.md`:
   - Include failing test evidence & passing tests after changes
   - Link related bug(s)
   - Describe tradeoffs/behavior changes
6. Request at least one reviewer and address comments.
7. After merging, update `BUGS.md` and `docs/content/data-model-differences.md` (if relevant).

PR checklist for bug-fix PRs (use template)
- [ ] Tests added/updated to capture the failing case(s)
- [ ] `BUGS.md` updated with `Fixed by` and link to PR
- [ ] CI runs (list-first guard + `npm test`, plus `npm run test:legacy`) succeed on your fork/branch
- [ ] Docs updated if API changes or behaviors change
- [ ] Deprecation note if removing old APIs

Rollout and migration notes
- For larger changes to `Data_Value` or `Data_Object` behavior, include a small rollout plan: publish a minor version that exports both old & new APIs and a follow-up PR that removes old APIs after downstream uptake.

Appendix: Useful commands
```bash
# Dry-run the entire Jest suite (preferred in automation)
npx jest --runInBand --listTests

# Dry-run a specific file
npx jest --runTestsByPath test/data_value.test.js --listTests
npm run test:list -- test/data_value.test.js

# Dry-run detectOpenHandles while keeping the shell responsive
npx jest --runInBand --detectOpenHandles --listTests

# Persist a dry-run artifact for reviewers
node scripts/capture-list-tests.js docs/docs/reports/jest/list_tests/manual.focus-data_value.json -- --runTestsByPath test/data_value.test.js

# After confirming the selection, run the matching commands
npm test
npx jest --runInBand --runTestsByPath test/data_value.test.js
npm run test:careful -- test/data_value.test.js
npm run test:coverage
npm run test:legacy
```

Notes and proposed order of implementation
- Implement `BUG001` and `Base_Data_Value` wiring first — these fixes unblock a lot of tests.
- Fix `attempt_set_value` and type conversions next.
- Then focus on `Collection` compatibility for `new Data_Value` and final syncing/immunity fixes.

If there is no clear implementation result or regressions have unexpected consequences, leave a summary in `BUGS.md` with a `WIP` label and propose alternate approaches (shim, wrapper, or partial feature toggle). 
