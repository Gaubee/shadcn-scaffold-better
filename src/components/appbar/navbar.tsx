"use client";

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import * as React from "react";
import { useMergeRefs } from "react-best-merge-refs";
import { adjacentProvider, useResponsiveVariant, type RenderStrategyProvider } from "./responsive-variant";

/**
 * 历史导航项
 */
export interface NavHistoryItem {
  title: string;
  href?: string;
  onClick?: () => void;
}

const DefaultBreadcrumb: React.FC = () => {
  // @TODO 这里我们需要在scaffold中，通过ReactContext技术，来隐式传递Scaffold相关的一些上下文信息，包括导航信息、导航功能
  return <>TODO</>;
};

/**
 * NavBar 组件属性
 */
export interface NavBarProps extends Omit<React.ComponentProps<"nav">, "children"> {
  /** 返回按钮点击事件 */
  onBack?: () => void;
  /** 历史导航记录（用于长按显示） */
  historyItems?: NavHistoryItem[];
  /** 是否禁用返回按钮 */
  disabled?: boolean;
  /** Breadcrumb 内容 */
  breadcrumb?: React.ReactNode;
  /** 渲染策略 Provider，默认使用 adjacentProvider */
  strategy?: RenderStrategyProvider<"compact" | "expanded" | "full">;
  /** 是否启用过渡动画，默认 false */
  enableTransition?: boolean;
}

/**
 * NavBar - 导航栏组件
 *
 * 响应式变体：
 * 1. Compact: 只显示返回按钮（带长按历史记录）
 * 2. Full: 返回按钮 + Breadcrumb
 *
 * 特性：
 * - 基于实际内容尺寸自动切换变体
 * - 不依赖固定断点
 * - 支持邻近渲染策略优化性能
 * - 返回按钮支持长按显示历史记录
 *
 * @example
 * ```tsx
 * <NavBar
 *   onBack={() => router.back()}
 *   historyItems={[
 *     { title: 'Home', onClick: () => router.push('/') },
 *     { title: 'Products', onClick: () => router.push('/products') }
 *   ]}
 *   breadcrumb={
 *     <BreadcrumbList>
 *       <BreadcrumbItem>
 *         <BreadcrumbLink href="/">Home</BreadcrumbLink>
 *       </BreadcrumbItem>
 *       <BreadcrumbSeparator />
 *       <BreadcrumbItem>
 *         <BreadcrumbPage>Current</BreadcrumbPage>
 *       </BreadcrumbItem>
 *     </BreadcrumbList>
 *   }
 * />
 * ```
 */
export const NavBar = React.forwardRef<HTMLElement, NavBarProps>(
  (
    {
      className,
      onBack,
      historyItems = [],
      disabled = false,
      breadcrumb,
      strategy,
      enableTransition = false,
      ...props
    },
    ref,
  ) => {
    const [isHistoryOpen, setIsHistoryOpen] = React.useState(false);
    const longPressTimerRef = React.useRef<number | null>(null);
    const [isLongPressing, setIsLongPressing] = React.useState(false);

    // 长按处理
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

    // 返回按钮组件
    const BackButton = React.useMemo(() => {
      if (historyItems.length === 0) {
        return (
          <Button variant="ghost" size="icon-sm" onClick={onBack} disabled={disabled}>
            <ChevronLeft />
          </Button>
        );
      }

      return (
        <DropdownMenu open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              disabled={disabled}
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerLeave}>
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
    }, [historyItems, isHistoryOpen, disabled, onBack, handlePointerDown, handlePointerUp, handlePointerLeave]);

    // 定义变体配置
    const variants = React.useMemo(
      () => ({
        compact: {
          render: () => <div className="flex items-center">{BackButton}</div>,
        },
        expanded: {
          render: () => (
            <div className="flex items-center">
              {breadcrumb ? <Breadcrumb>{breadcrumb}</Breadcrumb> : <DefaultBreadcrumb />}
            </div>
          ),
        },
        full: {
          render: () => (
            <div className="flex items-center gap-2">
              {BackButton}
              {breadcrumb ? <Breadcrumb>{breadcrumb}</Breadcrumb> : <DefaultBreadcrumb />}
            </div>
          ),
        },
      }),
      [BackButton, breadcrumb],
    );

    const containerRef = React.useRef<HTMLElement>(null);
    const [containerEle, setContainerEle] = React.useState(containerRef.current);
    React.useEffect(() => {
      setContainerEle(containerRef.current);
    }, [containerRef.current]);

    const { renderVariants } = useResponsiveVariant({
      variants,
      strategy: React.useMemo(() => strategy ?? adjacentProvider(["compact", "expanded", "full"]), [strategy]),
      containerEle: containerEle,
      enableTransition,
    });

    return (
      <nav
        ref={useMergeRefs({
          ref,
          containerRef,
        })}
        className={cn("flex size-full items-center justify-start", className)}
        {...props}>
        {renderVariants()}
      </nav>
    );
  },
);

NavBar.displayName = "NavBar";

// 重新导出 Breadcrumb 相关组件，方便使用
export {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
};
