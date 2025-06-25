import type { Config } from 'jest';

const config: Config = {
  rootDir:'./',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.ts'],
  transform: {
      '^.+\\.tsx?$': 'ts-jest',
    },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  preset:'ts-jest',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(gif|ttf|eot|svg|png)$':'<rootDir>/tests/mocks/fileMock.js',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx,js,jsx}',
    '!src/EzCommercerApp.tsx',
    '!src/lib/**',
    '!src/mocks/**',
    '!src/services/**',
    '!src/router/**',
    '!src/main.tsx',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/*.spec.{ts,tsx}',
    '!src/**/index.ts',
    '!src/**/index.tsx',
    '!src/components/ui/**',
    '!src/types/**',
    '!src/constants/**',
    '!src/utils/test-utils.{ts,tsx}',
  ],
  
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json'],
  
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/tests/',
    '/coverage/',
    '\\.d\\.ts$',
  ],
  
  testMatch: [
    '<rootDir>/tests/**/*.{test,spec}.{ts,tsx,js,jsx}',
    '<rootDir>/src/**/*.{test,spec}.{ts,tsx,js,jsx}',
  ],
};

export default config;
