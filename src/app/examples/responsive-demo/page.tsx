"use client";

import { AppBar, Scaffold } from "@/components/scaffold";
import type { NavigationState, PaneParams } from "@/components/scaffold/scaffold";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, Monitor, Smartphone, Tablet } from "lucide-react";
import * as React from "react";

interface DemoPaneParams extends PaneParams {
  rail: { category?: string };
  list: { filter?: string };
  detail: { itemId?: string };
  tail: { open?: boolean };
}

// 预设尺寸
const PRESET_SIZES = {
  mobile: { width: 375, height: 667, label: "Mobile", icon: Smartphone },
  tablet: { width: 768, height: 1024, label: "Tablet", icon: Tablet },
  desktop: { width: 1280, height: 800, label: "Desktop", icon: Monitor },
};

interface ResizableScaffoldContainerProps {
  title: string;
  initialWidth?: number;
  initialHeight?: number;
}

const ResizableScaffoldContainer: React.FC<ResizableScaffoldContainerProps> = ({
  title,
  initialWidth = 375,
  initialHeight = 667,
}) => {
  const [size, setSize] = React.useState({ width: initialWidth, height: initialHeight });
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = React.useState(false);

  const [navState, setNavState] = React.useState<NavigationState<DemoPaneParams>>({
    route: {
      index: 0,
      activePane: "list",
      panes: {
        rail: { category: "home" },
        list: { filter: "all" },
        detail: { itemId: "1" },
        tail: { open: false },
      },
    },
    history: [
      {
        index: 0,
        activePane: "list",
        panes: {
          rail: { category: "home" },
          list: { filter: "all" },
          detail: { itemId: "1" },
          tail: { open: false },
        },
      },
    ],
  });

  const handleResize = React.useCallback(
    (e: MouseEvent) => {
      if (!containerRef.current || !isResizing) return;

      const rect = containerRef.current.getBoundingClientRect();
      const newWidth = Math.max(280, Math.min(e.clientX - rect.left, window.innerWidth - 100));
      const newHeight = Math.max(400, Math.min(e.clientY - rect.top, window.innerHeight - 100));

      setSize({ width: newWidth, height: newHeight });
    },
    [isResizing],
  );

  const handleResizeEnd = React.useCallback(() => {
    setIsResizing(false);
  }, []);

  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleResize);
      document.addEventListener("mouseup", handleResizeEnd);
      return () => {
        document.removeEventListener("mousemove", handleResize);
        document.removeEventListener("mouseup", handleResizeEnd);
      };
    }
  }, [isResizing, handleResize, handleResizeEnd]);

  return (
    <div className="bg-card flex flex-col gap-4 rounded-lg border p-4">
      {/* 控制栏 */}
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-semibold">{title}</h3>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-xs">
            {size.width} × {size.height}
          </span>
          {Object.entries(PRESET_SIZES).map(([key, preset]) => {
            const Icon = preset.icon;
            return (
              <button
                key={key}
                onClick={() => setSize({ width: preset.width, height: preset.height })}
                className="hover:bg-accent rounded p-1.5 transition-colors"
                title={preset.label}>
                <Icon size={16} />
              </button>
            );
          })}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="hover:bg-accent rounded p-1.5 transition-colors"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      {/* Scaffold 容器 */}
      <div
        ref={containerRef}
        className={cn(
          "bg-background @container relative overflow-hidden rounded border shadow-lg transition-all",
          isFullscreen && "fixed inset-4 z-50",
        )}
        style={
          isFullscreen
            ? undefined
            : {
                width: `${size.width}px`,
                height: `${size.height}px`,
              }
        }>
        <Scaffold<DemoPaneParams>
          appBar={
            <AppBar
              title={
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold @md:text-base">{title}</span>
                  <span className="bg-primary/20 text-primary hidden rounded px-2 py-0.5 text-xs @md:inline-block">
                    {size.width < 512 ? "Compact" : size.width < 768 ? "Medium" : "Wide"}
                  </span>
                </div>
              }
            />
          }
          navigationState={navState}
          onNavigationChange={setNavState}
          rail={({ navigate, breakpoint, isActive }) => (
            <div className="bg-muted/30 flex size-full flex-col p-2 @md:p-4">
              <div className="mb-4 rounded border bg-blue-50 p-2 @md:p-3 dark:bg-blue-950">
                <h4 className="text-xs font-bold @md:text-sm">Rail Pane</h4>
                <div className="text-muted-foreground text-[10px] @md:text-xs">
                  <div>Active: {isActive ? "Yes" : "No"}</div>
                  <div>BP: {breakpoint || "null"}</div>
                </div>
              </div>
              <div className="space-y-1 @md:space-y-2">
                {["Home", "Search", "Settings"].map((item, i) => (
                  <button
                    key={item}
                    onClick={() => navigate("list", { filter: item.toLowerCase() })}
                    className="hover:bg-accent w-full rounded p-1.5 text-left text-xs transition-colors @md:p-2 @md:text-sm">
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}
          list={({ params, navigate, canGoBack, canGoForward, back, forward, breakpoint }) => (
            <div className="flex size-full flex-col p-2 @md:p-4">
              <div className="mb-2 rounded border bg-green-50 p-2 @md:mb-4 @md:p-3 dark:bg-green-950">
                <h4 className="text-xs font-bold @md:text-sm">List Pane</h4>
                <div className="text-muted-foreground text-[10px] @md:text-xs">
                  <div>Filter: {params.filter}</div>
                  <div>BP: {breakpoint || "null"}</div>
                </div>
              </div>

              <div className="mb-2 flex gap-1 @md:mb-4 @md:gap-2">
                <button
                  onClick={back}
                  disabled={!canGoBack}
                  className="bg-primary text-primary-foreground flex items-center gap-1 rounded px-2 py-1 text-xs disabled:opacity-50 @md:px-3 @md:py-1.5 @md:text-sm">
                  <ChevronLeft size={12} className="@md:size-4" />
                  <span className="hidden @sm:inline">Back</span>
                </button>
                <button
                  onClick={forward}
                  disabled={!canGoForward}
                  className="bg-primary text-primary-foreground flex items-center gap-1 rounded px-2 py-1 text-xs disabled:opacity-50 @md:px-3 @md:py-1.5 @md:text-sm">
                  <span className="hidden @sm:inline">Fwd</span>
                  <ChevronRight size={12} className="@md:size-4" />
                </button>
              </div>

              <div className="space-y-1 @md:space-y-2">
                {["Item 1", "Item 2", "Item 3"].map((item, i) => (
                  <button
                    key={i}
                    onClick={() => navigate("detail", { itemId: String(i + 1) })}
                    className="hover:bg-accent w-full rounded border p-2 text-left transition-colors @md:p-3">
                    <div className="text-xs font-semibold @md:text-sm">{item}</div>
                    <div className="text-muted-foreground text-[10px] @md:text-xs">Click to view</div>
                  </button>
                ))}
              </div>
            </div>
          )}
          detail={({ params, navigate, breakpoint }) => (
            <div className="flex size-full flex-col p-2 @md:p-4">
              <div className="mb-2 rounded border bg-purple-50 p-2 @md:mb-4 @md:p-3 dark:bg-purple-950">
                <h4 className="text-xs font-bold @md:text-sm">Detail Pane</h4>
                <div className="text-muted-foreground text-[10px] @md:text-xs">
                  <div>Item: #{params.itemId}</div>
                  <div>BP: {breakpoint || "null"}</div>
                </div>
              </div>

              <div className="rounded border p-3 @md:p-4">
                <h3 className="mb-2 text-sm font-bold @md:text-lg">Item #{params.itemId}</h3>
                <p className="text-muted-foreground mb-2 text-xs @md:mb-4 @md:text-sm">
                  This is the detail view. Notice how the layout adapts!
                </p>
                <button
                  onClick={() => navigate("tail", { open: true })}
                  className="bg-primary text-primary-foreground rounded px-3 py-1.5 text-xs @md:text-sm">
                  Open Tail
                </button>
              </div>
            </div>
          )}
          tail={({ params, isActive }) =>
            isActive ? (
              <div className="bg-muted/50 flex size-full flex-col p-2 @md:p-4">
                <div className="mb-2 rounded border bg-amber-50 p-2 @md:mb-4 @md:p-3 dark:bg-amber-950">
                  <h4 className="text-xs font-bold @md:text-sm">Tail Pane</h4>
                  <div className="text-muted-foreground text-[10px] @md:text-xs">Active: {isActive ? "Yes" : "No"}</div>
                </div>
                <div className="space-y-2 @md:space-y-4">
                  <div className="rounded border p-2 @md:p-3">
                    <h5 className="mb-2 text-xs font-semibold @md:text-sm">Settings</h5>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="accent-primary" />
                      <span className="text-[10px] @md:text-xs">Enable notifications</span>
                    </label>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid size-full place-items-center">
                <p className="text-xs text-neutral-400 italic @md:text-sm">未激活</p>
              </div>
            )
          }
        />

        {/* 调整大小手柄 */}
        {!isFullscreen && (
          <div
            onMouseDown={() => setIsResizing(true)}
            className="bg-primary/10 hover:bg-primary/20 absolute right-0 bottom-0 cursor-nwse-resize rounded-tl p-2 transition-colors">
            <div className="border-primary/50 h-3 w-3 border-r-2 border-b-2" />
          </div>
        )}
      </div>
    </div>
  );
};

export default function ResponsiveDemoPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-4 md:p-8 dark:from-slate-950 dark:to-slate-900">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* 页头 */}
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">Responsive Container Queries</h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            拖拽调整容器大小，实时观察 Scaffold 如何使用 <code className="text-primary">@container</code>{" "}
            查询进行响应式布局
          </p>
        </div>

        {/* 说明卡片 */}
        <div className="bg-card rounded-lg border p-6">
          <h2 className="mb-3 text-xl font-semibold">🎯 使用说明</h2>
          <ul className="text-muted-foreground space-y-2 text-sm">
            <li>• 点击设备图标快速切换到预设尺寸（Mobile/Tablet/Desktop）</li>
            <li>• 拖拽右下角调整容器大小，观察布局如何自适应</li>
            <li>• 点击 maximize 图标进入全屏模式</li>
            <li>• 所有响应式样式都基于 container-query，而非全局 viewport</li>
          </ul>
        </div>

        {/* 响应式容器网格 */}
        <div className="grid gap-6 lg:grid-cols-2">
          <ResizableScaffoldContainer title="Demo 1: Mobile First" initialWidth={375} initialHeight={667} />
          <ResizableScaffoldContainer title="Demo 2: Desktop First" initialWidth={1024} initialHeight={768} />
        </div>

        {/* 技术说明 */}
        <div className="bg-card rounded-lg border p-6">
          <h2 className="mb-4 text-xl font-semibold">💡 技术细节</h2>
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 font-semibold">Container Query Breakpoints</h3>
              <pre className="bg-muted overflow-x-auto rounded p-4 text-xs">
                {`@container (min-width: 384px) { /* @sm */ }
@container (min-width: 448px) { /* @md */ }
@container (min-width: 512px) { /* @lg */ }
@container (min-width: 768px) { /* @3xl */ }`}
              </pre>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">优势</h3>
              <ul className="text-muted-foreground space-y-1 text-sm">
                <li>✓ 组件完全独立于页面布局</li>
                <li>✓ 同一页面可以有多个不同尺寸的 Scaffold</li>
                <li>✓ 更精确的响应式控制</li>
                <li>✓ 易于在 Storybook 等工具中测试</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
