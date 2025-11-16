Status: WIP
Last-Updated: 2025-11-15
Owner: @unassigned

# Agent On-Ramp — First steps for AI agents

This file provides a concise checklist for new AI agents to quickly become productive in `lang-tools`.

First 10 minutes (quick scan)
- Read `README.md` to get a sense of purpose and exported API.
- Open `lang.js`, `Data_Model/new/Data_Value.js`, and `Data_Model/old/Collection.js` to understand the new/old split and public exports.
- Search for `<BUG###>` in `BUGS.md` and TODO comments to find active, tracked issues.
Run a smoke test:
```bash
# Dry-run a focused suite (no execution)
npx jest --runTestsByPath test/data_value.test.js --listTests
npm run test:list -- test/data_value.test.js

# Optional: run the same suite once verified
npx jest --runInBand --runTestsByPath test/data_value.test.js
npm run test:careful -- test/data_value.test.js

node examples/ex_data_value.js
node examples/ex_collection.js
```

Install / setup quick steps
- Ensure dependencies are installed locally:
```bash
npm install
```
- Node: `node --version` should be >= 12.0.0 (see `package.json` engines)

First hour (familiarization)
- For any area you intend to edit, first run `npx jest --runTestsByPath <file> --listTests` (or `npm run test:list -- <file>`), then (if needed) execute `npx jest --runInBand --runTestsByPath <file>` or `npm run test:careful -- <file>`.
- Legacy Jest suites (`test/old_*.test.js`) are skipped by default. Set `RUN_LEGACY_TESTS=1` for commands that should include them.
- Read `test/setup.js` to learn about custom Jest matchers (`toBeDataValue`, `toBeImmutable`).
- Check `docs/workflows/lang-mini-proposals.md` if you plan to move features to `lang-mini`.
- Use `grep -r "<BUG" .` and `grep -r "TODO <BUG" .` to find all active bug markers.

Key files and what they show
- `lang.js`: Main entrypoint; confirms what the package exports and how `lang-mini` is used.
- `Data_Model/new/*`: Current implementations of typed values and immutables.
- `Data_Model/old/*`: Legacy objects/collections that still feed into root exports.
- `collective.js`: Proxy-based batch API; useful for in-place array operations.
- `util.js`: Vector math and small helpers used across the repo.
- `test/*`: Jest tests; the tests are the most reliable source of intended behavior.
- `BUGS.md`: Central bug registry and proposed fixes.

Known gotchas to scan for
- `.value` vs `.value()` - legacy vs new models
- Uses of `Mini_Context`; not providing context often leads to missing IDs and failing code paths
- Watch `throw 'NYI';` and `throw 'stop'` as deliberate or placeholder errors

Quick PR checklist
- Capture list-first output (`npx jest --runInBand --listTests`, targeted `--runTestsByPath`) and only then run the matching commands (`npm test`, `npm run test:coverage`).
- Update `BUGS.md` with bug status changes when you fix an issue.
- Double-check `AGENTS.md` and `.github/copilot-instructions.md` for accuracy if you add or change features that affect agent behavior.

If you're migrating a feature to `lang-mini`
- See `docs/workflows/lang-mini-proposals.md` for step-by-step guidance.

Need more context?
- Ask the maintainer in a PR comment and include a brief summary of the files you inspected, tests you ran, and whether you propose a `lang-mini` migration.
