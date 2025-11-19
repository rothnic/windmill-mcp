# Windmill Scripts Guide

This guide provides a concise reference for working with Windmill scripts via the MCP API.

## Core Concepts

### What is a Windmill Script?

Scripts are the foundation of Windmill and can be written in multiple languages:

- TypeScript (Deno, Bun, Node.js)
- Python
- Go
- Bash/PowerShell/Nu
- PHP
- SQL (PostgreSQL, MySQL, MS SQL, BigQuery, Snowflake)
- REST/GraphQL
- Docker, Rust, Ansible, C#, Java, Ruby

**📖 [Official Script Editor Docs](https://www.windmill.dev/docs/script_editor)**

### Main Function Requirement

Every script must have a **main function** that serves as the entrypoint:

**TypeScript:**

```typescript
async function main(param1: string, param2: { nested: string }) {
  // Your code here
}
```

**Python:**

```python
def main(param1: str, param2: dict):
  # Your code here
```

**Go:**

```go
func main(x string, nested struct{ Foo string `json:"foo"` }) (interface{}, error) {
  // Your code here
}
```

**Bash:**
No main function needed - body is executed directly with args passed.

## JSON Schema & Input Types

⚠️ **CRITICAL FOR API/MCP USERS**: When creating scripts via API or MCP tools, you **MUST** manually provide JSON Schema. See **[JSON Schema Manual Guide](./json-schema-manual-guide.md)** for complete instructions, examples, and common mistakes to avoid.

Windmill uses [JSON Schema 2020-12](https://json-schema.org/draft/2020-12/schema) to define script inputs and generate auto-UIs.

**📖 [JSON Schema Documentation](https://www.windmill.dev/docs/core_concepts/json_schema_and_parsing)**

### Type Mapping

#### Python Types → JSON Schema

| Python              | JSON Schema                 |
| ------------------- | --------------------------- |
| `str`               | `string`                    |
| `float`             | `number`                    |
| `int`               | `integer`                   |
| `bool`              | `boolean`                   |
| `dict`              | `object`                    |
| `list`              | `any[]`                     |
| `List[str]`         | `string[]`                  |
| `bytes`             | `string` (base64)           |
| `datetime`          | `string` (date-time format) |
| `Literal["a", "b"]` | `string` with enums         |
| `DynSelect_foo`     | Dynamic select dropdown     |

#### TypeScript Types → JSON Schema

| TypeScript       | JSON Schema                           |
| ---------------- | ------------------------------------- |
| `string`         | `string`                              |
| `number`         | `number`                              |
| `bigint`         | `int`                                 |
| `boolean`        | `boolean`                             |
| `object`         | `object`                              |
| `string[]`       | `string[]`                            |
| `"a" \| "b"`     | `string` with enums                   |
| `wmill.Base64`   | `string` (base64 encoding)            |
| `wmill.Email`    | `string` (email format)               |
| `wmill.Sql`      | `string` (SQL format - Monaco editor) |
| `<ResourceType>` | `object` (resource format)            |
| `DynSelect_foo`  | Dynamic select dropdown               |

### Resource Types

Reference workspace resources by type (CamelCase → snake_case):

**TypeScript:**

```typescript
type Postgresql = object; // References 'postgresql' resource type

export async function main(db: Postgresql) {
  // db contains resource configuration
}
```

**Python:**

```python
postgresql = dict

def main(db: postgresql):
  # db contains resource configuration
  pass
```

**📖 [Resources & Resource Types](https://www.windmill.dev/docs/core_concepts/resources_and_types)**

### Advanced Input Features

#### Dynamic Select

Create dropdowns with dynamically computed options based on other inputs:

**TypeScript:**

```typescript
export type DynSelect_category = string;

export async function category(department: string, region: string) {
  if (department === "sales") {
    return [
      { value: "enterprise", label: "Enterprise Sales" },
      { value: "smb", label: "SMB Sales" },
    ];
  }
  return [{ value: "general", label: "General" }];
}

export async function main(
  department: string,
  region: string,
  category: DynSelect_category,
) {
  console.log(category);
}
```

**Python:**

```python
DynSelect_category = str

def category(department: str, region: str):
  if department == "sales":
    return [
      {"value": "enterprise", "label": "Enterprise Sales"},
      {"value": "smb", "label": "SMB Sales"}
    ]
  return [{"value": "general", "label": "General"}]

def main(department: str, region: str, category: DynSelect_category):
  print(category)
```

#### oneOf (Union Types)

Allow users to pick between different object shapes:

**TypeScript:**

```typescript
type Config =
  | { label: "Database"; connection_string: string }
  | { label: "API"; api_key: string; endpoint: string };

export async function main(config: Config) {
  if (config.label === "Database") {
    // config.connection_string is available
  } else {
    // config.api_key and config.endpoint are available
  }
}
```

The UI will render a dropdown to select which variant, then show fields for that variant.

### Input Field Advanced Settings

When creating or editing scripts, each argument supports advanced configuration:

- **String**: Min/max length, textarea rows, password (creates variable), format (email, uri, uuid, ipv4, yaml, sql, date-time), pattern (regex), enum
- **Integer/Number**: Min/max, currency, locale
- **Object**: Resource type selection
- **Array**: Item types (strings, enums, objects, numbers, bytes)
- **Boolean**: No advanced settings
- **Any**: No advanced settings

**📖 [Customize Generated UI](https://www.windmill.dev/docs/script_editor/customize_ui)**

## Creating Scripts via API

When creating scripts through the Windmill MCP API, you need to provide:

1. **Path**: Unique identifier (e.g., `u/username/script_name` or `f/folder/script_name`)
2. **Content**: Script code with main function
3. **Language**: Script language (python3, deno, go, bash, etc.)
4. **Schema**: JSON Schema defining inputs (optional - can be inferred)
5. **Description**: What the script does
6. **Summary**: Short description

### Example: Creating a Python Script

```json
{
  "path": "u/admin/hello_world",
  "summary": "Greet a user",
  "description": "Takes a name and returns a greeting",
  "content": "def main(name: str):\n    return f'Hello, {name}!'",
  "language": "python3",
  "schema": {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "type": "object",
    "properties": {
      "name": {
        "type": "string",
        "description": "Name to greet"
      }
    },
    "required": ["name"]
  }
}
```

### Example: Creating a TypeScript Script with Resource

```json
{
  "path": "f/integrations/query_database",
  "summary": "Query PostgreSQL database",
  "description": "Executes a SQL query against a PostgreSQL database",
  "content": "type Postgresql = object;\n\nexport async function main(db: Postgresql, query: string) {\n  // Query logic here\n  return { rows: [] };\n}",
  "language": "deno",
  "schema": {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "type": "object",
    "properties": {
      "db": {
        "type": "object",
        "format": "resource-postgresql",
        "description": "PostgreSQL database connection"
      },
      "query": {
        "type": "string",
        "format": "sql",
        "description": "SQL query to execute"
      }
    },
    "required": ["db", "query"]
  }
}
```

## Script Metadata & Settings

Scripts have configurable metadata:

- **Summary**: Short description shown in lists
- **Description**: Detailed explanation
- **Is Template**: Mark as reusable template
- **Kind**: Normal script, approval script, trigger, etc.
- **Concurrency Limits**: Max concurrent executions
- **Dedicated Workers**: Assign to specific worker tags
- **Cache TTL**: Cache results for period
- **Timeout**: Max execution time
- **Delete After Use**: Auto-delete after run
- **Restart Unless Cancelled**: Perpetual script behavior

**📖 [Script Settings](https://www.windmill.dev/docs/script_editor/settings)**  
**📖 [Script Kinds](https://www.windmill.dev/docs/script_editor/script_kinds)**  
**📖 [Concurrency Limits](https://www.windmill.dev/docs/script_editor/concurrency_limit)**  
**📖 [Perpetual Scripts](https://www.windmill.dev/docs/script_editor/perpetual_scripts)**

## Running Scripts

Scripts can be triggered via:

1. **Direct API call**: `runScriptByPath`, `runScriptByHash`
2. **Webhooks**: HTTP endpoints for external triggers
3. **Schedules**: Cron-based execution
4. **Flow steps**: Part of a workflow
5. **App components**: Triggered by UI interactions

**📖 [Triggers](https://www.windmill.dev/docs/getting_started/triggers)**  
**📖 [Webhooks](https://www.windmill.dev/docs/core_concepts/webhooks)**  
**📖 [Schedules](https://www.windmill.dev/docs/core_concepts/scheduling)**

## Script Versioning

Windmill automatically versions scripts:

- Each deployment creates a new version identified by hash
- Can view/restore previous versions
- Deployment history tracked
- Supports draft → deploy workflow

**📖 [Versioning](https://www.windmill.dev/docs/core_concepts/versioning)**  
**📖 [Draft & Deploy](https://www.windmill.dev/docs/core_concepts/draft_and_deploy)**

## Dependencies & Imports

### Python

Uses `requirements.txt` or inline imports. Windmill auto-generates lockfile.

```python
# Inline import
import requests
import pandas as pd

def main():
  pass
```

### TypeScript (Deno)

Uses npm: prefix or Deno imports:

```typescript
import axios from "npm:axios@1.6.0";
import { S3Client } from "https://deno.land/x/s3_lite_client@0.2.0/mod.ts";

export async function main() {}
```

**📖 [Dependency Management](https://www.windmill.dev/docs/advanced/imports)**

## Backend Schema Validation

Add `schema_validation` comment to enforce strict input validation:

**TypeScript:**

```typescript
// schema_validation
export async function main(count: number, status: "active" | "inactive") {
  // Will fail if count is not a number or status is not 'active'/'inactive'
}
```

**Python:**

```python
# schema_validation
def main(count: int, status: Literal["active", "inactive"]):
  # Will fail if types don't match
  pass
```

## Best Practices

1. **Keep scripts focused**: One clear purpose per script (avoid 1000+ line scripts)
2. **Use flows for complexity**: Chain scripts together for multi-step processes
3. **Leverage resources**: Store credentials/configs as workspace resources
4. **Add descriptions**: Help others understand inputs and behavior
5. **Use Hub scripts**: Browse [Windmill Hub](https://hub.windmill.dev) for reusable scripts
6. **Version control**: Use Git sync or CLI sync for production scripts
7. **Test thoroughly**: Use instant preview before deployment
8. **Handle errors**: Implement proper error handling and retries
9. **Document parameters**: Clear descriptions for all inputs
10. **Share logic**: Extract common code to shared modules

**📖 [Workflows as Code](https://www.windmill.dev/docs/core_concepts/workflows_as_code)**  
**📖 [Sharing Common Logic](https://www.windmill.dev/docs/advanced/sharing_common_logic)**  
**📖 [Error Handling](https://www.windmill.dev/docs/core_concepts/error_handling)**

## Quick Reference

| Task                   | API Tool/Method                      |
| ---------------------- | ------------------------------------ |
| Create script          | `createScript`                       |
| Update script          | `updateScript`                       |
| Get script by path     | `getScriptByPath`                    |
| List workspace scripts | `listScripts`                        |
| Run script             | `runScriptByPath`, `runScriptByHash` |
| Delete script          | `deleteScript`                       |
| Archive script         | `archiveScriptByPath`                |
| Get Hub script         | `getHubScript`                       |
| Search Hub             | `queryHubScripts`                    |

## Additional Resources

- **[Auto-generated UIs](https://www.windmill.dev/docs/core_concepts/auto_generated_uis)** - How Windmill creates UIs from schemas
- **[Instant Preview](https://www.windmill.dev/docs/core_concepts/instant_preview)** - Test scripts immediately
- **[Code Editor](https://www.windmill.dev/docs/code_editor)** - Editor features and shortcuts
- **[Local Development](https://www.windmill.dev/docs/advanced/local_development)** - Develop scripts locally
- **[VS Code Extension](https://www.windmill.dev/docs/script_editor/vs_code_scripts)** - Run scripts in VS Code
- **[Windmill Hub](https://hub.windmill.dev)** - Browse & share scripts
- **[API Documentation](https://app.windmill.dev/openapi.html)** - Complete OpenAPI spec
