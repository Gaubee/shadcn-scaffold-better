# Scaffold UI

A Flutter-inspired scaffold component library for React, built with Next.js 15, Tailwind CSS v4, and shadcn/ui principles.

## Features

- 🎨 **Flutter-Inspired Design** - Familiar patterns from Flutter's Scaffold widget
- 📱 **Fully Responsive** - Automatic adaptation for Mobile, Tablet, and Desktop
- 🌊 **Scroll-Driven Animations** - Modern scroll-responsive UI effects
- 🎭 **SSR Compatible** - Full Next.js server-side rendering support
- 🎯 **TypeScript First** - Complete type safety
- 🎨 **Tailwind CSS v4** - Latest CSS features and optimizations
- ♿ **Accessible** - ARIA-compliant components
- 🔧 **Customizable** - Extensive configuration options

## Components

### AppBar
Responsive application bar with immersive mode, collapsible behavior, and scroll effects.

**Features:**
- Immersive mode (transparent → solid on scroll)
- Collapsible height animation
- Sticky, fixed, or static positioning
- Configurable elevation
- Leading, title, and actions slots

### Drawer
Side navigation drawer with gesture support.

**Features:**
- Left or right positioning
- Swipe-to-close gesture support
- Backdrop overlay
- Smooth animations
- Keyboard support (Escape to close)

### BottomNavigationBar
Mobile-friendly bottom navigation.

**Features:**
- Icon with optional labels
- Badge support
- Hide on scroll
- Active state indicators
- Smooth transitions

### NavigationRail
Persistent side navigation for desktop layouts.

**Features:**
- Vertical navigation bar
- Optional labels
- Header and footer slots
- Badge support
- Indicator animations

### FloatingActionButton (FAB)
Prominent action button with extended variant.

**Features:**
- Multiple sizes (small, medium, large)
- Extended mode with label
- Configurable positioning
- Hide on scroll
- Elevation levels

### Snackbar
Brief messages with optional actions.

**Features:**
- Multiple severities (default, success, warning, error, info)
- Auto-hide duration
- Action button support
- Multiple positioning options
- Hook-based API (`useSnackbar`)

### Modal
Full-featured dialog/modal component.

**Features:**
- Multiple sizes
- Optional backdrop click to close
- Keyboard support (Escape to close)
- Header with title and description
- Smooth animations

### Scaffold
Main layout component that integrates everything.

**Features:**
- Automatic responsive behavior
- Drawer ↔ NavigationRail switching
- Configurable breakpoints
- Content area management
- SSR compatible

## Installation

### Using shadcn/ui CLI (Recommended)

```bash
npx shadcn-ui@latest add scaffold
```

### Manual Installation

1. Copy the components from `src/components/scaffold/` to your project
2. Copy `src/lib/utils.ts` if you don't have it
3. Install dependencies:

```bash
npm install clsx tailwind-merge class-variance-authority lucide-react
```

## Usage

### Basic Example

```tsx
import {
  Scaffold,
  AppBar,
  Drawer,
  BottomNavigationBar,
  FloatingActionButton,
} from '@/components/scaffold';
import { Menu, Home, Search, Bell, Plus } from 'lucide-react';

export default function Page() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('home');

  return (
    <Scaffold
      appBar={
        <AppBar
          leading={
            <button onClick={() => setDrawerOpen(true)}>
              <Menu size={24} />
            </button>
          }
          title={<h1>My App</h1>}
        />
      }
      drawer={
        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          {/* Drawer content */}
        </Drawer>
      }
      bottomNavigationBar={
        <BottomNavigationBar
          items={[
            { key: 'home', icon: <Home />, label: 'Home' },
            { key: 'search', icon: <Search />, label: 'Search' },
            { key: 'notifications', icon: <Bell />, label: 'Notifications' },
          ]}
          value={selectedTab}
          onValueChange={setSelectedTab}
        />
      }
      floatingActionButton={
        <FloatingActionButton icon={<Plus />} />
      }
    >
      {/* Your page content */}
    </Scaffold>
  );
}
```

### Immersive AppBar

```tsx
<AppBar
  immersive
  collapsible
  expandedHeight={80}
  collapsedHeight={56}
  title={<h1>My App</h1>}
/>
```

### Responsive Layout

```tsx
<Scaffold
  responsive
  responsiveBreakpoint={768}
  drawer={<Drawer ... />}
  navigationRail={<NavigationRail ... />}
>
  {/* Content automatically adjusts based on screen size */}
</Scaffold>
```

### Using Snackbar

```tsx
import { Snackbar, useSnackbar } from '@/components/scaffold';

function MyComponent() {
  const snackbar = useSnackbar();

  return (
    <>
      <button onClick={() => snackbar.show('Hello!')}>
        Show Snackbar
      </button>
      <Snackbar {...snackbar.snackbarProps} />
    </>
  );
}
```

## Examples

Check out the `/examples` directory for complete demonstrations:

- **Basic** - `/examples/basic` - All components working together
- **Immersive** - `/examples/immersive` - Scroll-driven immersive AppBar
- **Responsive** - `/examples/responsive` - Responsive layout showcase

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Browser Support

- Chrome 115+ (scroll-driven animations)
- Firefox 110+
- Safari 17+
- Edge 115+

Older browsers will receive graceful fallbacks.

## Tech Stack

- **Next.js 15** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Utility-first CSS
- **shadcn/ui** - Component patterns
- **Lucide React** - Icons

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Acknowledgments

- Inspired by [Flutter's Scaffold widget](https://api.flutter.dev/flutter/material/Scaffold-class.html)
- Built following [shadcn/ui](https://ui.shadcn.com) principles
- Uses [Chrome's scroll-driven animations](https://developer.chrome.com/docs/css-ui/scroll-driven-animations)