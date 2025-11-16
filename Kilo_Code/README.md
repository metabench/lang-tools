# Kilo Code Workspace

This directory is reserved for Kilo Code experiments, prototypes, and helper scripts that extend lang-tools without immediately touching production modules.

- Keep new work organized in subfolders (e.g., `pipelines/`, `analysis/`, `spikes/`) so future agents can navigate quickly.
- Document every meaningful artifact with short markdown notes describing its purpose, dependencies, and relationship to the main library.
- Reference `.github/copilot-instructions.md` when adopting project conventions—those guidelines explain architecture, testing workflows, and bug-tracking rules that also apply here.
- If a Kilo Code experiment graduates into the core library, capture the migration steps inside `/docs/status/roadmap.md` and link back to the originating files in this folder for traceability.

Future Copilot agents should treat this space as a staging area: iterate freely, but keep metadata tidy so downstream contributors can understand what was attempted and why.