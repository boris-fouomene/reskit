module.exports = {
  testEnvironment: 'node',
  // Point Jest to look in the dist directory
  roots: ['<rootDir>/dist'],
  // Tell Jest to process .js files
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  // Optional: if you need to map module paths
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/dist/$1'
  }
}