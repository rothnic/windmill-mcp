# Configuration Reference

Complete reference for configuring the Windmill MCP Server.

## Environment Variables

### Required Variables

#### `WINDMILL_BASE_URL`
- **Description**: Base URL of your Windmill instance
- **Format**: `https://your-instance.windmill.dev` or `http://localhost:8000`
- **Required**: Yes
- **Example**: `https://app.windmill.dev`

#### `WINDMILL_API_TOKEN`
- **Description**: API token for authentication
- **Format**: String token from Windmill user settings
- **Required**: Yes
- **Security**: Keep confidential, never commit to git
- **Example**: `wm_abc123def456...`

### Optional Variables

#### `WINDMILL_VERSION`
- **Description**: Specific Windmill version to use
- **Format**: Semantic version (e.g., `1.520.1`)
- **Required**: No (auto-detects from instance)
- **Example**: `1.520.1`
- **Use Case**: Force specific version for compatibility

#### `E2E_WINDMILL_URL`
- **Description**: Windmill URL for E2E testing
- **Format**: Same as `WINDMILL_BASE_URL`
- **Required**: Only for E2E tests
- **Example**: `http://localhost:8000`

#### `E2E_WINDMILL_TOKEN`
- **Description**: API token for E2E testing
- **Format**: Same as `WINDMILL_API_TOKEN`
- **Required**: Only for E2E tests
- **Example**: `test-super-secret`

#### `E2E_WORKSPACE`
- **Description**: Workspace for E2E testing
- **Format**: Workspace name
- **Required**: Only for E2E tests
- **Default**: `admins`
- **Example**: `demo`

## MCP Client Configuration

### Claude Desktop

**Location**:
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

**Format**:
```json
{
  "mcpServers": {
    "windmill": {
      "command": "node",
      "args": ["/absolute/path/to/windmill-mcp/src/runtime/index.js"],
      "env": {
        "WINDMILL_BASE_URL": "https://your-instance.windmill.dev",
        "WINDMILL_API_TOKEN": "your-api-token"
      }
    }
  }
}
```

**Options**:
- `command`: Node.js executable (usually `node`)
- `args`: Array with path to runtime loader
- `env`: Environment variables object

**Multiple Instances**:
```json
{
  "mcpServers": {
    "windmill-production": {
      "command": "node",
      "args": ["/path/to/windmill-mcp/src/runtime/index.js"],
      "env": {
        "WINDMILL_BASE_URL": "https://prod.windmill.dev",
        "WINDMILL_API_TOKEN": "prod-token"
      }
    },
    "windmill-staging": {
      "command": "node",
      "args": ["/path/to/windmill-mcp/src/runtime/index.js"],
      "env": {
        "WINDMILL_BASE_URL": "https://staging.windmill.dev",
        "WINDMILL_API_TOKEN": "staging-token"
      }
    }
  }
}
```

### OpenCode

**Location**: `.opencode/opencode.jsonc` in your project

**Format**:
```jsonc
{
  "mcp": {
    "windmill": {
      "type": "local",
      "command": [
        "node",
        "/absolute/path/to/windmill-mcp/src/runtime/index.js"
      ],
      "environment": {
        "WINDMILL_BASE_URL": "https://your-instance.windmill.dev",
        "WINDMILL_API_TOKEN": "your-api-token"
      },
      "enabled": true
    }
  }
}
```

**Options**:
- `type`: Always `"local"` for local execution
- `command`: Array with executable and script path
- `environment`: Environment variables object
- `enabled`: Boolean to enable/disable the server

**Local Development**:
```jsonc
{
  "mcp": {
    "windmill-local": {
      "type": "local",
      "command": [
        "node",
        "/path/to/windmill-mcp/src/runtime/index.js"
      ],
      "environment": {
        "WINDMILL_BASE_URL": "http://localhost:8000",
        "WINDMILL_API_TOKEN": "test-super-secret"
      },
      "enabled": true
    }
  }
}
```

## Generator Configuration

### Location
`src/generator/config.json`

### Schema

```json
{
  "openapiSpecUrl": "https://app.windmill.dev/api/openapi.json",
  "cacheDir": "cache",
  "outputDir": "build",
  "serverName": "windmill-mcp-server",
  "generatorOptions": {
    "includeOptionalParams": true,
    "validateRequiredParams": true
  }
}
```

### Options

#### `openapiSpecUrl`
- **Type**: String (URL)
- **Description**: URL to fetch OpenAPI specification
- **Default**: `https://app.windmill.dev/api/openapi.json`
- **Use Case**: Point to custom Windmill instance

#### `cacheDir`
- **Type**: String (path)
- **Description**: Directory for caching OpenAPI specs
- **Default**: `cache`
- **Use Case**: Change cache location

#### `outputDir`
- **Type**: String (path)
- **Description**: Directory for generated code
- **Default**: `build`
- **Note**: Should be gitignored

