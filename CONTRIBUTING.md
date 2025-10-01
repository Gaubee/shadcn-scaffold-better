# Contributing to Scaffold UI

感谢您对 Scaffold UI 的兴趣！我们欢迎所有形式的贡献。

## 开发环境设置

### 前置要求

- Node.js 20+
- npm 或 pnpm
- Git

### 安装步骤

```bash
# 克隆仓库
git clone https://github.com/your-username/shadcn-scaffold.git
cd shadcn-scaffold

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## 项目结构

```
shadcn-scaffold/
├── src/
│   ├── app/                    # Next.js 应用路由
│   │   ├── examples/          # 示例页面
│   │   └── globals.css        # 全局样式
│   ├── components/
│   │   └── scaffold/          # Scaffold 组件库
│   │       ├── __tests__/     # 单元测试
│   │       ├── *.stories.tsx  # Storybook 故事
│   │       └── *.tsx          # 组件实现
│   └── lib/
│       ├── utils.ts           # 工具函数
│       └── feature-detection.ts # 特性检测系统
├── tests/
│   └── e2e/                   # E2E 测试
├── registry/                   # shadcn/ui 注册表
└── docs/                      # 文档
```

## 开发工作流

### 1. 创建新组件

遵循现有组件的模式：

```tsx
'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface YourComponentProps {
  children?: React.ReactNode;
  className?: string;
  // 其他 props...
}

export const YourComponent = React.forwardRef<
  HTMLDivElement,
  YourComponentProps
>(({ children, className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn('base-classes', className)} {...props}>
      {children}
    </div>
  );
});

YourComponent.displayName = 'YourComponent';
```

### 2. Web-Native 优先原则

我们优先使用原生 HTML/CSS 特性：

- ✅ **优先**: CSS Grid, Scroll-driven Animations, Container Queries
- ✅ **次选**: JavaScript 垫片提供优雅降级
- ❌ **避免**: 过度依赖 JavaScript 实现可用 CSS 实现的功能

使用特性检测系统：

```tsx
import { supports, loadPolyfill } from '@/lib/feature-detection';

// 检测特性支持
const scrollTimelineSupport = supports('scroll-timeline');

if (scrollTimelineSupport.polyfillNeeded) {
  // 自动加载垫片
  await loadPolyfill('scroll-timeline');
}
```

### 3. 样式规范

我们使用 **Tailwind CSS v4**：

- 使用 utility classes
- 通过 CSS 变量支持主题
- 使用 `cn()` 工具合并 className
- 利用容器查询实现响应式

```tsx
<div
  className={cn(
    'base-class',
    'responsive-class',
    conditional && 'conditional-class',
    className
  )}
  style={{
    containerType: 'inline-size',
    containerName: 'component-name',
  }}
>
  {/* 内容 */}
</div>
```

### 4. TypeScript 最佳实践

- 为所有 props 定义接口
- 使用 `React.forwardRef` 支持 ref 转发
- 导出类型供外部使用
- 避免使用 `any`，优先使用具体类型

```tsx
export interface ComponentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export type ComponentRef = HTMLDivElement;
```

### 5. 测试

#### 单元测试 (Vitest)

```bash
# 运行所有测试
npm run test

# 观察模式
npm run test:ui

# 覆盖率报告
npm run test:coverage
```

测试示例：

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { YourComponent } from '../your-component';

describe('YourComponent', () => {
  it('renders correctly', () => {
    render(<YourComponent>Test</YourComponent>);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <YourComponent className="custom-class">Test</YourComponent>
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
```

#### E2E 测试 (Playwright)

```bash
# 运行 E2E 测试
npm run test:e2e

# 交互式 UI 模式
npm run test:e2e:ui
```

#### Storybook

```bash
# 启动 Storybook
npm run storybook

# 构建 Storybook
npm run build-storybook
```

创建 Story：

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { YourComponent } from './your-component';

