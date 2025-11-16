const fs = require('fs');
const file = process.argv[2];
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const verbose = process.argv.includes('--verbose');
for (const suite of data.testResults) {
  if (suite.status === 'failed') {
    console.log('SUITE', suite.name);
    for (const assertion of suite.assertionResults) {
      if (assertion.status === 'failed') {
        console.log('  FAIL', assertion.fullName);
        if (verbose && assertion.failureMessages && assertion.failureMessages.length) {
          console.log(assertion.failureMessages[0]);
        }
      }
    }
  }
}
