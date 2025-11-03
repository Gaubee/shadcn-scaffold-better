"use client";

import { AppBar, Scaffold } from "@/components/scaffold";
import type { NavigationState, PaneParams } from "@/components/scaffold/scaffold";
import {
  AutoProvider,
  BrowserHistoryProvider,
  HashRouterProvider,
  MemoryRouterProvider,
  NavigationAPIProvider,
  type NavigationProvider,
} from "@/components/scaffold/navigation";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, BookOpen, Code, HelpCircle, Home, RefreshCw, Settings, Users } from "lucide-react";
import * as React from "react";

// ==================== 类型定义 ====================
interface AppPaneParams extends PaneParams {
  rail: { section?: string };
  list: { category?: string; page?: number };
  detail: { id?: string; tab?: string };
  tail: { settingId?: string };
}

// Router 类型
type RouterType = "auto" | "navigation-api" | "browser" | "hash" | "memory";

// ==================== useNavigation Hook ====================
/**
 * useNavigationWithRouter - 整合 Scaffold 导航与不同的 Router Provider
 *
 * @param initialState - 初始导航状态
 * @param routerType - Router 类型：browser | hash | memory
 */
function useNavigationWithRouter<T extends PaneParams>(
  initialState: NavigationState<T>,
  routerType: RouterType = "browser",
) {
  const [navigationState, setNavigationState] = React.useState<NavigationState<T>>(initialState);
  const providerRef = React.useRef<NavigationProvider<T> | null>(null);
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0); // 用于强制重新渲染
  const [isClient, setIsClient] = React.useState(false);

  // 确保只在客户端初始化
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  // 初始化 provider
  React.useEffect(() => {
    if (typeof window === "undefined" || !isClient) return;

    // 创建新 provider
    let provider: NavigationProvider<T>;

    switch (routerType) {
      case "auto":
        provider = new AutoProvider<T>(window.location.pathname, (newState) => {
          setNavigationState(newState);
        });
        break;

      case "navigation-api":
        provider = new NavigationAPIProvider<T>(window.location.pathname, (newState) => {
          setNavigationState(newState);
        });
        break;

      case "hash":
        provider = new HashRouterProvider<T>((newState) => {
          setNavigationState(newState);
        });
        break;

      case "memory":
        provider = new MemoryRouterProvider<T>(initialState, (newState) => {
          setNavigationState(newState);
        });
        break;

      case "browser":
      default:
        provider = new BrowserHistoryProvider<T>(window.location.pathname, (newState) => {
          setNavigationState(newState);
        });
        break;
    }

    providerRef.current = provider;
    forceUpdate(); // 触发重新渲染以更新navigationProvider prop

    // 尝试恢复状态（Memory Router 除外）
    if (routerType !== "memory") {
      const urlState = provider.getCurrentState();
      if (urlState) {
        setNavigationState(urlState);
      } else {
        // 如果没有状态，用初始状态初始化
        provider.replaceState(initialState);
      }
    }

    return () => {
      provider.destroy();
    };
  }, [routerType, isClient, initialState]); // 当 routerType 或 initialState 变化时重新初始化

  // 导航变更处理
  const handleNavigationChange = React.useCallback((newState: NavigationState<T>) => {
    setNavigationState(newState);
    providerRef.current?.pushState(newState);
  }, []);

  return {
    navigationState,
    onNavigationChange: handleNavigationChange,
    navigationProvider: providerRef.current,
  };
}

