# API Contract

**Last updated:** 2025-01-24

## Base URL

**Local Development**: `http://localhost:3001`
**Production**: `https://api.merkadagency.com` (future)

## Authentication

**MVP 0.1**: None (single-tenant)
**0.2+**: Bearer token via Authorization header

```http
Authorization: Bearer <token>
```

## Common Response Format

### Success Response

```json
{
  "data": { ...resource },
  "meta": {
    "timestamp": "2025-01-24T10:30:00Z"
  }
}
```

### Error Response

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Brief must be at least 10 characters",
    "details": {
      "field": "brief",
      "constraint": "minLength"
    }
  }
}
```

## Endpoints

### Health Check

#### GET /health

Returns API health status.

**Response**: `200 OK`
```json
{
  "status": "ok",
  "timestamp": "2025-01-24T10:30:00Z"
}
```

---

### Projects

#### POST /api/projects

Create a new project from brief.

**Request Body**:
```json
{
  "title": "Smartwatch Ad",
  "brief": "Showcase our revolutionary smartwatch with focus on health tracking features",
  "ratio": "9:16",
  "brandTheme": {
    "ink": "#0F1115",
    "violet": "#5A27FF",
    "teal": "#16B8A6"
  }
}
```

**Response**: `201 Created`
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Smartwatch Ad",
  "status": "draft",
  "ratio": "9:16",
  "brandTheme": { ...},
  "createdAt": "2025-01-24T10:30:00Z"
}
```

**Errors**:
- `400`: Invalid input (title/brief missing or too short)
- `500`: Server error

---

#### GET /api/projects

List all projects.

**Query Parameters**:
- `status` (optional): Filter by status
- `limit` (optional): Max results (default: 50)
- `offset` (optional): Pagination offset

**Response**: `200 OK`
```json
[
  {
    "id": "uuid",
    "title": "Smartwatch Ad",
    "status": "completed",
    "createdAt": "2025-01-24T10:30:00Z",
    "_count": {
      "scenes": 6,
      "assets": 8
    }
  }
]
```

---

#### GET /api/projects/:id

Get project details with all related data.

**Response**: `200 OK`
```json
{
  "id": "uuid",
  "title": "Smartwatch Ad",
  "brief": "...",
  "status": "completed",
  "ratio": "9:16",
  "brandTheme": { ...},
  "scenes": [
    {
      "id": "uuid",
      "index": 0,
      "durationMs": 2500,
      "overlayText": "Introducing Innovation",
      "imageAsset": {
        "id": "uuid",
        "url": "https://s3.../image.png"
      },
      "voSegment": {
        "id": "uuid",
        "text": "Discover the future...",
        "audioUrl": "https://s3.../voice.mp3"
      }
    }
  ],
  "musicAsset": {
    "id": "uuid",
    "url": "https://s3.../music.mp3",
    "meta": {
      "title": "Upbeat Corporate",
      "mood": "energetic"
    }
  },
  "renderJobs": [
    {
      "id": "uuid",
      "status": "completed",
      "artifacts": {
        "mp4Url": "https://s3.../final.mp4",
        "fcpxmlUrl": "https://s3.../timeline.fcpxml"
      },
      "createdAt": "2025-01-24T10:35:00Z",
      "completedAt": "2025-01-24T10:40:00Z"
    }
  ]
}
```

**Errors**:
- `404`: Project not found

---

### Assets

#### POST /api/projects/:id/assets/upload-url

Get presigned S3 URL for asset upload.

**Request Body**:
```json
{
  "fileName": "product-shot.png",
  "fileType": "image/png",
  "assetKind": "image"
}
```

**Response**: `200 OK`
```json
{
  "uploadUrl": "https://s3.../presigned-url",
  "assetId": "uuid",
  "publicUrl": "https://s3.../product-shot.png"
}
```

**Upload Flow**:
1. Client gets `uploadUrl` from this endpoint
2. Client PUTs file directly to S3 using `uploadUrl`
3. Asset is now accessible at `publicUrl`

**Errors**:
- `404`: Project not found
- `400`: Invalid file type

---

#### GET /api/projects/:id/assets

List project assets.

**Response**: `200 OK`
```json
[
  {
    "id": "uuid",
    "kind": "image",
    "url": "https://s3.../image.png",
    "meta": {
      "width": 1080,
      "height": 1920,
      "originalName": "product-shot.png"
    },
    "createdAt": "2025-01-24T10:32:00Z"
  }
]
```

---

### Voiceover

#### POST /api/projects/:id/generate-vo

Generate voiceover for project scenes.

**Request Body**:
```json
{
  "useMock": true
}
```

**Response**: `200 OK`
```json
{
  "message": "VO generation enqueued",
  "jobId": "bullmq-job-id"
}
```

**Notes**:
- Requires `status === 'storyboard_generated'`
- Creates VoSegments for each scene
- Job processed asynchronously by ScriptVO worker

**Errors**:
- `404`: Project not found
- `400`: No scenes found (storyboard not generated)

---

### Music

#### POST /api/projects/:id/select-music

Select background music for project.

**Request Body**:
```json
{
  "mood": "energetic",
  "useMock": true
}
```

**Response**: `200 OK`
```json
{
  "message": "Music selection enqueued",
  "jobId": "bullmq-job-id"
}
```

**Notes**:
- Optional `mood` parameter (energetic, calm, inspiring, modern)
- Job processed by Music worker

---

### Rendering

#### POST /api/projects/:id/render

Start video render.

**Request Body**:
```json
{
  "exportFcpxml": true,
  "exportEdl": false
}
```

**Response**: `200 OK`
```json
{
  "message": "Render enqueued",
  "renderJobId": "uuid"
}
```

**Notes**:
- Creates RenderJob with status "queued"
- Editor worker processes job
- Use `/api/jobs/:id` to poll for status

**Errors**:
- `404`: Project not found
- `400`: No scenes found

---

### Jobs

#### GET /api/jobs/:id

Get render job status and artifacts.

**Response**: `200 OK`
```json
{
  "id": "uuid",
  "projectId": "uuid",
  "status": "completed",
  "artifacts": {
    "mp4Url": "https://s3.../final.mp4",
    "fcpxmlUrl": "https://s3.../timeline.fcpxml",
    "edlUrl": null
  },
  "logs": [
    "Starting render process...",
    "Prepared scene 1/6",
    "Video rendered successfully"
  ],
  "error": null,
  "createdAt": "2025-01-24T10:35:00Z",
  "completedAt": "2025-01-24T10:40:00Z"
}
```

**Polling**:
- Poll this endpoint every 2-5 seconds while `status === 'processing'`
- Stop polling when `status === 'completed'` or `'failed'`

**Errors**:
- `404`: Job not found

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid request body |
| `NOT_FOUND` | 404 | Resource not found |
| `UNAUTHORIZED` | 401 | Missing or invalid auth token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `CONFLICT` | 409 | Resource state conflict |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |
| `SERVICE_UNAVAILABLE` | 503 | Temporary outage |

## Idempotency

**Future**: Idempotency keys for POST requests

```http
Idempotency-Key: <uuid>
```

Retrying a request with the same key returns the original response.

## Rate Limiting

**MVP 0.1**: None
**Future**: 100 requests/minute per user

Response headers:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1611331200
```

## Versioning

**Current**: No versioning (MVP)
**Future**: URL-based versioning (`/api/v1/projects`)

---

**Next**: See [JOB_FLOW.md](./JOB_FLOW.md) for queue topology and job processing details.
