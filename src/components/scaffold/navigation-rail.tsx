'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface NavigationRailItem {
  key: string;
  icon: React.ReactNode;
  label?: string;
  badge?: string | number;
  disabled?: boolean;
}

export interface NavigationRailProps {
  children?: React.ReactNode;
  className?: string;
  /**
   * Navigation items
   */
  items?: NavigationRailItem[];
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
  showLabels?: boolean;
  /**
   * Elevation level
   */
  elevation?: 0 | 1 | 2 | 3 | 4 | 5;
  /**
   * Optional header content (e.g., logo or menu button)
   */
  header?: React.ReactNode;
  /**
   * Optional footer content (e.g., settings button)
   */
  footer?: React.ReactNode;
  /**
   * Width of the rail
   */
  width?: number;
}

const elevationClasses = {
  0: '',
  1: 'shadow-sm',
  2: 'shadow',
  3: 'shadow-md',
  4: 'shadow-lg',
  5: 'shadow-xl',
};

export const NavigationRail = React.forwardRef<HTMLElement, NavigationRailProps>(
  (
    {
      children,
      className,
      items = [],
      value,
      onValueChange,
      showLabels = false,
      elevation = 2,
      header,
      footer,
      width = 80,
    },
    ref
  ) => {
    const handleItemClick = (item: NavigationRailItem) => {
      if (!item.disabled) {
        onValueChange?.(item.key);
      }
    };

    return (
      <nav
        ref={ref}
        className={cn(
          'fixed left-0 top-0 bottom-0 z-40',
          'flex flex-col',
          'bg-background border-r',
          elevationClasses[elevation],
          className
        )}
        style={{ width: `${width}px` }}
      >
        {header && (
          <div className="flex items-center justify-center h-16 border-b">
            {header}
          </div>
        )}

        <div className="flex-1 overflow-y-auto overflow-x-hidden py-4">
          <div className="flex flex-col gap-2">
            {items.map((item) => {
              const isSelected = value === item.key;

              return (
                <button
                  key={item.key}
                  type="button"
                  disabled={item.disabled}
                  onClick={() => handleItemClick(item)}
                  className={cn(
                    'relative flex flex-col items-center justify-center',
                    'mx-auto px-2 py-3 rounded-xl',
                    'transition-all duration-200',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    item.disabled && 'opacity-40 cursor-not-allowed',
                    !item.disabled && 'hover:bg-accent active:bg-accent/70',
                    isSelected && 'bg-primary/10'
                  )}
                  style={{
                    minWidth: showLabels ? `${width - 16}px` : '56px',
                  }}
                >
                  <div className="relative">
                    <div
                      className={cn(
                        'transition-all duration-200',
                        isSelected
                          ? 'text-primary scale-110'
                          : 'text-muted-foreground'
                      )}
                    >
                      {item.icon}
                    </div>

                    {item.badge !== undefined && (
                      <span
                        className={cn(
                          'absolute -top-1 -right-1',
                          'min-w-[18px] h-[18px] px-1',
                          'flex items-center justify-center',
                          'text-[10px] font-medium',
                          'bg-destructive text-destructive-foreground',
                          'rounded-full'
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>

                  {showLabels && item.label && (
                    <span
                      className={cn(
                        'text-xs mt-1 text-center line-clamp-1',
                        'transition-all duration-200',
                        isSelected
                          ? 'text-primary font-medium'
                          : 'text-muted-foreground'
                      )}
                    >
                      {item.label}
                    </span>
                  )}

                  {isSelected && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {footer && (
          <div className="flex items-center justify-center h-16 border-t">
            {footer}
          </div>
        )}

        {children}
      </nav>
    );
  }
);

NavigationRail.displayName = 'NavigationRail';