1. 阅读[AGENTS](./AGENTS.md)可以了解这个项目的初衷
2. 后续我手写了 [Scaffold](src/components/ui/skeleton.tsx) 组件，它使用了 grid+container-query 等先进css技术进行响应式设计，并内置了“导航”原始能力
3. 然后我让AI开发了`src/components/scaffold/navigation`，来提供了将导航能力和浏览器history/navigation-api等适配
3. 接着我让AI开发了[RailBavbar](src/components/scaffold/rail-navbar.tsx)这个组件，这是我们参考shadcnui的理念，开始为我们的Scaffold插槽提供一些常见的组件封装
3. 我和AI一起开发了[ResponsiveContainer](src/components/ui/responsive-container.tsx)这个工具组件，任何有需要展示或者测试响应式效果的，都可以用这个组件来做到
3. 我和AI一起开发了[useResponsiveVariant](src/components/ui/scaffold/responsive-variant.tsx)这个响应式工具，大部分小组件需要提供响应式布局的，都可以使用它来达到自动的变体切换
3. 我和AI一起开发了[AppBar-widgets](src/components/ui/scaffold/appbar/*.tsx)这是一系列AppBar开发相关的常见小组件，可以使用这些小组件灵活搭配出需要的功能
