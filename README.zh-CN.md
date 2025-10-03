# shadcn-scaffold

<div align="center">

[English](./README.md) • [简体中文](./README.zh-CN.md)

**受 Flutter 启发的现代化 React Scaffold 组件库**

使用 Next.js 15、Tailwind CSS v4 和 shadcn/ui 原则构建

[![Tests](https://img.shields.io/badge/tests-97%20passing-brightgreen)](https://github.com/yourusername/shadcn-scaffold)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb)](https://react.dev/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8)](https://tailwindcss.com/)

[English](./README.md) • 简体中文

</div>

---

## ✨ 特性

- 🎨 **Flutter 风格设计** - 熟悉的 Flutter Scaffold 组件模式
- 📱 **完全响应式** - 自动适配移动端/平板/桌面设备
- 🌊 **滚动驱动动画** - 现代 CSS 滚动响应式 UI 效果，带 JS 降级方案
- 🎭 **SSR 兼容** - 完整的 Next.js 服务端渲染支持
- 🎯 **TypeScript 优先** - 完整的类型安全和详细文档
- 🎨 **Tailwind CSS v4** - 最新的 CSS 特性和优化
- ♿ **无障碍支持** - 符合 ARIA 标准，支持键盘导航
- 🔧 **高度可定制** - 丰富的配置选项
- 🧪 **测试完善** - 97 个单元测试 + 50+ E2E 场景（100% 通过）
- 🚀 **Web-Native 优先** - HTML → CSS → JavaScript 渐进增强

## 📦 组件

### 🎯 Scaffold
整合应用所有部分的主布局组件。

**特性：**
- 自动响应式行为（移动端 ↔ 平板 ↔ 桌面）
- Drawer ↔ NavigationRail 自动切换
- 可配置断点
- CSS Grid 布局
- SSR 兼容

### 📊 AppBar
具有高级滚动效果的响应式应用栏。

**特性：**
- **沉浸式模式** - 滚动时从透明到实色渐变，带背景模糊
- **可折叠** - 滚动时高度从展开状态缩小到折叠状态
- **CSS 滚动驱动动画** - 原生浏览器动画，带 JS 降级方案
- 支持粘性、固定或静态定位
- 可配置阴影层级（0-5）
- Leading、标题和操作插槽

### 🎨 Drawer
支持手势的侧边抽屉导航。

**特性：**
- 左侧或右侧定位
- **滑动关闭**手势支持（触摸优化）
- 带模糊效果的背景遮罩
- 流畅的动画（基于 CSS）
- 键盘支持（Escape 关闭）
- Portal 渲染

### 🧭 BottomNavigationBar
Material Design 风格的移动端底部导航。

**特性：**
- 图标 + 可选标签（始终/选中时/从不）
- **徽章支持** - 数字或文字徽章
- **滚动隐藏** - 向下滚动时自动隐藏
- 带动画的激活状态指示器
- 流畅过渡
- 推荐最多 5 个项目

### 📐 NavigationRail
桌面端持久化侧边导航。

**特性：**
- 垂直导航栏
- 可选标签（紧凑/展开模式）
- 头部和底部插槽
- 徽章支持
- 带动画的选择指示器
- 可配置宽度

### ➕ FloatingActionButton（FAB）
带扩展变体的醒目操作按钮。

**特性：**
- 多种尺寸（小、中、大）
- **扩展模式**带标签
- 5 种定位选项（四角 + 底部居中）
- **滚动隐藏**带平滑动画
- 阴影层级（0-5）
- 图标 + 可选标签

### 📬 Snackbar
带可选操作的简短消息提示。

**特性：**
- 多种状态（默认、成功、警告、错误、信息）
- **自动隐藏时长**（可配置）
- 操作按钮支持
- 9 种定位选项
- **基于 Hook 的 API**（`useSnackbar`）
- 多消息队列支持

### 🪟 Modal
功能完整的对话框/模态框组件。

**特性：**
- 多种尺寸（sm、md、lg、xl、full）
- 可选的点击遮罩关闭
- 键盘支持（Escape 关闭）
- 带标题和描述的头部
- **打开时锁定页面滚动**
- 流畅的进入/退出动画
- 带 ModalFooter 辅助组件的底部

## 🚀 安装

### 前置要求

```bash
# 必需
Node.js 18+
React 19+
Next.js 15+
Tailwind CSS v4
```

### 使用 shadcn/ui CLI（推荐）

```bash
npx shadcn@latest add https://shadcn-scaffold.vercel.app/r/scaffold
```

### 手动安装

1. **复制组件**
```bash
# 复制所有 scaffold 组件
cp -r src/components/scaffold/* your-project/components/scaffold/
```

2. **安装依赖**
```bash
npm install clsx tailwind-merge class-variance-authority lucide-react
```

3. **更新 Tailwind 配置**
```js
// tailwind.config.js
module.exports = {
  content: [
    './components/scaffold/**/*.{ts,tsx}',
    // ... 其他路径
  ],
}
```

4. **导入全局样式**
```tsx
// app/layout.tsx
import '@/components/scaffold/scaffold-animations.css'
```

## 📖 使用方法

### 基础示例

```tsx
import {
  Scaffold,
  AppBar,
  Drawer,
  BottomNavigationBar,
  FloatingActionButton,
} from '@/components/scaffold';
import { Menu, Home, Search, Bell, Plus } from 'lucide-react';
import { useState } from 'react';

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
          title={<h1>我的应用</h1>}
        />
      }
      drawer={
        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          {/* 抽屉内容 */}
          <nav className="p-4">
            <a href="/">首页</a>
            <a href="/about">关于</a>
          </nav>
        </Drawer>
      }
      bottomNavigationBar={
        <BottomNavigationBar
          items={[
            { key: 'home', icon: <Home />, label: '首页' },
            { key: 'search', icon: <Search />, label: '搜索' },
            { key: 'notifications', icon: <Bell />, label: '通知', badge: 3 },
          ]}
          value={selectedTab}
          onValueChange={setSelectedTab}
        />
      }
      floatingActionButton={
        <FloatingActionButton
          icon={<Plus />}
          onClick={() => console.log('FAB 点击')}
        />
      }
    >
      {/* 页面内容 */}
      <div className="p-6">
        <h2>欢迎使用 shadcn-scaffold！</h2>
      </div>
    </Scaffold>
  );
}
```

### 沉浸式 AppBar 与滚动效果

```tsx
<AppBar
  immersive          // 滚动时从透明到实色
  collapsible        // 滚动时高度缩小
  expandedHeight={80}
  collapsedHeight={56}
  elevation={2}
  position="sticky"
  leading={<Menu />}
  title={<h1>我的应用</h1>}
  actions={
    <>
      <button><Bell /></button>
      <button><Settings /></button>
    </>
  }
/>
```

### 响应式布局（自适应导航）

```tsx
<Scaffold
  responsive                    // 启用响应式行为
  responsiveBreakpoint={1024}   // 在 1024px 切换

  // 移动端：Drawer
  drawer={
    <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
      <NavContent />
    </Drawer>
  }

  // 桌面端：NavigationRail
  navigationRail={
    <NavigationRail
      items={navItems}
      value={selected}
      onValueChange={setSelected}
    />
  }

  // 移动端：BottomNavigationBar
  bottomNavigationBar={
    <BottomNavigationBar
      items={navItems}
      value={selected}
      onValueChange={setSelected}
      hideOnScroll
    />
  }
>
  <YourContent />
</Scaffold>
```

### 使用 Snackbar Hook

```tsx
import { Snackbar, useSnackbar } from '@/components/scaffold';

function MyComponent() {
  const snackbar = useSnackbar();

  const handleSave = async () => {
    try {
      await saveData();
      snackbar.show('保存成功！', {
        severity: 'success',
        duration: 3000
      });
    } catch (error) {
      snackbar.show('保存失败', {
        severity: 'error'
      });
    }
  };

  return (
    <>
      <button onClick={handleSave}>保存</button>
      <Snackbar {...snackbar.snackbarProps} />
    </>
  );
}
```

### 带 Footer 的 Modal

```tsx
import { Modal, ModalFooter } from '@/components/scaffold';

function ConfirmDialog({ open, onOpenChange }) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="确认操作"
      description="您确定要继续吗？"
      size="md"
    >
      <p>此操作无法撤销。</p>

      <ModalFooter>
        <button onClick={() => onOpenChange(false)}>
          取消
        </button>
        <button
          className="bg-destructive text-destructive-foreground"
          onClick={handleConfirm}
        >
          确认
        </button>
      </ModalFooter>
    </Modal>
  );
}
```

## 🎨 示例

查看 `/examples` 目录获取完整演示：

- **📱 基础示例** - [`/examples/basic`](./src/app/examples/basic/page.tsx) - 所有组件协同工作
- **🌊 沉浸式** - [`/examples/immersive`](./src/app/examples/immersive/page.tsx) - 滚动驱动的沉浸式 AppBar
- **📐 响应式** - [`/examples/responsive`](./src/app/examples/responsive/page.tsx) - 响应式布局展示
- **🎯 Dashboard** - [`/examples/dashboard`](./src/app/examples/dashboard/page.tsx) - 完整应用示例
- **🎬 高级滚动** - [`/examples/advanced-scroll`](./src/app/examples/advanced-scroll/page.tsx) - 高级滚动动画

## 🛠️ 开发

### 设置

```bash
# 克隆仓库
git clone https://github.com/yourusername/shadcn-scaffold.git
cd shadcn-scaffold

# 安装依赖
npm install

# 运行开发服务器
npm run dev

# 访问 http://localhost:3000
```

### 可用脚本

```bash
# 开发
npm run dev              # 启动开发服务器
npm run build           # 构建生产版本
npm run start           # 启动生产服务器

# 测试
npm run test            # 运行单元测试
npm run test:ui         # 带 UI 运行测试
npm run test:coverage   # 生成覆盖率报告
npm run test:e2e        # 运行 E2E 测试
npm run test:e2e:ui     # 带 UI 运行 E2E 测试

# 代码质量
npm run lint            # 代码检查
npm run type-check      # TypeScript 类型检查

# 文档
npm run storybook       # 启动 Storybook
npm run build-storybook # 构建 Storybook
```

### 项目结构

```
shadcn-scaffold/
├── src/
│   ├── components/scaffold/
│   │   ├── __tests__/              # 单元测试
│   │   ├── *.stories.tsx           # Storybook 故事
│   │   ├── scaffold.tsx            # 主组件
│   │   ├── app-bar.tsx
│   │   ├── drawer.tsx
│   │   ├── bottom-navigation-bar.tsx
│   │   ├── navigation-rail.tsx
│   │   ├── floating-action-button.tsx
│   │   ├── modal.tsx
│   │   ├── snackbar.tsx
│   │   ├── scaffold-animations.css # CSS 动画
│   │   └── index.ts                # 导出
│   ├── lib/
│   │   ├── utils.ts                # 工具函数
│   │   └── feature-detection.ts   # 特性检测
│   └── app/
│       └── examples/               # 示例页面
├── tests/
│   └── e2e/                        # E2E 测试
├── docs/
│   ├── ARCHITECTURE.md             # 架构指南
│   ├── IMPLEMENTATION_GUIDE.md     # 实现指南
│   └── PROJECT_SUMMARY.md          # 项目总结
└── README.md
```

## 🌐 浏览器支持

### 完整支持（现代特性）
- ✅ **Chrome 115+** - 原生滚动驱动动画
- ✅ **Edge 115+** - 原生滚动驱动动画
- ✅ **Safari 17+** - 部分原生支持
- ✅ **Firefox 115+** - JavaScript 降级方案

### 优雅降级
- ✅ **Chrome 90+** - JavaScript 降级动画
- ✅ **Safari 14+** - JavaScript 降级动画
- ✅ **Firefox 88+** - JavaScript 降级动画
- ✅ **所有现代移动浏览器** - 触摸优化

库使用**渐进增强**：
1. **HTML** - 基础结构始终可用
2. **CSS** - 现代浏览器获得原生动画
3. **JavaScript** - 旧浏览器降级方案

## 🔧 技术栈

- **[Next.js 15](https://nextjs.org/)** - 带 App Router 的 React 框架
- **[React 19](https://react.dev/)** - UI 库
- **[TypeScript 5](https://www.typescriptlang.org/)** - 类型安全
- **[Tailwind CSS v4](https://tailwindcss.com/)** - 实用优先的 CSS
- **[shadcn/ui](https://ui.shadcn.com)** - 组件模式
- **[Lucide React](https://lucide.dev/)** - 图标系统
- **[Vitest](https://vitest.dev/)** - 单元测试
- **[Playwright](https://playwright.dev/)** - E2E 测试
- **[Storybook](https://storybook.js.org/)** - 组件文档

## 📊 统计

- **组件数量**：8 个核心组件
- **测试覆盖**：97 个单元测试（100% 通过）
- **E2E 测试**：3 个测试套件中的 50+ 场景
- **代码量**：8000+ 行生产代码
- **文档**：2000+ 行
- **包体积**：通过 tree-shaking 优化

## 🤝 贡献

欢迎贡献！请先阅读我们的[贡献指南](CONTRIBUTING.md)。

### 开发工作流

1. Fork 仓库
2. 创建特性分支（`git checkout -b feature/amazing-feature`）
3. 进行更改
4. 为更改添加测试
5. 运行测试（`npm run test`）
6. 提交更改（`git commit -m 'feat: add amazing feature'`）
7. 推送到分支（`git push origin feature/amazing-feature`）
8. 提交 Pull Request

### 提交规范

我们使用[约定式提交](https://www.conventionalcommits.org/zh-hans/)：

- `feat:` - 新功能
- `fix:` - Bug 修复
- `docs:` - 文档更改
- `style:` - 代码样式更改（格式化）
- `refactor:` - 代码重构
- `test:` - 测试更改
- `chore:` - 构建过程或工具更改

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件。

## 🙏 致谢

- 灵感来自 [Flutter 的 Scaffold widget](https://api.flutter.dev/flutter/material/Scaffold-class.html)
- 遵循 [shadcn/ui](https://ui.shadcn.com) 原则构建
- 使用 [Chrome 的滚动驱动动画](https://developer.chrome.com/docs/css-ui/scroll-driven-animations)
- 设计模式来自 [Material Design 3](https://m3.material.io/)

## 📚 文档

- **[架构指南](./docs/ARCHITECTURE.md)** - 系统设计和技术决策
- **[实现指南](./docs/IMPLEMENTATION_GUIDE.md)** - 详细使用和 API 参考
- **[项目总结](./docs/PROJECT_SUMMARY.md)** - 项目概览和统计

## 🔗 链接

- [文档](https://shadcn-scaffold.vercel.app/docs)
- [示例](https://shadcn-scaffold.vercel.app/examples)
- [Storybook](https://shadcn-scaffold.vercel.app/storybook)
- [GitHub](https://github.com/yourusername/shadcn-scaffold)

---

<div align="center">
  <p>使用 ❤️ 和现代 Web 技术构建</p>
  <p>
    <a href="https://nextjs.org">Next.js</a> •
    <a href="https://react.dev">React</a> •
    <a href="https://tailwindcss.com">Tailwind CSS</a> •
    <a href="https://ui.shadcn.com">shadcn/ui</a>
  </p>
</div>
