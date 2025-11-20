# Documentation Index

Complete guide to navigating the Windmill MCP Server documentation.

## Quick Navigation

### New Users Start Here

1. **[Quick Start Guide](guides/quickstart.md)** - Get up and running quickly
2. **[Installation Guide](guides/installation.md)** - Detailed installation steps
3. **[Usage Guide](guides/usage.md)** - How to use the MCP server

### Experiencing Issues?

- **[Troubleshooting Guide](guides/troubleshooting.md)** - Common problems and solutions

### Contributors & Developers

1. **[Development Setup](development/setup.md)** - Set up your dev environment
2. **[Contributing Guidelines](../CONTRIBUTING.md)** - How to contribute
3. **[Testing Guide](development/testing.md)** - Run and write tests

### Technical References

- **[Configuration Reference](reference/configuration.md)** - All configuration options
- **[API Tools Reference](reference/generated-tools.md)** - Complete tool list
- **[JSON Schema Guide](reference/json-schema-manual-guide.md)** - Working with schemas

## Documentation Categories

### 📚 User Guides (`docs/guides/`)

Documentation for end users of the Windmill MCP Server.

| Document | Description | Audience |
|----------|-------------|----------|
| [Quick Start](guides/quickstart.md) | Step-by-step introduction to the project | New users |
| [Installation](guides/installation.md) | Detailed installation and setup instructions | All users |
| [Usage](guides/usage.md) | How to use the MCP server with MCP clients | All users |
| [Troubleshooting](guides/troubleshooting.md) | Common issues and their solutions | All users |

### 🛠️ Developer Documentation (`docs/development/`)

Documentation for contributors and developers working on the project.

| Document | Description | Audience |
|----------|-------------|----------|
| [Development Setup](development/setup.md) | Set up development environment | Contributors |
| [Generator System](development/generator.md) | How code generation works | Contributors |
| [Architecture](development/architecture.md) | System architecture overview | Contributors |
| [Testing Guide](development/testing.md) | Testing strategy and how to test | Contributors |
| [Testing Setup](development/testing-setup-guide.md) | Detailed test setup instructions | Contributors |
| [Architecture Verification](development/architecture-verification.md) | Architecture validation | Maintainers |

### 📖 Technical References (`docs/reference/`)

Technical reference documentation and specifications.

| Document | Description | Type |
|----------|-------------|------|
| [Configuration Reference](reference/configuration.md) | Complete configuration options | Manual |
| [API Tools Reference](reference/generated-tools.md) | All available tools (500+) | Auto-generated |
| [JSON Schema Guide](reference/json-schema-manual-guide.md) | Working with JSON schemas | Manual |
| [Windmill Scripts Guide](reference/windmill-scripts-guide.md) | Script development guide | Manual |

### 📋 Project Planning (`docs/planning/`)

Project planning and management documentation.

| Document | Description | Audience |
|----------|-------------|----------|
| [Project Plan](planning/project-plan.md) | Overall project roadmap | Team |
| [Sprint Planning](planning/sprints.md) | Sprint tracking and planning | Team |
| [Agent Team Plan](planning/windmill-agent-team-plan.md) | AI agent workflows | Team |
| [Agent Setup Complete](planning/agent-setup-complete.md) | Agent configuration status | Team |

## Top-Level Documents

| Document | Description | Location |
|----------|-------------|----------|
| [README](../README.md) | Project overview and quick start | Root |
| [Contributing](../CONTRIBUTING.md) | Contribution guidelines | Root |
| [Changelog](../CHANGELOG.md) | Version history | Root |
| [Project Status](../PROJECT_STATUS.md) | Current project status | Root |
| [Agents](../AGENTS.md) | Agent configurations | Root |
| [License](../LICENSE) | MIT license | Root |

## Documentation by Task

### I want to...

#### Install and Use the MCP Server
1. [Quick Start Guide](guides/quickstart.md) - Fast introduction
2. [Installation Guide](guides/installation.md) - Detailed setup
3. [Usage Guide](guides/usage.md) - Using the server
4. [Configuration Reference](reference/configuration.md) - Configuration options

