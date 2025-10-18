# Theme System Documentation

## Overview

This application uses [next-themes](https://github.com/pacocoursey/next-themes) for theme management, providing a seamless dark mode experience with system preference detection.

## Implementation

### Theme Provider Setup

The theme provider is configured in [main.tsx](file:///c%3A/Users/Admin/dyad-apps/Sydions-learning-web/src/main.tsx):

```tsx
<ThemeProvider defaultTheme="system" enableSystem>
  <App />
</ThemeProvider>
```

This configuration enables:
- System preference detection by default
- Manual theme switching
- Persistence of user preference

### Theme Variables

The application uses CSS variables defined in [globals.css](file:///c%3A/Users/Admin/dyad-apps/Sydions-learning-web/src/globals.css) for both light and dark modes:

#### Light Mode (`:root`)
- `--background`: White background
- `--foreground`: Dark text
- `--primary`: Professional blue
- `--secondary`: Light gray
- And other UI color variables

#### Dark Mode (`.dark`)
- `--background`: Dark background
- `--foreground`: Light text
- `--primary`: Professional blue (adjusted for dark mode)
- `--secondary`: Dark gray
- And other UI color variables

### Theme Components

#### ThemeSwitcher
Located at [src/components/ThemeSwitcher.tsx](file:///c%3A/Users/Admin/dyad-apps/Sydions-learning-web/src/components/ThemeSwitcher.tsx), this component provides a dropdown menu with three options:
1. Light mode
2. Dark mode
3. System preference

#### ThemeToggle
Located at [src/components/ThemeToggle.tsx](file:///c%3A/Users/Admin/dyad-apps/Sydions-learning-web/src/components/ThemeToggle.tsx), this is a simplified wrapper that uses ThemeSwitcher.

### Usage

To use the theme in components:

```tsx
import { useTheme } from "next-themes";

const MyComponent = () => {
  const { theme, setTheme } = useTheme();
  
  return (
    <div className="bg-background text-foreground">
      <p>Current theme: {theme}</p>
      <button onClick={() => setTheme("dark")}>Switch to dark</button>
    </div>
  );
};
```

### Adding Theme-Specific Styles

To add theme-specific styles, use Tailwind's dark mode variant:

```tsx
<div className="bg-white dark:bg-gray-900 text-black dark:text-white">
  Content that changes based on theme
</div>
```

### Customizing Themes

To customize the color palette:
1. Update the CSS variables in [globals.css](file:///c%3A/Users/Admin/dyad-apps/Sydions-learning-web/src/globals.css)
2. The changes will automatically apply to all components using Tailwind's `bg-background`, `text-foreground`, etc.

## Testing

To test the theme system:
1. Click the theme switcher in the top-right corner
2. Select different theme options
3. Verify that the UI updates correctly
4. Check that the preference persists after page refresh