# GitHub Actions Workflows

This directory contains automated workflows for the Windmill MCP Server project.

## Available Workflows

### CI Tests (`ci.yml`)

Runs automated tests on pull requests and merges to main branch to ensure code quality.

**Triggers:**
- **Pull Requests**: Runs on all PRs to main branch
- **Push to Main**: Runs on direct pushes to main branch
- **Manual**: Can be triggered manually via workflow_dispatch

**What it does:**
1. **Unit Tests** (required) - Runs unit tests with mocks
2. **Build** (required) - Verifies generated server can be built
3. **E2E Tests** (best effort) - Tests with Windmill in Docker if server exists

**Job Details:**

- **unit-tests**: Runs `npm run test:unit` to verify all unit tests pass
- **build-generated-server**: Checks if generated server exists and builds it
- **e2e-tests**: Starts Windmill in Docker and runs E2E tests (skipped if server doesn't exist)
- **test-summary**: Aggregates results and fails if required checks don't pass

**PR Blocking:**
- Unit tests MUST pass for PR to be mergeable
- Build MUST succeed for PR to be mergeable
- E2E tests are informational (won't block merge)

**Status Checks:**
This workflow creates required status checks that must pass before a PR can be merged.

### Update MCP Server (`update-mcp-server.yml`)

Automatically updates the MCP server from the latest Windmill OpenAPI specification.

**Triggers:**
- **Manual**: Navigate to Actions → "Update MCP Server" → "Run workflow"
- **Scheduled**: Runs weekly on Mondays at midnight UTC

**What it does:**
1. Fetches the latest OpenAPI specification from Windmill
2. Generates the MCP server code using `openapi-mcp-generator` (creates ~490 tools automatically)
3. Builds the generated TypeScript project
4. Applies any custom overrides from the `overrides/` directory
5. Runs unit tests to verify code quality
6. Starts Windmill in Docker for E2E testing
7. Runs E2E tests to verify MCP server integration with Windmill API
8. Stops Windmill Docker containers
9. Creates a pull request with the changes
10. Sets PR status based on test results:
    - ✅ **Ready for review** if all tests pass
    - ⚠️ **Draft** if tests fail

**PR Details:**
- Branch name: `automated-mcp-update-{run_number}`
- Labels: `automated`, `mcp-update`, and either `tests-passing` or `tests-failing`
- Includes test results and workflow run link
- Test output uploaded as artifact (30-day retention)

**Benefits:**
- Keeps the MCP server in sync with Windmill API changes
- Automated unit testing ensures code quality
- E2E testing validates complete MCP → Windmill integration
- Test failures automatically mark PRs as draft for review
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

### E2E Tests Fail
- Review test output in workflow logs
- Check test artifacts for detailed results
- PRs will be marked as draft automatically

### MCP Integration Tests Skipped
- E2E tests require Windmill to be running
- Token setup is currently manual (to be automated)
- Tests will skip gracefully if Windmill not configured

## Testing Philosophy

The workflow includes two levels of testing:

1. **Unit Tests** (Required) - Must pass for PR to be ready
   - Fast, isolated tests with no external dependencies
   - Test MCP server logic and tool implementations
   
2. **E2E Tests** (Best Effort) - Validate full integration
   - Test complete workflow: MCP Client → MCP Server → Windmill API
   - May be skipped if Windmill setup fails
   - Validates real-world usage scenarios

## Related Documentation

- [Project Status](../../PROJECT_STATUS.md)
- [Contributing Guidelines](../../CONTRIBUTING.md)
- [Testing Guide](../../TESTING.md)
