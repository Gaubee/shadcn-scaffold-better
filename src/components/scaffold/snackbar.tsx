'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SnackbarProps {
  /**
   * Message to display
   */
  message: string;
  /**
   * Whether the snackbar is open
   */
  open?: boolean;
  /**
   * Callback when snackbar state changes
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * Auto hide duration in milliseconds (0 = no auto hide)
   */
  autoHideDuration?: number;
  /**
   * Action button
   */
  action?: {
    label: string;
    onClick: () => void;
  };
  /**
   * Position on screen
   */
  position?:
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right'
    | 'top-left'
    | 'top-center'
    | 'top-right';
  /**
   * Severity/variant
   */
  severity?: 'default' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

const severityClasses = {
  default: 'bg-foreground text-background',
  success: 'bg-green-600 text-white',
  warning: 'bg-amber-600 text-white',
  error: 'bg-destructive text-destructive-foreground',
  info: 'bg-blue-600 text-white',
};

const positionClasses = {
  'bottom-left': 'bottom-4 left-4',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  'bottom-right': 'bottom-4 right-4',
  'top-left': 'top-4 left-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'top-right': 'top-4 right-4',
};

export const Snackbar = React.forwardRef<HTMLDivElement, SnackbarProps>(
  (
    {
      message,
      open = false,
      onOpenChange,
      autoHideDuration = 6000,
      action,
      position = 'bottom-left',
      severity = 'default',
      className,
    },
    ref
  ) => {
    const timeoutRef = React.useRef<NodeJS.Timeout | undefined>(undefined);

    React.useEffect(() => {
      if (open && autoHideDuration > 0) {
        timeoutRef.current = setTimeout(() => {
          onOpenChange?.(false);
        }, autoHideDuration);
      }

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, [open, autoHideDuration, onOpenChange]);

    if (!open) return null;

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          'fixed z-50',
          'flex items-center gap-3',
          'min-w-[288px] max-w-[568px]',
          'px-4 py-3 rounded-lg',
          'shadow-lg',
          'animate-in slide-in-from-bottom-5 duration-300',
          severityClasses[severity],
          positionClasses[position],
          className
        )}
      >
        <div className="flex-1 text-sm font-medium">{message}</div>

        {action && (
          <button
            type="button"
            onClick={() => {
              action.onClick();
              onOpenChange?.(false);
            }}
            className={cn(
              'text-sm font-semibold uppercase',
              'px-2 py-1 rounded',
              'transition-colors',
              'hover:bg-black/10 active:bg-black/20',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50'
            )}
          >
            {action.label}
          </button>
        )}

        <button
          type="button"
          onClick={() => onOpenChange?.(false)}
          className={cn(
            'ml-auto p-1 rounded',
            'transition-colors',
            'hover:bg-black/10 active:bg-black/20',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50'
          )}
          aria-label="Close"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 4L4 12M4 4L12 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    );
  }
);

Snackbar.displayName = 'Snackbar';

// Hook for easier usage
export function useSnackbar() {
  const [state, setState] = React.useState<{
    open: boolean;
    message: string;
    severity?: SnackbarProps['severity'];
    action?: SnackbarProps['action'];
  }>({
    open: false,
    message: '',
  });

  const show = React.useCallback(
    (
      message: string,
      options?: {
        severity?: SnackbarProps['severity'];
        action?: SnackbarProps['action'];
      }
    ) => {
      setState({
        open: true,
        message,
        severity: options?.severity,
        action: options?.action,
      });
    },
    []
  );

  const hide = React.useCallback(() => {
    setState((prev) => ({ ...prev, open: false }));
  }, []);

  return {
    ...state,
    show,
    hide,
    snackbarProps: {
      ...state,
      onOpenChange: hide,
    },
  };
}