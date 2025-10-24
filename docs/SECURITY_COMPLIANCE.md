# Security & Compliance

**Last updated:** 2025-01-24

## Secrets Management

### Environment Variables

- Store in `.env` (local)
- Use secret manager in production (AWS Secrets Manager, Doppler)
- Never commit `.env` to git

### API Keys

```bash
# Rotate keys quarterly
ELEVENLABS_API_KEY=...
STABILITY_API_KEY=...
```

## PII Treatment

**MVP 0.1**: No PII collected (no auth)

**0.2+**:
- Email addresses encrypted at rest
- User data isolated by tenant
- GDPR compliance: data export/deletion

## Access Control

### Project Access

```sql
-- Future: Row-level security
CREATE POLICY project_access ON projects
  FOR ALL USING (user_id = current_user_id());
```

### Storage

- **S3 buckets**: Private by default, presigned URLs for uploads
- **Public URLs**: Only for rendered assets
- **Expiration**: Presigned URLs expire in 1 hour

## Audit Logs

**Future**:

```json
{
  "timestamp": "2025-01-24T10:35:00Z",
  "userId": "uuid",
  "action": "project.render",
  "resourceId": "project-uuid",
  "ip": "192.168.1.1",
  "userAgent": "..."
}
```

## Security Checklist

- [ ] All endpoints validate input (Zod schemas)
- [ ] SQL injection prevented (Prisma ORM)
- [ ] XSS prevented (React escapes by default)
- [ ] CSRF tokens (future, with auth)
- [ ] Rate limiting (future)
- [ ] HTTPS only (production)

---

**See [LICENSING_AND_RIGHTS.md](./LICENSING_AND_RIGHTS.md) for content licensing policies.**
