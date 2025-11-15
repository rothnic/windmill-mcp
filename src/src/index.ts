#!/usr/bin/env node
/**
 * MCP Server generated from OpenAPI spec for windmill-mcp v1.520.1
 * Generated on: 2025-11-15T08:18:53.535Z
 */

// Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type Tool,
  type CallToolResult,
  type CallToolRequest
} from "@modelcontextprotocol/sdk/types.js";

import { z, ZodError } from 'zod';
import { jsonSchemaToZod } from 'json-schema-to-zod';
import axios, { type AxiosRequestConfig, type AxiosError } from 'axios';

/**
 * Type definition for JSON objects
 */
type JsonObject = Record<string, any>;

/**
 * Interface for MCP Tool Definition
 */
interface McpToolDefinition {
    name: string;
    description: string;
    inputSchema: any;
    method: string;
    pathTemplate: string;
    executionParameters: { name: string, in: string }[];
    requestBodyContentType?: string;
    securityRequirements: any[];
}

/**
 * Server configuration
 */
export const SERVER_NAME = "windmill-mcp";
export const SERVER_VERSION = "1.520.1";
export const API_BASE_URL = "/api";

/**
 * MCP Server instance
 */
const server = new Server(
    { name: SERVER_NAME, version: SERVER_VERSION },
    { capabilities: { tools: {} } }
);

/**
 * Map of tool definitions by name
 */
