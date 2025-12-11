# Build Instructions (Local IDE)

## Prerequisites
- Node.js >= 12.0.0
- npm

## Setup
```bash
git clone https://github.com/metabench/lang-tools.git
cd lang-tools
npm install
```

## Development Commands
- **Run Tests**: `npm test`
- **Run Focused Test**: `npm run test:careful -- test/data_value.test.js`
- **List Tests (Dry Run)**: `npm run test:list`
- **Coverage**: `npm run test:coverage`
- **Legacy Tests**: `npm run test:legacy`

## Environment Variables
- `RUN_LEGACY_TESTS=1`: Enable execution of `test/old_*.test.js` suites.
