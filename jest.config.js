// jest.config.js

//load .env first before any test (if tests ran before the .env is loaded it will causing the region = undefined)
const dotenv = require ("dotenv");
const path = require('path');

dotenv.config({ path: path.resolve('./backend', '.env') });
module.exports = {
    testEnvironment: 'jsdom',
    moduleNameMapper: {
      // Mock CSS imports
      '\\.css$': 'identity-obj-proxy',
    },
    transform: {
      // Use babel-jest for js, jsx
      '^.+\\.[jt]sx?$': 'babel-jest',
    },
    //setupFiles: ['<rootDir>/jest.setup.js'],
  };  