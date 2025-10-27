"use client";

import { cn } from "@/lib/utils";
import * as React from "react";
import { useMergeRefs } from "react-best-merge-refs";

export interface ScaffoldProps<T extends PaneParams = PaneParams> {
  /**
   * AppBar slot - can be a ReactNode or a function that returns ReactNode
   */
  appBar?: ScaffoldSlot;
  /**
   * Floating action button slot
   */
  floatingActionButton?: ScaffoldSlot;

  /**
   * Custom protal - A list of custom portal wrappers.
   *
   * --- USAGE CONTRACT ---
   * Each wrapper function receives `{ children, container }` and must return a React element.
   *
   * To avoid breaking the Scaffold's grid layout, custom wrappers MUST adhere to one of the following rules:
   *
   * 1. **Be a 'true' portal**: The component should not render any wrapping DOM element in its own location (e.g., Radix UI's Portal components). This is the PREFERRED method.
   *
   * 2. **Use `display: contents`**: If the wrapper must render a DOM element (e.g., a `div`), that element MUST use `display: contents`. This makes the wrapper visually disappear, allowing its children to participate directly in the grid layout.
   *
   * @example
   * // GOOD: A true portal wrapper
   * const GoodWrapper = ({ children, container }) => <SomePortal container={container}>{children}</SomePortal>;
   *
   * // GOOD: A structural wrapper using `display: contents`
   * const GoodStructuralWrapper = ({ children, container }) => <div className="contents">{children}</div>;
   *
   * // BAD: This will break the layout!
   * const BadWrapper = ({ children, container }) => <div>{children}</div>;
   */
  portalWrappers?: PortalWrapper[];

  // Navigation-related props
  /**
   * Navigation rail slot
   */
  rail?: PaneSlot<PaneParams, "rail", { railPosition: ScaffoldRailPosition }>;
  list?: PaneSlot<PaneParams, "list">;
  detail?: PaneSlot<PaneParams, "detail">;
  tail?: PaneSlot<PaneParams, "tail">;

  /**
   * 注入导航状态
   */
  navigationState?: NavigationState<T>;
  /**
   * 导航状态变更
   */
  onNavigationChange?: OnNavigationChange<T>;
}
export type ScaffoldRailPosition = "inline-start" | "block-end";
export type ScaffoldRTailRenderMode = "sheet" | "dialog" | "drawer" | "static";
export interface ScaffoldContext {
  breakpoint: ScaffoldBreakpoint;
}
export type ScaffoldBreakpoint = null | "mobile" | "tablet" | "desktop";

type SlotRender<Args extends unknown[] = unknown[]> = (...args: Args) => React.ReactNode;

type SlotRenderParams<T> = T extends SlotRender<infer Args> ? Args : never;

type ScaffoldSlot<CtxExt extends object = {}> = SlotRender<[ScaffoldContext & CtxExt]> | React.ReactNode;

/**
 * 传递给每个 Pane 的渲染函数的上下文对象
 */
export interface PaneRenderProps<P extends PaneParams = PaneParams, N extends PaneName = PaneName> {
  /** 当前 Pane 的状态参数 */
  params: P[N];
  /** 当前 Pane 是否在移动视图中处于激活状态 */
  isActive: boolean;

  /** 用于触发前进导航 */
  navigate: <N extends PaneName>(targetPane: N, targetParams: P[N]) => void;
  /** 是否可以返回 */
  canGoBack: boolean;
  /** 是否可以前进 */
  canGoForward: boolean;
  /** 用于触发导航前进 */
  forward: () => void;
  /** 用于触发返回导航 */
  back: () => void;
  /** 当前的断点信息 */
  breakpoint: ScaffoldBreakpoint;
}
type PaneSlot<P extends PaneParams, N extends PaneName, CtxExt extends object = {}> = SlotRender<
  [ScaffoldContext & CtxExt & PaneRenderProps<P, N>]
>;

// Helper function to render slots that can be either ReactNode or a function returning ReactNode
const renderSlot = <T extends React.ReactNode | SlotRender<any[]>>(
  slot: T | undefined,
  ...args: SlotRenderParams<T>
) => {
  if (!slot) {
    return null;
  }
  if (typeof slot === "function") {
    return slot(...args);
  }
  return slot as React.ReactNode;
};

