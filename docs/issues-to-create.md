# Issues to Create

This document lists GitHub issues that should be created based on the missing functionality identified during the documentation cleanup.

## Critical Issues (for v1.0)

### Issue 1: Publish package to npm
**Title**: Publish windmill-mcp package to npm registry  
**Labels**: enhancement, priority-high, v1.0  
**Description**:
```markdown
## Problem
The package is currently not published to npm, requiring users to clone and build locally. This creates friction for new users and limits adoption.

## Requirements
- [ ] Verify package.json is correctly configured
- [ ] Test local build and npx execution
- [ ] Publish to npm registry (consider scoped: @rothnic/windmill-mcp)
- [ ] Update all documentation to reflect npm availability
- [ ] Add npm badge to README
- [ ] Create release process documentation

## Acceptance Criteria
- Users can install with: `npx windmill-mcp`
- Package appears on npm with correct metadata
- Documentation reflects npm installation method
- Release process is documented

## Related Documents
- `package.json` - Already has bin entry configured
- `.npmignore` - Already configured for clean distribution
- `docs/guides/installation.md` - Will need updates
- `README.md` - Will need updates
```

### Issue 2: Improve error messages and user feedback
**Title**: Enhance error handling and user feedback throughout the system  
**Labels**: enhancement, priority-high, v1.0, ux  
**Description**:
```markdown
## Problem
Current error messages could be more helpful for users troubleshooting issues.

## Requirements
- [ ] Review and improve error messages in runtime loader
- [ ] Review and improve error messages in generated code
- [ ] Add error codes for common issues
- [ ] Document error codes in troubleshooting guide
- [ ] Add helpful suggestions in error messages
- [ ] Standardize error format

## Examples of Improvements Needed
- Connection errors should suggest checking WINDMILL_BASE_URL and network
- Authentication errors should suggest checking token and permissions
- Version mismatch errors should suggest running `npm run generate`
- File not found errors should suggest running the generation workflow

## Acceptance Criteria
- All error messages include actionable suggestions
- Error codes are documented in troubleshooting guide
- Users can easily diagnose issues from error messages

## Related Documents
- `src/runtime/index.js`
- `docs/guides/troubleshooting.md`
```

### Issue 3: Add automated security scanning to CI/CD
**Title**: Implement security scanning in CI/CD pipeline  
**Labels**: security, enhancement, priority-high, v1.0  
**Description**:
```markdown
## Problem
No automated security scanning is currently in place, which could allow vulnerabilities to slip through.

## Requirements
- [ ] Add npm audit to CI/CD workflow
- [ ] Set up Dependabot or Renovate for dependency updates
- [ ] Add security scanning for generated code (if feasible)
- [ ] Document security best practices
- [ ] Define security policy
- [ ] Add security badge to README

## Tools to Consider
- GitHub Dependabot (built-in)
- npm audit (already available)
- Snyk or similar for deeper scanning
- CodeQL for code scanning

## Acceptance Criteria
- CI/CD fails on high-severity vulnerabilities
- Automated PRs for dependency updates
- Security policy is documented
- Security scanning status is visible

## Related Files
- `.github/workflows/ci.yml`
- `SECURITY.md` (to be created)
```

## Important Issues (Should Have for v1.0)

### Issue 4: Expand E2E test coverage
**Title**: Expand E2E test coverage for all major tool categories  
**Labels**: testing, enhancement, priority-medium  
**Description**:
```markdown
## Problem
Current E2E tests provide basic coverage but don't test all major tool categories or error scenarios.

## Requirements
- [ ] Add E2E tests for each major tool category (jobs, scripts, workflows, etc.)
- [ ] Test error scenarios and edge cases
- [ ] Test with multiple Windmill versions (if feasible)
- [ ] Add performance benchmarks
- [ ] Document E2E test patterns

## Test Categories Needed
- Jobs: create, run, monitor, cancel
- Scripts: CRUD operations, execution
- Workflows: CRUD operations, execution
- Resources: CRUD operations, validation
- Schedules: CRUD operations
- Users/Groups: management operations
- Workspace: configuration operations

## Acceptance Criteria
- E2E tests cover all major tool categories
- Tests pass consistently
- Test execution time is reasonable (<10 minutes)
- Tests catch real issues

## Related Files
- `tests/e2e/`
- `docs/development/testing.md`
```

