# Scaffold 组件架构文档

## 项目概述

基于 **Flutter Scaffold** 理念构建的现代化 Web UI 组件库,使用最先进的 CSS-Grid、Scroll-Driven Animations 技术,配合 Tailwind CSS v4 和 shadcn/ui 设计哲学。

## 核心技术栈

### 前端框架
- **React 19** - 最新的 React 版本,支持 Server Components
- **Next.js 15** - 现代化的 React 框架,支持 SSR/SSG
- **TypeScript 5** - 类型安全的开发体验

### 样式方案
- **Tailwind CSS v4** - 使用最新的 `@import "tailwindcss"` 语法
- **CSS Grid** - 现代布局系统
- **Container Queries** - 响应式布局的未来
- **CSS Scroll-Driven Animations** - 原生滚动动画支持

### 测试工具
- **Vitest** - 单元测试
- **Playwright** - E2E 测试
- **Storybook** - 组件开发和文档

## 架构设计原则

### 1. Web-Native 优先

**理念**: 优先使用原生 HTML/CSS 技术,仅在必要时使用 JavaScript

#### 实现策略:
```typescript
// 1. 特性检测
const scrollTimelineSupport = supports('scroll-timeline');

// 2. CSS 优先
if (scrollTimelineSupport.supported) {
  // 使用纯 CSS 动画
  element.classList.add('app-bar-collapsible');
} else {
  // JavaScript 降级方案
  useScrollFallback();
}
```

#### 关键技术:
- **CSS Scroll-Driven Animations** - Chrome 115+ 原生支持
- **Container Queries** - 现代浏览器原生支持
- **CSS Grid** - 强大的布局能力
- **View Transitions API** - 平滑的页面转换

### 2. 渐进式增强

**层次结构**:
```
HTML (基础结构)
  → CSS (样式和基础动画)
    → JavaScript (增强交互和降级处理)
      → Polyfills (按需加载)
```

#### 特性检测系统:
```typescript
// lib/feature-detection.ts
export const FEATURES = {
  'scroll-timeline': {
    check: () => CSS.supports('animation-timeline: scroll()'),
    polyfill: () => import('scroll-timeline-polyfill')
  },
  'container-queries': {
    check: () => CSS.supports('container-type: inline-size'),
    polyfill: () => import('container-query-polyfill')
  },
  'view-transitions': {
    check: () => 'startViewTransition' in document,
    polyfill: null // Graceful degradation
  }
} as const;
```

### 3. SSR 友好

**核心策略**:
- 所有组件支持服务端渲染
- 使用 `'use client'` 标记客户端组件
- 避免 SSR 时的水合错误

```typescript
// 正确的 SSR 模式
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true); // 仅在客户端设置
}, []);

// 初始状态匹配 SSR 输出
const [isDesktop, setIsDesktop] = useState(false);
```

### 4. 性能优化

#### 关键策略:
1. **requestAnimationFrame** - 优化滚动事件
2. **Passive Event Listeners** - 提升滚动性能
3. **CSS Containment** - 隔离渲染树
4. **Dynamic Imports** - 按需加载 Polyfills

```typescript
// 示例: 优化的滚动处理
useEffect(() => {
  let rafId: number | null = null;
  let ticking = false;

  const handleScroll = () => {
    if (ticking) return;
    ticking = true;

    rafId = requestAnimationFrame(() => {
      updateScrollState();
      ticking = false;
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  return () => {
    window.removeEventListener('scroll', handleScroll);
    if (rafId) cancelAnimationFrame(rafId);
  };
}, []);
```

## 核心组件设计

### Scaffold (容器组件)

**职责**: 整合所有子组件,提供统一的布局管理

```typescript
interface ScaffoldProps {
  // 核心组件
  appBar?: ReactElement<AppBarProps>;
  drawer?: ReactElement<DrawerProps>;
  bottomNavigationBar?: ReactElement<BottomNavigationBarProps>;
  navigationRail?: ReactElement<NavigationRailProps>;
  floatingActionButton?: ReactElement<FloatingActionButtonProps>;

  // 响应式导航
  navigationItems?: NavigationItem[];
  responsive?: boolean;
  responsiveBreakpoint?: number;
}
```

**布局策略**:
```css
/* CSS Grid 布局 */
.scaffold-responsive {
  display: grid;
  grid-template-areas:
    "nav header"
    "nav main"
    "nav footer";
  grid-template-rows: auto 1fr auto;
  grid-template-columns: 80px 1fr;
  container-type: inline-size;
  container-name: scaffold;
}
```

