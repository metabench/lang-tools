Status: Planned
Last-Updated: 2025-11-15
Owner: @unassigned

# Migration Plan: Move to modern Data_Model (new/) and retire old/ implementations

Goal: Replace old `Data_Model/old` implementations (Data_Value, Data_Object, Collection) with modern `Data_Model/new` equivalents while preserving behavior, tests, and downstream compatibility.

Overview
- This workflow uses a staged approach: Tests -> Code shim -> Feature-by-feature porting -> Replace -> Clean-up.

Stage 1: Coverage & Safety
1. Add tests for old and new code paths. (Already in progress: `test/old_data_value.test.js`, `test/old_data_object.test.js`, `test/new_data_object.test.js`, `test/data_model_comparison.test.js`.)
2. Add cross-check tests that assert semantic equivalence for representative cases between old and new APIs.
3. Ensure CI runs both Jest and legacy `node test/test-all.js` (`npm run test:legacy`).

Stage 2: Shim & Deprecation
1. Add compatibility shims exposing new API from old modules or vice versa where feasible. e.g., Keep old module name but re-export new implementation where appropriate to reduce churn.
2. Document deprecation notes: mark old functions as deprecated in code comments and `BUGS.md`.
3. Release a minor version with deprecation warnings (if required).

Stage 3: Port Code
1. Port functionality one module at a time (Data_Value → Data_Object → Collection).
2. For each module:
  - Replace internal primitives with new Data_Value or new Data_Object API.
  - Ensure event semantics, toJSON, `toImmutable()` and validation are preserved.
  - Add tests that assert parity with old behavior.
3. Replace references in other code modules to prefer modern APIs.

Codemod hints (automated / semi-automated)
- A codemod / code transformation script should be conservative and emit a diff for maintainer review. Example transforms include:
  - Replace `dv.value()` with `dv.value` where appropriate.
  - Replace `dv.set(value)` with `dv.value = value` where the Data_Value is new.
- Recommended commands: Use `jscodeshift` or `ts-morph` (runs as Node script) for safer AST-based transforms. Craft transforms that guard against changing older Data_Value uses that are intentionally method-based, and include a whitelist of files or a search pattern to limit scope.

Stage 4: Replace & Validate
1. Once coverage is green (tests pass for both old and new), update `lang.js` exports to reference new modules.
2. Run a broad set of integration/consumer tests (e.g., run jsgui or other downstream consumer tests if available).
3. Add migration notes for code that accessed old APIs directly.

Stage 5: Remove Old Code
1. Remove `Data_Model/old` code after validation and when maintainers are comfortable.
2. Update docs and `README.md` to reflect the modern API only.

Porting Guidance
- Conversions to do for code that uses old Data_Value/Data_Object:
  - `dv.value()` -> `dv.value` (property)
  - `dv.set(x)` -> `dv.value = x` (assignment) when validation is equivalent.
  - `obj.set('key', v)` remains similar; update code to use `obj.get('key')` being a Data_Value with `.value` property if needed.
  - For `Collection`, expect that it will eventually use new Data_Value consistently; confirm in porting tests.

Test-driven Migration Tips
- Create cross-check tests for commonly used patterns to avoid regressions.
- Add property access tests and method access tests to ensure both are handled gracefully during the migration window.
- Use codemods (scripted replacements) with a conservative rewrite pattern: first detect nodes, then propose code changes.

Rollback & Validation
- Keep a branch with old behavior intact while merging new on a `feature/data-model-modernization` branch.
- Use test coverage reports to ensure all changed lines are validated.

Timeline & Scope
- Incremental; start with `Data_Value` and `Data_Object`, then upgrade Collection and helpers.
- Target a small release: export both modules for one minor version that transitions consumers.
