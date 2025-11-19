# Windmill Agent Team Plan

> **Planning Document**
>
> This document outlines the planned team of AI agents for managing Windmill instances. It defines roles, responsibilities, tool access, and collaboration patterns.

## Overview

The Windmill Agent Team consists of a primary **Windmill Manager** agent that orchestrates tasks and delegates to specialized **subagents**. Each subagent focuses on a specific domain of Windmill functionality, enabling efficient parallel processing and expertise-based task handling.

## Architecture

### Primary Agent

- **Windmill Manager**: Central coordinator with high-level oversight
  - Receives user requests
  - Analyzes requirements
  - Delegates tasks to appropriate subagents
  - Synthesizes results
  - Has access to informational tools across all domains

### Subagents

Specialized agents for specific Windmill domains:

- Job Specialist
- User Specialist
- Script Specialist
- Flow Specialist
- Resource Specialist
- Trigger Specialist
- App Specialist
- Workspace Specialist
- Audit Specialist
- Integration Specialist
- Storage Specialist
- System Specialist

## Role Definitions

Each role follows the template structure in `.opencode/templates/agent/windmill-ROLE.md`.

### Windmill Manager

**File**: `.opencode/agent/windmill-manager.md`

```yaml
---
name: "windmill-manager"
description: "Central coordinator for Windmill management tasks - orchestrates subagents and provides high-level oversight"
mode: "primary"
model: "github-copilot/grok-code-fast-1"
tools:
  "*": false # Disable all by default
  "windmill-dev_settings_system_backendVersion": true # Example explicit tool
---
```

**Responsibilities**:

- Analyze incoming requests
- Break down complex tasks into subtasks
- Assign work to appropriate subagents
- Monitor progress and synthesize results
- Handle cross-domain coordination

**Instructions**:

- Always delegate specialized work to subagents
- Maintain overview of all active tasks
- Ensure consistent communication between agents
- Provide final summaries to users

### Job Specialist

**File**: `.opencode/agent/job-specialist.md`

```yaml
---
name: "job-specialist"
description: "Handles job execution, monitoring, and management"
mode: "subagent"
model: "github-copilot/grok-code-fast-1"
tools:
  "windmill-dev_*": false
  "windmill-dev_job_*": true
---
```

**Responsibilities**:

- Job execution and monitoring
- Queue management
- Job cancellation and resumption
- Performance analysis
- Error handling and retries

### User Specialist

**File**: `.opencode/agent/user-specialist.md`

```yaml
---
name: "user-specialist"
description: "Manages user accounts, authentication, and permissions"
mode: "subagent"
model: "github-copilot/grok-code-fast-1"
tools:
  "windmill-dev_*": false
  "windmill-dev_user_*": true
---
```

**Responsibilities**:

- User account management
- Authentication and authorization
- Group and role management
- Invite and access control
- Token management

### Script Specialist

**File**: `.opencode/agent/script-specialist.md`

```yaml
---
name: "script-specialist"
description: "Manages scripts, deployment, and execution"
mode: "subagent"
model: "github-copilot/grok-code-fast-1"
tools:
  "windmill-dev_*": false
  "windmill-dev_script_*": true
---
```

**Responsibilities**:

- Script creation and editing
- Deployment management
- Version control
- Hub integration
- Script execution coordination

### Flow Specialist

**File**: `.opencode/agent/flow-specialist.md`

```yaml
---
name: "flow-specialist"
description: "Manages workflows and flow orchestration"
mode: "subagent"
model: "github-copilot/grok-code-fast-1"
tools:
  "windmill-dev_*": false
  "windmill-dev_flow_*": true
---
```

**Responsibilities**:

- Flow design and modification
- Step orchestration
- Flow debugging
- Performance optimization
- Hub integration

### Resource Specialist

**File**: `.opencode/agent/resource-specialist.md`

```yaml
---
name: "resource-specialist"
description: "Manages resources and resource types"
mode: "subagent"
model: "github-copilot/grok-code-fast-1"
tools:
  "windmill-dev_*": false
  "windmill-dev_resource_*": true
---
```

**Responsibilities**:

- Resource creation and management
- Resource type definitions
- Connection management
- Resource value interpolation

### Trigger Specialist

**File**: `.opencode/agent/trigger-specialist.md`

```yaml
---
name: "trigger-specialist"
description: "Manages triggers and event-driven automation"
mode: "subagent"
model: "github-copilot/grok-code-fast-1"
tools:
  "windmill-dev_*": false
  "windmill-dev_trigger_*": true
---
```

**Responsibilities**:

- Trigger configuration
- Event source integration
- Webhook management
- Schedule management
- Connection testing

### App Specialist

**File**: `.opencode/agent/app-specialist.md`

```yaml
---
name: "app-specialist"
description: "Manages apps and user interfaces"
mode: "subagent"
model: "github-copilot/grok-code-fast-1"
tools:
  "windmill-dev_*": false
  "windmill-dev_app_*": true
---
```

