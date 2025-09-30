# 🎨 Scaffold UI

<div align="center">

**一个受 Flutter 启发的现代化 React 组件库**

使用 Next.js 15、Tailwind CSS v4 和 shadcn/ui 构建

[![npm version](https://img.shields.io/npm/v/scaffold-ui)](https://www.npmjs.com/package/scaffold-ui)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)

[English](./README.md) • [在线演示](https://scaffold-ui.dev) • [文档](./DOCUMENTATION.md) • [Storybook](https://storybook.scaffold-ui.dev)

</div>

---

## ✨ 特性

### 🎯 核心功能

- 🎨 **完整的布局系统** - AppBar、Drawer、BottomNav、NavigationRail 等
- 🌊 **滚动驱动动画** - 使用最新的 CSS scroll-timeline API
- 📱 **响应式设计** - 自适应移动/平板/桌面设备，支持折叠屏
- 🎯 **手势支持** - 原生级别的滑动交互，支持速度检测
- 🔄 **CSS Grid 布局** - 现代化的网格布局系统
- ⚡ **性能优化** - SSR 支持、requestAnimationFrame 优化、代码分割
- 🌗 **深色模式** - 内置深色模式，自动跟随系统
- ♿ **可访问性** - 完整的键盘导航和屏幕阅读器支持
- 🧪 **完整测试** - 单元测试 + E2E 测试，覆盖率 > 80%
- 📚 **Storybook** - 交互式组件文档

### 🚀 技术栈

- **框架**: Next.js 15 (React 19, App Router)
- **样式**: Tailwind CSS v4 + CSS-in-JS
- **组件**: shadcn/ui 兼容
- **图标**: Lucide React
- **测试**: Vitest + Playwright + Testing Library
- **文档**: Storybook 9
- **类型**: TypeScript 5 + 完整类型支持

---

## 📦 安装

### 方式 1: 使用 shadcn/ui CLI（推荐）

```bash
npx shadcn-ui@latest add scaffold
```

### 方式 2: 手动安装

```bash
# 安装依赖
npm install class-variance-authority clsx tailwind-merge lucide-react

# 复制组件到你的项目
# 从 src/components/scaffold/ 目录复制所有文件
```

---

## 🚀 快速开始

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
              <Menu className="w-6 h-6" />
            </button>
          }
        />
      }
      drawer={
        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          <nav className="p-6">
            <h2 className="text-xl font-bold mb-4">导航</h2>
          </nav>
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
        <h1 className="text-3xl font-bold">欢迎使用 Scaffold UI</h1>
      </div>
    </Scaffold>
  );
}
```

---

## 📚 核心组件

### Scaffold - 主布局容器

整合所有子组件的主容器。

```tsx
<Scaffold
  appBar={<AppBar />}
  drawer={<Drawer />}
  bottomNavigationBar={<BottomNavigationBar />}
  navigationRail={<NavigationRail />}
  floatingActionButton={<FloatingActionButton />}
  responsive={true}
>
  {children}
</Scaffold>
```

### AppBar - 顶部应用栏

支持沉浸式和折叠效果。

✅ 滚动折叠 • ✅ 沉浸式透明 • ✅ 平滑过渡 • ✅ 性能优化

### Drawer - 侧边抽屉

支持手势滑动关闭。

✅ 手势支持 • ✅ 速度检测 • ✅ 橡皮筋效果 • ✅ ESC 键

### BottomNavigationBar - 底部导航

移动端友好的底部导航。

✅ 徽章支持 • ✅ 滚动隐藏 • ✅ 平滑动画

### NavigationRail - 侧边导航栏

桌面端持久化导航。

✅ 垂直布局 • ✅ 可选标签 • ✅ 头尾插槽

### FloatingActionButton - 浮动按钮

主要操作按钮。

✅ 扩展模式 • ✅ 滚动隐藏 • ✅ 多位置

### Snackbar - 消息提示

简短消息提示。

✅ 自动隐藏 • ✅ 操作按钮 • ✅ 多种样式 • ✅ Hook API

### Modal - 模态对话框

全功能对话框组件。

✅ 多种尺寸 • ✅ 点击关闭 • ✅ ESC 键 • ✅ Footer 组件

---

## 🎯 示例

### 本地运行

```bash
npm run dev
```

访问示例：

- [基础示例](http://localhost:3000/examples/basic) - 完整功能展示
- [沉浸式效果](http://localhost:3000/examples/immersive) - 滚动动画
- [响应式布局](http://localhost:3000/examples/responsive) - 自适应设计

---

## 🧪 测试

```bash
# 单元测试
npm test

# 测试覆盖率
npm run test:coverage

# E2E 测试
npm run test:e2e

# 测试 UI 模式
npm run test:ui
npm run test:e2e:ui
```

---

## 📖 文档

- **完整文档**: [DOCUMENTATION.md](./DOCUMENTATION.md)
- **Storybook**: `npm run storybook`
- **API 参考**: 完整 TypeScript 类型定义

---

## 🛠️ 开发

```bash
npm install          # 安装依赖
npm run dev          # 开发服务器
npm run build        # 构建项目
npm test             # 运行测试
npm run storybook    # 启动 Storybook
npm run lint         # 代码检查
```

---

## 🌟 高级功能

### 滚动驱动动画

```css
.scroll-fade-in {
  animation: fade-in-up linear both;
  animation-timeline: view();
  animation-range: entry 0% cover 30%;
}
```

### 折叠屏设备支持

```tsx
<Scaffold responsive={true}>
  {/* 自动适配折叠屏 */}
</Scaffold>
```

### CSS Grid 布局

```css
grid-template-areas:
  "nav header header"
  "nav main main"
  "nav footer footer"
```

### SSR 优化

✅ 预加载关键资源 • ✅ 代码分割 • ✅ 性能头部 • ✅ 图片优化

---

## 🤝 贡献

欢迎贡献！步骤：

1. Fork 仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add AmazingFeature'`)
4. 推送分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

---

## 📝 许可证

MIT License © 2025

---

## 🙏 致谢

- [Flutter](https://flutter.dev/) - 设计灵感
- [shadcn/ui](https://ui.shadcn.com/) - 组件架构
- [Tailwind CSS](https://tailwindcss.com/) - 样式系统
- [Next.js](https://nextjs.org/) - React 框架

---

<div align="center">

**⭐ 如果有帮助，请给个 Star！**

Made with ❤️ by the Scaffold UI Team

</div>