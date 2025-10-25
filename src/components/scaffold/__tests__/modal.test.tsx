import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Modal, ModalFooter } from "../modal";

describe("Modal", () => {
  beforeEach(() => {
    // Reset body overflow style before each test
    document.body.style.overflow = "";
  });

  afterEach(() => {
    // Clean up after tests
    document.body.style.overflow = "";
  });

  it("does not render when open is false", () => {
    render(
      <Modal open={false} title="Test Modal">
        Content
      </Modal>,
    );

    expect(screen.queryByText("Test Modal")).not.toBeInTheDocument();
    expect(screen.queryByText("Content")).not.toBeInTheDocument();
  });

  it("renders when open is true", () => {
    render(
      <Modal open={true} title="Test Modal">
        Content
      </Modal>,
    );

    expect(screen.getByText("Test Modal")).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("renders title and description", () => {
    render(
      <Modal open={true} title="Modal Title" description="Modal Description">
        Content
      </Modal>,
    );

    expect(screen.getByText("Modal Title")).toBeInTheDocument();
    expect(screen.getByText("Modal Description")).toBeInTheDocument();
  });

  it("renders close button by default", () => {
    render(
      <Modal open={true} title="Test">
        Content
      </Modal>,
    );

    const closeButton = screen.getByLabelText("Close");
    expect(closeButton).toBeInTheDocument();
  });

  it("hides close button when showClose is false", () => {
    render(
      <Modal open={true} title="Test" showClose={false}>
        Content
      </Modal>,
    );

    expect(screen.queryByLabelText("Close")).not.toBeInTheDocument();
  });

  it("calls onOpenChange when close button is clicked", () => {
    const handleOpenChange = vi.fn();
    render(
      <Modal open={true} title="Test" onOpenChange={handleOpenChange}>
        Content
      </Modal>,
    );

    const closeButton = screen.getByLabelText("Close");
    fireEvent.click(closeButton);

    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });

  it("calls onOpenChange when backdrop is clicked", () => {
    const handleOpenChange = vi.fn();
    const { container } = render(
      <Modal open={true} title="Test" onOpenChange={handleOpenChange}>
        Content
      </Modal>,
    );

    // Click the backdrop (first div with fixed class)
    const backdrop = container.querySelector(".fixed.inset-0.bg-black\\/50");
    fireEvent.click(backdrop!);

    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });

  it("does not close on backdrop click when closeOnBackdropClick is false", () => {
    const handleOpenChange = vi.fn();
    const { container } = render(
      <Modal open={true} title="Test" closeOnBackdropClick={false} onOpenChange={handleOpenChange}>
        Content
      </Modal>,
    );

    const backdrop = container.querySelector(".fixed.inset-0.bg-black\\/50");
    fireEvent.click(backdrop!);

    expect(handleOpenChange).not.toHaveBeenCalled();
  });

  it("closes on Escape key by default", () => {
    const handleOpenChange = vi.fn();
    render(
      <Modal open={true} title="Test" onOpenChange={handleOpenChange}>
        Content
      </Modal>,
    );

    fireEvent.keyDown(document, { key: "Escape" });

    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });

  it("does not close on Escape when closeOnEscape is false", () => {
    const handleOpenChange = vi.fn();
    render(
      <Modal open={true} title="Test" closeOnEscape={false} onOpenChange={handleOpenChange}>
        Content
      </Modal>,
    );

    fireEvent.keyDown(document, { key: "Escape" });

    expect(handleOpenChange).not.toHaveBeenCalled();
  });

  it("locks body scroll when open", () => {
    const { rerender } = render(
      <Modal open={false} title="Test">
        Content
      </Modal>,
    );

    expect(document.body.style.overflow).toBe("");

    rerender(
      <Modal open={true} title="Test">
        Content
      </Modal>,
    );

    expect(document.body.style.overflow).toBe("hidden");
  });

  it("restores body scroll when closed", async () => {
    const { rerender } = render(
      <Modal open={true} title="Test">
        Content
      </Modal>,
    );

    expect(document.body.style.overflow).toBe("hidden");

    rerender(
      <Modal open={false} title="Test">
        Content
      </Modal>,
    );

    await waitFor(() => {
      expect(document.body.style.overflow).toBe("");
    });
  });

  it("applies different sizes", () => {
    const { container, rerender } = render(
      <Modal open={true} size="sm">
        Content
      </Modal>,
    );

    let modal = container.querySelector(".bg-background.rounded-lg");
    expect(modal).toHaveClass("max-w-sm");

    rerender(
      <Modal open={true} size="lg">
        Content
      </Modal>,
    );
    modal = container.querySelector(".bg-background.rounded-lg");
    expect(modal).toHaveClass("max-w-lg");

    rerender(
      <Modal open={true} size="full">
        Content
      </Modal>,
    );
    modal = container.querySelector(".bg-background.rounded-lg");
    expect(modal).toHaveClass("max-w-full");
  });

  it("applies custom className", () => {
    const { container } = render(
      <Modal open={true} className="custom-modal">
        Content
      </Modal>,
    );

    const modal = container.querySelector(".bg-background.rounded-lg");
    expect(modal).toHaveClass("custom-modal");
  });

  it("applies custom backdrop className", () => {
    const { container } = render(
      <Modal open={true} backdropClassName="custom-backdrop">
        Content
      </Modal>,
    );

    const backdrop = container.querySelector(".fixed.inset-0.bg-black\\/50");
    expect(backdrop).toHaveClass("custom-backdrop");
  });

  it("has proper ARIA attributes", () => {
    render(
      <Modal open={true} title="Accessible Modal" description="This is a description">
        Content
      </Modal>,
    );

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-labelledby", "modal-title");
    expect(dialog).toHaveAttribute("aria-describedby", "modal-description");
  });

  it("prevents click propagation from modal content", () => {
    const handleBackdropClick = vi.fn();
    const { container } = render(
      <Modal open={true} onOpenChange={handleBackdropClick}>
        <div data-testid="modal-content">Content</div>
      </Modal>,
    );

    const modalContent = screen.getByTestId("modal-content");
    fireEvent.click(modalContent);

    // Should not trigger backdrop click handler
    expect(handleBackdropClick).not.toHaveBeenCalled();
  });
});

describe("ModalFooter", () => {
  it("renders children", () => {
    render(
      <ModalFooter>
        <button>Cancel</button>
        <button>Confirm</button>
      </ModalFooter>,
    );

    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Confirm")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <ModalFooter className="custom-footer">
        <button>OK</button>
      </ModalFooter>,
    );

    const footer = container.querySelector(".border-t");
    expect(footer).toHaveClass("custom-footer");
  });

  it("has flex layout for action buttons", () => {
    const { container } = render(
      <ModalFooter>
        <button>OK</button>
      </ModalFooter>,
    );

    const footer = container.querySelector(".border-t");
    expect(footer).toHaveClass("flex", "items-center", "justify-end", "gap-2");
  });
});
