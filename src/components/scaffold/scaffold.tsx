"use client";

import { useContainerBreakpoint } from "@/hooks/use-container-breakpoint";
import { cn } from "@/lib/utils";
import * as React from "react";
import { useMergeRefs } from "react-best-merge-refs";

import { Portal as ContextMenuPortal } from "@radix-ui/react-context-menu";
import { Portal as DialogPortal } from "@radix-ui/react-dialog";
import { Portal as DropdownMenuPortal } from "@radix-ui/react-dropdown-menu";
import { Portal as HoverCardPortal } from "@radix-ui/react-hover-card";
import { Portal as MenubarPortal } from "@radix-ui/react-menubar";
import { Portal as PopoverPortal } from "@radix-ui/react-popover";
import { Portal as SelectPortal } from "@radix-ui/react-select";
import { Portal as DrawerPortal } from "vaul";

export interface ScaffoldProps {
  /**
   * AppBar slot - can be a ReactNode or a function that returns ReactNode
   */
  appBar?: ScaffoldSolt;
  // /**
  //  * Drawer slot (left side)
  //  */
  // drawer?: ScaffoldSolt<[]>;
  // /**
  //  * End drawer slot (right side)
  //  */
  // endDrawer?: ScaffoldSolt<[]>;
  /**
   * Navigation rail slot
   */
  navigationBar?: ScaffoldSolt<{ position: NavigationBarPosition }>;
  /**
   * Floating action button slot
   */
  floatingActionButton?: ScaffoldSolt;

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

  children?: ScaffoldSolt;

  /**
   * 注入导航状态
   */
  navigationState?: NavigationState;
  /**
   * 导航状态变更
   */
  onNavigationChange?: OnNavigationChange;
}
export type NavigationBarPosition = "rail" | "bottom";
export interface ScaffoldContext {
  breakpoint: ScaffoldBreakpoint;
}
export type ScaffoldBreakpoint = null | "mobile" | "tablet" | "desktop";

type SoltRender<Args extends unknown[] = unknown[]> = (...args: Args) => React.ReactNode;

type SoltRenderParams<T> = T extends SoltRender<infer Args> ? Args : never;

type ScaffoldSolt<CtxExt extends object = {}> = SoltRender<[ScaffoldContext & CtxExt]> | React.ReactNode;

// Helper function to render slots that can be either ReactNode or a function returning ReactNode
const renderSlot = <T extends React.ReactNode | SoltRender<any[]>>(slot: T, ...args: SoltRenderParams<T>) => {
  if (typeof slot === "function") {
    return slot(...args);
  }
  return slot as React.ReactNode;
};

type ScaffoldComponentProps = ScaffoldProps & React.ComponentPropsWithRef<"div">;

type PortalWrapper = (props: { children: React.ReactNode; container: HTMLDivElement }) => React.ReactNode;

const wrappedChildren = (
  portalWrappers: PortalWrapper[],
  container: HTMLDivElement | null,
  children: React.ReactNode,
) => {
  if (!container) return children;
  // reduceRight 从数组末尾开始，确保数组第一项在最外层
  return portalWrappers.reduceRight(
    (acc, wrapper) => wrapper({ children: acc, container: container }),
    children, // 初始值是你的主要内容
  );
};

const buildInPortalWrappers = [
  //
  DialogPortal,
  MenubarPortal,
  PopoverPortal,
  ContextMenuPortal,
  DropdownMenuPortal,
  DrawerPortal,
  SelectPortal,
  HoverCardPortal,
].map((Portal) => {
  const wrapper: PortalWrapper = ({ children, container }) => {
    return <Portal container={container}>{children}</Portal>;
  };
  return wrapper;
});

// 我们用泛型来允许用户为每个 Pane 定义自己的参数类型
export type PaneParams = Record<PaneName, any>;

export type PaneName = "rail" | "list" | "detail" | "tail";

export interface NavigationState<T extends PaneParams = PaneParams> {
  /** 当前在移动端/堆叠视图中激活的面板 */
  activePane: PaneName;

