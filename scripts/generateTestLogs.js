const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '..', 'tests', 'testLogs', 'jest-results.json');
const outputPath = path.join(__dirname, '..', 'tests', 'testLogs', 'jest-output.txt');

try {
  const data = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));

  const output = data.testResults
    .map(suite => {
      const suiteName = path.basename(suite.name);
      const testResults = suite.assertionResults
        .map(test => {
          const status = test.status.toUpperCase(); 
          return `  ${status} - ${test.title}`;
        })
        .join('\n');

      return `Test File: ${suiteName}\n${testResults}\n`;
    })
    .join('\n');

  const summary = `Test Suites: ${data.numPassedTestSuites} passed, ${data.numTotalTestSuites} total\n` +
                  `Tests:       ${data.numPassedTests} passed, ${data.numTotalTests} total\n` +
                  `Snapshots:   ${data.snapshot.total} total\n` +
                  `Time:        ${data.startTime ? new Date(data.startTime).toLocaleTimeString() : ''}`;

  fs.writeFileSync(outputPath, `${output}\n${summary}\n`);
  console.log('Clean test log written to tests/testLogs/jest-output.txt');
} catch (err) {
  console.error('Failed to generate test log:', err.message);
}

//npm run test
