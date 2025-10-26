"use client";

import { cn } from "@/lib/utils";
import * as React from "react";

export interface ModalProps {
  children?: React.ReactNode;
  className?: string;
  /**
   * Whether the modal is open
   */
  open?: boolean;
  /**
   * Callback when modal state changes
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * Modal title
   */
  title?: string;
  /**
   * Modal description
   */
  description?: string;
  /**
   * Show close button
   */
  showClose?: boolean;
  /**
   * Close on backdrop click
   */
  closeOnBackdropClick?: boolean;
  /**
   * Close on Escape key
   */
  closeOnEscape?: boolean;
  /**
   * Modal size
   */
  size?: "sm" | "md" | "lg" | "xl" | "full";
  /**
   * Custom backdrop className
   */
  backdropClassName?: string;
}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-full mx-4",
};

export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      children,
      className,
      open = false,
      onOpenChange,
      title,
      description,
      showClose = true,
      closeOnBackdropClick = true,
      closeOnEscape = true,
      size = "md",
      backdropClassName,
    },
    ref,
  ) => {
    // Lock body scroll when modal is open
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

    // Handle Escape key
    React.useEffect(() => {
      if (!closeOnEscape || !open) return;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onOpenChange?.(false);
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }, [open, closeOnEscape, onOpenChange]);

    if (!open) return null;

    return (
      <>
        {/* Backdrop */}
        <div
          className={cn(
            "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm",
            "animate-in fade-in duration-200",
            backdropClassName,
          )}
          onClick={closeOnBackdropClick ? () => onOpenChange?.(false) : undefined}
          aria-hidden="true"
        />

        {/* Modal */}
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? "modal-title" : undefined}
          aria-describedby={description ? "modal-description" : undefined}>
          <div
            ref={ref}
            className={cn(
              "bg-background relative w-full rounded-lg shadow-lg",
              "animate-in zoom-in-95 duration-200",
              sizeClasses[size],
              className,
            )}
            onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            {(title || description || showClose) && (
              <div className="relative px-6 pt-6 pb-4">
                {showClose && (
                  <button
                    type="button"
                    onClick={() => onOpenChange?.(false)}
                    className={cn(
                      "absolute top-4 right-4 rounded-md p-1",
                      "text-muted-foreground",
                      "transition-colors",
                      "hover:bg-accent hover:text-accent-foreground",
                      "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
                    )}
                    aria-label="Close">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>
                )}

                {title && (
                  <h2 id="modal-title" className="text-foreground pr-8 text-lg font-semibold">
                    {title}
                  </h2>
                )}

                {description && (
                  <p id="modal-description" className="text-muted-foreground mt-2 text-sm">
                    {description}
                  </p>
                )}
              </div>
            )}

            {/* Content */}
            <div className="px-6 pb-6">{children}</div>
          </div>
        </div>
      </>
    );
  },
);

Modal.displayName = "Modal";

// Modal Footer component for actions
export interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const ModalFooter = React.forwardRef<HTMLDivElement, ModalFooterProps>(({ children, className }, ref) => {
  return (
    <div ref={ref} className={cn("flex items-center justify-end gap-2 border-t pt-4", className)}>
      {children}
    </div>
  );
});

ModalFooter.displayName = "ModalFooter";
