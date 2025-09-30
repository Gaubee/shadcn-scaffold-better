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
    expect(header).toHaveStyle({ height: '80px' });

    // Simulate scroll
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      value: 100,
    });

    window.dispatchEvent(new Event('scroll'));

    await waitFor(() => {
      expect(header).toHaveStyle({ height: '56px' });
    });
  });

  it('handles immersive mode', () => {
    render(<AppBar title="Test" immersive />);

    const backdrop = document.querySelector('[style*="backdrop"]');
    expect(backdrop).toBeInTheDocument();
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