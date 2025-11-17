# Overrides Directory

This directory contains custom modifications that override generated code in `src/`.

## Purpose

When you regenerate the MCP server from the OpenAPI specification, all files in `src/` are regenerated. Any customizations placed in this `overrides/` directory will be automatically applied after generation, preserving your changes.

## Two Override Methods

### 1. File Replacement (Simple)

Mirror the structure of `src/` in this directory. For example:

```
overrides/
├── endpoints/
│   └── workflows.js      # Overrides src/endpoints/workflows.js
├── utils/
│   └── auth.js          # Overrides src/utils/auth.js
└── index.js             # Overrides src/index.js
```

### 2. JSON Patch Files (Advanced)

For more precise modifications, use JSON patch files (files ending in `.patch.json`):

```json
{
  "src/index.ts": {
    "content": "// Your code to append",
    "action": "append"
  }
}
```

Supported actions:

- `"append"` - Add content to the end of the file
- `"prepend"` - Add content to the beginning of the file
- `"replace"` - Replace specific text (requires `"oldString"` field)

## Usage

1. **Identify the file to customize** in `src/`
2. **Create the same path** in `overrides/` (for file replacement)
   **OR create a `.patch.json` file** (for patches)
3. **Add your customizations**
4. **Regenerate**: Run `npm run generate`
5. **Overrides are applied automatically**

## Best Practices

### ✅ Good Use Cases

- Adding custom authentication logic
- Implementing rate limiting
- Adding logging or monitoring
- Custom error handling
- Business logic specific to your use case
- Schema fixes and validation improvements

### ❌ Avoid

- Overriding core MCP protocol handling (may break compatibility)
- Making changes that could be in the OpenAPI spec
- Large-scale rewrites (consider forking instead)

## Examples

### Example 1: File Replacement - Custom Error Handler

Create `overrides/utils/error-handler.js`:

```javascript
/**
 * Custom error handler with enhanced logging
 */
export function handleError(error, context) {
  // Custom logging
  console.error("[WINDMILL-MCP]", {
    error: error.message,
    context,
    timestamp: new Date().toISOString(),
  });

  // Send to monitoring service
  // sendToMonitoring(error, context);

  return {
    error: error.message,
    code: error.code || "UNKNOWN_ERROR",
  };
}
```

### Example 2: JSON Patch - Schema Fix

Create `overrides/schema-fixes.patch.json`:

```json
{
  "src/index.ts": {
    "content": "// Fix for inputSchema validation issues\nconst fixToolSchema = (tool) => {\n  if (tool.inputSchema && typeof tool.inputSchema.type !== 'string') {\n    tool.inputSchema = { type: 'object', properties: {} };\n  }\n  return tool;\n};\n\nfor (const [name, tool] of toolDefinitionMap.entries()) {\n  toolDefinitionMap.set(name, fixToolSchema(tool));\n}",
    "action": "append"
  }
}
```

### Example 3: JSON Patch - Replace Content

```json
{
  "src/utils/auth.js": {
    "content": "export function authenticate(token) {\n  return { user: 'admin', token };\n}",
    "oldString": "export function authenticate(token) {\n  // Old implementation\n  return null;\n}",
    "action": "replace"
  }
}
```

### Example 4: Enhanced Authentication

Create `overrides/utils/auth.js` (file replacement):

```javascript
import { originalAuth } from "../../src/utils/auth.js";

/**
 * Enhanced auth with token caching
 */
const tokenCache = new Map();

export async function authenticate(token) {
  // Check cache first
  if (tokenCache.has(token)) {
    return tokenCache.get(token);
  }

  // Call original auth
  const result = await originalAuth(token);

  // Cache for 5 minutes
  tokenCache.set(token, result);
  setTimeout(() => tokenCache.delete(token), 5 * 60 * 1000);

  return result;
}
```

### Example 5: Adding Middleware

Create `overrides/middleware/rate-limit.js` (file replacement):

```javascript
/**
 * Simple rate limiting middleware
 */
const requests = new Map();

export function rateLimit(userId, maxRequests = 100, windowMs = 60000) {
  const now = Date.now();
  const userRequests = requests.get(userId) || [];

  // Clean old requests
  const recentRequests = userRequests.filter((time) => now - time < windowMs);

  if (recentRequests.length >= maxRequests) {
    throw new Error("Rate limit exceeded");
  }

  recentRequests.push(now);
  requests.set(userId, recentRequests);
}
```

## Testing Overrides

Before applying overrides in production:

1. **Validate syntax**:

```bash
npm run validate-overrides
```

2. **Test locally**:

```bash
npm run generate
npm test
```

3. **Review changes**:

```bash
git diff src/
```

## Troubleshooting

### Override not applied

- Check file path matches exactly
- Ensure override file has no syntax errors
- Run `npm run validate-overrides`

### Patch not applied

- Ensure filename ends with `.patch.json`
- Check that target file exists in `src/`
- Verify JSON syntax and action type

### Conflicts after regeneration

- Review backup files in `generator/temp/backup/`
- Manually merge if needed
- Update override to match new structure

### Import errors

- Update import paths if generated structure changed
- Check that imported modules still exist
- Test with `npm test`

## Maintenance

- Review overrides after each OpenAPI spec update
- Remove obsolete overrides
- Document why each override exists
- Consider contributing back to generator if widely useful

## Getting Help

- Check examples in this README
- Review PROJECT_PLAN.md for override strategy
- Ask in GitHub Discussions
- See CONTRIBUTING.md for contribution process
