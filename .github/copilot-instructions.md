# lang-tools AI Agent Guide — Quick Reference

Scope & Architecture
- lang-tools extends `lang-mini` with reactive data models, collections, and utilities. The main entrypoint is `lang.js` (re-exports modules onto a `lang-mini` object).
- Core split: `Data_Model/new` (active, typed values + immutable variants) vs `Data_Model/old` (legacy `Data_Object`/`Collection`). Root `Data_Model/*.js` are thin wrappers—edit `new/` or `old/` directly.
- Main contracts: `Evented_Class`-driven reactivity, `Functional_Data_Type` validation, `Mini_Context` for IDs, `Immutable_*` snapshots for freeze-safe state sharing.

Key Repo Patterns
- Data_Value vs Collection: `Data_Value` uses `.value` (getter/setter) while legacy `Collection` exposes `.value()` method. Check types with `tof()` (from `lang-mini`) before accessing.
- Syncing: `Data_Value.sync(a,b)` (see `Data_Model/new/Data_Value.js`) wires bidirectional change listeners. Avoid redundant set loops by using `more_general_equals` to guard assignments.
	Example: 
	```js
	const dv1 = new Data_Value(10);
	const dv2 = new Data_Value(20);
	Data_Value.sync(dv1, dv2); // bidirectional syncing: changing dv1.value updates dv2.value
	```
- Utilities: `collective.js` is a Proxy-based batch API for arrays; use it for read-only batch calls, not reactive updates.
	Example: `collective([{value: 1}, {value: 2}]).value // [1, 2]`
- Immutables: `toImmutable()` returns deep-frozen wrappers (see `Immutable_Data_Value.js`). Treat immutable objects as readonly—do not attempt to mutate nested contents.

Developer Workflows
- Testing: Dry-run first with `npx jest --runInBand --listTests` (entire suite) or `npx jest --runTestsByPath <file> --listTests` (focused) before executing. The shortcut `npm run test:list -- <files>` wraps these guards. After confirming selection, run `npm test` (Jest) or `npm run test:careful -- <files>` / `npx jest --runInBand --runTestsByPath <file>`. Coverage: `npm run test:coverage`. Legacy node tests: `npm run test:legacy`. Avoid `npm run test:watch` while acting as an agent because it never exits automatically.
- Examples: run `node examples/ex_data_value.js` or `node examples/ex_collection.js` to verify golden behaviors quickly.
- Local edits: use `npx jest --runTestsByPath test/data_value.test.js --listTests` to confirm the file, then (if needed) run `npx jest --runInBand --runTestsByPath test/data_value.test.js` or combine with `-t` filters.

Bug and PR Guidance
- Always search BUGS.md for `<BUG###>` references, then find the `// TODO <BUG###>` lines in code. Update `BUGS.md` when closing a bug, and remove or update the TODO comment.
- Common fix checklist: implement code fix, add/adjust tests, update docs (README/AGENTS/BUGS), run full tests, and include a clear commit message linking the bug ID.

Developer Conventions & Gotchas
- Style: tabs, snake_case, sparse semicolons. Follow existing patterns; don't reformat large files in a single change.
- Type checks: prefer `tof()` for polymorphic type checks. Avoid fragile `typeof` checks for Data_Model classes.
- Event/ID contexts: Many constructors accept `{context: new Mini_Context()}`—lack of context causes `_id()` errors.
- Watch out: mixing `.value` vs `.value()` is a common bug; confirm whether you are dealing with legacy `Collection` or `Data_Value`.

Integration Points & Dependencies
- External: `lang-mini` and `fnl` are the primary runtime deps; keep dependency additions minimal to avoid downstream bundler issues.
- Exports: `lang.js` wires exports into a `lang-mini` object; changing public APIs will affect `jsgui` or other downstream consumers.

Considerations for lang-mini
- This package is built on `lang-mini` and often implements higher-level or application-focused features that could belong in the platform layer. Before implementing a new core or cross-cutting feature inside `lang-tools`, consider whether it should live in `lang-mini` instead. Moving it upstream reduces duplication, improves platform consistency, and benefits all consumers.
- Candidate features for `lang-mini`:
	- Core evented utilities like `Evented_Class` extensions or patterns
	- Validation primitives and improvements to `Functional_Data_Type`
	- Polymorphic helpers (e.g., `more_general_equals`) that are generic
	- Proxy-based helpers that should be platform-provided for broader reuse
- If you think a feature belongs in `lang-mini`, prepare a cross-repo proposal (see `.github/lang-mini-proposal.md`) describing migration and API compatibility steps.
	See also the step-by-step migration guide in `docs/workflows/lang-mini-proposals.md` for concrete steps and example code for cross-repo proposals.

Testing & Debugging
- Jest setup: `test/setup.js` adds custom matchers (e.g., `toBeDataValue`, `toBeImmutable`). Read it for testing primitives.
- Legacy: Node/test harness under `test/test-all.js` references older `test_*.js` files—use `npm run test:legacy` when working with legacy tests.
- For debugging, add small reproducible examples into `examples/` and run them directly.

Quick References
- Edit typed values: `Data_Model/new/*` (e.g., `Data_Value.js`, `Data_Integer.js`)
- Edit collections: `Data_Model/old/Collection.js`
- Helpers/utilities: `collective.js`, `util.js`, `b-plus-tree/*`
- Tests: `test/*` (Jest), `test_*.js` (legacy node)
- Bug list: `BUGS.md` (search for `<BUG###>`)

- Migration plan: `docs/workflows/migrate-to-modern-data-model.md` — step-by-step guide for modernizing Data_Model and retiring old/ implementations
- Bug Fix Playbook: `docs/workflows/bug-fix-playbook.md` — step-by-step bug fixes and agent checklists for critical/priority bugs

Fast on-ramp
- `docs/agent-on-ramp.md` — step-by-step notes for the first 10/60 minutes
- Agent PR Template: `docs/templates/agent-pr-template.md`
- Migration proposals for `lang-mini`: `docs/workflows/lang-mini-proposals.md` and `.github/lang-mini-proposal.md`
If something's unclear or a behavioral test fails, open a PR describing the change, link BUGS.md entries where applicable, and request a review from the maintainers.

- Before opening a PR
- Capture the list-first commands for the suites you touched (`npx jest --runInBand --listTests`, targeted `--runTestsByPath`), then run `npm test` / focused executions
- Run `npm run test:coverage` when changing public API or behavior
- Update `BUGS.md` and `docs/`/`README.md` if you change behavior
- Add or update unit tests for your fix/feature
- Mention any breaking API changes and coordinate with downstream consumers (e.g., `jsgui`)
