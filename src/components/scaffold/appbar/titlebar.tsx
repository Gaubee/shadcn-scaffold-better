"use client";

import { cn } from "@/lib/utils";
import * as React from "react";
import { useMergeRefs } from "react-best-merge-refs";
import { adjacentProvider, useResponsiveVariant, type RenderStrategyProvider } from "../responsive-variant";

/**
 * TitleBar 组件属性
 */
export interface TitleBarProps extends Omit<React.ComponentProps<"div">, "children" | "title"> {
  /** 主标题 */
  title: React.ReactNode;
  /** 副标题（可选） */
  subtitle?: React.ReactNode;
  /** 渲染策略 Provider，默认使用 adjacentProvider */
  strategy?: RenderStrategyProvider<"compact" | "normal" | "expanded">;
  /** 是否启用过渡动画，默认 false */
  enableTransition?: boolean;
}

/**
 * TitleBar - 标题栏组件
 *
 * 响应式变体：
 * 1. Compact: 单行标题，截断显示
 * 2. Normal: 单行标题，完整显示
 * 3. Expanded: 多行标题 + 副标题（如果提供）
 *
 * 特性：
 * - 基于实际内容尺寸自动切换变体
 * - 不依赖固定断点
 * - 支持邻近渲染策略优化性能
 * - 自动处理文本截断和换行
 *
 * @example
 * ```tsx
 * <TitleBar
 *   title="Page Title"
 *   subtitle="Optional subtitle"
 * />
 * ```
 */
export const TitleBar = React.forwardRef<HTMLDivElement, TitleBarProps>(
  ({ className, title, subtitle, strategy, enableTransition = false, ...props }, ref) => {
    // 定义变体顺序（从小到大）
    // 如果有副标题，包含 expanded 变体
    const variantOrder = React.useMemo(
      () => (subtitle ? (["compact", "normal", "expanded"] as const) : (["compact", "normal"] as const)),
      [subtitle],
    );

    // 定义变体配置
    const variants = React.useMemo(
      () => ({
        compact: {
          render: () => (
            <div className="flex items-center justify-center">
              <h1 className="truncate text-xs font-medium break-keep whitespace-nowrap">{title}</h1>
            </div>
          ),
        },
        normal: {
          render: () => (
            <div className="flex items-center justify-center">
              <h1 className="text-base font-medium break-keep whitespace-nowrap">{title}</h1>
            </div>
          ),
        },
        expanded: {
          render: () => (
            <div className="flex flex-col items-center justify-center gap-0.5">
              <h1 className="text-base font-medium break-keep whitespace-nowrap">{title}</h1>
              <p className="text-muted-foreground text-sm">{subtitle}</p>
            </div>
          ),
        },
      }),
      [title, subtitle],
    );

    const containerRef = React.useRef<HTMLDivElement>(null);
    const [containerEle, setContainerEle] = React.useState(containerRef.current);
    React.useEffect(() => {
      setContainerEle(containerRef.current);
    }, [containerRef.current]);

    const { renderVariants } = useResponsiveVariant({
      variants,
      strategy: React.useMemo(() => strategy ?? adjacentProvider(["compact", "normal", "expanded"]), [strategy]),
      containerEle: containerEle,
      enableTransition,
    });

    return (
      <div
        ref={useMergeRefs({ ref, containerRef })}
        className={cn("flex size-full content-center items-center justify-center justify-items-center", className)}
        {...props}>
        {renderVariants()}
      </div>
    );
  },
);

TitleBar.displayName = "TitleBar";
