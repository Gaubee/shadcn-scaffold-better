"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { AppBarProps } from "./app-bar";
import type { DrawerProps } from "./drawer";
import type { BottomNavigationBarProps, BottomNavigationItem } from "./bottom-navigation-bar";
import type { NavigationRailProps, NavigationRailItem } from "./navigation-rail";
import type { FloatingActionButtonProps } from "./floating-action-button";
import { BottomNavigationBar } from "./bottom-navigation-bar";
import { NavigationRail } from "./navigation-rail";
import { supports, loadPolyfill } from "@/lib/feature-detection";

/**
 * Unified navigation item type (compatible with both BottomNavigationBar and NavigationRail)
 */
export interface NavigationItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  badge?: string | number;
  disabled?: boolean;
}

export interface ScaffoldProps {
  children: React.ReactNode;
  className?: string;
  /**
   * AppBar component configuration
   */
  appBar?: React.ReactElement<AppBarProps>;
  /**
   * Drawer component configuration
   */
  drawer?: React.ReactElement<DrawerProps>;
  /**
   * End drawer (right side) component configuration
   */
  endDrawer?: React.ReactElement<DrawerProps>;
  /**
   * Bottom navigation bar component
   */
  bottomNavigationBar?: React.ReactElement<BottomNavigationBarProps>;
  /**
   * Navigation rail component (alternative to drawer for desktop)
   */
  navigationRail?: React.ReactElement<NavigationRailProps>;
  /**
   * Adaptive navigation items (auto-switch between BottomNavigationBar and NavigationRail based on screen size)
   * When provided, bottomNavigationBar and navigationRail props are ignored
   */
  navigationItems?: NavigationItem[];
  /**
   * Current selected navigation item key (used with navigationItems)
   */
  navigationValue?: string;
  /**
   * Callback when navigation selection changes (used with navigationItems)
   */
  onNavigationChange?: (value: string) => void;
  /**
   * Whether to show labels in navigation (used with navigationItems)
   * - true: Always show labels
   * - false: Never show labels
   * - 'selected': Only show label for selected item
   */
  navigationShowLabels?: boolean | "selected";
  /**
   * Floating action button
   */
  floatingActionButton?: React.ReactElement<FloatingActionButtonProps>;
  /**
   * Background color class
   */
  backgroundColor?: string;
  /**
   * Whether to use responsive layout (auto-switch between drawer and navigation rail)
   */
  responsive?: boolean;
  /**
   * Breakpoint for responsive layout (in pixels)
   */
  responsiveBreakpoint?: number;
}