### AppBar (应用栏)

**核心特性**:
- ✅ 可折叠 (Collapsible)
- ✅ 沉浸式 (Immersive)
- ✅ 滚动响应 (Scroll-Responsive)

**实现方式**:

#### CSS Scroll-Driven Animations (现代浏览器)
```css
@keyframes app-bar-collapse {
  from {
    height: var(--app-bar-expanded-height);
  }
  to {
    height: var(--app-bar-collapsed-height);
  }
}

.app-bar-collapsible {
  animation: app-bar-collapse linear;
  animation-timeline: scroll(root block);
  animation-range: 0 200px;
}
```

#### JavaScript Fallback (旧浏览器)
```typescript
const handleScroll = () => {
  const scrollY = window.scrollY;
  const progress = Math.min(scrollY / 200, 1);
  const currentHeight = expandedHeight - (expandedHeight - collapsedHeight) * progress;
  setHeight(currentHeight);
};
```

### Drawer (抽屉)

**核心特性**:
- ✅ 手势支持 (Touch Gestures)
- ✅ 橡皮筋效果 (Rubber Band)
- ✅ 速度检测 (Velocity Detection)

**手势系统**:
```typescript
const handleTouchMove = (e: TouchEvent) => {
  const diff = touch.clientX - startX;
  const progress = Math.abs(diff) / drawerWidth;

  // 橡皮筋阻尼效果
  const resistance = 1 - Math.pow(progress, 2) * 0.7;
  setDragOffset(diff * resistance);
};

const handleTouchEnd = () => {
  // 综合距离和速度判断是否关闭
  const shouldClose =
    dragOffset < -threshold ||
    dragVelocity < -velocityThreshold;
};
```

### BottomNavigationBar & NavigationRail

**响应式切换**:
```typescript
// 基于屏幕尺寸自动切换
const showNavigationRail = isDesktop && navigationRail;
const showBottomNav = !isDesktop || !navigationRail;
```

**滚动隐藏**:
```css
/* CSS 方式 */
@keyframes hide-bottom-nav {
  from { transform: translateY(0); }
  to { transform: translateY(100%); }
}

.bottom-nav-hide-on-scroll {
  animation: hide-bottom-nav linear;
  animation-timeline: scroll(root block);
  animation-direction: alternate;
}
```

## CSS Scroll-Driven Animations 详解

### Scroll Timeline API

**基础用法**:
```css
/* 1. 定义动画 */
@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 2. 应用滚动时间线 */
.scroll-fade-in {
  animation: fade-in linear;
  animation-timeline: view();
  animation-range: entry 0% cover 30%;
}
```

### View Timeline API

**进入视口动画**:
```css
/* 元素进入视口时缩放 */
.scroll-scale {
  animation: scale-up linear;
  animation-timeline: view();
  animation-range: entry 0% entry 100%;
}

@keyframes scale-up {
  from { scale: 0.8; opacity: 0; }
  to { scale: 1; opacity: 1; }
}
```

### 视差效果

**多层滚动速度**:
```css
.parallax-slow {
  animation: parallax-slow linear;
  animation-timeline: scroll(root block);
}

@keyframes parallax-slow {
  to { transform: translateY(20%); }
}

.parallax-fast {
  animation: parallax-fast linear;
  animation-timeline: scroll(root block);
}

@keyframes parallax-fast {
  to { transform: translateY(-30%); }
}
```

## 响应式设计

### Container Queries

```css
/* 基于容器宽度的样式 */
@container scaffold (min-width: 768px) {
  .adaptive-component {
    grid-template-columns: 1fr 1fr;
  }
}

@container scaffold (min-width: 1024px) {
  .adaptive-component {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### 折叠屏设备支持

```typescript
// 检测折叠屏设备
const viewportSegmentsSupport = supports('viewport-segments');
if (viewportSegmentsSupport.supported) {
  const segments = window.visualViewport?.segments;
  setFoldState(segments?.length > 1 ? 'unfolded' : 'folded');
}
```

```css
/* 折叠屏专属样式 */
.foldable-device.device-unfolded {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(50%, 1fr));
}
```

## 特性检测系统

### 架构设计

```typescript
// lib/feature-detection.ts
export interface FeatureSupport {
  supported: boolean;
  polyfillNeeded: boolean;
  polyfillAvailable: boolean;
}

