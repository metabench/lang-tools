Status: WIP
Last-Updated: 2025-11-15
Owner: @unassigned

# Agent PR Template (short, focused)
Use this skeleton for PRs created by AI agents to make sure reviewers have the context they need.

Title: Fix <BUG001> — short description (or feature: short description)

Summary
- One or two sentence summary of the change and why it matters.

Files changed
- List of files touched with short reason for each.

Testing
- List-first commands + execution runs (e.g., `npx jest --runTestsByPath test/data_value.test.js --listTests`, then `npm test` or `npx jest --runInBand --runTestsByPath ...`)
- What passed / what failed before and after

Documentation updates
- List of docs updated: `README.md`, `BUGS.md`, `.github/*`, `docs/*`.

Backward compatibility
- Short note on whether this is a breaking change and suggested migration steps.

Open questions
- Any uncertainties or items needing maintainer review.

Checklist
- [ ] Tests added/updated for the change
- [ ] `BUGS.md` updated (if bug fix)
- [ ] `docs` updated where behavior changed
- [ ] Example scripts updated (if relevant)
