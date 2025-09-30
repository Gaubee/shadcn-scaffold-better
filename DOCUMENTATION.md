# Scaffold UI - 完整文档

## 📚 目录

- [简介](#简介)
- [特性](#特性)
- [安装](#安装)
- [快速开始](#快速开始)
- [组件](#组件)
  - [Scaffold](#scaffold)
  - [AppBar](#appbar)
  - [Drawer](#drawer)
  - [BottomNavigationBar](#bottomnavigationbar)
  - [NavigationRail](#navigationrail)
  - [FloatingActionButton](#floatingactionbutton)
  - [Snackbar](#snackbar)
  - [Modal](#modal)
- [高级功能](#高级功能)
- [最佳实践](#最佳实践)
- [API 参考](#api-参考)

---

## 简介

Scaffold UI 是一个受 Flutter 启发的 React 组件库，专为 Next.js 应用程序设计。它提供了一套完整的布局组件，结合了现代 Web 技术（CSS Grid、Scroll-driven Animations）和优秀的用户体验。

### 设计理念

- **Flutter 风格**：借鉴 Flutter 的 Scaffold 组件设计理念
- **响应式优先**：自适应移动端、平板和桌面设备
- **性能优化**：内置 SSR 支持和性能优化
- **类型安全**：完整的 TypeScript 支持
- **可访问性**：遵循 WCAG 标准

---

## 特性

✨ **核心特性**

- 🎨 **完整的布局系统**：AppBar、Drawer、BottomNav、NavigationRail
- 🌊 **滚动驱动动画**：使用最新的 CSS scroll-timeline API
- 📱 **响应式设计**：自动适配移动/平板/桌面
- 🎯 **手势支持**：原生手势交互，支持滑动关闭
- 🔄 **CSS Grid 布局**：现代化的网格布局系统
- 📱 **折叠屏支持**：支持折叠设备和双屏设备
- ⚡ **性能优化**：requestAnimationFrame 优化和代码分割
- 🌗 **深色模式**：内置深色模式支持
- ♿ **可访问性**：完整的键盘导航和屏幕阅读器支持

---

## 安装

### 方式 1：使用 shadcn/ui CLI（推荐）

```bash
npx shadcn-ui@latest add scaffold
```

### 方式 2：手动安装

```bash
# 安装依赖
npm install class-variance-authority clsx tailwind-merge lucide-react

# 复制组件文件
# 从 src/components/scaffold/ 复制所有组件到你的项目
```

### 方式 3：克隆仓库

```bash
git clone https://github.com/your-org/scaffold-ui.git
cd scaffold-ui
npm install
```

---

## 快速开始

### 基础示例

```tsx
'use client';

import { useState } from 'react';
import { Scaffold, AppBar, Drawer, BottomNavigationBar } from '@/components/scaffold';
import { Menu, Home, Search, User } from 'lucide-react';

export default function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('home');

  return (
    <Scaffold
      appBar={
        <AppBar
          title="我的应用"
          leading={
            <button onClick={() => setDrawerOpen(true)}>
              <Menu />
            </button>
          }
        />
      }
      drawer={
        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          <div className="p-6">导航菜单</div>
        </Drawer>
      }
      bottomNavigationBar={
        <BottomNavigationBar
          value={selectedTab}
          onValueChange={setSelectedTab}
          items={[
            { key: 'home', icon: <Home />, label: '首页' },
            { key: 'search', icon: <Search />, label: '搜索' },
            { key: 'profile', icon: <User />, label: '个人' },
          ]}
        />
      }
    >
      <div className="p-6">
        <h1>欢迎使用 Scaffold UI</h1>
      </div>
    </Scaffold>
  );
}
```

---

## 组件

### Scaffold

主布局容器，整合所有子组件。

```tsx
<Scaffold
  appBar={<AppBar title="标题" />}
  drawer={<Drawer>菜单</Drawer>}
  bottomNavigationBar={<BottomNavigationBar />}
  navigationRail={<NavigationRail />}
  floatingActionButton={<FloatingActionButton />}
  responsive={true}
  responsiveBreakpoint={1024}
>
  {/* 主内容 */}
</Scaffold>
```

**Props:**

- `appBar`: AppBar 组件
- `drawer`: 左侧 Drawer
- `endDrawer`: 右侧 Drawer
- `bottomNavigationBar`: 底部导航
- `navigationRail`: 侧边栏导航（桌面端）
- `floatingActionButton`: 浮动操作按钮
- `responsive`: 是否启用响应式（默认 true）
- `responsiveBreakpoint`: 响应式断点（默认 1024px）

---

### AppBar

顶部应用栏，支持沉浸式和折叠效果。

```tsx
<AppBar
  title="应用标题"
  leading={<MenuButton />}
  actions={<ActionButtons />}
  collapsible={true}
  immersive={true}
  elevation={2}
  position="sticky"
/>
```

**Props:**

- `title`: 标题
- `leading`: 左侧元素（通常是菜单按钮）
- `actions`: 右侧操作按钮
- `collapsible`: 是否可折叠
- `immersive`: 是否启用沉浸式效果
- `expandedHeight`: 展开高度（默认 64px）
- `collapsedHeight`: 折叠高度（默认 56px）
- `elevation`: 阴影级别（0-5）
- `position`: 定位方式（'fixed' | 'sticky' | 'static'）

**特性:**

- 🌊 滚动时自动折叠
- 🎨 沉浸式透明效果
- 🔄 平滑的高度过渡
- ⚡ requestAnimationFrame 优化

---

### Drawer

侧边抽屉，支持手势滑动。

```tsx
<Drawer
  open={open}
  onOpenChange={setOpen}
  side="left"
  width={280}
  gestureEnabled={true}
  showBackdrop={true}
>
  <nav>导航内容</nav>
</Drawer>
```

**Props:**

- `open`: 是否打开
- `onOpenChange`: 状态改变回调
- `side`: 位置（'left' | 'right'）
- `width`: 宽度
- `gestureEnabled`: 是否启用手势
- `showBackdrop`: 是否显示遮罩
- `elevation`: 阴影级别

**手势支持:**

- 👆 滑动关闭
- 🎯 速度检测
- 🔄 橡皮筋效果
- ⌨️ ESC 键关闭

---

### BottomNavigationBar

底部导航栏。

```tsx
<BottomNavigationBar
  value={selected}
  onValueChange={setSelected}
  items={[
    { key: 'home', icon: <Home />, label: '首页', badge: 3 },
    { key: 'search', icon: <Search />, label: '搜索' },
  ]}
  showLabels={true}
  hideOnScroll={false}
/>
```

**Props:**

- `items`: 导航项数组
- `value`: 当前选中项
- `onValueChange`: 选中改变回调
- `showLabels`: 是否显示标签（true | false | 'selected'）
- `hideOnScroll`: 滚动时隐藏
- `elevation`: 阴影级别

---

### NavigationRail

桌面端侧边导航栏。

```tsx
<NavigationRail
  value={selected}
  onValueChange={setSelected}
  items={[
    { key: 'home', icon: <Home />, label: '首页' },
  ]}
  header={<Logo />}
  footer={<Settings />}
  width={80}
  showLabels={false}
/>
```

---

### FloatingActionButton

浮动操作按钮。

```tsx
<FloatingActionButton
  icon={<Plus />}
  label="新建"
  extended={true}
  position="bottom-right"
  hideOnScroll={true}
  onClick={() => {}}
/>
```

---

### Snackbar

消息提示条。

```tsx
<Snackbar
  open={open}
  onOpenChange={setOpen}
  message="操作成功"
  severity="success"
  action={{ label: '撤销', onClick: handleUndo }}
  autoHideDuration={6000}
/>
```

**或使用 Hook:**

```tsx
const { show, hide, snackbarProps } = useSnackbar();

// 显示消息
show('保存成功', { severity: 'success' });

// 在组件中
<Snackbar {...snackbarProps} />
```

---

### Modal

模态对话框。

```tsx
<Modal
  open={open}
  onOpenChange={setOpen}
  title="标题"
  description="描述文本"
  size="md"
>
  <div>对话框内容</div>
  <ModalFooter>
    <button>取消</button>
    <button>确认</button>
  </ModalFooter>
</Modal>
```

---

## 高级功能

### 1. 滚动驱动动画

使用 CSS scroll-timeline API：

```css
.scroll-fade-in {
  animation: fade-in-up linear both;
  animation-timeline: view();
  animation-range: entry 0% cover 30%;
}
```

### 2. 折叠屏设备支持

自动检测折叠设备：

```tsx
// Scaffold 组件会自动处理
<Scaffold responsive={true}>
  {/* 内容 */}
</Scaffold>
```

### 3. CSS Grid 布局

Scaffold 使用 CSS Grid 提供灵活布局：

```tsx
// 自动生成网格区域
grid-template-areas:
  "nav header header"
  "nav main main"
  "nav footer footer"
```

### 4. SSR 优化

- 预加载关键资源
- 代码分割
- 性能优化头部
- 图片优化

---

## 最佳实践

### 1. 响应式布局

```tsx
<Scaffold
  responsive={true}
  drawer={<Drawer>移动端菜单</Drawer>}
  navigationRail={<NavigationRail>桌面端菜单</NavigationRail>}
>
  {/* Scaffold 会自动根据屏幕大小切换 */}
</Scaffold>
```

### 2. 性能优化

```tsx
// 使用 React.memo 优化重渲染
const MemoizedDrawer = React.memo(Drawer);

// 懒加载大型组件
const HeavyComponent = lazy(() => import('./HeavyComponent'));
```

### 3. 可访问性

```tsx
<AppBar
  title="应用"
  leading={
    <button aria-label="打开菜单">
      <Menu />
    </button>
  }
/>
```

---

## API 参考

完整的 API 文档请参考各组件的 TypeScript 类型定义。

所有组件都支持：
- `className`: 自定义类名
- `style`: 内联样式
- React 标准 props（ref, key 等）

---

## 测试

```bash
# 运行单元测试
npm test

# 运行 E2E 测试
npm run test:e2e

# 查看测试覆盖率
npm run test:coverage
```

---

## Storybook

```bash
# 启动 Storybook
npm run storybook

# 构建 Storybook
npm run build-storybook
```

---

## 贡献

欢迎贡献！请查看 [CONTRIBUTING.md](CONTRIBUTING.md)。

---

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件。