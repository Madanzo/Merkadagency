# Operations Runbook

**Last updated:** 2025-01-24

## Local Development

### Start Services

```bash
# 1. Infrastructure
docker-compose up -d

# 2. Database
pnpm db:push

# 3. All services
pnpm dev
```

### Stop Services

```bash
# Stop dev servers: Ctrl+C

# Stop Docker
docker-compose down
```

### Reset Database

```bash
docker-compose down -v
docker-compose up -d
pnpm db:push
pnpm seed  # Optional: add sample data
```

## Monitoring

### Check Service Health

```bash
# API
curl http://localhost:3001/health

# Web
curl http://localhost:3000

# Redis
docker-compose exec redis redis-cli ping

# Postgres
docker-compose exec postgres pg_isready
```

### View Logs

```bash
# Docker services
docker-compose logs -f

# Specific service
docker-compose logs -f postgres

# Workers (pnpm dev terminal)
# Look for [WorkerName] prefix
```

## Queue Inspection

### Redis CLI

```bash
docker-compose exec redis redis-cli

# List all keys
KEYS bull:*

# Queue depth
LLEN bull:editor-queue:wait

# Failed jobs
LRANGE bull:editor-queue:failed 0 -1
```

### BullBoard (Future)

UI for queue management:
```
http://localhost:3001/admin/queues
```

## Common Issues

### Issue: Render fails with FFmpeg error

**Symptoms**: Editor job fails, logs show FFmpeg command error

**Diagnosis**:
```bash
# Check FFmpeg installed
ffmpeg -version

# Check file paths in logs
```

**Fix**:
```bash
# Install FFmpeg
brew install ffmpeg  # macOS
sudo apt install ffmpeg  # Linux
```

### Issue: Worker not processing jobs

**Symptoms**: Jobs stuck in "queued" state

**Diagnosis**:
```bash
# Check worker process running
ps aux | grep worker

# Check Redis connection
docker-compose exec redis redis-cli ping
```

**Fix**:
```bash
# Restart workers
# Ctrl+C on pnpm dev, then restart
pnpm dev
```

### Issue: Database connection error

**Symptoms**: API returns 500, logs show Prisma error

**Diagnosis**:
```bash
# Check Postgres running
docker-compose ps postgres
```

**Fix**:
```bash
# Restart Postgres
docker-compose restart postgres

# Or full reset
docker-compose down -v
docker-compose up -d
pnpm db:push
```

### Issue: S3 upload fails

**Symptoms**: Asset upload returns error, logs show MinIO connection failed

**Diagnosis**:
```bash
# Check MinIO running
docker-compose ps minio

# Check bucket exists
docker-compose exec minio mc ls myminio
```

**Fix**:
```bash
# Restart MinIO
docker-compose restart minio

# Re-initialize bucket
docker-compose up minio-init
```

## Performance Tuning

### FFmpeg Rendering

```bash
# Use faster preset (lower quality)
FFMPEG_PRESET=ultrafast

# Reduce resolution for testing
TEST_RESOLUTION=720x1280
```

### Worker Concurrency

```typescript
// packages/workers/src/index.ts
new Worker(QUEUE_NAMES.EDITOR, handler, {
  connection,
  concurrency: 2, // Increase for parallel processing
});
```

### Database Queries

```bash
# Prisma query logging
DATABASE_URL="...?logging=true"
```

---

**See [TEST_STRATEGY.md](./TEST_STRATEGY.md) for testing procedures.**
