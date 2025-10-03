# Scaffold 组件实现指南

本文档提供了基于文档内容和项目需求的详细实现指南,帮助开发者理解和使用 Scaffold 组件系统。

## 📋 目录

1. [快速开始](#快速开始)
2. [核心概念](#核心概念)
3. [组件详解](#组件详解)
4. [最佳实践](#最佳实践)
5. [故障排查](#故障排查)

## 快速开始

### 安装

本项目基于 shadcn/ui 构建模式,可以通过 CLI 安装:

```bash
# 使用 shadcn CLI 添加组件
npx shadcn@latest add https://your-registry.com/r/scaffold.json
```

### 基础使用

```tsx
import {
  Scaffold,
  AppBar,
  Drawer,
  BottomNavigationBar,
  FloatingActionButton,
} from '@/components/scaffold';
import { Menu, Home, Search, User } from 'lucide-react';

export default function MyApp() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedNav, setSelectedNav] = useState('home');

  return (
    <Scaffold
      appBar={
        <AppBar
          collapsible
          immersive
          leading={<button onClick={() => setDrawerOpen(true)}><Menu /></button>}
          title={<h1>My App</h1>}
        />
      }
      drawer={
        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          <nav>...</nav>
        </Drawer>
      }
      bottomNavigationBar={
        <BottomNavigationBar
          items={[
            { key: 'home', icon: <Home />, label: 'Home' },
            { key: 'search', icon: <Search />, label: 'Search' },
            { key: 'profile', icon: <User />, label: 'Profile' },
          ]}
          value={selectedNav}
          onValueChange={setSelectedNav}
        />
      }
      floatingActionButton={
        <FloatingActionButton icon={<Plus />} onClick={() => {}} />
      }
    >
      {/* 主内容区域 */}
      <div>Your content here</div>
    </Scaffold>
  );
}
```

## 核心概念

### 1. Web-Native 优先策略

项目的核心理念是"**Web-Native 优先**",即优先使用原生 HTML/CSS 技术,仅在必要时使用 JavaScript。

#### 实现层次

```
┌─────────────────────────────────────┐
│  HTML (基础结构)                     │
│  - 语义化标签                        │
│  - 无障碍属性                        │
└─────────────────────────────────────┘
            ↓
┌─────────────────────────────────────┐
│  CSS (样式和动画)                    │
│  - CSS Grid 布局                     │
│  - Scroll-Driven Animations         │
│  - Container Queries                │
└─────────────────────────────────────┘
            ↓
┌─────────────────────────────────────┐
│  JavaScript (增强和降级)              │
│  - 特性检测                          │
│  - Fallback 处理                     │
│  - 交互增强                          │
└─────────────────────────────────────┘
            ↓
┌─────────────────────────────────────┐
│  Polyfills (按需加载)                │
│  - ResizeObserver                   │
│  - IntersectionObserver             │
└─────────────────────────────────────┘
```

### 2. CSS Scroll-Driven Animations

#### 什么是 Scroll-Driven Animations?

Chrome 115+ 引入的原生 CSS API,允许动画直接绑定到滚动位置,运行在 GPU 上,性能优异。

#### 两种核心时间线

**Scroll Progress Timeline (滚动进度时间线)**

跟踪滚动容器的滚动位置:

```css
@keyframes app-bar-collapse {
  from { height: 80px; }
  to { height: 56px; }
}

.app-bar {
  animation: app-bar-collapse linear both;
  animation-timeline: scroll(root block);  /* 跟踪根滚动容器 */
  animation-range: 0 200px;                /* 在 0-200px 范围内动画 */
}
```

**View Progress Timeline (视图进度时间线)**

跟踪元素进入/离开视口的过程:

```css
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card {
  animation: fade-in linear both;
  animation-timeline: view();              /* 跟踪元素在视口中的位置 */
  animation-range: entry 0% cover 30%;    /* 从进入到覆盖 30% 时 */
}
```

#### JavaScript Fallback 模式

```typescript
// 1. 检测支持
const scrollTimelineSupport = supports('scroll-timeline');

if (scrollTimelineSupport.supported) {
  // 2a. 使用 CSS 动画
  element.classList.add('app-bar-collapsible');
} else {
  // 2b. JavaScript 降级
  let rafId: number | null = null;

  const handleScroll = () => {
    if (rafId) return;

    rafId = requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      const progress = Math.min(scrollY / 200, 1);
      const height = 80 - (80 - 56) * progress;

      element.style.height = `${height}px`;
      rafId = null;
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
}
```

### 3. 特性检测系统

#### 设计理念

类似 `CSS.supports()`,提供统一的特性检测接口:

```typescript
// lib/feature-detection.ts
const support = supports('scroll-timeline');

if (support.supported) {
  // 原生支持
} else if (support.polyfillNeeded) {
  // 需要 polyfill
  await loadPolyfill('scroll-timeline');
} else {
  // 优雅降级
}
```

#### 支持的特性

| 特性 | 检测方法 | Polyfill |
|------|---------|----------|
| `scroll-timeline` | `CSS.supports('animation-timeline: scroll()')` | ❌ (JS Fallback) |
| `container-queries` | `CSS.supports('container-type: inline-size')` | ✅ |
| `view-transitions` | `'startViewTransition' in document` | ❌ (Graceful Degradation) |
| `viewport-segments` | `'segments' in visualViewport` | ❌ |
| `resize-observer` | `'ResizeObserver' in window` | ✅ |
| `intersection-observer` | `'IntersectionObserver' in window` | ✅ |

#### 使用模式

**组件中使用**:

```typescript
import { supports, loadPolyfill } from '@/lib/feature-detection';

export function MyComponent() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const check = async () => {
      const support = supports('resize-observer');

      if (support.polyfillNeeded) {
        await loadPolyfill('resize-observer');
      }

      setReady(true);
    };

    check();
  }, []);

  if (!ready) return <LoadingSpinner />;

  // 使用 ResizeObserver
  return <div>...</div>;
}
```

**批量检测**:

```typescript
import { ensureFeatures } from '@/lib/feature-detection';

useEffect(() => {
  ensureFeatures(['resize-observer', 'intersection-observer'])
    .then(() => setReady(true))
    .catch(console.error);
}, []);
```

## 组件详解

### Scaffold (容器组件)

#### 职责

- 统一管理所有子组件的布局
- 提供响应式导航切换
- 支持 SSR
- 处理折叠屏设备

#### Props

```typescript
interface ScaffoldProps {
  // 核心组件
  appBar?: ReactElement<AppBarProps>;
  drawer?: ReactElement<DrawerProps>;
  endDrawer?: ReactElement<DrawerProps>;
  bottomNavigationBar?: ReactElement<BottomNavigationBarProps>;
  navigationRail?: ReactElement<NavigationRailProps>;
  floatingActionButton?: ReactElement<FloatingActionButtonProps>;

  // 自适应导航
  navigationItems?: NavigationItem[];
  navigationValue?: string;
  onNavigationChange?: (value: string) => void;
  navigationShowLabels?: boolean | 'selected';

  // 响应式配置
  responsive?: boolean;
  responsiveBreakpoint?: number;

  // 样式
  className?: string;
  backgroundColor?: string;

  // 内容
  children: ReactNode;
}
```

#### CSS Grid 布局

```tsx
<div
  style={{
    display: 'grid',
    gridTemplateAreas: `
      "nav header"
      "nav main"
      "nav footer"
    `,
    gridTemplateRows: 'auto 1fr auto',
    gridTemplateColumns: '80px 1fr',
    containerType: 'inline-size',
    containerName: 'scaffold',
  }}
>
  {/* header */}
  {/* nav */}
  {/* main */}
  {/* footer */}
</div>
```

#### 自适应导航

```typescript
// 自动在 BottomNavigationBar 和 NavigationRail 之间切换
<Scaffold
  navigationItems={[
    { key: 'home', icon: <Home />, label: 'Home' },
    { key: 'search', icon: <Search />, label: 'Search' },
  ]}
  navigationValue={selected}
  onNavigationChange={setSelected}
  responsive={true}
  responsiveBreakpoint={1024}
>
  {/* 小屏显示 BottomNavigationBar */}
  {/* 大屏显示 NavigationRail */}
</Scaffold>
```

### AppBar (应用栏)

#### 核心特性

1. **Collapsible (可折叠)** - 滚动时高度从 `expandedHeight` 缩小到 `collapsedHeight`
2. **Immersive (沉浸式)** - 初始透明,滚动时逐渐显示背景和模糊效果
3. **Scroll-Responsive** - 子元素随滚动产生细微动画

#### Props

```typescript
interface AppBarProps {
  // 功能开关
  collapsible?: boolean;
  immersive?: boolean;

  // 高度配置
  expandedHeight?: number;      // 默认 64px
  collapsedHeight?: number;     // 默认 56px

  // 外观
  elevation?: 0 | 1 | 2 | 3 | 4 | 5;
  position?: 'fixed' | 'sticky' | 'static';

  // 内容槽
  leading?: ReactNode;         // 左侧元素 (如菜单按钮)
  title?: ReactNode;          // 标题
  actions?: ReactNode;        // 右侧操作
  children?: ReactNode;       // 自定义内容

  className?: string;
}
```

#### CSS 实现

**折叠动画**:

```css
@keyframes app-bar-collapse {
  from {
    height: var(--app-bar-expanded-height, 64px);
  }
  to {
    height: var(--app-bar-collapsed-height, 56px);
  }
}

.app-bar-collapsible {
  animation: app-bar-collapse linear both;
  animation-timeline: scroll(root block);
  animation-range: 0 200px;
}
```

**沉浸式背景**:

```css
@keyframes app-bar-backdrop-fade {
  from {
    opacity: 0;
    backdrop-filter: blur(0px) saturate(1);
  }
  to {
    opacity: 1;
    backdrop-filter: blur(12px) saturate(1.5);
  }
}

.app-bar-backdrop {
  animation: app-bar-backdrop-fade linear both;
  animation-timeline: scroll(root block);
  animation-range: 0 100px;
}
```

#### 使用示例

```tsx
<AppBar
  collapsible
  immersive
  expandedHeight={80}
  collapsedHeight={56}
  elevation={2}
  leading={
    <button onClick={() => setDrawerOpen(true)}>
      <Menu size={24} />
    </button>
  }
  title={
    <div>
      <h1 className="text-xl font-bold">My App</h1>
      <p className="text-xs text-muted-foreground">Subtitle</p>
    </div>
  }
  actions={
    <div className="flex gap-2">
      <button><Search size={20} /></button>
      <button><Settings size={20} /></button>
    </div>
  }
/>
```

### Drawer (抽屉)

#### 核心特性

1. **Touch Gestures** - 支持滑动手势关闭
2. **Rubber Band Effect** - 橡皮筋阻尼效果
3. **Velocity Detection** - 速度检测,快速滑动即可关闭
4. **Backdrop** - 可选的半透明背景

#### Props

```typescript
interface DrawerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: 'left' | 'right';
  width?: number | string;
  gestureEnabled?: boolean;
  showBackdrop?: boolean;
  elevation?: 0 | 1 | 2 | 3 | 4 | 5;
  duration?: number;
  children?: ReactNode;
  className?: string;
}
```

#### 手势系统实现

**触摸开始**:

```typescript
const handleTouchStart = (e: TouchEvent) => {
  if (!gestureEnabled || !open) return;

  startX = e.touches[0].clientX;
  lastX = startX;
  lastTime = Date.now();
  setIsDragging(true);
};
```

**触摸移动** (带橡皮筋效果):

```typescript
const handleTouchMove = (e: TouchEvent) => {
  if (!isDragging) return;

  requestAnimationFrame(() => {
    const diff = touch.clientX - startX;
    const progress = Math.abs(diff) / drawerWidth;

    // 橡皮筋阻尼 - 越拖越难拖
    const resistance = 1 - Math.pow(progress, 2) * 0.7;
    setDragOffset(diff * resistance);

    // 计算速度
    const velocity = (touch.clientX - lastX) / (now - lastTime);
    setDragVelocity(velocity);
  });
};
```

**触摸结束** (综合距离和速度判断):

```typescript
const handleTouchEnd = () => {
  const threshold = drawerWidth * 0.3;
  const velocityThreshold = 0.5;

  const shouldClose =
    Math.abs(dragOffset) > threshold ||
    Math.abs(dragVelocity) > velocityThreshold;

  if (shouldClose) {
    onOpenChange?.(false);
  }

  setDragOffset(0);
  setDragVelocity(0);
};
```

#### 使用示例

```tsx
<Drawer
  open={drawerOpen}
  onOpenChange={setDrawerOpen}
  side="left"
  width={280}
  gestureEnabled={true}
  showBackdrop={true}
  elevation={4}
>
  <div className="flex flex-col h-full">
    {/* Header */}
    <div className="p-6 border-b">
      <h3>Menu</h3>
    </div>

    {/* Content */}
    <nav className="flex-1 overflow-y-auto p-4">
      <button>Item 1</button>
      <button>Item 2</button>
    </nav>

    {/* Footer */}
    <div className="p-4 border-t">
      <button>Settings</button>
    </div>
  </div>
</Drawer>
```

### BottomNavigationBar

#### 核心特性

1. **Hide on Scroll** - 向下滚动隐藏,向上滚动显示
2. **Badge Support** - 支持徽章显示
3. **Label Modes** - 三种标签显示模式

#### Props

```typescript
interface BottomNavigationBarProps {
  items?: BottomNavigationItem[];
  value?: string;
  onValueChange?: (value: string) => void;
  showLabels?: boolean | 'selected';  // true | false | 'selected'
  elevation?: 0 | 1 | 2 | 3 | 4 | 5;
  hideOnScroll?: boolean;
  className?: string;
}

interface BottomNavigationItem {
  key: string;
  icon: ReactNode;
  label: string;
  badge?: string | number;
  disabled?: boolean;
}
```

#### Hide on Scroll 实现

**CSS 方式** (Chrome 115+):

```css
@keyframes bottom-nav-hide {
  from { transform: translateY(0); }
  to { transform: translateY(100%); }
}

.bottom-nav-hide-on-scroll {
  animation: bottom-nav-hide linear both;
  animation-timeline: scroll(root block);
  animation-range: 100px 300px;
}
```

**JavaScript Fallback**:

```typescript
useEffect(() => {
  if (supportsScrollTimeline || !hideOnScroll) return;

  let lastScrollY = 0;

  const handleScroll = () => {
    requestAnimationFrame(() => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);  // 向下滚动且超过阈值,隐藏
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);   // 向上滚动,显示
      }

      lastScrollY = currentScrollY;
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  return () => window.removeEventListener('scroll', handleScroll);
}, [hideOnScroll, supportsScrollTimeline]);
```

#### 使用示例

```tsx
<BottomNavigationBar
  items={[
    { key: 'home', icon: <Home />, label: 'Home' },
    { key: 'search', icon: <Search />, label: 'Search', badge: 3 },
    { key: 'notifications', icon: <Bell />, label: 'Notifications', badge: '99+' },
    { key: 'profile', icon: <User />, label: 'Profile' },
  ]}
  value={selectedNav}
  onValueChange={setSelectedNav}
  showLabels="selected"  // 仅选中项显示标签
  elevation={3}
  hideOnScroll={true}
/>
```

### NavigationRail

#### 核心特性

- 垂直导航栏,适用于桌面端
- 可展开/收起
- 支持徽章和标签

#### Props

```typescript
interface NavigationRailProps {
  items?: NavigationRailItem[];
  value?: string;
  onValueChange?: (value: string) => void;
  showLabels?: boolean;
  elevation?: 0 | 1 | 2 | 3 | 4 | 5;
  width?: number;
  expandable?: boolean;
  className?: string;
}
```

#### 使用示例

```tsx
<NavigationRail
  items={[
    { key: 'home', icon: <Home />, label: 'Home' },
    { key: 'projects', icon: <Folder />, label: 'Projects' },
    { key: 'team', icon: <Users />, label: 'Team' },
    { key: 'settings', icon: <Settings />, label: 'Settings' },
  ]}
  value={selected}
  onValueChange={setSelected}
  showLabels={true}
  width={80}
  elevation={2}
/>
```

### FloatingActionButton

#### 核心特性

- 浮动操作按钮
- 支持滚动隐藏
- 多种尺寸和位置

#### Props

```typescript
interface FloatingActionButtonProps {
  icon: ReactNode;
  onClick?: () => void;
  hideOnScroll?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  elevation?: 0 | 1 | 2 | 3 | 4 | 5;
  className?: string;
}
```

#### 使用示例

```tsx
<FloatingActionButton
  icon={<Plus size={24} />}
  onClick={() => createNew()}
  hideOnScroll={false}
  size="md"
  position="bottom-right"
  elevation={4}
/>
```

### Snackbar (消息提示)

#### 核心特性

- 轻量级消息提示
- 支持多种严重程度
- 自动消失或手动关闭
- 动画进入/退出

#### Hook 使用

```typescript
import { useSnackbar } from '@/components/scaffold';

function MyComponent() {
  const snackbar = useSnackbar();

  const handleAction = () => {
    snackbar.show('Operation successful!', {
      severity: 'success',
      duration: 3000,
    });
  };

  return (
    <>
      <button onClick={handleAction}>Click Me</button>
      <Snackbar {...snackbar.snackbarProps} />
    </>
  );
}
```

#### API

```typescript
interface SnackbarHook {
  show: (message: string, options?: SnackbarOptions) => void;
  hide: () => void;
  snackbarProps: SnackbarProps;
}

interface SnackbarOptions {
  severity?: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  action?: ReactNode;
}
```

## 最佳实践

### 1. 性能优化

#### 使用 Passive Event Listeners

```typescript
window.addEventListener('scroll', handleScroll, { passive: true });
window.addEventListener('touchmove', handleTouchMove, { passive: true });
```

#### 使用 requestAnimationFrame

```typescript
let rafId: number | null = null;

const handleScroll = () => {
  if (rafId) return;

  rafId = requestAnimationFrame(() => {
    // 执行滚动处理
    rafId = null;
  });
};
```

#### CSS Containment

```css
.app-bar {
  contain: layout style paint;
}

.card {
  contain: layout style;
}
```

#### GPU 加速

```css
.animated-element {
  will-change: transform;
  transform: translateZ(0);  /* 强制 GPU 加速 */
}
```

### 2. SSR 兼容性

#### 避免水合错误

```typescript
// ❌ 错误 - SSR 和客户端不一致
const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

// ✅ 正确 - 初始状态匹配 SSR
const [isDesktop, setIsDesktop] = useState(false);

useEffect(() => {
  setIsDesktop(window.innerWidth >= 1024);
}, []);
```

#### 检查运行环境

```typescript
if (typeof window === 'undefined') {
  // SSR 环境
  return null;
}

// 客户端环境
return <Component />;
```

### 3. 响应式设计

#### 使用 Container Queries

```css
@container scaffold (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@container scaffold (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

#### 自适应导航

```tsx
{/* 自动在 BottomNav 和 NavigationRail 之间切换 */}
<Scaffold
  navigationItems={items}
  responsive={true}
  responsiveBreakpoint={1024}
/>
```

### 4. 无障碍访问 (A11y)

#### ARIA 属性

```tsx
<button
  aria-label="Open menu"
  aria-expanded={drawerOpen}
  aria-controls="drawer-content"
>
  <Menu />
</button>

<aside
  id="drawer-content"
  role="navigation"
  aria-hidden={!drawerOpen}
>
  {/* Drawer content */}
</aside>
```

#### 键盘导航

```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && drawerOpen) {
      setDrawerOpen(false);
    }
  };

  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
}, [drawerOpen]);
```

#### Focus Management

```typescript
const drawerRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (open && drawerRef.current) {
    // 抽屉打开时,聚焦第一个可聚焦元素
    const firstFocusable = drawerRef.current.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    (firstFocusable as HTMLElement)?.focus();
  }
}, [open]);
```

### 5. 测试策略

#### 单元测试

```typescript
import { render, screen } from '@testing-library/react';
import { Scaffold } from './scaffold';

