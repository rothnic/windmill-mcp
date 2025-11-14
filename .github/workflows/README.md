# GitHub Actions Workflows

This directory contains automated workflows for the Windmill MCP Server project.

## Available Workflows

### Update MCP Server (`update-mcp-server.yml`)

Automatically updates the MCP server from the latest Windmill OpenAPI specification.

**Triggers:**
- **Manual**: Navigate to Actions → "Update MCP Server" → "Run workflow"
- **Scheduled**: Runs weekly on Mondays at midnight UTC

**What it does:**
1. Fetches the latest OpenAPI specification from Windmill
2. Generates the MCP server code using the generator scripts
3. Applies any custom overrides from the `overrides/` directory
4. Runs the complete test suite
5. Creates a pull request with the changes
6. Sets PR status based on test results:
   - ✅ **Ready for review** if all tests pass
   - ⚠️ **Draft** if tests fail

**PR Details:**
- Branch name: `automated-mcp-update-{run_number}`
- Labels: `automated`, `mcp-update`, and either `tests-passing` or `tests-failing`
- Includes test results and workflow run link
- Test output uploaded as artifact (30-day retention)

**Benefits:**
- Keeps the MCP server in sync with Windmill API changes
- Automated testing ensures quality before review
- No manual intervention needed for routine updates
- Clear visibility of what changed and test status

**Permissions Required:**
- `contents: write` - To commit and push changes
- `pull-requests: write` - To create pull requests

**Dependencies:**
- `peter-evans/create-pull-request@v6` - For PR creation
- `actions/checkout@v4` - For repository checkout
- `actions/setup-node@v4` - For Node.js setup
- `actions/upload-artifact@v4` - For test result artifacts

## Adding New Workflows

When adding new workflows:

1. Create a new `.yml` file in this directory
2. Follow GitHub Actions best practices
3. Use appropriate permissions (principle of least privilege)
4. Add documentation here
5. Test with manual triggers before enabling schedules
6. Consider adding workflow status badges to README.md

## Monitoring

Monitor workflow runs at: https://github.com/rothnic/windmill-mcp/actions

## Troubleshooting

### Workflow Fails to Fetch Spec
- Check Windmill API is accessible
- Verify firewall/network rules allow access to `app.windmill.dev`
- The workflow uses backup URLs as fallback

### PR Creation Fails
- Ensure `GITHUB_TOKEN` has proper permissions
- Check repository settings allow Actions to create PRs
- Verify branch protection rules don't block automated PRs

### Tests Fail
- Review test output in workflow logs
- Check test artifacts for detailed results
- PRs will be marked as draft automatically

## Related Documentation

- [Project Status](../../PROJECT_STATUS.md)
- [Contributing Guidelines](../../CONTRIBUTING.md)
- [Testing Guide](../../TESTING.md)
