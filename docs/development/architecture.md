# Architecture Overview

High-level architecture of the Windmill MCP Server project.

## System Components

```
┌─────────────────────────────────────────────────────────────┐
│                    MCP Clients                              │
│         (Claude Desktop, OpenCode, etc.)                    │
└───────────────────┬─────────────────────────────────────────┘
                    │ MCP Protocol
                    ▼
        ┌───────────────────────┐
        │   Runtime Loader      │
        │ (src/runtime/index.js)│
        └───────────┬───────────┘
                    │
        ┌───────────▼────────────┐
        │  Version Detection     │
        │  & Management          │
        └───────────┬────────────┘
                    │
        ┌───────────▼────────────┐
        │  Generated MCP Server  │
        │  (build/dist/index.js) │
        └───────────┬────────────┘
                    │ HTTP/REST
                    ▼
        ┌───────────────────────┐
        │  Windmill API         │
        │  (Your Instance)      │
        └───────────────────────┘
```

## Core Components

### 1. MCP Clients

**Purpose**: Interact with users and invoke MCP tools

**Examples**:
- Claude Desktop
- OpenCode
- Custom MCP clients

**Communication**: MCP Protocol (JSON-RPC over stdio)

### 2. Runtime Loader

**Location**: `src/runtime/index.js`

**Responsibilities**:
- Detect Windmill version from instance
- Download appropriate server version from GitHub releases
- Cache downloaded versions locally
- Load and execute the MCP server

**Version Resolution**:
```
1. Check WINDMILL_VERSION environment variable
2. If not set, query Windmill instance for version
3. Check cache for matching version
4. If not cached, download from GitHub releases
5. Load and execute the server
```

**Benefits**:
- Automatic version matching
- Offline operation with cache
- Seamless updates
- Fallback to local build

### 3. Generated MCP Server

**Location**: `build/dist/index.js`

**Responsibilities**:
- Expose Windmill API as MCP tools
- Handle parameter validation
- Construct API requests
- Return formatted responses

**Generated From**:
- Windmill OpenAPI specification
- openapi-mcp-generator tool
- Custom overrides
- Tool namespace organization

**Tools Structure**:
```typescript
{
  name: "category:operation",
  description: "Operation description",
  inputSchema: {/* JSON Schema */},
  handler: async (params) => {/* API call */}
}
```

### 4. Windmill API

**Endpoint**: Configured via `WINDMILL_BASE_URL`

**Authentication**: Token-based via `WINDMILL_API_TOKEN`

**API Coverage**:
- 500+ operations
- 59 categories
- Complete OpenAPI specification

## Generation Pipeline

```
┌────────────────────────────────────────────────────────────┐
│                  Generation Process                        │
└────────────────────────────────────────────────────────────┘

1. Fetch OpenAPI Spec
   ├── Download from Windmill
   ├── Extract version
   └── Cache locally

2. Generate MCP Server
   ├── Parse OpenAPI spec
   ├── Generate TypeScript code
   └── Create tool definitions

3. Add Tool Namespaces
   ├── Group by API tags
   ├── Add category prefixes
   └── Organize 500+ tools into 59 categories

4. Apply Overrides
   ├── Scan override directory
   ├── Match file structure
   └── Replace generated files

5. Build
   ├── Install dependencies
   ├── Compile TypeScript
   └── Output JavaScript

6. Generate Documentation
   ├── Extract tool definitions
   ├── Group by category
   └── Create markdown reference
```

## Data Flow

### Tool Invocation

```
User Request
    │
    ▼
MCP Client
    │ (MCP Protocol)
    ▼
Runtime Loader
    │ (Load correct version)
    ▼
MCP Server
    │ (Parse & validate)
    ▼
Tool Handler
    │ (Construct request)
    ▼
Windmill API
    │ (Execute operation)
    ▼
Response
    │ (Format result)
    ▼
MCP Client
    │
    ▼
User
```

### Version Management

```
Startup
    │
    ▼
Check WINDMILL_VERSION env var
    │
    ├─ Set? ──────────────┐
    │                     │
    ▼                     ▼
Query Windmill       Use specified
instance version     version
    │                     │
    └──────┬──────────────┘
           ▼
    Check local cache
           │
    ├─ Cached? ───────────┐
    │                     │
    ▼                     ▼
Download from        Load from
GitHub releases      cache
    │                     │
    └──────┬──────────────┘
           ▼
    Execute MCP server
```

## Directory Structure