// ==================== 主页面组件 ====================
export default function AdvancedNavigationPage() {
  // Router 类型选择（默认使用 auto）
  const [routerType, setRouterType] = React.useState<RouterType>("auto");

  // 初始导航状态 - 使用useMemo稳定引用
  const initialState: NavigationState<AppPaneParams> = React.useMemo(
    () => ({
      route: {
        index: 0,
        activePane: "list" as const,
        panes: {
          rail: { section: "home" },
          list: { category: "all", page: 1 },
          detail: { id: "welcome", tab: "overview" },
          tail: { settingId: "general" },
        },
      },
      history: [
        {
          index: 0,
          activePane: "list" as const,
          panes: {
            rail: { section: "home" },
            list: { category: "all", page: 1 },
            detail: { id: "welcome", tab: "overview" },
            tail: { settingId: "general" },
          },
        },
      ],
    }),
    [],
  );

  // 使用带 Router Provider 集成的导航
  const { navigationState, onNavigationChange, navigationProvider } = useNavigationWithRouter<AppPaneParams>(
    initialState,
    routerType,
  );

  const [showUrlBar, setShowUrlBar] = React.useState(true);
  const [currentUrl, setCurrentUrl] = React.useState("");
  const [isMounted, setIsMounted] = React.useState(false);

  // 避免 hydration mismatch，只在客户端渲染某些部分
  React.useEffect(() => {
    setIsMounted(true);
    setCurrentUrl(window.location.href);

    const handleUrlChange = () => {
      setCurrentUrl(window.location.href);
    };

    // 监听 URL 变化
    window.addEventListener("popstate", handleUrlChange);
    return () => window.removeEventListener("popstate", handleUrlChange);
  }, []);

  // 监听导航状态变化以更新 URL 显示
  React.useEffect(() => {
    if (isMounted) {
      setCurrentUrl(window.location.href);
    }
  }, [navigationState, isMounted]);

  return (
    <div className="flex h-screen flex-col">
      {/* 浏览器地址栏模拟 */}
      {showUrlBar && isMounted && (
        <div className="border-b bg-slate-100 dark:bg-slate-900">
          {/* Router 选择器 */}
          <div className="border-b border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-950">
            <div className="mx-auto flex max-w-6xl items-center gap-3">
              <span className="text-xs font-semibold">Router:</span>
              <div className="flex flex-wrap gap-1">
                {(["auto", "navigation-api", "browser", "hash", "memory"] as RouterType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setRouterType(type)}
                    className={cn(
                      "rounded px-2 py-1 text-xs font-medium transition-all",
                      routerType === type
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700",
                    )}>
                    {type === "auto" && "Auto"}
                    {type === "navigation-api" && "Navigation API"}
                    {type === "browser" && "Browser History"}
                    {type === "hash" && "Hash"}
                    {type === "memory" && "Memory"}
                  </button>
                ))}
              </div>

              {/* 使用说明按钮 */}
              <Sheet>
                <SheetTrigger asChild>
                  <button
                    className="rounded p-1 transition-colors hover:bg-slate-200 dark:hover:bg-slate-700"
                    title="使用说明">
                    <HelpCircle size={16} />
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>🎯 Advanced Navigation 使用说明</SheetTitle>
                    <SheetDescription>
                      三种 Router Provider 的详细说明和使用方法
                    </SheetDescription>
                  </SheetHeader>

                  <div className="mt-6 space-y-6">
                    <div>
                      <h3 className="mb-2 font-semibold">基本使用</h3>
                      <ul className="text-muted-foreground space-y-1 text-sm">
                        <li>• 使用顶部的 Router 选择器切换不同的导航模式</li>
                        <li>• 所有导航操作都会根据当前 Router 类型进行处理</li>
                        <li>• 尝试在不同 Router 之间切换以观察 URL 的变化</li>
                      </ul>
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-lg border bg-card p-4">
                        <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                          <span
                            className={cn("h-2 w-2 rounded-full", routerType === "auto" ? "bg-green-500" : "bg-gray-300")}
                          />
                          Auto Provider
                        </h4>
                        <p className="text-muted-foreground text-sm mb-3">
                          自动选择最佳的 Router Provider（推荐）
                        </p>
                        <div className="text-muted-foreground space-y-1 text-xs">
                          <div>✓ 优先使用 Navigation API（现代浏览器）</div>
                          <div>✓ 自动降级到 Browser History（兼容性）</div>
                          <div>✓ 无需手动检测浏览器支持</div>
                          <div>✓ 推荐用于大多数应用</div>
                        </div>
                      </div>

                      <div className="rounded-lg border bg-card p-4">
                        <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                          <span
                            className={cn("h-2 w-2 rounded-full", routerType === "navigation-api" ? "bg-green-500" : "bg-gray-300")}
                          />
                          Navigation API
                        </h4>
                        <p className="text-muted-foreground text-sm mb-3">
                          使用现代 Navigation API（Chrome 102+, Firefox 118+）
                        </p>
                        <div className="text-muted-foreground space-y-1 text-xs">
                          <div>✓ 更强大的导航控制能力</div>
                          <div>✓ 原生支持导航拦截和处理</div>
                          <div>✓ 更好的单页应用支持</div>
                          <div>⚠️ Safari 尚不支持</div>
                        </div>
                      </div>

                      <div className="rounded-lg border bg-card p-4">
                        <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                          <span
                            className={cn("h-2 w-2 rounded-full", routerType === "browser" ? "bg-green-500" : "bg-gray-300")}
                          />
                          Browser History
                        </h4>
                        <p className="text-muted-foreground text-sm mb-3">
                          使用标准的 History API 进行导航状态管理
                        </p>
                        <div className="text-muted-foreground space-y-1 text-xs">
                          <div>✓ 使用标准的 History API</div>
                          <div>✓ 状态保存在 URL 查询参数中</div>
                          <div>✓ 支持浏览器前进/后退</div>
                          <div>✓ 支持页面刷新保持状态</div>
                        </div>
                      </div>

                      <div className="rounded-lg border bg-card p-4">
                        <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                          <span className={cn("h-2 w-2 rounded-full", routerType === "hash" ? "bg-green-500" : "bg-gray-300")} />
                          Hash Router
                        </h4>
                        <p className="text-muted-foreground text-sm mb-3">
                          使用 URL Hash 存储导航状态，适用于静态网站托管
                        </p>
                        <div className="text-muted-foreground space-y-1 text-xs">
                          <div>✓ 使用 URL Hash 存储状态</div>
                          <div>✓ 适用于静态网站托管</div>
                          <div>✓ 无需服务器端支持</div>
                          <div>✓ URL 格式：#/pane?data=...</div>
                        </div>
                      </div>

                      <div className="rounded-lg border bg-card p-4">
                        <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                          <span
                            className={cn("h-2 w-2 rounded-full", routerType === "memory" ? "bg-green-500" : "bg-gray-300")}
                          />
                          Memory Router
                        </h4>
                        <p className="text-muted-foreground text-sm mb-3">
                          将导航状态保存在内存中，不修改 URL
                        </p>
                        <div className="text-muted-foreground space-y-1 text-xs">
                          <div>✓ 状态仅保存在内存中</div>
                          <div>✓ 不修改 URL</div>
                          <div>✓ 适用于嵌入式应用</div>
                          <div>✓ 刷新页面会丢失状态</div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg bg-muted p-4">
                      <p className="text-muted-foreground text-xs">
                        💡 查看 <code className="text-primary bg-background px-1 py-0.5 rounded">@/components/scaffold/navigation</code> 了解所有 Router Provider 的完整实现
                      </p>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              <button
                onClick={() => {
                  setRouterType("browser");
                  window.location.reload();
                }}
                className="ml-auto rounded p-1 transition-colors hover:bg-slate-200 dark:hover:bg-slate-700"
                title="重置">
                <RefreshCw size={14} />
              </button>
            </div>
          </div>

          {/* 地址栏 */}
          <div className="p-3">
            <div className="mx-auto flex max-w-6xl items-center gap-3">
              <div className="flex gap-1">
                <button
                  onClick={() => window.history.back()}
                  className="rounded p-1.5 transition-colors hover:bg-slate-200 dark:hover:bg-slate-800"
                  title="后退">
                  <ArrowLeft size={18} />
                </button>
                <button
                  onClick={() => window.history.forward()}
                  className="rounded p-1.5 transition-colors hover:bg-slate-200 dark:hover:bg-slate-800"
                  title="前进">
                  <ArrowRight size={18} />
                </button>
              </div>
              <div
                className="scrollbar-width-none max-h-8 flex-1 overflow-auto rounded-full border bg-white px-4 py-1.5 font-mono text-sm break-all dark:bg-slate-950"
                style={{ scrollbarWidth: "none" }}>
                {currentUrl || (routerType === "memory" ? "(Memory - No URL)" : "Loading...")}
              </div>
              <button
                onClick={() => setShowUrlBar(false)}
                className="rounded px-3 py-1.5 text-sm transition-colors hover:bg-slate-200 dark:hover:bg-slate-800">
                隐藏
              </button>
            </div>
          </div>
        </div>
      )}

      {!showUrlBar && (
        <button
          onClick={() => setShowUrlBar(true)}
          className="fixed top-4 right-4 z-50 rounded border bg-white px-3 py-1.5 text-sm shadow-lg transition-colors hover:bg-slate-200 dark:bg-slate-950 dark:hover:bg-slate-800">
          显示地址栏
        </button>
      )}

      {/* Scaffold 主内容 */}
      <Scaffold<AppPaneParams>
        className="flex-1"
        navigationState={navigationState}
        onNavigationChange={onNavigationChange}
        navigationProvider={navigationProvider || undefined}
        appBar={
            <AppBar
              title={
                <div className="flex items-center gap-2">
                  <Code size={20} />
                  <span className="font-bold">Advanced Navigation</span>
                  <span className="bg-primary/20 text-primary rounded px-2 py-0.5 text-xs">
                    {navigationState.route.activePane}
                  </span>
                </div>
              }
            />
          }
          rail={({ navigate, isActive }) => {
            const sections = [
              { id: "home", label: "Home", icon: Home },
              { id: "docs", label: "Docs", icon: BookOpen },
              { id: "community", label: "Community", icon: Users },
              { id: "settings", label: "Settings", icon: Settings },
            ];

            return (
              <div className="bg-muted/30 flex size-full flex-col gap-2 p-4">
                <div className="mb-2 rounded-lg border bg-blue-50 p-3 dark:bg-blue-950">
                  <h3 className="mb-1 text-sm font-bold">🧭 Navigation Rail</h3>
                  <p className="text-muted-foreground text-xs">Active: {isActive ? "Yes" : "No"}</p>
                </div>

                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => navigate("list", { category: section.id, page: 1 })}
                      className={cn(
                        "hover:bg-accent flex items-center gap-3 rounded-lg p-3 transition-colors",
                        navigationState.route.panes.list.category === section.id && "bg-primary/10",
                      )}>
                      <Icon size={20} />
                      <span>{section.label}</span>
                    </button>
                  );
                })}
              </div>
            );
          }}
          list={({ params, navigate, canGoBack, canGoForward, back, forward, breakpoint }) => (
            <div className="flex size-full flex-col gap-4 p-4">
              <div className="rounded-lg border bg-green-50 p-4 dark:bg-green-950">
                <h3 className="mb-2 text-sm font-bold">📋 List Pane</h3>
                <div className="text-muted-foreground space-y-1 text-xs">
                  <div>Category: {params.category}</div>
                  <div>Page: {params.page}</div>
                  <div>Breakpoint: {breakpoint || "null"}</div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={back}
                  disabled={!canGoBack}
                  className="bg-primary text-primary-foreground rounded px-3 py-2 text-sm disabled:opacity-50">
                  ← Back
                </button>
                <button
                  onClick={forward}
                  disabled={!canGoForward}
                  className="bg-primary text-primary-foreground rounded px-3 py-2 text-sm disabled:opacity-50">
                  Forward →
                </button>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Items in {params.category}</h4>
                {Array.from({ length: 5 }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => navigate("detail", { id: `${params.category}-${i + 1}`, tab: "overview" })}
                    className="hover:bg-accent w-full rounded-lg border p-4 text-left transition-colors">
                    <div className="font-semibold">
                      Item #{i + 1} in {params.category}
                    </div>
                    <div className="text-muted-foreground text-sm">Click to view details</div>
                  </button>
                ))}
              </div>

              <div className="border-t pt-4">
                <h4 className="mb-2 text-sm font-semibold">分页示例</h4>
                <div className="flex gap-2">
                  {[1, 2, 3].map((page) => (
                    <button
                      key={page}
                      onClick={() => navigate("list", { ...params, page })}
                      className={cn(
                        "rounded px-3 py-1 text-sm",
                        params.page === page ? "bg-primary text-primary-foreground" : "bg-muted",
                      )}>
                      {page}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          detail={({ params, navigate, breakpoint }) => (
            <div className="flex size-full flex-col gap-4 p-4">
              <div className="rounded-lg border bg-purple-50 p-4 dark:bg-purple-950">
                <h3 className="mb-2 text-sm font-bold">📄 Detail Pane</h3>
                <div className="text-muted-foreground space-y-1 text-xs">
                  <div>ID: {params.id}</div>
                  <div>Tab: {params.tab}</div>
                  <div>Breakpoint: {breakpoint || "null"}</div>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <h2 className="mb-4 text-xl font-bold">Detail: {params.id}</h2>

                <div className="mb-4 flex gap-2">
                  {["overview", "specs", "reviews"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => navigate("detail", { ...params, tab })}
                      className={cn(
                        "rounded px-3 py-1.5 text-sm capitalize",
                        params.tab === tab ? "bg-primary text-primary-foreground" : "bg-muted",
                      )}>
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="text-muted-foreground mb-4">
                  <p>当前标签页：{params.tab}</p>
                  <p className="mt-2 text-sm">
                    注意：切换标签页会更新 URL，你可以使用浏览器的前进/后退按钮在标签之间导航。
                  </p>
                </div>

                <button
                  onClick={() => navigate("tail", { settingId: "advanced" })}
                  className="bg-primary text-primary-foreground rounded px-4 py-2 text-sm">
                  Open Settings
                </button>
              </div>
            </div>
          )}
          tail={({ params, isActive, navigate }) =>
            isActive ? (
              <div className="bg-muted/50 flex size-full flex-col gap-4 p-4">
                <div className="rounded-lg border bg-amber-50 p-4 dark:bg-amber-950">
                  <h3 className="mb-2 text-sm font-bold">⚙️ Tail Pane</h3>
                  <div className="text-muted-foreground space-y-1 text-xs">
                    <div>Setting: {params.settingId}</div>
                    <div>Active: {isActive ? "Yes" : "No"}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  {["general", "privacy", "advanced"].map((settingId) => (
                    <button
                      key={settingId}
                      onClick={() => navigate("tail", { settingId })}
                      className={cn(
                        "w-full rounded-lg border p-3 text-left capitalize transition-colors",
                        params.settingId === settingId ? "bg-primary/10" : "hover:bg-accent",
                      )}>
                      {settingId} Settings
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid size-full place-items-center">
                <p className="font-light text-neutral-400 italic">未激活</p>
              </div>
            )
          }
        />
    </div>
  );
}
