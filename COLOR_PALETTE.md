# Color Palette Documentation

## Professional Color System

We've updated the application's color palette to be more professional and subtle while maintaining accessibility standards.

## Primary Colors

| Color Name | HSL Value | Usage |
|------------|-----------|-------|
| Primary | `221 83% 53%` | Main brand color (professional blue) |
| Secondary | `210 20% 96%` | Supporting color (light gray) |
| Accent | `221 83% 65%` | Highlight color (softer blue) |

## Status Colors

| Color Name | HSL Value | Usage |
|------------|-----------|-------|
| Success | `142 76% 36%` | Success states and positive actions |
| Warning | `35 92% 44%` | Warning states and cautionary information |
| Info | `197 96% 53%` | Informational messages and neutral actions |
| Destructive | `0 84.2% 60.2%` | Error states and destructive actions |

## Subtle Gradients

We've introduced several subtle gradient classes for enhanced visual appeal:

- `.bg-gradient-primary` - Subtle gradient from primary to primary/0.9
- `.bg-gradient-secondary` - Subtle gradient from secondary to accent/0.1
- `.bg-gradient-success` - Subtle gradient from success to success/0.9

## Implementation

The new color system is implemented through CSS variables in `globals.css` and extended in `tailwind.config.ts`.

## Usage Examples

```tsx
// Using standard button variants
<Button variant="default">Primary Button</Button>
<Button variant="secondary">Secondary Button</Button>

// Using gradient backgrounds
<div className="bg-gradient-primary text-white p-4 rounded-lg">
  Content with subtle gradient background
</div>

// Using status colors
<div className="text-success">Success message</div>
<div className="text-warning">Warning message</div>
<div className="text-info">Info message</div>
```