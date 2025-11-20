# Testing Setup Guide

This guide clarifies the test configuration and setup for the Windmill MCP Server project.

## Overview

There are **two different ways** to use the Windmill MCP server:

1. **OpenCode Agents** - Using the MCP server through OpenCode's agent system
2. **Direct E2E Tests** - Testing the MCP server programmatically with test scripts

Each has slightly different configuration requirements.

---

## Configuration Files

### 1. `.opencode/opencode.jsonc` (OpenCode Agents)

**Purpose**: Configures how OpenCode agents access the Windmill MCP server

**Location**: `/Users/nroth/workspace/windmill-mcp/.opencode/opencode.jsonc`

**Current Configuration**:

```json
{
  "mcp": {
    "windmill-dev": {
      "type": "local",
      "command": ["node", "./build/dist/index.js"],
      "environment": {
        "WINDMILL_BASE_URL": "http://localhost:8000",
        "WINDMILL_API_TOKEN": "test-super-secret"
      },
      "enabled": true
    }
  },
  "agent": {
    "build": { "tools": { "windmill-dev_*": false } },
    "general": { "tools": { "windmill-dev_*": false } },
    "plan": { "tools": { "windmill-dev_*": false } }
  }
}
```

**Key Points**:

- Server name is `windmill-dev`
- Tools are prefixed with `windmill-dev_` when accessed by agents
- Example: `workspace_list_listWorkspaces` becomes `windmill-dev_workspace_list_listWorkspaces`
- Command points to **compiled JavaScript**: `./build/dist/index.js` (NOT TypeScript!)
- Uses Docker dev server credentials by default

### 2. `tests/setup.js` (E2E Test Defaults)

**Purpose**: Sets default environment variables for E2E tests

**Default Values**:

```javascript
process.env.WINDMILL_BASE_URL = "http://localhost:8000";
process.env.WINDMILL_API_TOKEN = "test-super-secret"; // Docker superadmin secret
process.env.E2E_WORKSPACE = "admins"; // Default workspace
```

### 3. `tests/config.json` (Test Configuration)

**Purpose**: Test suite configuration

**Current Values**:

```json
{
  "windmill": {
    "baseUrl": "http://localhost:8000",
    "workspace": "admins",
    "timeout": 30000,
    "superadminSecret": "test-super-secret"
  }
}
```

---

## Tool Name Resolution

### How Tool Names Work

1. **In Generated Code** (`build/src/index.ts`):

   ```typescript
   name: "workspace_list_listWorkspaces";
   ```

2. **When Used by OpenCode Agents**:

   ```
   windmill-dev_workspace_list_listWorkspaces
   ```

   The `windmill-dev_` prefix comes from the MCP server name in `opencode.jsonc`

3. **When Used in E2E Tests**:
   ```javascript
   name: "listWorkspaces"; // Original OpenAPI operationId
   ```
   Tests can use either the namespaced version or map back to the original

### Agent Tool Access Patterns

In `.opencode/agent/*.md` files, agents are configured with glob patterns:

```yaml
tools:
  "*": false
  "windmill-dev_workspace_*": true
```

This grants access to all workspace-related tools from the `windmill-dev` MCP server:

- `windmill-dev_workspace_list_listWorkspaces`
- `windmill-dev_workspace_manage_createWorkspace`
- etc.

---

## Setup for Different Use Cases

### 1. OpenCode Agents (Development)

**Goal**: Enable OpenCode agents to interact with local Windmill instance

**Steps**:

```bash
# 1. Start Windmill
npm run docker:dev

# 2. Generate and build MCP server
npm run generate

# 3. Verify build completed
ls -lh build/dist/index.js

# 4. Restart OpenCode to pick up config changes
# (or reload window if using VS Code extension)
```

**Configuration Check**:

- `.opencode/opencode.jsonc` should have `windmill-dev` server
- Command should be `["node", "./build/dist/index.js"]`
- Environment should have Windmill URL and token
- `enabled: true`

**Troubleshooting**:
If agents report tools not found:

1. Check `build/dist/index.js` exists
2. Verify `.opencode/opencode.jsonc` has correct path
3. Restart OpenCode to reload configuration
4. Check Windmill is running: `curl http://localhost:8000/api/version`

### 2. E2E Tests (Automated Testing)

**Goal**: Run automated tests against MCP server

**Steps**:

```bash
# Full E2E test cycle (automated)
npm run test:e2e:full

# Or manual steps:
npm run docker:dev              # Start Windmill
npm run generate                # Generate MCP server
npm run test:e2e                # Run E2E tests
```

**Environment Variables**:

```bash
# Optional - defaults are set in tests/setup.js
export E2E_WINDMILL_URL=http://localhost:8000
export E2E_WINDMILL_TOKEN=test-super-secret
export E2E_WORKSPACE=admins
```

