"use client";

import { cn } from "@/lib/utils";
import * as React from "react";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Menu } from "lucide-react";

/**
 * TopNavbar Context
 */
interface TopNavbarContextValue {
  breakpoint: TopNavbarBreakpoint;
}

type TopNavbarBreakpoint = "compact" | "full";

const TopNavbarContext = React.createContext<TopNavbarContextValue | null>(null);

const useTopNavbar = () => {
  const context = React.useContext(TopNavbarContext);
  if (!context) {
    throw new Error("TopNavbar components must be used within TopNavbar");
  }
  return context;
};

/**
 * TopNavbar - 主容器
 */
const TopNavbar = React.forwardRef<HTMLElement, React.ComponentProps<"header">>(
  ({ className, children, ...props }, ref) => {
    const containerRef = React.useRef<HTMLElement>(null);
    const indicatorRef = React.useRef<HTMLDivElement>(null);
    const breakpoint = useContainerBreakpoint(containerRef, indicatorRef);

    const contextValue = React.useMemo<TopNavbarContextValue>(
      () => ({
        breakpoint: breakpoint,
      }),
      [breakpoint],
    );

    return (
      <TopNavbarContext.Provider value={contextValue}>
        <header
          ref={(node) => {
            if (typeof ref === "function") {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
            (containerRef as React.MutableRefObject<HTMLElement | null>).current = node;
          }}
          className={cn(
            "@container relative flex h-14 w-full items-center gap-2 border-b bg-background px-4",
            className,
          )}
          {...props}>
          {/* Breakpoint indicator */}
          <div
            ref={indicatorRef}
            className="pointer-events-none invisible absolute -z-10 size-full before:content-['compact'] @3xl:before:content-['full']"
          />
          {children}
        </header>
      </TopNavbarContext.Provider>
    );
  },
);
TopNavbar.displayName = "TopNavbar";

/**
 * TopNavbarNav - 左侧导航区域
 */
const TopNavbarNav = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex items-center gap-2", className)} {...props}>
        {children}
      </div>
    );
  },
);
TopNavbarNav.displayName = "TopNavbarNav";

/**
 * TopNavbarBackButton - 返回按钮，支持长按显示历史记录
 */
interface HistoryItem {
  title: string;
  href?: string;
  onClick?: () => void;
}

interface TopNavbarBackButtonProps extends React.ComponentProps<typeof Button> {
  onBack?: () => void;
  historyItems?: HistoryItem[];
  disabled?: boolean;
}

