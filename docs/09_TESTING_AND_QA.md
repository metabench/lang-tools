# Testing and QA

## Strategy
- **Unit Tests**: Jest is the primary runner.
- **Legacy Tests**: Node.js `test` runner for older suites (`test/test-all.js`).
- **List-First**: Always verify test selection with `--listTests` before execution.

## Coverage Expectations
- Core classes (`Data_Value`, `Collection`) must have >90% coverage.
- Utilities (`collective`, `util`) must have >80% coverage.

## Manual QA
- Run `examples/*.js` scripts to verify end-to-end behavior.
- Check `BUGS.md` for known regressions.

## CI Pipeline
- GitHub Actions runs `npm test` on push.
