"use client";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type RailPosition = "inline-start" | "inline-end" | "block-start" | "block-end";
type Orientation = "horizontal" | "vertical";
type PopoverSide = "top" | "bottom" | "left" | "right";

// --- Context Types ---
interface RailNavbarContextValue {
  railPosition: RailPosition;
  orientation: Orientation;
  popoverSide: PopoverSide;
}

interface CompactContextValue {
  compact: boolean;
}

interface MenuItemContextValue {
  hasContent: boolean;
}

// --- Contexts ---
const RailNavbarContext = React.createContext<RailNavbarContextValue | null>(null);
const CompactContext = React.createContext<CompactContextValue | null>(null);
const MenuItemContext = React.createContext<MenuItemContextValue | null>(null);

// --- Hooks ---
function useRailNavbar() {
  const context = React.useContext(RailNavbarContext);
  if (!context) {
    throw new Error("useRailNavbar must be used within a RailNavbar.");
  }
  return context;
}

function useCompact() {
  return React.useContext(CompactContext);
}

function useMenuItemContext() {
  const context = React.useContext(MenuItemContext);
  if (!context) {
    throw new Error("useMenuItemContext must be used within a RailNavbarMenuItem.");
  }
  return context;
}

// --- Helper Functions ---
function computeOrientation(railPosition: RailPosition): Orientation {
  return railPosition.startsWith("inline-") ? "vertical" : "horizontal";
}

function computePopoverSide(railPosition: RailPosition): PopoverSide {
  switch (railPosition) {
    case "inline-start":
      return "right";
    case "inline-end":
      return "left";
    case "block-start":
      return "bottom";
    case "block-end":
      return "top";
  }
}

// --- RailNavbar Root ---
const RailNavbar = React.forwardRef<
  HTMLElement,
  React.ComponentProps<"nav"> & {
    railPosition: RailPosition;
  }
>(({ railPosition, className, children, ...props }, ref) => {
  const contextValue = React.useMemo<RailNavbarContextValue>(
    () => ({
      railPosition,
      orientation: computeOrientation(railPosition),
      popoverSide: computePopoverSide(railPosition),
    }),
    [railPosition],
  );

  const { orientation } = contextValue;

  return (
    <RailNavbarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <nav
          ref={ref}
          data-rail-position={railPosition}
          className={cn(
            "flex h-full w-full",
            orientation === "horizontal" ? "flex-row overflow-x-auto" : "flex-col overflow-y-auto",
            "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[color-mix(in_srgb,currentColor,transparent)]",
            className,
          )}
          {...props}>
          {children}
        </nav>
      </TooltipProvider>
    </RailNavbarContext.Provider>
  );
});
RailNavbar.displayName = "RailNavbar";

// --- RailNavbarMenu ---
const RailNavbarMenu = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul"> & {
    compact?: boolean;
  }
>(({ compact = false, className, children, ...props }, ref) => {
  const { orientation } = useRailNavbar();

  const compactContextValue = React.useMemo<CompactContextValue>(() => ({ compact }), [compact]);

  return (
    <CompactContext.Provider value={compactContextValue}>
      <ul
        ref={ref}
        data-rail-menu="menu"
        className={cn("flex gap-1 p-2", orientation === "horizontal" ? "flex-row" : "flex-col", className)}
        {...props}>
        {children}
      </ul>
    </CompactContext.Provider>
  );
});
RailNavbarMenu.displayName = "RailNavbarMenu";

// --- RailNavbarMenuItem ---
const RailNavbarMenuItem = React.forwardRef<HTMLLIElement, React.ComponentProps<"li">>(
  ({ className, children, ...props }, ref) => {
    // 检测子元素中是否包含 RailNavbarMenuContent
    const hasContent = React.useMemo(() => {
      return React.Children.toArray(children).some(
        (child) => React.isValidElement(child) && child.type === RailNavbarMenuContent,
      );
    }, [children]);

    const menuItemContextValue = React.useMemo<MenuItemContextValue>(() => ({ hasContent }), [hasContent]);

    // 如果有子菜单，包裹 DropdownMenu
    if (hasContent) {
      return (
        <MenuItemContext.Provider value={menuItemContextValue}>
          <DropdownMenu>
            <li ref={ref} data-rail-menu="menu-item" className={cn("group/menu-item relative", className)} {...props}>
              {children}
            </li>
          </DropdownMenu>
        </MenuItemContext.Provider>
      );
    }

    // 无子菜单，普通 li
    return (
      <MenuItemContext.Provider value={menuItemContextValue}>
        <li ref={ref} data-rail-menu="menu-item" className={cn("group/menu-item relative", className)} {...props}>
          {children}
        </li>
      </MenuItemContext.Provider>
    );
  },
);
RailNavbarMenuItem.displayName = "RailNavbarMenuItem";

