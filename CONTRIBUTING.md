# Contributing to Windmill MCP Server

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork:

```bash
git clone https://github.com/YOUR_USERNAME/windmill-mcp.git
cd windmill-mcp
```

3. Install dependencies:

```bash
npm install
```

4. Create a branch for your changes:

```bash
git checkout -b feature/your-feature-name
```

## Development Workflow

### Quick Development Setup

```bash
# 1. Install dependencies
npm install

# 2. Start local Windmill and generate MCP server
npm run dev:setup

# 3. In another terminal, run the MCP server
npm run dev:mcp
```

### Detailed Development Workflow

**Starting Local Windmill:**

```bash
# Start Windmill with development info
npm run docker:dev

# Output shows:
# ✅ Windmill ready at http://localhost:8000
#    Superadmin secret: test-super-secret
#    Default workspace: admins

# View logs
npm run docker:logs

# Stop (keeps data)
npm run docker:down

# Clean everything (removes all data)
npm run docker:clean
```

**Testing Against Local Windmill:**

```bash
# Use superadmin secret for quick testing
export E2E_WINDMILL_URL=http://localhost:8000
export E2E_WINDMILL_TOKEN=test-super-secret
export E2E_WORKSPACE=admins

# Run E2E tests
npm run test:e2e
```

See [TESTING.md](docs/testing.md) for comprehensive testing documentation.

### Project Structure

- `src/generator/` - Scripts for fetching OpenAPI specs and generating the MCP server
- `src/overrides/` - Custom modifications that persist across regenerations
- `src/runtime/` - Runtime loader code (committed to git)
- `build/` - **Generated MCP server code** (NOT committed to git, generated locally or downloaded)
- `cache/` - Cached OpenAPI specifications (NOT committed to git)
- `tests/` - Test suite
- `.github/agents/` - Project planning and agent configurations

### Important: Generated Code and Git

**⚠️ The `build/` directory contains generated code that should NOT be committed to git.**

The `.gitignore` file is configured to exclude all generated files:

```gitignore
# Generated MCP server code
build/
cache/
```

**Why this matters:**

- Generated code is specific to each Windmill version
- Users download pre-built artifacts from GitHub Releases
- Committing generated code would bloat the repository
- Pre-commit hooks prevent accidental commits (see below)

**For Development:**

1. Generate code locally: `npm run generate`
2. Test against local Windmill: `npm run dev:mcp`
3. Generated files stay local only

**For CI/CD:**

- Workflow generates, tests, and packages code
- Tested artifacts are released to GitHub
- Users download on-demand via the runtime loader

### Making Changes

1. **For Generated Code**: If you need to modify generated code, place your changes in `src/overrides/` directory matching the structure of `build/src/`. This ensures your changes persist when regenerating.

2. **For Generator Logic**: Modify files in `src/generator/` or `src/overrides/`

3. **For Tests**: Add tests in `tests/` directory

### Testing Your Changes

Run tests before submitting:

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit
npm run test:integration

# Validate code
npm run validate
```

### Pre-commit Hooks (Recommended)

To prevent accidentally committing generated code, set up a pre-commit hook:

```bash
# Create the hook file
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash

# Check if any generated files in build/ are being committed
GENERATED_FILES=$(git diff --cached --name-only | grep '^build/')

if [ -n "$GENERATED_FILES" ]; then
    echo "❌ Error: Attempting to commit generated code"
    echo ""
    echo "The following generated files should not be committed:"
    echo "$GENERATED_FILES"
    echo ""
    echo "Generated code should stay local only. The .gitignore file"
    echo "is configured to exclude them, but you may have used 'git add -f'"
    echo ""
    echo "To fix:"
    echo "  git reset HEAD build/  # Unstage generated files"
    echo "  git add .github/ tests/ src/ package.json README.md  # Stage only source files"
    echo ""
    exit 1
fi

exit 0
EOF

# Make it executable
chmod +x .git/hooks/pre-commit
```

This hook will prevent committing generated files in `build/`.

### Generating the MCP Server

To test the generation process:

```bash
# Fetch latest OpenAPI spec
npm run fetch-spec

# Generate MCP server
npm run generate

# The generation automatically applies overrides
```

## Code Style

- Use ES modules (`import`/`export`)
- Follow existing code patterns
- Use meaningful variable names
- Add comments for complex logic
- Keep functions focused and small

Run the linter:

```bash
npm run lint
```

Format code:

```bash
npm run format
```

## Commit Messages

Use clear, descriptive commit messages:

```
<type>: <subject>

<body>

<footer>
```

Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:

```
feat: add support for webhook endpoints

Add webhook endpoint generation from OpenAPI spec,
including signature validation.

Closes #123
```

```
fix: handle missing OpenAPI spec gracefully

Improve error handling when OpenAPI spec cannot be fetched,
with fallback to backup URL.
```

## Pull Request Process

1. Update documentation if needed
2. Add tests for new features
3. Ensure all tests pass
4. Update README.md if adding user-facing features
5. Update PROJECT_PLAN.md or SPRINTS.md if relevant
6. Submit your PR with a clear description

### PR Description Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

How has this been tested?

## Checklist

- [ ] Tests pass
- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

## Working with Overrides

When adding customizations that should persist across regenerations:

1. Create the file in `src/overrides/` matching the structure of `build/src/`:

```bash
# If modifying build/src/endpoints/workflows.js
# Create src/overrides/endpoints/workflows.js
```

2. Add your customizations
3. Test that overrides apply correctly:

```bash
npm run apply-overrides
```

4. Validate overrides:

```bash
npm run validate-overrides
```

## Testing with a Live Windmill Instance

For integration testing:

1. Set up a test Windmill instance
2. Create a `.env` file:

```bash
cp .env.example .env
# Edit .env with your instance details
```

3. Run integration tests:

```bash
npm run test:live
```

## Adding New Features

### Adding Generator Features

1. Update `src/generator/config.json` if needed
2. Modify `src/generator/generate.js` or related scripts
3. Add tests in `tests/unit/generator/`
4. Document in README.md

### Adding New Endpoints

1. Ensure they're in the OpenAPI spec
2. Regenerate: `npm run generate`
3. Add custom logic in `src/overrides/` if needed
4. Add tests in `tests/integration/`

## Documentation

- Update README.md for user-facing changes
- Update inline code comments for complex logic
- Update PROJECT_PLAN.md for architectural changes
- Update SPRINTS.md for sprint-related work

## Getting Help

- Check existing issues and discussions
- Review PROJECT_PLAN.md and SPRINTS.md
- Ask questions in GitHub Discussions
- Tag maintainers in issues if stuck

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Assume good intentions

## Recognition

Contributors will be acknowledged in:

- GitHub contributors list
- Release notes for significant contributions
- PROJECT_PLAN.md for major features

Thank you for contributing! 🎉