#### Contribute to the Project
1. [Contributing Guidelines](../CONTRIBUTING.md) - Contribution process
2. [Development Setup](development/setup.md) - Dev environment
3. [Testing Guide](development/testing.md) - Running tests
4. [Architecture](development/architecture.md) - System design

#### Understand How It Works
1. [Architecture](development/architecture.md) - System overview
2. [Generator System](development/generator.md) - Code generation
3. [Project Plan](planning/project-plan.md) - Project roadmap

#### Fix an Issue
1. [Troubleshooting Guide](guides/troubleshooting.md) - Common issues
2. [Testing Guide](development/testing.md) - Run tests locally
3. [Development Setup](development/setup.md) - Dev environment

#### Configure the Server
1. [Configuration Reference](reference/configuration.md) - All options
2. [Installation Guide](guides/installation.md) - Setup instructions
3. [Usage Guide](guides/usage.md) - Environment variables

#### Write Tests
1. [Testing Guide](development/testing.md) - Testing strategy
2. [Testing Setup](development/testing-setup-guide.md) - Detailed setup
3. [Development Setup](development/setup.md) - Dev environment

#### Understand the API
1. [API Tools Reference](reference/generated-tools.md) - All tools
2. [JSON Schema Guide](reference/json-schema-manual-guide.md) - Schemas
3. [Windmill Scripts Guide](reference/windmill-scripts-guide.md) - Scripts

## Documentation Updates

### Auto-Generated Documentation

Some documentation is automatically generated:

- **[API Tools Reference](reference/generated-tools.md)** - Generated by `npm run generate-tool-list`

These files should not be edited manually. They will be overwritten during builds.

### Manual Documentation

All other documentation is manually maintained:

- User guides
- Developer documentation
- Configuration references
- Project planning

### Keeping Documentation Updated

When making code changes:

1. Update relevant documentation
2. Keep README.md high-level (details in guides)
3. Update CHANGELOG.md for notable changes
4. Run `npm run validate` to check for issues

## External Resources

### Windmill Resources
- [Windmill Documentation](https://docs.windmill.dev)
- [Windmill API Documentation](https://app.windmill.dev/openapi.html)
- [Windmill Discord](https://discord.gg/V7PM2YHsPB)

### MCP Resources
- [Model Context Protocol](https://modelcontextprotocol.io)
- [MCP Specification](https://spec.modelcontextprotocol.io)

### Generator Tool
- [openapi-mcp-generator](https://github.com/harsha-iiiv/openapi-mcp-generator)

## Contributing to Documentation

We welcome documentation contributions! See [Contributing Guidelines](../CONTRIBUTING.md).

### Documentation Standards

- **Clear structure**: Use headers, lists, and tables
- **Code examples**: Include working examples
- **Cross-references**: Link to related docs
- **Keep it current**: Update docs with code changes
- **Be concise**: Link to details rather than repeating

### File Organization

- **User guides**: `docs/guides/` - For end users
- **Developer docs**: `docs/development/` - For contributors
- **References**: `docs/reference/` - Technical specs
- **Planning**: `docs/planning/` - Project management

### Naming Conventions

- Use lowercase with hyphens: `my-document.md`
- Be descriptive: `installation.md` not `setup.md`
- Avoid abbreviations: `configuration.md` not `config.md`

## Getting Help

If you can't find what you're looking for:

1. Check this index for related documentation
2. Search the repository: Use GitHub's search feature
3. Check [GitHub Issues](https://github.com/rothnic/windmill-mcp/issues)
4. Ask in [Windmill Discord](https://discord.gg/V7PM2YHsPB)
5. [Create an issue](https://github.com/rothnic/windmill-mcp/issues/new)

## Documentation Statistics

- **Total documents**: 17 markdown files
- **User guides**: 4 files
- **Developer docs**: 6 files
- **References**: 4 files
- **Planning docs**: 4 files
- **Root docs**: 6 files

Last updated: 2025-11-19