const TopNavbarBackButton = React.forwardRef<HTMLButtonElement, TopNavbarBackButtonProps>(
  ({ onBack, historyItems = [], disabled = false, className, ...props }, ref) => {
    const [isHistoryOpen, setIsHistoryOpen] = React.useState(false);
    const longPressTimerRef = React.useRef<number | null>(null);
    const [isLongPressing, setIsLongPressing] = React.useState(false);

    const handlePointerDown = React.useCallback(() => {
      if (historyItems.length === 0) return;

      setIsLongPressing(false);
      longPressTimerRef.current = window.setTimeout(() => {
        setIsLongPressing(true);
        setIsHistoryOpen(true);
      }, 500); // 500ms 长按阈值
    }, [historyItems.length]);

    const handlePointerUp = React.useCallback(() => {
      if (longPressTimerRef.current !== null) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }

      if (!isLongPressing && onBack) {
        onBack();
      }

      setIsLongPressing(false);
    }, [isLongPressing, onBack]);

    const handlePointerLeave = React.useCallback(() => {
      if (longPressTimerRef.current !== null) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }
      setIsLongPressing(false);
    }, []);

    React.useEffect(() => {
      return () => {
        if (longPressTimerRef.current !== null) {
          clearTimeout(longPressTimerRef.current);
        }
      };
    }, []);

    if (historyItems.length === 0) {
      return (
        <Button
          ref={ref}
          variant="ghost"
          size="icon-sm"
          onClick={onBack}
          disabled={disabled}
          className={className}
          {...props}>
          <ChevronLeft />
        </Button>
      );
    }

    return (
      <DropdownMenu open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            ref={ref}
            variant="ghost"
            size="icon-sm"
            disabled={disabled}
            className={className}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerLeave}
            {...props}>
            <ChevronLeft />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {historyItems.map((item, index) => (
            <DropdownMenuItem
              key={index}
              onClick={() => {
                item.onClick?.();
                setIsHistoryOpen(false);
              }}>
              {item.title}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
);
TopNavbarBackButton.displayName = "TopNavbarBackButton";

/**
 * TopNavbarBreadcrumb - 面包屑导航的包装器
 * 根据 breakpoint 决定是否显示
 */
const TopNavbarBreadcrumb = React.forwardRef<HTMLElement, React.ComponentProps<typeof Breadcrumb>>(
  ({ className, children, ...props }, ref) => {
    const { breakpoint } = useTopNavbar();
    const [mounted, setMounted] = React.useState(false);

    React.useLayoutEffect(() => {
      setMounted(true);
    }, []);

    // 服务器端渲染时始终显示，避免hydration错误
    // 客户端mounted后根据breakpoint决定
    if (mounted && breakpoint === "compact") {
      return null;
    }

    return (
      <Breadcrumb ref={ref} className={className} {...props}>
        {children}
      </Breadcrumb>
    );
  },
);
TopNavbarBreadcrumb.displayName = "TopNavbarBreadcrumb";

/**
 * TopNavbarTitle - 中间标题区域
 */
const TopNavbarTitle = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex-1 truncate text-center font-medium", className)} {...props}>
        {children}
      </div>
    );
  },
);
TopNavbarTitle.displayName = "TopNavbarTitle";

/**
 * TopNavbarActions - 右侧操作区域
 */
const TopNavbarActions = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex items-center gap-2", className)} {...props}>
        {children}
      </div>
    );
  },
);
TopNavbarActions.displayName = "TopNavbarActions";

/**
 * ActionItem Context - 用于在 ActionsMenu 和 ActionsItem 之间共享状态
 */
interface ActionsMenuContextValue {
  mode: "menubar" | "dropdown";
}

const ActionsMenuContext = React.createContext<ActionsMenuContextValue | null>(null);

const useActionsMenu = () => {
  const context = React.useContext(ActionsMenuContext);
  if (!context) {
    throw new Error("TopNavbarActionsItem must be used within TopNavbarActionsMenu");
  }
  return context;
};

/**
 * TopNavbarActionsMenu - Actions 的菜单容器
 * 根据 breakpoint 使用 Menubar 或 DropdownMenu
 */
interface TopNavbarActionsMenuProps {
  children: React.ReactNode;
  className?: string;
  triggerLabel?: React.ReactNode;
}

const TopNavbarActionsMenu = React.forwardRef<HTMLDivElement, TopNavbarActionsMenuProps>(
  ({ children, className, triggerLabel = <Menu /> }, ref) => {
    const { breakpoint } = useTopNavbar();
    const [isMounted, setIsMounted] = React.useState(false);

    React.useLayoutEffect(() => {
      setIsMounted(true);
    }, []);

    // 服务器端和未挂载时使用menubar模式，避免hydration错误
    const mode = isMounted && breakpoint === "compact" ? "dropdown" : "menubar";

    const contextValue = React.useMemo<ActionsMenuContextValue>(() => ({ mode }), [mode]);

    if (mode === "menubar") {
      return (
        <ActionsMenuContext.Provider value={contextValue}>
          <Menubar ref={ref} className={cn("border-none bg-transparent p-0", className)}>
            {children}
          </Menubar>
        </ActionsMenuContext.Provider>
      );
    }

    return (
      <ActionsMenuContext.Provider value={contextValue}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm">
              {triggerLabel}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className={className}>
            {children}
          </DropdownMenuContent>
        </DropdownMenu>
      </ActionsMenuContext.Provider>
    );
  },
);
TopNavbarActionsMenu.displayName = "TopNavbarActionsMenu";

