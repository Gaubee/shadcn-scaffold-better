"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface BottomNavigationItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  badge?: string | number;
  disabled?: boolean;
}

export interface BottomNavigationBarProps {
  children?: React.ReactNode;
  className?: string;
  /**
   * Navigation items
   */
  items?: BottomNavigationItem[];
  /**
   * Currently selected item key
   */
  value?: string;
  /**
   * Callback when selection changes
   */
  onValueChange?: (value: string) => void;
  /**
   * Show labels
   */
  showLabels?: boolean | "selected";
  /**
   * Elevation level
   */
  elevation?: 0 | 1 | 2 | 3 | 4 | 5;
  /**
   * Hide on scroll down
   */
  hideOnScroll?: boolean;
}

const elevationClasses = {
  0: "",
  1: "shadow-sm",
  2: "shadow",
  3: "shadow-md",
  4: "shadow-lg",
  5: "shadow-xl",
};

export const BottomNavigationBar = React.forwardRef<HTMLElement, BottomNavigationBarProps>(
  (
    { children, className, items = [], value, onValueChange, showLabels = true, elevation = 3, hideOnScroll = false },
    ref,
  ) => {
    const [supportsScrollTimeline, setSupportsScrollTimeline] = React.useState(false);
    const [isVisible, setIsVisible] = React.useState(true);
    const lastScrollY = React.useRef(0);

    // Check for CSS scroll-driven animations support using feature detection
    React.useEffect(() => {
      if (typeof window === "undefined") return;

      let isMounted = true;

      // Dynamically import feature detection to avoid SSR issues
      import("@/lib/feature-detection")
        .then(({ supports }) => {
          if (!isMounted) return; // Component unmounted, skip state update
          const scrollTimelineSupport = supports("scroll-timeline");
          setSupportsScrollTimeline(scrollTimelineSupport.supported);
        })
        .catch(() => {
          // Silently fail if module can't be loaded
          if (!isMounted) return;
          setSupportsScrollTimeline(false);
        });

      return () => {
        isMounted = false;
      };
    }, []);

    // JavaScript fallback for browsers without scroll-driven animations support
    React.useEffect(() => {
      if (supportsScrollTimeline || !hideOnScroll) return;

      let rafId: number | null = null;
      let ticking = false;

      const handleScroll = () => {
        if (ticking) return;
        ticking = true;

        rafId = requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          // Hide when scrolling down past threshold, show when scrolling up
          if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
            setIsVisible(false);
          } else if (currentScrollY < lastScrollY.current) {
            setIsVisible(true);
          }

          lastScrollY.current = currentScrollY;
          ticking = false;
        });
      };

      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => {
        window.removeEventListener("scroll", handleScroll);
        if (rafId !== null) cancelAnimationFrame(rafId);
      };
    }, [hideOnScroll, supportsScrollTimeline]);

    const handleItemClick = (item: BottomNavigationItem) => {
      if (!item.disabled) {
        onValueChange?.(item.key);
      }
    };

    return (
      <nav
        ref={ref}
        className={cn(
          "fixed bottom-0 left-0 right-0 z-40 bg-background border-t",
          supportsScrollTimeline && hideOnScroll && "bottom-nav-hide-on-scroll",
          !supportsScrollTimeline && "transition-transform duration-300",
          !supportsScrollTimeline && !isVisible && "translate-y-full",
          elevationClasses[elevation],
          className,
        )}>
        <div className="flex items-center justify-around h-16 px-2">
          {items.map((item) => {
            const isSelected = value === item.key;
            const shouldShowLabel = showLabels === true || (showLabels === "selected" && isSelected);

            return (
              <button
                key={item.key}
                type="button"
                disabled={item.disabled}
                onClick={() => handleItemClick(item)}
                className={cn(
                  "flex flex-col items-center justify-center",
                  "min-w-[64px] max-w-[168px] flex-1 h-full",
                  "transition-all duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  item.disabled && "opacity-40 cursor-not-allowed",
                  !item.disabled && "hover:bg-accent/50 active:bg-accent",
                )}>
                <div className="relative">
                  <div
                    className={cn(
                      "transition-all duration-200",
                      isSelected ? "text-primary scale-110" : "text-muted-foreground",
                    )}>
                    {item.icon}
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={cn(
                        "absolute -top-1 -right-1",
                        "min-w-[18px] h-[18px] px-1",
                        "flex items-center justify-center",
                        "text-[10px] font-medium",
                        "bg-destructive text-destructive-foreground",
                        "rounded-full",
                      )}>
                      {item.badge}
                    </span>
                  )}
                </div>

                {shouldShowLabel && (
                  <span
                    className={cn(
                      "text-xs mt-1 transition-all duration-200",
                      isSelected ? "text-primary font-medium" : "text-muted-foreground",
                    )}>
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}

          {children}
        </div>
      </nav>
    );
  },
);

BottomNavigationBar.displayName = "BottomNavigationBar";