// --- RailNavbarMenuButton Variants ---
const railNavbarMenuButtonVariants = cva(
  "flex items-center gap-2 rounded-md p-2 text-sm outline-none ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:bg-accent active:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-accent data-[active=true]:font-medium data-[active=true]:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground [&>svg]:size-5 [&>svg]:shrink-0",
  {
    variants: {
      orientation: {
        vertical: "w-full justify-start text-left",
        horizontal: "flex-col justify-center text-center min-w-[4rem]",
      },
      compact: {
        true: "aspect-square justify-center p-2",
        false: "",
      },
    },
    defaultVariants: {
      orientation: "vertical",
      compact: false,
    },
  },
);

// --- RailNavbarMenuButton ---
const RailNavbarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    icon?: React.ReactNode;
    label: string;
    compact?: boolean;
    isActive?: boolean;
  } & VariantProps<typeof railNavbarMenuButtonVariants>
>(({ icon, label, compact: compactProp, isActive = false, className, ...props }, ref) => {
  const { hasContent } = useMenuItemContext();
  const { orientation } = useRailNavbar();
  const compactContext = useCompact();

  // compact 优先级：prop > context > false
  const compact = compactProp ?? compactContext?.compact ?? false;

  // 图标逻辑：优先使用 icon prop，否则使用 label 首字母
  const displayIcon = icon ?? <span className="font-bold text-lg">{label[0]}</span>;

  const buttonElement = (
    <button
      ref={ref}
      data-rail-menu="menu-button"
      data-active={isActive}
      className={cn(railNavbarMenuButtonVariants({ orientation, compact }), className)}
      {...props}>
      {displayIcon}
      {!compact && <span>{label}</span>}
    </button>
  );

  // 有子菜单时使用 DropdownMenuTrigger
  if (hasContent) {
    return <DropdownMenuTrigger asChild>{buttonElement}</DropdownMenuTrigger>;
  }

  // 无子菜单时返回普通 button
  return buttonElement;
});
RailNavbarMenuButton.displayName = "RailNavbarMenuButton";

// --- RailNavbarMenuContent ---
const RailNavbarMenuContent = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, children, ...props }, ref) => {
    const { railPosition, popoverSide } = useRailNavbar();
    const compactContext = useCompact();

    const isInline = railPosition.startsWith("inline-");
    const compact = compactContext?.compact ?? false;

    // compact 模式或 block-* 位置：使用 DropdownMenuContent
    if (compact || !isInline) {
      return (
        <DropdownMenuContent
          ref={ref}
          side={popoverSide}
          sideOffset={4}
          className={cn("min-w-[12rem]", className)}
          {...props}>
          {children}
        </DropdownMenuContent>
      );
    }

    // inline-* 非 compact：直接展开渲染（缩进样式）
    return (
      <div
        ref={ref}
        data-rail-menu="menu-content"
        className={cn("border-border mx-3.5 flex translate-x-px flex-col gap-1 border-l px-2.5 py-0.5", className)}
        {...props}>
        {children}
      </div>
    );
  },
);
RailNavbarMenuContent.displayName = "RailNavbarMenuContent";

// --- RailNavbarMenuSubItem ---
const RailNavbarMenuSubItem = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, children, ...props }, ref) => {
    const { railPosition } = useRailNavbar();
    const compactContext = useCompact();

    const isInline = railPosition.startsWith("inline-");
    const compact = compactContext?.compact ?? false;

    // compact 模式或 block-* 位置：使用 DropdownMenuItem
    if (compact || !isInline) {
      return (
        <DropdownMenuItem ref={ref} data-rail-menu="menu-sub-item" className={className} {...props}>
          {children}
        </DropdownMenuItem>
      );
    }

    // inline-* 非 compact：普通 div
    return (
      <div ref={ref} data-rail-menu="menu-sub-item" className={className} {...props}>
        {children}
      </div>
    );
  },
);
RailNavbarMenuSubItem.displayName = "RailNavbarMenuSubItem";

// --- RailNavbarMenuSubButton ---
const RailNavbarMenuSubButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    icon?: React.ReactNode;
    label: string;
    isActive?: boolean;
  }
>(({ icon, label, isActive, className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      data-rail-menu="menu-sub-button"
      data-active={isActive}
      className={cn(
        "ring-offset-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring active:bg-accent active:text-accent-foreground flex h-8 w-full items-center gap-2 rounded-md px-2 text-left text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0",
        "data-[active=true]:bg-accent data-[active=true]:text-accent-foreground data-[active=true]:font-medium",
        className,
      )}
      {...props}>
      {icon}
      <span>{label}</span>
    </button>
  );
});
RailNavbarMenuSubButton.displayName = "RailNavbarMenuSubButton";

export {
  RailNavbar,
  RailNavbarMenu,
  RailNavbarMenuButton,
  RailNavbarMenuItem,
  RailNavbarMenuContent,
  RailNavbarMenuSubButton,
  RailNavbarMenuSubItem,
  useRailNavbar,
  useCompact,
};
