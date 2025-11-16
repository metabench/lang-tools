# lang-tools Agent Documentation Playbook

Fast on-ramp (first 5 minutes)
- Read `README.md` for overall intent and `lang.js` for exported modules.
- Search for active bug IDs: `grep -r "<BUG" .` and open `BUGS.md`.
- Run a smoke test by dry-running first: `npx jest --runTestsByPath test/data_value.test.js --listTests` (or `npm run test:list -- test/data_value.test.js`). After confirming the single file is selected, run `npx jest --runInBand --runTestsByPath test/data_value.test.js` only if you need the live output.
 - Use `docs/templates/agent-pr-template.md` as the PR skeleton for agent-created PRs.
 - For Data_Model modernization, see `docs/workflows/migrate-to-modern-data-model.md` for an explicit migration workflow.

This guide expands on `.github/AGENTS.md` with actionable instructions for keeping project knowledge current. Use it whenever you add features, investigate bugs, or refine workflows.

## 1. Documenting Library Content

- **Coverage expectations**: Every significant module (e.g., `Data_Model/new/*`, `collective.js`, `util.js`, `b-plus-tree/`) must have a short explainer, current invariants, and cross-links to public APIs in `lang.js`. Prefer concise markdown tables or callout lists over prose.
- **Focus areas**:
  - *Architecture*: Describe how classes chain together (Evented_Class → Data_Model → concrete types) and highlight legacy vs. new implementations.
  - *Behavioral contracts*: Capture sync rules, event payload shapes, validation paths, and immutability guarantees. Note any `<BUG###>` references that affect behavior.
  - *Usage samples*: Include copy-pastable snippets illustrating real entry points (examples can come from `examples/` or tests) and keep them in sync with API changes.
- **Doc gating checklist** (run before finishing a feature):
  1. Identify which files changed behavior.
  2. Update or create the corresponding markdown in `docs/content/`.
  3. Record open questions or TODOs in the `Status` table (see Section 4).

## 2. Workflow & Process Documentation

- **Standard workflows** belong under `docs/workflows/` with one file per topic:
  - `tests.md`: document the list-first flow (`npx jest --listTests`, `npx jest --runTestsByPath ... --listTests`), then the matching execution commands plus the legacy `node test/test-all.js` harness.
  - `bug-triage.md`: summarize the `<BUG###>/<TEST###>` search process, referencing `.github/AGENTS.md` for the remediation checklist.
  - `release.md`: steps for tagging, updating `package.json`, running coverage, and syncing with downstream projects (e.g., jsgui).
- **Process write-ups** must list inputs, tooling commands, reviewers, and artifacts produced. End each doc with a "Verification" section (tests, scripts, manual QA) so future agents can rerun the exact steps.

## 3. `/docs` Directory Expectations

Create a top-level `docs/` folder with at least these subdirectories:

```
docs/
  content/        # Module- and feature-level references
  workflows/      # Repeatable procedures (tests, releases, triage)
  status/         # Work tracking snapshots
  templates/      # Reusable checklists or doc skeletons
```

- Keep filenames kebab-cased (e.g., `data-value.md`, `collection-reactivity.md`).
- Each markdown file should start with a short metadata block:
  ```
  Status: WIP|Completed|Planned
  Last-Updated: 2025-11-15
  Owner: @github-handle (or "unassigned")
  ```
  This makes it trivial to script audits across docs.

## 4. Tracking Work In Progress vs. Future Plans

- Maintain `docs/status/roadmap.md` with three sections: `## Work In Progress`, `## Completed`, `## Planned`. List items as tables containing `Item`, `Docs`, `Owner`, `Next Checkpoint`.
- Whenever code work starts, add an entry beneath `Work In Progress` linking to the relevant doc(s) and bug IDs. Move the entry to `Completed` once merged and reference the commit hash or PR.
- For backlog ideas, stash the context under `Planned` with a brief scope statement, blockers, and the doc(s) that will need updates when work begins.
- Encourage granular tracking: a doc can appear in multiple sections if different subsections are at different stages; note that nuance inline.

## 5. Updating Docs Alongside Code

1. **Plan**: During issue grooming, decide which `docs/*` files will need edits. Add TODO bullets directly in those files under a `### Pending Updates` heading.
2. **Implement**: As you code, keep the doc changes on the same branch. Short code comments should reference the doc section that explains the behavior.
3. **Verify**: Before opening a PR, capture the `--listTests` output for each suite you plan to run, then execute `npm test` or `npx jest --runInBand --runTestsByPath ...` as needed. Record both the list commands and execution results inside the affected workflow doc.
4. **Review checklist** (include in PR descriptions):
   - `[ ]` Docs in `/docs` updated or confirmed accurate
   - `[ ]` Status tables reflect WIP/completed/planned accurately
   - `[ ]` `.github/AGENTS.md` referenced if bug workflow changed
5. **After merge**: Update `Last-Updated` metadata, move entries between status sections, and archive obsolete instructions into `docs/status/history.md` with a short rationale.

## 6. Recommended Templates

Store reusable scaffolding in `docs/templates/`:

- `module-doc-template.md`: headings for Overview, Dependencies, Events, Validation, Examples, Status.
- `workflow-template.md`: headings for Purpose, Prereqs, Steps, Verification, Rollback.
- `status-entry.md`: table snippet for Work In Progress tracking.

Agents should copy these templates instead of freestyle writing to keep documentation uniform and script-friendly.

---

When in doubt, ask: "Can the next agent reproduce my context without pinging me?" If the answer is no, add the missing pieces to `/docs` and update the status tables accordingly.