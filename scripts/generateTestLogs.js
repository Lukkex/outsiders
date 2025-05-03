const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '..', 'tests', 'testLogs', 'jest-results.json');
const outputPath = path.join(__dirname, '..', 'tests', 'testLogs', 'jest-output.txt');

try {
  const data = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));

  const output = data.testResults
    .map(suite => {
      const name = path.basename(suite.name);
      const results = suite.assertionResults
        .map(test => `  ${test.status.toUpperCase()} - ${test.title}`)
        .join('\n');
      return `Test File: ${name}\n${results}\n`;
    })
    .join('\n');

  fs.writeFileSync(outputPath, output);
  console.log('Test log written to tests/testLogs/jest-output.txt');
} catch (err) {
  console.error('Failed to generate test log:', err.message);
}
