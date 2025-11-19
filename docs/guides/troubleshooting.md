# Troubleshooting Guide

Solutions to common issues when using the Windmill MCP Server.

## Installation Issues

### Build Fails During Generation

**Symptom**: `npm run generate` fails with build errors

**Solutions**:
1. Clean and retry:
   ```bash
   rm -rf build/ cache/ node_modules/
   npm install
   npm run generate
   ```

2. Check Node.js version:
   ```bash
   node --version  # Should be 18.0.0 or higher
   ```

3. Check internet connectivity (required to fetch OpenAPI spec)

4. Review error messages in console output

### Missing build/dist/index.js

**Symptom**: Configuration file references a path that doesn't exist

**Solution**: Run the complete generation process:
```bash
npm run generate
```

This creates `build/dist/index.js` which is the compiled MCP server.

### Permission Errors

**Symptom**: `EACCES` or permission denied errors

**Solutions**:
1. Check file permissions in the project directory
2. Don't use `sudo` with npm commands
3. Fix npm permissions: [npm docs](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally)

## Connection Issues

### 401 Unauthorized

**Symptom**: Authentication errors when calling tools

**Solutions**:
1. Verify `WINDMILL_API_TOKEN` is correct
2. Check token hasn't expired
3. Regenerate token in Windmill user settings
4. Ensure token has appropriate permissions

### 404 Not Found on Base URL

**Symptom**: Cannot connect to Windmill instance

**Solutions**:
1. Verify `WINDMILL_BASE_URL` is correct
2. Check URL includes `https://` or `http://`
3. Remove trailing slashes from URL
4. Test URL in browser: should reach Windmill login
5. For local instances, ensure Windmill is running: `npm run docker:dev`

### Network Timeout

**Symptom**: Requests time out

**Solutions**:
1. Check network connectivity
2. Verify firewall isn't blocking connections
3. For cloud instances, check if IP is whitelisted
4. Try increasing timeout (if configurable)

## MCP Client Issues

### Tools Not Appearing in Claude Desktop

**Symptom**: Windmill tools don't show up

**Solutions**:
1. Restart Claude Desktop completely
2. Check configuration file syntax is valid JSON
3. Verify path to `src/runtime/index.js` is absolute
4. Check Claude Desktop logs for errors
5. Test server manually:
   ```bash
   WINDMILL_BASE_URL=https://your-instance.windmill.dev \
   WINDMILL_API_TOKEN=your-token \
   node src/runtime/index.js
   ```

### Server Crashes on Startup

**Symptom**: MCP server starts then immediately crashes

**Solutions**:
1. Check environment variables are set correctly
2. Verify Windmill instance is accessible
3. Check Node.js version compatibility
4. Review server logs in MCP client
5. Test connection:
   ```bash
   curl https://your-instance.windmill.dev/api/version
   ```

## Runtime Issues

### Version Mismatch Errors

**Symptom**: Errors about incompatible versions

**Solutions**:
1. Clear version cache:
   ```bash
   rm -rf cache/
   ```
2. Set specific version:
   ```bash
   WINDMILL_VERSION=1.520.1 node src/runtime/index.js
   ```
3. Regenerate for your Windmill version:
   ```bash
   npm run generate
   ```

### Tools Return Unexpected Results

**Symptom**: Operations complete but with wrong data

**Solutions**:
1. Verify you're using the correct workspace
2. Check parameter formats match API expectations
3. Review [API Tools Reference](../reference/generated-tools.md)
4. Test same operation directly in Windmill UI
5. Check Windmill API documentation

## Testing Issues

### E2E Tests Fail

**Symptom**: E2E tests don't pass

**Solutions**:
1. Ensure Windmill is running:
   ```bash
   npm run docker:dev
   ```
2. Wait for Windmill to be ready (30-60 seconds)
3. Check environment variables:
   ```bash
   export E2E_WINDMILL_URL=http://localhost:8000
   export E2E_WINDMILL_TOKEN=test-super-secret
   export E2E_WORKSPACE=admins
   ```
4. Run tests with verbose output:
   ```bash
   npm run test:e2e -- --reporter=verbose
   ```

### Docker Won't Start

**Symptom**: `npm run docker:dev` fails

**Solutions**:
1. Check Docker is installed and running:
   ```bash
   docker --version
   docker ps
   ```
2. Check ports aren't in use:
   ```bash
   lsof -i :8000  # Should be empty
   ```
3. Clean Docker state:
   ```bash
   npm run docker:clean
   ```
4. Check Docker logs:
   ```bash
   npm run docker:logs
   ```

## Development Issues

### TypeScript Errors in Generated Code

**Symptom**: TypeScript compilation errors in `build/`

**Solutions**:
1. Generated code issues may require overrides
2. Check if OpenAPI spec has changed significantly
3. Report issues to [openapi-mcp-generator](https://github.com/harsha-iiiv/openapi-mcp-generator)
4. Create custom override if needed (see [Development Guide](../development/generator.md))

### Overrides Not Applied

**Symptom**: Custom modifications aren't being used

**Solutions**:
1. Verify override file path matches generated file structure
2. Check override file syntax is valid
3. Run validation:
   ```bash
   npm run validate-overrides
   ```
4. Ensure you run `npm run generate` after creating overrides
5. Review [Override System Documentation](../development/overrides.md)

## Performance Issues

### Slow Tool Execution

**Symptom**: Tools take a long time to respond

**Solutions**:
1. Check network latency to Windmill instance
2. For large workspaces, filter results with query parameters
3. Consider using pagination for list operations
4. Check Windmill server performance/load

### High Memory Usage

**Symptom**: Node process uses excessive memory

**Solutions**:
1. Check for memory leaks in custom code
2. Limit concurrent operations
3. Restart MCP server periodically
4. Increase Node.js memory limit if needed:
   ```json
   {
     "args": ["--max-old-space-size=4096", "/path/to/index.js"]
   }
   ```

## Getting Help

If you're still experiencing issues:

1. **Check Documentation**:
   - [Installation Guide](installation.md)
   - [Usage Guide](usage.md)
   - [Development Guide](../development/setup.md)

2. **Search Issues**: Check [GitHub Issues](https://github.com/rothnic/windmill-mcp/issues) for similar problems

3. **Create Issue**: If you've found a bug, [open an issue](https://github.com/rothnic/windmill-mcp/issues/new) with:
   - Description of the problem
   - Steps to reproduce
   - Environment details (OS, Node version, Windmill version)
   - Error messages and logs

4. **Community Resources**:
   - [Windmill Discord](https://discord.gg/V7PM2YHsPB)
   - [MCP Community](https://modelcontextprotocol.io)

## Diagnostic Commands

Use these commands to gather diagnostic information:

```bash
# System information
node --version
npm --version
docker --version

# Project status
cd /path/to/windmill-mcp
git status
npm list --depth=0

# Check generated code
ls -la build/dist/

# Test Windmill connection
curl https://your-instance.windmill.dev/api/version

# View MCP server output
WINDMILL_BASE_URL=https://your-instance.windmill.dev \
WINDMILL_API_TOKEN=your-token \
node src/runtime/index.js 2>&1 | tee debug.log
```

Include this information when reporting issues.
