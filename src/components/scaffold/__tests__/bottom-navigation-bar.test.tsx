import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BottomNavigationBar } from '../bottom-navigation-bar';
import { Home, Search, User, Settings } from 'lucide-react';

describe('BottomNavigationBar', () => {
  const mockItems = [
    { key: 'home', icon: <Home data-testid="home-icon" />, label: 'Home' },
    { key: 'search', icon: <Search data-testid="search-icon" />, label: 'Search' },
    { key: 'profile', icon: <User data-testid="profile-icon" />, label: 'Profile' },
  ];

  it('renders all navigation items', () => {
    render(<BottomNavigationBar items={mockItems} />);

    expect(screen.getByTestId('home-icon')).toBeInTheDocument();
    expect(screen.getByTestId('search-icon')).toBeInTheDocument();
    expect(screen.getByTestId('profile-icon')).toBeInTheDocument();
  });

  it('renders labels by default', () => {
    render(<BottomNavigationBar items={mockItems} />);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('hides labels when showLabels is false', () => {
    render(<BottomNavigationBar items={mockItems} showLabels={false} />);

    expect(screen.queryByText('Home')).not.toBeInTheDocument();
    expect(screen.queryByText('Search')).not.toBeInTheDocument();
    expect(screen.queryByText('Profile')).not.toBeInTheDocument();
  });

  it('shows only selected label when showLabels is "selected"', () => {
    render(
      <BottomNavigationBar
        items={mockItems}
        showLabels="selected"
        value="home"
      />
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.queryByText('Search')).not.toBeInTheDocument();
    expect(screen.queryByText('Profile')).not.toBeInTheDocument();
  });

  it('highlights selected item', () => {
    const { container } = render(
      <BottomNavigationBar items={mockItems} value="search" />
    );

    const homeIcon = screen.getByTestId('home-icon');
    const searchIcon = screen.getByTestId('search-icon');

    // Selected icon should have primary color
    expect(searchIcon.parentElement).toHaveClass('text-primary');
    // Unselected icon should have muted color
    expect(homeIcon.parentElement).toHaveClass('text-muted-foreground');
  });

  it('calls onValueChange when item is clicked', () => {
    const handleChange = vi.fn();
    render(
      <BottomNavigationBar
        items={mockItems}
        value="home"
        onValueChange={handleChange}
      />
    );

    const searchButton = screen.getByTestId('search-icon').closest('button');
    fireEvent.click(searchButton!);

    expect(handleChange).toHaveBeenCalledWith('search');
  });

  it('does not call onValueChange for disabled items', () => {
    const handleChange = vi.fn();
    const itemsWithDisabled = [
      ...mockItems,
      {
        key: 'settings',
        icon: <Settings data-testid="settings-icon" />,
        label: 'Settings',
        disabled: true,
      },
    ];

    render(
      <BottomNavigationBar
        items={itemsWithDisabled}
        value="home"
        onValueChange={handleChange}
      />
    );

    const settingsButton = screen.getByTestId('settings-icon').closest('button');
    expect(settingsButton).toBeDisabled();

    fireEvent.click(settingsButton!);
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('renders badges on items', () => {
    const itemsWithBadges = [
      { ...mockItems[0], badge: 5 },
      { ...mockItems[1], badge: '99+' },
      mockItems[2],
    ];

    render(<BottomNavigationBar items={itemsWithBadges} />);

    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('99+')).toBeInTheDocument();
  });

  it('applies correct elevation classes', () => {
    const { container, rerender } = render(
      <BottomNavigationBar items={mockItems} elevation={0} />
    );

    let nav = container.querySelector('nav');
    expect(nav).not.toHaveClass('shadow');

    rerender(<BottomNavigationBar items={mockItems} elevation={3} />);
    nav = container.querySelector('nav');
    expect(nav).toHaveClass('shadow-md');
  });

  it('handles hideOnScroll prop', () => {
    const { container } = render(
      <BottomNavigationBar items={mockItems} hideOnScroll />
    );

    const nav = container.querySelector('nav');

    // Should have either CSS scroll-timeline class or JS transition class
    const hasScrollClass = nav?.classList.contains('bottom-nav-hide-on-scroll');
    const hasTransitionClass = nav?.classList.contains('transition-transform');

    expect(hasScrollClass || hasTransitionClass).toBe(true);
  });

  it('applies custom className', () => {
    const { container } = render(
      <BottomNavigationBar items={mockItems} className="custom-class" />
    );

    expect(container.querySelector('nav')).toHaveClass('custom-class');
  });

  it('renders custom children', () => {
    render(
      <BottomNavigationBar items={mockItems}>
        <div data-testid="custom-child">Custom Content</div>
      </BottomNavigationBar>
    );

    expect(screen.getByTestId('custom-child')).toBeInTheDocument();
  });
});
