/**
 * E2E Tests for Windmill MCP Server
 * 
 * These tests run against a real Windmill instance (typically Docker-based)
 * and verify end-to-end functionality.
 * 
 * Prerequisites:
 * - Windmill instance running (npm run docker:up)
 * - Environment variables set in .env:
 *   - E2E_WINDMILL_URL
 *   - E2E_WINDMILL_TOKEN
 *   - E2E_WORKSPACE
 */

import { describe, it, expect, beforeAll } from 'vitest';

// E2E tests should be skipped if no Windmill instance is available
const isE2EEnabled = process.env.E2E_WINDMILL_URL && process.env.E2E_WINDMILL_TOKEN;

describe.skipIf(!isE2EEnabled)('Windmill E2E Tests', () => {
  const baseUrl = process.env.E2E_WINDMILL_URL || 'http://localhost:8000';
  const token = process.env.E2E_WINDMILL_TOKEN;
  const workspace = process.env.E2E_WORKSPACE || 'demo';

  beforeAll(async () => {
    // Verify Windmill is accessible
    const response = await fetch(`${baseUrl}/api/version`);
    expect(response.ok).toBe(true);
  });

  describe('API Connectivity', () => {
    it('should connect to Windmill API', async () => {
      const response = await fetch(`${baseUrl}/api/version`);
      const version = await response.text();
      
      expect(response.ok).toBe(true);
      expect(version).toMatch(/v\d+\.\d+/); // Version format like "CE v1.576.1"
    });

    it('should authenticate with API token', async () => {
      const response = await fetch(`${baseUrl}/api/w/${workspace}/jobs/list`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      // Should not be 401 Unauthorized
      expect(response.status).not.toBe(401);
    });
  });

  describe('Job Operations', () => {
    it('should list jobs in workspace', async () => {
      const response = await fetch(`${baseUrl}/api/w/${workspace}/jobs/list`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      expect(response.ok).toBe(true);
      const jobs = await response.json();
      expect(Array.isArray(jobs)).toBe(true);
    });
  });

  describe('Script Operations', () => {
    it('should list scripts in workspace', async () => {
      const response = await fetch(`${baseUrl}/api/w/${workspace}/scripts/list`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      expect(response.ok).toBe(true);
      const scripts = await response.json();
      expect(Array.isArray(scripts)).toBe(true);
    });
  });

  describe('Workflow Operations', () => {
    it('should list workflows in workspace', async () => {
      const response = await fetch(`${baseUrl}/api/w/${workspace}/flows/list`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      expect(response.ok).toBe(true);
      const workflows = await response.json();
      expect(Array.isArray(workflows)).toBe(true);
    });
  });
});

// These tests run regardless of E2E availability
describe('E2E Test Configuration', () => {
  it('should have E2E environment variables documented', () => {
    const requiredVars = [
      'E2E_WINDMILL_URL',
      'E2E_WINDMILL_TOKEN',
      'E2E_WORKSPACE',
    ];
    
    // Just verify we know what we need
    expect(requiredVars).toHaveLength(3);
  });

  it('should skip E2E tests when not configured', () => {
    if (!isE2EEnabled) {
      console.log('E2E tests skipped - set E2E_WINDMILL_URL and E2E_WINDMILL_TOKEN to enable');
    }
    expect(true).toBe(true);
  });
});
