Status: WIP
Last-Updated: 2025-11-16
Owner: @unassigned

# Data Model - Old vs New: Differences & Migration Notes

This document explains the functional differences between the legacy (old/) and modern (new/) data model implementations and gives examples for porting code.

Summary of differences
  - Old Data_Value/Data_Object APIs are based on methods (.value(), .set(), .get()) and were designed before ES6 property semantics.
  - New Data_Value/Data_Object use modern property-based accessors (`.value` getter/setter) and ES6-friendly patterns for `toImmutable()` and `Validation`.
  - Both implementations use `Evented_Class`-based events, but new classes tend to rely on `toImmutable()` and event payload refinement.
  - New code uses `Functional_Data_Type` (from `lang-mini`) and additional parsing/validation steps in Data_Value (`setup_data_value_data_type_set.js` and `Value_Set_Attempt` objects).
  - The old code relied on ad hoc `input_processors` and could return Data_Value wrapper objects for primitives at different API points.
  - Both implementations support `Mini_Context` and use `.context` to generate stable `_id()` references.
  - New implementations use `Immutable_*` wrappers and block setter semantics on immutable instances.

API compatibility matrix
| Feature | Old API | New API | Notes |
|---|---|---|---|
| Access primitive value | dv.value() method | dv.value (property) | Most changes require search/replace: `dv.value()` -> `dv.value`
| Set primitive value | dv.set(value) | dv.value = value | `set()` is still supported in legacy code; convert to property assignment when porting.
| Create typed value | new Data_Value({value: '12', data_type: Number}) | new Data_Value({value: '12', data_type: Number}) | New Data_Value supports parsing and validation through `Functional_Data_Type` and `attempt_set_value` patterns.
| Clone / Immutable | dv.clone() | dv.toImmutable() | Use `toImmutable()` for snapshotting values.
| Events | dv.on('change', handler) | dv.on('change', handler) | Similar behavior. New types refine payload shapes in some cases.

## Detailed comparison

### Data_Value

| Dimension | old/Data_Value | new/Data_Value |
| --- | --- | --- |
| Storage | Internal `_value` slot; primitive access via `.value()` | `setup_base_data_value_value_property` defines ES getter/setter `dv.value` backed by closure |
| Mutation API | `.set(value)` and `.value(newValue)` both trigger change | Assignment (`dv.value = newValue`) plus `attempt_set_value` / `Value_Set_Attempt` flows |
| Type validation | Ad hoc processors per invocation | Centralized `Functional_Data_Type` plus `setup_data_value_data_type_set.js` |
| Immutability | `clone()` performs shallow copy; no frozen snapshot | `toImmutable()` returns `Immutable_Data_Value` with blocked setter |
| Sync | Manual event listeners | `Data_Value.sync` helper uses `more_general_equals` guard |
| Serialization | `toJSON()` returns primitive or serialized object | Same, but uses modern property semantics and respects immutables |
| Context IDs | Optional `Mini_Context` in constructor; `_id()` fallback to GUID | Same but constructor consistently requests context and uses `Mini_Context` helper |

Key behavioral gaps to watch:
- Old `clone()` returns another mutable `OldDataValue`; new `toImmutable()` returns a frozen structure. When retiring the old clone path, ensure consumers expecting mutable clones either switch to `dv.clone()` shim (for compatibility) or adopt `dv.toImmutable()` + `new Data_Value(immutable.value)`.
- The legacy API frequently returned `OldDataValue` wrappers from container operations (Collections). New collections tend to return plain `Data_Value` instances, so migration requires touching the callers to use property access rather than `.value()`.
- Legacy events emitted `{value, old}` payloads with raw JS values; the new API can emit `Value_Set_Attempt` metadata. Document this difference wherever downstream consumers inspect event shapes.

### Data_Object

| Dimension | old/Data_Object | new/Data_Object |
| --- | --- | --- |
| Field access | `.get(key)` returns `OldDataValue`; `.set(key, value)` wraps values on insert | Properties stored as `Data_Value` instances with `.value` access; `.set` prefers property-style usage |
| Iteration | `.each(fn)` yields `Data_Value` wrappers | Modern version leans on plain objects or iterables returning direct JS values |
| Nested structures | Automatically wraps arrays/objects in `Collection`/`Data_Object` as needed | Expects explicit specification; relies on new typed classes for nested data |
| Serialization | `toJSON()` stringifies internal map (sometimes returning JSON string) | Returns plain JS object suitable for `JSON.stringify` |
| Context | Optional `Mini_Context`, but not enforced | Consistently requires context for deterministic `_id()` |

