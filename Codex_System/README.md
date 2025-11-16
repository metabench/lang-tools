# Codex System Notes

Use this directory to coordinate automation around the Codex system—scheduler scripts, integration tests, or documentation that explains how Copilot-style agents should interact with lang-tools services.

Guidelines for future agents:

1. Mirror the architectural boundaries described in `.github/copilot-instructions.md`; anything you stage here should align with the reactive data-model stack (Evented_Class → Data_Model → concrete types).
2. Capture operational workflows in `/docs/workflows/` and link to them from files in this folder. A Codex routine without matching documentation is considered incomplete.
3. When you add orchestration or deployment artifacts, include a `Verification` section that records the dry-run guard (`npx jest --... --listTests` or `node scripts/capture-list-tests.js ...`) and the matching execution command (`npm test`, `npx jest --runInBand --runTestsByPath ...`, `node examples/ex_data_value.js`).
4. Keep a running change log inside `/docs/status/roadmap.md` referencing Codex entries so other Copilot agents can see what is in progress, finished, or planned.

Treat this space as the control center for agent automation. If instructions originate elsewhere—especially the Copilot-specific guidance—cross-link back so successors always know the canonical source.