  /** 每个面板各自的内部状态参数 */
  panes: {
    rail?: T["rail"];
    list?: T["list"];
    detail?: T["detail"];
    tail?: T["tail"];
  };
}

/** 描述导航变更的原因 */
export interface NavigationChangeReason {
  type: "forward" | "back"; // 'forward' 是前进, 'back' 是返回
  fromPane?: PaneName;
  toPane: PaneName;
}

// 回调函数的类型
export type OnNavigationChange = (newState: NavigationState, reason: NavigationChangeReason) => void;

export const Scaffold: React.FC<ScaffoldComponentProps> = ({
  ref,
  children,
  className,
  appBar,
  // drawer,
  // endDrawer,
  // bottomNavigationBar,
  // navigationRail,
  navigationBar,
  floatingActionButton,
  portalWrappers,
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const indicatorRef = React.useRef<HTMLDivElement>(null);
  const breakpoint = useContainerBreakpoint(containerRef, indicatorRef);

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
  }; // Render all slots
  const appBarContent = renderSlot(appBar, context);
  // const drawerContent = renderSlot(drawer);
  // const endDrawerContent = renderSlot(endDrawer);
  // const bottomNavContent = renderSlot(bottomNavigationBar);
  // const navigationRailContent = renderSlot(navigationRail);
  const navigationBarPosition = React.useRef<NavigationBarPosition | "">("");

  if (breakpoint) {
    navigationBarPosition.current = context.breakpoint === "mobile" ? "bottom" : "rail";
  }
  const navigationBarContent = navigationBarPosition.current
    ? renderSlot(navigationBar, { ...context, position: navigationBarPosition.current })
    : null;
  const fabContent = renderSlot(floatingActionButton, context);
  const childrenContent = renderSlot(children, context);

  // const desktopGridTemplateAreas = `"rail header header tail" "rail list detail tail" "rail footer footer tail"`;
  // const tabletGridTemplateAreas = `"rail header header" "rail list detail" "rail footer footer"`;
  // const mobileGridTemplateAreas = `"header" "main" "footer"`;

  return (
    <div
      ref={useMergeRefs({ ref, containerRef })}
      className={cn(
        "h-screen w-screen",
        "h-dvh w-dvw",
        // Container queries support for responsive components
        "@container grid",

        // 移动端 (默认)
        `grid-cols-1`,
        `grid-rows-[auto_1fr_auto]`,
        `[grid-template-areas:"header"_"main"_"bottom"]`,

        // 平板端 (md:@) - 当容器宽度 >= md断点值 (e.g., 768px)
        `md:grid-cols-[auto_1fr_2fr]`,
        `md:[grid-template-areas:"rail_header_header"_"rail_list_detail"_"rail_footer_footer"]`,

        // 桌面端 (xl:@) - 当容器宽度 >= xl断点值 (e.g., 1280px)
        `xl:grid-cols-[auto_2fr_3fr_2fr]`,
        `xl:[grid-template-areas:"rail_header_header_tail"_"rail_list_detail_tail"_"rail_footer_footer_tail"]`,
        className,
      )}>
      {/* --- Breakpoint 指示器元素 --- */}
      <div
        ref={indicatorRef}
        className="sm:@before:content-['sm'] md:@before:content-['md'] lg:@before:content-['lg'] xl:@before:content-['xl'] 2xl:@before:content-['2xl'] invisible absolute -z-10 before:content-['']"
      />
      {wrappedChildren(
        [...buildInPortalWrappers, ...(portalWrappers ?? [])],
        containerRef.current,
        <>
          {/* AppBar */}
          {appBarContent && (
            <header className="contents" style={{ gridArea: "header" }}>
              {appBarContent}
            </header>
          )}

          {/* Navigation Rail */}
          {navigationBarContent && (
            <aside className="contents" style={{ gridArea: navigationBarPosition.current }}>
              {navigationBarContent}
            </aside>
          )}
          {/* Main Content */}

          <main
            className="overflow-auto scroll-smooth"
            style={{
              gridArea: "main",
            }}>
            {childrenContent}
          </main>
          {/* Floating Action Button */}
          <div className="contents place-content-end">{fabContent}</div>
        </>,
      )}
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
