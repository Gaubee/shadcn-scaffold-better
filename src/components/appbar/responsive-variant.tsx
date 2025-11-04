"use client";

import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * 变体配置
 */
export interface VariantConfig {
  /** 渲染函数 */
  render: () => React.ReactNode;
  /** 可选：最小宽度提示（用于优化） */
  minWidth?: number;
}

/**
 * 渲染策略 Provider
 */
export interface RenderStrategyProvider<T extends string> {
  /** 策略名称 */
  name: string;
  /** 默认变体 ID */
  defaultVariantId: T;
  /** 所有变体 ID */
  allVariantIds: readonly T[];
  /** 获取应该渲染的变体 ID 列表 */
  getVariantsToRender: (activeId: T) => T[];
}

/**
 * 邻近渲染策略：只渲染当前变体和相邻变体
 * @param order 变体顺序（从小到大）
 */
export function adjacentProvider<const T extends string>(order: readonly T[]): RenderStrategyProvider<T> {
  return {
    name: "adjacent",
    defaultVariantId: order.at(order.length / 2)!,
    allVariantIds: order,
    getVariantsToRender: (activeId) => {
      const activeIndex = order.indexOf(activeId);
      return order.slice(Math.max(0, activeIndex - 1), Math.min(activeIndex + 2, order.length));
    },
  };
}

/**
 * 全量渲染策略：渲染所有变体
 * @param order 变体顺序（从小到大）
 */
export function fullProvider<T extends string>(order: readonly T[]): RenderStrategyProvider<T> {
  return {
    name: "full",
    defaultVariantId: order[0],
    allVariantIds: order,
    getVariantsToRender: () => [...order],
  };
}

/**
 * 响应式变体选择器选项
 */
export interface UseResponsiveVariantOptions<T extends string> {
  /** 变体配置对象 */
  variants: Record<T, VariantConfig>;
  /** 渲染策略 Provider，默认使用 adjacentProvider */
  strategy?: RenderStrategyProvider<T>;
  /** 容器引用 */
  containerEle?: HTMLElement | null;
  /** 是否启用过渡动画，默认 false */
  enableTransition?: boolean;
}

/**
 * 响应式变体选择器返回值
 */
export interface UseResponsiveVariantResult<T extends string> {
  /** 当前活跃的变体 ID */
  activeVariant: T;
  /** 渲染变体的函数 */
  renderVariants: () => React.ReactNode;
}

/**
 * 响应式变体选择器 Hook
 *
 * 核心机制：
 * 1. 使用 Grid 布局让所有变体占据同一个网格区域（grid-area: 1/1）
 * 2. 渲染策略决定哪些变体需要渲染（邻近或全量）
 * 3. 监听隐藏元素的实际尺寸
 * 4. 当容器空间足够时，自动切换到更大的变体
 * 5. 不依赖固定断点，完全基于实际内容尺寸
 *
 * @example
 * ```tsx
 * const { activeVariant, renderVariants } = useResponsiveVariant({
 *   variants: {
 *     compact: { render: () => <CompactView /> },
 *     normal: { render: () => <NormalView /> },
 *     expanded: { render: () => <ExpandedView /> }
 *   },
 *   order: ['compact', 'normal', 'expanded'] as const,
 *   strategy: adjacentProvider(['compact', 'normal', 'expanded']),
 *   containerRef: containerRef
 * });
 *
 * return (
 *   <div ref={containerRef}>
 *     {renderVariants()}
 *   </div>
 * );
 * ```
 */
