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

### Project Structure

- `generator/` - Scripts for fetching OpenAPI specs and generating the MCP server
- `overrides/` - Custom modifications that persist across regenerations
- `src/` - Generated MCP server code (can be regenerated)
- `tests/` - Test suite
- `scripts/` - Utility scripts
- `.github/agents/` - Project planning and agent configurations

### Making Changes

1. **For Generated Code**: If you need to modify generated code, place your changes in `overrides/` directory matching the structure of `src/`. This ensures your changes persist when regenerating.

2. **For Generator Logic**: Modify files in `generator/` or `scripts/`

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

1. Create the file in `overrides/` matching the structure of `src/`:
```bash
# If modifying src/endpoints/workflows.js
# Create overrides/endpoints/workflows.js
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

1. Update `generator/config.json` if needed
2. Modify `generator/generate.js` or related scripts
3. Add tests in `tests/unit/generator/`
4. Document in README.md

### Adding New Endpoints

1. Ensure they're in the OpenAPI spec
2. Regenerate: `npm run generate`
3. Add custom logic in `overrides/` if needed
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
