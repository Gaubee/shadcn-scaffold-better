**构建一套Scaffold组件**。
使用最先进的 css-grid、scroll-animation 技术，配合tailwindcssv4+shadcnui。

**参考 Flutter 的 Scaffold 组件理念，将这几个组件进行有机地融合：**

- AppBar（含沉浸式、滚动响应、折叠）
- Drawer（左侧/右侧，手势返回）
- BottomNavigationBar（或 NavigationRail）
- FloatingActionButton、SnackBar、Modal（如全局设置面板）
- 良好的SSR支持
- 良好的响应式支持
  - 基于先进容器查询技术
  - 包括Mobile / Tablet / Desktop，以及各种折叠屏设备的支持。

**补充说明：**

- Scaffold是一套组件的入口，它本身不集成 Router，一切都可以用状态来控制，从而可以跟任何环境集成。
- Web-Native技术优先：
  - 优先使用原生的 HTML、CSS 技术来实现各种功能
  - 可以用JS用来优雅地提供降级处理的方案
  - 最终目标是面向现代先进的浏览器，可以勇敢尝试各种新技术
- 优秀的 typescript 代码质量和规范
- 优秀的 git-commit 记录和规范

**参考资料：**

-https://developer.chrome.com/docs/css-ui/scroll-driven-animations
-https://context7.com/websites/developer_chrome/llms.txt
-https://context7.com/flutter/website/llms.txt?topic=Scaffold

**最终产物：**

- 一套 shadcnui 组件库，可以通过 shadcnui cli 工具来被其它项目安装。
- 基于 vitest、playwright、storybook，来构建单元测试和e2e测试。
- 一系列的 Example Page，来展示各种组件的融合使用。