module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['./build/tests/**/*.js'],
  moduleDirectories: ['node_modules', 'build'],
  moduleFileExtensions: ['js', 'json'],
  rootDir: './',
};
  