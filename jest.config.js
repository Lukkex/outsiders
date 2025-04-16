// jest.config.js
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
  };  