**Responsibilities**:

- App creation and editing
- UI component management
- App deployment
- Version control
- Hub integration

### Workspace Specialist

**File**: `.opencode/agent/workspace-specialist.md`

```yaml
---
name: "workspace-specialist"
description: "Manages workspaces and multi-tenancy"
mode: "subagent"
model: "github-copilot/grok-code-fast-1"
tools:
  "windmill-dev_*": false
  "windmill-dev_workspace_*": true
---
```

**Responsibilities**:

- Workspace creation and management
- User assignment
- Settings configuration
- Usage monitoring
- Security policies

### Audit Specialist

**File**: `.opencode/agent/audit-specialist.md`

```yaml
---
name: "audit-specialist"
description: "Handles auditing, logging, and compliance"
mode: "subagent"
model: "github-copilot/grok-code-fast-1"
tools:
  "windmill-dev_*": false
  "windmill-dev_audit_*": true
---
```

**Responsibilities**:

- Audit log analysis
- Security monitoring
- Compliance reporting
- Log aggregation and search

### Integration Specialist

**File**: `.opencode/agent/integration-specialist.md`

```yaml
---
name: "integration-specialist"
description: "Manages external integrations and connections"
mode: "subagent"
model: "github-copilot/grok-code-fast-1"
tools:
  "windmill-dev_*": false
  "windmill-dev_integration_*": true
---
```

**Responsibilities**:

- OAuth configuration
- Slack/Teams integration
- Webhook setup
- External API connections
- Authentication flows

### Storage Specialist

**File**: `.opencode/agent/storage-specialist.md`

```yaml
---
name: "storage-specialist"
description: "Manages data storage and databases"
mode: "subagent"
model: "github-copilot/grok-code-fast-1"
tools:
  "windmill-dev_*": false
  "windmill-dev_storage_*": true
---
```

**Responsibilities**:

- Database connections
- File storage management
- S3 integration
- Data preview and loading
- Storage optimization

### System Specialist

**File**: `.opencode/agent/system-specialist.md`

```yaml
---
name: "system-specialist"
description: "Handles system administration and configuration"
mode: "subagent"
model: "github-copilot/grok-code-fast-1"
tools:
  "windmill-dev_*": false
  "windmill-dev_system_*": true
  "windmill-dev_settings_*": true
---
```

**Responsibilities**:

- System health monitoring
- Configuration management
- License management
- Performance tuning
- Critical alerts

## Workflow Patterns

### Task Decomposition

1. **User Request** → Windmill Manager
2. **Analysis** → Identify required domains
3. **Delegation** → Create subtasks for relevant specialists
4. **Parallel Execution** → Subagents work simultaneously
5. **Synthesis** → Manager combines results
6. **Response** → Final answer to user

### Communication

- Subagents communicate through shared context
- Manager maintains task status
- Results aggregated by domain
- Cross-domain dependencies handled by manager

### Error Handling

- Subagents report failures to manager
- Manager can reassign or escalate
- Rollback coordination when needed

## Tool Access Matrix

| Role                   | Tool Groups                                                                                                             | Access Level    |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------- | --------------- |
| Windmill Manager       | `windmill-dev_*_list`, `windmill-dev_*_hub`, `windmill-dev_system_*`, `windmill-dev_settings_*`, `windmill-dev_audit_*` | Informational   |
| Job Specialist         | `windmill-dev_job_*`                                                                                                    | Domain-specific |
| User Specialist        | `windmill-dev_user_*`                                                                                                   | Domain-specific |
| Script Specialist      | `windmill-dev_script_*`                                                                                                 | Domain-specific |
| Flow Specialist        | `windmill-dev_flow_*`                                                                                                   | Domain-specific |
| Resource Specialist    | `windmill-dev_resource_*`                                                                                               | Domain-specific |
| Trigger Specialist     | `windmill-dev_trigger_*`                                                                                                | Domain-specific |
| App Specialist         | `windmill-dev_app_*`                                                                                                    | Domain-specific |
| Workspace Specialist   | `windmill-dev_workspace_*`                                                                                              | Domain-specific |
| Audit Specialist       | `windmill-dev_audit_*`                                                                                                  | Domain-specific |
| Integration Specialist | `windmill-dev_integration_*`                                                                                            | Domain-specific |
| Storage Specialist     | `windmill-dev_storage_*`                                                                                                | Domain-specific |
| System Specialist      | `windmill-dev_system_*`, `windmill-dev_settings_*`                                                                      | Multi-domain    |

## Implementation Notes

- All agents use the same model for consistency
- Tool access controlled via glob patterns
- Subagents have focused responsibilities to prevent overlap
- Manager has orchestration tools for coordination
- Roles can be extended or combined as needed

## Next Steps

1. Create agent configuration files in `.opencode/agent/`
2. Test individual agent capabilities
3. Implement manager-subagent communication
4. Validate tool access controls
5. Document usage patterns
