module.exports = {
  displayName: 'app',
  preset: 'jest-preset-angular',
  testEnvironment: 'jsdom',
  coveragePathIgnorePatterns: [
    'node_modules',
    'setup-jest.ts',
    '.module.ts',
    '.index.ts',
    'enums/',
    'interfaces/',
    '<rootDir>/src/main.ts',
    '.service.ts',
    '.config.ts',
    '.html',
    '.js',
    '<rootDir>/dist/',
  ]
};