describe('Scaffold', () => {
  it('should render children', () => {
    render(
      <Scaffold>
        <div>Test Content</div>
      </Scaffold>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should apply responsive layout', () => {
    const { container } = render(
      <Scaffold responsive={true}>
        <div>Content</div>
      </Scaffold>
    );

    expect(container.firstChild).toHaveClass('scaffold-responsive');
  });
});
```

#### E2E 测试

```typescript
import { test, expect } from '@playwright/test';

test('should collapse app bar on scroll', async ({ page }) => {
  await page.goto('/examples/advanced-scroll');

  const appBar = page.locator('header');
  const initialHeight = await appBar.evaluate(el => el.offsetHeight);

  await page.evaluate(() => window.scrollTo(0, 300));
  await page.waitForTimeout(500);

  const collapsedHeight = await appBar.evaluate(el => el.offsetHeight);
  expect(collapsedHeight).toBeLessThan(initialHeight);
});
```

## 故障排查

### 常见问题

#### 1. 滚动动画不工作

**问题**: CSS scroll-driven animations 不生效

**解决方案**:

```typescript
// 1. 检查浏览器支持
const support = supports('scroll-timeline');
console.log('Scroll Timeline Support:', support);

// 2. 查看 CSS 是否正确加载
// 确保 scaffold-animations.css 已导入

// 3. 检查动画类名
// 元素应该有 .app-bar-collapsible 类
```

#### 2. SSR 水合错误

**问题**: `Warning: Text content did not match. Server: "..." Client: "..."`

**解决方案**:

```typescript
// 使用 mounted 标记
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

if (!mounted) {
  // 返回 SSR 兼容的初始状态
  return <div className="placeholder" />;
}

// 返回客户端状态
return <Component />;
```

#### 3. 手势不响应

**问题**: Drawer 手势滑动不工作

**解决方案**:

```typescript
// 1. 确保 gestureEnabled={true}
<Drawer gestureEnabled={true} />

// 2. 检查 touch-action CSS
// 元素不应该有 touch-action: none

// 3. 检查事件监听器
// 确保没有其他元素阻止事件冒泡
```

#### 4. 性能问题

**问题**: 滚动卡顿

**解决方案**:

```typescript
// 1. 使用 passive listeners
window.addEventListener('scroll', handler, { passive: true });

// 2. 使用 RAF 节流
let rafId: number | null = null;
const handler = () => {
  if (rafId) return;
  rafId = requestAnimationFrame(() => {
    // ...
    rafId = null;
  });
};

// 3. 添加 CSS contain
.animated-element {
  contain: layout style paint;
}

// 4. 避免强制重排
// 不要在滚动处理中读取 offsetHeight 等属性
```

### 调试工具

#### Feature Report

```typescript
import { getFeatureReport } from '@/lib/feature-detection';

// 在控制台查看所有特性支持情况
console.table(getFeatureReport());
```

#### Performance Profiling

```typescript
// 使用 Performance API
performance.mark('scroll-start');

// ... 滚动处理 ...

performance.mark('scroll-end');
performance.measure('scroll-duration', 'scroll-start', 'scroll-end');

const measures = performance.getEntriesByType('measure');
console.log('Scroll Duration:', measures[0].duration, 'ms');
```

## 进阶主题

### 自定义动画范围

```css
/* 仅在元素进入视口时动画 */
.fade-in-entry-only {
  animation: fade-in linear both;
  animation-timeline: view();
  animation-range: entry 0% entry 100%;
}

/* 在元素完全可见时动画 */
.scale-contain {
  animation: scale-up linear both;
  animation-timeline: view();
  animation-range: contain 0% contain 100%;
}

/* 多阶段动画 */
@keyframes multi-stage {
  entry 0% {
    opacity: 0;
    transform: translateY(50px);
  }
  entry 100% {
    opacity: 1;
    transform: translateY(0);
  }
  exit 0% {
    opacity: 1;
    transform: scale(1);
  }
  exit 100% {
    opacity: 0;
    transform: scale(0.8);
  }
}
```

### 自定义主题

```css
:root {
  /* AppBar 高度 */
  --app-bar-expanded-height: 80px;
  --app-bar-collapsed-height: 56px;

  /* Drawer 宽度 */
  --drawer-width: 280px;

  /* 动画时长 */
  --transition-duration: 300ms;
  --transition-easing: cubic-bezier(0.4, 0, 0.2, 1);

  /* 间距 */
  --scaffold-spacing: 1rem;
}
```

### 扩展组件

```tsx
// 创建自定义 AppBar
export function CustomAppBar(props: AppBarProps) {
  return (
    <AppBar
      {...props}
      className={cn('my-custom-appbar', props.className)}
    >
      {/* 自定义内容 */}
    </AppBar>
  );
}
```

## 资源链接

- [Chrome Scroll-Driven Animations](https://developer.chrome.com/docs/css-ui/scroll-driven-animations)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Flutter Scaffold](https://docs.flutter.dev/)
- [React Aria](https://react-spectrum.adobe.com/react-aria/)

## 贡献

欢迎贡献! 请查看 [CONTRIBUTING.md](./CONTRIBUTING.md)

## License

MIT
