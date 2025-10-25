import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { NavigationRail } from "../navigation-rail";
import { Home, Search, User, Settings } from "lucide-react";

describe("NavigationRail", () => {
  const mockItems = [
    { key: "home", icon: <Home data-testid="home-icon" />, label: "Home" },
    {
      key: "search",
      icon: <Search data-testid="search-icon" />,
      label: "Search",
    },
    {
      key: "profile",
      icon: <User data-testid="profile-icon" />,
      label: "Profile",
    },
  ];

  it("renders all navigation items", () => {
    render(<NavigationRail items={mockItems} />);

    expect(screen.getByTestId("home-icon")).toBeInTheDocument();
    expect(screen.getByTestId("search-icon")).toBeInTheDocument();
    expect(screen.getByTestId("profile-icon")).toBeInTheDocument();
  });

  it("hides labels by default", () => {
    render(<NavigationRail items={mockItems} />);

    expect(screen.queryByText("Home")).not.toBeInTheDocument();
    expect(screen.queryByText("Search")).not.toBeInTheDocument();
    expect(screen.queryByText("Profile")).not.toBeInTheDocument();
  });

  it("shows labels when showLabels is true", () => {
    render(<NavigationRail items={mockItems} showLabels />);

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Search")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
  });

  it("highlights selected item with indicator", () => {
    const { container } = render(<NavigationRail items={mockItems} value="search" />);

    const searchIcon = screen.getByTestId("search-icon");
    const searchButton = searchIcon.closest("button");

    // Selected button should have primary background
    expect(searchButton).toHaveClass("bg-primary/10");

    // Selected icon should have primary color
    expect(searchIcon.parentElement).toHaveClass("text-primary");

    // Should have selection indicator
    const indicator = container.querySelector(".bg-primary.rounded-r-full");
    expect(indicator).toBeInTheDocument();
  });

  it("calls onValueChange when item is clicked", () => {
    const handleChange = vi.fn();
    render(<NavigationRail items={mockItems} value="home" onValueChange={handleChange} />);

    const searchButton = screen.getByTestId("search-icon").closest("button");
    fireEvent.click(searchButton!);

    expect(handleChange).toHaveBeenCalledWith("search");
  });

  it("does not call onValueChange for disabled items", () => {
    const handleChange = vi.fn();
    const itemsWithDisabled = [
      ...mockItems,
      {
        key: "settings",
        icon: <Settings data-testid="settings-icon" />,
        label: "Settings",
        disabled: true,
      },
    ];

    render(<NavigationRail items={itemsWithDisabled} value="home" onValueChange={handleChange} />);

    const settingsButton = screen.getByTestId("settings-icon").closest("button");
    expect(settingsButton).toBeDisabled();

    fireEvent.click(settingsButton!);
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("renders badges on items", () => {
    const itemsWithBadges = [{ ...mockItems[0], badge: 3 }, { ...mockItems[1], badge: "9+" }, mockItems[2]];

    render(<NavigationRail items={itemsWithBadges} />);

    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("9+")).toBeInTheDocument();
  });

  it("renders header content", () => {
    render(<NavigationRail items={mockItems} header={<div data-testid="rail-header">Logo</div>} />);

    expect(screen.getByTestId("rail-header")).toBeInTheDocument();
  });

  it("renders footer content", () => {
    render(<NavigationRail items={mockItems} footer={<div data-testid="rail-footer">Settings</div>} />);

    expect(screen.getByTestId("rail-footer")).toBeInTheDocument();
  });

  it("applies custom width", () => {
    const { container } = render(<NavigationRail items={mockItems} width={120} />);

    const nav = container.querySelector("nav");
    expect(nav).toHaveStyle({ width: "120px" });
  });

  it("applies correct elevation classes", () => {
    const { container, rerender } = render(<NavigationRail items={mockItems} elevation={0} />);

    let nav = container.querySelector("nav");
    expect(nav).not.toHaveClass("shadow");

    rerender(<NavigationRail items={mockItems} elevation={2} />);
    nav = container.querySelector("nav");
    expect(nav).toHaveClass("shadow");
  });

  it("applies custom className", () => {
    const { container } = render(<NavigationRail items={mockItems} className="custom-rail" />);

    expect(container.querySelector("nav")).toHaveClass("custom-rail");
  });

  it("renders custom children", () => {
    render(
      <NavigationRail items={mockItems}>
        <div data-testid="custom-child">Extra Content</div>
      </NavigationRail>,
    );

    expect(screen.getByTestId("custom-child")).toBeInTheDocument();
  });

  it("positions rail on the left side", () => {
    const { container } = render(<NavigationRail items={mockItems} />);

    const nav = container.querySelector("nav");
    expect(nav).toHaveClass("fixed", "left-0", "top-0", "bottom-0");
  });
});