export const Scaffold = React.forwardRef<HTMLDivElement, ScaffoldProps>(
  (
    {
      children,
      className,
      appBar,
      drawer,
      endDrawer,
      bottomNavigationBar,
      navigationRail,
      navigationItems,
      navigationValue,
      onNavigationChange,
      navigationShowLabels = true,
      floatingActionButton,
      backgroundColor = "bg-background",
      responsive = true,
      responsiveBreakpoint = 1024,
    },
    ref,
  ) => {
    // Always start with false to match SSR, then update after mount
    const [isDesktop, setIsDesktop] = React.useState(false);
    const [isFoldable, setIsFoldable] = React.useState(false);
    const [foldState, setFoldState] = React.useState<"folded" | "unfolded">("unfolded");
    const [mounted, setMounted] = React.useState(false);

    // Set mounted flag after hydration
    React.useEffect(() => {
      setMounted(true);
    }, []);

    React.useEffect(() => {
      if (!responsive) return;

      let rafId: number | null = null;
      let ticking = false;
      let cleanup: (() => void) | null = null;
      let isMounted = true;

      const checkBreakpoint = () => {
        if (!isMounted || ticking) return;
        ticking = true;

        rafId = requestAnimationFrame(() => {
          if (!isMounted) {
            ticking = false;
            return;
          }

          const width = window.innerWidth;
          setIsDesktop(width >= responsiveBreakpoint);

          // Detect foldable devices using viewport segments with feature detection
          try {
            const viewportSegmentsSupport = supports("viewport-segments");
            if (viewportSegmentsSupport.supported) {
              setIsFoldable(true);
              const segments = (window as any).visualViewport?.segments;
              setFoldState(segments && segments.length > 1 ? "unfolded" : "folded");
            } else {
              setIsFoldable(false);
            }
          } catch {
            setIsFoldable(false);
          }

          ticking = false;
        });
      };

      // Use feature detection for ResizeObserver
      const resizeObserverSupport = supports("resize-observer");

      const setupObserver = () => {
        if (!isMounted) return; // Skip setup if unmounted

        if (resizeObserverSupport.supported || window.ResizeObserver) {
          const resizeObserver = new ResizeObserver(checkBreakpoint);
          resizeObserver.observe(document.documentElement);

          // Initial check
          checkBreakpoint();

          // Store cleanup function
          cleanup = () => {
            resizeObserver.disconnect();
            if (rafId !== null) {
              cancelAnimationFrame(rafId);
              rafId = null;
            }
          };
        } else {
          // Fallback to resize event
          checkBreakpoint();
          window.addEventListener("resize", checkBreakpoint);

          // Store cleanup function
          cleanup = () => {
            window.removeEventListener("resize", checkBreakpoint);
            if (rafId !== null) {
              cancelAnimationFrame(rafId);
              rafId = null;
            }
          };
        }
      };

      // Load polyfill if needed
      if (resizeObserverSupport.polyfillNeeded) {
        loadPolyfill("resize-observer")
          .then(() => {
            if (isMounted) setupObserver();
          })
          .catch(() => {
            if (isMounted) setupObserver();
          });
      } else {
        setupObserver();
      }

      // Return cleanup function that will be called on unmount or dependency change
      return () => {
        isMounted = false;
        if (cleanup) {
          cleanup();
        }
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
        }
      };
    }, [responsive, responsiveBreakpoint]);

    // Auto-generate navigation components from navigationItems if provided
    const autoBottomNav = React.useMemo(() => {
      if (!navigationItems) return null;
      return (
        <BottomNavigationBar
          items={navigationItems}
          value={navigationValue}
          onValueChange={onNavigationChange}
          showLabels={navigationShowLabels}
          elevation={3}
        />
      );
    }, [navigationItems, navigationValue, onNavigationChange, navigationShowLabels]);

    const autoNavigationRail = React.useMemo(() => {
      if (!navigationItems) return null;
      // NavigationRail only supports boolean for showLabels, so convert 'selected' to true
      const railShowLabels = navigationShowLabels === "selected" ? true : navigationShowLabels;
      return (
        <NavigationRail
          items={navigationItems}
          value={navigationValue}
          onValueChange={onNavigationChange}
          showLabels={railShowLabels}
          elevation={2}
        />
      );
    }, [navigationItems, navigationValue, onNavigationChange, navigationShowLabels]);

    // Use auto-generated navigation if navigationItems is provided, otherwise use provided components
    const finalBottomNav = navigationItems ? autoBottomNav : bottomNavigationBar;
    const finalNavigationRail = navigationItems ? autoNavigationRail : navigationRail;

    // Determine which navigation to show
    const showNavigationRail = responsive && isDesktop && finalNavigationRail;
    const showDrawer = drawer && (!responsive || !isDesktop);
    // Only hide bottomNavigationBar on desktop if navigationRail is available as alternative
    const showBottomNav = finalBottomNav && (!responsive || !isDesktop || !finalNavigationRail);

    // Calculate content padding based on active components
    const hasBottomNav = !!showBottomNav;
    const hasNavRail = !!showNavigationRail;

    // Get navigation rail width if present
    const navRailWidth = showNavigationRail
      ? (finalNavigationRail as React.ReactElement<NavigationRailProps>)?.props?.width || 80
      : 0;

    return (
      <div
        ref={ref}
        className={cn(
          "min-h-screen scaffold-responsive",
          backgroundColor,
          isFoldable && "foldable-device",
          isFoldable && foldState === "unfolded" && "device-unfolded",
          className,
        )}
        style={
          {
            display: "grid",
            gridTemplateAreas: hasNavRail
              ? `"nav header"
               "nav main"
               "nav footer"`
              : `"header"
               "main"
               "footer"`,
            gridTemplateRows: "auto 1fr auto",
            gridTemplateColumns: hasNavRail ? `${navRailWidth}px 1fr` : "1fr",
            containerType: "inline-size",
            containerName: "scaffold",
          } as React.CSSProperties
        }>
        {/* AppBar - rendered first to ensure proper z-index stacking */}
        {appBar && (
          <div
            className="scaffold-header"
            style={{
              gridArea: "header",
              // Only apply sticky positioning if AppBar uses sticky position (default)
              // This allows AppBar's position prop to work correctly
              ...((!appBar.props.position || appBar.props.position === "sticky") && {
                position: "sticky",
                top: 0,
                zIndex: 50,
              }),
            }}>
            {appBar}
          </div>
        )}

        {/* Navigation Rail */}
        {showNavigationRail && <div style={{ gridArea: "nav" }}>{finalNavigationRail}</div>}

        {/* Main Content */}
        <main
          className={cn("transition-all duration-300")}
          style={{
            gridArea: "main",
            paddingBottom: hasBottomNav ? "64px" : undefined,
            minHeight: 0, // Fix for grid overflow
          }}>
          {children}
        </main>

        {/* Bottom Navigation Bar */}
        {showBottomNav && <div style={{ gridArea: "footer" }}>{finalBottomNav}</div>}

        {/* Floating Action Button */}
        {floatingActionButton}

        {/* Drawer (left) - rendered after grid content for proper z-index stacking */}
        {showDrawer && drawer}

        {/* End Drawer (right) */}
        {endDrawer}
      </div>
    );
  },
);

Scaffold.displayName = "Scaffold";
