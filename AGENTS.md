**构建一套 Scaffold 组件**。
使用最先进的 css-grid、scroll-animation 技术，配合 tailwindcssv4+shadcnui。

**参考 Flutter 的 Scaffold 组件理念，将这几个组件进行有机地融合：**

- AppBar（含沉浸式、滚动响应、折叠）
- Drawer（左侧/右侧，手势返回）
- BottomNavigationBar（或 NavigationRail）
- FloatingActionButton、SnackBar、Modal（如全局设置面板）
- 良好的 SSR 支持
- 良好的响应式支持
  - 基于先进容器查询技术
  - 包括 Mobile / Tablet / Desktop，以及各种折叠屏设备的支持。

**补充说明：**

- Scaffold 是一套组件的入口，它本身不集成 Router，一切都可以用状态来控制，从而可以跟任何环境集成。
- 充分利用 shadcnui 已经存在的组件来进行二次构建，尽量避免重复重复造轮子，学习 shadcnui 的模块化规范来构建渐进式的组件能力。
- Web-Native 技术优先：
  - 优先使用原生的 HTML、CSS 技术来实现各种功能
  - 可以用 JS 用来优雅地提供降级处理的方案，但要考虑按需导入的技术，理想情况下我们只使用 HTML+CSS，只在必要的情况下引入 JS 垫片
    - **提示**：我们需要引入一种通用的垫片导入方案
  - 有些功能无法用 HTML+CSS 实现，但是应该从 W3C 组织和社区的最佳实践出发，去假设和设计一套 HTML/CSS 接口，然后用 JS 垫片来实现。
    - **注意**：因为我们使用了 tailwindcss，所以可以理解成我们通过 className 来定义了 css 能力，然后用 JS 垫片补货 className 来实现垫片能力。
    - **同理**：我们使用 HTML attribute 来定义能力 HTML 能力，然后用监听属性变动来实现 JS 垫片
    - **提示**：我们需要设计一种通用的能力适配器（类似`CSS.supports`），从而为自动引入垫片提供基础支持
  - 最终目标是面向现代先进的浏览器，可以勇敢尝试各种新技术
- 顶尖的 typescript 代码质量
- 顶尖的 git-commit、CHANGELOG 记录
- 使用 vitest 的最佳实践进行测试
- 使用 tailwindcss v4 的最佳实践进行开发

**参考资料：**

- https://context7.com/websites/ui_shadcn/llms.txt?tokens=172873
- https://context7.com/websites/developer_chrome/llms.txt?tokens=3413830
- https://context7.com/websites/flutter_dev/llms.txt?tokens=4386188
- https://context7.com/websites/react-spectrum_adobe_com-react-aria-getting-started.html/llms.txt
- https://context7.com/websites/tailwindcss/llms.txt?topic=vite
- GitHub - tailwindlabs/tailwindcss-container-queries: A plugin for Tailwind CSS v3.2+ that provides u
- https://developer.chrome.com/docs/css-ui/scroll-driven-animations

**最终产物：**

- 一套 shadcnui 组件库，可以通过 shadcnui cli 工具来被其它项目安装。
- 基于 vitest、playwright、storybook，来构建单元测试和 e2e 测试。
- 一系列的 Example Page，来展示各种组件的融合使用。
- 清爽干净的文件结构
  - 主代码结构清晰
  - 测试代码结构清晰
  - 贡献者文档结构清晰
  - 项目文档结构清晰