### Issue 5: Create example projects and tutorials
**Title**: Create example projects demonstrating common use cases  
**Labels**: documentation, enhancement, examples, priority-medium  
**Description**:
```markdown
## Problem
Users need real-world examples to understand how to use the MCP server effectively.

## Requirements
- [ ] Create examples repository or directory
- [ ] Document common use cases
- [ ] Add code examples for each use case
- [ ] Consider video tutorials or screencasts
- [ ] Create template projects

## Example Scenarios to Document
1. **Automated Deployment Pipeline**
   - Script to deploy from Git
   - Schedule for periodic deployments
   - Webhook trigger for push events

2. **Data Processing Workflow**
   - ETL scripts
   - Scheduled data sync
   - Error handling and notifications

3. **API Integration**
   - Connect to external APIs
   - Store credentials as resources
   - Process and transform data

4. **Custom Dashboard**
   - Create app with Windmill
   - Display metrics and status
   - Interactive controls

## Acceptance Criteria
- At least 3 complete example projects
- Each example includes README with setup instructions
- Examples demonstrate best practices
- Examples are tested and working

## Related Documents
- New: `examples/` directory
- `docs/guides/usage.md` - Should link to examples
```

### Issue 6: Improve automated version tagging and releases
**Title**: Clarify and improve version tagging strategy  
**Labels**: automation, enhancement, priority-medium  
**Description**:
```markdown
## Problem
Version tagging strategy exists but could be clearer and more automated.

## Requirements
- [ ] Document version tag format clearly
- [ ] Ensure consistent tagging: `windmill-v{windmill-version}-mcp-{package-version}`
- [ ] Automate changelog generation
- [ ] Create version compatibility matrix documentation
- [ ] Add version validation in release workflow

## Current State
- Tags are created: `windmill-latest`, `windmill-v1.520.1-mcp-0.2.0`
- Need better documentation of what each tag means
- Changelog is manual

## Desired State
- Clear documentation of tagging strategy
- Automated changelog from commits
- Version compatibility matrix showing which MCP version works with which Windmill version
- Automated validation that versions match

## Acceptance Criteria
- Version tagging is fully documented
- Changelog is automatically generated
- Compatibility matrix is maintained
- Release process is streamlined

## Related Files
- `.github/workflows/update-mcp-server.yml`
- `CHANGELOG.md`
- New: `docs/reference/compatibility.md`
```

## Nice to Have Issues (Post v1.0)

These issues are lower priority but should still be tracked:

### Issue 7: Create documentation website
**Title**: Build dedicated documentation website  
**Labels**: documentation, enhancement, priority-low  

### Issue 8: Add configuration file support
**Title**: Support configuration files (.windmillrc)  
**Labels**: enhancement, priority-low  

### Issue 9: Add performance monitoring
**Title**: Add optional performance logging and monitoring  
**Labels**: enhancement, observability, priority-low  

### Issue 10: Improve offline mode
**Title**: Enhance offline capabilities and cache management  
**Labels**: enhancement, priority-low  

### Issue 11: Docker image distribution
**Title**: Create and publish Docker image  
**Labels**: enhancement, distribution, priority-low  

### Issue 12: Add shell completion
**Title**: Implement shell completion for CLI  
**Labels**: enhancement, ux, priority-low  

## How to Create These Issues

1. Go to [GitHub Issues](https://github.com/rothnic/windmill-mcp/issues)
2. Click "New Issue"
3. Copy the title and description from above
4. Add the specified labels
5. Add to appropriate milestone (v1.0 for critical/important issues)
6. Assign if appropriate

## Priority Order

Create issues in this order:
1. Critical issues (#1-3) - Block v1.0 release
2. Important issues (#4-6) - Should have for v1.0
3. Nice to have issues (#7-12) - Can wait for post-v1.0

## Notes

- These issues are based on analysis during documentation cleanup
- Priorities may change based on user feedback and project needs
- Some issues may already exist - check before creating
- Link these issues to the MISSING_FUNCTIONALITY.md document

---

Created: 2025-11-19  
Document: Part of documentation cleanup initiative
