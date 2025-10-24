# Information Architecture

**Last updated:** 2025-01-24

## Site Map

```
/
├── /                           # Homepage (marketing)
├── /dashboard                  # User dashboard (project list)
├── /projects
│   ├── /projects/new           # Create new project
│   └── /projects/[id]          # Project canvas (edit/render)
│       ├── ?tab=storyboard     # Storyboard view
│       ├── ?tab=assets         # Asset library
│       └── ?tab=settings       # Project settings
├── /render-queue               # View all render jobs (future)
├── /settings                   # User settings
│   ├── /settings/profile       # Profile settings
│   ├── /settings/brand-kits    # Brand kits (future)
│   └── /settings/billing       # Billing (future)
└── /api                        # API endpoints
    ├── /api/health             # Health check
    ├── /api/projects           # Projects CRUD
    ├── /api/projects/:id/...   # Project operations
    └── /api/jobs/:id           # Job status
```

## Content Model

### Project

| Field | Type | Description | Required | Default |
|-------|------|-------------|----------|---------|
| `id` | UUID | Unique identifier | Auto | - |
| `title` | String | Project name | Yes | - |
| `brief` | Text | Product description | Yes | - |
| `status` | Enum | Project status | Auto | draft |
| `ratio` | Enum | Video aspect ratio | Yes | 9:16 |
| `brandTheme` | JSON | Brand colors/fonts | Auto | Default theme |
| `createdAt` | DateTime | Creation timestamp | Auto | Now |
| `updatedAt` | DateTime | Last update | Auto | Now |

**Status Values**: draft, storyboard_generated, assets_uploaded, vo_generated, music_selected, rendering, completed, failed

**Ratio Values**: 9:16 (vertical), 16:9 (horizontal), 1:1 (square)

### Scene

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Unique identifier |
| `projectId` | UUID | Parent project |
| `index` | Integer | Scene order (0-based) |
| `durationMs` | Integer | Duration in milliseconds |
| `imageAssetId` | UUID | Linked image |
| `overlayText` | String | Text overlay |
| `voSegmentId` | UUID | Linked voiceover |

### Asset

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Unique identifier |
| `projectId` | UUID | Parent project |
| `kind` | Enum | Asset type |
| `url` | String | S3 URL |
| `thumbnailUrl` | String | Preview URL (optional) |
| `meta` | JSON | Width, height, duration, etc. |

**Asset Kinds**: image, video, audio, logo

### VoSegment

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Unique identifier |
| `projectId` | UUID | Parent project |
| `sceneId` | UUID | Linked scene (optional) |
| `text` | String | Script text |
| `audioUrl` | String | TTS audio file |
| `durationMs` | Integer | Audio duration |
| `timestamps` | JSON | Word-level timings (future) |

### RenderJob

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Unique identifier |
| `projectId` | UUID | Parent project |
| `status` | Enum | Job status |
| `artifacts` | JSON | Output URLs (MP4, FCPXML, EDL) |
| `logs` | Array | Processing logs |
| `error` | String | Error message (if failed) |
| `createdAt` | DateTime | Job creation time |
| `completedAt` | DateTime | Completion time |

**Status Values**: queued, processing, completed, failed

## Navigation Patterns

### Primary Navigation

**Dashboard** → **Projects** → **Settings**

### Project Canvas Layout

```
┌─────────────────────────────────────────────────────┐
│ Header: Project Title | Status | Actions             │
├──────────────┬──────────────────────────┬───────────┤
│              │                          │           │
│ Asset Bin    │   Storyboard / Preview   │  Panels   │
│ (Future)     │   (Main Content Area)    │  - Actions│
│              │                          │  - VO     │
│              │                          │  - Music  │
│              │                          │  - Render │
└──────────────┴──────────────────────────┴───────────┘
```

**Current (MVP 0.1)**:
- Left sidebar: Future (Asset Bin)
- Center: Storyboard list
- Right sidebar: Action panels

**Future (0.2+)**:
- Left: Asset library with drag-and-drop
- Center: Timeline editor with preview
- Right: Properties and settings

### Breadcrumbs

```
Dashboard > Projects > Smartwatch Ad
```

## User Flows

### Create New Project

```
1. User clicks "New Project" on Dashboard
2. Modal/Page shows:
   - Title input (required)
   - Brief textarea (required)
   - Ratio selector (9:16, 16:9, 1:1)
3. User submits
4. System creates project
5. Director worker generates storyboard (background)
6. User redirected to Project Canvas
7. Loading state shows "Generating storyboard..."
8. Storyboard appears when complete
```

### Edit and Render

```
1. User on Project Canvas
2. Reviews auto-generated storyboard
3. (Future) Uploads custom images
4. Clicks "Generate VO" → Wait for completion
5. Clicks "Select Music" → Wait for completion
6. Clicks "Render Video"
7. Render progress updates in real-time
8. Download buttons appear when complete
```

### Download Artifacts

```
1. Render job completes
2. "Downloads" card appears with:
   - Download MP4 (button)
   - Download FCPXML (button)
   - Download EDL (button, optional)
3. Clicks download → Opens file in new tab or downloads
```

## Search & Filtering (Future)

### Project List

**Filters**:
- Status (all, draft, completed, failed)
- Date range (last 7 days, 30 days, all time)
- Ratio (9:16, 16:9, 1:1)

**Sort**:
- Created date (newest first, oldest first)
- Last modified
- Alphabetical

**Search**:
- By project title
- By brief keywords

### Asset Library (Future)

**Filters**:
- Type (images, videos, audio, logos)
- Upload date
- Dimensions

**Tags**:
- User-defined tags
- Auto-tags (e.g., "product", "lifestyle")

## Error Pages

### 404 Not Found

```tsx
<div className="min-h-screen flex items-center justify-center bg-ink">
  <div className="text-center">
    <h1 className="text-6xl font-bold text-violet mb-4">404</h1>
    <p className="text-xl text-gray mb-6">Page not found</p>
    <Button onClick={() => router.push('/dashboard')}>
      Back to Dashboard
    </Button>
  </div>
</div>
```

### 500 Server Error

Similar layout, with:
- "500" heading
- "Something went wrong" message
- "Try again" button + "Report issue" link

### Permission Denied

- "403" heading
- "You don't have access to this project"
- "Back to Dashboard" button

## Content Hierarchy

### Heading Levels

```
h1: Page title (e.g., "Dashboard", "Project: Smartwatch Ad")
h2: Section titles (e.g., "Storyboard", "Renders")
h3: Subsections (e.g., "Scene 1", "Downloads")
h4: Component titles (e.g., "Asset Details")
```

### Information Priority

**High priority** (always visible):
- Project status
- Primary actions (Generate VO, Render)
- Error messages

**Medium priority** (visible but secondary):
- Scene details
- Asset metadata
- Render logs

**Low priority** (collapsed or hidden):
- Timestamps
- Technical details (job IDs)
- Advanced settings

---

**Next**: See [API_CONTRACT.md](./API_CONTRACT.md) for detailed API specifications.
