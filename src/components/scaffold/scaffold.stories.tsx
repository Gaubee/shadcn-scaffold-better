import type { Meta, StoryObj } from "@storybook/react";
import { Heart, Home, Menu, MessageSquare, Plus, Search, Settings, ShoppingCart, User } from "lucide-react";
import { useState } from "react";
import { AppBar } from "./app-bar";
import { BottomNavigationBar } from "./bottom-navigation-bar";
import { Drawer } from "./drawer";
import { FloatingActionButton } from "./floating-action-button";
import { NavigationRail } from "./navigation-rail";
import { Scaffold } from "./scaffold";

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
    list: <div />,
  },
  render: () => (
    <Scaffold
      header={
        <AppBar
          title="Basic Scaffold"
          leading={
            <button className="hover:bg-accent rounded-md p-2">
              <Menu className="h-6 w-6" />
            </button>
          }
        />
      }>
      <div className="p-6">
        <h1 className="mb-4 text-3xl font-bold">Welcome to Scaffold UI</h1>
        <p className="text-muted-foreground mb-4">This is a basic scaffold with just an AppBar and content.</p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-lg border p-6">
              <h3 className="mb-2 font-semibold">Card {i + 1}</h3>
              <p className="text-muted-foreground text-sm">Sample content for card {i + 1}</p>
            </div>
          ))}
        </div>
      </div>
    </Scaffold>
  ),
};

export const WithDrawer: Story = {
  args: {
    list: <div />,
  },
  render: () => {
    const [drawerOpen, setDrawerOpen] = useState(false);

    return (
      <Scaffold
        header={
          <AppBar
            title="With Drawer"
            leading={
              <button onClick={() => setDrawerOpen(true)} className="hover:bg-accent rounded-md p-2">
                <Menu className="h-6 w-6" />
              </button>
            }
          />
        }
        drawer={
          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
            <div className="p-6">
              <h2 className="mb-4 text-xl font-bold">Navigation</h2>
              <nav className="flex flex-col gap-2">
                {[
                  { icon: Home, label: "Home" },
                  { icon: Search, label: "Search" },
                  { icon: User, label: "Profile" },
                  { icon: Settings, label: "Settings" },
                ].map((item) => (
                  <button key={item.label} className="hover:bg-accent flex items-center gap-3 rounded-md px-4 py-3">
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </Drawer>
        }>
        <div className="p-6">
          <h1 className="mb-4 text-3xl font-bold">Scaffold with Drawer</h1>
          <p>Click the menu button to open the drawer.</p>
        </div>
      </Scaffold>
    );
  },
};

export const WithBottomNav: Story = {
  args: {
    list: <div />,
  },
  render: () => {
    const [selected, setSelected] = useState("home");

    return (
      <Scaffold
        header={<AppBar title="With Bottom Navigation" />}
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
          <h1 className="mb-4 text-3xl font-bold">Bottom Navigation</h1>
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
    list: <div />,
  },
  render: () => {
    const [selected, setSelected] = useState("home");

    return (
      <Scaffold
        header={<AppBar title="With Navigation Rail" />}
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
          <h1 className="mb-4 text-3xl font-bold">Navigation Rail</h1>
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
    list: <div />,
  },
  render: () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selected, setSelected] = useState("home");

    return (
      <Scaffold
        header={
          <AppBar
            title="Complete Scaffold"
            immersive
            leading={
              <button onClick={() => setDrawerOpen(true)} className="hover:bg-accent rounded-md p-2">
                <Menu className="h-6 w-6" />
              </button>
            }
            actions={
              <button className="hover:bg-accent rounded-md p-2">
                <Search className="h-5 w-5" />
              </button>
            }
          />
        }
        drawer={
          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
            <div className="p-6">
              <h2 className="mb-4 text-xl font-bold">Menu</h2>
              <nav className="flex flex-col gap-2">
                <button className="hover:bg-accent rounded-md px-4 py-3 text-left">Option 1</button>
                <button className="hover:bg-accent rounded-md px-4 py-3 text-left">Option 2</button>
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
          <h1 className="mb-4 text-3xl font-bold">Complete Example</h1>
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