Interop concerns:
- Old containers expect callers to invoke `.value()` on every node. When migrating to the new stack, confirm the hosting components (e.g., UI bindings) do not assume method-based access.
- The new `Data_Object` is stricter about type metadata. Places that relied on the old "store anything" semantics may need explicit `data_type` declarations or wrapper classes.

Key migration examples
- Convert old style value access:
  - Old: `coll.get(0).value()` -> New: `coll.get(0).value` (assuming `coll` uses new Data_Value)
- Convert Data_Object field set:
  - Old: `obj.set('name', 'Alice')` -> New: `obj.set('name', 'Alice')` (API is largely compatible, but new Data_Object returns a Data_Value property with `.value`)

Testing & verification recommendations
- Before porting, dry-run the focused suites (`npx jest --runTestsByPath test/data_value.test.js --listTests`, `npx jest --runTestsByPath test/collection.test.js --listTests`) and only then execute the matching commands if needed.
- Add new tests that explicitly check modern usages (e.g., property access) while keeping regression tests for old API.
- Add conversion test cases that assert old and new code produce the same outputs — these will help ensure behavioral parity during migration.

Common pitfalls during migration
- Watch for `.value()` vs `.value` differences while refactoring — tests can be used to find issues quickly.
- Some older helper functions may assume `Data_Value` is a method-accessed instance — update wrappers to new datatypes carefully.
- Replace uses of `attempt_set_value` with property assignment if the validation behavior is unchanged, otherwise adapt validation flows to use `Value_Set_Attempt` handling.

Next steps
- Create a migration checklist and helper scripts (e.g., codemods) to automatically rewrite `dv.value()` -> `dv.value` and `dv.set(x)` -> `dv.value = x` where safe.
- Add `test/` entries that assert both old and new code produce equivalent results for a representative set of inputs.

## Retirement plan for old implementations

1. **Feature parity audit**
  - [ ] Re-run focused suites (`test/data_value.test.js`, `test/new_data_object.test.js`) with the new stack to confirm coverage of every behavior currently tested in `test/old_*.test.js`.
  - [ ] Expand modern tests for behaviors only checked in the legacy suites (e.g., `clone`, nested object storage). Legacy suites are currently skipped by default; enable them via `RUN_LEGACY_TESTS=1` when auditing.

2. **Deprecation messaging**
  - [ ] Add explicit warnings in `Data_Model/old/*` constructors (`console.warn` gated by env) indicating upcoming removal.
  - [ ] Update README + docs to flag the old APIs as deprecated, linking to this document and the migration guide.

3. **Consumer migration**
  - [ ] Update `lang.js` exports (or downstream projects like `jsgui`) to prefer the new classes. Provide shims where needed (e.g., alias `.value()` to `.value` getter temporarily).
  - [ ] Provide codemods or scripts to replace method-based value access. Track adoption per downstream repo.

4. **Test transition**
  - [ ] Duplicate or port critical `test/old_*` assertions into the new suites so that deleting the old files does not reduce coverage.
  - [ ] Once parity is confirmed, remove the legacy Jest files (or keep a minimal smoke test referencing archived behavior in `docs/tests/legacy.md`).

5. **Code removal**
  - [ ] Delete `Data_Model/old/*` modules after two minor releases with deprecation notices.
  - [ ] Remove `RUN_LEGACY_TESTS` gating once no suites depend on old code.
  - [ ] Clean up export indirection in `Data_Model/Data_Value.js` / `Data_Object.js` so they reference the new implementations directly.

6. **Post-removal verification**
  - [ ] Run full Jest + legacy Node tests to ensure no dead references remain.
  - [ ] Bump package minor/major version and document the removal in `CHANGELOG` or release notes.

Tracking this plan:
- Add each checklist item to `docs/status/roadmap.md` under Work In Progress once started.
- Capture the commands used (list-first + execution) in `docs/workflows/bug-fix-playbook.md` whenever you verify parity.
