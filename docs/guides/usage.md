# Usage Guide

Learn how to use the Windmill MCP Server with your MCP clients.

## Basic Usage

Once configured, the Windmill MCP Server provides access to all Windmill API operations through your MCP client (Claude Desktop, OpenCode, etc.).

## Available Tools

The server provides 500+ tools organized into 59 categories, covering all Windmill API operations:

- **Scripts**: Create, update, and run scripts
- **Workflows**: Manage and execute workflows
- **Resources**: Handle resource variables
- **Schedules**: Set up and manage schedules
- **Jobs**: Monitor and control job execution
- **Apps**: Create and manage applications
- **Users**: User and workspace management
- **And more...**

For a complete list, see the [API Tools Reference](../reference/generated-tools.md).

## Common Operations

### Running Scripts

To run a script through the MCP server:

```
Ask your AI assistant to run a Windmill script at path "f/examples/hello_world"
```

The assistant will use the `runScriptByPath` tool with appropriate parameters.

### Creating Resources

To create a new resource variable:

```
Create a new PostgreSQL resource in workspace "demo" with connection details
```

### Listing Jobs

To view recent jobs:

```
Show me the last 10 jobs in workspace "demo"
```

## Working with Workspaces

Most operations require a workspace parameter. Your Windmill instance may have multiple workspaces:
- `admins` - Administrative workspace
- `demo` - Demo/testing workspace
- Custom workspaces based on your setup

Specify the workspace in your requests to the AI assistant.

## Environment Variables

The server uses these environment variables:

- `WINDMILL_BASE_URL` - Your Windmill instance URL (required)
- `WINDMILL_API_TOKEN` - Your API token (required)
- `WINDMILL_VERSION` - Specific Windmill version (optional, defaults to latest)

These are configured in your MCP client's configuration file.

## Version Management

The runtime loader automatically selects the appropriate server version:

1. If `WINDMILL_VERSION` is set, uses that specific version
2. Otherwise, detects the version from your Windmill instance
3. Downloads the matching server version from GitHub releases
4. Caches downloaded versions for offline use

This ensures compatibility between the MCP server and your Windmill version.

## Tips and Best Practices

### Be Specific with Paths

When referencing scripts or workflows, use complete paths:
- ✅ `f/examples/hello_world`
- ❌ `hello_world`

### Provide Context

Help the AI assistant by providing context:
- Workspace name
- Parameter values
- Expected outcomes

### Check Job Status

For long-running operations:
1. Run the script/workflow
2. Note the job ID returned
3. Check job status using the job ID

### Use JSON Schema

When creating scripts via the API, always provide JSON Schema for parameters. Unlike the Windmill UI, the API requires explicit schemas.

See the [JSON Schema Guide](../reference/json-schema-manual-guide.md) for details.

## Automated Workflows

The MCP server excels at automating complex workflows through natural language. Examples:

### Deployment Pipeline

```
1. Create a script at f/deploy/backend that pulls from git and deploys
2. Create a schedule to run it daily at 2 AM
3. Set up a webhook to trigger it on push
```

### Data Processing

```
1. List all jobs that ran yesterday with status "failed"
2. For each failed job, check the error logs
3. Create a summary report
```

### Resource Management

```
1. List all PostgreSQL resources in workspace "demo"
2. Test each connection
3. Report which ones are unreachable
```

## Error Handling

If an operation fails:
1. Check the error message returned by the tool
2. Verify credentials and permissions
3. Ensure the resource/script exists
4. Check workspace name is correct

Common errors:
- `401 Unauthorized` - Invalid or expired API token
- `404 Not Found` - Resource doesn't exist at specified path
- `403 Forbidden` - Insufficient permissions

## Next Steps

- [Installation Guide](installation.md) - Setup instructions
- [Configuration Reference](../reference/configuration.md) - Detailed configuration
- [API Tools Reference](../reference/generated-tools.md) - Complete tool list
- [Troubleshooting](troubleshooting.md) - Common issues

## See Also

- [Windmill Documentation](https://docs.windmill.dev) - Official Windmill docs
- [MCP Protocol](https://modelcontextprotocol.io) - MCP specification