type ScaffoldComponentProps<T extends PaneParams = PaneParams> = ScaffoldProps<T> & React.ComponentPropsWithRef<"div">;

type PortalWrapper = (props: { children: React.ReactNode; container: HTMLDivElement }) => React.ReactNode;

const wrappedChildren = (
  portalWrappers: PortalWrapper[],
  container: HTMLDivElement | null,
  children: React.ReactNode,
) => {
  return children;
  // if (!container) return children;
  // // reduceRight 从数组末尾开始，确保数组第一项在最外层
  // return portalWrappers.reduceRight(
  //   (acc, wrapper) => wrapper({ children: acc, container: container }),
  //   children, // 初始值是你的主要内容
  // );
};

// 我们用泛型来允许用户为每个 Pane 定义自己的参数类型
export type PaneParams = Record<PaneName, object>;

export type PaneName = "rail" | "list" | "detail" | "tail";

export interface NavigationRoute<T extends PaneParams = PaneParams> {
  index: number;
  /** 当前在移动端/堆叠视图中激活的面板 */
  activePane: PaneName;

  /** 每个面板各自的内部状态参数 */
  panes: {
    rail: T["rail"];
    list: T["list"];
    detail: T["detail"];
    tail: T["tail"];
  };
}

export interface NavigationState<T extends PaneParams = PaneParams> {
  route: NavigationRoute<T>;
  history: NavigationRoute<T>[];
}

/** 描述导航变更的原因 */
export interface NavigationChangeReason {
  type: "forward" | "back"; // 'forward' 是前进, 'back' 是返回
  fromPane?: PaneName;
  toPane: PaneName;
}

// 回调函数的类型
export type OnNavigationChange<T extends PaneParams = PaneParams> = (
  newState: NavigationState<T>,
  reason: NavigationChangeReason,
) => void;

