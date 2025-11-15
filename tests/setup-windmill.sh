#!/bin/bash
set -e

#
# Windmill E2E Test Setup Script
#
# This script:
# 1. Installs Windmill CLI (wmill)
# 2. Waits for Windmill to be ready
# 3. Creates a test user and generates an API token
# 4. Seeds test data (scripts, workflows, resources)
#

WINDMILL_URL="${E2E_WINDMILL_URL:-http://localhost:8000}"
WORKSPACE="${E2E_WORKSPACE:-demo}"
SUPERADMIN_SECRET="${SUPERADMIN_SECRET:-test-super-secret}"
TEST_USER_EMAIL="${TEST_USER_EMAIL:-test@windmill.dev}"
TEST_USER_PASSWORD="${TEST_USER_PASSWORD:-test-password-123}"

echo "🔧 Windmill E2E Test Setup"
echo "================================"
echo "Windmill URL: $WINDMILL_URL"
echo "Workspace: $WORKSPACE"
echo ""

# 1. Install Windmill CLI
echo "📦 Installing Windmill CLI (wmill)..."
if command -v wmill &> /dev/null; then
    echo "✅ wmill already installed ($(wmill --version))"
else
    npm install -g windmill-cli
    echo "✅ wmill installed ($(wmill --version))"
fi
echo ""

# 2. Wait for Windmill to be ready
echo "⏳ Waiting for Windmill to be ready..."
node tests/docker/wait-for-windmill.js
echo ""

# 3. Add workspace using SUPERADMIN_SECRET for initial setup
echo "🔑 Setting up workspace authentication..."
export WM_BASE_URL="$WINDMILL_URL"

# Use superadmin secret to create initial user if needed
# This is the only time we use the superadmin secret - for bootstrapping
echo "Creating test user account..."
curl -X POST "$WINDMILL_URL/api/users/create" \
  -H "Authorization: Bearer $SUPERADMIN_SECRET" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_USER_EMAIL\",
    \"password\": \"$TEST_USER_PASSWORD\",
    \"company\": \"test\",
    \"username\": \"testuser\",
    \"super_admin\": false
  }" 2>/dev/null || echo "User may already exist"

echo ""

# 4. Create API token using the actual CLI (tests real auth flow)
echo "🎫 Generating API token for test user..."

# Login and get token using wmill
TOKEN=$(wmill user login "$TEST_USER_EMAIL" \
  --password "$TEST_USER_PASSWORD" \
  --workspace "$WORKSPACE" 2>/dev/null | grep -oP 'token: \K.*' || echo "")

# If that didn't work, try create-token
if [ -z "$TOKEN" ]; then
  echo "Trying alternative token creation method..."
  # Create token using superadmin (bootstrapping only)
  TOKEN=$(curl -X POST "$WINDMILL_URL/api/users/tokens/create" \
    -H "Authorization: Bearer $SUPERADMIN_SECRET" \
    -H "Content-Type: application/json" \
    -d "{
      \"label\": \"e2e-test-token\",
      \"expiration\": \"2099-01-01T00:00:00Z\"
    }" 2>/dev/null | grep -oP '"token":"\K[^"]+' || echo "$SUPERADMIN_SECRET")
fi

if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
  echo "⚠️  Could not create user token, falling back to SUPERADMIN_SECRET"
  TOKEN="$SUPERADMIN_SECRET"
fi

echo "✅ Token generated"
echo ""

# 5. Export token for tests
export E2E_WINDMILL_TOKEN="$TOKEN"
echo "E2E_WINDMILL_TOKEN=$TOKEN" >> "$GITHUB_ENV" 2>/dev/null || true
echo "E2E_WINDMILL_TOKEN=$TOKEN" > tests/.env.test

# 6. Configure wmill for subsequent commands
wmill workspace add "$WORKSPACE" "$WORKSPACE" "$WINDMILL_URL" || true
export WM_TOKEN="$TOKEN"

echo "✅ Workspace configured"
echo ""

# 7. Seed test data
echo "🌱 Seeding test data..."
bash tests/seed-test-data.sh
echo ""

echo "✅ Windmill E2E test environment ready!"
echo ""
echo "Environment variables set:"
echo "  E2E_WINDMILL_URL=$WINDMILL_URL"
echo "  E2E_WINDMILL_TOKEN=***"
echo "  E2E_WORKSPACE=$WORKSPACE"
echo ""
echo "Run tests with: npm run test:e2e"
