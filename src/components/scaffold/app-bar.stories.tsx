import type { Meta, StoryObj } from '@storybook/react';
import { AppBar } from './app-bar';
import { Menu, Search, MoreVertical, Home } from 'lucide-react';

const meta = {
  title: 'Components/AppBar',
  component: AppBar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    elevation: {
      control: { type: 'select' },
      options: [0, 1, 2, 3, 4, 5],
    },
    position: {
      control: { type: 'select' },
      options: ['fixed', 'sticky', 'static'],
    },
  },
} satisfies Meta<typeof AppBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Application',
  },
};

export const WithLeading: Story = {
  args: {
    title: 'Application',
    leading: (
      <button className="p-2 hover:bg-accent rounded-md">
        <Menu className="w-6 h-6" />
      </button>
    ),
  },
};

export const WithActions: Story = {
  args: {
    title: 'Application',
    leading: (
      <button className="p-2 hover:bg-accent rounded-md">
        <Menu className="w-6 h-6" />
      </button>
    ),
    actions: (
      <>
        <button className="p-2 hover:bg-accent rounded-md">
          <Search className="w-5 h-5" />
        </button>
        <button className="p-2 hover:bg-accent rounded-md">
          <MoreVertical className="w-5 h-5" />
        </button>
      </>
    ),
  },
};

export const Collapsible: Story = {
  args: {
    title: 'Scroll to see collapse effect',
    collapsible: true,
    expandedHeight: 80,
    collapsedHeight: 56,
    leading: (
      <button className="p-2 hover:bg-accent rounded-md">
        <Menu className="w-6 h-6" />
      </button>
    ),
  },
  decorators: [
    (Story) => (
      <div>
        <Story />
        <div style={{ height: '200vh', padding: '20px' }}>
          <h2>Scroll down to see the AppBar collapse</h2>
          <p>The AppBar will shrink from 80px to 56px as you scroll.</p>
        </div>
      </div>
    ),
  ],
};

export const Immersive: Story = {
  args: {
    title: 'Scroll for immersive effect',
    immersive: true,
    position: 'sticky',
    leading: (
      <button className="p-2 hover:bg-accent rounded-md">
        <Home className="w-6 h-6" />
      </button>
    ),
    actions: (
      <button className="p-2 hover:bg-accent rounded-md">
        <Search className="w-5 h-5" />
      </button>
    ),
  },
  decorators: [
    (Story) => (
      <div>
        <Story />
        <div style={{ height: '200vh', padding: '20px' }}>
          <h2>Scroll to see the immersive effect</h2>
          <p>The AppBar will become more opaque and add blur as you scroll.</p>
          <div style={{ marginTop: '40px', lineHeight: '1.8' }}>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            <p>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco.</p>
          </div>
        </div>
      </div>
    ),
  ],
};

export const FixedPosition: Story = {
  args: {
    title: 'Fixed AppBar',
    position: 'fixed',
    elevation: 3,
    leading: (
      <button className="p-2 hover:bg-accent rounded-md">
        <Menu className="w-6 h-6" />
      </button>
    ),
  },
  decorators: [
    (Story) => (
      <div>
        <Story />
        <div style={{ height: '200vh', padding: '80px 20px 20px' }}>
          <h2>Fixed Position AppBar</h2>
          <p>This AppBar stays fixed at the top of the viewport while scrolling.</p>
        </div>
      </div>
    ),
  ],
};

export const NoElevation: Story = {
  args: {
    title: 'No Shadow',
    elevation: 0,
    leading: (
      <button className="p-2 hover:bg-accent rounded-md">
        <Menu className="w-6 h-6" />
      </button>
    ),
  },
};

export const HighElevation: Story = {
  args: {
    title: 'High Elevation',
    elevation: 5,
    leading: (
      <button className="p-2 hover:bg-accent rounded-md">
        <Menu className="w-6 h-6" />
      </button>
    ),
  },
};