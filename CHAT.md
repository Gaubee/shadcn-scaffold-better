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