export const Scaffold = <T extends PaneParams = PaneParams,>({
  ref,
  className,
  appBar,
  floatingActionButton,
  portalWrappers,

  rail,
  list,
  detail,
  tail,

  navigationState,
  onNavigationChange,
  ...props
}: ScaffoldComponentProps<T>) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const indicatorRef = React.useRef<HTMLDivElement>(null);
  const breakpoint = useContainerBreakpoint(containerRef, indicatorRef);

  const buildInPortalWrappers: PortalWrapper[] = [
    //
    // DialogPortal,
    // MenubarPortal,
    // PopoverPortal,
    // ContextMenuPortal,
    // DropdownMenuPortal,
    // DrawerPortal,
    // SelectPortal,
    // HoverCardPortal,
  ];
  // .filter((Portal) => Portal !== undefined) // Filter out undefined Portals
  // .map((Portal) => {
  //   const wrapper: PortalWrapper = ({ children, container }) => {
  //     return <Portal container={container}>{children}</Portal>;
  //   };
  //   return wrapper;
  // });

  /**
     Breakpoint prefix	Minimum width	CSS
     sm	40rem (640px)	@media (width >= 40rem) { ... }
     md	48rem (768px)	@media (width >= 48rem) { ... }
     lg	64rem (1024px)	@media (width >= 64rem) { ... }
     xl	80rem (1280px)	@media (width >= 80rem) { ... }
     2xl	96rem (1536px)	@media (width >= 96rem) { ... }
     */
  const context: ScaffoldContext = {
    breakpoint:
      breakpoint === "xl" || breakpoint === "2xl"
        ? "desktop"
        : breakpoint === "md" || breakpoint === "lg"
          ? "tablet"
          : breakpoint === "sm"
            ? "mobile"
            : null,
  };

  // Render appBar and FAB slots
  const appBarContent = renderSlot(appBar, context);
  const fabContent = renderSlot(floatingActionButton, context);

  const navState = React.useMemo<NavigationState<T>>(() => {
    if (navigationState) {
      return navigationState;
    }
    const route: NavigationRoute<T> = { index: 0, activePane: "rail", panes: {} as T };
    return { route, history: [route] };
  }, [navigationState]);

  const paneBaseContext: Omit<PaneRenderProps<T>, "params" | "isActive" | "breakpoint"> = React.useMemo(() => {
    const canGoBack = navState.history.findIndex((route) => route.index === navState.route.index) > 0;
    const canGoForward =
      navState.history.findLastIndex((route) => route.index === navState.route.index) < navState.history.length - 1;
    return {
      /** 用于触发前进导航 */
      navigate: (targetPane, targetParams) => {
        if (onNavigationChange) {
          const route = {
            index: navState.history.length,
            activePane: targetPane,
            panes: {
              ...navState.route.panes,
              [targetPane]: targetParams,
            },
          };
          onNavigationChange(
            {
              route: route,
              history: [
                ...(canGoForward ? navState.history.slice(0, navState.route.index + 1) : navState.history),
                route,
              ],
            },
            {
              type: "forward",
              fromPane: navState.route.activePane,
              toPane: targetPane,
            },
          );
        }
      },
      /** 是否可以返回 */
      canGoBack,
      /** 是否可以前进 */
      canGoForward,
      /** 用于触发导航前进 */
      forward: () => {
        if (canGoForward && onNavigationChange) {
          const route = navState.history[navState.route.index + 1];
          onNavigationChange(
            {
              route: route,
              history: navState.history,
            },
            {
              type: "forward",
              fromPane: navState.route.activePane,
              toPane: route.activePane,
            },
          );
        }
      },
      /** 用于触发返回导航 */
      back: () => {
        if (canGoBack && onNavigationChange) {
          const route = navState.history[navState.route.index - 1];
          onNavigationChange(
            {
              route: route,
              history: navState.history,
            },
            {
              type: "back",
              fromPane: navState.route.activePane,
              toPane: route.activePane,
            },
          );
        }
      },
    };
  }, [navState]);

  const [railPosition, setRailPosition] = React.useState<ScaffoldRailPosition | "">("");

  React.useLayoutEffect(() => {
    setRailPosition(context.breakpoint === "mobile" ? "block-end" : "inline-start");
  }, [breakpoint]);

  const railContent = railPosition
    ? renderSlot(rail, {
        ...context,
        ...paneBaseContext,
        params: navState.route.panes.rail,
        isActive: navState.route.activePane === "rail",
        railPosition: railPosition,
      })
    : null;
  const listContent = renderSlot(list, {
    ...context,
    ...paneBaseContext,
    params: navState.route.panes.list,
    isActive: navState.route.activePane === "list",
  });
  const detailContent = renderSlot(detail, {
    ...context,
    ...paneBaseContext,
    params: navState.route.panes.detail,
    isActive: navState.route.activePane === "detail",
  });

  const tailContent = renderSlot(tail, {
    ...context,
    ...paneBaseContext,
    params: navState.route.panes.tail,
    isActive: navState.route.activePane === "tail",
  });

  return (
    <div className={cn("@container", className)} ref={useMergeRefs({ ref, containerRef })} {...props}>
      <div
        className={cn(
          "h-screen w-screen",
          "h-dvh w-dvw",
          // Container queries support for responsive components
          "grid",

          // 移动端 (默认)
          `grid-cols-1`,
          `grid-rows-[auto_1fr_auto]`,
          `[grid-template-areas:"header"_"main"_"bottom"]`,

          // 平板端 (md:@) - 当容器宽度 >= md断点值 (e.g., 768px)
          `@md:grid-cols-[auto_1fr_2fr]`,
          `@md:[grid-template-areas:"rail_header_header"_"rail_list_detail"_"rail_footer_footer"]`,

          // 桌面端 (xl:@) - 当容器宽度 >= xl断点值 (e.g., 1280px)
          `@xl:grid-cols-[auto_2fr_3fr_2fr]`,
          `@xl:[grid-template-areas:"rail_header_header_tail"_"rail_list_detail_tail"_"rail_footer_footer_tail"]`,
        )}>
        {/* --- Breakpoint 指示器元素 --- */}
        <div
          ref={indicatorRef}
          className="invisible absolute -z-10 before:content-[''] @sm:before:content-['sm'] @md:before:content-['md'] @lg:before:content-['lg'] @xl:before:content-['xl'] @2xl:before:content-['2xl']"
        />
      {/* Temporarily bypass Portal wrappers to debug */}
      {(() => {
        // Bypass Portal wrappers temporarily until fixed by user
        return (
          <>
            {/* AppBar */}
            {appBarContent && (
              <header className="contents" style={{ gridArea: "header" }}>
                {appBarContent}
              </header>
            )}

            {/* Rail and List Panes - conditionally rendered based on breakpoint and activePane */}
            {(context.breakpoint !== "mobile" ||
              navState.route.activePane === "rail" ||
              navState.route.activePane === "list") && (
              <>
                {railContent && (
                  <aside
                    className="overflow-auto scroll-smooth"
                    style={{ gridArea: railPosition === "inline-start" ? "rail" : "bottom" }}>
                    {railContent}
                  </aside>
                )}

                {listContent && (
                  <nav
                    className="overflow-auto scroll-smooth"
                    style={{ gridArea: context.breakpoint === "mobile" ? "main" : "list" }}>
                    {listContent}
                  </nav>
                )}
              </>
            )}
            {/* Detail and Tail Panes - conditionally rendered based on breakpoint and activePane */}
            {(context.breakpoint !== "mobile" ||
              navState.route.activePane === "detail" ||
              navState.route.activePane === "tail") && (
              <>
                {detailContent && (
                  <article
                    className={cn(
                      "z-10 overflow-auto scroll-smooth",
                      // In desktop view, detail has its own grid area and should always be visible
                      // In tablet/mobile view, detail shares grid area with tail, show only when active
                      context.breakpoint === "desktop"
                        ? "translate-x-0"
                        : navState.route.activePane === "detail"
                          ? "translate-x-0"
                          : "translate-x-full",
                    )}
                    style={{ gridArea: context.breakpoint === "mobile" ? "main" : "detail" }}>
                    {detailContent}
                  </article>
                )}
                {tailContent && (
                  <aside
                    className={cn(
                      "z-20 overflow-auto scroll-smooth",
                      // In desktop view, tail has its own grid area and should always be visible
                      // In tablet/mobile view, use translate to show/hide based on activePane
                      context.breakpoint === "desktop"
                        ? "translate-x-0"
                        : navState.route.activePane === "tail"
                          ? "translate-x-0"
                          : "translate-x-full",
                    )}
                    style={{
                      gridArea:
                        context.breakpoint === "desktop" ? "tail" : context.breakpoint === "tablet" ? "detail" : "main",
                    }}>
                    {tailContent}
                  </aside>
                )}
              </>
            )}

            {/* Floating Action Button */}
            <div
              className="place-items-end"
              style={{
                gridArea:
                  context.breakpoint === "desktop" ? "tail" : context.breakpoint === "tablet" ? "detail" : "main",
              }}>
              {fabContent}
            </div>
          </>
        );
      })()}
      </div>
    </div>
  );
};

