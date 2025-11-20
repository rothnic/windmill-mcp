# Missing Functionality and Future Improvements

This document tracks potential functionality gaps and future improvements identified during the documentation cleanup.

## Status: Pre-Release (v0.1.0)

The project is currently in pre-release status. This document tracks functionality that may be missing or needs improvement before a v1.0 release.

## Critical for v1.0 Release

### 1. NPM Package Publication
**Status**: Not Done  
**Priority**: High  
**Description**: Package is not yet published to npm, requiring users to clone and build locally.

**Requirements**:
- [ ] Publish to npm registry
- [ ] Test npx execution: `npx windmill-mcp`
- [ ] Ensure package includes all necessary files
- [ ] Update documentation to reflect npm availability
- [ ] Consider scoped package: `@rothnic/windmill-mcp`

**Related Files**:
- `package.json` - Has bin entry configured
- `.npmignore` - Already configured
- [Publishing docs](../CONTRIBUTING.md#publishing)

### 2. Automated Version Tagging
**Status**: Partially Done  
**Priority**: High  
**Description**: GitHub Actions creates releases but tagging strategy could be clearer.

**Requirements**:
- [ ] Document version tag format clearly
- [ ] Ensure consistent tagging: `windmill-v{version}-mcp-{package}`
- [ ] Automated changelog generation
- [ ] Version compatibility matrix documentation

**Related Files**:
- `.github/workflows/update-mcp-server.yml`

### 3. Error Handling and User Feedback
**Status**: Needs Review  
**Priority**: High  
**Description**: Ensure clear error messages throughout the system.

**Requirements**:
- [ ] Review error messages in runtime loader
- [ ] Review error messages in generated code
- [ ] Add error codes for common issues
- [ ] Document error codes in troubleshooting guide

**Related Files**:
- `src/runtime/index.js`
- `docs/guides/troubleshooting.md`

## Important for User Experience

### 4. Documentation Website
**Status**: Not Done  
**Priority**: Medium  
**Description**: GitHub markdown is functional but a proper documentation site would be better.

**Requirements**:
- [ ] Consider using VitePress, Docusaurus, or similar
- [ ] Set up GitHub Pages hosting
- [ ] Add search functionality
- [ ] Include version switcher for different Windmill versions

**Related Files**:
- All files in `docs/`

### 5. Example Projects and Tutorials
**Status**: Limited  
**Priority**: Medium  
**Description**: More real-world examples would help users get started.

**Requirements**:
- [ ] Create example projects repository
- [ ] Add video tutorials or screencasts
- [ ] Document common use cases with examples
- [ ] Create template projects for common scenarios

**Potential Examples**:
- Automated deployment pipeline with Windmill
- Data processing workflows
- Integration with other systems
- Custom dashboard creation

### 6. MCP Inspector Integration Documentation
**Status**: Basic  
**Priority**: Medium  
**Description**: MCP Inspector is mentioned but could be better documented.

**Requirements**:
- [ ] Add screenshots of MCP Inspector usage
- [ ] Create step-by-step Inspector tutorial
- [ ] Document debugging workflows
- [ ] Add troubleshooting for Inspector issues

**Related Files**:
- `docs/development/setup.md`

## Nice to Have Features

### 7. Offline Mode Improvements
**Status**: Partially Implemented  
**Priority**: Low  
**Description**: Better offline support for cached versions.

**Requirements**:
- [ ] Document offline capabilities clearly
- [ ] Add command to pre-download versions
- [ ] Improve cache management
- [ ] Add cache inspection tools

**Related Files**:
- `src/runtime/index.js`

### 8. Configuration File Support
**Status**: Not Done  
**Priority**: Low  
**Description**: Support configuration files in addition to environment variables.

**Requirements**:
- [ ] Support `.windmillrc` or similar config file
- [ ] Support multiple profiles (dev, staging, prod)
- [ ] Configuration validation tool
- [ ] Configuration migration tool

**Potential Format**:
```json
{
  "profiles": {
    "default": {
      "baseUrl": "https://your-instance.windmill.dev",
      "token": "your-token"
    },
    "local": {
      "baseUrl": "http://localhost:8000",
      "token": "test-super-secret"
    }
  }
}
```

### 9. Performance Monitoring
**Status**: Not Done  
**Priority**: Low  
**Description**: Monitor and report performance metrics.

**Requirements**:
- [ ] Add optional performance logging
- [ ] Track tool execution times
- [ ] Monitor memory usage
- [ ] Report metrics to users

### 10. Plugin System
**Status**: Not Done  
**Priority**: Low  
**Description**: Allow users to add custom tools or modify behavior.

**Requirements**:
- [ ] Design plugin architecture
- [ ] Document plugin API
- [ ] Create example plugins
- [ ] Plugin discovery mechanism

## Testing Improvements

### 11. Comprehensive E2E Test Coverage
**Status**: Basic  
**Priority**: Medium  
**Description**: E2E tests exist but could cover more scenarios.

**Requirements**:
- [ ] Test all major tool categories
- [ ] Test error scenarios
- [ ] Test with multiple Windmill versions
- [ ] Add performance benchmarks

**Related Files**:
- `tests/e2e/`

### 12. Integration Tests
**Status**: Limited  
**Priority**: Medium  
**Description**: More integration tests for component interactions.

**Requirements**:
- [ ] Test override system thoroughly
- [ ] Test version management thoroughly
- [ ] Test cache mechanisms
- [ ] Test error recovery

## Security Enhancements

### 13. Security Scanning
**Status**: Basic  
**Priority**: High  
**Description**: Automated security scanning in CI/CD.

**Requirements**:
- [ ] Add npm audit to CI/CD
- [ ] Add Dependabot or similar
- [ ] Scan generated code for vulnerabilities
- [ ] Document security best practices

### 14. Token Management Improvements
**Status**: Basic  
**Priority**: Medium  
**Description**: Better token management and security.

**Requirements**:
- [ ] Support token refresh mechanisms
- [ ] Support multiple authentication methods
- [ ] Token expiration warnings
- [ ] Secure token storage recommendations

## Quality of Life Improvements

### 15. Better CLI Feedback
**Status**: Minimal  
**Priority**: Low  
**Description**: More informative CLI output during operations.

**Requirements**:
- [ ] Progress bars for long operations
- [ ] Colored output for better readability
- [ ] Verbose mode for debugging
- [ ] Quiet mode for scripts

### 16. Docker Image Distribution
**Status**: Not Done  
**Priority**: Low  
**Description**: Distribute as Docker image for easier deployment.

**Requirements**:
- [ ] Create Dockerfile
- [ ] Publish to Docker Hub or GHCR
- [ ] Document Docker usage
- [ ] Include in CI/CD

### 17. Shell Completion
**Status**: Not Done  
**Priority**: Low  
**Description**: Shell completion for CLI commands.

**Requirements**:
- [ ] Bash completion
- [ ] Zsh completion
- [ ] Fish completion
- [ ] PowerShell completion

## Documentation Improvements

### 18. API Reference Documentation
**Status**: Auto-generated Only  
**Priority**: Medium  
**Description**: More detailed API reference beyond tool list.

**Requirements**:
- [ ] Document all parameters for each tool
- [ ] Add examples for each tool
- [ ] Document response formats
- [ ] Add parameter constraints

### 19. Migration Guides
**Status**: Not Applicable Yet  
**Priority**: Low (for future)  
**Description**: Guide users through version migrations.

**Requirements**:
- [ ] Document breaking changes between versions
- [ ] Provide migration scripts
- [ ] Automated migration tools
- [ ] Compatibility matrix

## How to Contribute

If you'd like to work on any of these items:

1. Check if an issue exists: [GitHub Issues](https://github.com/rothnic/windmill-mcp/issues)
2. If not, create an issue describing what you want to work on
3. Reference this document in the issue
4. Follow the [Contributing Guidelines](../CONTRIBUTING.md)

## Prioritization

### Must Have (for v1.0)
- NPM package publication (#1)
- Error handling improvements (#3)
- Security scanning (#13)

### Should Have (for v1.0)
- Better E2E test coverage (#11)
- Automated version tagging clarity (#2)
- Example projects (#5)

### Nice to Have (post v1.0)
- All other items can be considered for future releases

## Related Documents

- [Project Plan](planning/project-plan.md) - Overall roadmap
- [Sprint Planning](planning/sprints.md) - Current sprint work
- [Contributing Guidelines](../CONTRIBUTING.md) - How to contribute
- [Project Status](../PROJECT_STATUS.md) - Current status

---

Last Updated: 2025-11-19  
Next Review: Before v1.0 release
