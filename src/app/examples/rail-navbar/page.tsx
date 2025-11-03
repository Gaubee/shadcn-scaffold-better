"use client";

import { Scaffold } from "@/components/scaffold";
import { AppBar } from "@/components/scaffold/app-bar";
import {
  RailNavbar,
  RailNavbarMenu,
  RailNavbarMenuButton,
  RailNavbarMenuContent,
  RailNavbarMenuItem,
  RailNavbarMenuSubButton,
  RailNavbarMenuSubItem,
} from "@/components/scaffold/rail-navbar";
import type { NavigationState, PaneParams } from "@/components/scaffold/scaffold";
import { Button } from "@/components/ui/button";
import { ResponsiveContainer } from "@/components/ui/responsive-container";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Bell,
  Database,
  FileText,
  Home,
  Image,
  Mail,
  Music,
  Palette,
  Search,
  Settings,
  Shield,
  User,
  Video,
} from "lucide-react";
import * as React from "react";

interface DemoPaneParams extends PaneParams {
  rail: { activeItem?: string };
  list: { category?: string };
  detail: { itemId?: string };
  tail: { open?: boolean };
}

const MENU_ITEMS = [
  { id: "home", label: "首页", icon: Home },
  { id: "search", label: "搜索", icon: Search },
  {
    id: "media",
    label: "媒体",
    icon: Image,
    children: [
      { id: "images", label: "图片", icon: Image },
      { id: "videos", label: "视频", icon: Video },
      { id: "music", label: "音乐", icon: Music },
    ],
  },
  {
    id: "settings",
    label: "设置",
    icon: Settings,
    children: [
      { id: "general", label: "常规", icon: Palette },
      { id: "security", label: "安全", icon: Shield },
      { id: "data", label: "数据", icon: Database },
    ],
  },
  { id: "notifications", label: "通知", icon: Bell },
  { id: "messages", label: "消息", icon: Mail },
  { id: "documents", label: "文档", icon: FileText },
  { id: "profile", label: "个人", icon: User },
] as const;

