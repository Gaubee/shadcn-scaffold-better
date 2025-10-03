'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface FloatingActionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button size
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Position on screen
   */
  position?:
    | 'bottom-right'
    | 'bottom-left'
    | 'top-right'
    | 'top-left'
    | 'bottom-center';
  /**
   * Elevation level
   */
  elevation?: 0 | 1 | 2 | 3 | 4 | 5;
  /**
   * Extended FAB with label
   */
  extended?: boolean;
  /**
   * Label text (for extended FAB)
   */
  label?: string;
  /**
   * Icon element
   */
  icon?: React.ReactNode;
  /**
   * Hide on scroll down
   */
  hideOnScroll?: boolean;
  /**
   * Offset from edge (in pixels)
   */
  offset?: number;
}

const sizeClasses = {
  small: 'h-10 w-10',
  medium: 'h-14 w-14',
  large: 'h-16 w-16',
};

const elevationClasses = {
  0: '',
  1: 'shadow-sm',
  2: 'shadow',
  3: 'shadow-md',
  4: 'shadow-lg',
  5: 'shadow-xl',
};

export const FloatingActionButton = React.forwardRef<
  HTMLButtonElement,
  FloatingActionButtonProps
>(
  (
    {
      className,
      size = 'medium',
      position = 'bottom-right',
      elevation = 3,
      extended = false,
      label,
      icon,
      hideOnScroll = false,
      offset = 16,
      children,
      ...props
    },
    ref
  ) => {
    const [supportsScrollTimeline, setSupportsScrollTimeline] = React.useState(false);
    const [isVisible, setIsVisible] = React.useState(true);
    const lastScrollY = React.useRef(0);

    // Check for CSS scroll-driven animations support
    React.useEffect(() => {
      if (typeof window === 'undefined') return;

      let isMounted = true;

      import('@/lib/feature-detection').then(({ supports }) => {
        if (!isMounted) return;
        const scrollTimelineSupport = supports('scroll-timeline');
        setSupportsScrollTimeline(scrollTimelineSupport.supported);
      }).catch(() => {
        if (!isMounted) return;
        setSupportsScrollTimeline(false);
      });

      return () => {
        isMounted = false;
      };
    }, []);

    // JavaScript fallback for scroll hide
    React.useEffect(() => {
      if (supportsScrollTimeline || !hideOnScroll) return;

      let rafId: number | null = null;
      let ticking = false;

      const handleScroll = () => {
        if (ticking) return;
        ticking = true;

        rafId = requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
            setIsVisible(false);
          } else {
            setIsVisible(true);
          }

          lastScrollY.current = currentScrollY;
          ticking = false;
        });
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        window.removeEventListener('scroll', handleScroll);
        if (rafId !== null) cancelAnimationFrame(rafId);
      };
    }, [hideOnScroll, supportsScrollTimeline]);

    const positionStyles: Record<string, React.CSSProperties> = {
      'bottom-right': { bottom: offset, right: offset },
      'bottom-left': { bottom: offset, left: offset },
      'top-right': { top: offset, right: offset },
      'top-left': { top: offset, left: offset },
      'bottom-center': {
        bottom: offset,
        left: '50%',
        transform: 'translateX(-50%)',
      },
    };

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          'fixed z-50',
          'flex items-center justify-center gap-2',
          'bg-primary text-primary-foreground',
          'rounded-full',
          'transition-all duration-300',
          'hover:scale-110 hover:brightness-110',
          'active:scale-95',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
          supportsScrollTimeline && hideOnScroll && 'fab-hide-on-scroll',
          !supportsScrollTimeline && !isVisible && 'scale-0 opacity-0',
          extended ? 'h-12 px-6' : sizeClasses[size],
          elevationClasses[elevation],
          className
        )}
        style={positionStyles[position]}
        {...props}
      >
        {icon && <div className={cn(extended && label && 'mr-1')}>{icon}</div>}
        {extended && label && (
          <span className="font-medium text-sm whitespace-nowrap">{label}</span>
        )}
        {children}
      </button>
    );
  }
);

FloatingActionButton.displayName = 'FloatingActionButton';