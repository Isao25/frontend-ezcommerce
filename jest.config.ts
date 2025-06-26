import type { Config } from 'jest';

const config: Config = {
  rootDir: './',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.ts'],
  
  // Configuración de globals para ts-jest e import.meta
  globals: {
    'ts-jest': {
      useESM: true,
      tsconfig: {
        jsx: 'react-jsx'
      }
    },
    // Mock de import.meta
    'import.meta': {
      env: {
        VITE_BASE_URL: 'http://localhost:8000',
        VITE_API_KEY: 'test-api-key',
        VITE_AUTH_DOMAIN: 'test-domain',
        VITE_PROJECT_ID: 'test-project',
        VITE_STORAGE_BUCKET: 'test-bucket',
        VITE_MESSAGING_SENDER_ID: 'test-sender',
        VITE_APP_ID: 'test-app-id'
      }
    }
  },
  
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      useESM: true
    }],
  },
  
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  preset: 'ts-jest/presets/default-esm',
  
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/tests/mocks/fileMock.js',
    // Agregar mapper para archivos CSS/SCSS
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  
  // Transform ignore patterns para node_modules
  transformIgnorePatterns: [
    'node_modules/(?!(.*\\.mjs$|@testing-library|@radix-ui|lucide-react))'
  ],
  
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
    '!src/pages/Epica@(0[1-8])/**',
    '!src/utils/@(test-utils|constants|helpers).{ts,tsx}',
    'src/components/layouts/Footer.tsx',
    'src/components/layouts/MenuAccount.tsx'
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
    '/src/assets/',
    '/src/mocks/',
    '\\.d\\.ts$',
  ],

  testMatch: [
    '<rootDir>/tests/**/*.{test,spec}.{ts,tsx,js,jsx}',
    '<rootDir>/src/**/*.{test,spec}.{ts,tsx,js,jsx}',
  ],
};

export default config;