```
windmill-mcp/
│
├── src/                        # Source code
│   ├── generator/              # Generation system
│   │   ├── generate.js        # Main orchestrator
│   │   ├── fetch-spec.js      # OpenAPI fetching
│   │   ├── generate-tool-list.js
│   │   └── config.json        # Generator configuration
│   │
│   ├── overrides/              # Custom modifications
│   │   ├── apply-overrides.js # Override application
│   │   ├── add-tool-namespaces.js
│   │   ├── validate-overrides.js
│   │   └── src/               # Override files
│   │
│   └── runtime/                # Runtime system
│       └── index.js           # Version management & loading
│
├── build/                      # Generated code (gitignored)
│   ├── src/                   # TypeScript source
│   ├── dist/                  # Compiled JavaScript
│   ├── package.json           # Generated package file
│   └── tsconfig.json          # Generated TypeScript config
│
├── cache/                      # Cached files (gitignored)
│   └── openapi-spec-*.json    # Cached OpenAPI specs
│
├── tests/                      # Test suite
│   ├── unit/                  # Unit tests
│   ├── e2e/                   # End-to-end tests
│   ├── docker/                # Docker setup for E2E
│   └── utils/                 # Test utilities
│
├── docs/                       # Documentation
│   ├── guides/                # User guides
│   ├── development/           # Developer docs
│   ├── reference/             # Technical references
│   └── planning/              # Project planning
│
└── scripts/                    # Utility scripts
```

## Key Technologies

### Runtime
- **Node.js 18+**: Runtime environment
- **MCP Protocol**: Communication with clients
- **JSON-RPC**: Protocol transport

### Generation
- **openapi-mcp-generator**: Core generation tool
- **OpenAPI 3.x**: API specification format
- **TypeScript**: Generated code language

### Testing
- **Vitest**: Test framework
- **Docker Compose**: Local Windmill for E2E
- **Mock utilities**: Unit test helpers

### CI/CD
- **GitHub Actions**: Automation
- **Automated testing**: PR validation
- **Version releases**: Automated builds

## Design Principles

### 1. Automation First

**Goal**: Minimize manual work

**Implementation**:
- Auto-fetch OpenAPI specs
- Auto-generate MCP server
- Auto-detect versions
- Auto-download releases

### 2. Customization Support

**Goal**: Allow modifications without losing automation

**Implementation**:
- Override system for custom code
- Persistent across regenerations
- Validation tools
- Clear structure

### 3. Version Compatibility

**Goal**: Work with multiple Windmill versions

**Implementation**:
- Runtime version detection
- Multiple cached versions
- Specific version support
- Graceful fallbacks

### 4. Developer Experience

**Goal**: Easy to understand and contribute

**Implementation**:
- Clear documentation structure
- Comprehensive guides
- Testing infrastructure
- Validation tools

### 5. Quality Assurance

**Goal**: Reliable and tested

**Implementation**:
- Unit tests for logic
- E2E tests with real Windmill
- CI/CD validation
- Automated releases

## Extension Points

### Custom Overrides

Add custom functionality by creating override files:

```
src/overrides/src/index.ts
  └─> Replaces build/src/index.ts
```

### Custom Post-Generation

Add steps to package.json:

```json
{
  "postgenerate": "... && npm run your-custom-step"
}
```

### Custom Validation

Add validation scripts:

```json
{
  "validate": "... && npm run your-validation"
}
```

### Custom MCP Clients

Implement custom clients using the MCP protocol:

```javascript
const client = new MCPClient();
client.connect('node src/runtime/index.js');
const result = await client.callTool('job:listJobs', params);
```

## Security Considerations

### API Tokens

- Stored in environment variables
- Never committed to git
- Validated at runtime
- Scoped to necessary permissions

### Generated Code

- Review generated code for vulnerabilities
- Apply security overrides when needed
- Keep generator tool updated

### Network

- HTTPS for production instances
- Token-based authentication
- Rate limiting awareness

### CI/CD

- Secrets in GitHub repository secrets
- No secrets in logs
- Automated security scanning

## Performance Characteristics

### Generation
- **Time**: ~30-60 seconds for full generation
- **Network**: One OpenAPI spec download
- **Disk**: ~5-10 MB for generated code

### Runtime
- **Startup**: ~1-2 seconds (cached version)
- **Memory**: ~50-100 MB typical usage
- **Network**: Per-request to Windmill API

### Version Download
- **Time**: ~5-10 seconds per version
- **Size**: ~5 MB per version
- **Cached**: Subsequent loads instant

## Monitoring & Debugging

### Logs

```bash
# Runtime loader logs
node src/runtime/index.js 2>&1 | tee runtime.log

# MCP server logs (from client)
# Check client-specific log location

# Docker logs for E2E
npm run docker:logs
```

### Debugging

```bash
# Inspect generated code
cat build/src/index.ts

# Check version cache
ls -la cache/

# Test tool manually
node -e "require('./build/dist/index.js')"

# Validate configuration
npm run validate
```

## See Also

- [Generator System](generator.md) - Detailed generation docs
- [Development Setup](setup.md) - Development workflow
- [Testing Guide](testing.md) - Testing strategy
- [Configuration Reference](../reference/configuration.md) - All config options
