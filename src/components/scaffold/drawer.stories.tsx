import type { Meta, StoryObj } from '@storybook/react';
import { Drawer } from './drawer';
import { useState } from 'react';
import { Home, Settings, User, Mail, Bell } from 'lucide-react';

const meta = {
  title: 'Components/Drawer',
  component: Drawer,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    side: {
      control: { type: 'select' },
      options: ['left', 'right'],
    },
    elevation: {
      control: { type: 'select' },
      options: [0, 1, 2, 3, 4, 5],
    },
  },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

function DrawerDemo({ side = 'left' }: { side?: 'left' | 'right' }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md m-4"
      >
        Open {side} Drawer
      </button>
      <Drawer open={open} onOpenChange={setOpen} side={side}>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Navigation</h2>
          <nav className="flex flex-col gap-2">
            {[
              { icon: Home, label: 'Home' },
              { icon: User, label: 'Profile' },
              { icon: Mail, label: 'Messages' },
              { icon: Bell, label: 'Notifications' },
              { icon: Settings, label: 'Settings' },
            ].map((item) => (
              <button
                key={item.label}
                className="flex items-center gap-3 px-4 py-3 hover:bg-accent rounded-md transition-colors"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </Drawer>
    </div>
  );
}

export const LeftDrawer: Story = {
  args: {
    children: <div />,
  },
  render: () => <DrawerDemo side="left" />,
};

export const RightDrawer: Story = {
  args: {
    children: <div />,
  },
  render: () => <DrawerDemo side="right" />,
};

export const CustomWidth: Story = {
  args: {
    children: <div />,
  },
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <div>
        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md m-4"
        >
          Open Wide Drawer (400px)
        </button>
        <Drawer open={open} onOpenChange={setOpen} width={400}>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Wide Drawer</h2>
            <p className="text-muted-foreground mb-4">
              This drawer is 400px wide instead of the default 280px.
            </p>
            <div className="space-y-3">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="p-4 border rounded-lg">
                  Item {i + 1}
                </div>
              ))}
            </div>
          </div>
        </Drawer>
      </div>
    );
  },
};

export const WithoutBackdrop: Story = {
  args: {
    children: <div />,
  },
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <div>
        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md m-4"
        >
          Open Drawer (No Backdrop)
        </button>
        <Drawer open={open} onOpenChange={setOpen} showBackdrop={false}>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">No Backdrop</h2>
            <p>This drawer doesn't have a backdrop overlay.</p>
          </div>
        </Drawer>
      </div>
    );
  },
};

export const NoGestures: Story = {
  args: {
    children: <div />,
  },
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <div>
        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md m-4"
        >
          Open Drawer (No Gestures)
        </button>
        <Drawer open={open} onOpenChange={setOpen} gestureEnabled={false}>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">No Swipe Gestures</h2>
            <p>You cannot swipe to close this drawer.</p>
          </div>
        </Drawer>
      </div>
    );
  },
};