这是之前让AI开发的一个模拟 Flutter-Scaffold 做的一个 Shadcn-Scafflod 组件。请你阅读文档和代码形成认知，我们需要在此基础上展开工作。

---

我是总架构师，我带你逐步进行重构工作。
首先，从 scaffold.tsx 这个文件开始，这是我们的入口。
它的问题在于太过复杂，我们需要重构它。
Scaffold的职责提供一个Grid布局，然后提供一系列的solt来放置组件。

比如说 `appBar?: React.ReactElement<AppBarProps>`
这个设计是错误的，应该是 `appBar?: (()=>React.ReactNode)|React.ReactNode` 才对。
以此类推。
