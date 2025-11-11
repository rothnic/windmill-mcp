import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Test environment
    environment: 'node',
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.test.js',
        '**/*.spec.js',
        'generator/cache/',
        'generator/temp/',
      ],
    },
    
    // Test file patterns
    include: ['tests/**/*.test.js', 'tests/**/*.spec.js'],
    
    // Setup files
    setupFiles: ['./tests/setup.js'],
    
    // Test timeout
    testTimeout: 30000,
    
    // Globals (optional, for Jest-like API)
    globals: true,
    
    // Watch mode options
    watch: false,
    
    // Reporters
    reporters: ['verbose'],
    
    // Separate configurations by test type
    workspace: [
      {
        test: {
          name: 'unit',
          include: ['tests/unit/**/*.test.js'],
          environment: 'node',
        },
      },
      {
        test: {
          name: 'integration',
          include: ['tests/integration/**/*.test.js'],
          environment: 'node',
        },
      },
      {
        test: {
          name: 'e2e',
          include: ['tests/e2e/**/*.test.js'],
          environment: 'node',
          testTimeout: 60000,
        },
      },
    ],
  },
});
