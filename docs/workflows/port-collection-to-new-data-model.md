Status: WIP
Last-Updated: 2025-11-16
Owner: @unassigned

# Workflow: Port `Collection` to the modern Data_Model

This guide enumerates the phases, code touchpoints, and validation steps required to move `Data_Model/old/Collection.js` (and downstream consumers) onto the modern `Data_Object` / `Data_Value` implementations.

## 1. Scope & prerequisites
- `Collection` currently extends `Data_Model/old/Data_Object` and wraps `old/Data_Value` instances (see file header imports).
- The new stack exposes feature parity via `Data_Model/new/Data_Object.js` and `Data_Model/new/Data_Value.js`, but semantics differ (property access, immutable snapshots, typed validation).
- Before starting, read:
  - `docs/content/data-model-differences.md` (detailed old vs new comparison, retirement checklist)
  - `README.md` Testing section (list-first workflow)
  - `docs/workflows/bug-fix-playbook.md` (command capture requirements)

## 2. Phase breakdown

### Phase A — Behavioral inventory
1. Run legacy suites with `RUN_LEGACY_TESTS=1`:
   ```bash
   npx jest --runTestsByPath test/old_data_value.test.js --listTests
   RUN_LEGACY_TESTS=1 npx jest --runInBand --runTestsByPath test/old_data_value.test.js
   RUN_LEGACY_TESTS=1 npx jest --runInBand --runTestsByPath test/old_data_object.test.js
   RUN_LEGACY_TESTS=1 npx jest --runInBand --runTestsByPath test/collection.test.js
   ```
2. Capture observable behaviors: event payloads, `.set` semantics, indexing, serialization. Log gaps in `docs/content/data-model-differences.md` under pending section.
3. Identify downstream modules (search for `require('./Data_Model/old/Collection')`, `instanceof Collection`). Document affected files.

### Phase B — Shim strategy
1. Decide whether to:
   - Create a `Collection_new` class that extends `new/Data_Object` and gradually swap exports, **or**
   - Refactor existing file in place while providing method shims (`value()` delegating to `.value`).
2. Draft API adaptation layer:
   - Provide `CollectionLegacyAdapter` that wraps `new Collection` but exposes legacy method surface (temporary aid for downstream repos).
3. Update `docs/content/data-model-differences.md` with chosen approach and deprecation timeline.

### Phase C — Implementation steps
1. **Refactor inheritance**
   - Change `const Data_Object = require('./Data_Object');` to point to `../new/Data_Object` (with TODO marker referencing retirement plan) once internal usages are migrated.
   - Replace direct usage of `old/Data_Value` with `new/Data_Value`, ensuring `.value` property access anywhere `.value()` was assumed.
2. **Normalize APIs**
   - Introduce helper functions (`wrap_value`, `unwrap_value`) that handle both legacy `.value()` and modern `.value` until callers are updated.
   - Audit methods (`set`, `push`, `insert`, `get`, `each`) for assumptions about return types; update to use property-style semantics.
3. **Index & serialization alignment**
   - Ensure index uses plain JS values (from `dv.value`) to avoid leaking `Data_Value` objects to consumer code.
   - Update `toJSON` / `stringify` to rely on `Data_Value` immutables.
4. **Event payload modernization**
   - Standardize change events to emit `Value_Set_Attempt` or at least `{value, old}` with primitive snapshots; note differences in docs.
5. **Context handling**
   - Require `Mini_Context` in constructor; provide fallback for callers that omit it (auto-create local context) but log warning.

### Phase D — Consumer migration
1. Update `lang.js` exports to point `Collection` at the refactored/new implementation.
2. For downstream repos (e.g., `jsgui`), run codemods to replace `.value()` with `.value` where `Collection` return types changed.
3. Track adoption progress in `docs/status/roadmap.md` (Work In Progress table).

### Phase E — Cleanup
1. Remove `CollectionLegacyAdapter` once all consumers are on the new API.
2. Delete `Data_Model/old/Collection.js` along with `old/Data_Object` / `old/Data_Value` following the retirement plan.
3. Remove `RUN_LEGACY_TESTS` gating and legacy Jest suites.

## 3. Testing & validation
- **List-first commands:**
  ```bash
  npx jest --runInBand --listTests
  npx jest --runTestsByPath test/collection.test.js --listTests
  ```
- **Focused execution (post-refactor):**
  ```bash
  npm run test:careful -- test/collection.test.js
  npm run test:careful -- test/data_value.test.js
  npm run test:careful -- test/new_data_object.test.js
  npm run test:legacy
  ```
- **Parity checks:** Temporarily re-enable legacy suites (`RUN_LEGACY_TESTS=1`) to compare outputs before deleting them.
- **Documentation verification:** Update `docs/content/data-model-differences.md` and `README.md` with observed changes; note commands and results in `docs/workflows/bug-fix-playbook.md`.

## 4. Risk & tracking
- **Risk:** Downstream consumers still calling `.value()` will break if we expose modern objects too early — mitigate via adapter layer and codemods.
- **Risk:** Event payload changes could break custom listeners; document payload diffs and provide translation helper if needed.
- **Tracking:**
  - Add each phase (A–E) to `docs/status/roadmap.md` (Work In Progress section) with owner + checkpoint.
  - Reference this workflow file in related PRs using the doc metadata.

## 5. Deliverables checklist
- [ ] Behavioral inventory logged (Phase A)
- [ ] Adapter strategy decided and documented (Phase B)
- [ ] `Collection` refactored to use new Data_Model (Phase C)
- [ ] Downstream consumers updated + adapters removed (Phase D)
- [ ] Legacy files/tests deleted; documentation updated (Phase E)

Keep this document updated as work progresses (set `Status` to `Completed` when finished, update `Last-Updated`).