/**
 * TopNavbarActionsItem - Actions 的单个项目
 * 根据 ActionsMenu 的 mode 渲染为 MenubarMenu 或 DropdownMenuItem
 */
interface TopNavbarActionsItemProps {
  label: React.ReactNode;
  children?: React.ReactNode;
  onSelect?: () => void;
  className?: string;
}

const TopNavbarActionsItem = React.forwardRef<HTMLDivElement, TopNavbarActionsItemProps>(
  ({ label, children, onSelect, className }, ref) => {
    const { mode } = useActionsMenu();

    if (mode === "menubar") {
      if (children) {
        return (
          <MenubarMenu>
            <MenubarTrigger className={className}>{label}</MenubarTrigger>
            <MenubarContent>{children}</MenubarContent>
          </MenubarMenu>
        );
      }

      return (
        <MenubarMenu>
          <MenubarTrigger className={className} onClick={onSelect}>
            {label}
          </MenubarTrigger>
        </MenubarMenu>
      );
    }

    // dropdown mode
    if (children) {
      return (
        <div ref={ref} className="contents">
          {children}
        </div>
      );
    }

    return (
      <DropdownMenuItem ref={ref} onClick={onSelect} className={className}>
        {label}
      </DropdownMenuItem>
    );
  },
);
TopNavbarActionsItem.displayName = "TopNavbarActionsItem";

/**
 * TopNavbarActionsSubItem - Actions 的子项目
 * 在 menubar 模式下渲染为 MenubarItem，在 dropdown 模式下渲染为 DropdownMenuItem
 */
interface TopNavbarActionsSubItemProps {
  children: React.ReactNode;
  onSelect?: () => void;
  className?: string;
}

const TopNavbarActionsSubItem = React.forwardRef<HTMLDivElement, TopNavbarActionsSubItemProps>(
  ({ children, onSelect, className }, ref) => {
    const { mode } = useActionsMenu();

    if (mode === "menubar") {
      return (
        <MenubarItem ref={ref} onClick={onSelect} className={className}>
          {children}
        </MenubarItem>
      );
    }

    return (
      <DropdownMenuItem ref={ref} onClick={onSelect} className={className}>
        {children}
      </DropdownMenuItem>
    );
  },
);
TopNavbarActionsSubItem.displayName = "TopNavbarActionsSubItem";

/**
 * 使用容器查询断点的 Hook
 * 直接基于容器宽度判断，更可靠
 */
function useContainerBreakpoint<TContainer extends HTMLElement, TIndicator extends HTMLElement>(
  containerRef: React.RefObject<TContainer | null>,
  indicatorRef: React.RefObject<TIndicator | null>,
): TopNavbarBreakpoint {
  const [activeBreakpoint, setActiveBreakpoint] = React.useState<TopNavbarBreakpoint>("compact");

  React.useLayoutEffect(() => {
    const containerElement = containerRef.current;

    if (!containerElement) {
      return;
    }

    // 立即计算初始断点
    const updateBreakpoint = () => {
      const width = containerElement.offsetWidth;
      const newBreakpoint: TopNavbarBreakpoint = width >= 768 ? "full" : "compact";
      setActiveBreakpoint((prev) => {
        // 只在实际改变时更新，减少不必要的渲染
        if (prev !== newBreakpoint) {
          return newBreakpoint;
        }
        return prev;
      });
    };

    // 初始化时立即执行一次
    updateBreakpoint();

    const observer = new ResizeObserver(updateBreakpoint);
    observer.observe(containerElement);

    return () => {
      observer.disconnect();
    };
  }, []); // 空依赖数组，只在mount时执行一次

  return activeBreakpoint;
}

export {
  TopNavbar,
  TopNavbarNav,
  TopNavbarBackButton,
  TopNavbarBreadcrumb,
  TopNavbarTitle,
  TopNavbarActions,
  TopNavbarActionsMenu,
  TopNavbarActionsItem,
  TopNavbarActionsSubItem,
  // Re-export for convenience
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
  MenubarSeparator,
};

export type { HistoryItem, TopNavbarBreakpoint };
