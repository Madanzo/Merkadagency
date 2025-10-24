# Licensing & Rights Management

**Last updated:** 2025-01-24

## Content Policy

### Prohibited Content

❌ **Never allow**:
- YouTube-to-MP3 downloads or unauthorized content ripping
- Copyrighted media without license
- Voice cloning without explicit permission

### Approved Sources

✅ **Allowed**:
- User-uploaded content (user owns rights)
- Licensed stock media (Epidemic Sound, Artlist, Pexels, Unsplash)
- AI-generated content (with proper attribution)

## Music Licensing

### Track Licenses

```typescript
interface MusicLicense {
  trackId: string;
  provider: 'epidemic' | 'artlist' | 'user';
  licenseType: 'commercial' | 'personal';
  expirationDate?: Date;
  attribution?: string;
}
```

### License Tracking

- Store license metadata with Asset
- Warn users before license expiration
- Block renders with expired licenses (future)

## Voice Cloning

### Permission Model

```typescript
interface VoicePermission {
  voiceId: string;
  ownerId: string;
  consentDate: Date;
  allowedUses: string[];
}
```

- Require explicit consent for voice cloning
- Document consent in database
- Revoke access on request

## Image Licensing

### Stock Photos

- Track source (Unsplash, Pexels, etc.)
- Store attribution in Asset metadata
- Display attribution in exports (if required)

### AI-Generated Images

- Clearly label AI-generated content
- Track model and prompt used
- Comply with model's terms of service

## Compliance Dashboard (Future)

```
┌────────────────────────────────────┐
│ Rights & Compliance                │
├────────────────────────────────────┤
│ Music Licenses                     │
│ ✓ 45 active licenses               │
│ ⚠ 3 expiring in 30 days           │
│                                    │
│ Voice Permissions                  │
│ ✓ All consents current             │
│                                    │
│ Image Attribution                  │
│ ✓ All sources documented           │
└────────────────────────────────────┘
```

---

**See [CONTRIBUTING.md](./CONTRIBUTING.md) for development practices.**
