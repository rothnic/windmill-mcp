#!/bin/bash
set -e

#
# Seed Test Data for E2E Testing
#
# This script creates sample scripts, workflows, and resources
# in the Windmill instance for comprehensive E2E testing
#

WINDMILL_URL="${E2E_WINDMILL_URL:-http://localhost:8000}"
WORKSPACE="${E2E_WORKSPACE:-demo}"
TOKEN="${E2E_WINDMILL_TOKEN:-${WM_TOKEN}}"

if [ -z "$TOKEN" ]; then
  echo "❌ Error: No authentication token available"
  echo "Set E2E_WINDMILL_TOKEN or WM_TOKEN environment variable"
  exit 1
fi

echo "🌱 Seeding test data to $WINDMILL_URL/$WORKSPACE"
echo ""

# Helper function to make API calls
api_call() {
  local method=$1
  local endpoint=$2
  local data=$3

  curl -s -X "$method" \
    "$WINDMILL_URL/api/w/$WORKSPACE$endpoint" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "$data"
}

# 1. Create test scripts
echo "📝 Creating test scripts..."

# Python script
api_call POST "/scripts/create" '{
  "path": "f/examples/test_python_script",
  "summary": "Test Python Script for E2E",
  "description": "A simple Python script for testing",
  "content": "def main():\n    return {\"message\": \"Hello from test script\", \"value\": 42}\n",
  "language": "python3",
  "is_template": false,
  "schema": {
    "properties": {},
    "required": [],
    "type": "object"
  }
}' > /dev/null 2>&1 && echo "  ✅ Python script created" || echo "  ⚠️  Python script may already exist"

# TypeScript/Deno script
api_call POST "/scripts/create" '{
  "path": "f/examples/test_deno_script",
  "summary": "Test Deno Script for E2E",
  "description": "A simple Deno/TypeScript script for testing",
  "content": "export async function main() {\n  return { message: \"Hello from Deno\", timestamp: Date.now() };\n}\n",
  "language": "deno",
  "is_template": false,
  "schema": {
    "properties": {},
    "required": [],
    "type": "object"
  }
}' > /dev/null 2>&1 && echo "  ✅ Deno script created" || echo "  ⚠️  Deno script may already exist"

# Bash script
api_call POST "/scripts/create" '{
  "path": "f/examples/test_bash_script",
  "summary": "Test Bash Script for E2E",
  "description": "A simple bash script for testing",
  "content": "#!/bin/bash\necho {\\\"message\\\": \\\"Hello from bash\\\", \\\"hostname\\\": \\\"$(hostname)\\\"}\n",
  "language": "bash",
  "is_template": false,
  "schema": {
    "properties": {},
    "required": [],
    "type": "object"
  }
}' > /dev/null 2>&1 && echo "  ✅ Bash script created" || echo "  ⚠️  Bash script may already exist"

echo ""

# 2. Create test workflow
echo "🔄 Creating test workflows..."

api_call POST "/flows/create" '{
  "path": "f/examples/test_workflow",
  "summary": "Test Workflow for E2E",
  "description": "A simple workflow for E2E testing",
  "value": {
    "modules": [
      {
        "id": "a",
        "value": {
          "type": "script",
          "content": "def main():\n    return {\"step\": 1, \"data\": \"first step\"}",
          "language": "python3"
        }
      },
      {
        "id": "b",
        "value": {
          "type": "script",
          "content": "def main(step_a):\n    return {\"step\": 2, \"previous\": step_a}",
          "language": "python3"
        }
      }
    ]
  },
  "schema": {
    "properties": {},
    "required": [],
    "type": "object"
  }
}' > /dev/null 2>&1 && echo "  ✅ Test workflow created" || echo "  ⚠️  Workflow may already exist"

echo ""

# 3. Create test resources
echo "📦 Creating test resources..."

api_call POST "/resources/create" '{
  "path": "f/examples/test_resource",
  "value": {
    "api_key": "test-api-key-12345",
    "endpoint": "https://api.example.com",
    "config": {
      "timeout": 30,
      "retries": 3
    }
  },
  "resource_type": "test_api",
  "description": "Test API resource for E2E testing"
}' > /dev/null 2>&1 && echo "  ✅ Test resource created" || echo "  ⚠️  Resource may already exist"

api_call POST "/resources/create" '{
  "path": "f/examples/test_database",
  "value": {
    "host": "localhost",
    "port": 5432,
    "database": "testdb",
    "username": "testuser"
  },
  "resource_type": "postgresql",
  "description": "Test database resource for E2E testing"
}' > /dev/null 2>&1 && echo "  ✅ Test database resource created" || echo "  ⚠️  Resource may already exist"

echo ""

# 4. Create test variables
echo "🔐 Creating test variables..."

api_call POST "/variables/create" '{
  "path": "f/examples/test_var",
  "value": "test-value-123",
  "description": "Test variable for E2E testing",
  "is_secret": false
}' > /dev/null 2>&1 && echo "  ✅ Test variable created" || echo "  ⚠️  Variable may already exist"

api_call POST "/variables/create" '{
  "path": "f/examples/test_secret",
  "value": "secret-value-456",
  "description": "Test secret variable for E2E testing",
  "is_secret": true
}' > /dev/null 2>&1 && echo "  ✅ Test secret created" || echo "  ⚠️  Secret may already exist"

echo ""

# 5. Run a test job to generate some job history
echo "🚀 Running test job to generate job history..."

# Wait a moment for script to be fully created
sleep 2

JOB_RESULT=$(api_call POST "/jobs/run/f/examples/test_python_script" '{}' 2>&1)
JOB_ID=$(echo "$JOB_RESULT" | grep -oP '"uuid":"\K[^"]+' || echo "")

if [ -n "$JOB_ID" ] && [ "$JOB_ID" != "null" ]; then
  echo "  ✅ Test job queued: $JOB_ID"
else
  echo "  ⚠️  Could not queue test job (script may not be ready yet)"
  # This is not critical for test data seeding
fi

echo ""
echo "✅ Test data seeding complete!"
echo ""
echo "Test data created:"
echo "  • Scripts: 3 (Python, Deno, Bash)"
echo "  • Workflows: 1"
echo "  • Resources: 2"
echo "  • Variables: 2"
echo "  • Jobs: 1 (if successful)"
echo ""
echo "You can now run: npm run test:e2e"