#### `serverName`
- **Type**: String
- **Description**: Name for the generated MCP server
- **Default**: `windmill-mcp-server`

#### `generatorOptions`
- **Type**: Object
- **Description**: Options passed to openapi-mcp-generator

##### `generatorOptions.includeOptionalParams`
- **Type**: Boolean
- **Description**: Include optional parameters in tool definitions
- **Default**: `true`

##### `generatorOptions.validateRequiredParams`
- **Type**: Boolean
- **Description**: Validate required parameters at runtime
- **Default**: `true`

## Docker Configuration

### Location
`tests/docker/docker-compose.yml`

### Configuration

```yaml
services:
  windmill_db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: changeme
      POSTGRES_DB: windmill
    ports:
      - "5432:5432"

  windmill_server:
    image: ghcr.io/windmill-labs/windmill:main
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgres://postgres:changeme@windmill_db/windmill
      MODE: standalone
      SUPERADMIN_SECRET: test-super-secret
```

### Options

#### Postgres Options
- `POSTGRES_PASSWORD`: Database password
- `POSTGRES_DB`: Database name

#### Windmill Options
- `DATABASE_URL`: PostgreSQL connection string
- `MODE`: `standalone` for all-in-one or `server` for distributed
- `SUPERADMIN_SECRET`: Superadmin token for development

### Custom Ports

To change ports (if 8000 is in use):

```yaml
windmill_server:
  ports:
    - "8080:8000"  # Map localhost:8080 to container:8000
```

Then update environment:
```bash
export E2E_WINDMILL_URL=http://localhost:8080
```

## Package Configuration

### package.json Scripts

Key scripts for configuration:

```json
{
  "scripts": {
    "generate": "node src/generator/generate.js",
    "fetch-spec": "node src/generator/fetch-spec.js",
    "dev": "node build/dist/index.js",
    "test": "vitest run"
  }
}
```

### Custom Scripts

Add custom scripts for your workflow:

```json
{
  "scripts": {
    "dev:local": "WINDMILL_BASE_URL=http://localhost:8000 WINDMILL_API_TOKEN=test-super-secret npm run dev",
    "generate:version": "WINDMILL_VERSION=$npm_config_version npm run generate",
    "test:prod": "E2E_WINDMILL_URL=$PROD_URL E2E_WINDMILL_TOKEN=$PROD_TOKEN npm run test:e2e"
  }
}
```

Usage:
```bash
npm run dev:local
npm run generate:version --version=1.520.1
npm run test:prod
```

## Git Configuration

### .gitignore

Important directories to ignore:

```gitignore
# Generated code
build/

# Cached specs
cache/

# Dependencies
node_modules/

# Environment files
.env
.env.local

# IDE files
.vscode/
.idea/

# MCP client configs with secrets
opencode.jsonc
```

### .npmignore

For npm publishing:

```npmignore
# Test files
tests/
*.test.js

# Development files
.github/
docs/
examples/

# Generated files (include src/ for package)
cache/

# Development configs
.env*
tsconfig.json
vitest.config.js
```

## Best Practices

### Security

1. **Never commit secrets**:
   - Use `.env` files (gitignored)
   - Use environment variables
   - Use secrets management for production

2. **Rotate tokens regularly**:
   - Generate new API tokens periodically
   - Revoke old tokens

3. **Use minimal permissions**:
   - Create API tokens with only necessary permissions
   - Use workspace-specific tokens when possible

### Development

1. **Use .env files**:
   ```bash
   # .env
   WINDMILL_BASE_URL=http://localhost:8000
   WINDMILL_API_TOKEN=test-super-secret
   ```

2. **Separate configurations**:
   - `.env.development` - Local development
   - `.env.test` - Testing
   - `.env.production` - Production (not committed)

3. **Version control**:
   - Commit `.env.example` with placeholder values
   - Never commit actual `.env` files

### Production

1. **Use environment variables**:
   - Set via hosting platform (Heroku, AWS, etc.)
   - Use secrets management (AWS Secrets Manager, etc.)

2. **Use specific versions**:
   ```bash
   WINDMILL_VERSION=1.520.1
   ```

3. **Monitor and log**:
   - Log configuration on startup (without secrets)
   - Monitor for configuration errors

## Troubleshooting

### Configuration Not Loading

1. Check environment variables are set:
   ```bash
   echo $WINDMILL_BASE_URL
   echo $WINDMILL_API_TOKEN
   ```

2. Check MCP client configuration syntax (valid JSON/JSONC)

3. Restart MCP client after config changes

### Authentication Errors

1. Verify token is correct: Test in Windmill UI
2. Check token hasn't expired
3. Ensure base URL is correct (including https://)

### Path Issues

1. Use absolute paths in MCP client configs
2. Check file exists: `ls -la /path/to/src/runtime/index.js`
3. Verify Node.js can access the path

## See Also

- [Installation Guide](../guides/installation.md)
- [Troubleshooting Guide](../guides/troubleshooting.md)
- [Development Setup](../development/setup.md)
