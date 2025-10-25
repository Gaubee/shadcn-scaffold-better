# shadcn-scaffold

<div align="center">

[English](./README.md) • [简体中文](./README.zh-CN.md)

</div>

A Flutter-inspired scaffold component library for React, built with Next.js 15, Tailwind CSS v4, and shadcn/ui principles.

[![Tests](https://img.shields.io/badge/tests-97%20passing-brightgreen)](https://github.com/yourusername/shadcn-scaffold)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb)](https://react.dev/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8)](https://tailwindcss.com/)

## ✨ Features

- 🎨 **Flutter-Inspired Design** - Familiar patterns from Flutter's Scaffold widget
- 📱 **Fully Responsive** - Automatic adaptation for Mobile, Tablet, and Desktop
- 🌊 **Scroll-Driven Animations** - Modern CSS scroll-responsive UI effects with JS fallback
- 🎭 **SSR Compatible** - Full Next.js server-side rendering support
- 🎯 **TypeScript First** - Complete type safety with extensive documentation
- 🎨 **Tailwind CSS v4** - Latest CSS features and optimizations
- ♿ **Accessible** - ARIA-compliant components with keyboard support
- 🔧 **Customizable** - Extensive configuration options
- 🧪 **Well Tested** - 97 unit tests + 50+ E2E scenarios (100% passing)
- 🚀 **Web-Native First** - Progressive enhancement from HTML → CSS → JavaScript

## 📦 Components

### 🎯 Scaffold

Main layout component that orchestrates all parts of the application.

**Features:**

- Automatic responsive behavior (Mobile ↔ Tablet ↔ Desktop)
- Drawer ↔ NavigationRail automatic switching
- Configurable breakpoints
- CSS Grid-based layout
- SSR compatible

### 📊 AppBar

Responsive application bar with advanced scroll effects.

**Features:**

- **Immersive mode** - Transparent → solid on scroll with backdrop blur
- **Collapsible** - Height shrinks from expanded to collapsed on scroll
- **CSS Scroll-Driven Animations** - Native browser animations with JS fallback
- Sticky, fixed, or static positioning
- Configurable elevation levels (0-5)
- Leading, title, and actions slots

### 🎨 Drawer

Side navigation drawer with gesture support.

**Features:**

- Left or right positioning
- **Swipe-to-close** gesture support (touch-optimized)
- Backdrop overlay with blur effect
- Smooth animations (CSS-based)
- Keyboard support (Escape to close)
- Portal rendering

### 🧭 BottomNavigationBar

Mobile-friendly bottom navigation with Material Design patterns.

**Features:**

- Icon with optional labels (always/selected/never)
- **Badge support** - Numeric or text badges
- **Hide on scroll** - Auto-hide when scrolling down
- Active state indicators with animations
- Smooth transitions
- Up to 5 items recommended

### 📐 NavigationRail

Persistent side navigation for desktop layouts.

**Features:**

- Vertical navigation bar
- Optional labels (compact/expanded modes)
- Header and footer slots
- Badge support
- Selection indicator with animation
- Configurable width

### ➕ FloatingActionButton (FAB)

Prominent action button with extended variant.

**Features:**

- Multiple sizes (small, medium, large)
- **Extended mode** with label
- 5 positioning options (corners + bottom-center)
- **Hide on scroll** with smooth animation
- Elevation levels (0-5)
- Icon + optional label

### 📬 Snackbar

Brief messages and notifications with actions.

**Features:**

- Multiple severities (default, success, warning, error, info)
- **Auto-hide duration** (configurable)
- Action button support
- 9 positioning options
- **Hook-based API** (`useSnackbar`)
- Queue support for multiple messages

### 🪟 Modal

Full-featured dialog/modal component.

**Features:**

- Multiple sizes (sm, md, lg, xl, full)
- Optional backdrop click to close
- Keyboard support (Escape to close)
- Header with title and description
- **Body scroll lock** when open
- Smooth enter/exit animations
- Footer with ModalFooter helper

## 🚀 Installation

### Prerequisites

```bash
# Required
Node.js 18+
React 19+
Next.js 15+
Tailwind CSS v4
```

### Using shadcn/ui CLI (Recommended)

```bash
npx shadcn@latest add https://shadcn-scaffold.vercel.app/r/scaffold
```

### Manual Installation

1. **Copy components**

```bash
# Copy all scaffold components
cp -r src/components/scaffold/* your-project/components/scaffold/
```

2. **Install dependencies**

```bash
npm install clsx tailwind-merge class-variance-authority lucide-react
```

3. **Update Tailwind config**

```js
// tailwind.config.js
module.exports = {
  content: [
    "./components/scaffold/**/*.{ts,tsx}",
    // ... other paths
  ],
};
```

4. **Import global styles**

```tsx
// app/layout.tsx
import "@/components/scaffold/scaffold-animations.css";
```

## 📖 Usage

### Basic Example

```tsx
import { Scaffold, AppBar, Drawer, BottomNavigationBar, FloatingActionButton } from "@/components/scaffold";
import { Menu, Home, Search, Bell, Plus } from "lucide-react";
import { useState } from "react";

export default function Page() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("home");

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
          <nav className="p-4">
            <a href="/">Home</a>
            <a href="/about">About</a>
          </nav>
        </Drawer>
      }
      bottomNavigationBar={
        <BottomNavigationBar
          items={[
            { key: "home", icon: <Home />, label: "Home" },
            { key: "search", icon: <Search />, label: "Search" },
            {
              key: "notifications",
              icon: <Bell />,
              label: "Notifications",
              badge: 3,
            },
          ]}
          value={selectedTab}
          onValueChange={setSelectedTab}
        />
      }
      floatingActionButton={<FloatingActionButton icon={<Plus />} onClick={() => console.log("FAB clicked")} />}>
      {/* Your page content */}
      <div className="p-6">
        <h2>Welcome to shadcn-scaffold!</h2>
      </div>
    </Scaffold>
  );
}
```

### Immersive AppBar with Scroll Effects

```tsx
<AppBar
  immersive // Transparent → solid on scroll
  collapsible // Height shrinks on scroll
  expandedHeight={80}
  collapsedHeight={56}
  elevation={2}
  position="sticky"
  leading={<Menu />}
  title={<h1>My App</h1>}
  actions={
    <>
      <button>
        <Bell />
      </button>
      <button>
        <Settings />
      </button>
    </>
  }
/>
```

### Responsive Layout (Adaptive Navigation)

```tsx
<Scaffold
  responsive // Enable responsive behavior
  responsiveBreakpoint={1024} // Switch at 1024px
  // Mobile: Drawer
  drawer={
    <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
      <NavContent />
    </Drawer>
  }
  // Desktop: NavigationRail
  navigationRail={<NavigationRail items={navItems} value={selected} onValueChange={setSelected} />}
  // Mobile: BottomNavigationBar
  bottomNavigationBar={
    <BottomNavigationBar items={navItems} value={selected} onValueChange={setSelected} hideOnScroll />
  }>
  <YourContent />
</Scaffold>
```

### Using Snackbar with Hook

```tsx
import { Snackbar, useSnackbar } from "@/components/scaffold";

function MyComponent() {
  const snackbar = useSnackbar();

  const handleSave = async () => {
    try {
      await saveData();
      snackbar.show("Saved successfully!", {
        severity: "success",
        duration: 3000,
      });
    } catch (error) {
      snackbar.show("Failed to save", {
        severity: "error",
      });
    }
  };

  return (
    <>
      <button onClick={handleSave}>Save</button>
      <Snackbar {...snackbar.snackbarProps} />
    </>
  );
}
```

### Modal with Footer

```tsx
import { Modal, ModalFooter } from "@/components/scaffold";

function ConfirmDialog({ open, onOpenChange }) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Confirm Action"
      description="Are you sure you want to proceed?"
      size="md">
      <p>This action cannot be undone.</p>

      <ModalFooter>
        <button onClick={() => onOpenChange(false)}>Cancel</button>
        <button className="bg-destructive text-destructive-foreground" onClick={handleConfirm}>
          Confirm
        </button>
      </ModalFooter>
    </Modal>
  );
}
```

## 🎨 Examples

Check out the `/examples` directory for complete demonstrations:

- **📱 Basic** - [`/examples/basic`](./src/app/examples/basic/page.tsx) - All components working together
- **🌊 Immersive** - [`/examples/immersive`](./src/app/examples/immersive/page.tsx) - Scroll-driven immersive AppBar
- **📐 Responsive** - [`/examples/responsive`](./src/app/examples/responsive/page.tsx) - Responsive layout showcase
- **🎯 Dashboard** - [`/examples/dashboard`](./src/app/examples/dashboard/page.tsx) - Full application example
- **🎬 Advanced Scroll** - [`/examples/advanced-scroll`](./src/app/examples/advanced-scroll/page.tsx) - Advanced scroll animations

## 🛠️ Development

### Setup

```bash
# Clone repository
git clone https://github.com/yourusername/shadcn-scaffold.git
cd shadcn-scaffold

# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

### Available Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run start           # Start production server

# Testing
npm run test            # Run unit tests
npm run test:ui         # Run tests with UI
npm run test:coverage   # Generate coverage report
npm run test:e2e        # Run E2E tests
npm run test:e2e:ui     # Run E2E tests with UI

# Code Quality
npm run lint            # Lint code
npm run type-check      # Check TypeScript types

# Documentation
npm run storybook       # Start Storybook
npm run build-storybook # Build Storybook
```

### Project Structure

```
shadcn-scaffold/
├── src/
│   ├── components/scaffold/
│   │   ├── __tests__/              # Unit tests
│   │   ├── *.stories.tsx           # Storybook stories
│   │   ├── scaffold.tsx            # Main component
│   │   ├── app-bar.tsx
│   │   ├── drawer.tsx
│   │   ├── bottom-navigation-bar.tsx
│   │   ├── navigation-rail.tsx
│   │   ├── floating-action-button.tsx
│   │   ├── modal.tsx
│   │   ├── snackbar.tsx
│   │   ├── scaffold-animations.css # CSS animations
│   │   └── index.ts                # Exports
│   ├── lib/
│   │   ├── utils.ts                # Utilities
│   │   └── feature-detection.ts   # Feature detection
│   └── app/
│       └── examples/               # Example pages
├── tests/
│   └── e2e/                        # E2E tests
├── docs/
│   ├── ARCHITECTURE.md             # Architecture guide
│   ├── IMPLEMENTATION_GUIDE.md     # Implementation guide
│   └── PROJECT_SUMMARY.md          # Project summary
└── README.md
```

## 🌐 Browser Support

### Full Support (Modern Features)

- ✅ **Chrome 115+** - Native scroll-driven animations
- ✅ **Edge 115+** - Native scroll-driven animations
- ✅ **Safari 17+** - Partial native support
- ✅ **Firefox 115+** - JavaScript fallback

### Graceful Degradation

- ✅ **Chrome 90+** - JavaScript fallback animations
- ✅ **Safari 14+** - JavaScript fallback animations
- ✅ **Firefox 88+** - JavaScript fallback animations
- ✅ **All modern mobile browsers** - Touch-optimized

The library uses **progressive enhancement**:

1. **HTML** - Basic structure always works
2. **CSS** - Modern browsers get native animations
3. **JavaScript** - Fallback for older browsers

## 🔧 Tech Stack

- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library
- **[TypeScript 5](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Utility-first CSS
- **[shadcn/ui](https://ui.shadcn.com)** - Component patterns
- **[Lucide React](https://lucide.dev/)** - Icon system
- **[Vitest](https://vitest.dev/)** - Unit testing
- **[Playwright](https://playwright.dev/)** - E2E testing
- **[Storybook](https://storybook.js.org/)** - Component documentation

## 📊 Stats

- **Components**: 8 core components
- **Test Coverage**: 97 unit tests (100% passing)
- **E2E Tests**: 50+ scenarios across 3 test suites
- **Code**: 8000+ lines of production code
- **Documentation**: 2000+ lines
- **Bundle Size**: Optimized with tree-shaking

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) first.

### Development Workflow

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for your changes
5. Run tests (`npm run test`)
6. Commit your changes (`git commit -m 'feat: add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Test changes
- `chore:` - Build process or tooling changes

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by [Flutter's Scaffold widget](https://api.flutter.dev/flutter/material/Scaffold-class.html)
- Built following [shadcn/ui](https://ui.shadcn.com) principles
- Uses [Chrome's scroll-driven animations](https://developer.chrome.com/docs/css-ui/scroll-driven-animations)
- Design patterns from [Material Design 3](https://m3.material.io/)

## 📚 Documentation

- **[Architecture Guide](./docs/ARCHITECTURE.md)** - System design and technical decisions
- **[Implementation Guide](./docs/IMPLEMENTATION_GUIDE.md)** - Detailed usage and API reference
- **[Project Summary](./docs/PROJECT_SUMMARY.md)** - Project overview and statistics

## 🔗 Links

- [Documentation](https://shadcn-scaffold.vercel.app/docs)
- [Examples](https://shadcn-scaffold.vercel.app/examples)
- [Storybook](https://shadcn-scaffold.vercel.app/storybook)
- [GitHub](https://github.com/yourusername/shadcn-scaffold)

---

<div align="center">
  <p>Built with ❤️ using modern web technologies</p>
  <p>
    <a href="https://nextjs.org">Next.js</a> •
    <a href="https://react.dev">React</a> •
    <a href="https://tailwindcss.com">Tailwind CSS</a> •
    <a href="https://ui.shadcn.com">shadcn/ui</a>
  </p>
</div>
