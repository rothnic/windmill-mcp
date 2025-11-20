# Generator System Guide

Understanding how the Windmill MCP Server is generated from OpenAPI specifications.

## Overview

The generator system automatically creates an MCP server from Windmill's OpenAPI specification. This enables:
- Automatic updates when Windmill API changes
- Preservation of custom modifications
- Consistent tool naming and organization
- Comprehensive API coverage

## Architecture

```
┌─────────────────┐
│ Windmill OpenAPI│
│  Specification  │
└────────┬────────┘
         │ fetch-spec.js
         ▼
    ┌────────┐
    │ Cache  │
    └───┬────┘
        │ generate.js
        ▼
┌──────────────────┐
│ openapi-mcp-     │
│   generator      │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Generated TS    │
│   build/src/     │
└────────┬─────────┘
         │ add-tool-namespaces.js
         ▼
┌──────────────────┐
│ Namespaced Tools │
└────────┬─────────┘
         │ apply-overrides.js
         ▼
┌──────────────────┐
│ Custom Overrides │
│   Applied        │
└────────┬─────────┘
         │ npm build
         ▼
┌──────────────────┐
│  Compiled JS     │
│ build/dist/      │
└──────────────────┘
```

## Components

### 1. Fetch Spec (`src/generator/fetch-spec.js`)

Fetches the OpenAPI specification from Windmill.

**Usage**:
```bash
npm run fetch-spec
```

**What it does**:
1. Downloads OpenAPI spec from configured URL
2. Validates the spec is valid JSON
3. Saves to `cache/openapi-spec-{version}.json`
4. Extracts Windmill version from spec

**Configuration** (in `src/generator/config.json`):
```json
{
  "openapiSpecUrl": "https://app.windmill.dev/api/openapi.json",
  "cacheDir": "cache"
}
```

**Caching**:
- Specs are cached by version
- Reduces network calls during development
- Can be manually cleared: `rm -rf cache/`

### 2. Generate (`src/generator/generate.js`)

Orchestrates the generation process using openapi-mcp-generator.

**Usage**:
```bash
npm run generate
```

**What it does**:
1. Reads cached OpenAPI spec
2. Configures openapi-mcp-generator
3. Generates TypeScript MCP server in `build/`
4. Triggers post-generation hooks

**Configuration** (in `src/generator/config.json`):
```json
{
  "outputDir": "build",
  "serverName": "windmill-mcp-server",
  "generatorOptions": {
    "includeOptionalParams": true,
    "validateRequiredParams": true
  }
}
```

**Generator Options**:
- `includeOptionalParams`: Include optional parameters in tool definitions
- `validateRequiredParams`: Validate required parameters at runtime
- `groupByTag`: Group tools by OpenAPI tags (auto-enabled)

### 3. Add Tool Namespaces (`src/overrides/add-tool-namespaces.js`)

Organizes the 500+ generated tools into logical categories.

**Usage**:
```bash
npm run add-tool-namespaces
```

**What it does**:
1. Parses generated tools
2. Groups by OpenAPI tags (e.g., `job`, `script`, `workflow`)
3. Adds namespace prefixes (e.g., `job:listJobs`)
4. Creates 59 organized categories

**Example Transformation**:
```typescript
// Before
tools.push({
  name: "listJobs",
  description: "list all available jobs"
});

// After
tools.push({
  name: "job:listJobs",
  description: "list all available jobs"
});
```

**Benefits**:
- Easier discovery of related tools
- Prevents name collisions
- Better organization in MCP clients
- Matches Windmill API structure

### 4. Apply Overrides (`src/overrides/apply-overrides.js`)

Applies custom modifications that persist across regenerations.

**Usage**:
```bash
npm run apply-overrides
```

**What it does**:
1. Scans `src/overrides/` for override files
2. Matches override structure to `build/` structure
3. Copies override files, replacing generated versions
4. Preserves custom modifications

**Override Structure**:
```
src/overrides/
└── src/
    └── index.ts      # Overrides build/src/index.ts
```

**Use Cases**:
- Fix bugs in generated code
- Add custom error handling
- Implement missing features
- Optimize performance

**Creating Overrides**:
1. Identify file to override in `build/src/`
2. Create matching path in `src/overrides/`
3. Copy and modify the file
4. Run `npm run generate` to apply

**Validation**:
```bash
npm run validate-overrides
```

Checks:
- Override paths match generated structure
- TypeScript syntax is valid
- No conflicting overrides

