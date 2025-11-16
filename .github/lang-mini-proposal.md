## lang-mini proposal template — Use this when considering moving features upstream

Purpose
- Help maintainers and agents propose higher-level features currently implemented in `lang-tools` that may be better placed in `lang-mini`.
- Provide a reproducible template to evaluate, draft, and submit a cross-repo change.

When to consider moving code to `lang-mini`
- The feature is platform-generic (not specific to `lang-tools`'s domain).
- It enables other projects (e.g., `jsgui`, apps) to be simpler or smaller by using a new primitive.
- It provides a general-purpose utility (e.g., comparison helpers, event patterns, `collective`-like Proxy utilities) that is reusable outside of `lang-tools`.
- The change requires API-level consideration across consumers (backwards compatibility matters).

Decision Criteria
- Generic: If the API/behavior provides value outside `lang-tools` and is not tied to `lang-tools`-specific types or invariants.
- Minimal Surface Area: The feature can be implemented in a backward-compatible manner and decoupled from `lang-tools` internals.
- Tests: You can provide unit tests for the feature in `lang-mini` that mirror behavior in `lang-tools` tests.
- Docs/Examples: The feature has example usage demonstrating benefit in at least two different consumer repos.

Template for a lang-mini proposal
1. Title: Short summary with context (e.g., "Add generic `more_general_equals` helper to `lang-mini`").
2. Motivation: Why does this belong in `lang-mini`? Mention affected repos and high-level benefits.
3. Behavior & API: Provide a clear API signature, sample usage and edge case behavior (including how it should behave with `Data_Value`/`Collection` vs primitive types).
4. Backwards Compatibility Plan: If the feature removes or modifies existing behavior in `lang-tools`, explain how consumers will migrate. Provide deprecation plan where necessary.
5. Tests & Coverage: Provide a list of new tests to add to `lang-mini` tests that validate the behaviors and edge cases covered by `lang-tools` tests.
6. Implementation Outline: Small steps for implementing the API; where to add tests; any changes required in `lang-tools` (e.g., removing local implementation and referencing `lang-mini`).
7. Performance & Stability Notes: If relevant, call out performance trade-offs, and how to keep behavior consistent across Node/browser builds.
8. Rollout / Migration: How to update `lang-tools` to use the new `lang-mini` feature, remove duplicate code, and update docs.

Example: `more_general_equals`
- Title: Promote `more_general_equals` to `lang-mini` as `equals` helper.
- Motivation: `more_general_equals` is used across `lang-tools` for value comparison, and other packages that rely on `lang-mini` will benefit from a standard implementation. Consistency reduces bugs due to duplicate logic.
- API: `lang-mini.equals(a, b)` -> boolean. Should handle `Data_Value`, `Collection`, primitives, arrays, objects and deep checks where appropriate.
- Backwards Compatibility: Keep old helper under the same name in `lang-tools` with a wrapper until dependent projects update. Add tests and deprecate after a release.
- Tests: Mirror `test/util.test.js` and `test/data_value.test.js` cases relevant to equality.
- Implementation: Add `equals` to `lang-mini` exports, implement tests, update `lang-tools` to `require('lang-mini').equals = alias` (already done in `lang.js`, confirm), then remove `more_general_equals` duplication.

Presenting to the agent in `lang-mini`
- Provide: Proposal file above; relevant `lang-tools` tests and code examples; a summary of expected API; and a migration plan.
- Use the PR template: short title, summary, reasoning, tests added, and a migration checklist for consumers.

Checklist before proposing
- Confirm the API is not `lang-tools`-specific.
- Add failing/green tests in `lang-mini` repo demonstrating the API.
- Create a migration plan for `lang-tools` with tests changed to use the new API.
- If backward-incompatible, propose a deprecation timeline and helpers to ease migration.

Contact
- If unsure, add a note to the proposal and ask the `lang-mini` reviewers to weigh in on migration or API design.
