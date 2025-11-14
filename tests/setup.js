/**
 * Global test setup for Vitest
 * 
 * This file runs before all tests and sets up:
 * - Mock service worker for API mocking
 * - Test utilities
 * - Global test configuration
 */

import { beforeAll, afterEach, afterAll } from 'vitest';

// Setup runs before all tests
beforeAll(() => {
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.WINDMILL_BASE_URL = 'http://localhost:8000';
  process.env.WINDMILL_API_TOKEN = 'test-token';
});

// Clean up after each test
afterEach(() => {
  // Clear any test-specific state
});

// Clean up after all tests
afterAll(() => {
  // Final cleanup
});