function RailNavbarDemo() {
  const [compact, setCompact] = React.useState(false);
  const [navState, setNavState] = React.useState<NavigationState<DemoPaneParams>>({
    route: {
      index: 0,
      activePane: "list",
      panes: {
        rail: { activeItem: "home" },
        list: { category: "all" },
        detail: { itemId: "1" },
        tail: { open: false },
      },
    },
    history: [
      {
        index: 0,
        activePane: "list",
        panes: {
          rail: { activeItem: "home" },
          list: { category: "all" },
          detail: { itemId: "1" },
          tail: { open: false },
        },
      },
    ],
  });

  const activeItem = navState.route.panes.rail.activeItem;

  return (
    <Scaffold<DemoPaneParams>
      appBar={
        <AppBar title="RailNavbar 示例">
          <div className="flex items-center gap-2">
            <span className="text-sm">Compact:</span>
            <Button variant={compact ? "default" : "outline"} size="sm" onClick={() => setCompact(!compact)}>
              {compact ? "ON" : "OFF"}
            </Button>
          </div>
        </AppBar>
      }
      navigationState={navState}
      onNavigationChange={setNavState}
      rail={({ railPosition, navigate, params }) => {
        return (
          <RailNavbar railPosition={railPosition}>
            <RailNavbarMenu compact={compact}>
              {MENU_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeItem === item.id;

                // 有子菜单（不添加 Tooltip，避免与 NavigationMenuTrigger 冲突）
                if ("children" in item && item.children) {
                  return (
                    <RailNavbarMenuItem key={item.id}>
                      <RailNavbarMenuButton
                        icon={<Icon />}
                        label={item.label}
                        isActive={isActive}
                        onClick={() => {
                          navigate("rail", { activeItem: item.id });
                        }}
                      />
                      <RailNavbarMenuContent>
                        {item.children.map((child) => {
                          const ChildIcon = child.icon;
                          const isChildActive = activeItem === child.id;
                          return (
                            <RailNavbarMenuSubItem key={child.id}>
                              <RailNavbarMenuSubButton
                                icon={<ChildIcon />}
                                label={child.label}
                                isActive={isChildActive}
                                onClick={() => {
                                  navigate("rail", { activeItem: child.id });
                                  navigate("list", { category: child.id });
                                }}
                              />
                            </RailNavbarMenuSubItem>
                          );
                        })}
                      </RailNavbarMenuContent>
                    </RailNavbarMenuItem>
                  );
                }

                // 无子菜单
                return (
                  <RailNavbarMenuItem key={item.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <RailNavbarMenuButton
                          icon={<Icon />}
                          label={item.label}
                          isActive={isActive}
                          onClick={() => {
                            navigate("rail", { activeItem: item.id });
                            navigate("list", { category: item.id });
                          }}
                        />
                      </TooltipTrigger>
                      <TooltipContent>{item.label}</TooltipContent>
                    </Tooltip>
                  </RailNavbarMenuItem>
                );
              })}
            </RailNavbarMenu>
          </RailNavbar>
        );
      }}
      list={({ params, navigate, breakpoint }) => (
        <div className="flex size-full flex-col gap-4 p-4">
          <div className="bg-card rounded-lg border p-4">
            <h2 className="mb-2 text-lg font-semibold">列表面板</h2>
            <p className="text-muted-foreground text-sm">
              当前分类: <span className="text-foreground font-medium">{params.category || "全部"}</span>
            </p>
            <p className="text-muted-foreground text-sm">
              当前断点: <span className="text-foreground font-medium">{breakpoint || "null"}</span>
            </p>
          </div>

          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <button
                key={i}
                onClick={() => navigate("detail", { itemId: String(i) })}
                className="hover:bg-accent bg-card w-full rounded-lg border p-4 text-left transition-colors">
                <h3 className="mb-1 font-semibold">项目 {i}</h3>
                <p className="text-muted-foreground text-sm">点击查看详情</p>
              </button>
            ))}
          </div>
        </div>
      )}
      detail={({ params, navigate, breakpoint }) => (
        <div className="flex size-full flex-col gap-4 p-4">
          <div className="bg-card rounded-lg border p-4">
            <h2 className="mb-2 text-lg font-semibold">详情面板</h2>
            <p className="text-muted-foreground text-sm">
              当前项目: <span className="text-foreground font-medium">#{params.itemId}</span>
            </p>
            <p className="text-muted-foreground text-sm">
              当前断点: <span className="text-foreground font-medium">{breakpoint || "null"}</span>
            </p>
          </div>

          <div className="bg-card rounded-lg border p-6">
            <h3 className="mb-4 text-xl font-bold">项目 #{params.itemId} 详情</h3>
            <p className="text-muted-foreground mb-6">
              这是详情视图。注意 RailNavbar 如何在侧边和底部位置自动调整布局和二级菜单的展示方式。
            </p>

            <div className="space-y-4">
              <div>
                <h4 className="mb-2 font-semibold">侧边位置 (inline-start/end)</h4>
                <p className="text-muted-foreground text-sm">
                  • 纵向布局,文字横向排列
                  <br />
                  • 二级菜单: compact 模式用弹层, 否则用缩进样式
                  <br />• 支持纵向滚动
                </p>
              </div>

              <div>
                <h4 className="mb-2 font-semibold">底部位置 (block-start/end)</h4>
                <p className="text-muted-foreground text-sm">
                  • 横向布局,图标和文字纵向排列
                  <br />
                  • 二级菜单统一使用 NavigationMenu 弹出展示
                  <br />• 支持横向滚动
                </p>
              </div>

              <div>
                <h4 className="mb-2 font-semibold">Compact 模式</h4>
                <p className="text-muted-foreground text-sm">
                  • 只显示图标, 隐藏文字标签
                  <br />
                  • 所有位置的二级菜单都用弹层
                  <br />• 节省空间, 适合小屏幕
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("tail", { open: true })}
              className="bg-primary text-primary-foreground hover:bg-primary/90 mt-6 rounded-md px-4 py-2 text-sm transition-colors">
              打开侧边栏
            </button>
          </div>
        </div>
      )}
      tail={({ isActive, navigate }) =>
        isActive ? (
          <div className="flex size-full flex-col gap-4 p-4">
            <div className="bg-card rounded-lg border p-4">
              <h2 className="mb-2 text-lg font-semibold">侧边栏</h2>
              <p className="text-muted-foreground text-sm">这是一个可选的侧边栏面板</p>
            </div>

            <div className="space-y-2">
              <div className="bg-card rounded-lg border p-4">
                <h3 className="mb-2 font-semibold">设置选项</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="accent-primary" defaultChecked />
                    <span className="text-sm">启用通知</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="accent-primary" />
                    <span className="text-sm">深色模式</span>
                  </label>
                </div>
              </div>

              <button
                onClick={() => navigate("list", {})}
                className="hover:bg-accent bg-card w-full rounded-lg border p-3 text-sm transition-colors">
                返回列表
              </button>
            </div>
          </div>
        ) : null
      }
    />
  );
}

