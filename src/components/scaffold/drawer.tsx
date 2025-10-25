"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface DrawerProps {
  children?: React.ReactNode;
  className?: string;
  /**
   * Whether the drawer is open
   */
  open?: boolean;
  /**
   * Callback when drawer state changes
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * Drawer position
   */
  side?: "left" | "right";
  /**
   * Drawer width
   */
  width?: number | string;
  /**
   * Enable gesture support for swipe to close
   */
  gestureEnabled?: boolean;
  /**
   * Enable backdrop overlay
   */
  showBackdrop?: boolean;
  /**
   * Elevation/shadow level
   */
  elevation?: 0 | 1 | 2 | 3 | 4 | 5;
  /**
   * Animation duration in ms
   */
  duration?: number;
}

const elevationClasses = {
  0: "",
  1: "shadow-sm",
  2: "shadow",
  3: "shadow-md",
  4: "shadow-lg",
  5: "shadow-xl",
};

export const Drawer = React.forwardRef<HTMLDivElement, DrawerProps>(
  (
    {
      children,
      className,
      open = false,
      onOpenChange,
      side = "left",
      width = 280,
      gestureEnabled = true,
      showBackdrop = true,
      elevation = 4,
      duration = 300,
    },
    ref,
  ) => {
    const [isDragging, setIsDragging] = React.useState(false);
    const [dragOffset, setDragOffset] = React.useState(0);
    const [dragVelocity, setDragVelocity] = React.useState(0);
    const startXRef = React.useRef<number>(0);
    const lastXRef = React.useRef<number>(0);
    const lastTimeRef = React.useRef<number>(0);
    const drawerRef = React.useRef<HTMLDivElement>(null);
    const rafIdRef = React.useRef<number | null>(null);

    const widthValue = typeof width === "number" ? `${width}px` : width;

    const handleTouchStart = React.useCallback(
      (e: React.TouchEvent) => {
        if (!gestureEnabled || !open) return;

        const touch = e.touches[0];
        startXRef.current = touch.clientX;
        lastXRef.current = touch.clientX;
        lastTimeRef.current = Date.now();
        setIsDragging(true);
        setDragVelocity(0);
      },
      [gestureEnabled, open],
    );

    const handleTouchMove = React.useCallback(
      (e: React.TouchEvent) => {
        if (!isDragging || !gestureEnabled) return;

        if (rafIdRef.current !== null) return;

        rafIdRef.current = requestAnimationFrame(() => {
          const touch = e.touches[0];
          const now = Date.now();
          const diff = touch.clientX - startXRef.current;
          const timeDiff = now - lastTimeRef.current || 1;
          const velocity = (touch.clientX - lastXRef.current) / timeDiff;

          lastXRef.current = touch.clientX;
          lastTimeRef.current = now;

          const widthNum = typeof width === "number" ? width : 300;

          // Only allow dragging in the close direction with resistance
          if (side === "left" && diff < 0) {
            // Add rubber band effect - smooth resistance curve
            const progress = Math.min(Math.abs(diff) / widthNum, 1);
            const resistance = 1 - Math.pow(progress, 2) * 0.7;
            setDragOffset(diff * resistance);
            setDragVelocity(velocity);
          } else if (side === "right" && diff > 0) {
            const progress = Math.min(Math.abs(diff) / widthNum, 1);
            const resistance = 1 - Math.pow(progress, 2) * 0.7;
            setDragOffset(diff * resistance);
            setDragVelocity(velocity);
          }

          rafIdRef.current = null;
        });
      },
      [isDragging, gestureEnabled, side, width],
    );

    const handleTouchEnd = React.useCallback(() => {
      if (!isDragging) return;

      const threshold = typeof width === "number" ? width * 0.3 : 80;
      const velocityThreshold = 0.5;

      // Consider both distance and velocity for closing
      const shouldClose =
        (side === "left" && (dragOffset < -threshold || dragVelocity < -velocityThreshold)) ||
        (side === "right" && (dragOffset > threshold || dragVelocity > velocityThreshold));

      if (shouldClose) {
        onOpenChange?.(false);
      }

      setIsDragging(false);
      setDragOffset(0);
      setDragVelocity(0);

      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    }, [isDragging, dragOffset, dragVelocity, side, width, onOpenChange]);

    const handleBackdropClick = React.useCallback(() => {
      onOpenChange?.(false);
    }, [onOpenChange]);

    // Close drawer on Escape key
    React.useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape" && open) {
          onOpenChange?.(false);
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }, [open, onOpenChange]);

    // Lock body scroll when drawer is open
    React.useEffect(() => {
      if (open) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }

      return () => {
        document.body.style.overflow = "";
      };
    }, [open]);

    const drawerTransform = React.useMemo(() => {
      if (!open) {
        return side === "left" ? "translateX(-100%)" : "translateX(100%)";
      }

      if (isDragging && dragOffset !== 0) {
        return `translateX(${dragOffset}px)`;
      }

      return "translateX(0)";
    }, [open, isDragging, dragOffset, side]);

    // Calculate backdrop opacity based on drag offset
    const backdropOpacity = React.useMemo(() => {
      if (!open) return 0;
      if (!isDragging || dragOffset === 0) return 1;

      const widthNum = typeof width === "number" ? width : 300;
      const progress = Math.abs(dragOffset) / widthNum;
      return Math.max(0, 1 - progress);
    }, [open, isDragging, dragOffset, width]);

    return (
      <>
        {/* Backdrop */}
        {showBackdrop && (
          <div
            className={cn(
              "fixed inset-0 bg-black z-40",
              !open && "pointer-events-none",
              !isDragging && "transition-opacity",
            )}
            style={{
              opacity: open ? backdropOpacity * 0.5 : 0,
              transitionDuration: isDragging ? "0ms" : `${duration}ms`,
            }}
            onClick={handleBackdropClick}
            aria-hidden="true"
          />
        )}

        {/* Drawer */}
        <aside
          ref={ref || drawerRef}
          className={cn(
            "fixed top-0 h-full bg-background z-50",
            side === "left" ? "left-0" : "right-0",
            elevationClasses[elevation],
            className,
          )}
          style={{
            width: widthValue,
            transform: drawerTransform,
            transition: isDragging ? "none" : `transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          aria-hidden={!open}>
          <div className="h-full overflow-y-auto overflow-x-hidden">{children}</div>
        </aside>
      </>
    );
  },
);

Drawer.displayName = "Drawer";
