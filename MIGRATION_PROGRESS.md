# Scaffold API Migration Progress

> 最后更新：2025-10-27
> 状态：进行中 (40% 完成)

## 📊 总体进度

- ✅ **已完成**: 2/5 示例页面
- 🔄 **进行中**: 代码清理和重构
- ⏳ **待处理**: 3个示例页面 + 测试 + Stories

### TypeScript 错误统计
- **初始错误**: 20 个
- **当前错误**: 12 个
- **减少**: 40% ↓

---

## ✅ 已完成的工作

### 1. 核心代码修复

#### `src/components/scaffold/scaffold.tsx`
- ✅ 修复类型定义：`ScaffoldSolt` → `ScaffoldSlot`
- ✅ 清理注释代码（删除旧的 drawer、bottomNavigationBar 等插槽）
- ✅ 改进注释（中文 → 英文）

#### `package.json`
- ✅ 删除 `happy-dom` 依赖（与 `jsdom` 重复）

#### 文件清理
- ✅ 删除 `src/stories/` 整个目录（28个 Storybook 示例文件）

### 2. 示例页面迁移

#### ✅ `examples/basic/page.tsx` - 已完成

**旧 API**:
```tsx
<Scaffold
  header={<AppBar />}
  drawer={<Drawer />}
  bottomNavigationBar={<BottomNavigationBar />}
  floatingActionButton={<FAB />}
>
  {children}
</Scaffold>
```

**新 API**:
```tsx
<Scaffold
  appBar={<AppBar />}
  rail={({ railPosition }) =>
    railPosition === "block-end" ? <BottomNavigationBar /> : null
  }
  list={() => (
    <div>{mainContent}</div>
  )}
  floatingActionButton={<FAB />}
/>

{/* Drawer 作为独立组件 */}
<Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
  {drawerContent}
</Drawer>
```

**关键变化**:
- `header` → `appBar`
- `drawer` → 独立组件（不再是 Scaffold 的 prop）
- `bottomNavigationBar` → `rail` 函数（根据 `railPosition` 条件渲染）
- 子元素 → `list` 函数

#### ✅ `examples/immersive/page.tsx` - 已完成

**变化**:
- `header` → `appBar`
- 主内容 → `list` 函数

**说明**: 这个页面很简单，只用了 AppBar 和 FAB，没有导航组件。

---

## ⏳ 待处理的文件

### 示例页面 (3个)

1. **`examples/responsive/page.tsx`**
   - 错误: `responsive`、`header`、`navigationItems` 等不存在
   - 复杂度: ⭐⭐⭐ (使用了响应式导航切换)
   - 需要理解: rail 如何在移动端/桌面端切换

2. **`examples/advanced-scroll/page.tsx`**
   - 错误: `header`、`drawer`、`bottomNavigationBar` 不存在
   - 复杂度: ⭐⭐
   - 与 basic 类似的迁移模式

3. **`examples/dashboard/page.tsx`**
   - 错误: `responsive`、`header`、`drawer`、`endDrawer`、`navigationRail` 等不存在
   - 复杂度: ⭐⭐⭐⭐ (最复杂，使用了所有功能)
   - 需要理解: 完整的响应式 Pane 系统

### 测试文件 (1个)

4. **`src/components/scaffold/__tests__/scaffold.test.tsx`**
   - 错误: `header`、`responsive`、`backgroundColor` 等不存在
   - 复杂度: ⭐⭐
   - 需要更新测试用例以匹配新 API

### Storybook Stories (1个)

5. **`src/components/scaffold/scaffold.stories.tsx`**
   - 错误: `header` 不存在，`list` 需要函数而非元素
   - 复杂度: ⭐⭐
   - 需要更新所有 stories

---

## 🎯 新 vs 旧 API 速查表

| 旧 API | 新 API | 说明 |
|--------|--------|------|
| `header` | `appBar` | 直接替换 |
| `drawer` | 独立组件 | 从 Scaffold 中移出 |
| `endDrawer` | 独立组件 | 从 Scaffold 中移出 |
| `bottomNavigationBar` | `rail` (条件渲染) | 根据 `railPosition === "block-end"` 渲染 |
| `navigationRail` | `rail` (条件渲染) | 根据 `railPosition === "inline-start"` 渲染 |
| `children` | `list={()  => ...}` | 主内容区域 |
| `responsive` | ❌ 已删除 | 使用容器查询自动响应 |
| `responsiveBreakpoint` | ❌ 已删除 | 使用 Tailwind 断点 |

---

## 📝 迁移模式总结

