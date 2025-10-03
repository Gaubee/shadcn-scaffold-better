import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FloatingActionButton } from '../floating-action-button';
import { Plus, Edit } from 'lucide-react';

describe('FloatingActionButton', () => {
  it('renders basic FAB', () => {
    render(<FloatingActionButton icon={<Plus data-testid="plus-icon" />} />);

    expect(screen.getByTestId('plus-icon')).toBeInTheDocument();
  });

  it('renders as button element with correct type', () => {
    const { container } = render(
      <FloatingActionButton icon={<Plus />} />
    );

    const button = container.querySelector('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('type', 'button');
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(
      <FloatingActionButton
        icon={<Plus data-testid="icon" />}
        onClick={handleClick}
      />
    );

    const button = screen.getByTestId('icon').closest('button');
    fireEvent.click(button!);

    expect(handleClick).toHaveBeenCalled();
  });

  it('applies different sizes', () => {
    const { container, rerender } = render(
      <FloatingActionButton icon={<Plus />} size="small" />
    );

    let button = container.querySelector('button');
    expect(button).toHaveClass('h-10', 'w-10');

    rerender(<FloatingActionButton icon={<Plus />} size="medium" />);
    button = container.querySelector('button');
    expect(button).toHaveClass('h-14', 'w-14');

    rerender(<FloatingActionButton icon={<Plus />} size="large" />);
    button = container.querySelector('button');
    expect(button).toHaveClass('h-16', 'w-16');
  });

  it('renders extended FAB with label', () => {
    render(
      <FloatingActionButton
        icon={<Edit data-testid="edit-icon" />}
        extended
        label="Edit"
      />
    );

    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByTestId('edit-icon')).toBeInTheDocument();
  });

  it('applies different positions', () => {
    const { container, rerender } = render(
      <FloatingActionButton icon={<Plus />} position="bottom-right" />
    );

    let button = container.querySelector('button');
    expect(button).toHaveStyle({ bottom: '16px', right: '16px' });

    rerender(
      <FloatingActionButton icon={<Plus />} position="bottom-left" />
    );
    button = container.querySelector('button');
    expect(button).toHaveStyle({ bottom: '16px', left: '16px' });

    rerender(<FloatingActionButton icon={<Plus />} position="top-right" />);
    button = container.querySelector('button');
    expect(button).toHaveStyle({ top: '16px', right: '16px' });

    rerender(<FloatingActionButton icon={<Plus />} position="top-left" />);
    button = container.querySelector('button');
    expect(button).toHaveStyle({ top: '16px', left: '16px' });
  });

  it('centers position correctly', () => {
    const { container } = render(
      <FloatingActionButton icon={<Plus />} position="bottom-center" />
    );

    const button = container.querySelector('button');
    expect(button).toHaveStyle({
      bottom: '16px',
      left: '50%',
      transform: 'translateX(-50%)',
    });
  });

  it('applies custom offset', () => {
    const { container } = render(
      <FloatingActionButton
        icon={<Plus />}
        position="bottom-right"
        offset={32}
      />
    );

    const button = container.querySelector('button');
    expect(button).toHaveStyle({ bottom: '32px', right: '32px' });
  });

  it('applies different elevation levels', () => {
    const { container, rerender } = render(
      <FloatingActionButton icon={<Plus />} elevation={0} />
    );

    let button = container.querySelector('button');
    expect(button).not.toHaveClass('shadow');

    rerender(<FloatingActionButton icon={<Plus />} elevation={3} />);
    button = container.querySelector('button');
    expect(button).toHaveClass('shadow-md');

    rerender(<FloatingActionButton icon={<Plus />} elevation={5} />);
    button = container.querySelector('button');
    expect(button).toHaveClass('shadow-xl');
  });

  it('handles disabled state', () => {
    const handleClick = vi.fn();
    const { container } = render(
      <FloatingActionButton
        icon={<Plus data-testid="icon" />}
        onClick={handleClick}
        disabled
      />
    );

    const button = screen.getByTestId('icon').closest('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:opacity-50');

    fireEvent.click(button!);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('handles hideOnScroll prop', () => {
    const { container } = render(
      <FloatingActionButton icon={<Plus />} hideOnScroll />
    );

    const button = container.querySelector('button');

    // FAB should be visible initially (before scroll detection kicks in)
    expect(button).toBeVisible();

    // Button should have transition classes for JS fallback
    expect(button).toHaveClass('transition-all');

    // The hideOnScroll behavior is either:
    // 1. CSS-based (fab-hide-on-scroll class added when scroll-timeline is supported)
    // 2. JS-based (scale-0 opacity-0 classes added when isVisible=false)
    // In initial render, it should be visible with transition ready
  });

  it('applies custom className', () => {
    const { container } = render(
      <FloatingActionButton icon={<Plus />} className="custom-fab" />
    );

    expect(container.querySelector('button')).toHaveClass('custom-fab');
  });

  it('renders children content', () => {
    render(
      <FloatingActionButton>
        <span data-testid="child-content">Content</span>
      </FloatingActionButton>
    );

    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });

  it('has fixed positioning', () => {
    const { container } = render(<FloatingActionButton icon={<Plus />} />);

    const button = container.querySelector('button');
    expect(button).toHaveClass('fixed');
  });

  it('has proper z-index for floating above content', () => {
    const { container } = render(<FloatingActionButton icon={<Plus />} />);

    const button = container.querySelector('button');
    expect(button).toHaveClass('z-50');
  });

  it('has rounded full shape', () => {
    const { container } = render(<FloatingActionButton icon={<Plus />} />);

    const button = container.querySelector('button');
    expect(button).toHaveClass('rounded-full');
  });
});
