module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['./dist/tests/**/*.js'],
  moduleDirectories: ['node_modules', 'dist'],
  moduleFileExtensions: ['js', 'json'],
  rootDir: './',
};
  