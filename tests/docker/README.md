# Docker Setup for E2E Testing

This directory contains a minimal Docker Compose configuration for running Windmill locally for end-to-end testing.

## Overview

The setup includes:
- **Windmill Server**: Main application with embedded worker
- **PostgreSQL Database**: Required for Windmill data storage

This is a **simplified setup for testing only**. For production use, refer to the [official Windmill documentation](https://docs.windmill.dev/docs/advanced/self_host).

## Quick Start

### Prerequisites

- Docker and Docker Compose installed
- At least 2GB of free RAM
- Ports 8000 and 5432 available

### Starting Windmill

From the project root:

```bash
# Start Windmill
npm run docker:up

# View logs
npm run docker:logs

# Stop Windmill
npm run docker:down
```

Or directly with Docker Compose:

```bash
cd tests/docker
docker compose up -d
docker compose logs -f
docker compose down
```

### Waiting for Startup

Windmill takes about 30-60 seconds to fully start. Wait for:
- Database to be healthy
- Server to respond to health checks
- Initial setup to complete

Check readiness:
```bash
curl http://localhost:8000/api/version
```

## Accessing Windmill

Once started:
- **Web UI**: http://localhost:8000
- **API**: http://localhost:8000/api
- **OpenAPI Spec**: http://localhost:8000/api/openapi.json

### Default Credentials

- **Username**: `admin@windmill.dev` (or create during first access)
- **Superadmin Secret**: `test-super-secret` (for API setup)

## Testing Workflow

### 1. Start Windmill
```bash
npm run docker:up
```

### 2. Wait for Startup
```bash
# Wait for health check to pass
while ! curl -f http://localhost:8000/api/version > /dev/null 2>&1; do
  echo "Waiting for Windmill..."
  sleep 5
done
echo "Windmill is ready!"
```

### 3. Run E2E Tests
```bash
npm run test:e2e
```

### 4. Cleanup
```bash
npm run docker:down
```

## Complete E2E Test Cycle

Run everything in one command:
```bash
npm run test:e2e:full
```

This will:
1. Start Windmill
2. Wait for it to be ready
3. Run E2E tests
4. Stop Windmill

## Configuration

### Environment Variables

Set in `.env` for E2E tests:

```bash
# E2E test configuration
E2E_WINDMILL_URL=http://localhost:8000
E2E_WINDMILL_TOKEN=your-api-token
E2E_WORKSPACE=demo
```

### Getting an API Token

1. Access Windmill UI: http://localhost:8000
2. Create or log in to a user account
3. Go to User Settings → Tokens
4. Create a new token
5. Copy and add to `.env`

## Troubleshooting

### Container Won't Start

**Problem**: Port already in use

**Solution**: Check what's using port 8000:
```bash
lsof -i :8000
# or
netstat -an | grep 8000
```

Stop the conflicting service or change the port in `docker-compose.yml`.

### Database Connection Issues

**Problem**: `connection refused` to database

**Solution**: Wait longer for database to be ready:
```bash
docker compose logs windmill-db
```

### Windmill Crashes or Restarts

**Problem**: Container keeps restarting

**Solution**: Check logs:
```bash
docker compose logs windmill
```

Common issues:
- Insufficient memory (need at least 2GB)
- Database not ready (wait longer)
- Port conflicts

### Slow Performance

**Problem**: Tests are very slow

**Solution**: 
- Increase Docker Desktop memory allocation
- Use `DISABLE_NSJAIL=true` (already set)
- Reduce `NUM_WORKERS` if needed

## Data Persistence

Data is stored in Docker volumes:
- `windmill_data`: Application data
- `windmill_db_data`: Database data

### Clean Slate

To completely reset:
```bash
docker compose down -v
```

This removes all data including volumes.

## CI/CD Integration

### GitHub Actions Example

```yaml
- name: Start Windmill
  run: npm run docker:up

- name: Wait for Windmill
  run: |
    timeout 120 bash -c 'until curl -f http://localhost:8000/api/version; do sleep 5; done'

- name: Run E2E Tests
  run: npm run test:e2e

- name: Stop Windmill
  if: always()
  run: npm run docker:down
```

## Resource Usage

Typical resource consumption:
- **CPU**: 0.5-1 core
- **Memory**: 1-2GB
- **Disk**: ~500MB

## Alternative: Even Simpler Setup

For the most minimal setup, use standalone mode (single binary):

```bash
# Download Windmill binary
curl -L https://github.com/windmill-labs/windmill/releases/latest/download/windmill-linux-amd64 -o windmill

# Make executable
chmod +x windmill

# Run with embedded database
./windmill standalone
```

Access at http://localhost:8000

## Production Considerations

This setup is NOT suitable for production. For production:
- Use separate worker containers
- Configure proper secrets
- Enable TLS/SSL
- Use external PostgreSQL
- Set up proper backups
- Configure resource limits
- Enable monitoring

See [Windmill Self-Hosting Guide](https://docs.windmill.dev/docs/advanced/self_host).

## Support

- [Windmill Documentation](https://docs.windmill.dev)
- [Windmill Discord](https://discord.gg/windmill)
- [GitHub Issues](https://github.com/windmill-labs/windmill/issues)
