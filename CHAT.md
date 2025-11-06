## DONE

---

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
这是 shadcnui 的 dropdown-menu 组件：src/components/ui/dropdown-menu.tsx
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

---

1. 首先，这三个子组件是独立的，AppNavBar只是一个容器可以放置它们三个。所以，首先请你心间一个`components/appbar`的文件夹来存放这三个组件（三个独立文件）
   1. 这三个组件的名字和AppNavBar没关系，它们可以被组合到AppNavBar中，也可以自由放置，比如我直接把它放在我的Detail内容中；比如我又做了一个 TopAppBar/CenterAlignedTopAppBar/MediumTopAppBar/LargeTopAppBar/BottomAppBar ，这都使用这个导航组件吗？
   2. 它们的断点位置不是写死的，而是事实计算出来的。比如说“Nav导航功能”，它在渲染“单个返回按钮”的时候，其实 breadcrumb 也渲染了，只是不可见、不可点击、不可操作的，但是它依然存在，只是被隐藏了。然后我们监听它的宽度，如果容器的空间足够容纳它，那就渲染出来。
   3. 上面这个例子我只是简单的举例它有两种变体的情况。如果有多种变体，你就要考虑同时多个变体渲染会导致的性能牺牲问题，此时我们应该采用只渲染临近的可能，比如从小到大，有 A/B/C/D 四种变体，那么渲染A的时候同时隐藏渲染B，渲染B到时候同时隐藏渲染A/C，渲染C的时候同时隐藏渲染B/D，渲染D的时候同时隐藏渲染C，这样我们就知道什么时候应该切换到某个临近的变体。但也也意味着有些时候，突然切变大小的时候，可能需要3次切变变体。但我们可以使用动画来减少视觉上的突变，这是一种平衡。
   4. 需要你封装一个“响应式变体选择器”，并通过 独立的策略配置 来实现我上诉的效果。需要实现两种策略：邻近(隐藏)渲染、全量(隐藏)渲染，并全部默认使用邻近渲染
2. 这三个组件各自使用容器查询来实现响应式伸缩变形，容器查询对应的梯度你在阅读scaffold的时候应该能看到：
   ```
   const ContainerQueryBreakpoints = {
     "3xs": 256,
     "2xs": 288,
     xs: 320,
     sm: 384,
     md: 448,
     lg: 512,
     xl: 576,
     "2xl": 672,
     "3xl": 768,
     "4xl": 896,
     "5xl": 1024,
     "6xl": 1152,
     "7xl": 1280,
   } as const;
   ```
   这样的结果就是，即便是在scaffold-tablet 模式下，这三个组件也有可能因为tablet的宽度不同而改变形态，这样是最灵活的。

---

1.  [ResponsiveContainer](src/components/ui/responsive-container.tsx)这个组件，任何有需要展示或者测试响应式效果的，都可以用这个组件来做到。
2.  因为你只是测试AppBar这种场景，所以首先我需要你扩展 ResponsiveContainer ，实现自定义的 `DEVICE_PRESETS` 配置
3.  然后用它来更新我们的测试页面，重新测试验收。（因为我看到的效果并没有达成我们的预期，所以我需要你重新测试验收）

---

1. responsive-variant 中的 variants 应该是一个 Record 结构
2. responsive-variant 中的 strategy 应该是一个 provider 对象，那么比如 adjacentProvider 应该是： `adjacentProvider(['compact','normal','expanded'])`这里可以提供配置排序
3. 我看到你创建了很多 examples/appbar 相关的页面，注意，我们只需要留下 appbar-responsive 这个页面。
4. 请你完善这个 appbar-responsive 页面，并在此基础上完成测试

---

## TODO

---

responsive-variant 需要加入更多精细的控制：

1. 比如策略中，什么时候应该切换到下一个变体，现在是基于 `(w1 < w < w2) ? w1 : w2`，这里是有争议的，因为 w2 可能是非刚性的支持伸缩
2. 比如两个变体切换的时候，自定义动画

---

目前我们是直接从 scaffold 暴露出一个非常简单的 navigationState+onNavigationChange ，这是一种基于不可变编程的思想。后来为了更好的适配native的各种功能，又加了一个 navigationProvider。

1. 我们需要先从这里入手，将这三者整合成 `navigation: NavigationProvider<TypeSafe> = useMemoryNavigationProvider()` 这样的能力。
2. 我们的核心参考是 [Navigation_API](https://developer.mozilla.org/en-US/docs/Web/API/Navigation_API)
3. 首先我们需要对 NavigationProvider 进行升级，扩展一些可选的能力，比如 getNavigationState、setNavigationState、onNavigationStateChange
4. 另外，目前 pushState/replaceState 这两个接口的参数定义也不大合理，需要简化。参考Navigation_API
5. 还有，我们需要补充一些接口，比如 traverseTo() / reload()
6. 我建议充分参考 Web-Navigation_API，它很强大，但是我们只需要一个满足90%场景的功能子集
7. 我们优先完成 web-navigation-api 和 memory 这两种 provider。
8. 对于 history-api 的支持，我们需要充分利用它是可以存储 State 的能力，同时假设开发中没有使用iframe等元素来干扰 history-api，在这种理想情况下去实现
9. 对于 browser-hash 的支持，其实一样，它和 history-api 的差别主要在于一个用的是path一个用的是hash，用path的需要一定的服务端或者或者service-worker支持；用hash的主要是在纯粹的spa场景
10. safari 因为不支持Web-Navigation_API，因此 主要是使用 history-api-provider 和browser-hash-provider。如果有iframe的需求它也可以使用memory-provider