export const supports = (feature: string): FeatureSupport => {
  const config = FEATURES[feature];
  const supported = config.check();

  return {
    supported,
    polyfillNeeded: !supported && !!config.polyfill,
    polyfillAvailable: !!config.polyfill
  };
};

export const loadPolyfill = async (feature: string) => {
  const config = FEATURES[feature];
  if (!config.polyfill) return;

  return config.polyfill();
};
```

### 使用模式

```typescript
// 组件中使用
const scrollTimelineSupport = supports('scroll-timeline');

if (scrollTimelineSupport.polyfillNeeded) {
  await loadPolyfill('scroll-timeline');
}

// 应用样式
className={cn(
  scrollTimelineSupport.supported && 'app-bar-collapsible',
  !scrollTimelineSupport.supported && 'transition-all'
)}
```

## 测试策略

### 单元测试 (Vitest)

```typescript
// __tests__/scaffold.test.tsx
describe('Scaffold', () => {
  it('should render with responsive navigation', () => {
    render(
      <Scaffold
        navigationItems={mockItems}
        responsive={true}
      >
        <div>Content</div>
      </Scaffold>
    );

    // 验证 SSR 兼容性
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});
```

### E2E 测试 (Playwright)

```typescript
// e2e/scroll-animations.spec.ts
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

### 视觉回归测试 (Storybook + Chromatic)

```typescript
// scaffold.stories.tsx
export const WithScrollAnimations: Story = {
  args: {
    appBar: <AppBar collapsible immersive />,
    bottomNavigationBar: <BottomNavigationBar hideOnScroll />
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button'));
  }
};
```

## 性能优化清单

### CSS 优化
- ✅ 使用 CSS Containment (`contain: layout style paint`)
- ✅ 避免强制重排 (避免读取 `offsetHeight` 等属性)
- ✅ 使用 `transform` 和 `opacity` 进行动画
- ✅ 使用 `will-change` 提示浏览器

### JavaScript 优化
- ✅ 使用 `requestAnimationFrame` 进行动画
- ✅ 使用 Passive Event Listeners
- ✅ 防抖和节流滚动事件
- ✅ 动态导入 Polyfills

### 资源优化
- ✅ 代码分割 (Code Splitting)
- ✅ Tree Shaking
- ✅ 按需加载组件
- ✅ 优化打包体积

## 浏览器兼容性

### 核心功能
| 功能 | Chrome | Firefox | Safari | Edge |
|------|--------|---------|--------|------|
| CSS Grid | ✅ 57+ | ✅ 52+ | ✅ 10.1+ | ✅ 16+ |
| Container Queries | ✅ 105+ | ✅ 110+ | ✅ 16+ | ✅ 105+ |
| Scroll-Driven Animations | ✅ 115+ | ⚠️ Polyfill | ⚠️ Polyfill | ✅ 115+ |
| View Transitions | ✅ 111+ | ❌ Degradation | ❌ Degradation | ✅ 111+ |

### 降级策略
- **Scroll-Driven Animations**: JavaScript fallback with RAF
- **Container Queries**: Media queries fallback
- **View Transitions**: Instant transition (no animation)

## 下一步计划

### 短期 (v0.2.0)
- [ ] 完善所有组件的 CSS Scroll-Driven Animations 样式
- [ ] 添加更多 Storybook 示例
- [ ] 完善测试覆盖率到 80%+
- [ ] 优化 Polyfill 加载策略

### 中期 (v0.3.0)
- [ ] 支持主题切换动画
- [ ] 添加更多预设布局模板
- [ ] 完善无障碍支持 (A11y)
- [ ] 添加 RTL 支持

### 长期 (v1.0.0)
- [ ] 发布到 npm
- [ ] 完整的文档网站
- [ ] CLI 工具集成
- [ ] 设计系统代币 (Design Tokens)

## 参考资料

### 官方文档
- [Chrome Scroll-Driven Animations](https://developer.chrome.com/docs/css-ui/scroll-driven-animations)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Flutter Scaffold](https://docs.flutter.dev/)

### 技术规范
- [CSS Scroll-Driven Animations Spec](https://drafts.csswg.org/scroll-animations/)
- [Container Queries Spec](https://drafts.csswg.org/css-contain-3/)
- [React Aria](https://react-spectrum.adobe.com/react-aria/)

## 贡献指南

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'feat: add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

### Commit 规范
遵循 [Conventional Commits](https://www.conventionalcommits.org/)

```
feat: 新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式调整
refactor: 重构
test: 测试相关
chore: 构建/工具链相关
```

## License

MIT License - 详见 LICENSE 文件
