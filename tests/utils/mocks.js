/**
 * Mock Windmill API responses for unit testing
 * 
 * This module provides mock responses that simulate Windmill API behavior
 * without requiring an actual Windmill instance.
 */

/**
 * Mock workspace
 */
export const mockWorkspace = {
  id: 'test-workspace',
  name: 'Test Workspace',
  owner: 'test-user',
};

/**
 * Mock job
 */
export const mockJob = {
  id: 'job-123',
  workspace: 'test-workspace',
  script_hash: 'script-hash-abc',
  status: 'completed',
  created_at: '2025-01-01T00:00:00Z',
  started_at: '2025-01-01T00:00:01Z',
  completed_at: '2025-01-01T00:00:10Z',
  result: { success: true, data: 'test result' },
};

/**
 * Mock script
 */
export const mockScript = {
  hash: 'script-hash-abc',
  path: 'f/test/script',
  summary: 'Test script',
  description: 'A test script for unit tests',
  language: 'python3',
  content: 'print("Hello from test")',
};

/**
 * Mock workflow
 */
export const mockWorkflow = {
  path: 'f/test/workflow',
  summary: 'Test workflow',
  description: 'A test workflow for unit tests',
  value: {
    modules: [
      {
        id: 'a',
        value: {
          type: 'rawscript',
          content: 'print("step 1")',
        },
      },
    ],
  },
};

/**
 * Mock API client that doesn't make real requests
 */
export class MockWindmillClient {
  constructor(baseUrl = 'http://localhost:8000', token = 'test-token') {
    this.baseUrl = baseUrl;
    this.token = token;
    this.callHistory = [];
  }

  /**
   * Record API calls for verification
   */
  _recordCall(method, path, data) {
    this.callHistory.push({ method, path, data, timestamp: Date.now() });
  }

  /**
   * Mock: List jobs
   */
  async listJobs(workspace) {
    this._recordCall('GET', `/api/w/${workspace}/jobs/list`, {});
    return [mockJob];
  }

  /**
   * Mock: Get job
   */
  async getJob(workspace, jobId) {
    this._recordCall('GET', `/api/w/${workspace}/jobs/get/${jobId}`, {});
    return mockJob;
  }

  /**
   * Mock: Run script
   */
  async runScript(workspace, scriptPath, args = {}) {
    this._recordCall('POST', `/api/w/${workspace}/jobs/run/p/${scriptPath}`, args);
    return { ...mockJob, id: `job-${Date.now()}` };
  }

  /**
   * Mock: List scripts
   */
  async listScripts(workspace) {
    this._recordCall('GET', `/api/w/${workspace}/scripts/list`, {});
    return [mockScript];
  }

  /**
   * Mock: Get script
   */
  async getScript(workspace, scriptPath) {
    this._recordCall('GET', `/api/w/${workspace}/scripts/get/p/${scriptPath}`, {});
    return mockScript;
  }

  /**
   * Mock: List workflows
   */
  async listWorkflows(workspace) {
    this._recordCall('GET', `/api/w/${workspace}/flows/list`, {});
    return [mockWorkflow];
  }

  /**
   * Mock: Get workflow
   */
  async getWorkflow(workspace, workflowPath) {
    this._recordCall('GET', `/api/w/${workspace}/flows/get/p/${workflowPath}`, {});
    return mockWorkflow;
  }

  /**
   * Get call history for testing
   */
  getCallHistory() {
    return this.callHistory;
  }

  /**
   * Clear call history
   */
  clearHistory() {
    this.callHistory = [];
  }
}

/**
 * Create a mock MCP tool request
 */
export function createMockToolRequest(toolName, args = {}) {
  return {
    method: 'tools/call',
    params: {
      name: toolName,
      arguments: args,
    },
  };
}

/**
 * Create a mock MCP tool response
 */
export function createMockToolResponse(content, isError = false) {
  return {
    content: [
      {
        type: 'text',
        text: typeof content === 'string' ? content : JSON.stringify(content, null, 2),
      },
    ],
    isError,
  };
}

/**
 * Mock HTTP fetch for unit tests
 */
export function mockFetch(responses = {}) {
  return async (url, options = {}) => {
    const method = options.method || 'GET';
    const key = `${method} ${url}`;
    
    if (responses[key]) {
      const response = responses[key];
      return {
        ok: response.status >= 200 && response.status < 300,
        status: response.status || 200,
        statusText: response.statusText || 'OK',
        json: async () => response.body,
        text: async () => JSON.stringify(response.body),
        headers: new Map(Object.entries(response.headers || {})),
      };
    }
    
    // Default 404 for unmocked requests
    return {
      ok: false,
      status: 404,
      statusText: 'Not Found',
      json: async () => ({ error: 'Not Found' }),
      text: async () => '{"error":"Not Found"}',
      headers: new Map(),
    };
  };
}
