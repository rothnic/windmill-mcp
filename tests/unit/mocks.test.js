/**
 * Unit tests for Mock Windmill Client
 *
 * These tests demonstrate testing MCP tools without connecting to a real Windmill instance.
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  MockWindmillClient,
  createMockToolRequest,
  createMockToolResponse,
} from "../utils/mocks.js";

describe("MockWindmillClient", () => {
  let client;

  beforeEach(() => {
    client = new MockWindmillClient();
  });

  describe("Job Operations", () => {
    it("should list jobs", async () => {
      const jobs = await client.listJobs("test-workspace");

      expect(jobs).toBeInstanceOf(Array);
      expect(jobs).toHaveLength(1);
      expect(jobs[0]).toMatchObject({
        id: expect.any(String),
        workspace: "test-workspace",
        status: "completed",
      });
    });

    it("should get a specific job", async () => {
      const job = await client.getJob("test-workspace", "job-123");

      expect(job).toMatchObject({
        id: "job-123",
        workspace: "test-workspace",
        status: "completed",
      });
    });

    it("should run a script", async () => {
      const job = await client.runScript("test-workspace", "f/test/script", {
        arg1: "value1",
      });

      expect(job).toMatchObject({
        id: expect.any(String),
        workspace: "test-workspace",
      });
    });

    it("should record API calls", async () => {
      await client.listJobs("test-workspace");
      await client.getJob("test-workspace", "job-123");

      const history = client.getCallHistory();
      expect(history).toHaveLength(2);
      expect(history[0]).toMatchObject({
        method: "GET",
        path: "/api/w/test-workspace/jobs/list",
      });
      expect(history[1]).toMatchObject({
        method: "GET",
        path: "/api/w/test-workspace/jobs/get/job-123",
      });
    });
  });

  describe("Script Operations", () => {
    it("should list scripts", async () => {
      const scripts = await client.listScripts("test-workspace");

      expect(scripts).toBeInstanceOf(Array);
      expect(scripts).toHaveLength(1);
      expect(scripts[0]).toMatchObject({
        hash: expect.any(String),
        path: expect.any(String),
        language: "python3",
      });
    });

    it("should get a specific script", async () => {
      const script = await client.getScript("test-workspace", "f/test/script");

      expect(script).toMatchObject({
        hash: "script-hash-abc",
        path: "f/test/script",
        language: "python3",
      });
    });
  });

  describe("Workflow Operations", () => {
    it("should list workflows", async () => {
      const workflows = await client.listWorkflows("test-workspace");

      expect(workflows).toBeInstanceOf(Array);
      expect(workflows).toHaveLength(1);
      expect(workflows[0]).toMatchObject({
        path: expect.any(String),
        summary: expect.any(String),
      });
    });

    it("should get a specific workflow", async () => {
      const workflow = await client.getWorkflow(
        "test-workspace",
        "f/test/workflow",
      );

      expect(workflow).toMatchObject({
        path: "f/test/workflow",
        summary: "Test workflow",
        value: expect.any(Object),
      });
    });
  });

  describe("Call History", () => {
    it("should track all API calls", async () => {
      await client.listJobs("test-workspace");
      await client.listScripts("test-workspace");
      await client.listWorkflows("test-workspace");

      expect(client.getCallHistory()).toHaveLength(3);
    });

    it("should clear call history", async () => {
      await client.listJobs("test-workspace");
      expect(client.getCallHistory()).toHaveLength(1);

      client.clearHistory();
      expect(client.getCallHistory()).toHaveLength(0);
    });
  });
});

describe("MCP Tool Helpers", () => {
  it("should create mock tool request", () => {
    const request = createMockToolRequest("list_jobs", {
      workspace: "test-workspace",
    });

    expect(request).toMatchObject({
      method: "tools/call",
      params: {
        name: "list_jobs",
        arguments: {
          workspace: "test-workspace",
        },
      },
    });
  });

  it("should create mock tool response", () => {
    const response = createMockToolResponse({ success: true });

    expect(response).toMatchObject({
      content: [
        {
          type: "text",
          text: expect.any(String),
        },
      ],
      isError: false,
    });
  });

  it("should create error response", () => {
    const response = createMockToolResponse("Error occurred", true);

    expect(response).toMatchObject({
      content: [
        {
          type: "text",
          text: "Error occurred",
        },
      ],
      isError: true,
    });
  });
});
