import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Snackbar, useSnackbar } from "../snackbar";
import { renderHook, act } from "@testing-library/react";

describe("Snackbar", () => {
  it("renders message when open", () => {
    render(<Snackbar open={true} message="Test message" />);
    expect(screen.getByText("Test message")).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    render(<Snackbar open={false} message="Test message" />);
    expect(screen.queryByText("Test message")).not.toBeInTheDocument();
  });

  it("calls onOpenChange when close button clicked", () => {
    const onOpenChange = vi.fn();
    render(<Snackbar open={true} message="Test" onOpenChange={onOpenChange} />);

    const closeButton = screen.getByLabelText("Close");
    fireEvent.click(closeButton);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("renders action button", () => {
    const onClick = vi.fn();
    render(<Snackbar open={true} message="Test" action={{ label: "UNDO", onClick }} />);

    const actionButton = screen.getByText("UNDO");
    expect(actionButton).toBeInTheDocument();
    fireEvent.click(actionButton);
    expect(onClick).toHaveBeenCalled();
  });

  it("auto hides after duration", async () => {
    const onOpenChange = vi.fn();
    render(<Snackbar open={true} message="Test" autoHideDuration={1000} onOpenChange={onOpenChange} />);

    await waitFor(
      () => {
        expect(onOpenChange).toHaveBeenCalledWith(false);
      },
      { timeout: 1500 },
    );
  });

  it("applies severity styles", () => {
    const { rerender } = render(<Snackbar open={true} message="Test" severity="success" />);
    expect(screen.getByRole("alert")).toHaveClass("bg-green-600");

    rerender(<Snackbar open={true} message="Test" severity="error" />);
    expect(screen.getByRole("alert")).toHaveClass("bg-destructive");
  });

  it("applies position classes", () => {
    render(<Snackbar open={true} message="Test" position="top-center" />);
    expect(screen.getByRole("alert")).toHaveClass("top-4");
  });
});

describe("useSnackbar", () => {
  it("initializes with correct state", () => {
    const { result } = renderHook(() => useSnackbar());

    expect(result.current.open).toBe(false);
    expect(result.current.message).toBe("");
  });

  it("shows snackbar", () => {
    const { result } = renderHook(() => useSnackbar());

    act(() => {
      result.current.show("Test message");
    });

    expect(result.current.open).toBe(true);
    expect(result.current.message).toBe("Test message");
  });

  it("hides snackbar", () => {
    const { result } = renderHook(() => useSnackbar());

    act(() => {
      result.current.show("Test message");
    });

    act(() => {
      result.current.hide();
    });

    expect(result.current.open).toBe(false);
  });

  it("shows with severity", () => {
    const { result } = renderHook(() => useSnackbar());

    act(() => {
      result.current.show("Error occurred", { severity: "error" });
    });

    expect(result.current.severity).toBe("error");
  });
});
