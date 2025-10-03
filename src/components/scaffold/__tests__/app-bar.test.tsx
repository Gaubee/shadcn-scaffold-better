import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { AppBar } from '../app-bar';
import { Home, Menu, Settings } from 'lucide-react';

describe('AppBar', () => {
  beforeEach(() => {
    // Mock window.scrollY
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      value: 0,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders basic AppBar', () => {
    render(<AppBar title="Test App" />);
    expect(screen.getByText('Test App')).toBeInTheDocument();
  });

  it('renders with leading icon', () => {
    render(
      <AppBar
        leading={<Menu data-testid="menu-icon" />}
        title="Test App"
      />
    );
    expect(screen.getByTestId('menu-icon')).toBeInTheDocument();
  });

  it('renders with action buttons', () => {
    render(
      <AppBar
        title="Test App"
        actions={
          <>
            <button data-testid="home-button">
              <Home />
            </button>
            <button data-testid="settings-button">
              <Settings />
            </button>
          </>
        }
      />
    );
    expect(screen.getByTestId('home-button')).toBeInTheDocument();
    expect(screen.getByTestId('settings-button')).toBeInTheDocument();
  });

  it('applies correct elevation classes', () => {
    const { container, rerender } = render(
      <AppBar title="Test" elevation={0} />
    );
    expect(container.querySelector('header')).not.toHaveClass('shadow');

    rerender(<AppBar title="Test" elevation={2} />);
    expect(container.querySelector('header')).toHaveClass('shadow');
  });

  it('handles collapsible mode', async () => {
    const { container } = render(
      <AppBar title="Test" collapsible expandedHeight={80} collapsedHeight={56} />
    );

    const header = container.querySelector('header');
    expect(header).toBeDefined();

    // AppBar should either have CSS scroll-timeline classes or JS fallback
    // Depending on browser support detection
    const hasScrollTimelineClass = header?.classList.contains('app-bar-collapsible');
    const hasTransitionClass = header?.classList.contains('transition-all');

    expect(hasScrollTimelineClass || hasTransitionClass).toBe(true);
  });

  it('handles immersive mode', () => {
    const { container } = render(<AppBar title="Test" immersive />);

    const header = container.querySelector('header');
    expect(header).toBeDefined();

    // Check backdrop element exists
    const backdrop = container.querySelector('.absolute.inset-0');
    expect(backdrop).toBeInTheDocument();

    // Backdrop should have either CSS scroll-timeline class or JS fallback transition
    const hasBackdropClass = backdrop?.classList.contains('app-bar-backdrop');
    const hasTransitionClass = backdrop?.classList.contains('transition-all');

    expect(hasBackdropClass || hasTransitionClass).toBe(true);

    // Header should either have CSS scroll-timeline class or JS fallback transition
    const hasImmersiveClass = header?.classList.contains('app-bar-immersive');
    const hasHeaderTransitionClass = header?.classList.contains('transition-all');

    expect(hasImmersiveClass || hasHeaderTransitionClass).toBe(true);
  });

  it('applies custom className', () => {
    const { container } = render(
      <AppBar title="Test" className="custom-class" />
    );
    expect(container.querySelector('header')).toHaveClass('custom-class');
  });

  it('handles different position types', () => {
    const { container, rerender } = render(
      <AppBar title="Test" position="fixed" />
    );
    expect(container.querySelector('header')).toHaveClass('fixed');

    rerender(<AppBar title="Test" position="sticky" />);
    expect(container.querySelector('header')).toHaveClass('sticky');

    rerender(<AppBar title="Test" position="static" />);
    expect(container.querySelector('header')).toHaveClass('relative');
  });
});