# Color Palette Documentation

## New Vibrant Color System

We've updated the application's color palette to be more modern, vibrant, and colorful while maintaining accessibility standards.

## Primary Colors

| Color Name | HSL Value | Usage |
|------------|-----------|-------|
| Primary | `262.1 83.3% 57.8%` | Main brand color (vibrant purple) |
| Secondary | `197 96% 53%` | Supporting color (bright blue) |
| Accent | `32 95% 57%` | Highlight color (vibrant orange) |

## Status Colors

| Color Name | HSL Value | Usage |
|------------|-----------|-------|
| Success | `142 76% 36%` | Success states and positive actions |
| Warning | `45 93% 47%` | Warning states and cautionary information |
| Info | `197 96% 53%` | Informational messages and neutral actions |
| Destructive | `0 84.2% 60.2%` | Error states and destructive actions |

## Gradients

We've introduced several gradient classes for enhanced visual appeal:

- `.bg-gradient-primary` - Gradient from primary to accent
- `.bg-gradient-secondary` - Gradient from secondary to info
- `.bg-gradient-success` - Gradient from success to accent

## Button Variants

New colorful button variants:
- `colorfulPrimary` - Gradient button with primary colors
- `colorfulSecondary` - Gradient button with secondary colors

## Implementation

The new color system is implemented through CSS variables in `globals.css` and extended in `tailwind.config.ts`.

## Usage Examples

```tsx
// Using new button variants
<Button variant="colorfulPrimary">Primary Gradient Button</Button>
<Button variant="colorfulSecondary">Secondary Gradient Button</Button>

// Using gradient backgrounds
<div className="bg-gradient-primary text-white p-4 rounded-lg">
  Content with gradient background
</div>

// Using new status colors
<div className="text-success">Success message</div>
<div className="text-warning">Warning message</div>
<div className="text-info">Info message</div>
```