export function useResponsiveVariant<T extends string>({
  variants,
  strategy,
  containerEle,
  enableTransition = false,
}: UseResponsiveVariantOptions<T>): UseResponsiveVariantResult<T> {
  // 默认使用邻近渲染策略
  const actualStrategy = React.useMemo(
    () => strategy ?? adjacentProvider(Object.keys(variants) as T[]),
    [strategy, variants],
  );

  // 当前活跃变体的 ID
  const [activeId, setActiveId] = React.useState<T>(actualStrategy.defaultVariantId);
  const activeIdRef = React.useRef<T>(activeId);
  activeIdRef.current = activeId;

  // 存储每个变体的隐藏元素引用
  const variantElesRef = React.useRef<Map<T, HTMLDivElement>>(new Map());
  const setVariantRef = React.useCallback((variantId: T, element: HTMLDivElement | null) => {
    if (element) {
      variantElesRef.current.set(variantId, element);
    } else {
      variantElesRef.current.delete(variantId);
    }
  }, []);

  const containerRef = React.useRef<HTMLDivElement>(null);

  // 监听容器尺寸变化
  React.useLayoutEffect(() => {
    const container = containerEle ?? containerRef.current;
    if (!container) return;
    const activeId = activeIdRef.current;
    const variantEles = variantElesRef.current;

    const sizeMap = {
      container: {
        width: 0,
        height: 0,
      },
      variants: {} as Record<T, { width: number; height: number }>,
    };

    // 选择最适合的变体
    const selectBestVariant = () => {
      const updateVariant = (variantId: T) => {
        requestAnimationFrame(() => {
          setActiveId((prev) => {
            // 只有当变体真的改变时才更新
            if (prev !== variantId) {
              return variantId;
            }
            return prev;
          });
        });
      };

      const containerWidth = sizeMap.container.width;
      const containerHeight = sizeMap.container.height;
      // 从大到小尝试每个变体
      const idsToRender = actualStrategy.getVariantsToRender(activeId);
      // 如果都不合适，选择最小的变体
      let toVariantId = idsToRender[0];
      for (let i = idsToRender.length - 1; i >= 0; i--) {
        const variantId = idsToRender[i];
        const size = sizeMap.variants[variantId];

        if (size) {
          const variantWidth = size.width;
          const variantHeight = size.height;

          // 如果这个变体能完整显示，就选择它
          if (variantWidth <= containerWidth && variantHeight <= containerHeight) {
            toVariantId = variantId;
            break;
          }
        }
      }
      updateVariant(toVariantId);
    };
    Object.assign(self, { sizeMap });

    // 使用 ResizeObserver 监听容器尺寸变化
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === container) {
          const containerSize = entry.contentBoxSize[0]!;
          sizeMap.container.width = containerSize.inlineSize;
          sizeMap.container.height = containerSize.blockSize;
        } else {
          const variant = (entry.target as HTMLElement).dataset.variant as T;
          const variantSize = entry.borderBoxSize[0];
          sizeMap.variants[variant] = {
            width: variantSize.inlineSize,
            height: variantSize.blockSize,
          };
        }
      }
      selectBestVariant();
    });

    // 监听，会立刻触发回调选择变体
    resizeObserver.observe(container, { box: "content-box" });
    for (const variantId of actualStrategy.allVariantIds) {
      const ele = variantEles.get(variantId);
      if (ele) {
        resizeObserver.observe(ele, { box: "border-box" });
      }
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [containerEle, actualStrategy]);

  // 渲染变体
  const renderVariants = React.useCallback(() => {
    // 确定要渲染的变体 ID 列表
    const idsToRender = actualStrategy.getVariantsToRender(activeId);

    return (
      <div
        ref={containerRef}
        className={cn(
          "grid [align-items:inherit] [justify-content:inherit]", // Grid 容器占满父容器宽度
          `[grid-template-areas:"variants"]`,
          enableTransition && "transition-all duration-300 ease-out",
        )}
        data-transition={enableTransition}
        data-strategy={actualStrategy.name}>
        {actualStrategy.allVariantIds.map((variantId) => {
          const isActive = variantId === activeId;
          const shouldRender = idsToRender.includes(variantId);

          const variant = variants[variantId];

          return (
            <div
              key={variantId}
              ref={(el) => {
                setVariantRef(variantId, el);

                return () => setVariantRef(variantId, null);
              }}
              className={cn(
                // 使用 grid-area 让所有变体占据同一个网格区域，justify-self:start 横向不撑满，align-self: start 纵向不撑满
                "transition-discrete duration-300 ease-out [grid-area:variants] starting:open:opacity-0",
                // 对于不渲染的原始，使用absolute，来避免挤占空间从而影响布局
                isActive ? "pointer-events-auto opacity-100" : "pointer-events-none absolute opacity-0",
              )}
              data-variant={variantId}
              data-active={isActive}>
              {variant.render()}
            </div>
          );
        })}
      </div>
    );
  }, [variants, activeId, actualStrategy, enableTransition]);

  return {
    activeVariant: activeId,
    renderVariants,
  };
}
