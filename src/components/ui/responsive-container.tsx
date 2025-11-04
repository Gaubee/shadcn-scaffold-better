"use client";

import { cn } from "@/lib/utils";
import { Maximize2, Minimize2, Monitor, Smartphone, Tablet, ZoomIn, ZoomOut } from "lucide-react";
import * as React from "react";

// 设备预设配置类型
export interface DevicePresetConfig {
  width: number;
  height: number;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
}

// 默认设备预设
const DEFAULT_DEVICE_PRESETS = {
  mobile: { width: 375, height: 667, label: "Mobile", icon: Smartphone },
  tablet: { width: 768, height: 1024, label: "Tablet", icon: Tablet },
  desktop: { width: 1280, height: 800, label: "Desktop", icon: Monitor },
} as const satisfies Record<string, DevicePresetConfig>;

// 缩放预设
const SCALE_PRESETS = [0.25, 0.5, 0.75, 1] as const;

interface ResponsiveContainerProps<T extends Record<string, DevicePresetConfig> = typeof DEFAULT_DEVICE_PRESETS> {
  children: React.ReactNode;
  title?: string;
  /** 自定义设备预设配置 */
  devicePresets?: T;
  initialDevice?: keyof T;
  initialScale?: number;
  showControls?: boolean;
  className?: string;
}

