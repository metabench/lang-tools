Status: WIP
Last-Updated: 2026-01-05
Owner: @unassigned

# Agent Change Log

## 2026-01-05

### Summary
- Added data-only path utilities (`normalize_path`, `path_get`, `path_set`).
- Added dependency tracking helper (`create_dependency_graph`).
- Added watcher cleanup helper (`create_watch_list`).
- Documented new utilities and updated roadmap tracking.

### Rationale
- These helpers are needed for MVVM and computed utilities in higher layers (e.g., jsgui3-html), but they are UI-agnostic and reusable, so they belong in lang-tools.

### Code Changes
- `util.js`: added new helper implementations and exported them via `util`.
- `test/util.test.js`: added coverage for path helpers, dependency graph behavior, and watch list cleanup.

### Documentation
- Added `docs/content/path-and-dependency-helpers.md` with API details, usage examples, and pending improvements.
- Added `docs/status/roadmap.md` to track WIP/completed/planned work.

### Tests
- Attempted: `./node_modules/.bin/jest --runTestsByPath test/util.test.js`
- Result: failed because Jest resolved `<rootDir>` to `/mnt/c/Users/james/Documents/repos/lang-tools` and could not find `test/setup.js` at that location.

### Follow-ups
- Consider strict/path error modes for `path_set`.
- Evaluate support for custom builders (e.g., Data_Object integration).
