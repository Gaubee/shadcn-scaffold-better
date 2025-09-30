import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Drawer } from '../drawer';
import { useState } from 'react';

function TestDrawer({ side = 'left' }: { side?: 'left' | 'right' }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>Open Drawer</button>
      <Drawer open={open} onOpenChange={setOpen} side={side}>
        <div data-testid="drawer-content">Drawer Content</div>
      </Drawer>
    </>
  );
}

describe('Drawer', () => {
  it('renders drawer when open', () => {
    render(<Drawer open={true}>Drawer Content</Drawer>);
    expect(screen.getByText('Drawer Content')).toBeInTheDocument();
  });

  it('does not render drawer when closed', () => {
    const { container } = render(<Drawer open={false}>Drawer Content</Drawer>);
    const drawer = container.querySelector('aside');
    expect(drawer).toHaveStyle({ transform: 'translateX(-100%)' });
  });

  it('handles open state change', () => {
    render(<TestDrawer />);

    const openButton = screen.getByText('Open Drawer');
    fireEvent.click(openButton);

    expect(screen.getByTestId('drawer-content')).toBeInTheDocument();
  });

  it('shows backdrop when showBackdrop is true', () => {
    const { container } = render(
      <Drawer open={true} showBackdrop={true}>
        Content
      </Drawer>
    );

    const backdrop = container.querySelector('[aria-hidden="true"]');
    expect(backdrop).toBeInTheDocument();
    expect(backdrop).toHaveClass('bg-black');
  });

  it('closes on backdrop click', () => {
    const onOpenChange = vi.fn();
    const { container } = render(
      <Drawer
        open={true}
        onOpenChange={onOpenChange}
        showBackdrop={true}
        closeOnBackdropClick={true}
      >
        Content
      </Drawer>
    );

    const backdrop = container.querySelector('[aria-hidden="true"]');
    if (backdrop) {
      fireEvent.click(backdrop);
      expect(onOpenChange).toHaveBeenCalledWith(false);
    }
  });

  it('applies correct side positioning', () => {
    const { container, rerender } = render(
      <Drawer open={true} side="left">
        Content
      </Drawer>
    );

    let drawer = container.querySelector('aside');
    expect(drawer).toHaveClass('left-0');

    rerender(
      <Drawer open={true} side="right">
        Content
      </Drawer>
    );

    drawer = container.querySelector('aside');
    expect(drawer).toHaveClass('right-0');
  });

  it('applies custom width', () => {
    const { container } = render(
      <Drawer open={true} width={320}>
        Content
      </Drawer>
    );

    const drawer = container.querySelector('aside');
    expect(drawer).toHaveStyle({ width: '320px' });
  });

  it('handles elevation prop', () => {
    const { container } = render(
      <Drawer open={true} elevation={3}>
        Content
      </Drawer>
    );

    const drawer = container.querySelector('aside');
    expect(drawer).toHaveClass('shadow-md');
  });

  it('closes on Escape key', () => {
    const onOpenChange = vi.fn();
    render(
      <Drawer open={true} onOpenChange={onOpenChange}>
        Content
      </Drawer>
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('locks body scroll when open', () => {
    const { rerender } = render(
      <Drawer open={false}>Content</Drawer>
    );

    expect(document.body.style.overflow).toBe('');

    rerender(<Drawer open={true}>Content</Drawer>);
    expect(document.body.style.overflow).toBe('hidden');
  });
});