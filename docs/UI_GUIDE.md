# UI Component Guide

**Last updated:** 2025-01-24

## Overview

MerkadAgency uses [shadcn/ui](https://ui.shadcn.com/) as the foundation, with custom components for video production workflows. All components follow the dark theme design tokens defined in [BRAND_TOKENS.md](./BRAND_TOKENS.md).

## Component Library

### shadcn/ui Components

These are pre-built Radix UI components styled with Tailwind:

| Component | Path | Usage |
|-----------|------|-------|
| **Button** | `@/components/ui/button` | Primary actions, CTAs, form submissions |
| **Card** | `@/components/ui/card` | Content containers, project cards |
| **Dialog** | `@/components/ui/dialog` | Modals, confirmations |
| **Dropdown Menu** | `@/components/ui/dropdown-menu` | Action menus, settings |
| **Input** | `@/components/ui/input` | Text fields |
| **Label** | `@/components/ui/label` | Form labels |
| **Progress** | `@/components/ui/progress` | Render progress, uploads |
| **Tabs** | `@/components/ui/tabs` | Content organization |
| **Toast** | `@/components/ui/toast` | Notifications, feedback |

### Custom Components

Built specifically for MerkadAgency:

| Component | Purpose | Status |
|-----------|---------|--------|
| **ProjectCard** | Display project with status, metadata | ✅ Implemented |
| **SceneCard** | Individual scene in storyboard | ✅ Implemented |
| **AssetBin** | Asset library with drag-and-drop | 📋 Planned (0.2) |
| **Timeline** | Visual timeline editor | 📋 Planned (0.3) |
| **RenderProgress** | Real-time render status | ✅ Implemented |
| **BrandKitSelector** | Choose brand theme | 📋 Planned (0.3) |

## Component Usage

### Button

```tsx
import { Button } from '@/components/ui/button';

// Primary
<Button>Generate Video</Button>

// Secondary
<Button variant="secondary">Cancel</Button>

// Outline
<Button variant="outline">Learn More</Button>

// Ghost
<Button variant="ghost">Settings</Button>

// With Icon
<Button>
  <Video className="w-4 h-4 mr-2" />
  Create Project
</Button>

// Loading State
<Button disabled>
  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
  Rendering...
</Button>
```

**Variants**: default, secondary, outline, ghost, destructive, link
**Sizes**: default, sm, lg, icon

### Card

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Smartwatch Ad</CardTitle>
    <CardDescription>Created 2 hours ago</CardDescription>
  </CardHeader>
  <CardContent>
    <p>6 scenes • 15 seconds • 9:16</p>
  </CardContent>
  <CardFooter>
    <Button>Open Project</Button>
  </CardFooter>
</Card>
```

### Progress

```tsx
import { Progress } from '@/components/ui/progress';

<Progress value={65} className="w-full" />

// With label
<div className="space-y-2">
  <div className="flex justify-between text-sm">
    <span>Rendering...</span>
    <span>65%</span>
  </div>
  <Progress value={65} />
</div>
```

### Tabs

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

<Tabs defaultValue="storyboard">
  <TabsList>
    <TabsTrigger value="storyboard">Storyboard</TabsTrigger>
    <TabsTrigger value="assets">Assets</TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
  </TabsList>
  <TabsContent value="storyboard">
    {/* Storyboard content */}
  </TabsContent>
  <TabsContent value="assets">
    {/* Assets content */}
  </TabsContent>
  <TabsContent value="settings">
    {/* Settings content */}
  </TabsContent>
</Tabs>
```

### Dialog (Modal)

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

<Dialog>
  <DialogTrigger asChild>
    <Button>Delete Project</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogDescription>
        This action cannot be undone. This will permanently delete your project.
      </DialogDescription>
    </DialogHeader>
    <div className="flex gap-2 justify-end mt-4">
      <Button variant="outline">Cancel</Button>
      <Button variant="destructive">Delete</Button>
    </div>
  </DialogContent>
</Dialog>
```

## Layout Patterns

### Page Layout

```tsx
export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-ink p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button>New Project</Button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Cards */}
        </div>
      </div>
    </div>
  );
}
```

### Two-Column Layout

```tsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  {/* Main content (2/3) */}
  <div className="lg:col-span-2">
    <Card>
      {/* Storyboard */}
    </Card>
  </div>

  {/* Sidebar (1/3) */}
  <div className="space-y-6">
    <Card>
      {/* Actions */}
    </Card>
    <Card>
      {/* Downloads */}
    </Card>
  </div>