### 5. Build (`npm run build:generated`)

Compiles TypeScript to JavaScript.

**What it does**:
1. Changes to `build/` directory
2. Installs dependencies (if needed)
3. Runs TypeScript compiler
4. Outputs to `build/dist/index.js`

**Configuration** (in `build/tsconfig.json`, auto-generated):
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "strict": true
  }
}
```

### 6. Generate Tool List (`src/generator/generate-tool-list.js`)

Creates documentation of all available tools.

**Usage**:
```bash
npm run generate-tool-list
```

**What it does**:
1. Parses generated MCP server
2. Extracts all tool definitions
3. Groups by namespace/category
4. Generates `docs/reference/generated-tools.md`

**Output Format**:
```markdown
## category:name

### `tool:name`

Description of the tool

### `tool:anotherName`

Description of another tool
```

## Complete Generation Workflow

The `npm run generate` command runs all steps in order:

```bash
# 1. Pre-generation hook
npm run fetch-spec

# 2. Main generation
node src/generator/generate.js

# 3. Post-generation hooks
npm run add-tool-namespaces
npm run apply-overrides
npm run build:generated
npm run generate-tool-list
```

**npm script definition**:
```json
{
  "scripts": {
    "pregenerate": "npm run fetch-spec",
    "generate": "node src/generator/generate.js",
    "postgenerate": "npm run add-tool-namespaces && npm run apply-overrides && npm run build:generated && npm run generate-tool-list"
  }
}
```

## Customization

### Changing OpenAPI Source

Edit `src/generator/config.json`:
```json
{
  "openapiSpecUrl": "https://your-windmill.com/api/openapi.json"
}
```

### Modifying Generation Options

Edit `src/generator/config.json`:
```json
{
  "generatorOptions": {
    "includeOptionalParams": false,
    "validateRequiredParams": true,
    "customOption": "value"
  }
}
```

### Adding Post-Generation Steps

Add to `postgenerate` script in `package.json`:
```json
{
  "postgenerate": "npm run add-tool-namespaces && npm run apply-overrides && npm run build:generated && npm run generate-tool-list && npm run your-custom-step"
}
```

## Debugging Generation

### View Generated Code

```bash
# TypeScript source
less build/src/index.ts

# Compiled JavaScript
less build/dist/index.js
```

### Test Generation Steps

```bash
# Test spec fetching
npm run fetch-spec
ls -la cache/

# Test generation only
node src/generator/generate.js
ls -la build/src/

# Test overrides only
npm run apply-overrides
git diff build/src/
```

### Common Issues

**Generation fails**:
1. Check internet connectivity
2. Verify OpenAPI spec URL is accessible
3. Check disk space for cache and build
4. Review error messages in console

**Overrides not applied**:
1. Check override file paths match generated structure
2. Run `npm run validate-overrides`
3. Ensure generation completed successfully
4. Check file permissions

**Build fails**:
1. Check TypeScript syntax in generated code
2. Review compilation errors
3. Try cleaning: `rm -rf build/ && npm run generate`
4. Check Node.js version compatibility

## Version Management

The generator tracks versions at multiple levels:

1. **OpenAPI Spec Version**: Extracted from spec `info.version`
2. **Windmill Version**: From spec or environment
3. **Package Version**: From `package.json`
4. **Generator Version**: From openapi-mcp-generator

Versions are embedded in generated code and used by the runtime loader.

## Advanced Topics

### Custom Generators

To use a different generator:

1. Install alternative generator:
   ```bash
   npm install your-generator
   ```

2. Modify `src/generator/generate.js`:
   ```javascript
   const generator = require('your-generator');
   ```

3. Update configuration accordingly

### Multiple Windmill Versions

Generate for multiple versions:

```bash
# Generate for specific version
WINDMILL_VERSION=1.520.1 npm run generate
mv build build-1.520.1

# Generate for another version
WINDMILL_VERSION=1.519.0 npm run generate
mv build build-1.519.0
```

### CI/CD Integration

See `.github/workflows/update-mcp-server.yml` for automated generation in GitHub Actions.

## Next Steps

- [Override System](overrides.md) - Detailed override documentation
- [Testing Generated Code](testing.md) - Test the generated server
- [Architecture](architecture.md) - Overall system architecture

## See Also

- [openapi-mcp-generator](https://github.com/harsha-iiiv/openapi-mcp-generator) - Generator tool
- [Windmill OpenAPI](https://app.windmill.dev/openapi.html) - Windmill API docs
