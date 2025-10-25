import type { Meta, StoryObj } from "@storybook/react";
import { Scaffold } from "./scaffold";
import { AppBar } from "./app-bar";
import { Drawer } from "./drawer";
import { BottomNavigationBar } from "./bottom-navigation-bar";
import { NavigationRail } from "./navigation-rail";
import { FloatingActionButton } from "./floating-action-button";
import { useState } from "react";
import { Menu, Home, Search, User, Settings, Plus, Heart, MessageSquare, ShoppingCart } from "lucide-react";

const meta = {
  title: "Components/Scaffold",
  component: Scaffold,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Scaffold>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    children: <div />,
  },
  render: () => (
    <Scaffold
      appBar={
        <AppBar
          title="Basic Scaffold"
          leading={
            <button className="p-2 hover:bg-accent rounded-md">
              <Menu className="w-6 h-6" />
            </button>
          }
        />
      }>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Welcome to Scaffold UI</h1>
        <p className="text-muted-foreground mb-4">This is a basic scaffold with just an AppBar and content.</p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-6 border rounded-lg">
              <h3 className="font-semibold mb-2">Card {i + 1}</h3>
              <p className="text-sm text-muted-foreground">Sample content for card {i + 1}</p>
            </div>
          ))}
        </div>
      </div>
    </Scaffold>
  ),
};

export const WithDrawer: Story = {
  args: {
    children: <div />,
  },
  render: () => {
    const [drawerOpen, setDrawerOpen] = useState(false);

    return (
      <Scaffold
        appBar={
          <AppBar
            title="With Drawer"
            leading={
              <button onClick={() => setDrawerOpen(true)} className="p-2 hover:bg-accent rounded-md">
                <Menu className="w-6 h-6" />
              </button>
            }
          />
        }
        drawer={
          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Navigation</h2>
              <nav className="flex flex-col gap-2">
                {[
                  { icon: Home, label: "Home" },
                  { icon: Search, label: "Search" },
                  { icon: User, label: "Profile" },
                  { icon: Settings, label: "Settings" },
                ].map((item) => (
                  <button key={item.label} className="flex items-center gap-3 px-4 py-3 hover:bg-accent rounded-md">
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </Drawer>
        }>
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">Scaffold with Drawer</h1>
          <p>Click the menu button to open the drawer.</p>
        </div>
      </Scaffold>
    );
  },
};

export const WithBottomNav: Story = {
  args: {
    children: <div />,
  },
  render: () => {
    const [selected, setSelected] = useState("home");

    return (
      <Scaffold
        appBar={<AppBar title="With Bottom Navigation" />}
        bottomNavigationBar={
          <BottomNavigationBar
            value={selected}
            onValueChange={setSelected}
            items={[
              { key: "home", icon: <Home />, label: "Home" },
              { key: "search", icon: <Search />, label: "Search" },
              {
                key: "favorites",
                icon: <Heart />,
                label: "Favorites",
                badge: 3,
              },
              { key: "profile", icon: <User />, label: "Profile" },
            ]}
          />
        }>
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">Bottom Navigation</h1>
          <p>Current tab: {selected}</p>
          <div style={{ height: "150vh", paddingTop: "20px" }}>
            <p>Scroll down to see the bottom navigation stays visible.</p>
          </div>
        </div>
      </Scaffold>
    );
  },
};

export const WithNavigationRail: Story = {
  args: {
    children: <div />,
  },
  render: () => {
    const [selected, setSelected] = useState("home");

    return (
      <Scaffold
        appBar={<AppBar title="With Navigation Rail" />}
        navigationRail={
          <NavigationRail
            value={selected}
            onValueChange={setSelected}
            header={<div className="text-2xl font-bold">🎨</div>}
            items={[
              { key: "home", icon: <Home />, label: "Home" },
              { key: "search", icon: <Search />, label: "Search" },
              {
                key: "messages",
                icon: <MessageSquare />,
                label: "Messages",
                badge: 5,
              },
              { key: "cart", icon: <ShoppingCart />, label: "Cart" },
            ]}
            showLabels={true}
            width={100}
          />
        }>
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">Navigation Rail</h1>
          <p className="mb-4">Current selection: {selected}</p>
          <p className="text-muted-foreground">
            Navigation rail is perfect for desktop layouts, providing persistent navigation.
          </p>
        </div>
      </Scaffold>
    );
  },
};

export const Complete: Story = {
  args: {
    children: <div />,
  },
  render: () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selected, setSelected] = useState("home");

    return (
      <Scaffold
        appBar={
          <AppBar
            title="Complete Scaffold"
            immersive
            leading={
              <button onClick={() => setDrawerOpen(true)} className="p-2 hover:bg-accent rounded-md">
                <Menu className="w-6 h-6" />
              </button>
            }
            actions={
              <button className="p-2 hover:bg-accent rounded-md">
                <Search className="w-5 h-5" />
              </button>
            }
          />
        }
        drawer={
          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Menu</h2>
              <nav className="flex flex-col gap-2">
                <button className="text-left px-4 py-3 hover:bg-accent rounded-md">Option 1</button>
                <button className="text-left px-4 py-3 hover:bg-accent rounded-md">Option 2</button>
              </nav>
            </div>
          </Drawer>
        }
        bottomNavigationBar={
          <BottomNavigationBar
            value={selected}
            onValueChange={setSelected}
            items={[
              { key: "home", icon: <Home />, label: "Home" },
              { key: "search", icon: <Search />, label: "Search" },
              { key: "profile", icon: <User />, label: "Profile" },
            ]}
          />
        }
        floatingActionButton={<FloatingActionButton icon={<Plus />} onClick={() => alert("FAB clicked!")} />}>
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">Complete Example</h1>
          <p className="mb-4">This scaffold includes all components: AppBar, Drawer, Bottom Navigation, and FAB.</p>
          <div style={{ height: "150vh" }}>
            <p>Scroll to see immersive AppBar effect.</p>
            {Array.from({ length: 20 }).map((_, i) => (
              <p key={i} className="my-4">
                Content line {i + 1}
              </p>
            ))}
          </div>
        </div>
      </Scaffold>
    );
  },
};