</div>
```

## Motion Patterns

### Framer Motion Examples

```tsx
import { motion } from 'framer-motion';

// Fade in
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>

// Slide up
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>

// Stagger children
<motion.div variants={container}>
  {items.map((item, i) => (
    <motion.div key={i} variants={itemVariants}>
      {item}
    </motion.div>
  ))}
</motion.div>

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};
```

## Responsive Design

### Breakpoints

```css
/* Tailwind breakpoints */
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

### Mobile-First Example

```tsx
<div className="
  px-4 sm:px-6 lg:px-8
  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
  gap-4 lg:gap-6
">
  {/* Content */}
</div>
```

## Accessibility Checklist

### Interactive Elements

- [ ] All buttons have descriptive text or `aria-label`
- [ ] Focus states are visible (`:focus-visible`)
- [ ] Minimum tap target: 44×44px
- [ ] Keyboard navigation works (Tab, Enter, Esc)

### Forms

- [ ] Labels associated with inputs (`<Label htmlFor="">`)
- [ ] Error messages are programmatically linked (`aria-describedby`)
- [ ] Required fields marked (`required` attribute)
- [ ] Form validation provides clear feedback

### Content

- [ ] Headings follow logical hierarchy (h1 → h2 → h3)
- [ ] Images have alt text
- [ ] Color is not the only indicator (use icons + text)
- [ ] Contrast ratios meet WCAG AA (see BRAND_TOKENS.md)

### Modals & Overlays

- [ ] Focus trapped within modal
- [ ] Esc key closes modal
- [ ] Focus returns to trigger element on close
- [ ] `aria-modal="true"` and proper labeling

## Dark Mode Considerations

### Contrast & Readability

- Use **Ink** (#0F1115) instead of pure black
- Elevate surfaces with lighter backgrounds (gray-800, gray-700)
- Reduce opacity for disabled states (opacity-50)
- Test in low-light environments

### Color Adjustments

- Desaturate colors slightly for dark backgrounds
- Use glow effects sparingly (only for emphasis)
- Avoid pure white (#FFFFFF) for large text blocks (use gray-100 or gray-200)

## Icon Usage

### Lucide React Icons

```tsx
import { Video, Upload, Download, Play, Settings } from 'lucide-react';

<Button>
  <Video className="w-4 h-4 mr-2" />
  Create Video
</Button>
```

### Icon Guidelines

- **Size**: Use `w-4 h-4` (16px) for inline icons, `w-5 h-5` (20px) for emphasized
- **Spacing**: `mr-2` or `ml-2` for button icons
- **Color**: Inherit from parent or use `text-gray`, `text-violet`, `text-teal`

## Loading States

### Skeleton Loaders

```tsx
function ProjectCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="h-6 bg-gray-700 rounded animate-pulse w-3/4" />
        <div className="h-4 bg-gray-700 rounded animate-pulse w-1/2 mt-2" />
      </CardHeader>
      <CardContent>
        <div className="h-4 bg-gray-700 rounded animate-pulse w-full" />
      </CardContent>
    </Card>
  );
}
```

### Spinner

```tsx
import { Loader2 } from 'lucide-react';

<Loader2 className="w-6 h-6 animate-spin text-violet" />
```

## Error States

### Inline Errors

```tsx
<div className="space-y-2">
  <Input
    type="text"
    className={error ? 'border-red-500' : ''}
    aria-invalid={!!error}
    aria-describedby="error-message"
  />
  {error && (
    <p id="error-message" className="text-sm text-red-500">
      {error}
    </p>
  )}
</div>
```

### Empty States

```tsx
<Card>
  <CardContent className="py-12 text-center">
    <Video className="w-16 h-16 mx-auto mb-4 text-gray" />
    <h2 className="text-xl font-semibold mb-2">No projects yet</h2>
    <p className="text-gray mb-4">Create your first AI-powered video project</p>
    <Button>Create Project</Button>
  </CardContent>
</Card>
```

---

**Next**: See [INFORMATION_ARCHITECTURE.md](./INFORMATION_ARCHITECTURE.md) for site structure and navigation patterns.