const meta: Meta<typeof YourComponent> = {
  title: 'Scaffold/YourComponent',
  component: YourComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof YourComponent>;

export const Default: Story = {
  args: {
    children: 'Default content',
  },
};
```

## 代码规范

### Git Commit 规范

我们使用 [Conventional Commits](https://www.conventionalcommits.org/)：

```
<type>(<scope>): <subject>

<body>

<footer>
```

类型：
- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式（不影响功能）
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建/工具链更新

示例：

```bash
feat(scaffold): add support for foldable devices

Implement viewport segments detection and layout adaptation
for foldable devices like Samsung Galaxy Fold.

Closes #123
```

### Pull Request 流程

1. Fork 仓库
2. 创建功能分支：`git checkout -b feat/your-feature`
3. 提交更改：`git commit -m 'feat: add some feature'`
4. 推送到分支：`git push origin feat/your-feature`
5. 创建 Pull Request

PR 要求：
- ✅ 所有测试通过
- ✅ 代码覆盖率不下降
- ✅ 包含必要的文档更新
- ✅ Storybook stories（如果是新组件）
- ✅ 更新 CHANGELOG.md

## 性能考虑

### 优化原则

1. **按需加载**: 使用动态 import
2. **避免不必要的重渲染**: 使用 `React.memo`, `useMemo`, `useCallback`
3. **使用 RAF**: 对于动画和滚动事件使用 `requestAnimationFrame`
4. **节流/防抖**: 使用防抖来处理频繁触发的事件

示例：

```tsx
React.useEffect(() => {
  let rafId: number | null = null;
  let ticking = false;

  const handleScroll = () => {
    if (ticking) return;
    ticking = true;

    rafId = requestAnimationFrame(() => {
      // 处理滚动逻辑
      ticking = false;
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  return () => {
    window.removeEventListener('scroll', handleScroll);
    if (rafId !== null) cancelAnimationFrame(rafId);
  };
}, []);
```

## 无障碍 (a11y)

所有组件必须满足 WCAG 2.1 AA 标准：

- ✅ 键盘导航支持
- ✅ 适当的 ARIA 属性
- ✅ 足够的颜色对比度
- ✅ 焦点指示器
- ✅ 屏幕阅读器支持

```tsx
<button
  aria-label="Close"
  aria-pressed={isOpen}
  onClick={handleClick}
>
  <X aria-hidden="true" />
</button>
```

## SSR/SSG 支持

确保组件支持服务端渲染：

```tsx
// ✅ 正确
React.useEffect(() => {
  if (typeof window === 'undefined') return;
  // 浏览器特定代码
}, []);

// ❌ 错误
const width = window.innerWidth; // SSR 时会报错
```

## 浏览器兼容性

目标浏览器：

- Chrome/Edge 90+
- Firefox 88+
- Safari 15+
- iOS Safari 15+
- Android Chrome 90+

对于现代特性，使用特性检测和垫片：

```tsx
import { supports, ensureFeatures } from '@/lib/feature-detection';

// 确保特性可用
await ensureFeatures(['scroll-timeline', 'container-queries']);
```

## 文档

### 组件文档

每个组件都应该包含：

1. **JSDoc 注释**
2. **Props 接口文档**
3. **使用示例**
4. **Storybook stories**

```tsx
/**
 * AppBar component for top navigation
 *
 * @example
 * ```tsx
 * <AppBar
 *   title="My App"
 *   collapsible
 *   immersive
 * />
 * ```
 */
export const AppBar = React.forwardRef<HTMLElement, AppBarProps>(...);
```

### 更新 CHANGELOG

遵循 [Keep a Changelog](https://keepachangelog.com/) 格式：

```markdown
## [Unreleased]

### Added
- New feature description

### Changed
- Changed feature description

### Fixed
- Bug fix description
```

## 发布流程

1. 更新版本号：`npm version [major|minor|patch]`
2. 更新 CHANGELOG.md
3. 创建 Git tag：`git tag v0.x.0`
4. 推送：`git push && git push --tags`
5. GitHub Actions 自动发布到 npm

## 需要帮助？

- 📖 查看 [文档](./DOCUMENTATION.md)
- 💬 加入 [Discussions](https://github.com/your-username/shadcn-scaffold/discussions)
- 🐛 报告 [Issues](https://github.com/your-username/shadcn-scaffold/issues)

## 行为准则

请阅读并遵守我们的 [行为准则](./CODE_OF_CONDUCT.md)。

## 许可证

通过贡献代码，您同意您的贡献将使用与项目相同的许可证。
