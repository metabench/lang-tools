# Phase Y: Jest Runner & Docs Audit Tasks

## Task Y.1: inventory_jest_configs
- Status: completed (2025-11-15)
- Priority: 1
- Changes: list configs, projects, roots; emit resolved configs
- Files: jest.config.* in repo, package.json "jest" fields
- Outputs: docs/docs/reports/jest/resolved_config.default.json
- Notes: Single root config in `jest.config.js`; no `projects` array defined, so default project only. `testMatch` limited to `test/**/*.test|spec.js`, `setupFilesAfterEnv` is `test/setup.js`, `verbose` true, `testTimeout` 10000.

## Task Y.2: list_tests_static
- Status: completed (2025-11-15)
- Priority: 1
- Changes: build commands for `--listTests` variants; capture output
- Outputs: docs/docs/reports/jest/list_tests/test.global.json, test.default.runInBand.json, test.coverage.json, test.data_value.json
- Notes: Added `scripts/capture-list-tests.js` helper to wrap `npx jest` and persist JSON payload `{command, tests}` for each scenario. Verified that combining `--json` with `--listTests` yields no output (document as pitfall later).

## Task Y.3: audit_docs_commands
- Status: completed (2025-11-15)
- Priority: 1
- Changes: scan `/docs`, README, wiki for Jest commands; flag footguns; propose replacements
- Outputs: README testing section rewritten with list-first guard; `.github/AGENTS.md`, `AGENTS.md`, `.github/copilot-instructions.md`, `docs/workflows/bug-fix-playbook.md`, `docs/agent-on-ramp.md`, `docs/workflows/lang-mini-proposals.md`, `docs/templates/agent-pr-template.md`, `docs/content/data-model-differences.md`, `Codex_System/README.md` updated to require `--listTests` before execution.
- Notes: Removed watch-mode recommendations for agents, introduced `scripts/capture-list-tests.js` references, and aligned contribution checklist with dry-run evidence requirements.

## Task Y.4: add_careful_runner
- Status: completed (2025-11-15)
- Priority: 2
- Changes: add `scripts/jest_careful_runner.mjs` and `jest.careful.config.js`; wire npm scripts
- Outputs: `scripts/jest_careful_runner.mjs`, `jest.careful.config.js`, new npm scripts (`test:list`, `test:careful`, updated `test:data_value`), README/AGENTS/docs updates referencing the runner.
- Notes: Runner defaults to list-only, auto-applies `--runTestsByPath` when paths end with `.test|spec.*`, and shares the `jest.careful.config.js` overrides (`bail=1`, `maxWorkers=50%`).

## Task Y.5: projects_precision
- Status: not-started
- Priority: 2
- Changes: ensure `projects` config (monorepo); add `--selectProjects` examples; per-project scripts

## Task Y.6: pitfalls_guide
- Status: not-started
- Priority: 2
- Changes: author `/docs/tests/JEST_PITFALLS.md` with remedies & examples

## Task Y.7: focused_runs_guide
- Status: not-started
- Priority: 2
- Changes: author `/docs/tests/FOCUSED_TESTS.md` with canonical commands & anti-examples
