"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import * as React from "react";
import { useMergeRefs } from "react-best-merge-refs";
import { useResponsiveVariant, type RenderStrategyProvider } from "../responsive-variant";

/**
 * ActionsBar 组件属性
 */
export interface ActionsBarProps extends Omit<React.ComponentProps<"div">, "children"> {
  /** 子元素（ActionItem 组件） */
  children: React.ReactNode;
  /** 渲染策略 Provider，默认使用 adjacentProvider */
  strategy?: RenderStrategyProvider<"compact" | "full">;
  /** 是否启用过渡动画，默认 false */
  enableTransition?: boolean;
  /** Dropdown 触发按钮的标签，默认为汉堡菜单图标 */
  triggerLabel?: React.ReactNode;
}

/**
 * ActionItem 组件属性
 */
export interface ActionItemProps {
  /** 标签 */
  label: React.ReactNode;
  /** 子项（用于下拉菜单） */
  children?: React.ReactNode;
  /** 点击事件（无子项时） */
  onSelect?: () => void;
  /** 自定义类名 */
  className?: string;
}

/**
 * ActionSubItem 组件属性
 */
export interface ActionSubItemProps {
  /** 子元素 */
  children: React.ReactNode;
  /** 点击事件 */
  onSelect?: () => void;
  /** 自定义类名 */
  className?: string;
}

/**
 * ActionsBar Context
 */
interface ActionsBarContextValue {
  mode: "navigation" | "dropdown";
}

const ActionsBarContext = React.createContext<ActionsBarContextValue | null>(null);

const useActionsBar = () => {
  const context = React.useContext(ActionsBarContext);
  if (!context) {
    throw new Error("ActionItem must be used within ActionsBar");
  }
  return context;
};

/**
 * ActionsBar - 操作栏组件
 *
 * 响应式变体：
 * 1. Compact: DropdownMenu（汉堡菜单）
 * 2. Full: NavigationMenu（横向展开）
 *
 * 特性：
 * - 基于实际内容尺寸自动切换变体
 * - 不依赖固定断点
 * - 支持邻近渲染策略优化性能
 * - 自动在 NavigationMenu 和 DropdownMenu 之间切换
 *
 * @example
 * ```tsx
 * <ActionsBar>
 *   <ActionItem label="File">
 *     <ActionSubItem onSelect={() => console.log('New')}>New</ActionSubItem>
 *     <ActionSubItem onSelect={() => console.log('Open')}>Open</ActionSubItem>
 *   </ActionItem>
 *   <ActionItem label="Edit" onSelect={() => console.log('Edit')} />
 * </ActionsBar>
 * ```
 */
export const ActionsBar = React.forwardRef<HTMLDivElement, ActionsBarProps>(
  ({ className, children, strategy, enableTransition = false, triggerLabel = <Menu />, ...props }, ref) => {
    const [mode, setMode] = React.useState<"navigation" | "dropdown">("navigation");

    // 定义变体配置
    const variants = React.useMemo(
      () => ({
        compact: {
          render: () => (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm">
                  {triggerLabel}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <ActionsBarContext.Provider value={{ mode: "dropdown" }}>{children}</ActionsBarContext.Provider>
              </DropdownMenuContent>
            </DropdownMenu>
          ),
        },
        full: {
          render: () => (
            <NavigationMenu>
              <NavigationMenuList>
                <ActionsBarContext.Provider value={{ mode: "navigation" }}>{children}</ActionsBarContext.Provider>
              </NavigationMenuList>
            </NavigationMenu>
          ),
        },
      }),
      [children, triggerLabel],
    );

    const containerRef = React.useRef<HTMLDivElement>(null);
    const [containerEle, setContainerEle] = React.useState(containerRef.current);
    React.useEffect(() => {
      setContainerEle(containerRef.current);
    }, [containerRef.current]);

    const { activeVariant, renderVariants } = useResponsiveVariant({
      variants,
      strategy,
      containerEle: containerEle,
      enableTransition,
    });

    // 更新 mode
    React.useEffect(() => {
      setMode(activeVariant === "full" ? "navigation" : "dropdown");
    }, [activeVariant]);

    return (
      <div
        ref={useMergeRefs({ ref, containerRef })}
        className={cn("flex size-full content-center items-center justify-end justify-items-end", className)}
        {...props}>
        {renderVariants()}
      </div>
    );
  },
);

ActionsBar.displayName = "ActionsBar";

/**
 * ActionItem - 操作项组件
 *
 * 根据 ActionsBar 的 mode 自动渲染为 NavigationMenuItem 或 DropdownMenuItem
 */
export const ActionItem = React.forwardRef<HTMLDivElement, ActionItemProps>(
  ({ label, children, onSelect, className }, ref) => {
    const { mode } = useActionsBar();

    if (mode === "navigation") {
      if (children) {
        return (
          <NavigationMenuItem>
            <NavigationMenuTrigger className={className}>{label}</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">{children}</div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        );
      }

      return (
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <button
              onClick={onSelect}
              className={cn(
                "bg-background hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                className,
              )}>
              {label}
            </button>
          </NavigationMenuLink>
        </NavigationMenuItem>
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

ActionItem.displayName = "ActionItem";

/**
 * ActionSubItem - 操作子项组件
 *
 * 根据 ActionsBar 的 mode 自动渲染为 NavigationMenuLink 或 DropdownMenuItem
 */
export const ActionSubItem = React.forwardRef<HTMLDivElement, ActionSubItemProps>(
  ({ children, onSelect, className }, ref) => {
    const { mode } = useActionsBar();

    if (mode === "navigation") {
      return (
        <NavigationMenuLink asChild>
          <button
            onClick={onSelect}
            className={cn(
              "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none",
              className,
            )}>
            <div className="text-sm leading-none font-medium">{children}</div>
          </button>
        </NavigationMenuLink>
      );
    }

    return (
      <DropdownMenuItem ref={ref} onClick={onSelect} className={className}>
        {children}
      </DropdownMenuItem>
    );
  },
);

ActionSubItem.displayName = "ActionSubItem";

// 重新导出 DropdownMenuSeparator，方便使用
export { DropdownMenuSeparator as ActionSeparator };