const ResponsiveContainerInner = React.forwardRef(
  <T extends Record<string, DevicePresetConfig> = typeof DEFAULT_DEVICE_PRESETS>(
    {
      children,
      title,
      devicePresets,
      initialDevice,
      initialScale = 0.75,
      showControls = true,
      className,
    }: ResponsiveContainerProps<T>,
    ref: React.ForwardedRef<HTMLDivElement>,
  ) => {
    // 使用自定义预设或默认预设
    const presets = (devicePresets ?? DEFAULT_DEVICE_PRESETS) as T;
    const firstDeviceKey = Object.keys(presets)[0] as keyof T;
    const defaultDevice = initialDevice ?? firstDeviceKey;

    const [device, setDevice] = React.useState<keyof T>(defaultDevice);
    const [scale, setScale] = React.useState(initialScale);
    const [isFullscreen, setIsFullscreen] = React.useState(false);
    const [customSize, setCustomSize] = React.useState<{ width: number; height: number } | null>(null);
    const [editingWidth, setEditingWidth] = React.useState(false);
    const [editingHeight, setEditingHeight] = React.useState(false);
    const [inputWidth, setInputWidth] = React.useState("");
    const [inputHeight, setInputHeight] = React.useState("");
    const resizeContainerRef = React.useRef<HTMLDivElement>(null);

    // 获取当前尺寸
    const currentSize = React.useMemo(() => {
      if (customSize) return customSize;
      return presets[device];
    }, [device, customSize, presets]);

    // 监听容器尺寸变化（通过 CSS resize）
    React.useEffect(() => {
      const contentElement = resizeContainerRef.current;
      if (!contentElement) return;

      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          // 考虑缩放因子，计算实际尺寸
          const actualWidth = Math.round(width / scale);
          const actualHeight = Math.round(height / scale);

          // 只在尺寸真正变化时更新
          if (!customSize || customSize.width !== actualWidth || customSize.height !== actualHeight) {
            setCustomSize({ width: actualWidth, height: actualHeight });
          }
        }
      });

      resizeObserver.observe(contentElement);

      return () => {
        resizeObserver.disconnect();
      };
    }, [scale, customSize]);

    // 切换设备预设
    const handleDeviceChange = (newDevice: keyof T) => {
      setDevice(newDevice);
      setCustomSize(null); // 清除自定义尺寸
    };

    // 缩放控制
    const handleZoomIn = () => {
      const currentIndex = SCALE_PRESETS.findIndex((s) => s === scale);
      const nextIndex = Math.min(currentIndex + 1, SCALE_PRESETS.length - 1);
      setScale(SCALE_PRESETS[nextIndex]);
    };

    const handleZoomOut = () => {
      const currentIndex = SCALE_PRESETS.findIndex((s) => s === scale);
      const nextIndex = Math.max(currentIndex - 1, 0);
      setScale(SCALE_PRESETS[nextIndex]);
    };

    // 处理宽度编辑
    const handleWidthEdit = () => {
      setEditingWidth(true);
      setInputWidth(String(currentSize.width));
    };

    const handleWidthChange = (value: string) => {
      setInputWidth(value);
    };

    const handleWidthBlur = () => {
      const width = parseInt(inputWidth, 10);
      if (!isNaN(width) && width >= 280) {
        setCustomSize({ width, height: currentSize.height });
      }
      setEditingWidth(false);
    };

    // 处理高度编辑
    const handleHeightEdit = () => {
      setEditingHeight(true);
      setInputHeight(String(currentSize.height));
    };

    const handleHeightChange = (value: string) => {
      setInputHeight(value);
    };

    const handleHeightBlur = () => {
      const height = parseInt(inputHeight, 10);
      if (!isNaN(height) && height >= 400) {
        setCustomSize({ width: currentSize.width, height });
      }
      setEditingHeight(false);
    };

    // 监听 ESC 键退出全屏
    React.useEffect(() => {
      if (!isFullscreen) return;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setIsFullscreen(false);
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }, [isFullscreen]);

    return (
      <>
        {/* 全屏背景遮罩 */}
        {isFullscreen && (
          <div
            className="bg-background/95 fixed inset-0 z-40 overscroll-contain backdrop-blur-sm"
            onClick={() => setIsFullscreen(false)}
          />
        )}

        <div
          ref={ref}
          className={cn(
            "flex flex-col gap-4",
            isFullscreen ? "fixed inset-4 z-50" : "bg-card rounded-lg border p-4",
            className,
          )}>
          {/* 控制栏 */}
          {showControls && (
            <div
              className={cn(
                "flex flex-wrap items-center justify-between gap-2",
                isFullscreen && "bg-card/95 rounded-lg border p-4 shadow-lg backdrop-blur",
              )}>
              {/* 标题和尺寸显示 */}
              <div className="flex items-center gap-3">
                {title && <h3 className="font-semibold">{title}</h3>}
                <div className="text-muted-foreground flex items-center gap-2 text-xs">
                  {/* 可编辑的宽度 */}
                  {editingWidth ? (
                    <input
                      type="number"
                      value={inputWidth}
                      onChange={(e) => handleWidthChange(e.target.value)}
                      onBlur={handleWidthBlur}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleWidthBlur();
                        if (e.key === "Escape") {
                          setEditingWidth(false);
                        }
                      }}
                      className="bg-background focus:ring-ring w-16 rounded border px-1 text-center focus:ring-1 focus:outline-none"
                      autoFocus
                    />
                  ) : (
                    <button
                      onClick={handleWidthEdit}
                      className="hover:text-foreground rounded px-1 transition-colors"
                      title="点击编辑宽度">
                      {currentSize.width}
                    </button>
                  )}
                  <span>×</span>
                  {/* 可编辑的高度 */}
                  {editingHeight ? (
                    <input
                      type="number"
                      value={inputHeight}
                      onChange={(e) => handleHeightChange(e.target.value)}
                      onBlur={handleHeightBlur}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleHeightBlur();
                        if (e.key === "Escape") {
                          setEditingHeight(false);
                        }
                      }}
                      className="bg-background focus:ring-ring w-16 rounded border px-1 text-center focus:ring-1 focus:outline-none"
                      autoFocus
                    />
                  ) : (
                    <button
                      onClick={handleHeightEdit}
                      className="hover:text-foreground rounded px-1 transition-colors"
                      title="点击编辑高度">
                      {currentSize.height}
                    </button>
                  )}
                  <span className="text-muted-foreground/60">@{Math.round(scale * 100)}%</span>
                </div>
              </div>

              {/* 控制按钮组 */}
              <div className="flex items-center gap-1">
                {/* 设备预设 */}
                {Object.entries(presets).map(([key, preset]) => {
                  const Icon = preset.icon;
                  const isActive = device === key && !customSize;
                  return (
                    <button
                      key={key}
                      onClick={() => handleDeviceChange(key as keyof T)}
                      className={cn(
                        "rounded p-1.5 transition-colors",
                        isActive ? "bg-accent text-accent-foreground" : "hover:bg-accent/50",
                      )}
                      title={`${preset.label} (${preset.width}×${preset.height})`}>
                      <Icon size={16} />
                    </button>
                  );
                })}

                {/* 分隔符 */}
                <div className="bg-border mx-1 h-6 w-px" />

                {/* 缩放控制 */}
                <button
                  onClick={handleZoomOut}
                  disabled={scale <= SCALE_PRESETS[0]}
                  className="hover:bg-accent rounded p-1.5 transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                  title="Zoom Out">
                  <ZoomOut size={16} />
                </button>
                <button
                  onClick={handleZoomIn}
                  disabled={scale >= SCALE_PRESETS[SCALE_PRESETS.length - 1]}
                  className="hover:bg-accent rounded p-1.5 transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                  title="Zoom In">
                  <ZoomIn size={16} />
                </button>

                {/* 分隔符 */}
                <div className="bg-border mx-1 h-6 w-px" />

                {/* 全屏 */}
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="hover:bg-accent rounded p-1.5 transition-colors"
                  title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
                  {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
              </div>
            </div>
          )}
          {/* 外层滚动容器 */}
          <div
            data-role="window-with-srollable"
            className={cn(
              "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[color-mix(in_srgb,currentColor,transparent)]",
              "bg-background relative mx-auto rounded shadow-lg outline",
              "max-h-full max-w-full overflow-auto",
              isFullscreen && "flex-1 overscroll-contain",
            )}
            style={{
              scrollbarWidth: "thin",
              ...(isFullscreen
                ? {}
                : {
                    // 外层容器的尺寸 = 内容尺寸 × 缩放比例
                    width: `${currentSize.width * scale}px`,
                    height: `${currentSize.height * scale}px`,
                  }),
            }}>
            {/* 内层内容容器 - 应用缩放 */}
            <div
              ref={resizeContainerRef}
              data-role="scaled-canvas-with-scalable"
              style={{
                width: `${currentSize.width * scale}px`,
                height: `${currentSize.height * scale}px`,
                overflow: "hidden",
                // 全屏时禁用 resize
                resize: isFullscreen ? "none" : "both",
              }}>
              <div
                data-role="canvas"
                style={{
                  width: `${currentSize.width}px`,
                  height: `${currentSize.height}px`,
                  transform: `scale(${scale})`,
                  transformOrigin: "top left",
                  overflow: "hidden",
                }}>
                {children}
              </div>
            </div>
          </div>
          {/* 提示文本 */}
          {showControls && !isFullscreen && (
            <p className="text-muted-foreground text-center text-xs">
              拖拽右下角调整大小 · 点击尺寸数字直接编辑 · 使用缩放按钮适配屏幕
            </p>
          )}

          {/* 全屏退出提示 */}
          {showControls && isFullscreen && (
            <div className="bg-card/95 mt-2 rounded-lg border p-3 text-center shadow-lg backdrop-blur">
              <p className="text-muted-foreground text-xs">
                按 <kbd className="bg-muted rounded px-2 py-0.5 font-mono text-xs">ESC</kbd> 或点击背景退出全屏
              </p>
            </div>
          )}
        </div>
      </>
    );
  },
);

// 类型断言以支持泛型组件
export const ResponsiveContainer = ResponsiveContainerInner as <
  T extends Record<string, DevicePresetConfig> = typeof DEFAULT_DEVICE_PRESETS,
>(
  props: ResponsiveContainerProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> },
) => React.ReactElement;

(ResponsiveContainer as any).displayName = "ResponsiveContainer";
