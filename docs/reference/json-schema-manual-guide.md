# JSON Schema Manual Guide for Windmill API/MCP Operations

## Critical Requirement

⚠️ **IMPORTANT**: When creating or updating scripts, flows, or apps via the Windmill API or MCP tools, you **MUST** manually provide the JSON Schema for all parameters. Unlike the Windmill UI (which automatically infers schemas from your code), the API requires explicit schema definitions.

**Failing to provide schemas will result in:**

- Parameters not appearing in the Windmill UI
- Users unable to configure or run your scripts/flows
- Silent failures where the resource exists but is unusable

## Why This Matters

### UI vs API Behavior

| Method               | Schema Inference | What You Must Do                                  |
| -------------------- | ---------------- | ------------------------------------------------- |
| **Windmill UI**      | ✅ Automatic     | Write code with type hints; UI detects parameters |
| **Windmill API/MCP** | ❌ Manual        | Provide complete JSON Schema in `schema` field    |

### Example: The Problem

```typescript
// When you create this script via API:
{
  "path": "f/examples/hello",
  "content": "def main(name: str, age: int):\n    return f'Hello {name}, {age}'"
  // ❌ Missing "schema" field
}
```

**Result**: Script exists in Windmill, but the UI shows no parameters. Users cannot provide `name` or `age` values.

### Example: The Solution

```typescript
// Correct API usage with schema:
{
  "path": "f/examples/hello",
  "content": "def main(name: str, age: int):\n    return f'Hello {name}, {age}'",
  "schema": {
    "type": "object",
    "required": ["name", "age"],
    "properties": {
      "name": {
        "type": "string",
        "description": "User's name"
      },
      "age": {
        "type": "integer",
        "description": "User's age"
      }
    }
  }
}
```

**Result**: ✅ Script is fully functional. UI displays both parameters with proper types and descriptions.

## How to Build JSON Schemas

### Basic Structure

All Windmill parameter schemas follow this structure:

```json
{
  "type": "object",
  "required": ["param1", "param2"],
  "properties": {
    "param1": {
      "type": "string",
      "description": "What this parameter does"
    },
    "param2": {
      "type": "integer",
      "description": "What this parameter does"
    }
  }
}
```

### Type Mapping Reference

Use these mappings when converting code type hints to JSON Schema:

#### Python → JSON Schema

| Python Type      | JSON Schema Type                          | Example                                                           |
| ---------------- | ----------------------------------------- | ----------------------------------------------------------------- |
| `str`            | `"type": "string"`                        | `{"type": "string"}`                                              |
| `int`            | `"type": "integer"`                       | `{"type": "integer"}`                                             |
| `float`          | `"type": "number"`                        | `{"type": "number"}`                                              |
| `bool`           | `"type": "boolean"`                       | `{"type": "boolean"}`                                             |
| `list[str]`      | `"type": "array"` + items                 | `{"type": "array", "items": {"type": "string"}}`                  |
| `dict`           | `"type": "object"`                        | `{"type": "object"}`                                              |
| `dict[str, int]` | `"type": "object"` + additionalProperties | `{"type": "object", "additionalProperties": {"type": "integer"}}` |

#### TypeScript → JSON Schema

| TypeScript Type          | JSON Schema Type                          | Example                                                          |
| ------------------------ | ----------------------------------------- | ---------------------------------------------------------------- |
| `string`                 | `"type": "string"`                        | `{"type": "string"}`                                             |
| `number`                 | `"type": "number"`                        | `{"type": "number"}`                                             |
| `boolean`                | `"type": "boolean"`                       | `{"type": "boolean"}`                                            |
| `string[]`               | `"type": "array"` + items                 | `{"type": "array", "items": {"type": "string"}}`                 |
| `object`                 | `"type": "object"`                        | `{"type": "object"}`                                             |
| `Record<string, number>` | `"type": "object"` + additionalProperties | `{"type": "object", "additionalProperties": {"type": "number"}}` |

