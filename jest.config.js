module.exports = {
  resetMocks: true,
  collectCoverage: false,
  collectCoverageFrom: ['**/src/**/*.js'],
  coveragePathIgnorePatterns: ['/mocks/'],
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    '/.serverless/',
    '/.webpack/',
    '/node_modules/',
    '/build/',
    '/mocks/',
  ],
  testMatch: ['**/**/*.test.js'],
  roots: ['<rootDir>']
};
