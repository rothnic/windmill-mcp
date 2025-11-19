/**
 * Global test setup for Vitest
 *
 * This file runs before all tests and sets up:
 * - Environment variables from .env file
 * - Mock service worker for API mocking
 * - Test utilities
 * - Global test configuration
 */

import { beforeAll, afterEach, afterAll } from "vitest";
import dotenv from "dotenv";

// Load .env file before all tests
dotenv.config();

// Setup runs before all tests
beforeAll(() => {
  // Set test environment variables (use defaults if .env not loaded)
  process.env.NODE_ENV = "test";

  // Only set defaults if environment variables are not already set
  // These defaults match the Docker dev setup (npm run docker:dev)
  if (!process.env.WINDMILL_BASE_URL && !process.env.E2E_WINDMILL_URL) {
    process.env.WINDMILL_BASE_URL = "http://localhost:8000";
  }
  if (!process.env.WINDMILL_API_TOKEN && !process.env.E2E_WINDMILL_TOKEN) {
    // Use superadmin secret from Docker setup for local testing
    process.env.WINDMILL_API_TOKEN = "test-super-secret";
  }
  if (!process.env.E2E_WORKSPACE) {
    // Default workspace created by Windmill
    process.env.E2E_WORKSPACE = "admins";
  }
});

// Clean up after each test
afterEach(() => {
  // Clear any test-specific state
});

// Clean up after all tests
afterAll(() => {
  // Final cleanup
});