Scaffold.displayName = "Scaffold";

function useContainerBreakpoint<TContainer extends HTMLElement, TIndicator extends HTMLElement>(
  containerRef: React.RefObject<TContainer | null>,
  indicatorRef: React.RefObject<TIndicator | null>,
): string | undefined {
  const [activeBreakpoint, setActiveBreakpoint] = React.useState<string | undefined>();

  React.useEffect(() => {
    const containerElement = containerRef.current;
    const indicatorElement = indicatorRef.current;

    // 确保两个元素都已挂载到 DOM
    if (!containerElement || !indicatorElement) {
      return;
    }

    const observer = new ResizeObserver(() => {
      // 使用 getComputedStyle 读取伪元素上的 content 属性
      // 这是最可靠的方法
      const indicatorContent = window.getComputedStyle(indicatorElement, "::before").getPropertyValue("content");

      // getComputedStyle 会返回带引号的字符串，例如 `"md"`，我们需要去掉引号
      const breakpointName = indicatorContent.replace(/['"]/g, "");

      if (breakpointName !== activeBreakpoint) {
        setActiveBreakpoint(breakpointName === "none" ? undefined : breakpointName);
      }
    });

    // 监听容器元素的尺寸变化
    observer.observe(containerElement);

    // 组件卸载时停止监听
    return () => {
      observer.disconnect();
    };
  }, [containerRef, indicatorRef, activeBreakpoint]);

  return activeBreakpoint;
}
