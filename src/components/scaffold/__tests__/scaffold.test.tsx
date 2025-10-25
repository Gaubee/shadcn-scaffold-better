import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Scaffold } from "../scaffold";
import { AppBar } from "../app-bar";
import { Drawer } from "../drawer";

describe("Scaffold", () => {
  it("renders children", () => {
    render(
      <Scaffold>
        <div data-testid="content">Main Content</div>
      </Scaffold>,
    );
    expect(screen.getByTestId("content")).toBeInTheDocument();
  });

  it("renders with AppBar", () => {
    render(
      <Scaffold appBar={<AppBar title="Test App" />}>
        <div>Content</div>
      </Scaffold>,
    );
    expect(screen.getByText("Test App")).toBeInTheDocument();
  });

  it("renders with Drawer", () => {
    const { container } = render(
      <Scaffold
        responsive={false}
        drawer={
          <Drawer open={true} showBackdrop={false}>
            Nav
          </Drawer>
        }>
        <div>Content</div>
      </Scaffold>,
    );
    // Drawer should be rendered
    const drawer = container.querySelector("aside");
    expect(drawer).toBeInTheDocument();
    expect(screen.getByText("Nav")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <Scaffold className="custom-scaffold">
        <div>Content</div>
      </Scaffold>,
    );
    expect(container.firstChild).toHaveClass("custom-scaffold");
  });

  it("applies background color", () => {
    const { container } = render(
      <Scaffold backgroundColor="bg-gray-100">
        <div>Content</div>
      </Scaffold>,
    );
    expect(container.firstChild).toHaveClass("bg-gray-100");
  });

  it("renders with CSS Grid layout", () => {
    const { container } = render(
      <Scaffold>
        <div>Content</div>
      </Scaffold>,
    );
    const scaffold = container.firstChild as HTMLElement;
    expect(scaffold.style.display).toBe("grid");
  });
});
