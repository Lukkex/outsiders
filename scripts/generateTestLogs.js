const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

//create logs directory if it doesn't exist
const logsDir = path.resolve(__dirname, '../tests/testLogs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

//get current date/time for filename
const now = new Date();
const pad = (n) => n.toString().padStart(2, '0');
const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}`;
const logFileName = `jest-results-${timestamp}.txt`;
const logFilePath = path.join(logsDir, logFileName);

//run Jest and write output to file
const jestCommand = `npx jest > "${logFilePath}" 2>&1`;

console.log(`Running tests and saving output to: ${logFilePath}`);

exec(jestCommand, (error, stdout, stderr) => {
  if (error) {
    console.error(`Test run failed. Check the log at ${logFilePath}`);
    return;
  }

  console.log(`Test log saved to: ${logFilePath}`);
});
