/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ["**/**/*.test.ts"],
  verbose: true,
  forceExit: true,
  testPathIgnorePatterns: ['db.test.ts', 'user.routes.test.ts', 'department.routes.test.ts']
}; 