**Test Files**:

- `tests/e2e/windmill-api.test.js` - Direct Windmill API tests
- `tests/e2e/mcp-integration.test.js` - MCP server integration tests

### 3. Production Testing

**Goal**: Test against a real Windmill instance

**Steps**:

```bash
# 1. Create user token in Windmill UI
# Settings → Tokens → Create Token

# 2. Set environment variables
export E2E_WINDMILL_URL=https://your-instance.windmill.dev
export E2E_WINDMILL_TOKEN=your-user-token
export E2E_WORKSPACE=your-workspace

# 3. Update .opencode/opencode.jsonc
{
  "mcp": {
    "windmill-dev": {
      "environment": {
        "WINDMILL_BASE_URL": "https://your-instance.windmill.dev",
        "WINDMILL_API_TOKEN": "your-user-token"
      }
    }
  }
}

# 4. Run tests
npm run test:e2e
```

---

## Common Issues and Solutions

### Issue 1: "Tools not found" in OpenCode

**Symptom**: Agents report `windmill-dev_workspace_list_listWorkspaces` not found

**Causes**:

1. MCP server not generated/built
2. Wrong path in `.opencode/opencode.jsonc`
3. OpenCode hasn't reloaded configuration
4. Windmill not running

**Solutions**:

```bash
# Verify build exists
ls -lh build/dist/index.js

# Rebuild if needed
npm run generate

# Check OpenCode config has correct path
cat .opencode/opencode.jsonc | grep command

# Restart OpenCode
```

### Issue 2: E2E Tests Fail with 401 Unauthorized

**Symptom**: Tests fail with authentication errors

**Causes**:

1. Wrong API token
2. Token expired
3. Windmill not running

**Solutions**:

```bash
# Check Windmill is running
curl http://localhost:8000/api/version

# Verify token works
curl -H "Authorization: Bearer test-super-secret" \
  http://localhost:8000/api/version

# Check environment variables
echo $E2E_WINDMILL_TOKEN
```

### Issue 3: TypeScript Build Failed

**Symptom**: `build/dist/index.js` doesn't exist

**Solution**:

```bash
# Rebuild
cd build
npm install
npm run build

# Or regenerate everything
cd ..
npm run generate
```

### Issue 4: Wrong Server Path in Tests

**Symptom**: E2E tests fail to start MCP server

**Location**: `tests/e2e/mcp-integration.test.js:36`

**Check**:

```javascript
const serverPath = path.join(__dirname, "../../build/dist/index.js");
```

Should point to the compiled JavaScript, not TypeScript source.

---

## File Structure Reference

```
windmill-mcp/
├── .opencode/
│   ├── opencode.jsonc          # OpenCode MCP config
│   └── agent/                   # Agent configurations
│       ├── windmill-manager.md
│       └── *-specialist.md      # tools: "windmill-dev_*": true
├── build/
│   ├── src/
│   │   └── index.ts             # Generated TypeScript (source)
│   └── build/
│       └── index.js             # Compiled JavaScript (executable)
├── tests/
│   ├── setup.js                 # Test defaults
│   ├── config.json              # Test configuration
│   └── e2e/
│       ├── windmill-api.test.js
│       └── mcp-integration.test.js
└── docs/
    └── testing-setup-guide.md   # This file
```

---

## Verification Checklist

Before running tests or using agents, verify:

- [ ] Windmill running: `curl http://localhost:8000/api/version`
- [ ] MCP server built: `ls build/dist/index.js`
- [ ] OpenCode config correct: `.opencode/opencode.jsonc` → `build/dist/index.js`
- [ ] Environment variables set (if needed)
- [ ] OpenCode reloaded (if changed config)

---

## Quick Reference

### Start Everything

```bash
# Terminal 1: Start Windmill
npm run docker:dev

# Terminal 2: Generate MCP server
npm run generate

# Terminal 3: Run tests
npm run test:e2e

# For OpenCode agents: Just restart OpenCode
```

### Stop Everything

```bash
# Stop Windmill
npm run docker:down

# Clean slate (removes all data)
npm run docker:clean
```

### Check Status

```bash
# Windmill
curl http://localhost:8000/api/version

# MCP server build
ls -lh build/dist/index.js

# Test with MCP server directly
node build/dist/index.js
```

---

## Summary

**Key Takeaways**:

1. **OpenCode agents** need `.opencode/opencode.jsonc` configured with correct path to `build/dist/index.js`
2. **Tool names** are prefixed with MCP server name: `windmill-dev_workspace_*`
3. **E2E tests** use environment variables or defaults from `tests/setup.js`
4. **Docker dev setup** provides instant credentials: `test-super-secret` / workspace `admins`
5. **Always rebuild** after changing generation: `npm run generate`

For questions or issues, check the main testing guide: [docs/development/testing.md](./testing.md)