### Optional Parameters

Parameters are optional unless listed in the `required` array:

```json
{
  "type": "object",
  "required": ["username"],
  "properties": {
    "username": {
      "type": "string",
      "description": "Required parameter"
    },
    "email": {
      "type": "string",
      "description": "Optional parameter"
    }
  }
}
```

### Default Values

Add `"default"` to provide default values:

```json
{
  "type": "object",
  "properties": {
    "retries": {
      "type": "integer",
      "description": "Number of retry attempts",
      "default": 3
    },
    "timeout": {
      "type": "number",
      "description": "Timeout in seconds",
      "default": 30.0
    }
  }
}
```

### Enums (Fixed Choices)

Use `"enum"` for dropdown selections:

```json
{
  "type": "object",
  "properties": {
    "environment": {
      "type": "string",
      "description": "Deployment environment",
      "enum": ["dev", "staging", "production"],
      "default": "dev"
    }
  }
}
```

### Advanced Features

#### Windmill Resource Types

Link to Windmill resources (databases, APIs, etc.):

```json
{
  "type": "object",
  "properties": {
    "database": {
      "type": "object",
      "description": "PostgreSQL connection",
      "format": "resource-postgresql"
    }
  }
}
```

Common formats:

- `resource-postgresql` - PostgreSQL database
- `resource-mysql` - MySQL database
- `resource-s3` - AWS S3
- `resource-slack` - Slack integration
- `resource-github` - GitHub API

