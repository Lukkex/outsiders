module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'jsx'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy', //ignore CSS files
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  reporters: ['default']
};
