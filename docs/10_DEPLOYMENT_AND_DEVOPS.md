# Deployment and DevOps

## Publishing
1.  **Bump Version**: `npm version patch|minor|major`.
2.  **Push Tags**: `git push --follow-tags`.
3.  **Publish**: `npm publish`.

## CI/CD
- **Provider**: GitHub Actions.
- **Triggers**: Push to `main`, Pull Requests.
- **Jobs**: Lint, Test, Build (if applicable).

## Secrets
- `NPM_TOKEN`: Required for publishing (handled by maintainers).