See [Windmill Resource Types](https://www.windmill.dev/docs/core_concepts/resources_and_types) for full list.

#### Dynamic Selects (DynSelect)

Allow users to select from dynamically loaded options:

```json
{
  "type": "object",
  "properties": {
    "user_id": {
      "type": "string",
      "description": "Select a user",
      "format": "dynselect",
      "dynamicSelectOptions": {
        "script": "u/admin/list_users",
        "valueKey": "id",
        "labelKey": "username"
      }
    }
  }
}
```

#### Union Types (oneOf)

Allow multiple type options:

```json
{
  "type": "object",
  "properties": {
    "input": {
      "description": "Accept string or number",
      "oneOf": [{ "type": "string" }, { "type": "number" }]
    }
  }
}
```

## Step-by-Step Schema Creation

### Process for Scripts

1. **Extract parameters from code**

   ```python
   def main(name: str, age: int = 25, active: bool = True):
       pass
   ```

2. **Identify required vs optional**
   - Required: `name` (no default)
   - Optional: `age`, `active` (have defaults)

3. **Build schema structure**

   ```json
   {
     "type": "object",
     "required": ["name"],
     "properties": {}
   }
   ```

4. **Add each parameter**
   ```json
   {
     "type": "object",
     "required": ["name"],
     "properties": {
       "name": { "type": "string", "description": "User's name" },
       "age": { "type": "integer", "description": "User's age", "default": 25 },
       "active": {
         "type": "boolean",
         "description": "Is user active",
         "default": true
       }
     }
   }
   ```

### Process for Flows

Flow modules can have input transforms. Provide schema for flow-level inputs:

```json
{
  "path": "f/examples/my_flow",
  "value": {
    "modules": [
      {
        "id": "a",
        "value": {
          "type": "script",
          "path": "u/admin/process_data",
          "input_transforms": {
            "data": { "type": "javascript", "expr": "flow_input.raw_data" }
          }
        }
      }
    ]
  },
  "schema": {
    "type": "object",
    "required": ["raw_data"],
    "properties": {
      "raw_data": {
        "type": "array",
        "description": "Raw data to process",
        "items": { "type": "object" }
      }
    }
  }
}
```

## Common Mistakes to Avoid

### ❌ Mistake 1: Forgetting the Schema Entirely

```typescript
// WRONG - No schema provided
windmill.createScript({
  path: "f/examples/greet",
  content: "def main(name: str):\n    return f'Hello {name}'",
});
```

### ✅ Fix: Always Include Schema

```typescript
// CORRECT
windmill.createScript({
  path: "f/examples/greet",
  content: "def main(name: str):\n    return f'Hello {name}'",
  schema: {
    type: "object",
    required: ["name"],
    properties: {
      name: { type: "string", description: "Name to greet" },
    },
  },
});
```

### ❌ Mistake 2: Mismatched Parameter Names

```typescript
// Code uses "username" but schema says "user_name"
{
  content: "def main(username: str): pass",
  schema: {
    properties: {
      user_name: {type: "string"}  // ❌ Wrong name!
    }
  }
}
```

### ✅ Fix: Match Exactly

```typescript
{
  content: "def main(username: str): pass",
  schema: {
    properties: {
      username: {type: "string"}  // ✅ Correct
    }
  }
}
```

### ❌ Mistake 3: Wrong Type Mapping

```python
# Python code
def main(count: int): pass
```

```json
// Wrong schema
{
  "properties": {
    "count": { "type": "number" } // ❌ Should be "integer"
  }
}
```

### ✅ Fix: Use Correct Type

```json
{
  "properties": {
    "count": { "type": "integer" } // ✅ Correct
  }
}
```

### ❌ Mistake 4: Missing Required Array

```json
// All parameters are actually required but not marked
{
  "type": "object",
  "properties": {
    "api_key": { "type": "string" },
    "endpoint": { "type": "string" }
  }
  // ❌ Missing "required" field
}
```

### ✅ Fix: Specify Required Parameters

```json
{
  "type": "object",
  "required": ["api_key", "endpoint"], // ✅ Explicit
  "properties": {
    "api_key": { "type": "string" },
    "endpoint": { "type": "string" }
  }
}
```

## Testing Your Schemas

### Verification Checklist

After creating a script/flow via API, verify in the Windmill UI:

1. ✅ Navigate to the script/flow in the UI
2. ✅ Click "Run" or "Test"
3. ✅ Verify all parameters appear in the form
4. ✅ Check that types are correct (text input, number input, checkbox, etc.)
5. ✅ Verify required parameters are marked with asterisks
6. ✅ Test default values pre-fill correctly
7. ✅ Verify descriptions appear as help text

### Quick Test Script

Use this pattern to test schema generation:

```python
# test_schema.py
import json

def generate_schema(code: str) -> dict:
    """Parse code and generate schema"""
    # Your schema generation logic here
    pass

# Test
code = "def main(name: str, age: int = 25): pass"
schema = generate_schema(code)
print(json.dumps(schema, indent=2))

# Expected output:
# {
#   "type": "object",
#   "required": ["name"],
#   "properties": {
#     "name": {"type": "string"},
#     "age": {"type": "integer", "default": 25}
#   }
# }
```

## Real-World Examples

### Example 1: Data Processing Script

**Python Code:**

```python
def main(
    input_file: str,
    output_format: str = "json",
    compress: bool = False,
    max_records: int = 1000
):
    """Process data file and convert format"""
    pass
```

**Complete API Call:**

```json
{
  "path": "f/data/process_file",
  "summary": "Process data file and convert format",
  "description": "Reads input file, converts to specified format, optionally compresses",
  "language": "python3",
  "content": "def main(input_file: str, output_format: str = \"json\", compress: bool = False, max_records: int = 1000):\n    \"\"\"Process data file and convert format\"\"\"\n    pass",
  "schema": {
    "type": "object",
    "required": ["input_file"],
    "properties": {
      "input_file": {
        "type": "string",
        "description": "Path to input file to process"
      },
      "output_format": {
        "type": "string",
        "description": "Output format (json, csv, xml)",
        "enum": ["json", "csv", "xml"],
        "default": "json"
      },
      "compress": {
        "type": "boolean",
        "description": "Enable gzip compression",
        "default": false
      },
      "max_records": {
        "type": "integer",
        "description": "Maximum records to process",
        "default": 1000
      }
    }
  }
}
```

### Example 2: API Integration Script

**TypeScript Code:**

```typescript
export async function main(
  api_key: string,
  endpoint: string,
  method: "GET" | "POST" = "GET",
  payload?: object,
) {
  // Make API call
}
```

**Complete API Call:**

```json
{
  "path": "f/integrations/api_call",
  "summary": "Make HTTP API call",
  "language": "deno",
  "content": "export async function main(api_key: string, endpoint: string, method: \"GET\" | \"POST\" = \"GET\", payload?: object) {\n  // Implementation\n}",
  "schema": {
    "type": "object",
    "required": ["api_key", "endpoint"],
    "properties": {
      "api_key": {
        "type": "string",
        "description": "API authentication key"
      },
      "endpoint": {
        "type": "string",
        "description": "API endpoint URL"
      },
      "method": {
        "type": "string",
        "description": "HTTP method",
        "enum": ["GET", "POST"],
        "default": "GET"
      },
      "payload": {
        "type": "object",
        "description": "Request payload (for POST)",
        "properties": {}
      }
    }
  }
}
```

### Example 3: Database Query Script

**Python with Resource Type:**

```python
from typing import TypedDict

class PostgresResource(TypedDict):
    host: str
    port: int
    user: str
    password: str
    database: str

def main(db: PostgresResource, query: str, limit: int = 100):
    """Execute database query"""
    pass
```

**Complete API Call:**

```json
{
  "path": "f/database/execute_query",
  "summary": "Execute database query",
  "language": "python3",
  "content": "def main(db, query: str, limit: int = 100):\n    \"\"\"Execute database query\"\"\"\n    pass",
  "schema": {
    "type": "object",
    "required": ["db", "query"],
    "properties": {
      "db": {
        "type": "object",
        "description": "PostgreSQL database connection",
        "format": "resource-postgresql"
      },
      "query": {
        "type": "string",
        "description": "SQL query to execute"
      },
      "limit": {
        "type": "integer",
        "description": "Maximum rows to return",
        "default": 100
      }
    }
  }
}
```

## Additional Resources

- **Windmill Scripts Guide**: See [windmill-scripts-guide.md](./windmill-scripts-guide.md) for comprehensive script creation documentation
- **Official JSON Schema Spec**: [json-schema.org](https://json-schema.org/)
- **Windmill Script Parameters**: [Windmill Docs - Script Parameters](https://www.windmill.dev/docs/getting_started/scripts_quickstart/typescript#parameters)
- **Windmill Resource Types**: [Windmill Docs - Resources](https://www.windmill.dev/docs/core_concepts/resources_and_types)
- **Windmill Advanced Parameters**: [Windmill Docs - Advanced Parameters](https://www.windmill.dev/docs/core_concepts/json_schema_and_parsing)

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────┐
│ JSON SCHEMA QUICK REFERENCE                             │
├─────────────────────────────────────────────────────────┤
│ Basic Structure:                                        │
│   {                                                     │
│     "type": "object",                                   │
│     "required": ["param1"],                             │
│     "properties": {                                     │
│       "param1": {"type": "string"}                      │
│     }                                                   │
│   }                                                     │
├─────────────────────────────────────────────────────────┤
│ Common Types:                                           │
│   "string"  | "integer" | "number"  | "boolean"        │
│   "array"   | "object"  | "null"                        │
├─────────────────────────────────────────────────────────┤
│ Features:                                               │
│   "default": value      - Set default value             │
│   "enum": [...]         - Fixed choices (dropdown)      │
│   "format": "resource-" - Windmill resource type        │
│   "description": "..."  - Help text in UI               │
├─────────────────────────────────────────────────────────┤
│ Remember: API requires manual schemas, UI does not!     │
└─────────────────────────────────────────────────────────┘
```

---

**Last Updated**: 2025-11-18  
**Related Guides**: [windmill-scripts-guide.md](./windmill-scripts-guide.md)
