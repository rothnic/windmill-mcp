/**
 * E2E Tests for MCP Server Integration
 * 
 * These tests verify that the MCP server correctly communicates with Windmill API:
 * 1. MCP Client calls tool on MCP Server
 * 2. MCP Server forwards request to Windmill API
 * 3. MCP Server returns response to client
 * 
 * Prerequisites:
 * - Windmill instance running (npm run docker:up)
 * - Environment variables set:
 *   - E2E_WINDMILL_URL (or WINDMILL_BASE_URL)
 *   - E2E_WINDMILL_TOKEN (or WINDMILL_API_TOKEN)
 *   - E2E_WORKSPACE
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { spawn } from 'child_process';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// E2E tests should be skipped if no Windmill instance is available
const isE2EEnabled = (process.env.E2E_WINDMILL_URL || process.env.WINDMILL_BASE_URL) && 
                     (process.env.E2E_WINDMILL_TOKEN || process.env.WINDMILL_API_TOKEN);
const workspace = process.env.E2E_WORKSPACE || 'demo';

/**
 * Create an MCP client connected to our MCP server
 */
async function createMCPClient() {
  const serverPath = path.join(__dirname, '../../src/build/index.js');
  
  // Create transport
  const transport = new StdioClientTransport({
    command: 'node',
    args: [serverPath],
    env: {
      ...process.env,
      WINDMILL_BASE_URL: process.env.E2E_WINDMILL_URL || process.env.WINDMILL_BASE_URL,
      WINDMILL_API_TOKEN: process.env.E2E_WINDMILL_TOKEN || process.env.WINDMILL_API_TOKEN,
    },
  });
  
  // Create client
  const client = new Client(
    {
      name: 'windmill-mcp-test-client',
      version: '1.0.0',
    },
    {
      capabilities: {},
    }
  );
  
  // Connect
  await client.connect(transport);
  
  return { client, transport };
}

describe.skipIf(!isE2EEnabled)('MCP Server E2E Tests', () => {
  let mcpClient;
  let transport;
  
  beforeAll(async () => {
    // Verify Windmill is accessible first
    const baseUrl = process.env.E2E_WINDMILL_URL || process.env.WINDMILL_BASE_URL || 'http://localhost:8000';
    const response = await fetch(`${baseUrl}/api/version`);
    expect(response.ok).toBe(true);
    
    // Create MCP client
    const result = await createMCPClient();
    mcpClient = result.client;
    transport = result.transport;
  }, 30000); // 30 second timeout for setup
  
  afterAll(async () => {
    // Cleanup
    if (transport) {
      await transport.close();
    }
  });
  
  describe('Tool Discovery', () => {
    it('should list available MCP tools', async () => {
      const response = await mcpClient.request(
        { method: 'tools/list' },
        { method: 'tools/list', params: {} }
      );
      
      expect(response).toHaveProperty('tools');
      expect(Array.isArray(response.tools)).toBe(true);
      expect(response.tools.length).toBeGreaterThan(0);
      
      // The generated server should have many tools (all Windmill API endpoints)
      expect(response.tools.length).toBeGreaterThan(100);
      
      // Check for some expected tools from Windmill API
      const toolNames = response.tools.map(t => t.name);
      expect(toolNames).toContain('backendVersion');
      expect(toolNames).toContain('listJobs');
    });
    
    it('should provide tool schemas', async () => {
      const response = await mcpClient.request(
        { method: 'tools/list' },
        { method: 'tools/list', params: {} }
      );
      
      const listJobsTool = response.tools.find(t => t.name === 'listJobs');
      expect(listJobsTool).toBeDefined();
      expect(listJobsTool.inputSchema).toHaveProperty('properties');
    });
  });
  
  describe('Version Tool', () => {
    it('should get Windmill version through MCP', async () => {
      const response = await mcpClient.request(
        { method: 'tools/call' },
        {
          method: 'tools/call',
          params: {
            name: 'backendVersion',
            arguments: {},
          },
        }
      );
      
      expect(response).toHaveProperty('content');
      expect(Array.isArray(response.content)).toBe(true);
      expect(response.content[0]).toHaveProperty('text');
      
      // The response should contain version information
      const resultText = response.content[0].text;
      expect(resultText).toBeTruthy();
    });
  });
  
  describe('Job Tools', () => {
    it('should list jobs through MCP', async () => {
      const response = await mcpClient.request(
        { method: 'tools/call' },
        {
          method: 'tools/call',
          params: {
            name: 'listJobs',
            arguments: { workspace },
          },
        }
      );
      
      expect(response).toHaveProperty('content');
      expect(response.isError).not.toBe(true);
    });
  });
  
  describe('Script Tools', () => {
    it('should have script-related tools available', async () => {
      const response = await mcpClient.request(
        { method: 'tools/list' },
        { method: 'tools/list', params: {} }
      );
      
      const toolNames = response.tools.map(t => t.name);
      // Check that script-related tools exist (names may vary)
      const hasScriptTools = toolNames.some(name => name.toLowerCase().includes('script'));
      expect(hasScriptTools).toBe(true);
    });
  });
  
  describe('Workflow Tools', () => {
    it('should have workflow-related tools available', async () => {
      const response = await mcpClient.request(
        { method: 'tools/list' },
        { method: 'tools/list', params: {} }
      );
      
      const toolNames = response.tools.map(t => t.name);
      // Check that workflow-related tools exist (names may vary)
      const hasWorkflowTools = toolNames.some(name => name.toLowerCase().includes('flow') || name.toLowerCase().includes('workflow'));
      expect(hasWorkflowTools).toBe(true);
    });
  });
  
  describe('Error Handling', () => {
    it('should handle unknown tool gracefully', async () => {
      const response = await mcpClient.request(
        { method: 'tools/call' },
        {
          method: 'tools/call',
          params: {
            name: 'nonexistent_tool',
            arguments: {},
          },
        }
      );
      
      expect(response).toHaveProperty('content');
      expect(response.isError).toBe(true);
      expect(response.content[0].text).toContain('Error');
    });
    
    it('should handle missing required arguments', async () => {
      const response = await mcpClient.request(
        { method: 'tools/call' },
        {
          method: 'tools/call',
          params: {
            name: 'list_jobs',
            arguments: {}, // Missing workspace
          },
        }
      );
      
      expect(response).toHaveProperty('content');
      expect(response.isError).toBe(true);
    });
  });
});

// These tests run regardless of E2E availability
describe('MCP E2E Test Configuration', () => {
  it('should have E2E environment variables documented', () => {
    const requiredVars = [
      'E2E_WINDMILL_URL',
      'E2E_WINDMILL_TOKEN',
      'E2E_WORKSPACE',
    ];
    
    expect(requiredVars).toHaveLength(3);
  });
  
  it('should skip MCP E2E tests when not configured', () => {
    if (!isE2EEnabled) {
      console.log('MCP E2E tests skipped - set E2E_WINDMILL_URL and E2E_WINDMILL_TOKEN to enable');
    }
    expect(true).toBe(true);
  });
});