### 模式 1: 简单页面（仅 AppBar + 内容）

```tsx
// 旧
<Scaffold header={<AppBar />}>
  {content}
</Scaffold>

// 新
<Scaffold
  appBar={<AppBar />}
  list={() => content}
/>
```

### 模式 2: 带底部导航（移动端）

```tsx
// 旧
<Scaffold
  header={<AppBar />}
  bottomNavigationBar={<BottomNavigationBar />}
>
  {content}
</Scaffold>

// 新
<Scaffold
  appBar={<AppBar />}
  rail={({ railPosition }) =>
    railPosition === "block-end" ? <BottomNavigationBar /> : null
  }
  list={() => content}
/>
```

### 模式 3: 带 Drawer

```tsx
// 旧
<Scaffold
  header={<AppBar />}
  drawer={<Drawer />}
>
  {content}
</Scaffold>

// 新
<>
  <Scaffold
    appBar={<AppBar />}
    list={() => content}
  />
  <Drawer open={open} onOpenChange={setOpen}>
    {drawerContent}
  </Drawer>
</>
```

### 模式 4: 响应式布局（最复杂）

```tsx
// 新设计使用 Pane 系统
<Scaffold
  appBar={<AppBar />}
  rail={({ railPosition, breakpoint }) => {
    if (railPosition === "block-end") {
      return <BottomNavigationBar />;
    }
    return <NavigationRail />;
  }}
  list={({ params, navigate }) => <ListPane />}
  detail={({ params }) => <DetailPane />}
  tail={({ params }) => <TailPane />}
  navigationState={navState}
  onNavigationChange={handleNavChange}
/>
```

---

## 🐛 发现的 Scaffold 问题

### 1. FAB 渲染位置问题

**观察**: FAB 的 gridArea 计算逻辑：
```tsx
<div
  className="place-items-end"
  style={{
    gridArea:
      context.breakpoint === "desktop" ? "tail" :
      context.breakpoint === "tablet" ? "detail" :
      "main",
  }}
>
  {fabContent}
</div>
```

**潜在问题**:
- FAB 应该浮动在内容之上，但当前被放在 grid area 中
- 可能需要使用 `position: fixed` 或单独的 Portal

### 2. `list` 作为必需插槽

**问题**: 目前 `list` 可以为空，但这会导致布局问题

**建议**:
- 要么将 `list` 设为必需
- 要么提供默认渲染

### 3. 缺少默认导航状态

**观察**: 代码中有默认状态：
```tsx
const route: NavigationRoute<T> = {
  index: 0,
  activePane: "rail",
  panes: {} as T
};
```

**问题**: `panes: {} as T` 是类型断言，运行时可能导致错误

**建议**: 提供更安全的默认值或文档说明

---

## 📊 下一步计划

### 短期目标（今天）
1. ✅ 完成 `responsive` 示例迁移
2. ✅ 完成 `advanced-scroll` 示例迁移
3. ✅ 完成 `dashboard` 示例迁移

### 中期目标（本周）
4. 更新测试文件
5. 更新 Storybook stories
6. 运行完整测试套件
7. 更新 README 文档

### 长期目标
8. 创建迁移指南文档
9. 添加新 API 的完整示例
10. 考虑是否需要提供兼容层

---

## 🔧 建议的 Scaffold 改进

### 1. 简化简单用例

为不需要导航的简单页面提供快捷方式：

```tsx
// 建议的 API 简化
<Scaffold>
  <Scaffold.AppBar>
    <AppBar />
  </Scaffold.AppBar>

  <Scaffold.Content>
    {mainContent}
  </Scaffold.Content>

  <Scaffold.FAB>
    <FloatingActionButton />
  </Scaffold.FAB>
</Scaffold>
```

### 2. 提供 Hook 简化导航状态管理

```tsx
const navigation = useScaffoldNavigation({
  initialPane: "list",
  onNavigate: (state) => {
    // 自动处理历史记录
  },
});

<Scaffold navigation={navigation} ... />
```

### 3. 改进 TypeScript 类型推导

当前的泛型类型参数 `<T extends PaneParams>` 对用户不够友好。

**建议**: 提供预定义的类型辅助函数。

---

## 📚 参考文档

- [REFACTOR_ANALYSIS.md](./REFACTOR_ANALYSIS.md) - 完整的重构分析报告
- [AGENTS.md](./AGENTS.md) - 项目目标和设计原则
- [CHAT.md](./CHAT.md) - 开发历史和对话记录

---

**下一步**: 继续迁移剩余的 3 个示例页面（responsive、advanced-scroll、dashboard）
