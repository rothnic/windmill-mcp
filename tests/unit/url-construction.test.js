/**
 * Test suite for API base URL construction logic
 *
 * These tests verify that the API_BASE_URL is constructed correctly
 * with various WINDMILL_BASE_URL configurations.
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";

// Function under test - extracted from the generated MCP server
function getApiBaseUrl(baseUrl) {
  return baseUrl ? `${baseUrl.replace(/\/$/, "")}/api` : "/api";
}

describe("API Base URL Construction", () => {
  describe("getApiBaseUrl", () => {
    it('should return "/api" when base URL is undefined', () => {
      const result = getApiBaseUrl(undefined);
      expect(result).toBe("/api");
    });

    it("should construct full URL when base URL is provided", () => {
      const result = getApiBaseUrl("https://app.windmill.dev");
      expect(result).toBe("https://app.windmill.dev/api");
    });

    it("should handle trailing slash in base URL", () => {
      const result = getApiBaseUrl("https://app.windmill.dev/");
      expect(result).toBe("https://app.windmill.dev/api");
    });

    it("should work with localhost URL", () => {
      const result = getApiBaseUrl("http://localhost:8000");
      expect(result).toBe("http://localhost:8000/api");
    });

    it("should work with localhost URL with trailing slash", () => {
      const result = getApiBaseUrl("http://localhost:8000/");
      expect(result).toBe("http://localhost:8000/api");
    });
  });

  describe("MCP Tool URL Construction", () => {
    const backendVersionTool = {
      name: "backendVersion",
      pathTemplate: "/version",
      executionParameters: [],
    };

    const getUserTool = {
      name: "getUser",
      pathTemplate: "/w/{workspace}/users/{username}",
      executionParameters: [
        { name: "workspace", in: "path", required: true },
        { name: "username", in: "path", required: true },
      ],
    };

    const listJobsTool = {
      name: "listJobs",
      pathTemplate: "/w/{workspace}/jobs/completed/list",
      executionParameters: [
        { name: "workspace", in: "path", required: true },
        { name: "page", in: "query", required: false },
        { name: "per_page", in: "query", required: false },
      ],
    };

    function constructUrl(tool, params = {}, apiBaseUrl = "/api") {
      let url = apiBaseUrl + tool.pathTemplate;

      // Replace path parameters
      tool.executionParameters
        .filter((param) => param.in === "path")
        .forEach((param) => {
          if (params[param.name]) {
            url = url.replace(`{${param.name}}`, params[param.name]);
          }
        });

      // Add query parameters
      const queryParams = tool.executionParameters
        .filter(
          (param) => param.in === "query" && params[param.name] !== undefined,
        )
        .map(
          (param) => `${param.name}=${encodeURIComponent(params[param.name])}`,
        )
        .join("&");

      if (queryParams) {
        url += `?${queryParams}`;
      }

      return url;
    }

    it("should construct URL for tool without parameters", () => {
      const url = constructUrl(
        backendVersionTool,
        {},
        "https://app.windmill.dev/api",
      );
      expect(url).toBe("https://app.windmill.dev/api/version");
    });

    it("should construct URL for tool with path parameters", () => {
      const url = constructUrl(
        getUserTool,
        {
          workspace: "admins",
          username: "testuser",
        },
        "http://localhost:8000/api",
      );
      expect(url).toBe("http://localhost:8000/api/w/admins/users/testuser");
    });

    it("should construct URL for tool with query parameters", () => {
      const url = constructUrl(
        listJobsTool,
        {
          workspace: "admins",
          page: 1,
          per_page: 20,
        },
        "http://localhost:8000/api",
      );
      expect(url).toBe(
        "http://localhost:8000/api/w/admins/jobs/completed/list?page=1&per_page=20",
      );
    });

    it("should handle missing optional query parameters", () => {
      const url = constructUrl(
        listJobsTool,
        {
          workspace: "admins",
        },
        "http://localhost:8000/api",
      );
      expect(url).toBe(
        "http://localhost:8000/api/w/admins/jobs/completed/list",
      );
    });

    it("should properly encode query parameter values", () => {
      const url = constructUrl(
        listJobsTool,
        {
          workspace: "admins",
          page: "test value",
        },
        "http://localhost:8000/api",
      );
      expect(url).toBe(
        "http://localhost:8000/api/w/admins/jobs/completed/list?page=test%20value",
      );
    });

    it("should fail gracefully with relative URL when base URL is not provided", () => {
      const url = constructUrl(backendVersionTool, {}, "/api");
      expect(url).toBe("/api/version");
      // Note: This would fail in actual HTTP requests
      expect(url.startsWith("/")).toBe(true);
    });
  });

  describe("Environment Variable Integration", () => {
    let originalEnv;

    beforeEach(() => {
      originalEnv = process.env.WINDMILL_BASE_URL;
    });

    afterEach(() => {
      if (originalEnv !== undefined) {
        process.env.WINDMILL_BASE_URL = originalEnv;
      } else {
        delete process.env.WINDMILL_BASE_URL;
      }
    });

    it("should use environment variable when set", () => {
      process.env.WINDMILL_BASE_URL = "https://app.windmill.dev";
      const result = getApiBaseUrl(process.env.WINDMILL_BASE_URL);
      expect(result).toBe("https://app.windmill.dev/api");
    });

    it("should fall back to relative URL when env var is not set", () => {
      delete process.env.WINDMILL_BASE_URL;
      const result = getApiBaseUrl(process.env.WINDMILL_BASE_URL);
      expect(result).toBe("/api");
    });
  });
});