const toolDefinitionMap: Map<string, McpToolDefinition> = new Map([

  ["backendVersion", {
    name: "backendVersion",
    description: `get backend version`,
    inputSchema: {"type":"object","properties":{}},
    method: "get",
    pathTemplate: "/version",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["backendUptodate", {
    name: "backendUptodate",
    description: `is backend up to date`,
    inputSchema: {"type":"object","properties":{}},
    method: "get",
    pathTemplate: "/uptodate",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getLicenseId", {
    name: "getLicenseId",
    description: `get license id`,
    inputSchema: {"type":"object","properties":{}},
    method: "get",
    pathTemplate: "/ee_license",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getOpenApiYaml", {
    name: "getOpenApiYaml",
    description: `get openapi yaml spec`,
    inputSchema: {"type":"object","properties":{}},
    method: "get",
    pathTemplate: "/openapi.yaml",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getAuditLog", {
    name: "getAuditLog",
    description: `get audit log (requires admin privilege)`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"id":{"type":"number"}},"required":["workspace","id"]},
    method: "get",
    pathTemplate: "/w/{workspace}/audit/get/{id}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listAuditLogs", {
    name: "listAuditLogs",
    description: `list audit logs (requires admin privilege)`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"page":{"type":"number","description":"which page to return (start at 1, default 1)"},"per_page":{"type":"number","description":"number of items to return for a given page (default 30, max 100)"},"before":{"type":"string","format":"date-time","description":"filter on started before (inclusive) timestamp"},"after":{"type":"string","format":"date-time","description":"filter on created after (exclusive) timestamp"},"username":{"type":"string","description":"filter on exact username of user"},"operation":{"type":"string","description":"filter on exact or prefix name of operation"},"operations":{"type":"string","description":"comma separated list of exact operations to include"},"exclude_operations":{"type":"string","description":"comma separated list of operations to exclude"},"resource":{"type":"string","description":"filter on exact or prefix name of resource"},"action_kind":{"type":"string","enum":["Create","Update","Delete","Execute"],"description":"filter on type of operation"},"all_workspaces":{"type":"boolean","description":"get audit logs for all workspaces"}},"required":["workspace"]},
    method: "get",
    pathTemplate: "/w/{workspace}/audit/list",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"page","in":"query"},{"name":"per_page","in":"query"},{"name":"before","in":"query"},{"name":"after","in":"query"},{"name":"username","in":"query"},{"name":"operation","in":"query"},{"name":"operations","in":"query"},{"name":"exclude_operations","in":"query"},{"name":"resource","in":"query"},{"name":"action_kind","in":"query"},{"name":"all_workspaces","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["login", {
    name: "login",
    description: `login with password`,
    inputSchema: {"type":"object","properties":{"requestBody":{"type":"object","properties":{"email":{"type":"string"},"password":{"type":"string"}},"required":["email","password"],"description":"credentials"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/auth/login",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: []
  }],
  ["logout", {
    name: "logout",
    description: `logout`,
    inputSchema: {"type":"object","properties":{}},
    method: "post",
    pathTemplate: "/auth/logout",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: []
  }],
  ["getUser", {
    name: "getUser",
    description: `get user (require admin privilege)`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"username":{"type":"string"}},"required":["workspace","username"]},
    method: "get",
    pathTemplate: "/w/{workspace}/users/get/{username}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"username","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["updateUser", {
    name: "updateUser",
    description: `update user (require admin privilege)`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"username":{"type":"string"},"requestBody":{"type":"object","properties":{"is_admin":{"type":"boolean"},"operator":{"type":"boolean"},"disabled":{"type":"boolean"}},"description":"new user"}},"required":["workspace","username","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/users/update/{username}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"username","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["isOwnerOfPath", {
    name: "isOwnerOfPath",
    description: `is owner of path`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"}},"required":["workspace","path"]},
    method: "get",
    pathTemplate: "/w/{workspace}/users/is_owner/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["setPassword", {
    name: "setPassword",
    description: `set password`,
    inputSchema: {"type":"object","properties":{"requestBody":{"type":"object","properties":{"password":{"type":"string"}},"required":["password"],"description":"set password"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/users/setpassword",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["setPasswordForUser", {
    name: "setPasswordForUser",
    description: `set password for a specific user (require super admin)`,
    inputSchema: {"type":"object","properties":{"user":{"type":"string"},"requestBody":{"type":"object","properties":{"password":{"type":"string"}},"required":["password"],"description":"set password"}},"required":["user","requestBody"]},
    method: "post",
    pathTemplate: "/users/set_password_of/{user}",
    executionParameters: [{"name":"user","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["setLoginTypeForUser", {
    name: "setLoginTypeForUser",
    description: `set login type for a specific user (require super admin)`,
    inputSchema: {"type":"object","properties":{"user":{"type":"string"},"requestBody":{"type":"object","properties":{"login_type":{"type":"string"}},"required":["login_type"],"description":"set login type"}},"required":["user","requestBody"]},
    method: "post",
    pathTemplate: "/users/set_login_type/{user}",
    executionParameters: [{"name":"user","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["createUserGlobally", {
    name: "createUserGlobally",
    description: `create user`,
    inputSchema: {"type":"object","properties":{"requestBody":{"type":"object","properties":{"email":{"type":"string"},"password":{"type":"string"},"super_admin":{"type":"boolean"},"name":{"type":"string"},"company":{"type":"string"},"skip_email":{"type":"boolean","description":"Skip sending email notifications to the user"}},"required":["email","password","super_admin"],"description":"user info"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/users/create",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["globalUserUpdate", {
    name: "globalUserUpdate",
    description: `global update user (require super admin)`,
    inputSchema: {"type":"object","properties":{"email":{"type":"string"},"requestBody":{"type":"object","properties":{"is_super_admin":{"type":"boolean"},"is_devops":{"type":"boolean"},"name":{"type":"string"}},"description":"new user info"}},"required":["email","requestBody"]},
    method: "post",
    pathTemplate: "/users/update/{email}",
    executionParameters: [{"name":"email","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["globalUsernameInfo", {
    name: "globalUsernameInfo",
    description: `global username info (require super admin)`,
    inputSchema: {"type":"object","properties":{"email":{"type":"string"}},"required":["email"]},
    method: "get",
    pathTemplate: "/users/username_info/{email}",
    executionParameters: [{"name":"email","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["globalUserRename", {
    name: "globalUserRename",
    description: `global rename user (require super admin)`,
    inputSchema: {"type":"object","properties":{"email":{"type":"string"},"requestBody":{"type":"object","properties":{"new_username":{"type":"string"}},"required":["new_username"],"description":"new username"}},"required":["email","requestBody"]},
    method: "post",
    pathTemplate: "/users/rename/{email}",
    executionParameters: [{"name":"email","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["globalUserDelete", {
    name: "globalUserDelete",
    description: `global delete user (require super admin)`,
    inputSchema: {"type":"object","properties":{"email":{"type":"string"}},"required":["email"]},
    method: "delete",
    pathTemplate: "/users/delete/{email}",
    executionParameters: [{"name":"email","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["globalUsersOverwrite", {
    name: "globalUsersOverwrite",
    description: `global overwrite users (require super admin and EE)`,
    inputSchema: {"type":"object","properties":{"requestBody":{"type":"array","items":{"type":"object","properties":{"email":{"type":"string"},"password_hash":{"type":"string"},"super_admin":{"type":"boolean"},"verified":{"type":"boolean"},"name":{"type":"string"},"company":{"type":"string"},"first_time_user":{"type":"boolean"},"username":{"type":"string"}},"required":["email","super_admin","verified","first_time_user"]},"description":"List of users"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/users/overwrite",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["globalUsersExport", {
    name: "globalUsersExport",
    description: `global export users (require super admin and EE)`,
    inputSchema: {"type":"object","properties":{}},
    method: "get",
    pathTemplate: "/users/export",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["deleteUser", {
    name: "deleteUser",
    description: `delete user (require admin privilege)`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"username":{"type":"string"}},"required":["workspace","username"]},
    method: "delete",
    pathTemplate: "/w/{workspace}/users/delete/{username}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"username","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getGlobalConnectedRepositories", {
    name: "getGlobalConnectedRepositories",
    description: `get connected repositories`,
    inputSchema: {"type":"object","properties":{}},
    method: "get",
    pathTemplate: "/github_app/connected_repositories",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listWorkspaces", {
    name: "listWorkspaces",
    description: `list all workspaces visible to me`,
    inputSchema: {"type":"object","properties":{}},
    method: "get",
    pathTemplate: "/workspaces/list",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["isDomainAllowed", {
    name: "isDomainAllowed",
    description: `is domain allowed for auto invi`,
    inputSchema: {"type":"object","properties":{}},
    method: "get",
    pathTemplate: "/workspaces/allowed_domain_auto_invite",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listUserWorkspaces", {
    name: "listUserWorkspaces",
    description: `list all workspaces visible to me with user info`,
    inputSchema: {"type":"object","properties":{}},
    method: "get",
    pathTemplate: "/workspaces/users",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listWorkspacesAsSuperAdmin", {
    name: "listWorkspacesAsSuperAdmin",
    description: `list all workspaces as super admin (require to be super admin)`,
    inputSchema: {"type":"object","properties":{"page":{"type":"number","description":"which page to return (start at 1, default 1)"},"per_page":{"type":"number","description":"number of items to return for a given page (default 30, max 100)"}}},
    method: "get",
    pathTemplate: "/workspaces/list_as_superadmin",
    executionParameters: [{"name":"page","in":"query"},{"name":"per_page","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["createWorkspace", {
    name: "createWorkspace",
    description: `create workspace`,
    inputSchema: {"type":"object","properties":{"requestBody":{"type":"object","properties":{"id":{"type":"string"},"name":{"type":"string"},"username":{"type":"string"},"color":{"type":"string"}},"required":["id","name"],"description":"new token"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/workspaces/create",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["existsWorkspace", {
    name: "existsWorkspace",
    description: `exists workspace`,
    inputSchema: {"type":"object","properties":{"requestBody":{"type":"object","properties":{"id":{"type":"string"}},"required":["id"],"description":"id of workspace"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/workspaces/exists",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["existsUsername", {
    name: "existsUsername",
    description: `exists username`,
    inputSchema: {"type":"object","properties":{"requestBody":{"type":"object","properties":{"id":{"type":"string"},"username":{"type":"string"}},"required":["id","username"],"description":"The JSON request body."}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/workspaces/exists_username",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["databasesExist", {
    name: "databasesExist",
    description: `checks that all given databases exist or else return the ones that don't`,
    inputSchema: {"type":"object","properties":{"requestBody":{"type":"array","items":{"type":"string"},"description":"The JSON request body."}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/settings/databases_exist",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["createDucklakeDatabase", {
    name: "createDucklakeDatabase",
    description: `Runs CREATE DATABASE on the Windmill Postgres and grants access to the ducklake_user`,
    inputSchema: {"type":"object","properties":{"name":{"type":"string","description":"The name of the database to create"}},"required":["name"]},
    method: "post",
    pathTemplate: "/settings/create_ducklake_database/{name}",
    executionParameters: [{"name":"name","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getGlobal", {
    name: "getGlobal",
    description: `get global settings`,
    inputSchema: {"type":"object","properties":{"key":{"type":"string"}},"required":["key"]},
    method: "get",
    pathTemplate: "/settings/global/{key}",
    executionParameters: [{"name":"key","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["setGlobal", {
    name: "setGlobal",
    description: `post global settings`,
    inputSchema: {"type":"object","properties":{"key":{"type":"string"},"requestBody":{"type":"object","properties":{"value":{}},"description":"value set"}},"required":["key","requestBody"]},
    method: "post",
    pathTemplate: "/settings/global/{key}",
    executionParameters: [{"name":"key","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getLocal", {
    name: "getLocal",
    description: `get local settings`,
    inputSchema: {"type":"object","properties":{}},
    method: "get",
    pathTemplate: "/settings/local",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["testSmtp", {
    name: "testSmtp",
    description: `test smtp`,
    inputSchema: {"type":"object","properties":{"requestBody":{"type":"object","properties":{"to":{"type":"string"},"smtp":{"type":"object","properties":{"host":{"type":"string"},"username":{"type":"string"},"password":{"type":"string"},"port":{"type":"number"},"from":{"type":"string"},"tls_implicit":{"type":"boolean"},"disable_tls":{"type":"boolean"}},"required":["host","username","password","port","from","tls_implicit","disable_tls"]}},"required":["to","smtp"],"description":"test smtp payload"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/settings/test_smtp",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["testCriticalChannels", {
    name: "testCriticalChannels",
    description: `test critical channels`,
    inputSchema: {"type":"object","properties":{"requestBody":{"type":"array","items":{"type":"object","properties":{"email":{"type":"string"},"slack_channel":{"type":"string"}}},"description":"test critical channel payload"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/settings/test_critical_channels",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getCriticalAlerts", {
    name: "getCriticalAlerts",
    description: `Get all critical alerts`,
    inputSchema: {"type":"object","properties":{"page":{"type":"number","default":1,"description":"The page number to retrieve (minimum value is 1)"},"page_size":{"type":"number","default":10,"maximum":100,"description":"Number of alerts per page (maximum is 100)"},"acknowledged":{"type":["boolean","null"],"description":"Filter by acknowledgment status; true for acknowledged, false for unacknowledged, and omit for all alerts"}}},
    method: "get",
    pathTemplate: "/settings/critical_alerts",
    executionParameters: [{"name":"page","in":"query"},{"name":"page_size","in":"query"},{"name":"acknowledged","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["acknowledgeCriticalAlert", {
    name: "acknowledgeCriticalAlert",
    description: `Acknowledge a critical alert`,
    inputSchema: {"type":"object","properties":{"id":{"type":"number","description":"The ID of the critical alert to acknowledge"}},"required":["id"]},
    method: "post",
    pathTemplate: "/settings/critical_alerts/{id}/acknowledge",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["acknowledgeAllCriticalAlerts", {
    name: "acknowledgeAllCriticalAlerts",
    description: `Acknowledge all unacknowledged critical alerts`,
    inputSchema: {"type":"object","properties":{}},
    method: "post",
    pathTemplate: "/settings/critical_alerts/acknowledge_all",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["testLicenseKey", {
    name: "testLicenseKey",
    description: `test license key`,
    inputSchema: {"type":"object","properties":{"requestBody":{"type":"object","properties":{"license_key":{"type":"string"}},"required":["license_key"],"description":"test license key"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/settings/test_license_key",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["testObjectStorageConfig", {
    name: "testObjectStorageConfig",
    description: `test object storage config`,
    inputSchema: {"type":"object","properties":{"requestBody":{"type":"object","additionalProperties":true,"description":"test object storage config"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/settings/test_object_storage_config",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["sendStats", {
    name: "sendStats",
    description: `send stats`,
    inputSchema: {"type":"object","properties":{}},
    method: "post",
    pathTemplate: "/settings/send_stats",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getLatestKeyRenewalAttempt", {
    name: "getLatestKeyRenewalAttempt",
    description: `get latest key renewal attempt`,
    inputSchema: {"type":"object","properties":{}},
    method: "get",
    pathTemplate: "/settings/latest_key_renewal_attempt",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["renewLicenseKey", {
    name: "renewLicenseKey",
    description: `renew license key`,
    inputSchema: {"type":"object","properties":{"license_key":{"type":"string"}}},
    method: "post",
    pathTemplate: "/settings/renew_license_key",
    executionParameters: [{"name":"license_key","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["createCustomerPortalSession", {
    name: "createCustomerPortalSession",
    description: `create customer portal session`,
    inputSchema: {"type":"object","properties":{"license_key":{"type":"string"}}},
    method: "post",
    pathTemplate: "/settings/customer_portal",
    executionParameters: [{"name":"license_key","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["testMetadata", {
    name: "testMetadata",
    description: `test metadata`,
    inputSchema: {"type":"object","properties":{"requestBody":{"type":"string","description":"test metadata"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/saml/test_metadata",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listGlobalSettings", {
    name: "listGlobalSettings",
    description: `list global settings`,
    inputSchema: {"type":"object","properties":{}},
    method: "get",
    pathTemplate: "/settings/list_global",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getCurrentEmail", {
    name: "getCurrentEmail",
    description: `get current user email (if logged in)`,
    inputSchema: {"type":"object","properties":{}},
    method: "get",
    pathTemplate: "/users/email",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["refreshUserToken", {
    name: "refreshUserToken",
    description: `refresh the current token`,
    inputSchema: {"type":"object","properties":{"if_expiring_in_less_than_s":{"type":"number"}}},
    method: "get",
    pathTemplate: "/users/refresh_token",
    executionParameters: [{"name":"if_expiring_in_less_than_s","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getTutorialProgress", {
    name: "getTutorialProgress",
    description: `get tutorial progress`,
    inputSchema: {"type":"object","properties":{}},
    method: "get",
    pathTemplate: "/users/tutorial_progress",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["updateTutorialProgress", {
    name: "updateTutorialProgress",
    description: `update tutorial progress`,
    inputSchema: {"type":"object","properties":{"requestBody":{"type":"object","properties":{"progress":{"type":"number"}},"description":"progress update"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/users/tutorial_progress",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["leaveInstance", {
    name: "leaveInstance",
    description: `leave instance`,
    inputSchema: {"type":"object","properties":{}},
    method: "post",
    pathTemplate: "/users/leave_instance",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getUsage", {
    name: "getUsage",
    description: `get current usage outside of premium workspaces`,
    inputSchema: {"type":"object","properties":{}},
    method: "get",
    pathTemplate: "/users/usage",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getRunnable", {
    name: "getRunnable",
    description: `get all runnables in every workspace`,
    inputSchema: {"type":"object","properties":{}},
    method: "get",
    pathTemplate: "/users/all_runnables",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["globalWhoami", {
    name: "globalWhoami",
    description: `get current global whoami (if logged in)`,
    inputSchema: {"type":"object","properties":{}},
    method: "get",
    pathTemplate: "/users/whoami",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listWorkspaceInvites", {
    name: "listWorkspaceInvites",
    description: `list all workspace invites`,
    inputSchema: {"type":"object","properties":{}},
    method: "get",
    pathTemplate: "/users/list_invites",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["whoami", {
    name: "whoami",
    description: `whoami`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"}},"required":["workspace"]},
    method: "get",
    pathTemplate: "/w/{workspace}/users/whoami",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getGithubAppToken", {
    name: "getGithubAppToken",
    description: `get github app token`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"object","properties":{"job_token":{"type":"string"}},"required":["job_token"],"description":"jwt job token"}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/github_app/token",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["installFromWorkspace", {
    name: "installFromWorkspace",
    description: `Install a GitHub installation from another workspace`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"object","properties":{"source_workspace_id":{"type":"string","description":"The ID of the workspace containing the installation to copy"},"installation_id":{"type":"number","description":"The ID of the GitHub installation to copy"}},"required":["source_workspace_id","installation_id"],"description":"The JSON request body."}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/github_app/install_from_workspace",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["deleteFromWorkspace", {
    name: "deleteFromWorkspace",
    description: `Removes a GitHub installation from the specified workspace. Requires admin privileges.`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"installation_id":{"type":"number","format":"int64","description":"The ID of the GitHub installation to delete"}},"required":["workspace","installation_id"]},
    method: "delete",
    pathTemplate: "/w/{workspace}/github_app/installation/{installation_id}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"installation_id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["exportInstallation", {
    name: "exportInstallation",
    description: `Exports the JWT token for a specific GitHub installation in the workspace`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"installationId":{"type":"number"}},"required":["workspace","installationId"]},
    method: "get",
    pathTemplate: "/w/{workspace}/github_app/export/{installationId}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"installationId","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["importInstallation", {
    name: "importInstallation",
    description: `Imports a GitHub installation from a JWT token exported from another instance`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"object","required":["jwt_token"],"properties":{"jwt_token":{"type":"string"}},"description":"The JSON request body."}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/github_app/import",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["acceptInvite", {
    name: "acceptInvite",
    description: `accept invite to workspace`,
    inputSchema: {"type":"object","properties":{"requestBody":{"type":"object","properties":{"workspace_id":{"type":"string"},"username":{"type":"string"}},"required":["workspace_id"],"description":"accept invite"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/users/accept_invite",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["declineInvite", {
    name: "declineInvite",
    description: `decline invite to workspace`,
    inputSchema: {"type":"object","properties":{"requestBody":{"type":"object","properties":{"workspace_id":{"type":"string"}},"required":["workspace_id"],"description":"decline invite"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/users/decline_invite",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["inviteUser", {
    name: "inviteUser",
    description: `invite user to workspace`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"object","properties":{"email":{"type":"string"},"is_admin":{"type":"boolean"},"operator":{"type":"boolean"}},"required":["email","is_admin","operator"],"description":"WorkspaceInvite"}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/workspaces/invite_user",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["addUser", {
    name: "addUser",
    description: `add user to workspace`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"object","properties":{"email":{"type":"string"},"is_admin":{"type":"boolean"},"username":{"type":"string"},"operator":{"type":"boolean"}},"required":["email","is_admin","operator"],"description":"WorkspaceInvite"}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/workspaces/add_user",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["delete_invite", {
    name: "delete_invite",
    description: `delete user invite`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"object","properties":{"email":{"type":"string"},"is_admin":{"type":"boolean"},"operator":{"type":"boolean"}},"required":["email","is_admin","operator"],"description":"WorkspaceInvite"}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/workspaces/delete_invite",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["archiveWorkspace", {
    name: "archiveWorkspace",
    description: `archive workspace`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"}},"required":["workspace"]},
    method: "post",
    pathTemplate: "/w/{workspace}/workspaces/archive",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["unarchiveWorkspace", {
    name: "unarchiveWorkspace",
    description: `unarchive workspace`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"}},"required":["workspace"]},
    method: "post",
    pathTemplate: "/workspaces/unarchive/{workspace}",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["deleteWorkspace", {
    name: "deleteWorkspace",
    description: `delete workspace (require super admin)`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"}},"required":["workspace"]},
    method: "delete",
    pathTemplate: "/workspaces/delete/{workspace}",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["leaveWorkspace", {
    name: "leaveWorkspace",
    description: `leave workspace`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"}},"required":["workspace"]},
    method: "post",
    pathTemplate: "/w/{workspace}/workspaces/leave",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getWorkspaceName", {
    name: "getWorkspaceName",
    description: `get workspace name`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"}},"required":["workspace"]},
    method: "get",
    pathTemplate: "/w/{workspace}/workspaces/get_workspace_name",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["changeWorkspaceName", {
    name: "changeWorkspaceName",
    description: `change workspace name`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"object","properties":{"new_name":{"type":"string"}},"required":["username"],"description":"The JSON request body."}},"required":["workspace"]},
    method: "post",
    pathTemplate: "/w/{workspace}/workspaces/change_workspace_name",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["changeWorkspaceId", {
    name: "changeWorkspaceId",
    description: `change workspace id`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"object","properties":{"new_id":{"type":"string"},"new_name":{"type":"string"}},"required":["username"],"description":"The JSON request body."}},"required":["workspace"]},
    method: "post",
    pathTemplate: "/w/{workspace}/workspaces/change_workspace_id",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["changeWorkspaceColor", {
    name: "changeWorkspaceColor",
    description: `change workspace id`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"object","properties":{"color":{"type":"string"}},"description":"The JSON request body."}},"required":["workspace"]},
    method: "post",
    pathTemplate: "/w/{workspace}/workspaces/change_workspace_color",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["whois", {
    name: "whois",
    description: `whois`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"username":{"type":"string"}},"required":["workspace","username"]},
    method: "get",
    pathTemplate: "/w/{workspace}/users/whois/{username}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"username","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["updateOperatorSettings", {
    name: "updateOperatorSettings",
    description: `Updates the operator settings for a specific workspace. Requires workspace admin privileges.`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":["object","null"],"required":["runs","schedules","resources","assets","variables","triggers","audit_logs","groups","folders","workers"],"properties":{"runs":{"type":"boolean","description":"Whether operators can view runs"},"schedules":{"type":"boolean","description":"Whether operators can view schedules"},"resources":{"type":"boolean","description":"Whether operators can view resources"},"variables":{"type":"boolean","description":"Whether operators can view variables"},"assets":{"type":"boolean","description":"Whether operators can view assets"},"audit_logs":{"type":"boolean","description":"Whether operators can view audit logs"},"triggers":{"type":"boolean","description":"Whether operators can view triggers"},"groups":{"type":"boolean","description":"Whether operators can view groups page"},"folders":{"type":"boolean","description":"Whether operators can view folders page"},"workers":{"type":"boolean","description":"Whether operators can view workers page"}},"description":"The JSON request body."}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/workspaces/operator_settings",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["existsEmail", {
    name: "existsEmail",
    description: `exists email`,
    inputSchema: {"type":"object","properties":{"email":{"type":"string"}},"required":["email"]},
    method: "get",
    pathTemplate: "/users/exists/{email}",
    executionParameters: [{"name":"email","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listUsersAsSuperAdmin", {
    name: "listUsersAsSuperAdmin",
    description: `list all users as super admin (require to be super amdin)`,
    inputSchema: {"type":"object","properties":{"page":{"type":"number","description":"which page to return (start at 1, default 1)"},"per_page":{"type":"number","description":"number of items to return for a given page (default 30, max 100)"},"active_only":{"type":"boolean","description":"filter only active users"}}},
    method: "get",
    pathTemplate: "/users/list_as_super_admin",
    executionParameters: [{"name":"page","in":"query"},{"name":"per_page","in":"query"},{"name":"active_only","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listPendingInvites", {
    name: "listPendingInvites",
    description: `list pending invites for a workspace`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"}},"required":["workspace"]},
    method: "get",
    pathTemplate: "/w/{workspace}/workspaces/list_pending_invites",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getSettings", {
    name: "getSettings",
    description: `get settings`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"}},"required":["workspace"]},
    method: "get",
    pathTemplate: "/w/{workspace}/workspaces/get_settings",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getDeployTo", {
    name: "getDeployTo",
    description: `get deploy to`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"}},"required":["workspace"]},
    method: "get",
    pathTemplate: "/w/{workspace}/workspaces/get_deploy_to",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getIsPremium", {
    name: "getIsPremium",
    description: `get if workspace is premium`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"}},"required":["workspace"]},
    method: "get",
    pathTemplate: "/w/{workspace}/workspaces/is_premium",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getPremiumInfo", {
    name: "getPremiumInfo",
    description: `get premium info`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"}},"required":["workspace"]},
    method: "get",
    pathTemplate: "/w/{workspace}/workspaces/premium_info",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getThresholdAlert", {
    name: "getThresholdAlert",
    description: `get threshold alert info`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"}},"required":["workspace"]},
    method: "get",
    pathTemplate: "/w/{workspace}/workspaces/threshold_alert",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["setThresholdAlert", {
    name: "setThresholdAlert",
    description: `set threshold alert info`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"object","properties":{"threshold_alert_amount":{"type":"number"}},"description":"threshold alert info"}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/workspaces/threshold_alert",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["editSlackCommand", {
    name: "editSlackCommand",
    description: `edit slack command`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"object","properties":{"slack_command_script":{"type":"string"}},"description":"WorkspaceInvite"}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/workspaces/edit_slack_command",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["editTeamsCommand", {
    name: "editTeamsCommand",
    description: `edit teams command`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"object","properties":{"slack_command_script":{"type":"string"}},"description":"WorkspaceInvite"}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/workspaces/edit_teams_command",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listAvailableTeamsIds", {
    name: "listAvailableTeamsIds",
    description: `list available teams ids`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"}},"required":["workspace"]},
    method: "get",
    pathTemplate: "/w/{workspace}/workspaces/available_teams_ids",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listAvailableTeamsChannels", {
    name: "listAvailableTeamsChannels",
    description: `list available teams channels`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"}},"required":["workspace"]},
    method: "get",
    pathTemplate: "/w/{workspace}/workspaces/available_teams_channels",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["connectTeams", {
    name: "connectTeams",
    description: `connect teams`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"object","properties":{"team_id":{"type":"string"},"team_name":{"type":"string"}},"description":"connect teams"}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/workspaces/connect_teams",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["runSlackMessageTestJob", {
    name: "runSlackMessageTestJob",
    description: `run a job that sends a message to Slack`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"object","properties":{"hub_script_path":{"type":"string"},"channel":{"type":"string"},"test_msg":{"type":"string"}},"description":"path to hub script to run and its corresponding args"}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/workspaces/run_slack_message_test_job",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["runTeamsMessageTestJob", {
    name: "runTeamsMessageTestJob",
    description: `run a job that sends a message to Teams`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"object","properties":{"hub_script_path":{"type":"string"},"channel":{"type":"string"},"test_msg":{"type":"string"}},"description":"path to hub script to run and its corresponding args"}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/workspaces/run_teams_message_test_job",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["editDeployTo", {
    name: "editDeployTo",
    description: `edit deploy to`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"object","properties":{"deploy_to":{"type":"string"}},"description":"The JSON request body."}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/workspaces/edit_deploy_to",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["editAutoInvite", {
    name: "editAutoInvite",
    description: `edit auto invite`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"object","properties":{"operator":{"type":"boolean"},"invite_all":{"type":"boolean"},"auto_add":{"type":"boolean"}},"description":"WorkspaceInvite"}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/workspaces/edit_auto_invite",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["editWebhook", {
    name: "editWebhook",
    description: `edit webhook`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"object","properties":{"webhook":{"type":"string"}},"description":"WorkspaceWebhook"}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/workspaces/edit_webhook",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["editCopilotConfig", {
    name: "editCopilotConfig",
    description: `edit copilot config`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"object","properties":{"providers":{"type":"object","additionalProperties":{"type":"object","properties":{"resource_path":{"type":"string"},"models":{"type":"array","items":{"type":"string"}}},"required":["resource_path","models"]}},"default_model":{"type":"object","properties":{"model":{"type":"string"},"provider":{"type":"string","enum":["openai","azure_openai","anthropic","mistral","deepseek","googleai","groq","openrouter","togetherai","customai"]}},"required":["model","provider"]},"code_completion_model":{"type":"object","properties":{"model":{"type":"string"},"provider":{"type":"string","enum":["openai","azure_openai","anthropic","mistral","deepseek","googleai","groq","openrouter","togetherai","customai"]}},"required":["model","provider"]}},"description":"WorkspaceCopilotConfig"}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/workspaces/edit_copilot_config",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getCopilotInfo", {
    name: "getCopilotInfo",
    description: `get copilot info`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"}},"required":["workspace"]},
    method: "get",
    pathTemplate: "/w/{workspace}/workspaces/get_copilot_info",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["editErrorHandler", {
    name: "editErrorHandler",
    description: `edit error handler`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"object","properties":{"error_handler":{"type":"string"},"error_handler_extra_args":{"type":"object","description":"The arguments to pass to the script or flow","additionalProperties":{}},"error_handler_muted_on_cancel":{"type":"boolean"}},"description":"WorkspaceErrorHandler"}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/workspaces/edit_error_handler",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["editLargeFileStorageConfig", {
    name: "editLargeFileStorageConfig",
    description: `edit large file storage settings`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"object","properties":{"large_file_storage":{"type":"object","properties":{"type":{"type":"string","enum":["S3Storage","AzureBlobStorage","AzureWorkloadIdentity","S3AwsOidc","GoogleCloudStorage"]},"s3_resource_path":{"type":"string"},"azure_blob_resource_path":{"type":"string"},"gcs_resource_path":{"type":"string"},"public_resource":{"type":"boolean"},"secondary_storage":{"type":"object","additionalProperties":{"type":"object","properties":{"type":{"type":"string","enum":["S3Storage","AzureBlobStorage","AzureWorkloadIdentity","S3AwsOidc","GoogleCloudStorage"]},"s3_resource_path":{"type":"string"},"azure_blob_resource_path":{"type":"string"},"gcs_resource_path":{"type":"string"},"public_resource":{"type":"boolean"}}}}}}},"description":"LargeFileStorage info"}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/workspaces/edit_large_file_storage_config",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listDucklakes", {
    name: "listDucklakes",
    description: `list ducklakes`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"}},"required":["workspace"]},
    method: "get",
    pathTemplate: "/w/{workspace}/workspaces/list_ducklakes",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["editDucklakeConfig", {
    name: "editDucklakeConfig",
    description: `edit ducklake settings`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"object","required":["settings"],"properties":{"settings":{"type":"object","required":["ducklakes"],"properties":{"ducklakes":{"type":"object","additionalProperties":{"type":"object","required":["catalog","storage"],"properties":{"catalog":{"type":"object","properties":{"resource_type":{"type":"string","enum":["postgresql","mysql","instance"]},"resource_path":{"type":"string"}},"required":["resource_type"]},"storage":{"type":"object","properties":{"storage":{"type":"string"},"path":{"type":"string"}},"required":["path"]}}}}}}},"description":"Ducklake settings"}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/workspaces/edit_ducklake_config",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["editWorkspaceGitSyncConfig", {
    name: "editWorkspaceGitSyncConfig",
    description: `edit workspace git sync settings`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"object","properties":{"git_sync_settings":{"type":"object","properties":{"repositories":{"type":"array","items":{"type":"object","properties":{"script_path":{"type":"string"},"git_repo_resource_path":{"type":"string"},"use_individual_branch":{"type":"boolean"},"group_by_folder":{"type":"boolean"},"collapsed":{"type":"boolean"},"settings":{"type":"object","properties":{"include_path":{"type":"array","items":{"type":"string"}},"include_type":{"type":"array","items":{"type":"string","enum":["script","flow","app","folder","resource","variable","secret","resourcetype","schedule","user","group","trigger","settings","key"]}},"exclude_path":{"type":"array","items":{"type":"string"}},"extra_include_path":{"type":"array","items":{"type":"string"}}}},"exclude_types_override":{"type":"array","items":{"type":"string","enum":["script","flow","app","folder","resource","variable","secret","resourcetype","schedule","user","group","trigger","settings","key"]}}},"required":["script_path","git_repo_resource_path"]}}}}},"description":"Workspace Git sync settings"}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/workspaces/edit_git_sync_config",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["editGitSyncRepository", {
    name: "editGitSyncRepository",
    description: `add or update individual git sync repository`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"object","properties":{"git_repo_resource_path":{"type":"string","description":"The resource path of the git repository to update"},"repository":{"type":"object","properties":{"script_path":{"type":"string"},"git_repo_resource_path":{"type":"string"},"use_individual_branch":{"type":"boolean"},"group_by_folder":{"type":"boolean"},"collapsed":{"type":"boolean"},"settings":{"type":"object","properties":{"include_path":{"type":"array","items":{"type":"string"}},"include_type":{"type":"array","items":{"type":"string","enum":["script","flow","app","folder","resource","variable","secret","resourcetype","schedule","user","group","trigger","settings","key"]}},"exclude_path":{"type":"array","items":{"type":"string"}},"extra_include_path":{"type":"array","items":{"type":"string"}}}},"exclude_types_override":{"type":"array","items":{"type":"string","enum":["script","flow","app","folder","resource","variable","secret","resourcetype","schedule","user","group","trigger","settings","key"]}}},"required":["script_path","git_repo_resource_path"]}},"required":["git_repo_resource_path","repository"],"description":"Git sync repository settings to add or update"}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/workspaces/edit_git_sync_repository",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["deleteGitSyncRepository", {
    name: "deleteGitSyncRepository",
    description: `delete individual git sync repository`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"object","properties":{"git_repo_resource_path":{"type":"string","description":"The resource path of the git repository to delete"}},"required":["git_repo_resource_path"],"description":"Git sync repository to delete"}},"required":["workspace","requestBody"]},
    method: "delete",
    pathTemplate: "/w/{workspace}/workspaces/delete_git_sync_repository",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["editWorkspaceDeployUISettings", {
    name: "editWorkspaceDeployUISettings",
    description: `edit workspace deploy ui settings`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"object","properties":{"deploy_ui_settings":{"type":"object","properties":{"include_path":{"type":"array","items":{"type":"string"}},"include_type":{"type":"array","items":{"type":"string","enum":["script","flow","app","folder","resource","variable","secret","resourcetype","schedule","user","group","trigger","settings","key"]}}}}},"description":"Workspace deploy UI settings"}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/workspaces/edit_deploy_ui_config",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["editWorkspaceDefaultApp", {
    name: "editWorkspaceDefaultApp",
    description: `edit default app for workspace`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"object","properties":{"default_app_path":{"type":"string"}},"description":"Workspace default app"}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/workspaces/edit_default_app",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["get_default_scripts", {
    name: "get_default_scripts",
    description: `get default scripts for workspace`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"}},"required":["workspace"]},
    method: "get",
    pathTemplate: "/w/{workspace}/workspaces/default_scripts",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["editDefaultScripts", {
    name: "editDefaultScripts",
    description: `edit default scripts for workspace`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"object","properties":{"order":{"type":"array","items":{"type":"string"}},"hidden":{"type":"array","items":{"type":"string"}},"default_script_content":{"additionalProperties":{"type":"string"}}},"description":"Workspace default app"}},"required":["workspace"]},
    method: "post",
    pathTemplate: "/w/{workspace}/workspaces/default_scripts",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["setEnvironmentVariable", {
    name: "setEnvironmentVariable",
    description: `set environment variable`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"object","properties":{"name":{"type":"string"},"value":{"type":"string"}},"required":["name"],"description":"Workspace default app"}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/workspaces/set_environment_variable",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getWorkspaceEncryptionKey", {
    name: "getWorkspaceEncryptionKey",
    description: `retrieves the encryption key for this workspace`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"}},"required":["workspace"]},
    method: "get",
    pathTemplate: "/w/{workspace}/workspaces/encryption_key",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["setWorkspaceEncryptionKey", {
    name: "setWorkspaceEncryptionKey",
    description: `update the encryption key for this workspace`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"object","properties":{"new_key":{"type":"string"},"skip_reencrypt":{"type":"boolean"}},"required":["new_key"],"description":"New encryption key"}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/workspaces/encryption_key",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getWorkspaceDefaultApp", {
    name: "getWorkspaceDefaultApp",
    description: `get default app for workspace`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"}},"required":["workspace"]},
    method: "get",
    pathTemplate: "/w/{workspace}/workspaces/default_app",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getLargeFileStorageConfig", {
    name: "getLargeFileStorageConfig",
    description: `get large file storage config`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"}},"required":["workspace"]},
    method: "get",
    pathTemplate: "/w/{workspace}/workspaces/get_large_file_storage_config",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getWorkspaceUsage", {
    name: "getWorkspaceUsage",
    description: `get usage`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"}},"required":["workspace"]},
    method: "get",
    pathTemplate: "/w/{workspace}/workspaces/usage",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getUsedTriggers", {
    name: "getUsedTriggers",
    description: `get used triggers`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"}},"required":["workspace"]},
    method: "get",
    pathTemplate: "/w/{workspace}/workspaces/used_triggers",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listUsers", {
    name: "listUsers",
    description: `list users`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"}},"required":["workspace"]},
    method: "get",
    pathTemplate: "/w/{workspace}/users/list",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listUsersUsage", {
    name: "listUsersUsage",
    description: `list users usage`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"}},"required":["workspace"]},
    method: "get",
    pathTemplate: "/w/{workspace}/users/list_usage",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listUsernames", {
    name: "listUsernames",
    description: `list usernames`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"}},"required":["workspace"]},
    method: "get",
    pathTemplate: "/w/{workspace}/users/list_usernames",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["usernameToEmail", {
    name: "usernameToEmail",
    description: `get email from username`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"username":{"type":"string"}},"required":["workspace","username"]},
    method: "get",
    pathTemplate: "/w/{workspace}/users/username_to_email/{username}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"username","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["ListAvailableScopes", {
    name: "ListAvailableScopes",
    description: `list of available scopes`,
    inputSchema: {"type":"object","properties":{}},
    method: "get",
    pathTemplate: "/tokens/list/scopes",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["createToken", {
    name: "createToken",
    description: `create token`,
    inputSchema: {"type":"object","properties":{"requestBody":{"type":"object","properties":{"label":{"type":"string"},"expiration":{"type":"string","format":"date-time"},"scopes":{"type":"array","items":{"type":"string"}},"workspace_id":{"type":"string"}},"description":"new token"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/users/tokens/create",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["createTokenImpersonate", {
    name: "createTokenImpersonate",
    description: `create token to impersonate a user (require superadmin)`,
    inputSchema: {"type":"object","properties":{"requestBody":{"type":"object","properties":{"label":{"type":"string"},"expiration":{"type":"string","format":"date-time"},"impersonate_email":{"type":"string"},"workspace_id":{"type":"string"}},"required":["impersonate_email"],"description":"new token"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/users/tokens/impersonate",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["deleteToken", {
    name: "deleteToken",
    description: `delete token`,
    inputSchema: {"type":"object","properties":{"token_prefix":{"type":"string"}},"required":["token_prefix"]},
    method: "delete",
    pathTemplate: "/users/tokens/delete/{token_prefix}",
    executionParameters: [{"name":"token_prefix","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listTokens", {
    name: "listTokens",
    description: `list token`,
    inputSchema: {"type":"object","properties":{"exclude_ephemeral":{"type":"boolean"},"page":{"type":"number","description":"which page to return (start at 1, default 1)"},"per_page":{"type":"number","description":"number of items to return for a given page (default 30, max 100)"}}},
    method: "get",
    pathTemplate: "/users/tokens/list",
    executionParameters: [{"name":"exclude_ephemeral","in":"query"},{"name":"page","in":"query"},{"name":"per_page","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getOidcToken", {
    name: "getOidcToken",
    description: `get OIDC token (ee only)`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"audience":{"type":"string"}},"required":["workspace","audience"]},
    method: "post",
    pathTemplate: "/w/{workspace}/oidc/token/{audience}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"audience","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["createVariable", {
    name: "createVariable",
    description: `create variable`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"already_encrypted":{"type":"boolean","description":"whether the variable is already encrypted (default false)"},"requestBody":{"type":"object","properties":{"path":{"type":"string","description":"The path to the variable"},"value":{"type":"string","description":"The value of the variable"},"is_secret":{"type":"boolean","description":"Whether the variable is a secret"},"description":{"type":"string","description":"The description of the variable"},"account":{"type":"number","description":"The account identifier"},"is_oauth":{"type":"boolean","description":"Whether the variable is an OAuth variable"},"expires_at":{"type":"string","description":"The expiration date of the variable","format":"date-time"}},"required":["path","value","is_secret","description"],"description":"new variable"}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/variables/create",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"already_encrypted","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["encryptValue", {
    name: "encryptValue",
    description: `encrypt value`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"string","description":"new variable"}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/variables/encrypt",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["deleteVariable", {
    name: "deleteVariable",
    description: `delete variable`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"}},"required":["workspace","path"]},
    method: "delete",
    pathTemplate: "/w/{workspace}/variables/delete/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["updateVariable", {
    name: "updateVariable",
    description: `update variable`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"},"already_encrypted":{"type":"boolean","description":"whether the variable is already encrypted (default false)"},"requestBody":{"type":"object","properties":{"path":{"type":"string","description":"The path to the variable"},"value":{"type":"string","description":"The new value of the variable"},"is_secret":{"type":"boolean","description":"Whether the variable is a secret"},"description":{"type":"string","description":"The new description of the variable"}},"description":"updated variable"}},"required":["workspace","path","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/variables/update/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"},{"name":"already_encrypted","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getVariable", {
    name: "getVariable",
    description: `get variable`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"},"decrypt_secret":{"type":"boolean","description":"ask to decrypt secret if this variable is secret\n(if not secret no effect, default: true)\n"},"include_encrypted":{"type":"boolean","description":"ask to include the encrypted value if secret and decrypt secret is not true (default: false)\n"}},"required":["workspace","path"]},
    method: "get",
    pathTemplate: "/w/{workspace}/variables/get/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"},{"name":"decrypt_secret","in":"query"},{"name":"include_encrypted","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getVariableValue", {
    name: "getVariableValue",
    description: `get variable value`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"}},"required":["workspace","path"]},
    method: "get",
    pathTemplate: "/w/{workspace}/variables/get_value/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["existsVariable", {
    name: "existsVariable",
    description: `does variable exists at path`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"}},"required":["workspace","path"]},
    method: "get",
    pathTemplate: "/w/{workspace}/variables/exists/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listVariable", {
    name: "listVariable",
    description: `list variables`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path_start":{"type":"string","description":"filter variables by path prefix"},"page":{"type":"number","description":"which page to return (start at 1, default 1)"},"per_page":{"type":"number","description":"number of items to return for a given page (default 30, max 100)"}},"required":["workspace"]},
    method: "get",
    pathTemplate: "/w/{workspace}/variables/list",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path_start","in":"query"},{"name":"page","in":"query"},{"name":"per_page","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listContextualVariables", {
    name: "listContextualVariables",
    description: `list contextual variables`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"}},"required":["workspace"]},
    method: "get",
    pathTemplate: "/w/{workspace}/variables/list_contextual",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getSecondaryStorageNames", {
    name: "getSecondaryStorageNames",
    description: `get secondary storage names`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"}},"required":["workspace"]},
    method: "get",
    pathTemplate: "/w/{workspace}/workspaces/get_secondary_storage_names",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["workspaceGetCriticalAlerts", {
    name: "workspaceGetCriticalAlerts",
    description: `Get all critical alerts for this workspace`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"page":{"type":"number","default":1,"description":"The page number to retrieve (minimum value is 1)"},"page_size":{"type":"number","default":10,"maximum":100,"description":"Number of alerts per page (maximum is 100)"},"acknowledged":{"type":["boolean","null"],"description":"Filter by acknowledgment status; true for acknowledged, false for unacknowledged, and omit for all alerts"}},"required":["workspace"]},
    method: "get",
    pathTemplate: "/w/{workspace}/workspaces/critical_alerts",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"page","in":"query"},{"name":"page_size","in":"query"},{"name":"acknowledged","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["workspaceAcknowledgeCriticalAlert", {
    name: "workspaceAcknowledgeCriticalAlert",
    description: `Acknowledge a critical alert for this workspace`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"id":{"type":"number","description":"The ID of the critical alert to acknowledge"}},"required":["workspace","id"]},
    method: "post",
    pathTemplate: "/w/{workspace}/workspaces/critical_alerts/{id}/acknowledge",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["workspaceAcknowledgeAllCriticalAlerts", {
    name: "workspaceAcknowledgeAllCriticalAlerts",
    description: `Acknowledge all unacknowledged critical alerts for this workspace`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"}},"required":["workspace"]},
    method: "post",
    pathTemplate: "/w/{workspace}/workspaces/critical_alerts/acknowledge_all",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["workspaceMuteCriticalAlertsUI", {
    name: "workspaceMuteCriticalAlertsUI",
    description: `Mute critical alert UI for this workspace`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"object","properties":{"mute_critical_alerts":{"type":"boolean","description":"Whether critical alerts should be muted."}},"description":"Boolean flag to mute critical alerts."}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/workspaces/critical_alerts/mute",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["loginWithOauth", {
    name: "loginWithOauth",
    description: `login with oauth authorization flow`,
    inputSchema: {"type":"object","properties":{"client_name":{"type":"string"},"requestBody":{"type":"object","properties":{"code":{"type":"string"},"state":{"type":"string"}},"description":"Partially filled script"}},"required":["client_name","requestBody"]},
    method: "post",
    pathTemplate: "/oauth/login_callback/{client_name}",
    executionParameters: [{"name":"client_name","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: []
  }],
  ["connectSlackCallback", {
    name: "connectSlackCallback",
    description: `connect slack callback`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"object","properties":{"code":{"type":"string"},"state":{"type":"string"}},"required":["code","state"],"description":"code endpoint"}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/oauth/connect_slack_callback",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["connectSlackCallbackInstance", {
    name: "connectSlackCallbackInstance",
    description: `connect slack callback instance`,
    inputSchema: {"type":"object","properties":{"requestBody":{"type":"object","properties":{"code":{"type":"string"},"state":{"type":"string"}},"required":["code","state"],"description":"code endpoint"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/oauth/connect_slack_callback",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["connectCallback", {
    name: "connectCallback",
    description: `connect callback`,
    inputSchema: {"type":"object","properties":{"client_name":{"type":"string"},"requestBody":{"type":"object","properties":{"code":{"type":"string"},"state":{"type":"string"}},"required":["code","state"],"description":"code endpoint"}},"required":["client_name","requestBody"]},
    method: "post",
    pathTemplate: "/oauth/connect_callback/{client_name}",
    executionParameters: [{"name":"client_name","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["createAccount", {
    name: "createAccount",
    description: `create OAuth account`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"object","properties":{"refresh_token":{"type":"string"},"expires_in":{"type":"number"},"client":{"type":"string"},"grant_type":{"type":"string","default":"authorization_code"},"cc_client_id":{"type":"string","description":"OAuth client ID for resource-level credentials (client_credentials flow only)"},"cc_client_secret":{"type":"string","description":"OAuth client secret for resource-level credentials (client_credentials flow only)"},"cc_token_url":{"type":"string","description":"OAuth token URL override for resource-level authentication (client_credentials flow only)"}},"required":["expires_in","client"],"description":"code endpoint"}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/oauth/create_account",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["connectClientCredentials", {
    name: "connectClientCredentials",
    description: `connect OAuth using client credentials`,
    inputSchema: {"type":"object","properties":{"client":{"type":"string","description":"OAuth client name"},"requestBody":{"type":"object","properties":{"scopes":{"type":"array","items":{"type":"string"}},"cc_client_id":{"type":"string","description":"OAuth client ID for resource-level authentication"},"cc_client_secret":{"type":"string","description":"OAuth client secret for resource-level authentication"},"cc_token_url":{"type":"string","description":"OAuth token URL override for resource-level authentication"}},"required":["cc_client_id","cc_client_secret"],"description":"client credentials flow parameters"}},"required":["client","requestBody"]},
    method: "post",
    pathTemplate: "/oauth/connect_client_credentials/{client}",
    executionParameters: [{"name":"client","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["refreshToken", {
    name: "refreshToken",
    description: `refresh token`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"id":{"type":"number"},"requestBody":{"type":"object","properties":{"path":{"type":"string"}},"required":["path"],"description":"variable path"}},"required":["workspace","id","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/oauth/refresh_token/{id}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["disconnectAccount", {
    name: "disconnectAccount",
    description: `disconnect account`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"id":{"type":"number"}},"required":["workspace","id"]},
    method: "post",
    pathTemplate: "/w/{workspace}/oauth/disconnect/{id}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["disconnectSlack", {
    name: "disconnectSlack",
    description: `disconnect slack`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"}},"required":["workspace"]},
    method: "post",
    pathTemplate: "/w/{workspace}/oauth/disconnect_slack",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["disconnectTeams", {
    name: "disconnectTeams",
    description: `disconnect teams`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"}},"required":["workspace"]},
    method: "post",
    pathTemplate: "/w/{workspace}/oauth/disconnect_teams",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listOAuthLogins", {
    name: "listOAuthLogins",
    description: `list oauth logins`,
    inputSchema: {"type":"object","properties":{}},
    method: "get",
    pathTemplate: "/oauth/list_logins",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listOAuthConnects", {
    name: "listOAuthConnects",
    description: `list oauth connects`,
    inputSchema: {"type":"object","properties":{}},
    method: "get",
    pathTemplate: "/oauth/list_connects",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getOAuthConnect", {
    name: "getOAuthConnect",
    description: `get oauth connect`,
    inputSchema: {"type":"object","properties":{"client":{"type":"string","description":"client name"}},"required":["client"]},
    method: "get",
    pathTemplate: "/oauth/get_connect/{client}",
    executionParameters: [{"name":"client","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["syncTeams", {
    name: "syncTeams",
    description: `synchronize Microsoft Teams information (teams/channels)`,
    inputSchema: {"type":"object","properties":{}},
    method: "post",
    pathTemplate: "/teams/sync",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["sendMessageToConversation", {
    name: "sendMessageToConversation",
    description: `Respond to a Microsoft Teams activity after a workspace command is run`,
    inputSchema: {"type":"object","properties":{"requestBody":{"type":"object","required":["conversation_id","text"],"properties":{"conversation_id":{"type":"string","description":"The ID of the Teams conversation/activity"},"success":{"type":"boolean","description":"Used for styling the card conditionally","default":true},"text":{"type":"string","description":"The message text to be sent in the Teams card"},"card_block":{"type":"object","description":"The card block to be sent in the Teams card"}},"description":"The JSON request body."}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/teams/activities",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["createResource", {
    name: "createResource",
    description: `create resource`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"update_if_exists":{"type":"boolean","description":"update the resource if it already exists (default false)"},"requestBody":{"type":"object","properties":{"path":{"type":"string","description":"The path to the resource"},"value":{},"description":{"type":"string","description":"The description of the resource"},"resource_type":{"type":"string","description":"The resource_type associated with the resource"}},"required":["path","value","resource_type"],"description":"new resource"}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/resources/create",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"update_if_exists","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["deleteResource", {
    name: "deleteResource",
    description: `delete resource`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"}},"required":["workspace","path"]},
    method: "delete",
    pathTemplate: "/w/{workspace}/resources/delete/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["updateResource", {
    name: "updateResource",
    description: `update resource`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"},"requestBody":{"type":"object","properties":{"path":{"type":"string","description":"The path to the resource"},"description":{"type":"string","description":"The new description of the resource"},"value":{},"resource_type":{"type":"string","description":"The new resource_type to be associated with the resource"}},"description":"updated resource"}},"required":["workspace","path","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/resources/update/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["updateResourceValue", {
    name: "updateResourceValue",
    description: `update resource value`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"},"requestBody":{"type":"object","properties":{"value":{}},"description":"updated resource"}},"required":["workspace","path","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/resources/update_value/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getResource", {
    name: "getResource",
    description: `get resource`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"}},"required":["workspace","path"]},
    method: "get",
    pathTemplate: "/w/{workspace}/resources/get/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getResourceValueInterpolated", {
    name: "getResourceValueInterpolated",
    description: `get resource interpolated (variables and resources are fully unrolled)`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"},"job_id":{"type":"string","format":"uuid","description":"job id"}},"required":["workspace","path"]},
    method: "get",
    pathTemplate: "/w/{workspace}/resources/get_value_interpolated/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"},{"name":"job_id","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getResourceValue", {
    name: "getResourceValue",
    description: `get resource value`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"}},"required":["workspace","path"]},
    method: "get",
    pathTemplate: "/w/{workspace}/resources/get_value/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["existsResource", {
    name: "existsResource",
    description: `does resource exists`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"}},"required":["workspace","path"]},
    method: "get",
    pathTemplate: "/w/{workspace}/resources/exists/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listResource", {
    name: "listResource",
    description: `list resources`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"page":{"type":"number","description":"which page to return (start at 1, default 1)"},"per_page":{"type":"number","description":"number of items to return for a given page (default 30, max 100)"},"resource_type":{"type":"string","description":"resource_types to list from, separated by ',',"},"resource_type_exclude":{"type":"string","description":"resource_types to not list from, separated by ',',"},"path_start":{"type":"string","description":"filter resources by path prefix"}},"required":["workspace"]},
    method: "get",
    pathTemplate: "/w/{workspace}/resources/list",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"page","in":"query"},{"name":"per_page","in":"query"},{"name":"resource_type","in":"query"},{"name":"resource_type_exclude","in":"query"},{"name":"path_start","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listSearchResource", {
    name: "listSearchResource",
    description: `list resources for search`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"}},"required":["workspace"]},
    method: "get",
    pathTemplate: "/w/{workspace}/resources/list_search",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listResourceNames", {
    name: "listResourceNames",
    description: `list resource names`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"name":{"type":"string"}},"required":["workspace","name"]},
    method: "get",
    pathTemplate: "/w/{workspace}/resources/list_names/{name}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"name","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["createResourceType", {
    name: "createResourceType",
    description: `create resource_type`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"object","properties":{"workspace_id":{"type":"string"},"name":{"type":"string"},"schema":{},"description":{"type":"string"},"created_by":{"type":"string"},"edited_at":{"type":"string","format":"date-time"},"format_extension":{"type":"string"}},"required":["name"],"description":"new resource_type"}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/resources/type/create",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["fileResourceTypeToFileExtMap", {
    name: "fileResourceTypeToFileExtMap",
    description: `get map from resource type to format extension`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"}},"required":["workspace"]},
    method: "get",
    pathTemplate: "/w/{workspace}/resources/file_resource_type_to_file_ext_map",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["deleteResourceType", {
    name: "deleteResourceType",
    description: `delete resource_type`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"}},"required":["workspace","path"]},
    method: "delete",
    pathTemplate: "/w/{workspace}/resources/type/delete/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["updateResourceType", {
    name: "updateResourceType",
    description: `update resource_type`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"},"requestBody":{"type":"object","properties":{"schema":{},"description":{"type":"string"}},"description":"updated resource_type"}},"required":["workspace","path","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/resources/type/update/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getResourceType", {
    name: "getResourceType",
    description: `get resource_type`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"}},"required":["workspace","path"]},
    method: "get",
    pathTemplate: "/w/{workspace}/resources/type/get/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["existsResourceType", {
    name: "existsResourceType",
    description: `does resource_type exists`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"}},"required":["workspace","path"]},
    method: "get",
    pathTemplate: "/w/{workspace}/resources/type/exists/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listResourceType", {
    name: "listResourceType",
    description: `list resource_types`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"}},"required":["workspace"]},
    method: "get",
    pathTemplate: "/w/{workspace}/resources/type/list",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listResourceTypeNames", {
    name: "listResourceTypeNames",
    description: `list resource_types names`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"}},"required":["workspace"]},
    method: "get",
    pathTemplate: "/w/{workspace}/resources/type/listnames",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["queryResourceTypes", {
    name: "queryResourceTypes",
    description: `query resource types by similarity`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"text":{"type":"string","description":"query text"},"limit":{"type":"number","description":"query limit"}},"required":["workspace","text"]},
    method: "get",
    pathTemplate: "/w/{workspace}/embeddings/query_resource_types",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"text","in":"query"},{"name":"limit","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listHubIntegrations", {
    name: "listHubIntegrations",
    description: `list hub integrations`,
    inputSchema: {"type":"object","properties":{"kind":{"type":"string","description":"query integrations kind"}}},
    method: "get",
    pathTemplate: "/integrations/hub/list",
    executionParameters: [{"name":"kind","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listHubFlows", {
    name: "listHubFlows",
    description: `list all hub flows`,
    inputSchema: {"type":"object","properties":{}},
    method: "get",
    pathTemplate: "/flows/hub/list",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getHubFlowById", {
    name: "getHubFlowById",
    description: `get hub flow by id`,
    inputSchema: {"type":"object","properties":{"id":{"type":"number"}},"required":["id"]},
    method: "get",
    pathTemplate: "/flows/hub/get/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listHubApps", {
    name: "listHubApps",
    description: `list all hub apps`,
    inputSchema: {"type":"object","properties":{}},
    method: "get",
    pathTemplate: "/apps/hub/list",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getHubAppById", {
    name: "getHubAppById",
    description: `get hub app by id`,
    inputSchema: {"type":"object","properties":{"id":{"type":"number"}},"required":["id"]},
    method: "get",
    pathTemplate: "/apps/hub/get/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getPublicAppByCustomPath", {
    name: "getPublicAppByCustomPath",
    description: `get public app by custom path`,
    inputSchema: {"type":"object","properties":{"custom_path":{"type":"string"}},"required":["custom_path"]},
    method: "get",
    pathTemplate: "/apps_u/public_app_by_custom_path/{custom_path}",
    executionParameters: [{"name":"custom_path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getHubScriptContentByPath", {
    name: "getHubScriptContentByPath",
    description: `get hub script content by path`,
    inputSchema: {"type":"object","properties":{"path":{"type":"string"}},"required":["path"]},
    method: "get",
    pathTemplate: "/scripts/hub/get/{path}",
    executionParameters: [{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getHubScriptByPath", {
    name: "getHubScriptByPath",
    description: `get full hub script by path`,
    inputSchema: {"type":"object","properties":{"path":{"type":"string"}},"required":["path"]},
    method: "get",
    pathTemplate: "/scripts/hub/get_full/{path}",
    executionParameters: [{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getTopHubScripts", {
    name: "getTopHubScripts",
    description: `get top hub scripts`,
    inputSchema: {"type":"object","properties":{"limit":{"type":"number","description":"query limit"},"app":{"type":"string","description":"query scripts app"},"kind":{"type":"string","description":"query scripts kind"}}},
    method: "get",
    pathTemplate: "/scripts/hub/top",
    executionParameters: [{"name":"limit","in":"query"},{"name":"app","in":"query"},{"name":"kind","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["queryHubScripts", {
    name: "queryHubScripts",
    description: `query hub scripts by similarity`,
    inputSchema: {"type":"object","properties":{"text":{"type":"string","description":"query text"},"kind":{"type":"string","description":"query scripts kind"},"limit":{"type":"number","description":"query limit"},"app":{"type":"string","description":"query scripts app"}},"required":["text"]},
    method: "get",
    pathTemplate: "/embeddings/query_hub_scripts",
    executionParameters: [{"name":"text","in":"query"},{"name":"kind","in":"query"},{"name":"limit","in":"query"},{"name":"app","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listSearchScript", {
    name: "listSearchScript",
    description: `list scripts for search`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"}},"required":["workspace"]},
    method: "get",
    pathTemplate: "/w/{workspace}/scripts/list_search",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listScripts", {
    name: "listScripts",
    description: `list all scripts`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"page":{"type":"number","description":"which page to return (start at 1, default 1)"},"per_page":{"type":"number","description":"number of items to return for a given page (default 30, max 100)"},"order_desc":{"type":"boolean","description":"order by desc order (default true)"},"created_by":{"type":"string","description":"mask to filter exact matching user creator"},"path_start":{"type":"string","description":"mask to filter matching starting path"},"path_exact":{"type":"string","description":"mask to filter exact matching path"},"first_parent_hash":{"type":"string","description":"mask to filter scripts whom first direct parent has exact hash"},"last_parent_hash":{"type":"string","description":"mask to filter scripts whom last parent in the chain has exact hash.\nBeware that each script stores only a limited number of parents. Hence\nthe last parent hash for a script is not necessarily its top-most parent.\nTo find the top-most parent you will have to jump from last to last hash\n until finding the parent\n"},"parent_hash":{"type":"string","description":"is the hash present in the array of stored parent hashes for this script.\nThe same warning applies than for last_parent_hash. A script only store a\nlimited number of direct parent\n"},"show_archived":{"type":"boolean","description":"(default false)\nshow only the archived files.\nwhen multiple archived hash share the same path, only the ones with the latest create_at\nare\ned.\n"},"include_without_main":{"type":"boolean","description":"(default false)\ninclude scripts without an exported main function\n"},"include_draft_only":{"type":"boolean","description":"(default false)\ninclude scripts that have no deployed version\n"},"is_template":{"type":"boolean","description":"(default regardless)\nif true show only the templates\nif false show only the non templates\nif not defined, show all regardless of if the script is a template\n"},"kinds":{"type":"string","description":"(default regardless)\nscript kinds to filter, split by comma\n"},"starred_only":{"type":"boolean","description":"(default false)\nshow only the starred items\n"},"with_deployment_msg":{"type":"boolean","description":"(default false)\ninclude deployment message\n"},"languages":{"type":"string","description":"Filter to only include scripts written in the given languages.\nAccepts multiple values as a comma-separated list.\n"}},"required":["workspace"]},
    method: "get",
    pathTemplate: "/w/{workspace}/scripts/list",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"page","in":"query"},{"name":"per_page","in":"query"},{"name":"order_desc","in":"query"},{"name":"created_by","in":"query"},{"name":"path_start","in":"query"},{"name":"path_exact","in":"query"},{"name":"first_parent_hash","in":"query"},{"name":"last_parent_hash","in":"query"},{"name":"parent_hash","in":"query"},{"name":"show_archived","in":"query"},{"name":"include_without_main","in":"query"},{"name":"include_draft_only","in":"query"},{"name":"is_template","in":"query"},{"name":"kinds","in":"query"},{"name":"starred_only","in":"query"},{"name":"with_deployment_msg","in":"query"},{"name":"languages","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listScriptPaths", {
    name: "listScriptPaths",
    description: `list all scripts paths`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"}},"required":["workspace"]},
    method: "get",
    pathTemplate: "/w/{workspace}/scripts/list_paths",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["createDraft", {
    name: "createDraft",
    description: `create draft`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"object","properties":{"path":{"type":"string"},"typ":{"type":"string","enum":["flow","script","app"]},"value":{}},"required":["path","typ","enum"],"description":"The JSON request body."}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/drafts/create",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["deleteDraft", {
    name: "deleteDraft",
    description: `delete draft`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"kind":{"type":"string","enum":["script","flow","app"]},"path":{"type":"string"}},"required":["workspace","kind","path"]},
    method: "delete",
    pathTemplate: "/w/{workspace}/drafts/delete/{kind}/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"kind","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["createScript", {
    name: "createScript",
    description: `create script`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"object","properties":{"path":{"type":"string"},"parent_hash":{"type":"string"},"summary":{"type":"string"},"description":{"type":"string"},"content":{"type":"string"},"schema":{"type":"object"},"is_template":{"type":"boolean"},"lock":{"type":"string"},"language":{"type":"string","enum":["python3","deno","go","bash","powershell","postgresql","mysql","bigquery","snowflake","mssql","oracledb","graphql","nativets","bun","php","rust","ansible","csharp","nu","java","duckdb"]},"kind":{"type":"string","enum":["script","failure","trigger","command","approval","preprocessor"]},"tag":{"type":"string"},"draft_only":{"type":"boolean"},"envs":{"type":"array","items":{"type":"string"}},"concurrent_limit":{"type":"number"},"concurrency_time_window_s":{"type":"number"},"cache_ttl":{"type":"number"},"dedicated_worker":{"type":"boolean"},"ws_error_handler_muted":{"type":"boolean"},"priority":{"type":"number"},"restart_unless_cancelled":{"type":"boolean"},"timeout":{"type":"number"},"delete_after_use":{"type":"boolean"},"deployment_message":{"type":"string"},"concurrency_key":{"type":"string"},"visible_to_runner_only":{"type":"boolean"},"no_main_func":{"type":"boolean"},"codebase":{"type":"string"},"has_preprocessor":{"type":"boolean"},"on_behalf_of_email":{"type":"string"},"assets":{"type":"array","items":{"type":"object","required":["path","kind"],"properties":{"path":{"type":"string"},"kind":{"type":"string","enum":["s3object","resource","ducklake"]},"access_type":{"type":"string","enum":["r","w","rw"]},"alt_access_type":{"type":"string","enum":["r","w","rw"]}}}}},"required":["path","summary","description","content","language"],"description":"Partially filled script"}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/scripts/create",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["toggleWorkspaceErrorHandlerForScript", {
    name: "toggleWorkspaceErrorHandlerForScript",
    description: `Toggle ON and OFF the workspace error handler for a given script`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"},"requestBody":{"type":"object","properties":{"muted":{"type":"boolean"}},"description":"Workspace error handler enabled"}},"required":["workspace","path","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/scripts/toggle_workspace_error_handler/p/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getCustomTags", {
    name: "getCustomTags",
    description: `get all instance custom tags (tags are used to dispatch jobs to different worker groups)`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"show_workspace_restriction":{"type":"boolean"}}},
    method: "get",
    pathTemplate: "/workers/custom_tags",
    executionParameters: [{"name":"workspace","in":"query"},{"name":"show_workspace_restriction","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["geDefaultTags", {
    name: "geDefaultTags",
    description: `get all instance default tags`,
    inputSchema: {"type":"object","properties":{}},
    method: "get",
    pathTemplate: "/workers/get_default_tags",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["isDefaultTagsPerWorkspace", {
    name: "isDefaultTagsPerWorkspace",
    description: `is default tags per workspace`,
    inputSchema: {"type":"object","properties":{}},
    method: "get",
    pathTemplate: "/workers/is_default_tags_per_workspace",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["archiveScriptByPath", {
    name: "archiveScriptByPath",
    description: `archive script by path`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"}},"required":["workspace","path"]},
    method: "post",
    pathTemplate: "/w/{workspace}/scripts/archive/p/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["archiveScriptByHash", {
    name: "archiveScriptByHash",
    description: `archive script by hash`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"hash":{"type":"string"}},"required":["workspace","hash"]},
    method: "post",
    pathTemplate: "/w/{workspace}/scripts/archive/h/{hash}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"hash","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["deleteScriptByHash", {
    name: "deleteScriptByHash",
    description: `delete script by hash (erase content but keep hash, require admin)`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"hash":{"type":"string"}},"required":["workspace","hash"]},
    method: "post",
    pathTemplate: "/w/{workspace}/scripts/delete/h/{hash}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"hash","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["deleteScriptByPath", {
    name: "deleteScriptByPath",
    description: `delete script at a given path (require admin)`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"},"keep_captures":{"type":"boolean","description":"keep captures"}},"required":["workspace","path"]},
    method: "post",
    pathTemplate: "/w/{workspace}/scripts/delete/p/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"},{"name":"keep_captures","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getScriptByPath", {
    name: "getScriptByPath",
    description: `get script by path`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"},"with_starred_info":{"type":"boolean"}},"required":["workspace","path"]},
    method: "get",
    pathTemplate: "/w/{workspace}/scripts/get/p/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"},{"name":"with_starred_info","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getTriggersCountOfScript", {
    name: "getTriggersCountOfScript",
    description: `get triggers count of script`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"}},"required":["workspace","path"]},
    method: "get",
    pathTemplate: "/w/{workspace}/scripts/get_triggers_count/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listTokensOfScript", {
    name: "listTokensOfScript",
    description: `get tokens with script scope`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"}},"required":["workspace","path"]},
    method: "get",
    pathTemplate: "/w/{workspace}/scripts/list_tokens/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getScriptByPathWithDraft", {
    name: "getScriptByPathWithDraft",
    description: `get script by path with draft`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"}},"required":["workspace","path"]},
    method: "get",
    pathTemplate: "/w/{workspace}/scripts/get/draft/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getScriptHistoryByPath", {
    name: "getScriptHistoryByPath",
    description: `get history of a script by path`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"}},"required":["workspace","path"]},
    method: "get",
    pathTemplate: "/w/{workspace}/scripts/history/p/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listScriptPathsFromWorkspaceRunnable", {
    name: "listScriptPathsFromWorkspaceRunnable",
    description: `list script paths using provided script as a relative import`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"}},"required":["workspace","path"]},
    method: "get",
    pathTemplate: "/w/{workspace}/scripts/list_paths_from_workspace_runnable/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getScriptLatestVersion", {
    name: "getScriptLatestVersion",
    description: `get scripts's latest version (hash)`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"}},"required":["workspace","path"]},
    method: "get",
    pathTemplate: "/w/{workspace}/scripts/get_latest_version/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["updateScriptHistory", {
    name: "updateScriptHistory",
    description: `update history of a script`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"hash":{"type":"string"},"path":{"type":"string"},"requestBody":{"type":"object","properties":{"deployment_msg":{"type":"string"}},"description":"Script deployment message"}},"required":["workspace","hash","path","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/scripts/history_update/h/{hash}/p/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"hash","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["rawScriptByPath", {
    name: "rawScriptByPath",
    description: `raw script by path`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"}},"required":["workspace","path"]},
    method: "get",
    pathTemplate: "/w/{workspace}/scripts/raw/p/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["rawScriptByPathTokened", {
    name: "rawScriptByPathTokened",
    description: `raw script by path with a token (mostly used by lsp to be used with import maps to resolve scripts)`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"token":{"type":"string"},"path":{"type":"string"}},"required":["workspace","token","path"]},
    method: "get",
    pathTemplate: "/scripts_u/tokened_raw/{workspace}/{token}/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"token","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["existsScriptByPath", {
    name: "existsScriptByPath",
    description: `exists script by path`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"}},"required":["workspace","path"]},
    method: "get",
    pathTemplate: "/w/{workspace}/scripts/exists/p/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getScriptByHash", {
    name: "getScriptByHash",
    description: `get script by hash`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"hash":{"type":"string"},"with_starred_info":{"type":"boolean"},"authed":{"type":"boolean"}},"required":["workspace","hash"]},
    method: "get",
    pathTemplate: "/w/{workspace}/scripts/get/h/{hash}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"hash","in":"path"},{"name":"with_starred_info","in":"query"},{"name":"authed","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["rawScriptByHash", {
    name: "rawScriptByHash",
    description: `raw script by hash`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"}},"required":["workspace","path"]},
    method: "get",
    pathTemplate: "/w/{workspace}/scripts/raw/h/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getScriptDeploymentStatus", {
    name: "getScriptDeploymentStatus",
    description: `get script deployment status`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"hash":{"type":"string"}},"required":["workspace","hash"]},
    method: "get",
    pathTemplate: "/w/{workspace}/scripts/deployment_status/h/{hash}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"hash","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listSelectedJobGroups", {
    name: "listSelectedJobGroups",
    description: `list selected jobs script/flow schemas grouped by (kind, path)`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"array","items":{"type":"string","format":"uuid"},"description":"script args"}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/jobs/list_selected_job_groups",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["runScriptByPath", {
    name: "runScriptByPath",
    description: `run script by path`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"},"scheduled_for":{"type":"string","format":"date-time","description":"when to schedule this job (leave empty for immediate run)"},"scheduled_in_secs":{"type":"number","description":"schedule the script to execute in the number of seconds starting now"},"skip_preprocessor":{"type":"boolean","description":"skip the preprocessor"},"parent_job":{"type":"string","format":"uuid","description":"The parent job that is at the origin and responsible for the execution of this script if any"},"tag":{"type":"string","description":"Override the tag to use"},"cache_ttl":{"type":"string","description":"Override the cache time to live (in seconds). Can not be used to disable caching, only override with a new cache ttl"},"job_id":{"type":"string","format":"uuid","description":"The job id to assign to the created job. if missing, job is chosen randomly using the ULID scheme. If a job id already exists in the queue or as a completed job, the request to create one will fail (Bad Request)"},"invisible_to_owner":{"type":"boolean","description":"make the run invisible to the the script owner (default false)"},"requestBody":{"type":"object","description":"script args","additionalProperties":{}}},"required":["workspace","path","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/jobs/run/p/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"},{"name":"scheduled_for","in":"query"},{"name":"scheduled_in_secs","in":"query"},{"name":"skip_preprocessor","in":"query"},{"name":"parent_job","in":"query"},{"name":"tag","in":"query"},{"name":"cache_ttl","in":"query"},{"name":"job_id","in":"query"},{"name":"invisible_to_owner","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["openaiSyncScriptByPath", {
    name: "openaiSyncScriptByPath",
    description: `run script by path in openai format`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"},"parent_job":{"type":"string","format":"uuid","description":"The parent job that is at the origin and responsible for the execution of this script if any"},"job_id":{"type":"string","format":"uuid","description":"The job id to assign to the created job. if missing, job is chosen randomly using the ULID scheme. If a job id already exists in the queue or as a completed job, the request to create one will fail (Bad Request)"},"include_header":{"type":"string","description":"List of headers's keys (separated with ',') whove value are added to the args\nHeader's key lowercased and '-'' replaced to '_' such that 'Content-Type' becomes the 'content_type' arg key\n"},"queue_limit":{"type":"string","description":"The maximum size of the queue for which the request would get rejected if that job would push it above that limit\n"},"requestBody":{"type":"object","description":"script args","additionalProperties":{}}},"required":["workspace","path","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/jobs/openai_sync/p/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"},{"name":"parent_job","in":"query"},{"name":"job_id","in":"query"},{"name":"include_header","in":"query"},{"name":"queue_limit","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["runWaitResultScriptByPathGet", {
    name: "runWaitResultScriptByPathGet",
    description: `run script by path with get`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"},"parent_job":{"type":"string","format":"uuid","description":"The parent job that is at the origin and responsible for the execution of this script if any"},"tag":{"type":"string","description":"Override the tag to use"},"cache_ttl":{"type":"string","description":"Override the cache time to live (in seconds). Can not be used to disable caching, only override with a new cache ttl"},"job_id":{"type":"string","format":"uuid","description":"The job id to assign to the created job. if missing, job is chosen randomly using the ULID scheme. If a job id already exists in the queue or as a completed job, the request to create one will fail (Bad Request)"},"include_header":{"type":"string","description":"List of headers's keys (separated with ',') whove value are added to the args\nHeader's key lowercased and '-'' replaced to '_' such that 'Content-Type' becomes the 'content_type' arg key\n"},"queue_limit":{"type":"string","description":"The maximum size of the queue for which the request would get rejected if that job would push it above that limit\n"},"payload":{"type":"string","description":"The base64 encoded payload that has been encoded as a JSON. e.g how to encode such payload encodeURIComponent\n`encodeURIComponent(btoa(JSON.stringify({a: 2})))`\n"}},"required":["workspace","path"]},
    method: "get",
    pathTemplate: "/w/{workspace}/jobs/run_wait_result/p/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"},{"name":"parent_job","in":"query"},{"name":"tag","in":"query"},{"name":"cache_ttl","in":"query"},{"name":"job_id","in":"query"},{"name":"include_header","in":"query"},{"name":"queue_limit","in":"query"},{"name":"payload","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["runWaitResultScriptByPath", {
    name: "runWaitResultScriptByPath",
    description: `run script by path`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"},"parent_job":{"type":"string","format":"uuid","description":"The parent job that is at the origin and responsible for the execution of this script if any"},"tag":{"type":"string","description":"Override the tag to use"},"cache_ttl":{"type":"string","description":"Override the cache time to live (in seconds). Can not be used to disable caching, only override with a new cache ttl"},"job_id":{"type":"string","format":"uuid","description":"The job id to assign to the created job. if missing, job is chosen randomly using the ULID scheme. If a job id already exists in the queue or as a completed job, the request to create one will fail (Bad Request)"},"include_header":{"type":"string","description":"List of headers's keys (separated with ',') whove value are added to the args\nHeader's key lowercased and '-'' replaced to '_' such that 'Content-Type' becomes the 'content_type' arg key\n"},"queue_limit":{"type":"string","description":"The maximum size of the queue for which the request would get rejected if that job would push it above that limit\n"},"requestBody":{"type":"object","description":"script args","additionalProperties":{}}},"required":["workspace","path","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/jobs/run_wait_result/p/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"},{"name":"parent_job","in":"query"},{"name":"tag","in":"query"},{"name":"cache_ttl","in":"query"},{"name":"job_id","in":"query"},{"name":"include_header","in":"query"},{"name":"queue_limit","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["openaiSyncFlowByPath", {
    name: "openaiSyncFlowByPath",
    description: `run flow by path and wait until completion in openai format`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"},"include_header":{"type":"string","description":"List of headers's keys (separated with ',') whove value are added to the args\nHeader's key lowercased and '-'' replaced to '_' such that 'Content-Type' becomes the 'content_type' arg key\n"},"queue_limit":{"type":"string","description":"The maximum size of the queue for which the request would get rejected if that job would push it above that limit\n"},"job_id":{"type":"string","format":"uuid","description":"The job id to assign to the created job. if missing, job is chosen randomly using the ULID scheme. If a job id already exists in the queue or as a completed job, the request to create one will fail (Bad Request)"},"requestBody":{"type":"object","description":"script args","additionalProperties":{}}},"required":["workspace","path","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/jobs/openai_sync/f/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"},{"name":"include_header","in":"query"},{"name":"queue_limit","in":"query"},{"name":"job_id","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["runWaitResultFlowByPath", {
    name: "runWaitResultFlowByPath",
    description: `run flow by path and wait until completion`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"},"include_header":{"type":"string","description":"List of headers's keys (separated with ',') whove value are added to the args\nHeader's key lowercased and '-'' replaced to '_' such that 'Content-Type' becomes the 'content_type' arg key\n"},"queue_limit":{"type":"string","description":"The maximum size of the queue for which the request would get rejected if that job would push it above that limit\n"},"job_id":{"type":"string","format":"uuid","description":"The job id to assign to the created job. if missing, job is chosen randomly using the ULID scheme. If a job id already exists in the queue or as a completed job, the request to create one will fail (Bad Request)"},"requestBody":{"type":"object","description":"script args","additionalProperties":{}}},"required":["workspace","path","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/jobs/run_wait_result/f/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"},{"name":"include_header","in":"query"},{"name":"queue_limit","in":"query"},{"name":"job_id","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["resultById", {
    name: "resultById",
    description: `get job result by id`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"flow_job_id":{"type":"string"},"node_id":{"type":"string"}},"required":["workspace","flow_job_id","node_id"]},
    method: "get",
    pathTemplate: "/w/{workspace}/jobs/result_by_id/{flow_job_id}/{node_id}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"flow_job_id","in":"path"},{"name":"node_id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listFlowPaths", {
    name: "listFlowPaths",
    description: `list all flow paths`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"}},"required":["workspace"]},
    method: "get",
    pathTemplate: "/w/{workspace}/flows/list_paths",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listSearchFlow", {
    name: "listSearchFlow",
    description: `list flows for search`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"}},"required":["workspace"]},
    method: "get",
    pathTemplate: "/w/{workspace}/flows/list_search",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listFlows", {
    name: "listFlows",
    description: `list all flows`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"page":{"type":"number","description":"which page to return (start at 1, default 1)"},"per_page":{"type":"number","description":"number of items to return for a given page (default 30, max 100)"},"order_desc":{"type":"boolean","description":"order by desc order (default true)"},"created_by":{"type":"string","description":"mask to filter exact matching user creator"},"path_start":{"type":"string","description":"mask to filter matching starting path"},"path_exact":{"type":"string","description":"mask to filter exact matching path"},"show_archived":{"type":"boolean","description":"(default false)\nshow only the archived files.\nwhen multiple archived hash share the same path, only the ones with the latest create_at\nare displayed.\n"},"starred_only":{"type":"boolean","description":"(default false)\nshow only the starred items\n"},"include_draft_only":{"type":"boolean","description":"(default false)\ninclude items that have no deployed version\n"},"with_deployment_msg":{"type":"boolean","description":"(default false)\ninclude deployment message\n"}},"required":["workspace"]},
    method: "get",
    pathTemplate: "/w/{workspace}/flows/list",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"page","in":"query"},{"name":"per_page","in":"query"},{"name":"order_desc","in":"query"},{"name":"created_by","in":"query"},{"name":"path_start","in":"query"},{"name":"path_exact","in":"query"},{"name":"show_archived","in":"query"},{"name":"starred_only","in":"query"},{"name":"include_draft_only","in":"query"},{"name":"with_deployment_msg","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getFlowHistory", {
    name: "getFlowHistory",
    description: `get flow history by path`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"}},"required":["workspace","path"]},
    method: "get",
    pathTemplate: "/w/{workspace}/flows/history/p/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getFlowLatestVersion", {
    name: "getFlowLatestVersion",
    description: `get flow's latest version`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"}},"required":["workspace","path"]},
    method: "get",
    pathTemplate: "/w/{workspace}/flows/get_latest_version/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listFlowPathsFromWorkspaceRunnable", {
    name: "listFlowPathsFromWorkspaceRunnable",
    description: `list flow paths from workspace runnable`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"runnable_kind":{"type":"string","enum":["script","flow"]},"path":{"type":"string"}},"required":["workspace","runnable_kind","path"]},
    method: "get",
    pathTemplate: "/w/{workspace}/flows/list_paths_from_workspace_runnable/{runnable_kind}/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"runnable_kind","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getFlowVersion", {
    name: "getFlowVersion",
    description: `get flow version`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"version":{"type":"number"},"path":{"type":"string"}},"required":["workspace","version","path"]},
    method: "get",
    pathTemplate: "/w/{workspace}/flows/get/v/{version}/p/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"version","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["updateFlowHistory", {
    name: "updateFlowHistory",
    description: `update flow history`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"version":{"type":"number"},"path":{"type":"string"},"requestBody":{"type":"object","properties":{"deployment_msg":{"type":"string"}},"required":["deployment_msg"],"description":"Flow deployment message"}},"required":["workspace","version","path","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/flows/history_update/v/{version}/p/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"version","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getFlowByPath", {
    name: "getFlowByPath",
    description: `get flow by path`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"},"with_starred_info":{"type":"boolean"}},"required":["workspace","path"]},
    method: "get",
    pathTemplate: "/w/{workspace}/flows/get/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"},{"name":"with_starred_info","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getFlowDeploymentStatus", {
    name: "getFlowDeploymentStatus",
    description: `get flow deployment status`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"}},"required":["workspace","path"]},
    method: "get",
    pathTemplate: "/w/{workspace}/flows/deployment_status/p/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getTriggersCountOfFlow", {
    name: "getTriggersCountOfFlow",
    description: `get triggers count of flow`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"}},"required":["workspace","path"]},
    method: "get",
    pathTemplate: "/w/{workspace}/flows/get_triggers_count/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listTokensOfFlow", {
    name: "listTokensOfFlow",
    description: `get tokens with flow scope`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"}},"required":["workspace","path"]},
    method: "get",
    pathTemplate: "/w/{workspace}/flows/list_tokens/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["toggleWorkspaceErrorHandlerForFlow", {
    name: "toggleWorkspaceErrorHandlerForFlow",
    description: `Toggle ON and OFF the workspace error handler for a given flow`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"},"requestBody":{"type":"object","properties":{"muted":{"type":"boolean"}},"description":"Workspace error handler enabled"}},"required":["workspace","path","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/flows/toggle_workspace_error_handler/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getFlowByPathWithDraft", {
    name: "getFlowByPathWithDraft",
    description: `get flow by path with draft`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"}},"required":["workspace","path"]},
    method: "get",
    pathTemplate: "/w/{workspace}/flows/get/draft/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["existsFlowByPath", {
    name: "existsFlowByPath",
    description: `exists flow by path`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"}},"required":["workspace","path"]},
    method: "get",
    pathTemplate: "/w/{workspace}/flows/exists/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["createFlow", {
    name: "createFlow",
    description: `create flow`,
    inputSchema: {},
    method: "post",
    pathTemplate: "/w/{workspace}/flows/create",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["updateFlow", {
    name: "updateFlow",
    description: `update flow`,
    inputSchema: {},
    method: "post",
    pathTemplate: "/w/{workspace}/flows/update/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["archiveFlowByPath", {
    name: "archiveFlowByPath",
    description: `archive flow by path`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"},"requestBody":{"type":"object","properties":{"archived":{"type":"boolean"}},"description":"archiveFlow"}},"required":["workspace","path","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/flows/archive/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["deleteFlowByPath", {
    name: "deleteFlowByPath",
    description: `delete flow by path`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"},"keep_captures":{"type":"boolean","description":"keep captures"}},"required":["workspace","path"]},
    method: "delete",
    pathTemplate: "/w/{workspace}/flows/delete/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"},{"name":"keep_captures","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listRawApps", {
    name: "listRawApps",
    description: `list all raw apps`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"page":{"type":"number","description":"which page to return (start at 1, default 1)"},"per_page":{"type":"number","description":"number of items to return for a given page (default 30, max 100)"},"order_desc":{"type":"boolean","description":"order by desc order (default true)"},"created_by":{"type":"string","description":"mask to filter exact matching user creator"},"path_start":{"type":"string","description":"mask to filter matching starting path"},"path_exact":{"type":"string","description":"mask to filter exact matching path"},"starred_only":{"type":"boolean","description":"(default false)\nshow only the starred items\n"}},"required":["workspace"]},
    method: "get",
    pathTemplate: "/w/{workspace}/raw_apps/list",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"page","in":"query"},{"name":"per_page","in":"query"},{"name":"order_desc","in":"query"},{"name":"created_by","in":"query"},{"name":"path_start","in":"query"},{"name":"path_exact","in":"query"},{"name":"starred_only","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["existsRawApp", {
    name: "existsRawApp",
    description: `does an app exisst at path`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"}},"required":["workspace","path"]},
    method: "get",
    pathTemplate: "/w/{workspace}/raw_apps/exists/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getRawAppData", {
    name: "getRawAppData",
    description: `get app by path`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"version":{"type":"number"},"path":{"type":"string"}},"required":["workspace","version","path"]},
    method: "get",
    pathTemplate: "/w/{workspace}/apps/get_data/{version}/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"version","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listSearchApp", {
    name: "listSearchApp",
    description: `list apps for search`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"}},"required":["workspace"]},
    method: "get",
    pathTemplate: "/w/{workspace}/apps/list_search",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listApps", {
    name: "listApps",
    description: `list all apps`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"page":{"type":"number","description":"which page to return (start at 1, default 1)"},"per_page":{"type":"number","description":"number of items to return for a given page (default 30, max 100)"},"order_desc":{"type":"boolean","description":"order by desc order (default true)"},"created_by":{"type":"string","description":"mask to filter exact matching user creator"},"path_start":{"type":"string","description":"mask to filter matching starting path"},"path_exact":{"type":"string","description":"mask to filter exact matching path"},"starred_only":{"type":"boolean","description":"(default false)\nshow only the starred items\n"},"include_draft_only":{"type":"boolean","description":"(default false)\ninclude items that have no deployed version\n"},"with_deployment_msg":{"type":"boolean","description":"(default false)\ninclude deployment message\n"}},"required":["workspace"]},
    method: "get",
    pathTemplate: "/w/{workspace}/apps/list",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"page","in":"query"},{"name":"per_page","in":"query"},{"name":"order_desc","in":"query"},{"name":"created_by","in":"query"},{"name":"path_start","in":"query"},{"name":"path_exact","in":"query"},{"name":"starred_only","in":"query"},{"name":"include_draft_only","in":"query"},{"name":"with_deployment_msg","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["createApp", {
    name: "createApp",
    description: `create app`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"object","properties":{"path":{"type":"string"},"value":{},"summary":{"type":"string"},"policy":{"type":"object","properties":{"triggerables":{"type":"object","additionalProperties":{"type":"object"}},"triggerables_v2":{"type":"object","additionalProperties":{"type":"object"}},"s3_inputs":{"type":"array","items":{"type":"object"}},"allowed_s3_keys":{"type":"array","items":{"type":"object","properties":{"s3_path":{"type":"string"},"resource":{"type":"string"}}}},"execution_mode":{"type":"string","enum":["viewer","publisher","anonymous"]},"on_behalf_of":{"type":"string"},"on_behalf_of_email":{"type":"string"}}},"draft_only":{"type":"boolean"},"deployment_message":{"type":"string"},"custom_path":{"type":"string"}},"required":["path","value","summary","policy"],"description":"new app"}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/apps/create",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["createAppRaw", {
    name: "createAppRaw",
    description: `create app raw`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"string","description":"new app"}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/apps/create_raw",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "multipart/form-data",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["existsApp", {
    name: "existsApp",
    description: `does an app exisst at path`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"}},"required":["workspace","path"]},
    method: "get",
    pathTemplate: "/w/{workspace}/apps/exists/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getAppByPath", {
    name: "getAppByPath",
    description: `get app by path`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"},"with_starred_info":{"type":"boolean"}},"required":["workspace","path"]},
    method: "get",
    pathTemplate: "/w/{workspace}/apps/get/p/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"},{"name":"with_starred_info","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getAppLiteByPath", {
    name: "getAppLiteByPath",
    description: `get app lite by path`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"}},"required":["workspace","path"]},
    method: "get",
    pathTemplate: "/w/{workspace}/apps/get/lite/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getAppByPathWithDraft", {
    name: "getAppByPathWithDraft",
    description: `get app by path with draft`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"}},"required":["workspace","path"]},
    method: "get",
    pathTemplate: "/w/{workspace}/apps/get/draft/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getAppHistoryByPath", {
    name: "getAppHistoryByPath",
    description: `get app history by path`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"}},"required":["workspace","path"]},
    method: "get",
    pathTemplate: "/w/{workspace}/apps/history/p/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getAppLatestVersion", {
    name: "getAppLatestVersion",
    description: `get apps's latest version`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"}},"required":["workspace","path"]},
    method: "get",
    pathTemplate: "/w/{workspace}/apps/get_latest_version/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listAppPathsFromWorkspaceRunnable", {
    name: "listAppPathsFromWorkspaceRunnable",
    description: `list app paths from workspace runnable`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"runnable_kind":{"type":"string","enum":["script","flow"]},"path":{"type":"string"}},"required":["workspace","runnable_kind","path"]},
    method: "get",
    pathTemplate: "/w/{workspace}/apps/list_paths_from_workspace_runnable/{runnable_kind}/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"runnable_kind","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["updateAppHistory", {
    name: "updateAppHistory",
    description: `update app history`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"id":{"type":"number"},"version":{"type":"number"},"requestBody":{"type":"object","properties":{"deployment_msg":{"type":"string"}},"description":"App deployment message"}},"required":["workspace","id","version","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/apps/history_update/a/{id}/v/{version}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"id","in":"path"},{"name":"version","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getPublicAppBySecret", {
    name: "getPublicAppBySecret",
    description: `get public app by secret`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"}},"required":["workspace","path"]},
    method: "get",
    pathTemplate: "/w/{workspace}/apps_u/public_app/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["get_public_resource", {
    name: "get_public_resource",
    description: `get public resource`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"}},"required":["workspace","path"]},
    method: "get",
    pathTemplate: "/w/{workspace}/apps_u/public_resource/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getPublicSecretOfApp", {
    name: "getPublicSecretOfApp",
    description: `get public secret of app`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"}},"required":["workspace","path"]},
    method: "get",
    pathTemplate: "/w/{workspace}/apps/secret_of/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getAppByVersion", {
    name: "getAppByVersion",
    description: `get app by version`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"id":{"type":"number"}},"required":["workspace","id"]},
    method: "get",
    pathTemplate: "/w/{workspace}/apps/get/v/{id}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["createRawApp", {
    name: "createRawApp",
    description: `create raw app`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"object","properties":{"path":{"type":"string"},"value":{"type":"string"},"summary":{"type":"string"}},"required":["path","value","summary"],"description":"new raw app"}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/raw_apps/create",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["updateRawApp", {
    name: "updateRawApp",
    description: `update app`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"},"requestBody":{"type":"object","properties":{"path":{"type":"string"},"summary":{"type":"string"},"value":{"type":"string"}},"description":"updateraw  app"}},"required":["workspace","path","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/raw_apps/update/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["deleteRawApp", {
    name: "deleteRawApp",
    description: `delete raw app`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"}},"required":["workspace","path"]},
    method: "delete",
    pathTemplate: "/w/{workspace}/raw_apps/delete/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["deleteApp", {
    name: "deleteApp",
    description: `delete app`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"}},"required":["workspace","path"]},
    method: "delete",
    pathTemplate: "/w/{workspace}/apps/delete/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["updateApp", {
    name: "updateApp",
    description: `update app`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"},"requestBody":{"type":"object","properties":{"path":{"type":"string"},"summary":{"type":"string"},"value":{},"policy":{"type":"object","properties":{"triggerables":{"type":"object","additionalProperties":{"type":"object"}},"triggerables_v2":{"type":"object","additionalProperties":{"type":"object"}},"s3_inputs":{"type":"array","items":{"type":"object"}},"allowed_s3_keys":{"type":"array","items":{"type":"object","properties":{"s3_path":{"type":"string"},"resource":{"type":"string"}}}},"execution_mode":{"type":"string","enum":["viewer","publisher","anonymous"]},"on_behalf_of":{"type":"string"},"on_behalf_of_email":{"type":"string"}}},"deployment_message":{"type":"string"},"custom_path":{"type":"string"}},"description":"update app"}},"required":["workspace","path","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/apps/update/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["updateAppRaw", {
    name: "updateAppRaw",
    description: `update app`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"},"requestBody":{"type":"string","description":"update app"}},"required":["workspace","path","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/apps/update_raw/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: "multipart/form-data",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["customPathExists", {
    name: "customPathExists",
    description: `check if custom path exists`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"custom_path":{"type":"string"}},"required":["workspace","custom_path"]},
    method: "get",
    pathTemplate: "/w/{workspace}/apps/custom_path_exists/{custom_path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"custom_path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["signS3Objects", {
    name: "signS3Objects",
    description: `sign s3 objects, to be used by anonymous users in public apps`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"object","properties":{"s3_objects":{"type":"array","items":{"type":"object","properties":{"s3":{"type":"string"},"filename":{"type":"string"},"storage":{"type":"string"},"presigned":{"type":"string"}},"required":["s3"]}}},"required":["s3_objects"],"description":"s3 objects to sign"}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/apps/sign_s3_objects",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["executeComponent", {
    name: "executeComponent",
    description: `executeComponent`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"},"requestBody":{"type":"object","properties":{"component":{"type":"string"},"path":{"type":"string"},"version":{"type":"number"},"args":{},"raw_code":{"type":"object","properties":{"content":{"type":"string"},"language":{"type":"string"},"path":{"type":"string"},"lock":{"type":"string"},"cache_ttl":{"type":"number"}},"required":["content","language"]},"id":{"type":"number"},"force_viewer_static_fields":{"type":"object"},"force_viewer_one_of_fields":{"type":"object"},"force_viewer_allow_user_resources":{"type":"array","items":{"type":"string"}}},"required":["args","component"],"description":"update app"}},"required":["workspace","path","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/apps_u/execute_component/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["uploadS3FileFromApp", {
    name: "uploadS3FileFromApp",
    description: `upload s3 file from app`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"},"file_key":{"type":"string"},"file_extension":{"type":"string"},"s3_resource_path":{"type":"string"},"resource_type":{"type":"string"},"storage":{"type":"string"},"content_type":{"type":"string"},"content_disposition":{"type":"string"},"requestBody":{"type":"string","description":"File content"}},"required":["workspace","path","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/apps_u/upload_s3_file/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"},{"name":"file_key","in":"query"},{"name":"file_extension","in":"query"},{"name":"s3_resource_path","in":"query"},{"name":"resource_type","in":"query"},{"name":"storage","in":"query"},{"name":"content_type","in":"query"},{"name":"content_disposition","in":"query"}],
    requestBodyContentType: "application/octet-stream",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["deleteS3FileFromApp", {
    name: "deleteS3FileFromApp",
    description: `delete s3 file from app`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"delete_token":{"type":"string"}},"required":["workspace","delete_token"]},
    method: "delete",
    pathTemplate: "/w/{workspace}/apps_u/delete_s3_file",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"delete_token","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["runFlowByPath", {
    name: "runFlowByPath",
    description: `run flow by path`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"},"scheduled_for":{"type":"string","format":"date-time","description":"when to schedule this job (leave empty for immediate run)"},"scheduled_in_secs":{"type":"number","description":"schedule the script to execute in the number of seconds starting now"},"skip_preprocessor":{"type":"boolean","description":"skip the preprocessor"},"parent_job":{"type":"string","format":"uuid","description":"The parent job that is at the origin and responsible for the execution of this script if any"},"tag":{"type":"string","description":"Override the tag to use"},"job_id":{"type":"string","format":"uuid","description":"The job id to assign to the created job. if missing, job is chosen randomly using the ULID scheme. If a job id already exists in the queue or as a completed job, the request to create one will fail (Bad Request)"},"include_header":{"type":"string","description":"List of headers's keys (separated with ',') whove value are added to the args\nHeader's key lowercased and '-'' replaced to '_' such that 'Content-Type' becomes the 'content_type' arg key\n"},"invisible_to_owner":{"type":"boolean","description":"make the run invisible to the the flow owner (default false)"},"requestBody":{"type":"object","description":"flow args","additionalProperties":{}}},"required":["workspace","path","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/jobs/run/f/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"},{"name":"scheduled_for","in":"query"},{"name":"scheduled_in_secs","in":"query"},{"name":"skip_preprocessor","in":"query"},{"name":"parent_job","in":"query"},{"name":"tag","in":"query"},{"name":"job_id","in":"query"},{"name":"include_header","in":"query"},{"name":"invisible_to_owner","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["batchReRunJobs", {
    name: "batchReRunJobs",
    description: `re-run multiple jobs`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"object","required":["job_ids","script_options_by_path","flow_options_by_path"],"properties":{"job_ids":{"type":"array","items":{"type":"string"}},"script_options_by_path":{"type":"object","additionalProperties":{"type":"object","properties":{"input_transforms":{"type":"object","additionalProperties":{"oneOf":[{"type":"object","properties":{"value":{},"type":{"type":"string","enum":["static"]}},"required":["value","type"]},{"type":"object","properties":{"expr":{"type":"string"},"type":{"type":"string","enum":["javascript"]}},"required":["expr","type"]}],"discriminator":{"propertyName":"type","mapping":{"static":"#/components/schemas/schemas-StaticTransform","javascript":"#/components/schemas/schemas-JavascriptTransform"}}}},"use_latest_version":{"type":"boolean"}}}},"flow_options_by_path":{"type":"object","additionalProperties":{"type":"object","properties":{"input_transforms":{"type":"object","additionalProperties":{"oneOf":[{"type":"object","properties":{"value":{},"type":{"type":"string","enum":["static"]}},"required":["value","type"]},{"type":"object","properties":{"expr":{"type":"string"},"type":{"type":"string","enum":["javascript"]}},"required":["expr","type"]}],"discriminator":{"propertyName":"type","mapping":{"static":"#/components/schemas/schemas-StaticTransform","javascript":"#/components/schemas/schemas-JavascriptTransform"}}}},"use_latest_version":{"type":"boolean"}}}}},"description":"list of job ids to re run and arg tranforms"}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/jobs/run/batch_rerun_jobs",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["restartFlowAtStep", {
    name: "restartFlowAtStep",
    description: `restart a completed flow at a given step`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"id":{"type":"string","format":"uuid"},"step_id":{"type":"string","description":"step id to restart the flow from"},"branch_or_iteration_n":{"type":"number","description":"for branchall or loop, the iteration at which the flow should restart"},"scheduled_for":{"type":"string","format":"date-time","description":"when to schedule this job (leave empty for immediate run)"},"scheduled_in_secs":{"type":"number","description":"schedule the script to execute in the number of seconds starting now"},"parent_job":{"type":"string","format":"uuid","description":"The parent job that is at the origin and responsible for the execution of this script if any"},"tag":{"type":"string","description":"Override the tag to use"},"job_id":{"type":"string","format":"uuid","description":"The job id to assign to the created job. if missing, job is chosen randomly using the ULID scheme. If a job id already exists in the queue or as a completed job, the request to create one will fail (Bad Request)"},"include_header":{"type":"string","description":"List of headers's keys (separated with ',') whove value are added to the args\nHeader's key lowercased and '-'' replaced to '_' such that 'Content-Type' becomes the 'content_type' arg key\n"},"invisible_to_owner":{"type":"boolean","description":"make the run invisible to the the flow owner (default false)"},"requestBody":{"type":"object","description":"flow args","additionalProperties":{}}},"required":["workspace","id","step_id","branch_or_iteration_n","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/jobs/restart/f/{id}/from/{step_id}/{branch_or_iteration_n}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"id","in":"path"},{"name":"step_id","in":"path"},{"name":"branch_or_iteration_n","in":"path"},{"name":"scheduled_for","in":"query"},{"name":"scheduled_in_secs","in":"query"},{"name":"parent_job","in":"query"},{"name":"tag","in":"query"},{"name":"job_id","in":"query"},{"name":"include_header","in":"query"},{"name":"invisible_to_owner","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["runScriptByHash", {
    name: "runScriptByHash",
    description: `run script by hash`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"hash":{"type":"string"},"scheduled_for":{"type":"string","format":"date-time","description":"when to schedule this job (leave empty for immediate run)"},"scheduled_in_secs":{"type":"number","description":"schedule the script to execute in the number of seconds starting now"},"skip_preprocessor":{"type":"boolean","description":"skip the preprocessor"},"parent_job":{"type":"string","format":"uuid","description":"The parent job that is at the origin and responsible for the execution of this script if any"},"tag":{"type":"string","description":"Override the tag to use"},"cache_ttl":{"type":"string","description":"Override the cache time to live (in seconds). Can not be used to disable caching, only override with a new cache ttl"},"job_id":{"type":"string","format":"uuid","description":"The job id to assign to the created job. if missing, job is chosen randomly using the ULID scheme. If a job id already exists in the queue or as a completed job, the request to create one will fail (Bad Request)"},"include_header":{"type":"string","description":"List of headers's keys (separated with ',') whove value are added to the args\nHeader's key lowercased and '-'' replaced to '_' such that 'Content-Type' becomes the 'content_type' arg key\n"},"invisible_to_owner":{"type":"boolean","description":"make the run invisible to the the script owner (default false)"},"requestBody":{"type":"object","description":"Partially filled args"}},"required":["workspace","hash","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/jobs/run/h/{hash}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"hash","in":"path"},{"name":"scheduled_for","in":"query"},{"name":"scheduled_in_secs","in":"query"},{"name":"skip_preprocessor","in":"query"},{"name":"parent_job","in":"query"},{"name":"tag","in":"query"},{"name":"cache_ttl","in":"query"},{"name":"job_id","in":"query"},{"name":"include_header","in":"query"},{"name":"invisible_to_owner","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["runScriptPreview", {
    name: "runScriptPreview",
    description: `run script preview`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"include_header":{"type":"string","description":"List of headers's keys (separated with ',') whove value are added to the args\nHeader's key lowercased and '-'' replaced to '_' such that 'Content-Type' becomes the 'content_type' arg key\n"},"invisible_to_owner":{"type":"boolean","description":"make the run invisible to the the script owner (default false)"},"job_id":{"type":"string","format":"uuid","description":"The job id to assign to the created job. if missing, job is chosen randomly using the ULID scheme. If a job id already exists in the queue or as a completed job, the request to create one will fail (Bad Request)"},"requestBody":{"type":"object","properties":{"content":{"type":"string"},"path":{"type":"string"},"script_hash":{"type":"string"},"args":{"type":"object","description":"The arguments to pass to the script or flow","additionalProperties":{}},"language":{"type":"string","enum":["python3","deno","go","bash","powershell","postgresql","mysql","bigquery","snowflake","mssql","oracledb","graphql","nativets","bun","php","rust","ansible","csharp","nu","java","duckdb"]},"tag":{"type":"string"},"kind":{"type":"string","enum":["code","identity","http"]},"dedicated_worker":{"type":"boolean"},"lock":{"type":"string"}},"required":["args"],"description":"preview"}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/jobs/run/preview",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"include_header","in":"query"},{"name":"invisible_to_owner","in":"query"},{"name":"job_id","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["runCodeWorkflowTask", {
    name: "runCodeWorkflowTask",
    description: `run code-workflow task`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"job_id":{"type":"string"},"entrypoint":{"type":"string"},"requestBody":{"type":"object","properties":{"args":{"type":"object","description":"The arguments to pass to the script or flow","additionalProperties":{}}},"required":["args"],"description":"preview"}},"required":["workspace","job_id","entrypoint","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/jobs/workflow_as_code/{job_id}/{entrypoint}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"job_id","in":"path"},{"name":"entrypoint","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["runRawScriptDependencies", {
    name: "runRawScriptDependencies",
    description: `run a one-off dependencies job`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"object","properties":{"raw_scripts":{"type":"array","items":{"type":"object","properties":{"raw_code":{"type":"string"},"path":{"type":"string"},"language":{"type":"string","enum":["python3","deno","go","bash","powershell","postgresql","mysql","bigquery","snowflake","mssql","oracledb","graphql","nativets","bun","php","rust","ansible","csharp","nu","java","duckdb"]}},"required":["raw_code","path","language"]}},"entrypoint":{"type":"string"}},"required":["entrypoint","raw_scripts"],"description":"raw script content"}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/jobs/run/dependencies",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["runFlowPreview", {
    name: "runFlowPreview",
    description: `run flow preview`,
    inputSchema: {},
    method: "post",
    pathTemplate: "/w/{workspace}/jobs/run/preview_flow",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"include_header","in":"query"},{"name":"invisible_to_owner","in":"query"},{"name":"job_id","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listQueue", {
    name: "listQueue",
    description: `list all queued jobs`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"order_desc":{"type":"boolean","description":"order by desc order (default true)"},"created_by":{"type":"string","description":"mask to filter exact matching user creator"},"parent_job":{"type":"string","format":"uuid","description":"The parent job that is at the origin and responsible for the execution of this script if any"},"worker":{"type":"string","description":"worker this job was ran on"},"script_path_exact":{"type":"string","description":"mask to filter exact matching path"},"script_path_start":{"type":"string","description":"mask to filter matching starting path"},"schedule_path":{"type":"string","description":"mask to filter by schedule path"},"script_hash":{"type":"string","description":"mask to filter exact matching path"},"started_before":{"type":"string","format":"date-time","description":"filter on started before (inclusive) timestamp"},"started_after":{"type":"string","format":"date-time","description":"filter on started after (exclusive) timestamp"},"success":{"type":"boolean","description":"filter on successful jobs"},"scheduled_for_before_now":{"type":"boolean","description":"filter on jobs scheduled_for before now (hence waitinf for a worker)"},"job_kinds":{"type":"string","description":"filter on job kind (values 'preview', 'script', 'dependencies', 'flow') separated by,"},"suspended":{"type":"boolean","description":"filter on suspended jobs"},"running":{"type":"boolean","description":"filter on running jobs"},"args":{"type":"string","description":"filter on jobs containing those args as a json subset (@> in postgres)"},"result":{"type":"string","description":"filter on jobs containing those result as a json subset (@> in postgres)"},"allow_wildcards":{"type":"boolean","description":"allow wildcards (*) in the filter of label, tag, worker"},"tag":{"type":"string","description":"filter on jobs with a given tag/worker group"},"page":{"type":"number","description":"which page to return (start at 1, default 1)"},"per_page":{"type":"number","description":"number of items to return for a given page (default 30, max 100)"},"all_workspaces":{"type":"boolean","description":"get jobs from all workspaces (only valid if request come from the `admins` workspace)"},"is_not_schedule":{"type":"boolean","description":"is not a scheduled job"}},"required":["workspace"]},
    method: "get",
    pathTemplate: "/w/{workspace}/jobs/queue/list",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"order_desc","in":"query"},{"name":"created_by","in":"query"},{"name":"parent_job","in":"query"},{"name":"worker","in":"query"},{"name":"script_path_exact","in":"query"},{"name":"script_path_start","in":"query"},{"name":"schedule_path","in":"query"},{"name":"script_hash","in":"query"},{"name":"started_before","in":"query"},{"name":"started_after","in":"query"},{"name":"success","in":"query"},{"name":"scheduled_for_before_now","in":"query"},{"name":"job_kinds","in":"query"},{"name":"suspended","in":"query"},{"name":"running","in":"query"},{"name":"args","in":"query"},{"name":"result","in":"query"},{"name":"allow_wildcards","in":"query"},{"name":"tag","in":"query"},{"name":"page","in":"query"},{"name":"per_page","in":"query"},{"name":"all_workspaces","in":"query"},{"name":"is_not_schedule","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getQueueCount", {
    name: "getQueueCount",
    description: `get queue count`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"all_workspaces":{"type":"boolean","description":"get jobs from all workspaces (only valid if request come from the `admins` workspace)"}},"required":["workspace"]},
    method: "get",
    pathTemplate: "/w/{workspace}/jobs/queue/count",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"all_workspaces","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getCompletedCount", {
    name: "getCompletedCount",
    description: `get completed count`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"}},"required":["workspace"]},
    method: "get",
    pathTemplate: "/w/{workspace}/jobs/completed/count",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["countCompletedJobs", {
    name: "countCompletedJobs",
    description: `count number of completed jobs with filter`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"completed_after_s_ago":{"type":"number"},"success":{"type":"boolean"},"tags":{"type":"string"},"all_workspaces":{"type":"boolean"}},"required":["workspace"]},
    method: "get",
    pathTemplate: "/w/{workspace}/jobs/completed/count_jobs",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"completed_after_s_ago","in":"query"},{"name":"success","in":"query"},{"name":"tags","in":"query"},{"name":"all_workspaces","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listFilteredJobsUuids", {
    name: "listFilteredJobsUuids",
    description: `get the ids of all jobs matching the given filters`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"created_by":{"type":"string","description":"mask to filter exact matching user creator"},"label":{"type":"string","description":"mask to filter exact matching job's label (job labels are completed jobs with as a result an object containing a string in the array at key 'wm_labels')"},"worker":{"type":"string","description":"worker this job was ran on"},"parent_job":{"type":"string","format":"uuid","description":"The parent job that is at the origin and responsible for the execution of this script if any"},"script_path_exact":{"type":"string","description":"mask to filter exact matching path"},"script_path_start":{"type":"string","description":"mask to filter matching starting path"},"schedule_path":{"type":"string","description":"mask to filter by schedule path"},"script_hash":{"type":"string","description":"mask to filter exact matching path"},"started_before":{"type":"string","format":"date-time","description":"filter on started before (inclusive) timestamp"},"started_after":{"type":"string","format":"date-time","description":"filter on started after (exclusive) timestamp"},"created_before":{"type":"string","format":"date-time","description":"filter on created before (inclusive) timestamp"},"created_after":{"type":"string","format":"date-time","description":"filter on created after (exclusive) timestamp"},"created_or_started_before":{"type":"string","format":"date-time","description":"filter on created_at for non non started job and started_at otherwise before (inclusive) timestamp"},"running":{"type":"boolean","description":"filter on running jobs"},"scheduled_for_before_now":{"type":"boolean","description":"filter on jobs scheduled_for before now (hence waitinf for a worker)"},"created_or_started_after":{"type":"string","format":"date-time","description":"filter on created_at for non non started job and started_at otherwise after (exclusive) timestamp"},"created_or_started_after_completed_jobs":{"type":"string","format":"date-time","description":"filter on created_at for non non started job and started_at otherwise after (exclusive) timestamp but only for the completed jobs"},"job_kinds":{"type":"string","description":"filter on job kind (values 'preview', 'script', 'dependencies', 'flow') separated by,"},"suspended":{"type":"boolean","description":"filter on suspended jobs"},"args":{"type":"string","description":"filter on jobs containing those args as a json subset (@> in postgres)"},"tag":{"type":"string","description":"filter on jobs with a given tag/worker group"},"result":{"type":"string","description":"filter on jobs containing those result as a json subset (@> in postgres)"},"page":{"type":"number","description":"which page to return (start at 1, default 1)"},"per_page":{"type":"number","description":"number of items to return for a given page (default 30, max 100)"},"is_skipped":{"type":"boolean","description":"is the job skipped"},"is_flow_step":{"type":"boolean","description":"is the job a flow step"},"has_null_parent":{"type":"boolean","description":"has null parent"},"success":{"type":"boolean","description":"filter on successful jobs"},"all_workspaces":{"type":"boolean","description":"get jobs from all workspaces (only valid if request come from the `admins` workspace)"},"is_not_schedule":{"type":"boolean","description":"is not a scheduled job"}},"required":["workspace"]},
    method: "get",
    pathTemplate: "/w/{workspace}/jobs/list_filtered_uuids",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"created_by","in":"query"},{"name":"label","in":"query"},{"name":"worker","in":"query"},{"name":"parent_job","in":"query"},{"name":"script_path_exact","in":"query"},{"name":"script_path_start","in":"query"},{"name":"schedule_path","in":"query"},{"name":"script_hash","in":"query"},{"name":"started_before","in":"query"},{"name":"started_after","in":"query"},{"name":"created_before","in":"query"},{"name":"created_after","in":"query"},{"name":"created_or_started_before","in":"query"},{"name":"running","in":"query"},{"name":"scheduled_for_before_now","in":"query"},{"name":"created_or_started_after","in":"query"},{"name":"created_or_started_after_completed_jobs","in":"query"},{"name":"job_kinds","in":"query"},{"name":"suspended","in":"query"},{"name":"args","in":"query"},{"name":"tag","in":"query"},{"name":"result","in":"query"},{"name":"page","in":"query"},{"name":"per_page","in":"query"},{"name":"is_skipped","in":"query"},{"name":"is_flow_step","in":"query"},{"name":"has_null_parent","in":"query"},{"name":"success","in":"query"},{"name":"all_workspaces","in":"query"},{"name":"is_not_schedule","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listFilteredQueueUuids", {
    name: "listFilteredQueueUuids",
    description: `get the ids of all queued jobs matching the given filters`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"order_desc":{"type":"boolean","description":"order by desc order (default true)"},"created_by":{"type":"string","description":"mask to filter exact matching user creator"},"parent_job":{"type":"string","format":"uuid","description":"The parent job that is at the origin and responsible for the execution of this script if any"},"script_path_exact":{"type":"string","description":"mask to filter exact matching path"},"script_path_start":{"type":"string","description":"mask to filter matching starting path"},"schedule_path":{"type":"string","description":"mask to filter by schedule path"},"script_hash":{"type":"string","description":"mask to filter exact matching path"},"started_before":{"type":"string","format":"date-time","description":"filter on started before (inclusive) timestamp"},"started_after":{"type":"string","format":"date-time","description":"filter on started after (exclusive) timestamp"},"success":{"type":"boolean","description":"filter on successful jobs"},"scheduled_for_before_now":{"type":"boolean","description":"filter on jobs scheduled_for before now (hence waitinf for a worker)"},"job_kinds":{"type":"string","description":"filter on job kind (values 'preview', 'script', 'dependencies', 'flow') separated by,"},"suspended":{"type":"boolean","description":"filter on suspended jobs"},"running":{"type":"boolean","description":"filter on running jobs"},"args":{"type":"string","description":"filter on jobs containing those args as a json subset (@> in postgres)"},"result":{"type":"string","description":"filter on jobs containing those result as a json subset (@> in postgres)"},"allow_wildcards":{"type":"boolean","description":"allow wildcards (*) in the filter of label, tag, worker"},"tag":{"type":"string","description":"filter on jobs with a given tag/worker group"},"page":{"type":"number","description":"which page to return (start at 1, default 1)"},"per_page":{"type":"number","description":"number of items to return for a given page (default 30, max 100)"},"concurrency_key":{"type":"string"},"all_workspaces":{"type":"boolean","description":"get jobs from all workspaces (only valid if request come from the `admins` workspace)"},"is_not_schedule":{"type":"boolean","description":"is not a scheduled job"}},"required":["workspace"]},
    method: "get",
    pathTemplate: "/w/{workspace}/jobs/queue/list_filtered_uuids",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"order_desc","in":"query"},{"name":"created_by","in":"query"},{"name":"parent_job","in":"query"},{"name":"script_path_exact","in":"query"},{"name":"script_path_start","in":"query"},{"name":"schedule_path","in":"query"},{"name":"script_hash","in":"query"},{"name":"started_before","in":"query"},{"name":"started_after","in":"query"},{"name":"success","in":"query"},{"name":"scheduled_for_before_now","in":"query"},{"name":"job_kinds","in":"query"},{"name":"suspended","in":"query"},{"name":"running","in":"query"},{"name":"args","in":"query"},{"name":"result","in":"query"},{"name":"allow_wildcards","in":"query"},{"name":"tag","in":"query"},{"name":"page","in":"query"},{"name":"per_page","in":"query"},{"name":"concurrency_key","in":"query"},{"name":"all_workspaces","in":"query"},{"name":"is_not_schedule","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["cancelSelection", {
    name: "cancelSelection",
    description: `cancel jobs based on the given uuids`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"array","items":{"type":"string"},"description":"uuids of the jobs to cancel"}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/jobs/queue/cancel_selection",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listCompletedJobs", {
    name: "listCompletedJobs",
    description: `list all completed jobs`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"order_desc":{"type":"boolean","description":"order by desc order (default true)"},"created_by":{"type":"string","description":"mask to filter exact matching user creator"},"label":{"type":"string","description":"mask to filter exact matching job's label (job labels are completed jobs with as a result an object containing a string in the array at key 'wm_labels')"},"worker":{"type":"string","description":"worker this job was ran on"},"parent_job":{"type":"string","format":"uuid","description":"The parent job that is at the origin and responsible for the execution of this script if any"},"script_path_exact":{"type":"string","description":"mask to filter exact matching path"},"script_path_start":{"type":"string","description":"mask to filter matching starting path"},"schedule_path":{"type":"string","description":"mask to filter by schedule path"},"script_hash":{"type":"string","description":"mask to filter exact matching path"},"started_before":{"type":"string","format":"date-time","description":"filter on started before (inclusive) timestamp"},"started_after":{"type":"string","format":"date-time","description":"filter on started after (exclusive) timestamp"},"success":{"type":"boolean","description":"filter on successful jobs"},"job_kinds":{"type":"string","description":"filter on job kind (values 'preview', 'script', 'dependencies', 'flow') separated by,"},"args":{"type":"string","description":"filter on jobs containing those args as a json subset (@> in postgres)"},"result":{"type":"string","description":"filter on jobs containing those result as a json subset (@> in postgres)"},"allow_wildcards":{"type":"boolean","description":"allow wildcards (*) in the filter of label, tag, worker"},"tag":{"type":"string","description":"filter on jobs with a given tag/worker group"},"page":{"type":"number","description":"which page to return (start at 1, default 1)"},"per_page":{"type":"number","description":"number of items to return for a given page (default 30, max 100)"},"is_skipped":{"type":"boolean","description":"is the job skipped"},"is_flow_step":{"type":"boolean","description":"is the job a flow step"},"has_null_parent":{"type":"boolean","description":"has null parent"},"is_not_schedule":{"type":"boolean","description":"is not a scheduled job"}},"required":["workspace"]},
    method: "get",
    pathTemplate: "/w/{workspace}/jobs/completed/list",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"order_desc","in":"query"},{"name":"created_by","in":"query"},{"name":"label","in":"query"},{"name":"worker","in":"query"},{"name":"parent_job","in":"query"},{"name":"script_path_exact","in":"query"},{"name":"script_path_start","in":"query"},{"name":"schedule_path","in":"query"},{"name":"script_hash","in":"query"},{"name":"started_before","in":"query"},{"name":"started_after","in":"query"},{"name":"success","in":"query"},{"name":"job_kinds","in":"query"},{"name":"args","in":"query"},{"name":"result","in":"query"},{"name":"allow_wildcards","in":"query"},{"name":"tag","in":"query"},{"name":"page","in":"query"},{"name":"per_page","in":"query"},{"name":"is_skipped","in":"query"},{"name":"is_flow_step","in":"query"},{"name":"has_null_parent","in":"query"},{"name":"is_not_schedule","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listJobs", {
    name: "listJobs",
    description: `list all jobs`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"created_by":{"type":"string","description":"mask to filter exact matching user creator"},"label":{"type":"string","description":"mask to filter exact matching job's label (job labels are completed jobs with as a result an object containing a string in the array at key 'wm_labels')"},"worker":{"type":"string","description":"worker this job was ran on"},"parent_job":{"type":"string","format":"uuid","description":"The parent job that is at the origin and responsible for the execution of this script if any"},"script_path_exact":{"type":"string","description":"mask to filter exact matching path"},"script_path_start":{"type":"string","description":"mask to filter matching starting path"},"schedule_path":{"type":"string","description":"mask to filter by schedule path"},"script_hash":{"type":"string","description":"mask to filter exact matching path"},"started_before":{"type":"string","format":"date-time","description":"filter on started before (inclusive) timestamp"},"started_after":{"type":"string","format":"date-time","description":"filter on started after (exclusive) timestamp"},"created_before":{"type":"string","format":"date-time","description":"filter on created before (inclusive) timestamp"},"created_after":{"type":"string","format":"date-time","description":"filter on created after (exclusive) timestamp"},"created_or_started_before":{"type":"string","format":"date-time","description":"filter on created_at for non non started job and started_at otherwise before (inclusive) timestamp"},"running":{"type":"boolean","description":"filter on running jobs"},"scheduled_for_before_now":{"type":"boolean","description":"filter on jobs scheduled_for before now (hence waitinf for a worker)"},"created_or_started_after":{"type":"string","format":"date-time","description":"filter on created_at for non non started job and started_at otherwise after (exclusive) timestamp"},"created_or_started_after_completed_jobs":{"type":"string","format":"date-time","description":"filter on created_at for non non started job and started_at otherwise after (exclusive) timestamp but only for the completed jobs"},"job_kinds":{"type":"string","description":"filter on job kind (values 'preview', 'script', 'dependencies', 'flow') separated by,"},"suspended":{"type":"boolean","description":"filter on suspended jobs"},"args":{"type":"string","description":"filter on jobs containing those args as a json subset (@> in postgres)"},"tag":{"type":"string","description":"filter on jobs with a given tag/worker group"},"result":{"type":"string","description":"filter on jobs containing those result as a json subset (@> in postgres)"},"allow_wildcards":{"type":"boolean","description":"allow wildcards (*) in the filter of label, tag, worker"},"page":{"type":"number","description":"which page to return (start at 1, default 1)"},"per_page":{"type":"number","description":"number of items to return for a given page (default 30, max 100)"},"is_skipped":{"type":"boolean","description":"is the job skipped"},"is_flow_step":{"type":"boolean","description":"is the job a flow step"},"has_null_parent":{"type":"boolean","description":"has null parent"},"success":{"type":"boolean","description":"filter on successful jobs"},"all_workspaces":{"type":"boolean","description":"get jobs from all workspaces (only valid if request come from the `admins` workspace)"},"is_not_schedule":{"type":"boolean","description":"is not a scheduled job"}},"required":["workspace"]},
    method: "get",
    pathTemplate: "/w/{workspace}/jobs/list",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"created_by","in":"query"},{"name":"label","in":"query"},{"name":"worker","in":"query"},{"name":"parent_job","in":"query"},{"name":"script_path_exact","in":"query"},{"name":"script_path_start","in":"query"},{"name":"schedule_path","in":"query"},{"name":"script_hash","in":"query"},{"name":"started_before","in":"query"},{"name":"started_after","in":"query"},{"name":"created_before","in":"query"},{"name":"created_after","in":"query"},{"name":"created_or_started_before","in":"query"},{"name":"running","in":"query"},{"name":"scheduled_for_before_now","in":"query"},{"name":"created_or_started_after","in":"query"},{"name":"created_or_started_after_completed_jobs","in":"query"},{"name":"job_kinds","in":"query"},{"name":"suspended","in":"query"},{"name":"args","in":"query"},{"name":"tag","in":"query"},{"name":"result","in":"query"},{"name":"allow_wildcards","in":"query"},{"name":"page","in":"query"},{"name":"per_page","in":"query"},{"name":"is_skipped","in":"query"},{"name":"is_flow_step","in":"query"},{"name":"has_null_parent","in":"query"},{"name":"success","in":"query"},{"name":"all_workspaces","in":"query"},{"name":"is_not_schedule","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getDbClock", {
    name: "getDbClock",
    description: `get db clock`,
    inputSchema: {"type":"object","properties":{}},
    method: "get",
    pathTemplate: "/jobs/db_clock",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["countJobsByTag", {
    name: "countJobsByTag",
    description: `Count jobs by tag`,
    inputSchema: {"type":"object","properties":{"horizon_secs":{"type":"number","description":"Past Time horizon in seconds (when to start the count = now - horizon) (default is 3600)"},"workspace_id":{"type":"string","description":"Specific workspace ID to filter results (optional)"}}},
    method: "get",
    pathTemplate: "/jobs/completed/count_by_tag",
    executionParameters: [{"name":"horizon_secs","in":"query"},{"name":"workspace_id","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getJob", {
    name: "getJob",
    description: `get job`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"id":{"type":"string","format":"uuid"},"no_logs":{"type":"boolean"},"no_code":{"type":"boolean"}},"required":["workspace","id"]},
    method: "get",
    pathTemplate: "/w/{workspace}/jobs_u/get/{id}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"id","in":"path"},{"name":"no_logs","in":"query"},{"name":"no_code","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getRootJobId", {
    name: "getRootJobId",
    description: `get root job id`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"id":{"type":"string","format":"uuid"}},"required":["workspace","id"]},
    method: "get",
    pathTemplate: "/w/{workspace}/jobs_u/get_root_job_id/{id}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getJob_logs", {
    name: "getJob_logs",
    description: `get job logs`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"id":{"type":"string","format":"uuid"}},"required":["workspace","id"]},
    method: "get",
    pathTemplate: "/w/{workspace}/jobs_u/get_logs/{id}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getJobArgs", {
    name: "getJobArgs",
    description: `get job args`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"id":{"type":"string","format":"uuid"}},"required":["workspace","id"]},
    method: "get",
    pathTemplate: "/w/{workspace}/jobs_u/get_args/{id}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getJobUpdates", {
    name: "getJobUpdates",
    description: `get job updates`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"id":{"type":"string","format":"uuid"},"running":{"type":"boolean"},"log_offset":{"type":"number"},"stream_offset":{"type":"number"},"get_progress":{"type":"boolean"},"no_logs":{"type":"boolean"}},"required":["workspace","id"]},
    method: "get",
    pathTemplate: "/w/{workspace}/jobs_u/getupdate/{id}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"id","in":"path"},{"name":"running","in":"query"},{"name":"log_offset","in":"query"},{"name":"stream_offset","in":"query"},{"name":"get_progress","in":"query"},{"name":"no_logs","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getJobUpdatesSSE", {
    name: "getJobUpdatesSSE",
    description: `get job updates via server-sent events`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"id":{"type":"string","format":"uuid"},"running":{"type":"boolean"},"log_offset":{"type":"number"},"stream_offset":{"type":"number"},"get_progress":{"type":"boolean"},"only_result":{"type":"boolean"},"no_logs":{"type":"boolean"}},"required":["workspace","id"]},
    method: "get",
    pathTemplate: "/w/{workspace}/jobs_u/getupdate_sse/{id}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"id","in":"path"},{"name":"running","in":"query"},{"name":"log_offset","in":"query"},{"name":"stream_offset","in":"query"},{"name":"get_progress","in":"query"},{"name":"only_result","in":"query"},{"name":"no_logs","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getLogFileFromStore", {
    name: "getLogFileFromStore",
    description: `get log file from object store`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"}},"required":["workspace","path"]},
    method: "get",
    pathTemplate: "/w/{workspace}/jobs_u/get_log_file/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getFlowDebugInfo", {
    name: "getFlowDebugInfo",
    description: `get flow debug info`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"id":{"type":"string","format":"uuid"}},"required":["workspace","id"]},
    method: "get",
    pathTemplate: "/w/{workspace}/jobs_u/get_flow_debug_info/{id}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getCompletedJob", {
    name: "getCompletedJob",
    description: `get completed job`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"id":{"type":"string","format":"uuid"}},"required":["workspace","id"]},
    method: "get",
    pathTemplate: "/w/{workspace}/jobs_u/completed/get/{id}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getCompletedJobResult", {
    name: "getCompletedJobResult",
    description: `get completed job result`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"id":{"type":"string","format":"uuid"},"suspended_job":{"type":"string"},"resume_id":{"type":"number"},"secret":{"type":"string"},"approver":{"type":"string"}},"required":["workspace","id"]},
    method: "get",
    pathTemplate: "/w/{workspace}/jobs_u/completed/get_result/{id}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"id","in":"path"},{"name":"suspended_job","in":"query"},{"name":"resume_id","in":"query"},{"name":"secret","in":"query"},{"name":"approver","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getCompletedJobResultMaybe", {
    name: "getCompletedJobResultMaybe",
    description: `get completed job result if job is completed`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"id":{"type":"string","format":"uuid"},"get_started":{"type":"boolean"}},"required":["workspace","id"]},
    method: "get",
    pathTemplate: "/w/{workspace}/jobs_u/completed/get_result_maybe/{id}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"id","in":"path"},{"name":"get_started","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["deleteCompletedJob", {
    name: "deleteCompletedJob",
    description: `delete completed job (erase content but keep run id)`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"id":{"type":"string","format":"uuid"}},"required":["workspace","id"]},
    method: "post",
    pathTemplate: "/w/{workspace}/jobs/completed/delete/{id}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["cancelQueuedJob", {
    name: "cancelQueuedJob",
    description: `cancel queued or running job`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"id":{"type":"string","format":"uuid"},"requestBody":{"type":"object","properties":{"reason":{"type":"string"}},"description":"reason"}},"required":["workspace","id","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/jobs_u/queue/cancel/{id}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["cancelPersistentQueuedJobs", {
    name: "cancelPersistentQueuedJobs",
    description: `cancel all queued jobs for persistent script`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"},"requestBody":{"type":"object","properties":{"reason":{"type":"string"}},"description":"reason"}},"required":["workspace","path","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/jobs_u/queue/cancel_persistent/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["forceCancelQueuedJob", {
    name: "forceCancelQueuedJob",
    description: `force cancel queued job`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"id":{"type":"string","format":"uuid"},"requestBody":{"type":"object","properties":{"reason":{"type":"string"}},"description":"reason"}},"required":["workspace","id","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/jobs_u/queue/force_cancel/{id}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["createJobSignature", {
    name: "createJobSignature",
    description: `create an HMac signature given a job id and a resume id`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"id":{"type":"string","format":"uuid"},"resume_id":{"type":"number"},"approver":{"type":"string"}},"required":["workspace","id","resume_id"]},
    method: "get",
    pathTemplate: "/w/{workspace}/jobs/job_signature/{id}/{resume_id}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"id","in":"path"},{"name":"resume_id","in":"path"},{"name":"approver","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getResumeUrls", {
    name: "getResumeUrls",
    description: `get resume urls given a job_id, resume_id and a nonce to resume a flow`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"id":{"type":"string","format":"uuid"},"resume_id":{"type":"number"},"approver":{"type":"string"}},"required":["workspace","id","resume_id"]},
    method: "get",
    pathTemplate: "/w/{workspace}/jobs/resume_urls/{id}/{resume_id}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"id","in":"path"},{"name":"resume_id","in":"path"},{"name":"approver","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getSlackApprovalPayload", {
    name: "getSlackApprovalPayload",
    description: `generate interactive slack approval for suspended job`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"id":{"type":"string","format":"uuid"},"approver":{"type":"string"},"message":{"type":"string"},"slack_resource_path":{"type":"string"},"channel_id":{"type":"string"},"flow_step_id":{"type":"string"},"default_args_json":{"type":"string"},"dynamic_enums_json":{"type":"string"}},"required":["workspace","id","slack_resource_path","channel_id","flow_step_id"]},
    method: "get",
    pathTemplate: "/w/{workspace}/jobs/slack_approval/{id}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"id","in":"path"},{"name":"approver","in":"query"},{"name":"message","in":"query"},{"name":"slack_resource_path","in":"query"},{"name":"channel_id","in":"query"},{"name":"flow_step_id","in":"query"},{"name":"default_args_json","in":"query"},{"name":"dynamic_enums_json","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getTeamsApprovalPayload", {
    name: "getTeamsApprovalPayload",
    description: `generate interactive teams approval for suspended job`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"id":{"type":"string","format":"uuid"},"approver":{"type":"string"},"message":{"type":"string"},"team_name":{"type":"string"},"channel_name":{"type":"string"},"flow_step_id":{"type":"string"},"default_args_json":{"type":"string"},"dynamic_enums_json":{"type":"string"}},"required":["workspace","id","team_name","channel_name","flow_step_id"]},
    method: "get",
    pathTemplate: "/w/{workspace}/jobs/teams_approval/{id}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"id","in":"path"},{"name":"approver","in":"query"},{"name":"message","in":"query"},{"name":"team_name","in":"query"},{"name":"channel_name","in":"query"},{"name":"flow_step_id","in":"query"},{"name":"default_args_json","in":"query"},{"name":"dynamic_enums_json","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["resumeSuspendedJobGet", {
    name: "resumeSuspendedJobGet",
    description: `resume a job for a suspended flow`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"id":{"type":"string","format":"uuid"},"payload":{"type":"string","description":"The base64 encoded payload that has been encoded as a JSON. e.g how to encode such payload encodeURIComponent\n`encodeURIComponent(btoa(JSON.stringify({a: 2})))`\n"},"resume_id":{"type":"number"},"signature":{"type":"string"},"approver":{"type":"string"}},"required":["workspace","id","resume_id","signature"]},
    method: "get",
    pathTemplate: "/w/{workspace}/jobs_u/resume/{id}/{resume_id}/{signature}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"id","in":"path"},{"name":"payload","in":"query"},{"name":"resume_id","in":"path"},{"name":"signature","in":"path"},{"name":"approver","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["resumeSuspendedJobPost", {
    name: "resumeSuspendedJobPost",
    description: `resume a job for a suspended flow`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"id":{"type":"string","format":"uuid"},"resume_id":{"type":"number"},"signature":{"type":"string"},"approver":{"type":"string"},"requestBody":{"type":"object","description":"The JSON request body."}},"required":["workspace","id","resume_id","signature","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/jobs_u/resume/{id}/{resume_id}/{signature}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"id","in":"path"},{"name":"resume_id","in":"path"},{"name":"signature","in":"path"},{"name":"approver","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getFlowUserState", {
    name: "getFlowUserState",
    description: `get flow user state at a given key`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"id":{"type":"string","format":"uuid"},"key":{"type":"string"}},"required":["workspace","id","key"]},
    method: "get",
    pathTemplate: "/w/{workspace}/jobs/flow/user_states/{id}/{key}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"id","in":"path"},{"name":"key","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["setFlowUserState", {
    name: "setFlowUserState",
    description: `set flow user state at a given key`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"id":{"type":"string","format":"uuid"},"key":{"type":"string"},"requestBody":{"description":"new value"}},"required":["workspace","id","key","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/jobs/flow/user_states/{id}/{key}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"id","in":"path"},{"name":"key","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["resumeSuspendedFlowAsOwner", {
    name: "resumeSuspendedFlowAsOwner",
    description: `resume a job for a suspended flow as an owner`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"id":{"type":"string","format":"uuid"},"requestBody":{"type":"object","description":"The JSON request body."}},"required":["workspace","id","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/jobs/flow/resume/{id}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["cancelSuspendedJobGet", {
    name: "cancelSuspendedJobGet",
    description: `cancel a job for a suspended flow`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"id":{"type":"string","format":"uuid"},"resume_id":{"type":"number"},"signature":{"type":"string"},"approver":{"type":"string"}},"required":["workspace","id","resume_id","signature"]},
    method: "get",
    pathTemplate: "/w/{workspace}/jobs_u/cancel/{id}/{resume_id}/{signature}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"id","in":"path"},{"name":"resume_id","in":"path"},{"name":"signature","in":"path"},{"name":"approver","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["cancelSuspendedJobPost", {
    name: "cancelSuspendedJobPost",
    description: `cancel a job for a suspended flow`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"id":{"type":"string","format":"uuid"},"resume_id":{"type":"number"},"signature":{"type":"string"},"approver":{"type":"string"},"requestBody":{"type":"object","description":"The JSON request body."}},"required":["workspace","id","resume_id","signature","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/jobs_u/cancel/{id}/{resume_id}/{signature}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"id","in":"path"},{"name":"resume_id","in":"path"},{"name":"signature","in":"path"},{"name":"approver","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getSuspendedJobFlow", {
    name: "getSuspendedJobFlow",
    description: `get parent flow job of suspended job`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"id":{"type":"string","format":"uuid"},"resume_id":{"type":"number"},"signature":{"type":"string"},"approver":{"type":"string"}},"required":["workspace","id","resume_id","signature"]},
    method: "get",
    pathTemplate: "/w/{workspace}/jobs_u/get_flow/{id}/{resume_id}/{signature}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"id","in":"path"},{"name":"resume_id","in":"path"},{"name":"signature","in":"path"},{"name":"approver","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["previewSchedule", {
    name: "previewSchedule",
    description: `preview schedule`,
    inputSchema: {"type":"object","properties":{"requestBody":{"type":"object","properties":{"schedule":{"type":"string"},"timezone":{"type":"string"},"cron_version":{"type":"string"}},"required":["schedule","timezone"],"description":"schedule"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/schedules/preview",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["createSchedule", {
    name: "createSchedule",
    description: `create schedule`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"object","properties":{"path":{"type":"string","description":"The path where the schedule will be created"},"schedule":{"type":"string","description":"The cron schedule to trigger the script or flow. Should include seconds."},"timezone":{"type":"string","description":"The timezone to use for the cron schedule"},"script_path":{"type":"string","description":"The path to the script or flow to trigger"},"is_flow":{"type":"boolean","description":"Whether the schedule is for a flow"},"args":{"type":"object","description":"The arguments to pass to the script or flow","additionalProperties":{}},"enabled":{"type":"boolean","description":"Whether the schedule is enabled"},"on_failure":{"type":"string","description":"The path to the script or flow to trigger on failure"},"on_failure_times":{"type":"number","description":"The number of times to retry on failure"},"on_failure_exact":{"type":"boolean","description":"Whether the schedule should only run on the exact time"},"on_failure_extra_args":{"type":"object","description":"The arguments to pass to the script or flow","additionalProperties":{}},"on_recovery":{"type":"string","description":"The path to the script or flow to trigger on recovery"},"on_recovery_times":{"type":"number","description":"The number of times to retry on recovery"},"on_recovery_extra_args":{"type":"object","description":"The arguments to pass to the script or flow","additionalProperties":{}},"on_success":{"type":"string","description":"The path to the script or flow to trigger on success"},"on_success_extra_args":{"type":"object","description":"The arguments to pass to the script or flow","additionalProperties":{}},"ws_error_handler_muted":{"type":"boolean","description":"Whether the WebSocket error handler is muted"},"retry":{"description":"The retry configuration for the schedule","type":"object","properties":{"constant":{"type":"object","properties":{"attempts":{"type":"number"},"seconds":{"type":"number"}}},"exponential":{"type":"object","properties":{"attempts":{"type":"number"},"multiplier":{"type":"number"},"seconds":{"type":"number"},"random_factor":{"type":"number","minimum":0,"maximum":100}}}}},"no_flow_overlap":{"type":"boolean","description":"Whether the schedule should not run if a flow is already running"},"summary":{"type":"string","description":"The summary of the schedule"},"description":{"type":"string","description":"The description of the schedule"},"tag":{"type":"string","description":"The tag of the schedule"},"paused_until":{"type":"string","description":"The date and time the schedule will be paused until","format":"date-time"},"cron_version":{"type":"string","description":"The version of the cron schedule to use (last is v2)"}},"required":["path","schedule","timezone","script_path","is_flow","args"],"description":"new schedule"}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/schedules/create",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["updateSchedule", {
    name: "updateSchedule",
    description: `update schedule`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"},"requestBody":{"type":"object","properties":{"schedule":{"type":"string","description":"The cron schedule to trigger the script or flow. Should include seconds."},"timezone":{"type":"string","description":"The timezone to use for the cron schedule"},"args":{"type":"object","description":"The arguments to pass to the script or flow","additionalProperties":{}},"on_failure":{"type":"string","description":"The path to the script or flow to trigger on failure"},"on_failure_times":{"type":"number","description":"The number of times to retry on failure"},"on_failure_exact":{"type":"boolean","description":"Whether the schedule should only run on the exact time"},"on_failure_extra_args":{"type":"object","description":"The arguments to pass to the script or flow","additionalProperties":{}},"on_recovery":{"type":"string","description":"The path to the script or flow to trigger on recovery"},"on_recovery_times":{"type":"number","description":"The number of times to retry on recovery"},"on_recovery_extra_args":{"type":"object","description":"The arguments to pass to the script or flow","additionalProperties":{}},"on_success":{"type":"string","description":"The path to the script or flow to trigger on success"},"on_success_extra_args":{"type":"object","description":"The arguments to pass to the script or flow","additionalProperties":{}},"ws_error_handler_muted":{"type":"boolean","description":"Whether the WebSocket error handler is muted"},"retry":{"description":"The retry configuration for the schedule","type":"object","properties":{"constant":{"type":"object","properties":{"attempts":{"type":"number"},"seconds":{"type":"number"}}},"exponential":{"type":"object","properties":{"attempts":{"type":"number"},"multiplier":{"type":"number"},"seconds":{"type":"number"},"random_factor":{"type":"number","minimum":0,"maximum":100}}}}},"no_flow_overlap":{"type":"boolean","description":"Whether the schedule should not run if a flow is already running"},"summary":{"type":"string","description":"The summary of the schedule"},"description":{"type":"string","description":"The description of the schedule"},"tag":{"type":"string","description":"The tag of the schedule"},"paused_until":{"type":"string","description":"The date and time the schedule will be paused until","format":"date-time"},"cron_version":{"type":"string","description":"The version of the cron schedule to use (last is v2)"}},"required":["schedule","timezone","args"],"description":"updated schedule"}},"required":["workspace","path","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/schedules/update/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["setScheduleEnabled", {
    name: "setScheduleEnabled",
    description: `set enabled schedule`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"},"requestBody":{"type":"object","properties":{"enabled":{"type":"boolean"}},"required":["enabled"],"description":"updated schedule enable"}},"required":["workspace","path","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/schedules/setenabled/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["deleteSchedule", {
    name: "deleteSchedule",
    description: `delete schedule`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"}},"required":["workspace","path"]},
    method: "delete",
    pathTemplate: "/w/{workspace}/schedules/delete/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getSchedule", {
    name: "getSchedule",
    description: `get schedule`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"}},"required":["workspace","path"]},
    method: "get",
    pathTemplate: "/w/{workspace}/schedules/get/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["existsSchedule", {
    name: "existsSchedule",
    description: `does schedule exists`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"}},"required":["workspace","path"]},
    method: "get",
    pathTemplate: "/w/{workspace}/schedules/exists/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listSchedules", {
    name: "listSchedules",
    description: `list schedules`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"page":{"type":"number","description":"which page to return (start at 1, default 1)"},"per_page":{"type":"number","description":"number of items to return for a given page (default 30, max 100)"},"args":{"type":"string","description":"filter on jobs containing those args as a json subset (@> in postgres)"},"path":{"type":"string","description":"filter by path"},"is_flow":{"type":"boolean","description":"filter schedules by whether they target a flow"},"path_start":{"type":"string","description":"filter schedules by path prefix"}},"required":["workspace"]},
    method: "get",
    pathTemplate: "/w/{workspace}/schedules/list",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"page","in":"query"},{"name":"per_page","in":"query"},{"name":"args","in":"query"},{"name":"path","in":"query"},{"name":"is_flow","in":"query"},{"name":"path_start","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listSchedulesWithJobs", {
    name: "listSchedulesWithJobs",
    description: `list schedules with last 20 jobs`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"page":{"type":"number","description":"which page to return (start at 1, default 1)"},"per_page":{"type":"number","description":"number of items to return for a given page (default 30, max 100)"}},"required":["workspace"]},
    method: "get",
    pathTemplate: "/w/{workspace}/schedules/list_with_jobs",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"page","in":"query"},{"name":"per_page","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["setDefaultErrorOrRecoveryHandler", {
    name: "setDefaultErrorOrRecoveryHandler",
    description: `Set default error or recoevery handler`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"object","properties":{"handler_type":{"type":"string","enum":["error","recovery","success"]},"override_existing":{"type":"boolean"},"path":{"type":"string"},"extra_args":{"type":"object"},"number_of_occurence":{"type":"number"},"number_of_occurence_exact":{"type":"boolean"},"workspace_handler_muted":{"type":"boolean"}},"required":["handler_type","override_existing"],"description":"Handler description"}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/schedules/setdefaulthandler",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["generateOpenapiSpec", {
    name: "generateOpenapiSpec",
    description: `generate openapi spec from http routes/webhook`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"object","properties":{"info":{"type":"object","properties":{"title":{"type":"string"},"version":{"type":"string"},"description":{"type":"string"},"terms_of_service":{"type":"string"},"contact":{"type":"object","properties":{"name":{"type":"string"},"url":{"type":"string"},"email":{"type":"string"}}},"license":{"type":"object","properties":{"name":{"type":"string"},"identifier":{"type":"string"},"url":{"type":"string"}},"required":["name"]}},"required":["title","version"]},"url":{"type":"string"},"openapi_spec_format":{"type":"string","enum":["yaml","json"]},"http_route_filters":{"type":"array","items":{"type":"object","properties":{"folder_regex":{"type":"string"},"path_regex":{"type":"string"},"route_path_regex":{"type":"string"}},"required":["folder_regex","path_regex","route_path_regex"]}},"webhook_filters":{"type":"array","items":{"type":"object","properties":{"user_or_folder_regex":{"type":"string","enum":["*","u","f"]},"user_or_folder_regex_value":{"type":"string"},"path":{"type":"string"},"runnable_kind":{"type":"string","enum":["script","flow"]}},"required":["user_or_folder_regex","user_or_folder_regex_value","path","runnable_kind"]}}},"description":"openapi spec info and url"}},"required":["workspace"]},
    method: "post",
    pathTemplate: "/w/{workspace}/openapi/generate",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["DownloadOpenapiSpec", {
    name: "DownloadOpenapiSpec",
    description: `Download the OpenAPI v3.1 spec as a file`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"object","properties":{"info":{"type":"object","properties":{"title":{"type":"string"},"version":{"type":"string"},"description":{"type":"string"},"terms_of_service":{"type":"string"},"contact":{"type":"object","properties":{"name":{"type":"string"},"url":{"type":"string"},"email":{"type":"string"}}},"license":{"type":"object","properties":{"name":{"type":"string"},"identifier":{"type":"string"},"url":{"type":"string"}},"required":["name"]}},"required":["title","version"]},"url":{"type":"string"},"openapi_spec_format":{"type":"string","enum":["yaml","json"]},"http_route_filters":{"type":"array","items":{"type":"object","properties":{"folder_regex":{"type":"string"},"path_regex":{"type":"string"},"route_path_regex":{"type":"string"}},"required":["folder_regex","path_regex","route_path_regex"]}},"webhook_filters":{"type":"array","items":{"type":"object","properties":{"user_or_folder_regex":{"type":"string","enum":["*","u","f"]},"user_or_folder_regex_value":{"type":"string"},"path":{"type":"string"},"runnable_kind":{"type":"string","enum":["script","flow"]}},"required":["user_or_folder_regex","user_or_folder_regex_value","path","runnable_kind"]}}},"description":"openapi spec info and url"}},"required":["workspace"]},
    method: "post",
    pathTemplate: "/w/{workspace}/openapi/download",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["createHttpTriggers", {
    name: "createHttpTriggers",
    description: `create many HTTP triggers`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"array","items":{"type":"object","properties":{"path":{"type":"string"},"script_path":{"type":"string"},"route_path":{"type":"string"},"workspaced_route":{"type":"boolean"},"summary":{"type":"string"},"description":{"type":"string"},"static_asset_config":{"type":"object","properties":{"s3":{"type":"string"},"storage":{"type":"string"},"filename":{"type":"string"}},"required":["s3"]},"is_flow":{"type":"boolean"},"http_method":{"type":"string","enum":["get","post","put","delete","patch"]},"authentication_resource_path":{"type":"string"},"is_async":{"type":"boolean"},"authentication_method":{"type":"string","enum":["none","windmill","api_key","basic_http","custom_script","signature"]},"is_static_website":{"type":"boolean"},"wrap_body":{"type":"boolean"},"raw_string":{"type":"boolean"},"error_handler_path":{"type":"string"},"error_handler_args":{"type":"object","description":"The arguments to pass to the script or flow","additionalProperties":{}},"retry":{"type":"object","properties":{"constant":{"type":"object","properties":{"attempts":{"type":"number"},"seconds":{"type":"number"}}},"exponential":{"type":"object","properties":{"attempts":{"type":"number"},"multiplier":{"type":"number"},"seconds":{"type":"number"},"random_factor":{"type":"number","minimum":0,"maximum":100}}}}}},"required":["path","script_path","route_path","is_flow","is_async","authentication_method","http_method","is_static_website"]},"description":"new http trigger"}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/http_triggers/create_many",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["createHttpTrigger", {
    name: "createHttpTrigger",
    description: `create http trigger`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"object","properties":{"path":{"type":"string"},"script_path":{"type":"string"},"route_path":{"type":"string"},"workspaced_route":{"type":"boolean"},"summary":{"type":"string"},"description":{"type":"string"},"static_asset_config":{"type":"object","properties":{"s3":{"type":"string"},"storage":{"type":"string"},"filename":{"type":"string"}},"required":["s3"]},"is_flow":{"type":"boolean"},"http_method":{"type":"string","enum":["get","post","put","delete","patch"]},"authentication_resource_path":{"type":"string"},"is_async":{"type":"boolean"},"authentication_method":{"type":"string","enum":["none","windmill","api_key","basic_http","custom_script","signature"]},"is_static_website":{"type":"boolean"},"wrap_body":{"type":"boolean"},"raw_string":{"type":"boolean"},"error_handler_path":{"type":"string"},"error_handler_args":{"type":"object","description":"The arguments to pass to the script or flow","additionalProperties":{}},"retry":{"type":"object","properties":{"constant":{"type":"object","properties":{"attempts":{"type":"number"},"seconds":{"type":"number"}}},"exponential":{"type":"object","properties":{"attempts":{"type":"number"},"multiplier":{"type":"number"},"seconds":{"type":"number"},"random_factor":{"type":"number","minimum":0,"maximum":100}}}}}},"required":["path","script_path","route_path","is_flow","is_async","authentication_method","http_method","is_static_website"],"description":"new http trigger"}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/http_triggers/create",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["updateHttpTrigger", {
    name: "updateHttpTrigger",
    description: `update http trigger`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"},"requestBody":{"type":"object","properties":{"path":{"type":"string"},"script_path":{"type":"string"},"route_path":{"type":"string"},"summary":{"type":"string"},"description":{"type":"string"},"workspaced_route":{"type":"boolean"},"static_asset_config":{"type":"object","properties":{"s3":{"type":"string"},"storage":{"type":"string"},"filename":{"type":"string"}},"required":["s3"]},"authentication_resource_path":{"type":"string"},"is_flow":{"type":"boolean"},"http_method":{"type":"string","enum":["get","post","put","delete","patch"]},"is_async":{"type":"boolean"},"authentication_method":{"type":"string","enum":["none","windmill","api_key","basic_http","custom_script","signature"]},"is_static_website":{"type":"boolean"},"wrap_body":{"type":"boolean"},"raw_string":{"type":"boolean"},"error_handler_path":{"type":"string"},"error_handler_args":{"type":"object","description":"The arguments to pass to the script or flow","additionalProperties":{}},"retry":{"type":"object","properties":{"constant":{"type":"object","properties":{"attempts":{"type":"number"},"seconds":{"type":"number"}}},"exponential":{"type":"object","properties":{"attempts":{"type":"number"},"multiplier":{"type":"number"},"seconds":{"type":"number"},"random_factor":{"type":"number","minimum":0,"maximum":100}}}}}},"required":["path","script_path","is_flow","kind","is_async","authentication_method","http_method","is_static_website"],"description":"updated trigger"}},"required":["workspace","path","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/http_triggers/update/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["deleteHttpTrigger", {
    name: "deleteHttpTrigger",
    description: `delete http trigger`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"}},"required":["workspace","path"]},
    method: "delete",
    pathTemplate: "/w/{workspace}/http_triggers/delete/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getHttpTrigger", {
    name: "getHttpTrigger",
    description: `get http trigger`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"}},"required":["workspace","path"]},
    method: "get",
    pathTemplate: "/w/{workspace}/http_triggers/get/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listHttpTriggers", {
    name: "listHttpTriggers",
    description: `list http triggers`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"page":{"type":"number","description":"which page to return (start at 1, default 1)"},"per_page":{"type":"number","description":"number of items to return for a given page (default 30, max 100)"},"path":{"type":"string","description":"filter by path"},"is_flow":{"type":"boolean"},"path_start":{"type":"string"}},"required":["workspace"]},
    method: "get",
    pathTemplate: "/w/{workspace}/http_triggers/list",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"page","in":"query"},{"name":"per_page","in":"query"},{"name":"path","in":"query"},{"name":"is_flow","in":"query"},{"name":"path_start","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["existsHttpTrigger", {
    name: "existsHttpTrigger",
    description: `does http trigger exists`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"}},"required":["workspace","path"]},
    method: "get",
    pathTemplate: "/w/{workspace}/http_triggers/exists/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["existsRoute", {
    name: "existsRoute",
    description: `does route exists`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"object","properties":{"route_path":{"type":"string"},"http_method":{"type":"string","enum":["get","post","put","delete","patch"]},"trigger_path":{"type":"string"},"workspaced_route":{"type":"boolean"}},"required":["route_path","http_method"],"description":"route exists request"}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/http_triggers/route_exists",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["createWebsocketTrigger", {
    name: "createWebsocketTrigger",
    description: `create websocket trigger`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"object","properties":{"path":{"type":"string"},"script_path":{"type":"string"},"is_flow":{"type":"boolean"},"url":{"type":"string"},"enabled":{"type":"boolean"},"filters":{"type":"array","items":{"type":"object","properties":{"key":{"type":"string"},"value":{}},"required":["key","value"]}},"initial_messages":{"type":"array","items":{"anyOf":[{"type":"object","properties":{"raw_message":{"type":"string"}},"required":["raw_message"]},{"type":"object","properties":{"runnable_result":{"type":"object","properties":{"path":{"type":"string"},"args":{"type":"object","description":"The arguments to pass to the script or flow","additionalProperties":{}},"is_flow":{"type":"boolean"}},"required":["path","args","is_flow"]}},"required":["runnable_result"]}]}},"url_runnable_args":{"type":"object","description":"The arguments to pass to the script or flow","additionalProperties":{}},"can_return_message":{"type":"boolean"},"error_handler_path":{"type":"string"},"error_handler_args":{"type":"object","description":"The arguments to pass to the script or flow","additionalProperties":{}},"retry":{"type":"object","properties":{"constant":{"type":"object","properties":{"attempts":{"type":"number"},"seconds":{"type":"number"}}},"exponential":{"type":"object","properties":{"attempts":{"type":"number"},"multiplier":{"type":"number"},"seconds":{"type":"number"},"random_factor":{"type":"number","minimum":0,"maximum":100}}}}}},"required":["path","script_path","url","is_flow","filters","can_return_message"],"description":"new websocket trigger"}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/websocket_triggers/create",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["updateWebsocketTrigger", {
    name: "updateWebsocketTrigger",
    description: `update websocket trigger`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"},"requestBody":{"type":"object","properties":{"url":{"type":"string"},"path":{"type":"string"},"script_path":{"type":"string"},"is_flow":{"type":"boolean"},"filters":{"type":"array","items":{"type":"object","properties":{"key":{"type":"string"},"value":{}},"required":["key","value"]}},"initial_messages":{"type":"array","items":{"anyOf":[{"type":"object","properties":{"raw_message":{"type":"string"}},"required":["raw_message"]},{"type":"object","properties":{"runnable_result":{"type":"object","properties":{"path":{"type":"string"},"args":{"type":"object","description":"The arguments to pass to the script or flow","additionalProperties":{}},"is_flow":{"type":"boolean"}},"required":["path","args","is_flow"]}},"required":["runnable_result"]}]}},"url_runnable_args":{"type":"object","description":"The arguments to pass to the script or flow","additionalProperties":{}},"can_return_message":{"type":"boolean"},"error_handler_path":{"type":"string"},"error_handler_args":{"type":"object","description":"The arguments to pass to the script or flow","additionalProperties":{}},"retry":{"type":"object","properties":{"constant":{"type":"object","properties":{"attempts":{"type":"number"},"seconds":{"type":"number"}}},"exponential":{"type":"object","properties":{"attempts":{"type":"number"},"multiplier":{"type":"number"},"seconds":{"type":"number"},"random_factor":{"type":"number","minimum":0,"maximum":100}}}}}},"required":["path","script_path","url","is_flow","filters","can_return_message"],"description":"updated trigger"}},"required":["workspace","path","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/websocket_triggers/update/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["deleteWebsocketTrigger", {
    name: "deleteWebsocketTrigger",
    description: `delete websocket trigger`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"}},"required":["workspace","path"]},
    method: "delete",
    pathTemplate: "/w/{workspace}/websocket_triggers/delete/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getWebsocketTrigger", {
    name: "getWebsocketTrigger",
    description: `get websocket trigger`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"}},"required":["workspace","path"]},
    method: "get",
    pathTemplate: "/w/{workspace}/websocket_triggers/get/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listWebsocketTriggers", {
    name: "listWebsocketTriggers",
    description: `list websocket triggers`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"page":{"type":"number","description":"which page to return (start at 1, default 1)"},"per_page":{"type":"number","description":"number of items to return for a given page (default 30, max 100)"},"path":{"type":"string","description":"filter by path"},"is_flow":{"type":"boolean"},"path_start":{"type":"string"}},"required":["workspace"]},
    method: "get",
    pathTemplate: "/w/{workspace}/websocket_triggers/list",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"page","in":"query"},{"name":"per_page","in":"query"},{"name":"path","in":"query"},{"name":"is_flow","in":"query"},{"name":"path_start","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["existsWebsocketTrigger", {
    name: "existsWebsocketTrigger",
    description: `does websocket trigger exists`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"}},"required":["workspace","path"]},
    method: "get",
    pathTemplate: "/w/{workspace}/websocket_triggers/exists/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["setWebsocketTriggerEnabled", {
    name: "setWebsocketTriggerEnabled",
    description: `set enabled websocket trigger`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"},"requestBody":{"type":"object","properties":{"enabled":{"type":"boolean"}},"required":["enabled"],"description":"updated websocket trigger enable"}},"required":["workspace","path","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/websocket_triggers/setenabled/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["testWebsocketConnection", {
    name: "testWebsocketConnection",
    description: `test websocket connection`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"object","properties":{"url":{"type":"string"},"url_runnable_args":{"type":"object","description":"The arguments to pass to the script or flow","additionalProperties":{}},"can_return_message":{"type":"boolean"}},"required":["url","can_return_message"],"description":"test websocket connection"}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/websocket_triggers/test",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["createKafkaTrigger", {
    name: "createKafkaTrigger",
    description: `create kafka trigger`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"object","properties":{"path":{"type":"string"},"script_path":{"type":"string"},"is_flow":{"type":"boolean"},"kafka_resource_path":{"type":"string"},"group_id":{"type":"string"},"topics":{"type":"array","items":{"type":"string"}},"enabled":{"type":"boolean"},"error_handler_path":{"type":"string"},"error_handler_args":{"type":"object","description":"The arguments to pass to the script or flow","additionalProperties":{}},"retry":{"type":"object","properties":{"constant":{"type":"object","properties":{"attempts":{"type":"number"},"seconds":{"type":"number"}}},"exponential":{"type":"object","properties":{"attempts":{"type":"number"},"multiplier":{"type":"number"},"seconds":{"type":"number"},"random_factor":{"type":"number","minimum":0,"maximum":100}}}}}},"required":["path","script_path","is_flow","kafka_resource_path","group_id","topics"],"description":"new kafka trigger"}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/kafka_triggers/create",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["updateKafkaTrigger", {
    name: "updateKafkaTrigger",
    description: `update kafka trigger`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"},"requestBody":{"type":"object","properties":{"kafka_resource_path":{"type":"string"},"group_id":{"type":"string"},"topics":{"type":"array","items":{"type":"string"}},"path":{"type":"string"},"script_path":{"type":"string"},"is_flow":{"type":"boolean"},"error_handler_path":{"type":"string"},"error_handler_args":{"type":"object","description":"The arguments to pass to the script or flow","additionalProperties":{}},"retry":{"type":"object","properties":{"constant":{"type":"object","properties":{"attempts":{"type":"number"},"seconds":{"type":"number"}}},"exponential":{"type":"object","properties":{"attempts":{"type":"number"},"multiplier":{"type":"number"},"seconds":{"type":"number"},"random_factor":{"type":"number","minimum":0,"maximum":100}}}}}},"required":["path","script_path","kafka_resource_path","group_id","topics","is_flow"],"description":"updated trigger"}},"required":["workspace","path","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/kafka_triggers/update/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["deleteKafkaTrigger", {
    name: "deleteKafkaTrigger",
    description: `delete kafka trigger`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"}},"required":["workspace","path"]},
    method: "delete",
    pathTemplate: "/w/{workspace}/kafka_triggers/delete/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getKafkaTrigger", {
    name: "getKafkaTrigger",
    description: `get kafka trigger`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"}},"required":["workspace","path"]},
    method: "get",
    pathTemplate: "/w/{workspace}/kafka_triggers/get/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listKafkaTriggers", {
    name: "listKafkaTriggers",
    description: `list kafka triggers`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"page":{"type":"number","description":"which page to return (start at 1, default 1)"},"per_page":{"type":"number","description":"number of items to return for a given page (default 30, max 100)"},"path":{"type":"string","description":"filter by path"},"is_flow":{"type":"boolean"},"path_start":{"type":"string"}},"required":["workspace"]},
    method: "get",
    pathTemplate: "/w/{workspace}/kafka_triggers/list",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"page","in":"query"},{"name":"per_page","in":"query"},{"name":"path","in":"query"},{"name":"is_flow","in":"query"},{"name":"path_start","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["existsKafkaTrigger", {
    name: "existsKafkaTrigger",
    description: `does kafka trigger exists`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"}},"required":["workspace","path"]},
    method: "get",
    pathTemplate: "/w/{workspace}/kafka_triggers/exists/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["setKafkaTriggerEnabled", {
    name: "setKafkaTriggerEnabled",
    description: `set enabled kafka trigger`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"},"requestBody":{"type":"object","properties":{"enabled":{"type":"boolean"}},"required":["enabled"],"description":"updated kafka trigger enable"}},"required":["workspace","path","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/kafka_triggers/setenabled/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["testKafkaConnection", {
    name: "testKafkaConnection",
    description: `test kafka connection`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"object","properties":{"connection":{"type":"object"}},"required":["connection"],"description":"test kafka connection"}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/kafka_triggers/test",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["createNatsTrigger", {
    name: "createNatsTrigger",
    description: `create nats trigger`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"object","properties":{"path":{"type":"string"},"script_path":{"type":"string"},"is_flow":{"type":"boolean"},"nats_resource_path":{"type":"string"},"use_jetstream":{"type":"boolean"},"stream_name":{"type":"string"},"consumer_name":{"type":"string"},"subjects":{"type":"array","items":{"type":"string"}},"enabled":{"type":"boolean"},"error_handler_path":{"type":"string"},"error_handler_args":{"type":"object","description":"The arguments to pass to the script or flow","additionalProperties":{}},"retry":{"type":"object","properties":{"constant":{"type":"object","properties":{"attempts":{"type":"number"},"seconds":{"type":"number"}}},"exponential":{"type":"object","properties":{"attempts":{"type":"number"},"multiplier":{"type":"number"},"seconds":{"type":"number"},"random_factor":{"type":"number","minimum":0,"maximum":100}}}}}},"required":["path","script_path","is_flow","nats_resource_path","use_jetstream","subjects"],"description":"new nats trigger"}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/nats_triggers/create",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["updateNatsTrigger", {
    name: "updateNatsTrigger",
    description: `update nats trigger`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"},"requestBody":{"type":"object","properties":{"nats_resource_path":{"type":"string"},"use_jetstream":{"type":"boolean"},"stream_name":{"type":"string"},"consumer_name":{"type":"string"},"subjects":{"type":"array","items":{"type":"string"}},"path":{"type":"string"},"script_path":{"type":"string"},"is_flow":{"type":"boolean"},"error_handler_path":{"type":"string"},"error_handler_args":{"type":"object","description":"The arguments to pass to the script or flow","additionalProperties":{}},"retry":{"type":"object","properties":{"constant":{"type":"object","properties":{"attempts":{"type":"number"},"seconds":{"type":"number"}}},"exponential":{"type":"object","properties":{"attempts":{"type":"number"},"multiplier":{"type":"number"},"seconds":{"type":"number"},"random_factor":{"type":"number","minimum":0,"maximum":100}}}}}},"required":["path","script_path","nats_resource_path","use_jetstream","subjects","is_flow"],"description":"updated trigger"}},"required":["workspace","path","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/nats_triggers/update/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["deleteNatsTrigger", {
    name: "deleteNatsTrigger",
    description: `delete nats trigger`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"}},"required":["workspace","path"]},
    method: "delete",
    pathTemplate: "/w/{workspace}/nats_triggers/delete/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getNatsTrigger", {
    name: "getNatsTrigger",
    description: `get nats trigger`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"}},"required":["workspace","path"]},
    method: "get",
    pathTemplate: "/w/{workspace}/nats_triggers/get/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listNatsTriggers", {
    name: "listNatsTriggers",
    description: `list nats triggers`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"page":{"type":"number","description":"which page to return (start at 1, default 1)"},"per_page":{"type":"number","description":"number of items to return for a given page (default 30, max 100)"},"path":{"type":"string","description":"filter by path"},"is_flow":{"type":"boolean"},"path_start":{"type":"string"}},"required":["workspace"]},
    method: "get",
    pathTemplate: "/w/{workspace}/nats_triggers/list",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"page","in":"query"},{"name":"per_page","in":"query"},{"name":"path","in":"query"},{"name":"is_flow","in":"query"},{"name":"path_start","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["existsNatsTrigger", {
    name: "existsNatsTrigger",
    description: `does nats trigger exists`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"}},"required":["workspace","path"]},
    method: "get",
    pathTemplate: "/w/{workspace}/nats_triggers/exists/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["setNatsTriggerEnabled", {
    name: "setNatsTriggerEnabled",
    description: `set enabled nats trigger`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"},"requestBody":{"type":"object","properties":{"enabled":{"type":"boolean"}},"required":["enabled"],"description":"updated nats trigger enable"}},"required":["workspace","path","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/nats_triggers/setenabled/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["testNatsConnection", {
    name: "testNatsConnection",
    description: `test NATS connection`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"object","properties":{"connection":{"type":"object"}},"required":["connection"],"description":"test nats connection"}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/nats_triggers/test",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["createSqsTrigger", {
    name: "createSqsTrigger",
    description: `create sqs trigger`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"object","properties":{"queue_url":{"type":"string"},"aws_auth_resource_type":{"type":"string","enum":["oidc","credentials"]},"aws_resource_path":{"type":"string"},"message_attributes":{"type":"array","items":{"type":"string"}},"path":{"type":"string"},"script_path":{"type":"string"},"is_flow":{"type":"boolean"},"enabled":{"type":"boolean"},"error_handler_path":{"type":"string"},"error_handler_args":{"type":"object","description":"The arguments to pass to the script or flow","additionalProperties":{}},"retry":{"type":"object","properties":{"constant":{"type":"object","properties":{"attempts":{"type":"number"},"seconds":{"type":"number"}}},"exponential":{"type":"object","properties":{"attempts":{"type":"number"},"multiplier":{"type":"number"},"seconds":{"type":"number"},"random_factor":{"type":"number","minimum":0,"maximum":100}}}}}},"required":["queue_url","aws_resource_path","path","script_path","is_flow","aws_auth_resource_type"],"description":"new sqs trigger"}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/sqs_triggers/create",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["updateSqsTrigger", {
    name: "updateSqsTrigger",
    description: `update sqs trigger`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"},"requestBody":{"type":"object","properties":{"queue_url":{"type":"string"},"aws_auth_resource_type":{"type":"string","enum":["oidc","credentials"]},"aws_resource_path":{"type":"string"},"message_attributes":{"type":"array","items":{"type":"string"}},"path":{"type":"string"},"script_path":{"type":"string"},"is_flow":{"type":"boolean"},"enabled":{"type":"boolean"},"error_handler_path":{"type":"string"},"error_handler_args":{"type":"object","description":"The arguments to pass to the script or flow","additionalProperties":{}},"retry":{"type":"object","properties":{"constant":{"type":"object","properties":{"attempts":{"type":"number"},"seconds":{"type":"number"}}},"exponential":{"type":"object","properties":{"attempts":{"type":"number"},"multiplier":{"type":"number"},"seconds":{"type":"number"},"random_factor":{"type":"number","minimum":0,"maximum":100}}}}}},"required":["queue_url","aws_resource_path","path","script_path","is_flow","enabled","aws_auth_resource_type"],"description":"updated trigger"}},"required":["workspace","path","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/sqs_triggers/update/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["deleteSqsTrigger", {
    name: "deleteSqsTrigger",
    description: `delete sqs trigger`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"}},"required":["workspace","path"]},
    method: "delete",
    pathTemplate: "/w/{workspace}/sqs_triggers/delete/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getSqsTrigger", {
    name: "getSqsTrigger",
    description: `get sqs trigger`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"}},"required":["workspace","path"]},
    method: "get",
    pathTemplate: "/w/{workspace}/sqs_triggers/get/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listSqsTriggers", {
    name: "listSqsTriggers",
    description: `list sqs triggers`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"page":{"type":"number","description":"which page to return (start at 1, default 1)"},"per_page":{"type":"number","description":"number of items to return for a given page (default 30, max 100)"},"path":{"type":"string","description":"filter by path"},"is_flow":{"type":"boolean"},"path_start":{"type":"string"}},"required":["workspace"]},
    method: "get",
    pathTemplate: "/w/{workspace}/sqs_triggers/list",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"page","in":"query"},{"name":"per_page","in":"query"},{"name":"path","in":"query"},{"name":"is_flow","in":"query"},{"name":"path_start","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["existsSqsTrigger", {
    name: "existsSqsTrigger",
    description: `does sqs trigger exists`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"}},"required":["workspace","path"]},
    method: "get",
    pathTemplate: "/w/{workspace}/sqs_triggers/exists/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["setSqsTriggerEnabled", {
    name: "setSqsTriggerEnabled",
    description: `set enabled sqs trigger`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"},"requestBody":{"type":"object","properties":{"enabled":{"type":"boolean"}},"required":["enabled"],"description":"updated sqs trigger enable"}},"required":["workspace","path","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/sqs_triggers/setenabled/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["testSqsConnection", {
    name: "testSqsConnection",
    description: `test sqs connection`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"object","properties":{"connection":{"type":"object"}},"required":["connection"],"description":"test sqs connection"}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/sqs_triggers/test",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["createMqttTrigger", {
    name: "createMqttTrigger",
    description: `create mqtt trigger`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"object","properties":{"mqtt_resource_path":{"type":"string"},"subscribe_topics":{"type":"array","items":{"type":"object","properties":{"qos":{"type":"string","enum":["qos0","qos1","qos2"]},"topic":{"type":"string"}},"required":["qos","topic"]}},"client_id":{"type":"string"},"v3_config":{"type":"object","properties":{"clean_session":{"type":"boolean"}}},"v5_config":{"type":"object","properties":{"clean_start":{"type":"boolean"},"topic_alias_maximum":{"type":"number"},"session_expiry_interval":{"type":"number"}}},"client_version":{"type":"string","enum":["v3","v5"]},"path":{"type":"string"},"script_path":{"type":"string"},"is_flow":{"type":"boolean"},"enabled":{"type":"boolean"},"error_handler_path":{"type":"string"},"error_handler_args":{"type":"object","description":"The arguments to pass to the script or flow","additionalProperties":{}},"retry":{"type":"object","properties":{"constant":{"type":"object","properties":{"attempts":{"type":"number"},"seconds":{"type":"number"}}},"exponential":{"type":"object","properties":{"attempts":{"type":"number"},"multiplier":{"type":"number"},"seconds":{"type":"number"},"random_factor":{"type":"number","minimum":0,"maximum":100}}}}}},"required":["path","script_path","is_flow","subscribe_topics","mqtt_resource_path"],"description":"new mqtt trigger"}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/mqtt_triggers/create",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["updateMqttTrigger", {
    name: "updateMqttTrigger",
    description: `update mqtt trigger`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"},"requestBody":{"type":"object","properties":{"mqtt_resource_path":{"type":"string"},"subscribe_topics":{"type":"array","items":{"type":"object","properties":{"qos":{"type":"string","enum":["qos0","qos1","qos2"]},"topic":{"type":"string"}},"required":["qos","topic"]}},"client_id":{"type":"string"},"v3_config":{"type":"object","properties":{"clean_session":{"type":"boolean"}}},"v5_config":{"type":"object","properties":{"clean_start":{"type":"boolean"},"topic_alias_maximum":{"type":"number"},"session_expiry_interval":{"type":"number"}}},"client_version":{"type":"string","enum":["v3","v5"]},"path":{"type":"string"},"script_path":{"type":"string"},"is_flow":{"type":"boolean"},"enabled":{"type":"boolean"},"error_handler_path":{"type":"string"},"error_handler_args":{"type":"object","description":"The arguments to pass to the script or flow","additionalProperties":{}},"retry":{"type":"object","properties":{"constant":{"type":"object","properties":{"attempts":{"type":"number"},"seconds":{"type":"number"}}},"exponential":{"type":"object","properties":{"attempts":{"type":"number"},"multiplier":{"type":"number"},"seconds":{"type":"number"},"random_factor":{"type":"number","minimum":0,"maximum":100}}}}}},"required":["path","script_path","is_flow","enabled","subscribe_topics","mqtt_resource_path"],"description":"updated trigger"}},"required":["workspace","path","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/mqtt_triggers/update/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["deleteMqttTrigger", {
    name: "deleteMqttTrigger",
    description: `delete mqtt trigger`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"}},"required":["workspace","path"]},
    method: "delete",
    pathTemplate: "/w/{workspace}/mqtt_triggers/delete/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getMqttTrigger", {
    name: "getMqttTrigger",
    description: `get mqtt trigger`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"}},"required":["workspace","path"]},
    method: "get",
    pathTemplate: "/w/{workspace}/mqtt_triggers/get/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listMqttTriggers", {
    name: "listMqttTriggers",
    description: `list mqtt triggers`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"page":{"type":"number","description":"which page to return (start at 1, default 1)"},"per_page":{"type":"number","description":"number of items to return for a given page (default 30, max 100)"},"path":{"type":"string","description":"filter by path"},"is_flow":{"type":"boolean"},"path_start":{"type":"string"}},"required":["workspace"]},
    method: "get",
    pathTemplate: "/w/{workspace}/mqtt_triggers/list",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"page","in":"query"},{"name":"per_page","in":"query"},{"name":"path","in":"query"},{"name":"is_flow","in":"query"},{"name":"path_start","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["existsMqttTrigger", {
    name: "existsMqttTrigger",
    description: `does mqtt trigger exists`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"}},"required":["workspace","path"]},
    method: "get",
    pathTemplate: "/w/{workspace}/mqtt_triggers/exists/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["setMqttTriggerEnabled", {
    name: "setMqttTriggerEnabled",
    description: `set enabled mqtt trigger`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"},"requestBody":{"type":"object","properties":{"enabled":{"type":"boolean"}},"required":["enabled"],"description":"updated mqtt trigger enable"}},"required":["workspace","path","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/mqtt_triggers/setenabled/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["testMqttConnection", {
    name: "testMqttConnection",
    description: `test mqtt connection`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"object","properties":{"connection":{"type":"object"}},"required":["connection"],"description":"test mqtt connection"}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/mqtt_triggers/test",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["createGcpTrigger", {
    name: "createGcpTrigger",
    description: `create gcp trigger`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"object","properties":{"gcp_resource_path":{"type":"string"},"subscription_mode":{"type":"string","enum":["existing","create_update"],"description":"The mode of subscription. 'existing' means using an existing GCP subscription, while 'create_update' involves creating or updating a new subscription."},"topic_id":{"type":"string"},"subscription_id":{"type":"string"},"base_endpoint":{"type":"string"},"delivery_type":{"type":"string","enum":["push","pull"]},"delivery_config":{"type":"object","properties":{"audience":{"type":"string"},"authenticate":{"type":"boolean"}},"required":["authenticate","base_endpoint"]},"path":{"type":"string"},"script_path":{"type":"string"},"is_flow":{"type":"boolean"},"enabled":{"type":"boolean"},"auto_acknowledge_msg":{"type":"boolean"},"error_handler_path":{"type":"string"},"error_handler_args":{"type":"object","description":"The arguments to pass to the script or flow","additionalProperties":{}},"retry":{"type":"object","properties":{"constant":{"type":"object","properties":{"attempts":{"type":"number"},"seconds":{"type":"number"}}},"exponential":{"type":"object","properties":{"attempts":{"type":"number"},"multiplier":{"type":"number"},"seconds":{"type":"number"},"random_factor":{"type":"number","minimum":0,"maximum":100}}}}}},"required":["path","script_path","is_flow","gcp_resource_path","topic_id","subscription_mode"],"description":"new gcp trigger"}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/gcp_triggers/create",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["updateGcpTrigger", {
    name: "updateGcpTrigger",
    description: `update gcp trigger`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"},"requestBody":{"type":"object","properties":{"gcp_resource_path":{"type":"string"},"subscription_mode":{"type":"string","enum":["existing","create_update"],"description":"The mode of subscription. 'existing' means using an existing GCP subscription, while 'create_update' involves creating or updating a new subscription."},"topic_id":{"type":"string"},"subscription_id":{"type":"string"},"base_endpoint":{"type":"string"},"delivery_type":{"type":"string","enum":["push","pull"]},"delivery_config":{"type":"object","properties":{"audience":{"type":"string"},"authenticate":{"type":"boolean"}},"required":["authenticate","base_endpoint"]},"path":{"type":"string"},"script_path":{"type":"string"},"is_flow":{"type":"boolean"},"enabled":{"type":"boolean"},"auto_acknowledge_msg":{"type":"boolean"},"error_handler_path":{"type":"string"},"error_handler_args":{"type":"object","description":"The arguments to pass to the script or flow","additionalProperties":{}},"retry":{"type":"object","properties":{"constant":{"type":"object","properties":{"attempts":{"type":"number"},"seconds":{"type":"number"}}},"exponential":{"type":"object","properties":{"attempts":{"type":"number"},"multiplier":{"type":"number"},"seconds":{"type":"number"},"random_factor":{"type":"number","minimum":0,"maximum":100}}}}}},"required":["path","script_path","is_flow","gcp_resource_path","topic_id","subscription_mode"],"description":"updated trigger"}},"required":["workspace","path","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/gcp_triggers/update/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["deleteGcpTrigger", {
    name: "deleteGcpTrigger",
    description: `delete gcp trigger`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"}},"required":["workspace","path"]},
    method: "delete",
    pathTemplate: "/w/{workspace}/gcp_triggers/delete/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getGcpTrigger", {
    name: "getGcpTrigger",
    description: `get gcp trigger`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"}},"required":["workspace","path"]},
    method: "get",
    pathTemplate: "/w/{workspace}/gcp_triggers/get/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listGcpTriggers", {
    name: "listGcpTriggers",
    description: `list gcp triggers`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"page":{"type":"number","description":"which page to return (start at 1, default 1)"},"per_page":{"type":"number","description":"number of items to return for a given page (default 30, max 100)"},"path":{"type":"string","description":"filter by path"},"is_flow":{"type":"boolean"},"path_start":{"type":"string"}},"required":["workspace"]},
    method: "get",
    pathTemplate: "/w/{workspace}/gcp_triggers/list",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"page","in":"query"},{"name":"per_page","in":"query"},{"name":"path","in":"query"},{"name":"is_flow","in":"query"},{"name":"path_start","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["existsGcpTrigger", {
    name: "existsGcpTrigger",
    description: `does gcp trigger exists`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"}},"required":["workspace","path"]},
    method: "get",
    pathTemplate: "/w/{workspace}/gcp_triggers/exists/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["setGcpTriggerEnabled", {
    name: "setGcpTriggerEnabled",
    description: `set enabled gcp trigger`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"},"requestBody":{"type":"object","properties":{"enabled":{"type":"boolean"}},"required":["enabled"],"description":"updated gcp trigger enable"}},"required":["workspace","path","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/gcp_triggers/setenabled/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["testGcpConnection", {
    name: "testGcpConnection",
    description: `test gcp connection`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"object","properties":{"connection":{"type":"object"}},"required":["connection"],"description":"test gcp connection"}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/gcp_triggers/test",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["deleteGcpSubscription", {
    name: "deleteGcpSubscription",
    description: `delete gcp trigger`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"},"requestBody":{"type":"object","properties":{"subscription_id":{"type":"string"}},"required":["subscription_id"],"description":"args to delete subscription from google cloud"}},"required":["workspace","path","requestBody"]},
    method: "delete",
    pathTemplate: "/w/{workspace}/gcp_triggers/subscriptions/delete/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listGoogleTopics", {
    name: "listGoogleTopics",
    description: `list all topics of google cloud service`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"}},"required":["workspace","path"]},
    method: "get",
    pathTemplate: "/w/{workspace}/gcp_triggers/topics/list/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listAllTGoogleTopicSubscriptions", {
    name: "listAllTGoogleTopicSubscriptions",
    description: `list all subscription of a give topic from google cloud service`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"},"requestBody":{"type":"object","properties":{"topic_id":{"type":"string"}},"required":["topic_id"],"description":"args to get subscription's topic from google cloud"}},"required":["workspace","path","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/gcp_triggers/subscriptions/list/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getPostgresVersion", {
    name: "getPostgresVersion",
    description: `get postgres version`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"}},"required":["workspace","path"]},
    method: "get",
    pathTemplate: "/w/{workspace}/postgres_triggers/postgres/version/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["isValidPostgresConfiguration", {
    name: "isValidPostgresConfiguration",
    description: `check if postgres configuration is set to logical`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"}},"required":["workspace","path"]},
    method: "get",
    pathTemplate: "/w/{workspace}/postgres_triggers/is_valid_postgres_configuration/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["createTemplateScript", {
    name: "createTemplateScript",
    description: `create template script`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"object","properties":{"postgres_resource_path":{"type":"string"},"relations":{"type":"array","items":{"type":"object","properties":{"schema_name":{"type":"string"},"table_to_track":{"type":"array","items":{"type":"object","properties":{"table_name":{"type":"string"},"columns_name":{"type":"array","items":{"type":"string"}},"where_clause":{"type":"string"}},"required":["table_name"]}}},"required":["schema_name","table_to_track"]}},"language":{"type":"string","enum":["Typescript"]}},"required":["postgres_resource_path","relations","language"],"description":"template script"}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/postgres_triggers/create_template_script",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getTemplateScript", {
    name: "getTemplateScript",
    description: `get template script`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"id":{"type":"string"}},"required":["workspace","id"]},
    method: "get",
    pathTemplate: "/w/{workspace}/postgres_triggers/get_template_script/{id}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listPostgresReplicationSlot", {
    name: "listPostgresReplicationSlot",
    description: `list postgres replication slot`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"}},"required":["workspace","path"]},
    method: "get",
    pathTemplate: "/w/{workspace}/postgres_triggers/slot/list/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["createPostgresReplicationSlot", {
    name: "createPostgresReplicationSlot",
    description: `create replication slot for postgres`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"},"requestBody":{"type":"object","properties":{"name":{"type":"string"}},"description":"new slot for postgres"}},"required":["workspace","path","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/postgres_triggers/slot/create/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["deletePostgresReplicationSlot", {
    name: "deletePostgresReplicationSlot",
    description: `delete postgres replication slot`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"},"requestBody":{"type":"object","properties":{"name":{"type":"string"}},"description":"replication slot of postgres"}},"required":["workspace","path","requestBody"]},
    method: "delete",
    pathTemplate: "/w/{workspace}/postgres_triggers/slot/delete/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listPostgresPublication", {
    name: "listPostgresPublication",
    description: `list postgres publication`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"}},"required":["workspace","path"]},
    method: "get",
    pathTemplate: "/w/{workspace}/postgres_triggers/publication/list/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getPostgresPublication", {
    name: "getPostgresPublication",
    description: `get postgres publication`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"},"publication":{"type":"string","description":"The name of the publication"}},"required":["workspace","path","publication"]},
    method: "get",
    pathTemplate: "/w/{workspace}/postgres_triggers/publication/get/{publication}/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"},{"name":"publication","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["createPostgresPublication", {
    name: "createPostgresPublication",
    description: `create publication for postgres`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"},"publication":{"type":"string","description":"The name of the publication"},"requestBody":{"type":"object","properties":{"table_to_track":{"type":"array","items":{"type":"object","properties":{"schema_name":{"type":"string"},"table_to_track":{"type":"array","items":{"type":"object","properties":{"table_name":{"type":"string"},"columns_name":{"type":"array","items":{"type":"string"}},"where_clause":{"type":"string"}},"required":["table_name"]}}},"required":["schema_name","table_to_track"]}},"transaction_to_track":{"type":"array","items":{"type":"string"}}},"required":["transaction_to_track"],"description":"new publication for postgres"}},"required":["workspace","path","publication","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/postgres_triggers/publication/create/{publication}/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"},{"name":"publication","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["updatePostgresPublication", {
    name: "updatePostgresPublication",
    description: `update publication for postgres`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"},"publication":{"type":"string","description":"The name of the publication"},"requestBody":{"type":"object","properties":{"table_to_track":{"type":"array","items":{"type":"object","properties":{"schema_name":{"type":"string"},"table_to_track":{"type":"array","items":{"type":"object","properties":{"table_name":{"type":"string"},"columns_name":{"type":"array","items":{"type":"string"}},"where_clause":{"type":"string"}},"required":["table_name"]}}},"required":["schema_name","table_to_track"]}},"transaction_to_track":{"type":"array","items":{"type":"string"}}},"required":["transaction_to_track"],"description":"update publication for postgres"}},"required":["workspace","path","publication","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/postgres_triggers/publication/update/{publication}/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"},{"name":"publication","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["deletePostgresPublication", {
    name: "deletePostgresPublication",
    description: `delete postgres publication`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"},"publication":{"type":"string","description":"The name of the publication"}},"required":["workspace","path","publication"]},
    method: "delete",
    pathTemplate: "/w/{workspace}/postgres_triggers/publication/delete/{publication}/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"},{"name":"publication","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["createPostgresTrigger", {
    name: "createPostgresTrigger",
    description: `create postgres trigger`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"object","properties":{"replication_slot_name":{"type":"string"},"publication_name":{"type":"string"},"path":{"type":"string"},"script_path":{"type":"string"},"is_flow":{"type":"boolean"},"enabled":{"type":"boolean"},"postgres_resource_path":{"type":"string"},"publication":{"type":"object","properties":{"table_to_track":{"type":"array","items":{"type":"object","properties":{"schema_name":{"type":"string"},"table_to_track":{"type":"array","items":{"type":"object","properties":{"table_name":{"type":"string"},"columns_name":{"type":"array","items":{"type":"string"}},"where_clause":{"type":"string"}},"required":["table_name"]}}},"required":["schema_name","table_to_track"]}},"transaction_to_track":{"type":"array","items":{"type":"string"}}},"required":["transaction_to_track"]},"error_handler_path":{"type":"string"},"error_handler_args":{"type":"object","description":"The arguments to pass to the script or flow","additionalProperties":{}},"retry":{"type":"object","properties":{"constant":{"type":"object","properties":{"attempts":{"type":"number"},"seconds":{"type":"number"}}},"exponential":{"type":"object","properties":{"attempts":{"type":"number"},"multiplier":{"type":"number"},"seconds":{"type":"number"},"random_factor":{"type":"number","minimum":0,"maximum":100}}}}}},"required":["path","script_path","is_flow","enabled","postgres_resource_path"],"description":"new postgres trigger"}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/postgres_triggers/create",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["updatePostgresTrigger", {
    name: "updatePostgresTrigger",
    description: `update postgres trigger`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"},"requestBody":{"type":"object","properties":{"replication_slot_name":{"type":"string"},"publication_name":{"type":"string"},"path":{"type":"string"},"script_path":{"type":"string"},"is_flow":{"type":"boolean"},"enabled":{"type":"boolean"},"postgres_resource_path":{"type":"string"},"publication":{"type":"object","properties":{"table_to_track":{"type":"array","items":{"type":"object","properties":{"schema_name":{"type":"string"},"table_to_track":{"type":"array","items":{"type":"object","properties":{"table_name":{"type":"string"},"columns_name":{"type":"array","items":{"type":"string"}},"where_clause":{"type":"string"}},"required":["table_name"]}}},"required":["schema_name","table_to_track"]}},"transaction_to_track":{"type":"array","items":{"type":"string"}}},"required":["transaction_to_track"]},"error_handler_path":{"type":"string"},"error_handler_args":{"type":"object","description":"The arguments to pass to the script or flow","additionalProperties":{}},"retry":{"type":"object","properties":{"constant":{"type":"object","properties":{"attempts":{"type":"number"},"seconds":{"type":"number"}}},"exponential":{"type":"object","properties":{"attempts":{"type":"number"},"multiplier":{"type":"number"},"seconds":{"type":"number"},"random_factor":{"type":"number","minimum":0,"maximum":100}}}}}},"required":["path","script_path","is_flow","enabled","postgres_resource_path","publication_name","replication_slot_name"],"description":"updated trigger"}},"required":["workspace","path","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/postgres_triggers/update/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["deletePostgresTrigger", {
    name: "deletePostgresTrigger",
    description: `delete postgres trigger`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"}},"required":["workspace","path"]},
    method: "delete",
    pathTemplate: "/w/{workspace}/postgres_triggers/delete/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getPostgresTrigger", {
    name: "getPostgresTrigger",
    description: `get postgres trigger`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"}},"required":["workspace","path"]},
    method: "get",
    pathTemplate: "/w/{workspace}/postgres_triggers/get/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listPostgresTriggers", {
    name: "listPostgresTriggers",
    description: `list postgres triggers`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"page":{"type":"number","description":"which page to return (start at 1, default 1)"},"per_page":{"type":"number","description":"number of items to return for a given page (default 30, max 100)"},"path":{"type":"string","description":"filter by path"},"is_flow":{"type":"boolean"},"path_start":{"type":"string"}},"required":["workspace"]},
    method: "get",
    pathTemplate: "/w/{workspace}/postgres_triggers/list",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"page","in":"query"},{"name":"per_page","in":"query"},{"name":"path","in":"query"},{"name":"is_flow","in":"query"},{"name":"path_start","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["existsPostgresTrigger", {
    name: "existsPostgresTrigger",
    description: `does postgres trigger exists`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"}},"required":["workspace","path"]},
    method: "get",
    pathTemplate: "/w/{workspace}/postgres_triggers/exists/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["setPostgresTriggerEnabled", {
    name: "setPostgresTriggerEnabled",
    description: `set enabled postgres trigger`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"},"requestBody":{"type":"object","properties":{"enabled":{"type":"boolean"}},"required":["enabled"],"description":"updated postgres trigger enable"}},"required":["workspace","path","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/postgres_triggers/setenabled/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["testPostgresConnection", {
    name: "testPostgresConnection",
    description: `test postgres connection`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"object","properties":{"database":{"type":"string"}},"required":["database"],"description":"test postgres connection"}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/postgres_triggers/test",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listInstanceGroups", {
    name: "listInstanceGroups",
    description: `list instance groups`,
    inputSchema: {"type":"object","properties":{}},
    method: "get",
    pathTemplate: "/groups/list",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getInstanceGroup", {
    name: "getInstanceGroup",
    description: `get instance group`,
    inputSchema: {"type":"object","properties":{"name":{"type":"string"}},"required":["name"]},
    method: "get",
    pathTemplate: "/groups/get/{name}",
    executionParameters: [{"name":"name","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["createInstanceGroup", {
    name: "createInstanceGroup",
    description: `create instance group`,
    inputSchema: {"type":"object","properties":{"requestBody":{"type":"object","properties":{"name":{"type":"string"},"summary":{"type":"string"}},"required":["name"],"description":"create instance group"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/groups/create",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["updateInstanceGroup", {
    name: "updateInstanceGroup",
    description: `update instance group`,
    inputSchema: {"type":"object","properties":{"name":{"type":"string"},"requestBody":{"type":"object","properties":{"new_summary":{"type":"string"}},"required":["new_summary"],"description":"update instance group"}},"required":["name","requestBody"]},
    method: "post",
    pathTemplate: "/groups/update/{name}",
    executionParameters: [{"name":"name","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["deleteInstanceGroup", {
    name: "deleteInstanceGroup",
    description: `delete instance group`,
    inputSchema: {"type":"object","properties":{"name":{"type":"string"}},"required":["name"]},
    method: "delete",
    pathTemplate: "/groups/delete/{name}",
    executionParameters: [{"name":"name","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["addUserToInstanceGroup", {
    name: "addUserToInstanceGroup",
    description: `add user to instance group`,
    inputSchema: {"type":"object","properties":{"name":{"type":"string"},"requestBody":{"type":"object","properties":{"email":{"type":"string"}},"required":["email"],"description":"user to add to instance group"}},"required":["name","requestBody"]},
    method: "post",
    pathTemplate: "/groups/adduser/{name}",
    executionParameters: [{"name":"name","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["removeUserFromInstanceGroup", {
    name: "removeUserFromInstanceGroup",
    description: `remove user from instance group`,
    inputSchema: {"type":"object","properties":{"name":{"type":"string"},"requestBody":{"type":"object","properties":{"email":{"type":"string"}},"required":["email"],"description":"user to remove from instance group"}},"required":["name","requestBody"]},
    method: "post",
    pathTemplate: "/groups/removeuser/{name}",
    executionParameters: [{"name":"name","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["exportInstanceGroups", {
    name: "exportInstanceGroups",
    description: `export instance groups`,
    inputSchema: {"type":"object","properties":{}},
    method: "get",
    pathTemplate: "/groups/export",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["overwriteInstanceGroups", {
    name: "overwriteInstanceGroups",
    description: `overwrite instance groups`,
    inputSchema: {"type":"object","properties":{"requestBody":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string"},"summary":{"type":"string"},"emails":{"type":"array","items":{"type":"string"}},"id":{"type":"string"},"scim_display_name":{"type":"string"},"external_id":{"type":"string"}},"required":["name"]},"description":"overwrite instance groups"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/groups/overwrite",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listGroups", {
    name: "listGroups",
    description: `list groups`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"page":{"type":"number","description":"which page to return (start at 1, default 1)"},"per_page":{"type":"number","description":"number of items to return for a given page (default 30, max 100)"}},"required":["workspace"]},
    method: "get",
    pathTemplate: "/w/{workspace}/groups/list",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"page","in":"query"},{"name":"per_page","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listGroupNames", {
    name: "listGroupNames",
    description: `list group names`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"only_member_of":{"type":"boolean","description":"only list the groups the user is member of (default false)"}},"required":["workspace"]},
    method: "get",
    pathTemplate: "/w/{workspace}/groups/listnames",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"only_member_of","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["createGroup", {
    name: "createGroup",
    description: `create group`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"object","properties":{"name":{"type":"string"},"summary":{"type":"string"}},"required":["name"],"description":"create group"}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/groups/create",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["updateGroup", {
    name: "updateGroup",
    description: `update group`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"name":{"type":"string"},"requestBody":{"type":"object","properties":{"summary":{"type":"string"}},"description":"updated group"}},"required":["workspace","name","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/groups/update/{name}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"name","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["deleteGroup", {
    name: "deleteGroup",
    description: `delete group`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"name":{"type":"string"}},"required":["workspace","name"]},
    method: "delete",
    pathTemplate: "/w/{workspace}/groups/delete/{name}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"name","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getGroup", {
    name: "getGroup",
    description: `get group`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"name":{"type":"string"}},"required":["workspace","name"]},
    method: "get",
    pathTemplate: "/w/{workspace}/groups/get/{name}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"name","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["addUserToGroup", {
    name: "addUserToGroup",
    description: `add user to group`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"name":{"type":"string"},"requestBody":{"type":"object","properties":{"username":{"type":"string"}},"description":"added user to group"}},"required":["workspace","name","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/groups/adduser/{name}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"name","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["removeUserToGroup", {
    name: "removeUserToGroup",
    description: `remove user to group`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"name":{"type":"string"},"requestBody":{"type":"object","properties":{"username":{"type":"string"}},"description":"added user to group"}},"required":["workspace","name","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/groups/removeuser/{name}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"name","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listFolders", {
    name: "listFolders",
    description: `list folders`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"page":{"type":"number","description":"which page to return (start at 1, default 1)"},"per_page":{"type":"number","description":"number of items to return for a given page (default 30, max 100)"}},"required":["workspace"]},
    method: "get",
    pathTemplate: "/w/{workspace}/folders/list",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"page","in":"query"},{"name":"per_page","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listFolderNames", {
    name: "listFolderNames",
    description: `list folder names`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"only_member_of":{"type":"boolean","description":"only list the folders the user is member of (default false)"}},"required":["workspace"]},
    method: "get",
    pathTemplate: "/w/{workspace}/folders/listnames",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"only_member_of","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["createFolder", {
    name: "createFolder",
    description: `create folder`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"object","properties":{"name":{"type":"string"},"summary":{"type":"string"},"owners":{"type":"array","items":{"type":"string"}},"extra_perms":{"additionalProperties":{"type":"boolean"}}},"required":["name"],"description":"create folder"}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/folders/create",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["updateFolder", {
    name: "updateFolder",
    description: `update folder`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"name":{"type":"string"},"requestBody":{"type":"object","properties":{"summary":{"type":"string"},"owners":{"type":"array","items":{"type":"string"}},"extra_perms":{"additionalProperties":{"type":"boolean"}}},"description":"update folder"}},"required":["workspace","name","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/folders/update/{name}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"name","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["deleteFolder", {
    name: "deleteFolder",
    description: `delete folder`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"name":{"type":"string"}},"required":["workspace","name"]},
    method: "delete",
    pathTemplate: "/w/{workspace}/folders/delete/{name}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"name","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getFolder", {
    name: "getFolder",
    description: `get folder`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"name":{"type":"string"}},"required":["workspace","name"]},
    method: "get",
    pathTemplate: "/w/{workspace}/folders/get/{name}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"name","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["existsFolder", {
    name: "existsFolder",
    description: `exists folder`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"name":{"type":"string"}},"required":["workspace","name"]},
    method: "get",
    pathTemplate: "/w/{workspace}/folders/exists/{name}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"name","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getFolderUsage", {
    name: "getFolderUsage",
    description: `get folder usage`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"name":{"type":"string"}},"required":["workspace","name"]},
    method: "get",
    pathTemplate: "/w/{workspace}/folders/getusage/{name}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"name","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["addOwnerToFolder", {
    name: "addOwnerToFolder",
    description: `add owner to folder`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"name":{"type":"string"},"requestBody":{"type":"object","properties":{"owner":{"type":"string"}},"required":["owner"],"description":"owner user to folder"}},"required":["workspace","name","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/folders/addowner/{name}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"name","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["removeOwnerToFolder", {
    name: "removeOwnerToFolder",
    description: `remove owner to folder`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"name":{"type":"string"},"requestBody":{"type":"object","properties":{"owner":{"type":"string"},"write":{"type":"boolean"}},"required":["owner"],"description":"added owner to folder"}},"required":["workspace","name","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/folders/removeowner/{name}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"name","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listWorkers", {
    name: "listWorkers",
    description: `list workers`,
    inputSchema: {"type":"object","properties":{"page":{"type":"number","description":"which page to return (start at 1, default 1)"},"per_page":{"type":"number","description":"number of items to return for a given page (default 30, max 100)"},"ping_since":{"type":"number","description":"number of seconds the worker must have had a last ping more recent of (default to 300)"}}},
    method: "get",
    pathTemplate: "/workers/list",
    executionParameters: [{"name":"page","in":"query"},{"name":"per_page","in":"query"},{"name":"ping_since","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["existsWorkerWithTag", {
    name: "existsWorkerWithTag",
    description: `exists worker with tag`,
    inputSchema: {"type":"object","properties":{"tag":{"type":"string"}},"required":["tag"]},
    method: "get",
    pathTemplate: "/workers/exists_worker_with_tag",
    executionParameters: [{"name":"tag","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getQueueMetrics", {
    name: "getQueueMetrics",
    description: `get queue metrics`,
    inputSchema: {"type":"object","properties":{}},
    method: "get",
    pathTemplate: "/workers/queue_metrics",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getCountsOfJobsWaitingPerTag", {
    name: "getCountsOfJobsWaitingPerTag",
    description: `get counts of jobs waiting for an executor per tag`,
    inputSchema: {"type":"object","properties":{}},
    method: "get",
    pathTemplate: "/workers/queue_counts",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listWorkerGroups", {
    name: "listWorkerGroups",
    description: `list worker groups`,
    inputSchema: {"type":"object","properties":{}},
    method: "get",
    pathTemplate: "/configs/list_worker_groups",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["get_config", {
    name: "get_config",
    description: `get config`,
    inputSchema: {"type":"object","properties":{"name":{"type":"string"}},"required":["name"]},
    method: "get",
    pathTemplate: "/configs/get/{name}",
    executionParameters: [{"name":"name","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["updateConfig", {
    name: "updateConfig",
    description: `Update config`,
    inputSchema: {"type":"object","properties":{"name":{"type":"string"},"requestBody":{"description":"worker group"}},"required":["name","requestBody"]},
    method: "post",
    pathTemplate: "/configs/update/{name}",
    executionParameters: [{"name":"name","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["deleteConfig", {
    name: "deleteConfig",
    description: `Delete Config`,
    inputSchema: {"type":"object","properties":{"name":{"type":"string"}},"required":["name"]},
    method: "delete",
    pathTemplate: "/configs/update/{name}",
    executionParameters: [{"name":"name","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listConfigs", {
    name: "listConfigs",
    description: `list configs`,
    inputSchema: {"type":"object","properties":{}},
    method: "get",
    pathTemplate: "/configs/list",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listAutoscalingEvents", {
    name: "listAutoscalingEvents",
    description: `List autoscaling events`,
    inputSchema: {"type":"object","properties":{"worker_group":{"type":"string"}},"required":["worker_group"]},
    method: "get",
    pathTemplate: "/configs/list_autoscaling_events/{worker_group}",
    executionParameters: [{"name":"worker_group","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listAvailablePythonVersions", {
    name: "listAvailablePythonVersions",
    description: `Get currently available python versions provided by UV.`,
    inputSchema: {"type":"object","properties":{}},
    method: "get",
    pathTemplate: "/configs/list_available_python_versions",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["createAgentToken", {
    name: "createAgentToken",
    description: `create agent token`,
    inputSchema: {"type":"object","properties":{"requestBody":{"type":"object","properties":{"worker_group":{"type":"string"},"tags":{"type":"array","items":{"type":"string"}},"exp":{"type":"number"}},"required":["worker_group","tags","exp"],"description":"agent token"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/agent_workers/create_agent_token",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["blacklistAgentToken", {
    name: "blacklistAgentToken",
    description: `blacklist agent token (requires super admin)`,
    inputSchema: {"type":"object","properties":{"requestBody":{"type":"object","properties":{"token":{"type":"string","description":"The agent token to blacklist"},"expires_at":{"type":"string","format":"date-time","description":"Optional expiration date for the blacklist entry"}},"required":["token"],"description":"token to blacklist"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/agent_workers/blacklist_token",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["removeBlacklistAgentToken", {
    name: "removeBlacklistAgentToken",
    description: `remove agent token from blacklist (requires super admin)`,
    inputSchema: {"type":"object","properties":{"requestBody":{"type":"object","properties":{"token":{"type":"string","description":"The agent token to remove from blacklist"}},"required":["token"],"description":"token to remove from blacklist"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/agent_workers/remove_blacklist_token",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listBlacklistedAgentTokens", {
    name: "listBlacklistedAgentTokens",
    description: `list blacklisted agent tokens (requires super admin)`,
    inputSchema: {"type":"object","properties":{"include_expired":{"type":"boolean","default":false,"description":"Whether to include expired blacklisted tokens"}}},
    method: "get",
    pathTemplate: "/agent_workers/list_blacklisted_tokens",
    executionParameters: [{"name":"include_expired","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getGranularAcls", {
    name: "getGranularAcls",
    description: `get granular acls`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"},"kind":{"type":"string","enum":["script","group_","resource","schedule","variable","flow","folder","app","raw_app","http_trigger","websocket_trigger","kafka_trigger","nats_trigger","postgres_trigger","mqtt_trigger","gcp_trigger","sqs_trigger"]}},"required":["workspace","path","kind"]},
    method: "get",
    pathTemplate: "/w/{workspace}/acls/get/{kind}/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"},{"name":"kind","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["addGranularAcls", {
    name: "addGranularAcls",
    description: `add granular acls`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"},"kind":{"type":"string","enum":["script","group_","resource","schedule","variable","flow","folder","app","raw_app","http_trigger","websocket_trigger","kafka_trigger","nats_trigger","postgres_trigger","mqtt_trigger","gcp_trigger","sqs_trigger"]},"requestBody":{"type":"object","properties":{"owner":{"type":"string"},"write":{"type":"boolean"}},"required":["owner"],"description":"acl to add"}},"required":["workspace","path","kind","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/acls/add/{kind}/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"},{"name":"kind","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["removeGranularAcls", {
    name: "removeGranularAcls",
    description: `remove granular acls`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"},"kind":{"type":"string","enum":["script","group_","resource","schedule","variable","flow","folder","app","raw_app","http_trigger","websocket_trigger","kafka_trigger","nats_trigger","postgres_trigger","mqtt_trigger","gcp_trigger","sqs_trigger"]},"requestBody":{"type":"object","properties":{"owner":{"type":"string"}},"required":["owner"],"description":"acl to add"}},"required":["workspace","path","kind","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/acls/remove/{kind}/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"},{"name":"kind","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["setCaptureConfig", {
    name: "setCaptureConfig",
    description: `set capture config`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"object","properties":{"trigger_kind":{"type":"string","enum":["webhook","http","websocket","kafka","email","nats","postgres","sqs","mqtt","gcp"]},"path":{"type":"string"},"is_flow":{"type":"boolean"},"trigger_config":{"type":"object"}},"required":["trigger_kind","path","is_flow"],"description":"capture config"}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/capture/set_config",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["pingCaptureConfig", {
    name: "pingCaptureConfig",
    description: `ping capture config`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"trigger_kind":{"type":"string","enum":["webhook","http","websocket","kafka","email","nats","postgres","sqs","mqtt","gcp"]},"runnable_kind":{"type":"string","enum":["script","flow"]},"path":{"type":"string"}},"required":["workspace","trigger_kind","runnable_kind","path"]},
    method: "post",
    pathTemplate: "/w/{workspace}/capture/ping_config/{trigger_kind}/{runnable_kind}/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"trigger_kind","in":"path"},{"name":"runnable_kind","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getCaptureConfigs", {
    name: "getCaptureConfigs",
    description: `get capture configs for a script or flow`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"runnable_kind":{"type":"string","enum":["script","flow"]},"path":{"type":"string"}},"required":["workspace","runnable_kind","path"]},
    method: "get",
    pathTemplate: "/w/{workspace}/capture/get_configs/{runnable_kind}/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"runnable_kind","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listCaptures", {
    name: "listCaptures",
    description: `list captures for a script or flow`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"runnable_kind":{"type":"string","enum":["script","flow"]},"path":{"type":"string"},"trigger_kind":{"type":"string","enum":["webhook","http","websocket","kafka","email","nats","postgres","sqs","mqtt","gcp"]},"page":{"type":"number","description":"which page to return (start at 1, default 1)"},"per_page":{"type":"number","description":"number of items to return for a given page (default 30, max 100)"}},"required":["workspace","runnable_kind","path"]},
    method: "get",
    pathTemplate: "/w/{workspace}/capture/list/{runnable_kind}/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"runnable_kind","in":"path"},{"name":"path","in":"path"},{"name":"trigger_kind","in":"query"},{"name":"page","in":"query"},{"name":"per_page","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["moveCapturesAndConfigs", {
    name: "moveCapturesAndConfigs",
    description: `move captures and configs for a script or flow`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"runnable_kind":{"type":"string","enum":["script","flow"]},"path":{"type":"string"},"requestBody":{"type":"object","properties":{"new_path":{"type":"string"}},"description":"move captures and configs to a new path"}},"required":["workspace","runnable_kind","path","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/capture/move/{runnable_kind}/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"runnable_kind","in":"path"},{"name":"path","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getCapture", {
    name: "getCapture",
    description: `get a capture`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"id":{"type":"number"}},"required":["workspace","id"]},
    method: "get",
    pathTemplate: "/w/{workspace}/capture/{id}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["deleteCapture", {
    name: "deleteCapture",
    description: `delete a capture`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"id":{"type":"number"}},"required":["workspace","id"]},
    method: "delete",
    pathTemplate: "/w/{workspace}/capture/{id}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["star", {
    name: "star",
    description: `star item`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"object","properties":{"path":{"type":"string"},"favorite_kind":{"type":"string","enum":["flow","app","script","raw_app"]}},"description":"The JSON request body."}},"required":["workspace"]},
    method: "post",
    pathTemplate: "/w/{workspace}/favorites/star",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["unstar", {
    name: "unstar",
    description: `unstar item`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"object","properties":{"path":{"type":"string"},"favorite_kind":{"type":"string","enum":["flow","app","script","raw_app"]}},"description":"The JSON request body."}},"required":["workspace"]},
    method: "post",
    pathTemplate: "/w/{workspace}/favorites/unstar",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getInputHistory", {
    name: "getInputHistory",
    description: `List Inputs used in previously completed jobs`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"runnable_id":{"type":"string"},"runnable_type":{"type":"string","enum":["ScriptHash","ScriptPath","FlowPath"]},"page":{"type":"number","description":"which page to return (start at 1, default 1)"},"per_page":{"type":"number","description":"number of items to return for a given page (default 30, max 100)"},"args":{"type":"string","description":"filter on jobs containing those args as a json subset (@> in postgres)"},"include_preview":{"type":"boolean"}},"required":["workspace"]},
    method: "get",
    pathTemplate: "/w/{workspace}/inputs/history",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"runnable_id","in":"query"},{"name":"runnable_type","in":"query"},{"name":"page","in":"query"},{"name":"per_page","in":"query"},{"name":"args","in":"query"},{"name":"include_preview","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getArgsFromHistoryOrSavedInput", {
    name: "getArgsFromHistoryOrSavedInput",
    description: `Get args from history or saved input`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"jobOrInputId":{"type":"string"},"input":{"type":"boolean"},"allow_large":{"type":"boolean"}},"required":["workspace","jobOrInputId"]},
    method: "get",
    pathTemplate: "/w/{workspace}/inputs/{jobOrInputId}/args",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"jobOrInputId","in":"path"},{"name":"input","in":"query"},{"name":"allow_large","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listInputs", {
    name: "listInputs",
    description: `List saved Inputs for a Runnable`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"runnable_id":{"type":"string"},"runnable_type":{"type":"string","enum":["ScriptHash","ScriptPath","FlowPath"]},"page":{"type":"number","description":"which page to return (start at 1, default 1)"},"per_page":{"type":"number","description":"number of items to return for a given page (default 30, max 100)"}},"required":["workspace"]},
    method: "get",
    pathTemplate: "/w/{workspace}/inputs/list",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"runnable_id","in":"query"},{"name":"runnable_type","in":"query"},{"name":"page","in":"query"},{"name":"per_page","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["createInput", {
    name: "createInput",
    description: `Create an Input for future use in a script or flow`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"runnable_id":{"type":"string"},"runnable_type":{"type":"string","enum":["ScriptHash","ScriptPath","FlowPath"]},"requestBody":{"type":"object","properties":{"name":{"type":"string"},"args":{"type":"object"}},"required":["name","args","created_by"],"description":"Input"}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/inputs/create",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"runnable_id","in":"query"},{"name":"runnable_type","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["updateInput", {
    name: "updateInput",
    description: `Update an Input`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"object","properties":{"id":{"type":"string"},"name":{"type":"string"},"is_public":{"type":"boolean"}},"required":["id","name","is_public"],"description":"UpdateInput"}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/inputs/update",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["deleteInput", {
    name: "deleteInput",
    description: `Delete a Saved Input`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"input":{"type":"string"}},"required":["workspace","input"]},
    method: "post",
    pathTemplate: "/w/{workspace}/inputs/delete/{input}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"input","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["duckdbConnectionSettings", {
    name: "duckdbConnectionSettings",
    description: `Converts an S3 resource to the set of instructions necessary to connect DuckDB to an S3 bucket`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"object","properties":{"s3_resource":{"type":"object","properties":{"bucket":{"type":"string"},"region":{"type":"string"},"endPoint":{"type":"string"},"useSSL":{"type":"boolean"},"accessKey":{"type":"string"},"secretKey":{"type":"string"},"pathStyle":{"type":"boolean"}},"required":["bucket","region","endPoint","useSSL","pathStyle"]}},"description":"S3 resource to connect to"}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/job_helpers/duckdb_connection_settings",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["duckdbConnectionSettingsV2", {
    name: "duckdbConnectionSettingsV2",
    description: `Converts an S3 resource to the set of instructions necessary to connect DuckDB to an S3 bucket`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"object","properties":{"s3_resource_path":{"type":"string"}},"description":"S3 resource path to use to generate the connection settings. If empty, the S3 resource defined in the workspace settings will be used"}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/job_helpers/v2/duckdb_connection_settings",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["polarsConnectionSettings", {
    name: "polarsConnectionSettings",
    description: `Converts an S3 resource to the set of arguments necessary to connect Polars to an S3 bucket`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"object","properties":{"s3_resource":{"type":"object","properties":{"bucket":{"type":"string"},"region":{"type":"string"},"endPoint":{"type":"string"},"useSSL":{"type":"boolean"},"accessKey":{"type":"string"},"secretKey":{"type":"string"},"pathStyle":{"type":"boolean"}},"required":["bucket","region","endPoint","useSSL","pathStyle"]}},"description":"S3 resource to connect to"}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/job_helpers/polars_connection_settings",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["polarsConnectionSettingsV2", {
    name: "polarsConnectionSettingsV2",
    description: `Converts an S3 resource to the set of arguments necessary to connect Polars to an S3 bucket`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"object","properties":{"s3_resource_path":{"type":"string"}},"description":"S3 resource path to use to generate the connection settings. If empty, the S3 resource defined in the workspace settings will be used"}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/job_helpers/v2/polars_connection_settings",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["s3ResourceInfo", {
    name: "s3ResourceInfo",
    description: `Returns the s3 resource associated to the provided path, or the workspace default S3 resource`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"object","properties":{"s3_resource_path":{"type":"string"}},"description":"S3 resource path to use. If empty, the S3 resource defined in the workspace settings will be used"}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/job_helpers/v2/s3_resource_info",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["datasetStorageTestConnection", {
    name: "datasetStorageTestConnection",
    description: `Test connection to the workspace object storage`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"storage":{"type":"string"}},"required":["workspace"]},
    method: "get",
    pathTemplate: "/w/{workspace}/job_helpers/test_connection",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"storage","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listStoredFiles", {
    name: "listStoredFiles",
    description: `List the file keys available in a workspace object storage`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"max_keys":{"type":"number"},"marker":{"type":"string"},"prefix":{"type":"string"},"storage":{"type":"string"}},"required":["workspace","max_keys"]},
    method: "get",
    pathTemplate: "/w/{workspace}/job_helpers/list_stored_files",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"max_keys","in":"query"},{"name":"marker","in":"query"},{"name":"prefix","in":"query"},{"name":"storage","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["loadFileMetadata", {
    name: "loadFileMetadata",
    description: `Load metadata of the file`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"file_key":{"type":"string"},"storage":{"type":"string"}},"required":["workspace","file_key"]},
    method: "get",
    pathTemplate: "/w/{workspace}/job_helpers/load_file_metadata",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"file_key","in":"query"},{"name":"storage","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["loadFilePreview", {
    name: "loadFilePreview",
    description: `Load a preview of the file`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"file_key":{"type":"string"},"file_size_in_bytes":{"type":"number"},"file_mime_type":{"type":"string"},"csv_separator":{"type":"string"},"csv_has_header":{"type":"boolean"},"read_bytes_from":{"type":"number"},"read_bytes_length":{"type":"number"},"storage":{"type":"string"}},"required":["workspace","file_key"]},
    method: "get",
    pathTemplate: "/w/{workspace}/job_helpers/load_file_preview",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"file_key","in":"query"},{"name":"file_size_in_bytes","in":"query"},{"name":"file_mime_type","in":"query"},{"name":"csv_separator","in":"query"},{"name":"csv_has_header","in":"query"},{"name":"read_bytes_from","in":"query"},{"name":"read_bytes_length","in":"query"},{"name":"storage","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["loadParquetPreview", {
    name: "loadParquetPreview",
    description: `Load a preview of a parquet file`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"},"offset":{"type":"number"},"limit":{"type":"number"},"sort_col":{"type":"string"},"sort_desc":{"type":"boolean"},"search_col":{"type":"string"},"search_term":{"type":"string"},"storage":{"type":"string"}},"required":["workspace","path"]},
    method: "get",
    pathTemplate: "/w/{workspace}/job_helpers/load_parquet_preview/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"},{"name":"offset","in":"query"},{"name":"limit","in":"query"},{"name":"sort_col","in":"query"},{"name":"sort_desc","in":"query"},{"name":"search_col","in":"query"},{"name":"search_term","in":"query"},{"name":"storage","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["loadTableRowCount", {
    name: "loadTableRowCount",
    description: `Load the table row count`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"},"search_col":{"type":"string"},"search_term":{"type":"string"},"storage":{"type":"string"}},"required":["workspace","path"]},
    method: "get",
    pathTemplate: "/w/{workspace}/job_helpers/load_table_count/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"},{"name":"search_col","in":"query"},{"name":"search_term","in":"query"},{"name":"storage","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["loadCsvPreview", {
    name: "loadCsvPreview",
    description: `Load a preview of a csv file`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"path":{"type":"string"},"offset":{"type":"number"},"limit":{"type":"number"},"sort_col":{"type":"string"},"sort_desc":{"type":"boolean"},"search_col":{"type":"string"},"search_term":{"type":"string"},"storage":{"type":"string"},"csv_separator":{"type":"string"}},"required":["workspace","path"]},
    method: "get",
    pathTemplate: "/w/{workspace}/job_helpers/load_csv_preview/{path}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"path","in":"path"},{"name":"offset","in":"query"},{"name":"limit","in":"query"},{"name":"sort_col","in":"query"},{"name":"sort_desc","in":"query"},{"name":"search_col","in":"query"},{"name":"search_term","in":"query"},{"name":"storage","in":"query"},{"name":"csv_separator","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["deleteS3File", {
    name: "deleteS3File",
    description: `Permanently delete file from S3`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"file_key":{"type":"string"},"storage":{"type":"string"}},"required":["workspace","file_key"]},
    method: "delete",
    pathTemplate: "/w/{workspace}/job_helpers/delete_s3_file",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"file_key","in":"query"},{"name":"storage","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["moveS3File", {
    name: "moveS3File",
    description: `Move a S3 file from one path to the other within the same bucket`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"src_file_key":{"type":"string"},"dest_file_key":{"type":"string"},"storage":{"type":"string"}},"required":["workspace","src_file_key","dest_file_key"]},
    method: "get",
    pathTemplate: "/w/{workspace}/job_helpers/move_s3_file",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"src_file_key","in":"query"},{"name":"dest_file_key","in":"query"},{"name":"storage","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["fileUpload", {
    name: "fileUpload",
    description: `Upload file to S3 bucket`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"file_key":{"type":"string"},"file_extension":{"type":"string"},"s3_resource_path":{"type":"string"},"resource_type":{"type":"string"},"storage":{"type":"string"},"content_type":{"type":"string"},"content_disposition":{"type":"string"},"requestBody":{"type":"string","description":"File content"}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/job_helpers/upload_s3_file",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"file_key","in":"query"},{"name":"file_extension","in":"query"},{"name":"s3_resource_path","in":"query"},{"name":"resource_type","in":"query"},{"name":"storage","in":"query"},{"name":"content_type","in":"query"},{"name":"content_disposition","in":"query"}],
    requestBodyContentType: "application/octet-stream",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["fileDownload", {
    name: "fileDownload",
    description: `Download file from S3 bucket`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"file_key":{"type":"string"},"s3_resource_path":{"type":"string"},"resource_type":{"type":"string"},"storage":{"type":"string"}},"required":["workspace","file_key"]},
    method: "get",
    pathTemplate: "/w/{workspace}/job_helpers/download_s3_file",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"file_key","in":"query"},{"name":"s3_resource_path","in":"query"},{"name":"resource_type","in":"query"},{"name":"storage","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["fileDownloadParquetAsCsv", {
    name: "fileDownloadParquetAsCsv",
    description: `Download file to S3 bucket`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"file_key":{"type":"string"},"s3_resource_path":{"type":"string"},"resource_type":{"type":"string"}},"required":["workspace","file_key"]},
    method: "get",
    pathTemplate: "/w/{workspace}/job_helpers/download_s3_parquet_file_as_csv",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"file_key","in":"query"},{"name":"s3_resource_path","in":"query"},{"name":"resource_type","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getJobMetrics", {
    name: "getJobMetrics",
    description: `get job metrics`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"id":{"type":"string","format":"uuid"},"requestBody":{"type":"object","properties":{"timeseries_max_datapoints":{"type":"number"},"from_timestamp":{"type":"string","format":"date-time"},"to_timestamp":{"type":"string","format":"date-time"}},"description":"parameters for statistics retrieval"}},"required":["workspace","id","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/job_metrics/get/{id}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["setJobProgress", {
    name: "setJobProgress",
    description: `set job metrics`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"id":{"type":"string","format":"uuid"},"requestBody":{"type":"object","properties":{"percent":{"type":"number"},"flow_job_id":{"type":"string","format":"uuid"}},"description":"parameters for statistics retrieval"}},"required":["workspace","id","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/job_metrics/set_progress/{id}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getJobProgress", {
    name: "getJobProgress",
    description: `get job progress`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"id":{"type":"string","format":"uuid"}},"required":["workspace","id"]},
    method: "get",
    pathTemplate: "/w/{workspace}/job_metrics/get_progress/{id}",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listLogFiles", {
    name: "listLogFiles",
    description: `list log files ordered by timestamp`,
    inputSchema: {"type":"object","properties":{"before":{"type":"string","format":"date-time","description":"filter on started before (inclusive) timestamp"},"after":{"type":"string","format":"date-time","description":"filter on created after (exclusive) timestamp"},"with_error":{"type":"boolean"}}},
    method: "get",
    pathTemplate: "/service_logs/list_files",
    executionParameters: [{"name":"before","in":"query"},{"name":"after","in":"query"},{"name":"with_error","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getLogFile", {
    name: "getLogFile",
    description: `get log file by path`,
    inputSchema: {"type":"object","properties":{"path":{"type":"string"}},"required":["path"]},
    method: "get",
    pathTemplate: "/service_logs/get_log_file/{path}",
    executionParameters: [{"name":"path","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listConcurrencyGroups", {
    name: "listConcurrencyGroups",
    description: `List all concurrency groups`,
    inputSchema: {"type":"object","properties":{}},
    method: "get",
    pathTemplate: "/concurrency_groups/list",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["deleteConcurrencyGroup", {
    name: "deleteConcurrencyGroup",
    description: `Delete concurrency group`,
    inputSchema: {"type":"object","properties":{"concurrency_id":{"type":"string"}},"required":["concurrency_id"]},
    method: "delete",
    pathTemplate: "/concurrency_groups/prune/{concurrency_id}",
    executionParameters: [{"name":"concurrency_id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["getConcurrencyKey", {
    name: "getConcurrencyKey",
    description: `Get the concurrency key for a job that has concurrency limits enabled`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid"}},"required":["id"]},
    method: "get",
    pathTemplate: "/concurrency_groups/{id}/key",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listExtendedJobs", {
    name: "listExtendedJobs",
    description: `Get intervals of job runtime concurrency`,
    inputSchema: {"type":"object","properties":{"concurrency_key":{"type":"string"},"row_limit":{"type":"number"},"workspace":{"type":"string"},"created_by":{"type":"string","description":"mask to filter exact matching user creator"},"label":{"type":"string","description":"mask to filter exact matching job's label (job labels are completed jobs with as a result an object containing a string in the array at key 'wm_labels')"},"parent_job":{"type":"string","format":"uuid","description":"The parent job that is at the origin and responsible for the execution of this script if any"},"script_path_exact":{"type":"string","description":"mask to filter exact matching path"},"script_path_start":{"type":"string","description":"mask to filter matching starting path"},"schedule_path":{"type":"string","description":"mask to filter by schedule path"},"script_hash":{"type":"string","description":"mask to filter exact matching path"},"started_before":{"type":"string","format":"date-time","description":"filter on started before (inclusive) timestamp"},"started_after":{"type":"string","format":"date-time","description":"filter on started after (exclusive) timestamp"},"created_or_started_before":{"type":"string","format":"date-time","description":"filter on created_at for non non started job and started_at otherwise before (inclusive) timestamp"},"running":{"type":"boolean","description":"filter on running jobs"},"scheduled_for_before_now":{"type":"boolean","description":"filter on jobs scheduled_for before now (hence waitinf for a worker)"},"created_or_started_after":{"type":"string","format":"date-time","description":"filter on created_at for non non started job and started_at otherwise after (exclusive) timestamp"},"created_or_started_after_completed_jobs":{"type":"string","format":"date-time","description":"filter on created_at for non non started job and started_at otherwise after (exclusive) timestamp but only for the completed jobs"},"job_kinds":{"type":"string","description":"filter on job kind (values 'preview', 'script', 'dependencies', 'flow') separated by,"},"args":{"type":"string","description":"filter on jobs containing those args as a json subset (@> in postgres)"},"tag":{"type":"string","description":"filter on jobs with a given tag/worker group"},"result":{"type":"string","description":"filter on jobs containing those result as a json subset (@> in postgres)"},"allow_wildcards":{"type":"boolean","description":"allow wildcards (*) in the filter of label, tag, worker"},"page":{"type":"number","description":"which page to return (start at 1, default 1)"},"per_page":{"type":"number","description":"number of items to return for a given page (default 30, max 100)"},"is_skipped":{"type":"boolean","description":"is the job skipped"},"is_flow_step":{"type":"boolean","description":"is the job a flow step"},"has_null_parent":{"type":"boolean","description":"has null parent"},"success":{"type":"boolean","description":"filter on successful jobs"},"all_workspaces":{"type":"boolean","description":"get jobs from all workspaces (only valid if request come from the `admins` workspace)"},"is_not_schedule":{"type":"boolean","description":"is not a scheduled job"}},"required":["workspace"]},
    method: "get",
    pathTemplate: "/w/{workspace}/concurrency_groups/list_jobs",
    executionParameters: [{"name":"concurrency_key","in":"query"},{"name":"row_limit","in":"query"},{"name":"workspace","in":"path"},{"name":"created_by","in":"query"},{"name":"label","in":"query"},{"name":"parent_job","in":"query"},{"name":"script_path_exact","in":"query"},{"name":"script_path_start","in":"query"},{"name":"schedule_path","in":"query"},{"name":"script_hash","in":"query"},{"name":"started_before","in":"query"},{"name":"started_after","in":"query"},{"name":"created_or_started_before","in":"query"},{"name":"running","in":"query"},{"name":"scheduled_for_before_now","in":"query"},{"name":"created_or_started_after","in":"query"},{"name":"created_or_started_after_completed_jobs","in":"query"},{"name":"job_kinds","in":"query"},{"name":"args","in":"query"},{"name":"tag","in":"query"},{"name":"result","in":"query"},{"name":"allow_wildcards","in":"query"},{"name":"page","in":"query"},{"name":"per_page","in":"query"},{"name":"is_skipped","in":"query"},{"name":"is_flow_step","in":"query"},{"name":"has_null_parent","in":"query"},{"name":"success","in":"query"},{"name":"all_workspaces","in":"query"},{"name":"is_not_schedule","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["searchJobsIndex", {
    name: "searchJobsIndex",
    description: `Search through jobs with a string query`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"search_query":{"type":"string"},"pagination_offset":{"type":"number"}},"required":["workspace","search_query"]},
    method: "get",
    pathTemplate: "/srch/w/{workspace}/index/search/job",
    executionParameters: [{"name":"workspace","in":"path"},{"name":"search_query","in":"query"},{"name":"pagination_offset","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["searchLogsIndex", {
    name: "searchLogsIndex",
    description: `Search through service logs with a string query`,
    inputSchema: {"type":"object","properties":{"search_query":{"type":"string"},"mode":{"type":"string"},"worker_group":{"type":"string"},"hostname":{"type":"string"},"min_ts":{"type":"string","format":"date-time"},"max_ts":{"type":"string","format":"date-time"}},"required":["search_query","mode","hostname"]},
    method: "get",
    pathTemplate: "/srch/index/search/service_logs",
    executionParameters: [{"name":"search_query","in":"query"},{"name":"mode","in":"query"},{"name":"worker_group","in":"query"},{"name":"hostname","in":"query"},{"name":"min_ts","in":"query"},{"name":"max_ts","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["countSearchLogsIndex", {
    name: "countSearchLogsIndex",
    description: `Search and count the log line hits on every provided host`,
    inputSchema: {"type":"object","properties":{"search_query":{"type":"string"},"min_ts":{"type":"string","format":"date-time"},"max_ts":{"type":"string","format":"date-time"}},"required":["search_query"]},
    method: "get",
    pathTemplate: "/srch/index/search/count_service_logs",
    executionParameters: [{"name":"search_query","in":"query"},{"name":"min_ts","in":"query"},{"name":"max_ts","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["clearIndex", {
    name: "clearIndex",
    description: `Restart container and delete the index to recreate it.`,
    inputSchema: {"type":"object","properties":{"idx_name":{"type":"string","enum":["JobIndex","ServiceLogIndex"]}},"required":["idx_name"]},
    method: "delete",
    pathTemplate: "/srch/index/delete/{idx_name}",
    executionParameters: [{"name":"idx_name","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listAssets", {
    name: "listAssets",
    description: `List all assets in the workspace`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"}},"required":["workspace"]},
    method: "get",
    pathTemplate: "/w/{workspace}/assets/list",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listAssetsByUsage", {
    name: "listAssetsByUsage",
    description: `List all assets used by given usages paths`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"},"requestBody":{"type":"object","required":["usages"],"properties":{"usages":{"type":"array","items":{"type":"object","required":["path","kind"],"properties":{"path":{"type":"string"},"kind":{"type":"string","enum":["script","flow"]}}}}},"description":"list assets by usages"}},"required":["workspace","requestBody"]},
    method: "post",
    pathTemplate: "/w/{workspace}/assets/list_by_usages",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
  ["listMcpTools", {
    name: "listMcpTools",
    description: `list available MCP tools`,
    inputSchema: {"type":"object","properties":{"workspace":{"type":"string"}},"required":["workspace"]},
    method: "get",
    pathTemplate: "/mcp/w/{workspace}/list_tools",
    executionParameters: [{"name":"workspace","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]},{"cookieAuth":[]}]
  }],
]);

/**
 * Security schemes from the OpenAPI spec
 */
const securitySchemes =   {
    "bearerAuth": {
      "type": "http",
      "scheme": "bearer"
    },
    "cookieAuth": {
      "type": "apiKey",
      "in": "cookie",
      "name": "token"
    }
  };


server.setRequestHandler(ListToolsRequestSchema, async () => {
  const toolsForClient: Tool[] = Array.from(toolDefinitionMap.values()).map(def => ({
    name: def.name,
    description: def.description,
    inputSchema: def.inputSchema
  }));
  return { tools: toolsForClient };
});


server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest): Promise<CallToolResult> => {
  const { name: toolName, arguments: toolArgs } = request.params;
  const toolDefinition = toolDefinitionMap.get(toolName);
  if (!toolDefinition) {
    console.error(`Error: Unknown tool requested: ${toolName}`);
    return { content: [{ type: "text", text: `Error: Unknown tool requested: ${toolName}` }] };
  }
  return await executeApiTool(toolName, toolDefinition, toolArgs ?? {}, securitySchemes);
});



/**
 * Type definition for cached OAuth tokens
 */
interface TokenCacheEntry {
    token: string;
    expiresAt: number;
}

/**
 * Declare global __oauthTokenCache property for TypeScript
 */
declare global {
    var __oauthTokenCache: Record<string, TokenCacheEntry> | undefined;
}

/**
 * Acquires an OAuth2 token using client credentials flow
 * 
 * @param schemeName Name of the security scheme
 * @param scheme OAuth2 security scheme
 * @returns Acquired token or null if unable to acquire
 */
async function acquireOAuth2Token(schemeName: string, scheme: any): Promise<string | null | undefined> {
    try {
        // Check if we have the necessary credentials
        const clientId = process.env[`OAUTH_CLIENT_ID_SCHEMENAME`];
        const clientSecret = process.env[`OAUTH_CLIENT_SECRET_SCHEMENAME`];
        const scopes = process.env[`OAUTH_SCOPES_SCHEMENAME`];
        
        if (!clientId || !clientSecret) {
            console.error(`Missing client credentials for OAuth2 scheme '${schemeName}'`);
            return null;
        }
        
        // Initialize token cache if needed
        if (typeof global.__oauthTokenCache === 'undefined') {
            global.__oauthTokenCache = {};
        }
        
        // Check if we have a cached token
        const cacheKey = `${schemeName}_${clientId}`;
        const cachedToken = global.__oauthTokenCache[cacheKey];
        const now = Date.now();
        
        if (cachedToken && cachedToken.expiresAt > now) {
            console.error(`Using cached OAuth2 token for '${schemeName}' (expires in ${Math.floor((cachedToken.expiresAt - now) / 1000)} seconds)`);
            return cachedToken.token;
        }
        
        // Determine token URL based on flow type
        let tokenUrl = '';
        if (scheme.flows?.clientCredentials?.tokenUrl) {
            tokenUrl = scheme.flows.clientCredentials.tokenUrl;
            console.error(`Using client credentials flow for '${schemeName}'`);
        } else if (scheme.flows?.password?.tokenUrl) {
            tokenUrl = scheme.flows.password.tokenUrl;
            console.error(`Using password flow for '${schemeName}'`);
        } else {
            console.error(`No supported OAuth2 flow found for '${schemeName}'`);
            return null;
        }
        
        // Prepare the token request
        let formData = new URLSearchParams();
        formData.append('grant_type', 'client_credentials');
        
        // Add scopes if specified
        if (scopes) {
            formData.append('scope', scopes);
        }
        
        console.error(`Requesting OAuth2 token from ${tokenUrl}`);
        
        // Make the token request
        const response = await axios({
            method: 'POST',
            url: tokenUrl,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
            },
            data: formData.toString()
        });
        
        // Process the response
        if (response.data?.access_token) {
            const token = response.data.access_token;
            const expiresIn = response.data.expires_in || 3600; // Default to 1 hour
            
            // Cache the token
            global.__oauthTokenCache[cacheKey] = {
                token,
                expiresAt: now + (expiresIn * 1000) - 60000 // Expire 1 minute early
            };
            
            console.error(`Successfully acquired OAuth2 token for '${schemeName}' (expires in ${expiresIn} seconds)`);
            return token;
        } else {
            console.error(`Failed to acquire OAuth2 token for '${schemeName}': No access_token in response`);
            return null;
        }
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`Error acquiring OAuth2 token for '${schemeName}':`, errorMessage);
        return null;
    }
}


/**
 * Executes an API tool with the provided arguments
 * 
 * @param toolName Name of the tool to execute
 * @param definition Tool definition
 * @param toolArgs Arguments provided by the user
 * @param allSecuritySchemes Security schemes from the OpenAPI spec
 * @returns Call tool result
 */
async function executeApiTool(
    toolName: string,
    definition: McpToolDefinition,
    toolArgs: JsonObject,
    allSecuritySchemes: Record<string, any>
): Promise<CallToolResult> {
  try {
    // Validate arguments against the input schema
    let validatedArgs: JsonObject;
    try {
        const zodSchema = getZodSchemaFromJsonSchema(definition.inputSchema, toolName);
        const argsToParse = (typeof toolArgs === 'object' && toolArgs !== null) ? toolArgs : {};
        validatedArgs = zodSchema.parse(argsToParse);
    } catch (error: unknown) {
        if (error instanceof ZodError) {
            const validationErrorMessage = `Invalid arguments for tool '${toolName}': ${error.errors.map(e => `${e.path.join('.')} (${e.code}): ${e.message}`).join(', ')}`;
            return { content: [{ type: 'text', text: validationErrorMessage }] };
        } else {
             const errorMessage = error instanceof Error ? error.message : String(error);
             return { content: [{ type: 'text', text: `Internal error during validation setup: ${errorMessage}` }] };
        }
    }

    // Prepare URL, query parameters, headers, and request body
    let urlPath = definition.pathTemplate;
    const queryParams: Record<string, any> = {};
    const headers: Record<string, string> = { 'Accept': 'application/json' };
    let requestBodyData: any = undefined;

    // Apply parameters to the URL path, query, or headers
    definition.executionParameters.forEach((param) => {
        const value = validatedArgs[param.name];
        if (typeof value !== 'undefined' && value !== null) {
            if (param.in === 'path') {
                urlPath = urlPath.replace(`{${param.name}}`, encodeURIComponent(String(value)));
            }
            else if (param.in === 'query') {
                queryParams[param.name] = value;
            }
            else if (param.in === 'header') {
                headers[param.name.toLowerCase()] = String(value);
            }
        }
    });

    // Ensure all path parameters are resolved
    if (urlPath.includes('{')) {
        throw new Error(`Failed to resolve path parameters: ${urlPath}`);
    }
    
    // Construct the full URL
    const requestUrl = API_BASE_URL ? `${API_BASE_URL}${urlPath}` : urlPath;

    // Handle request body if needed
    if (definition.requestBodyContentType && typeof validatedArgs['requestBody'] !== 'undefined') {
        requestBodyData = validatedArgs['requestBody'];
        headers['content-type'] = definition.requestBodyContentType;
    }


    // Apply security requirements if available
    // Security requirements use OR between array items and AND within each object
    const appliedSecurity = definition.securityRequirements?.find(req => {
        // Try each security requirement (combined with OR)
        return Object.entries(req).every(([schemeName, scopesArray]) => {
            const scheme = allSecuritySchemes[schemeName];
            if (!scheme) return false;
            
            // API Key security (header, query, cookie)
            if (scheme.type === 'apiKey') {
                return !!process.env[`API_KEY_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`];
            }
            
            // HTTP security (basic, bearer)
            if (scheme.type === 'http') {
                if (scheme.scheme?.toLowerCase() === 'bearer') {
                    return !!process.env[`BEARER_TOKEN_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`];
                }
                else if (scheme.scheme?.toLowerCase() === 'basic') {
                    return !!process.env[`BASIC_USERNAME_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`] && 
                           !!process.env[`BASIC_PASSWORD_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`];
                }
            }
            
            // OAuth2 security
            if (scheme.type === 'oauth2') {
                // Check for pre-existing token
                if (process.env[`OAUTH_TOKEN_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`]) {
                    return true;
                }
                
                // Check for client credentials for auto-acquisition
                if (process.env[`OAUTH_CLIENT_ID_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`] &&
                    process.env[`OAUTH_CLIENT_SECRET_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`]) {
                    // Verify we have a supported flow
                    if (scheme.flows?.clientCredentials || scheme.flows?.password) {
                        return true;
                    }
                }
                
                return false;
            }
            
            // OpenID Connect
            if (scheme.type === 'openIdConnect') {
                return !!process.env[`OPENID_TOKEN_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`];
            }
            
            return false;
        });
    });

    // If we found matching security scheme(s), apply them
    if (appliedSecurity) {
        // Apply each security scheme from this requirement (combined with AND)
        for (const [schemeName, scopesArray] of Object.entries(appliedSecurity)) {
            const scheme = allSecuritySchemes[schemeName];
            
            // API Key security
            if (scheme?.type === 'apiKey') {
                const apiKey = process.env[`API_KEY_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`];
                if (apiKey) {
                    if (scheme.in === 'header') {
                        headers[scheme.name.toLowerCase()] = apiKey;
                        console.error(`Applied API key '${schemeName}' in header '${scheme.name}'`);
                    }
                    else if (scheme.in === 'query') {
                        queryParams[scheme.name] = apiKey;
                        console.error(`Applied API key '${schemeName}' in query parameter '${scheme.name}'`);
                    }
                    else if (scheme.in === 'cookie') {
                        // Add the cookie, preserving other cookies if they exist
                        headers['cookie'] = `${scheme.name}=${apiKey}${headers['cookie'] ? `; ${headers['cookie']}` : ''}`;
                        console.error(`Applied API key '${schemeName}' in cookie '${scheme.name}'`);
                    }
                }
            } 
            // HTTP security (Bearer or Basic)
            else if (scheme?.type === 'http') {
                if (scheme.scheme?.toLowerCase() === 'bearer') {
                    const token = process.env[`BEARER_TOKEN_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`];
                    if (token) {
                        headers['authorization'] = `Bearer ${token}`;
                        console.error(`Applied Bearer token for '${schemeName}'`);
                    }
                } 
                else if (scheme.scheme?.toLowerCase() === 'basic') {
                    const username = process.env[`BASIC_USERNAME_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`];
                    const password = process.env[`BASIC_PASSWORD_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`];
                    if (username && password) {
                        headers['authorization'] = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
                        console.error(`Applied Basic authentication for '${schemeName}'`);
                    }
                }
            }
            // OAuth2 security
            else if (scheme?.type === 'oauth2') {
                // First try to use a pre-provided token
                let token = process.env[`OAUTH_TOKEN_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`];
                
                // If no token but we have client credentials, try to acquire a token
                if (!token && (scheme.flows?.clientCredentials || scheme.flows?.password)) {
                    console.error(`Attempting to acquire OAuth token for '${schemeName}'`);
                    token = (await acquireOAuth2Token(schemeName, scheme)) ?? '';
                }
                
                // Apply token if available
                if (token) {
                    headers['authorization'] = `Bearer ${token}`;
                    console.error(`Applied OAuth2 token for '${schemeName}'`);
                    
                    // List the scopes that were requested, if any
                    const scopes = scopesArray as string[];
                    if (scopes && scopes.length > 0) {
                        console.error(`Requested scopes: ${scopes.join(', ')}`);
                    }
                }
            }
            // OpenID Connect
            else if (scheme?.type === 'openIdConnect') {
                const token = process.env[`OPENID_TOKEN_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`];
                if (token) {
                    headers['authorization'] = `Bearer ${token}`;
                    console.error(`Applied OpenID Connect token for '${schemeName}'`);
                    
                    // List the scopes that were requested, if any
                    const scopes = scopesArray as string[];
                    if (scopes && scopes.length > 0) {
                        console.error(`Requested scopes: ${scopes.join(', ')}`);
                    }
                }
            }
        }
    } 
    // Log warning if security is required but not available
    else if (definition.securityRequirements?.length > 0) {
        // First generate a more readable representation of the security requirements
        const securityRequirementsString = definition.securityRequirements
            .map(req => {
                const parts = Object.entries(req)
                    .map(([name, scopesArray]) => {
                        const scopes = scopesArray as string[];
                        if (scopes.length === 0) return name;
                        return `${name} (scopes: ${scopes.join(', ')})`;
                    })
                    .join(' AND ');
                return `[${parts}]`;
            })
            .join(' OR ');
            
        console.warn(`Tool '${toolName}' requires security: ${securityRequirementsString}, but no suitable credentials found.`);
    }
    

    // Prepare the axios request configuration
    const config: AxiosRequestConfig = {
      method: definition.method.toUpperCase(), 
      url: requestUrl, 
      params: queryParams, 
      headers: headers,
      ...(requestBodyData !== undefined && { data: requestBodyData }),
    };

    // Log request info to stderr (doesn't affect MCP output)
    console.error(`Executing tool "${toolName}": ${config.method} ${config.url}`);
    
    // Execute the request
    const response = await axios(config);

    // Process and format the response
    let responseText = '';
    const contentType = response.headers['content-type']?.toLowerCase() || '';
    
    // Handle JSON responses
    if (contentType.includes('application/json') && typeof response.data === 'object' && response.data !== null) {
         try { 
             responseText = JSON.stringify(response.data, null, 2); 
         } catch (e) { 
             responseText = "[Stringify Error]"; 
         }
    } 
    // Handle string responses
    else if (typeof response.data === 'string') { 
         responseText = response.data; 
    }
    // Handle other response types
    else if (response.data !== undefined && response.data !== null) { 
         responseText = String(response.data); 
    }
    // Handle empty responses
    else { 
         responseText = `(Status: ${response.status} - No body content)`; 
    }
    
    // Return formatted response
    return { 
        content: [ 
            { 
                type: "text", 
                text: `API Response (Status: ${response.status}):\n${responseText}` 
            } 
        ], 
    };

  } catch (error: unknown) {
    // Handle errors during execution
    let errorMessage: string;
    
    // Format Axios errors specially
    if (axios.isAxiosError(error)) { 
        errorMessage = formatApiError(error); 
    }
    // Handle standard errors
    else if (error instanceof Error) { 
        errorMessage = error.message; 
    }
    // Handle unexpected error types
    else { 
        errorMessage = 'Unexpected error: ' + String(error); 
    }
    
    // Log error to stderr
    console.error(`Error during execution of tool '${toolName}':`, errorMessage);
    
    // Return error message to client
    return { content: [{ type: "text", text: errorMessage }] };
  }
}


/**
 * Main function to start the server
 */
async function main() {
// Set up stdio transport
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error(`${SERVER_NAME} MCP Server (v${SERVER_VERSION}) running on stdio${API_BASE_URL ? `, proxying API at ${API_BASE_URL}` : ''}`);
  } catch (error) {
    console.error("Error during server startup:", error);
    process.exit(1);
  }
}

/**
 * Cleanup function for graceful shutdown
 */
async function cleanup() {
    console.error("Shutting down MCP server...");
    process.exit(0);
}

// Register signal handlers
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

// Start the server
main().catch((error) => {
  console.error("Fatal error in main execution:", error);
  process.exit(1);
});

/**
 * Formats API errors for better readability
 * 
 * @param error Axios error
 * @returns Formatted error message
 */
function formatApiError(error: AxiosError): string {
    let message = 'API request failed.';
    if (error.response) {
        message = `API Error: Status ${error.response.status} (${error.response.statusText || 'Status text not available'}). `;
        const responseData = error.response.data;
        const MAX_LEN = 200;
        if (typeof responseData === 'string') { 
            message += `Response: ${responseData.substring(0, MAX_LEN)}${responseData.length > MAX_LEN ? '...' : ''}`; 
        }
        else if (responseData) { 
            try { 
                const jsonString = JSON.stringify(responseData); 
                message += `Response: ${jsonString.substring(0, MAX_LEN)}${jsonString.length > MAX_LEN ? '...' : ''}`; 
            } catch { 
                message += 'Response: [Could not serialize data]'; 
            } 
        }
        else { 
            message += 'No response body received.'; 
        }
    } else if (error.request) {
        message = 'API Network Error: No response received from server.';
        if (error.code) message += ` (Code: ${error.code})`;
    } else { 
        message += `API Request Setup Error: ${error.message}`; 
    }
    return message;
}

/**
 * Converts a JSON Schema to a Zod schema for runtime validation
 * 
 * @param jsonSchema JSON Schema
 * @param toolName Tool name for error reporting
 * @returns Zod schema
 */
function getZodSchemaFromJsonSchema(jsonSchema: any, toolName: string): z.ZodTypeAny {
    if (typeof jsonSchema !== 'object' || jsonSchema === null) { 
        return z.object({}).passthrough(); 
    }
    try {
        const zodSchemaString = jsonSchemaToZod(jsonSchema);
        const zodSchema = eval(zodSchemaString);
        if (typeof zodSchema?.parse !== 'function') { 
            throw new Error('Eval did not produce a valid Zod schema.'); 
        }
        return zodSchema as z.ZodTypeAny;
    } catch (err: any) {
        console.error(`Failed to generate/evaluate Zod schema for '${toolName}':`, err);
        return z.object({}).passthrough();
    }
}
