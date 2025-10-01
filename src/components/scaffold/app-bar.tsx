'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { supports } from '@/lib/feature-detection';

export interface AppBarProps {
  children?: React.ReactNode;
  className?: string;
  /**
   * Enable scroll-driven collapse animation
   */
  collapsible?: boolean;
  /**
   * Enable immersive mode (transparent initially, becomes solid on scroll)
   */
  immersive?: boolean;
  /**
   * Height when expanded (default: 64px)
   */
  expandedHeight?: number;
  /**
   * Height when collapsed (default: 56px)
   */
  collapsedHeight?: number;
  /**
   * Elevation/shadow level (0-5)
   */
  elevation?: 0 | 1 | 2 | 3 | 4 | 5;
  /**
   * Position type
   */
  position?: 'fixed' | 'sticky' | 'static';
  /**
   * Leading element (e.g., menu button)
   */
  leading?: React.ReactNode;
  /**
   * Title element
   */
  title?: React.ReactNode;
  /**
   * Actions element (e.g., icons on the right)
   */
  actions?: React.ReactNode;
}

const elevationClasses = {
  0: '',
  1: 'shadow-sm',
  2: 'shadow',
  3: 'shadow-md',
  4: 'shadow-lg',
  5: 'shadow-xl',
};

export const AppBar = React.forwardRef<HTMLElement, AppBarProps>(
  (
    {
      children,
      className,
      collapsible = false,
      immersive = false,
      expandedHeight = 64,
      collapsedHeight = 56,
      elevation = 2,
      position = 'sticky',
      leading,
      title,
      actions,
    },
    ref
  ) => {
    const [supportsScrollTimeline, setSupportsScrollTimeline] = React.useState(false);
    const [scrollY, setScrollY] = React.useState(0);
    const [isCollapsed, setIsCollapsed] = React.useState(false);
    const headerRef = React.useRef<HTMLElement>(null);

    // Check for CSS scroll-driven animations support using feature detection
    React.useEffect(() => {
      if (typeof window === 'undefined') return;

      const scrollTimelineSupport = supports('scroll-timeline');
      setSupportsScrollTimeline(scrollTimelineSupport.supported);
    }, []);

    // JavaScript fallback for browsers without scroll-driven animations support
    React.useEffect(() => {
      if (supportsScrollTimeline || (!collapsible && !immersive)) return;

      let rafId: number | null = null;
      let ticking = false;

      const handleScroll = () => {
        if (ticking) return;
        ticking = true;

        rafId = requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          setScrollY(currentScrollY);

          if (collapsible) {
            setIsCollapsed(currentScrollY > 50);
          }

          ticking = false;
        });
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        window.removeEventListener('scroll', handleScroll);
        if (rafId !== null) cancelAnimationFrame(rafId);
      };
    }, [collapsible, immersive, supportsScrollTimeline]);

    // Calculate dynamic values for JS fallback
    const scrollProgress = Math.min(scrollY / 200, 1);
    const easeOutQuart = 1 - Math.pow(1 - scrollProgress, 4);

    const currentHeight = React.useMemo(() => {
      if (!supportsScrollTimeline && collapsible) {
        return isCollapsed
          ? collapsedHeight
          : expandedHeight - (expandedHeight - collapsedHeight) * easeOutQuart;
      }
      return expandedHeight;
    }, [supportsScrollTimeline, collapsible, isCollapsed, collapsedHeight, expandedHeight, easeOutQuart]);

    const opacity = React.useMemo(
      () => (!supportsScrollTimeline && immersive ? Math.min(scrollY / 100, 1) : 1),
      [supportsScrollTimeline, immersive, scrollY]
    );

    const backdropBlur = React.useMemo(
      () => (!supportsScrollTimeline && immersive ? Math.min(scrollY / 50, 1) : 1),
      [supportsScrollTimeline, immersive, scrollY]
    );

    const scale = React.useMemo(
      () => (!supportsScrollTimeline && immersive ? 1 - (scrollProgress * 0.02) : 1),
      [supportsScrollTimeline, immersive, scrollProgress]
    );

    const positionClasses = {
      fixed: 'fixed top-0 left-0 right-0 z-50',
      sticky: 'sticky top-0 z-50',
      static: 'relative',
    };

    return (
      <header
        ref={(node) => {
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
          if (node) {
            (headerRef as React.MutableRefObject<HTMLElement | null>).current = node;
          }
        }}
        className={cn(
          'w-full',
          positionClasses[position],
          elevationClasses[elevation],
          // Apply CSS-driven animation classes when supported
          supportsScrollTimeline && collapsible && 'app-bar-collapsible',
          supportsScrollTimeline && immersive && 'app-bar-immersive',
          // Fallback transition for browsers without support
          !supportsScrollTimeline && 'transition-all duration-300 ease-in-out',
          className
        )}
        style={{
          // CSS custom properties for scroll-driven animations
          ...(supportsScrollTimeline && {
            '--app-bar-expanded-height': `${expandedHeight}px`,
            '--app-bar-collapsed-height': `${collapsedHeight}px`,
          } as React.CSSProperties),
          // JS fallback styles
          ...(!supportsScrollTimeline && {
            height: `${currentHeight}px`,
            transform: immersive ? `scale(${scale})` : undefined,
            transformOrigin: 'top center',
          }),
        }}
      >
        <div
          className={cn(
            'absolute inset-0 bg-background',
            supportsScrollTimeline && immersive && 'app-bar-backdrop',
            !supportsScrollTimeline && immersive && 'backdrop-blur-md transition-all duration-300'
          )}
          style={!supportsScrollTimeline ? {
            opacity: immersive ? opacity : 1,
            backdropFilter: immersive
              ? `blur(${backdropBlur * 12}px) saturate(${1 + backdropBlur * 0.5})`
              : undefined,
            WebkitBackdropFilter: immersive
              ? `blur(${backdropBlur * 12}px) saturate(${1 + backdropBlur * 0.5})`
              : undefined,
          } : undefined}
        />

        <div className="relative h-full px-4 flex items-center justify-between gap-4">
          {leading && (
            <div
              className={cn(
                'flex-shrink-0 flex items-center',
                supportsScrollTimeline && immersive && 'app-bar-leading',
                !supportsScrollTimeline && 'transition-all duration-300'
              )}
              style={!supportsScrollTimeline && immersive ? {
                opacity: 0.5 + opacity * 0.5,
                transform: `translateX(${-scrollProgress * 4}px)`,
              } : undefined}
            >
              {leading}
            </div>
          )}

          {title && (
            <div
              className={cn(
                'flex-1 overflow-hidden',
                supportsScrollTimeline && immersive && 'app-bar-title',
                !supportsScrollTimeline && 'transition-all duration-300',
                !supportsScrollTimeline && isCollapsed && 'text-sm'
              )}
              style={!supportsScrollTimeline && immersive ? {
                opacity: 0.5 + opacity * 0.5,
                transform: `translateY(${scrollProgress * 2}px)`,
              } : undefined}
            >
              {title}
            </div>
          )}

          {actions && (
            <div
              className={cn(
                'flex-shrink-0 flex items-center gap-2',
                supportsScrollTimeline && immersive && 'app-bar-actions',
                !supportsScrollTimeline && 'transition-all duration-300'
              )}
              style={!supportsScrollTimeline && immersive ? {
                opacity: 0.5 + opacity * 0.5,
                transform: `translateX(${scrollProgress * 4}px)`,
              } : undefined}
            >
              {actions}
            </div>
          )}

          {children && <div className="flex-1">{children}</div>}
        </div>
      </header>
    );
  }
);

AppBar.displayName = 'AppBar';