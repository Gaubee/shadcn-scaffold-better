这是之前让AI开发的一个模拟 Flutter-Scaffold 做的一个 Shadcn-Scafflod 组件。请你阅读文档和代码形成认知，我们需要在此基础上展开工作。

---

我是总架构师，我带你逐步进行重构工作。
首先，从 scaffold.tsx 这个文件开始，这是我们的入口。
它的问题在于太过复杂，我们需要重构它。
Scaffold的职责提供一个Grid布局，然后提供一系列的solt来放置组件。

比如说 `appBar?: React.ReactElement<AppBarProps>`
这个设计是错误的，应该是 `appBar?: (()=>React.ReactNode)|React.ReactNode` 才对。
以此类推。

---

我以及初步完成了对 scaffold 组件的重新设计。你可以阅读 git-history 和 AGENTS.md 知道，这个组件最开始是仿照了 Flutter-Scaffold 来进行设计的。后来我对这个组件进行了重新设计。
但目前只是初步完成了组件的初步设计，接下来，我需要你剔除无关的文件和代码，基于我的新设计，围绕DEMO的重新开发，来完成对整个项目的代码重新优化，并修复组件的一些BUG。

请你充分利用 gemini-analyzer 这个子代理来进行问题分析，有什么想法也可以和 gemini-analyzer 一起分析讨论。

---

这是 shadcnui 的 sidebar 组件：src/components/ui/sidebar.tsx
它是一个专门面向放置在侧边的组件，我需要你参考 sidebar，帮我实现一个 src/components/scaffold/rail-navbar.tsx 组件（不是navigation-rail.tsx 这个旧组件）。

我需要你首先阅读 src/components/scaffold/scaffold.tsx ，我们的目的是为 rail 这个solt 提供一个通用的 rail-navbar 组件

1. 能同时支持 侧边与 底部
2. 能最多支持到二级菜单，类似 SidebarMenuSub。我们应该有一个 NavbarMenuSub？
   1. 在 railPosition 为 `inline-start/end(侧边)`的时候。因为文字是横向的，因此我们容易纵向滚动，所以这时候采用 SidebarMenuSub 这种缩紧渲染子列表的方式来展示
   1. 在 railPosition 为 `block-end（底部）`的时候。同样的道理，我们采用 DropdownMenu 的方式来渲染我们的二级菜单

我们的目的不是做 sidebar 那种强大，共能全面的组件，我们只是提供一个非常简单的，能支持二级菜单的功能导航功能，仅此而已。

---

1. 在 advanced-navigation 中，请你将“使用说明”使用sheet组件来展示，打开按钮在顶部地址栏那边，在`Router：`那边开一个 `?` 按钮，点击打开这个使用说明
2. 我决定将你的 navigation-providers 正式收入，迁移到 `scaffold/navigation/*`这个文件夹下，并将每个provider分开成独立的文件维护
3. 我还需要你首先一个基于 [navigation-api](https://developer.mozilla.org/en-US/docs/Web/API/Navigation_API) 的provider
4. 我还需要你实现一个 auto-provider，默认使用 navigation-provider，如果浏览器不支持（目前主要是safari不支持），降级使用 browser/history-provider，如果是ssr渲染：那么使用browser-provider，如果是客户端渲染，那么使用history-provider模式

---

接下来，我需要你在 src/app/examples 中创建一个事例页面，专门用来展示你的rail-navbar组件。参考 examples/responsive-demo。

不过 examples/responsive-demo 挺混乱的，有两个Demo1/Demo2，Mobile First和Desktop First其实用布局切换按钮来切换就行了，完全没必要做两个Demo。
另外它应该配合Scale来进行缩放，否则这个Demo在移动设备下基本不可用。

所以我建议你首先封装好这个“响应式容器”，然后再基于这个容器去开发你的 example/rail-navbar 页面

---

1. `RailNavbar railPosition="block-end"`要同时考虑 `block-end/block-start/inline-start/inline-end` 这四种位置可能，因为我们会开放自定义布局的功能，因此用户可能会将rail进行自定义摆放，这将影响弹出层弹出的位置
2. 要支持图标，并且优先级很高，RailNavbar组件需要支持 `iconOnly` 属性（或者你有更好的命名），不论还是`block/inline-*`都要支持
    1. 如果是`inline-*`模式，那么整个 RailNavbar 中的按钮都不显示文字，只显示图标（如果没有图标，就把按钮的第一个文字作为图标Symbol），此时不论即便是`inline-*`模式，二级菜单也不显示了，点击图标按钮，和`block-*`一样，用浮动层去显示我们的二级菜单


---

1. `<RailNavbarMenuButton icon={<Home/>} label={"Home"} compact={false}>` 应该这样
2. RailNavbarMenuButton的compact是缺省的，默认是`compact={useCompact()}`，也就是说，RailNavbarMenu 将提供 CompactContext.Provider。也就是说一般情况下，我只需要将 compact 配置在 RailNavbarMenu 就行了。

我觉得你得读一下 shadcnui如何使用`@radix-ui/react-navigation-menu`
 阅读 src/components/ui/navigation-menu.tsx和 src/components/ui/sidebar.tsx

---

这是 shadcnui 的 breadcrumb 组件：src/components/ui/breadcrumb.tsx
这是 shadcnui 的 menubar 组件：src/components/ui/menubar.tsx

我需要你首先阅读 src/components/scaffold/scaffold.tsx ，我们的目的是为 appBar 这个 solt 提供一个通用的 top-navbar 组件。

1. 它的左侧，是 Nav导航功能
2. 它的中间，是 Title当前路由的标题信息
3. 它的右侧，是 Actions功能按钮

整个组件采用响应式布局，基于 `@container` 响应式查询来进行渲染（当然也可以参考 scaffold 提供的三种模式： mobile/tablet/desktop，但是最好基于响应式查询）。

1. Nav导航功能
   1. 如果空间充足，使用 breadcrumb 来显示我们的导航信息
   2. 否则只渲染一个“返回按钮”（如果可以返回的话），长按返回按钮，会弹出一个历史导航记录（参考IOS系统的导航栏的返回按钮长按功能，滑动到某一项松开手就可以进行跳转）
2. Title当前路由的标题信息
   - 用户可以自定义Title的内容
3. Actions功能按钮
   1. 如果空间充足，使用 navigation-menu 来显示我们的功能按钮
   2. 否则使用 dropdown-menu 来渲染我们的功能按钮
4. 参考 rail-navbar，我们的目的不是做一个全能的组件，而是做一个能满足90%需求的组件，并保有一定的可扩展性、可组合性，用户可以在我们组件结构的基础上进行自定义，比如说，用户可以在左侧放“Actions功能按钮”，右侧放一个 Button-Group，这是完全可以的。