export default function RailNavbarPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-4 md:p-8 dark:from-slate-950 dark:to-slate-900">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* 页头 */}
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">RailNavbar 组件示例</h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            一个强大的导航组件,支持四个方向布局、compact 模式,基于 NavigationMenu 构建
          </p>
        </div>

        {/* 功能说明 */}
        <div className="bg-card rounded-lg border p-6">
          <h2 className="mb-3 text-xl font-semibold">✨ 核心特性</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="mb-2 font-semibold">四方向支持</h3>
              <ul className="text-muted-foreground space-y-1 text-sm">
                <li>• inline-start/end (侧边左/右)</li>
                <li>• block-start/end (顶部/底部)</li>
                <li>• 自动计算 orientation 和弹层方向</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Compact 模式</h3>
              <ul className="text-muted-foreground space-y-1 text-sm">
                <li>• 只显示图标,节省空间</li>
                <li>• 无图标时自动生成首字母 Symbol</li>
                <li>• 所有二级菜单统一用弹层</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">智能二级菜单</h3>
              <ul className="text-muted-foreground space-y-1 text-sm">
                <li>• inline 非 compact: 缩进边框样式</li>
                <li>• block 或 compact: NavigationMenu 弹层</li>
                <li>• 自动检测子菜单并应用 Trigger</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">设计原则</h3>
              <ul className="text-muted-foreground space-y-1 text-sm">
                <li>• KISS: icon+label props,清晰直观</li>
                <li>• DRY: CompactContext 复用配置</li>
                <li>• 类型安全,无 any</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 响应式演示 */}
        <ResponsiveContainer title="RailNavbar 响应式演示" initialDevice="mobile" initialScale={0.75}>
          <RailNavbarDemo />
        </ResponsiveContainer>

        {/* 使用说明 */}
        <div className="bg-card rounded-lg border p-6">
          <h2 className="mb-4 text-xl font-semibold">📖 使用说明</h2>
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 font-semibold">如何使用</h3>
              <ol className="text-muted-foreground space-y-2 text-sm">
                <li>1. 切换设备预设(Mobile/Tablet/Desktop)观察不同断点下的表现</li>
                <li>2. 点击 AppBar 右上角的 Compact 按钮切换 compact 模式</li>
                <li>3. 点击带有子菜单的项目(如"媒体"、"设置")查看二级菜单</li>
                <li>4. 拖拽右下角调整容器大小,实时查看布局变化</li>
              </ol>
            </div>

            <div>
              <h3 className="mb-2 font-semibold">代码示例</h3>
              <pre className="bg-muted overflow-x-auto rounded-lg p-4 text-xs">
                {`<RailNavbar railPosition="inline-start">
  <RailNavbarMenu compact={false}>
    {/* 简单菜单项 */}
    <RailNavbarMenuItem>
      <RailNavbarMenuButton
        icon={<Home />}
        label="首页"
        isActive
      />
    </RailNavbarMenuItem>

    {/* 带子菜单 */}
    <RailNavbarMenuItem>
      <RailNavbarMenuButton
        icon={<Settings />}
        label="设置"
      />
      <RailNavbarMenuContent>
        <RailNavbarMenuSubItem>
          <RailNavbarMenuSubButton
            icon={<Palette />}
            label="常规"
          />
        </RailNavbarMenuSubItem>
      </RailNavbarMenuContent>
    </RailNavbarMenuItem>

    {/* 带 Tooltip */}
    <RailNavbarMenuItem>
      <Tooltip>
        <TooltipTrigger asChild>
          <RailNavbarMenuButton
            icon={<Help />}
            label="帮助"
          />
        </TooltipTrigger>
        <TooltipContent>获取帮助</TooltipContent>
      </Tooltip>
    </RailNavbarMenuItem>
  </RailNavbarMenu>
</RailNavbar>`}
              </pre>
            </div>
          </div>
        </div>

        {/* API 文档 */}
        <div className="bg-card rounded-lg border p-6">
          <h2 className="mb-4 text-xl font-semibold">🔧 API 参考</h2>
          <div className="space-y-6">
            <div>
              <h3 className="mb-3 font-semibold">RailNavbar</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="p-2 text-left">属性</th>
                      <th className="p-2 text-left">类型</th>
                      <th className="p-2 text-left">说明</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground divide-y">
                    <tr>
                      <td className="p-2 font-mono">railPosition</td>
                      <td className="p-2 font-mono text-xs">
                        &quot;inline-start&quot; | &quot;inline-end&quot; | &quot;block-start&quot; |
                        &quot;block-end&quot;
                      </td>
                      <td className="p-2">导航栏位置</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="mb-3 font-semibold">RailNavbarMenu</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="p-2 text-left">属性</th>
                      <th className="p-2 text-left">类型</th>
                      <th className="p-2 text-left">默认值</th>
                      <th className="p-2 text-left">说明</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground divide-y">
                    <tr>
                      <td className="p-2 font-mono">compact</td>
                      <td className="p-2 font-mono text-xs">boolean</td>
                      <td className="p-2">false</td>
                      <td className="p-2">紧凑模式,只显示图标</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="mb-3 font-semibold">RailNavbarMenuButton</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="p-2 text-left">属性</th>
                      <th className="p-2 text-left">类型</th>
                      <th className="p-2 text-left">默认值</th>
                      <th className="p-2 text-left">说明</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground divide-y">
                    <tr>
                      <td className="p-2 font-mono">icon</td>
                      <td className="p-2 font-mono text-xs">ReactNode</td>
                      <td className="p-2">label[0]</td>
                      <td className="p-2">图标,无则用首字母</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-mono">label</td>
                      <td className="p-2 font-mono text-xs">string</td>
                      <td className="p-2">-</td>
                      <td className="p-2">文字标签(必填)</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-mono">compact</td>
                      <td className="p-2 font-mono text-xs">boolean</td>
                      <td className="p-2">继承 Context</td>
                      <td className="p-2">覆盖 compact 配置</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-mono">isActive</td>
                      <td className="p-2 font-mono text-xs">boolean</td>
                      <td className="p-2">false</td>
                      <td className="p-2">是否激活</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="mb-3 font-semibold">RailNavbarMenuSubButton</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="p-2 text-left">属性</th>
                      <th className="p-2 text-left">类型</th>
                      <th className="p-2 text-left">说明</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground divide-y">
                    <tr>
                      <td className="p-2 font-mono">icon</td>
                      <td className="p-2 font-mono text-xs">ReactNode</td>
                      <td className="p-2">图标(可选)</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-mono">label</td>
                      <td className="p-2 font-mono text-xs">string</td>
                      <td className="p-2">文字标签(必填)</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-mono">isActive</td>
                      <td className="p-2 font-mono text-xs">boolean</td>
                      <td className="p-2">是否激活</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
