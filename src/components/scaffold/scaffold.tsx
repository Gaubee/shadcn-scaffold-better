'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import type { AppBarProps } from './app-bar';
import type { DrawerProps } from './drawer';
import type { BottomNavigationBarProps } from './bottom-navigation-bar';
import type { NavigationRailProps } from './navigation-rail';
import type { FloatingActionButtonProps } from './floating-action-button';

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
      floatingActionButton,
      backgroundColor = 'bg-background',
      responsive = true,
      responsiveBreakpoint = 1024,
    },
    ref
  ) => {
    const [isDesktop, setIsDesktop] = React.useState(
      typeof window !== 'undefined' ? window.innerWidth >= responsiveBreakpoint : false
    );
    const [isFoldable, setIsFoldable] = React.useState(false);
    const [foldState, setFoldState] = React.useState<'folded' | 'unfolded'>('unfolded');

    React.useEffect(() => {
      if (!responsive) return;

      let rafId: number | null = null;
      let ticking = false;

      const checkBreakpoint = () => {
        if (ticking) return;
        ticking = true;

        rafId = requestAnimationFrame(() => {
          const width = window.innerWidth;
          setIsDesktop(width >= responsiveBreakpoint);

          // Detect foldable devices using viewport segments
          if ('visualViewport' in window && (window as any).visualViewport?.segments) {
            setIsFoldable(true);
            const segments = (window as any).visualViewport.segments;
            setFoldState(segments.length > 1 ? 'unfolded' : 'folded');
          } else {
            setIsFoldable(false);
          }

          ticking = false;
        });
      };

      // Use ResizeObserver for better performance if available
      if (typeof ResizeObserver !== 'undefined') {
        const resizeObserver = new ResizeObserver(checkBreakpoint);
        resizeObserver.observe(document.documentElement);

        // Initial check
        checkBreakpoint();

        return () => {
          resizeObserver.disconnect();
          if (rafId !== null) cancelAnimationFrame(rafId);
        };
      } else {
        // Fallback to resize event
        checkBreakpoint();
        window.addEventListener('resize', checkBreakpoint);

        return () => {
          window.removeEventListener('resize', checkBreakpoint);
          if (rafId !== null) cancelAnimationFrame(rafId);
        };
      }
    }, [responsive, responsiveBreakpoint]);

    // Determine which navigation to show
    const showNavigationRail = responsive && isDesktop && navigationRail;
    const showDrawer = drawer && (!responsive || !isDesktop);

    // Calculate content padding based on active components
    const hasBottomNav = !!bottomNavigationBar;
    const hasNavRail = !!showNavigationRail;

    // Get navigation rail width if present
    const navRailWidth = showNavigationRail
      ? navigationRail.props.width || 80
      : 0;

    return (
      <div
        ref={ref}
        className={cn(
          'min-h-screen scaffold-responsive',
          backgroundColor,
          isFoldable && 'foldable-device',
          isFoldable && foldState === 'unfolded' && 'device-unfolded',
          className
        )}
        style={{
          display: 'grid',
          gridTemplateAreas: hasNavRail
            ? `"nav header header"
               "nav main main"
               "nav footer footer"`
            : `"header header header"
               "main main main"
               "footer footer footer"`,
          gridTemplateRows: 'auto 1fr auto',
          gridTemplateColumns: hasNavRail ? `${navRailWidth}px 1fr auto` : '1fr',
          containerType: 'inline-size',
          containerName: 'scaffold',
        } as React.CSSProperties}
      >
        {/* AppBar */}
        {appBar && (
          <div style={{ gridArea: 'header' }}>
            {appBar}
          </div>
        )}

        {/* Drawer (left) */}
        {showDrawer && drawer}

        {/* End Drawer (right) */}
        {endDrawer}

        {/* Navigation Rail */}
        {showNavigationRail && (
          <div style={{ gridArea: 'nav' }}>
            {navigationRail}
          </div>
        )}

        {/* Main Content */}
        <main
          className={cn('transition-all duration-300')}
          style={{
            gridArea: 'main',
            paddingBottom: hasBottomNav ? '64px' : undefined,
            minHeight: 0, // Fix for grid overflow
          }}
        >
          {children}
        </main>

        {/* Bottom Navigation Bar */}
        {bottomNavigationBar && (
          <div style={{ gridArea: 'footer' }}>
            {bottomNavigationBar}
          </div>
        )}

        {/* Floating Action Button */}
        {floatingActionButton}
      </div>
    );
  }
);

Scaffold.displayName = 'Scaffold';