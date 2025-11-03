"use client";

import {
  AppBar,
  BottomNavigationBar,
  Drawer,
  FloatingActionButton,
  Modal,
  ModalFooter,
  NavigationRail,
  Scaffold,
  Snackbar,
  useSnackbar,
} from "@/components/scaffold";
import {
  BarChart,
  Bell,
  Calendar,
  FileText,
  Heart,
  Home,
  Mail,
  Menu,
  MessageSquare,
  Plus,
  Search,
  Settings,
  TrendingUp,
  User,
  X,
} from "lucide-react";
import * as React from "react";

/**
 * Advanced Dashboard Example
 *
 * This example demonstrates:
 * - Full Scaffold integration with all components
 * - Responsive layout (Mobile/Tablet/Desktop)
 * - State management for drawer and navigation
 * - Scroll-driven animations on AppBar
 * - Modal and Snackbar interactions
 * - Container queries for responsive content
 */
export default function DashboardExample() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [activeNav, setActiveNav] = React.useState("home");
  const [modalOpen, setModalOpen] = React.useState(false);
  const snackbar = useSnackbar();

  const navigationItems = [
    { key: "home", icon: <Home size={24} />, label: "Home" },
    {
      key: "analytics",
      icon: <TrendingUp size={24} />,
      label: "Analytics",
      badge: 3,
    },
    {
      key: "messages",
      icon: <MessageSquare size={24} />,
      label: "Messages",
      badge: 12,
    },
    { key: "profile", icon: <User size={24} />, label: "Profile" },
  ];

  const handleFabClick = () => {
    setModalOpen(true);
  };

  const handleCreatePost = () => {
    setModalOpen(false);
    snackbar.show("Post created successfully!", { severity: "success" });
  };

  return (
    <>
      <Scaffold
        responsive
        responsiveBreakpoint={1024}
        header={
          <AppBar
            collapsible
            immersive
            expandedHeight={72}
            collapsedHeight={56}
            elevation={2}
            leading={
              <button
                onClick={() => setDrawerOpen(!drawerOpen)}
                className="hover:bg-accent rounded-lg p-2 transition-colors"
                aria-label="Menu">
                <Menu size={24} />
              </button>
            }
            title={<div className="text-xl font-bold">Dashboard</div>}
            actions={
              <>
                <button
                  className="hover:bg-accent relative rounded-lg p-2 transition-colors"
                  aria-label="Notifications">
                  <Bell size={22} />
                  <span className="bg-destructive absolute top-1 right-1 h-2 w-2 rounded-full" />
                </button>
                <button className="hover:bg-accent rounded-lg p-2 transition-colors" aria-label="Search">
                  <Search size={22} />
                </button>
                <button
                  onClick={() => setSettingsOpen(!settingsOpen)}
                  className="hover:bg-accent rounded-lg p-2 transition-colors"
                  aria-label="Settings">
                  <Settings size={22} />
                </button>
              </>
            }
          />
        }
        drawer={
          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} side="left" width={280} gestureEnabled showBackdrop>
            <div className="p-6">
              <div className="mb-8 flex items-center gap-3">
                <div className="bg-primary/20 flex h-12 w-12 items-center justify-center rounded-full">
                  <User size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">John Doe</h3>
                  <p className="text-muted-foreground text-sm">john@example.com</p>
                </div>
              </div>

              <nav className="space-y-2">
                {[
                  { icon: <Home size={20} />, label: "Dashboard", href: "#" },
                  {
                    icon: <BarChart size={20} />,
                    label: "Analytics",
                    href: "#",
                    badge: 3,
                  },
                  {
                    icon: <Calendar size={20} />,
                    label: "Schedule",
                    href: "#",
                  },
                  {
                    icon: <Mail size={20} />,
                    label: "Messages",
                    href: "#",
                    badge: 12,
                  },
                  {
                    icon: <FileText size={20} />,
                    label: "Documents",
                    href: "#",
                  },
                  { icon: <Heart size={20} />, label: "Favorites", href: "#" },
                ].map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="hover:bg-accent flex items-center gap-3 rounded-lg px-4 py-3 transition-colors">
                    {item.icon}
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="bg-primary/20 text-primary rounded-full px-2 py-1 text-xs font-medium">
                        {item.badge}
                      </span>
                    )}
                  </a>
                ))}
              </nav>
            </div>
          </Drawer>
        }
        endDrawer={
          <Drawer
            open={settingsOpen}
            onOpenChange={setSettingsOpen}
            side="right"
            width={320}
            gestureEnabled
            showBackdrop>
            <div className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold">Settings</h2>
                <button
                  onClick={() => setSettingsOpen(false)}
                  className="hover:bg-accent rounded-lg p-2 transition-colors"
                  aria-label="Close settings">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="mb-3 font-medium">Appearance</h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input type="radio" name="theme" value="light" defaultChecked />
                      <span>Light</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="theme" value="dark" />
                      <span>Dark</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="theme" value="system" />
                      <span>System</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 font-medium">Notifications</h3>
                  <div className="space-y-2">
                    <label className="flex items-center justify-between">
                      <span>Email notifications</span>
                      <input type="checkbox" defaultChecked />
                    </label>
                    <label className="flex items-center justify-between">
                      <span>Push notifications</span>
                      <input type="checkbox" defaultChecked />
                    </label>
                    <label className="flex items-center justify-between">
                      <span>SMS notifications</span>
                      <input type="checkbox" />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </Drawer>
        }
        navigationRail={
          <NavigationRail
            items={navigationItems}
            value={activeNav}
            onValueChange={setActiveNav}
            showLabels={false}
            elevation={1}
            width={80}
            header={
              <div className="bg-primary flex h-10 w-10 items-center justify-center rounded-lg">
                <span className="text-primary-foreground font-bold">D</span>
              </div>
            }
            footer={
              <button
                onClick={() => setSettingsOpen(true)}
                className="hover:bg-accent rounded-lg p-2 transition-colors">
                <Settings size={24} />
              </button>
            }
          />
        }
        bottomNavigationBar={
          <BottomNavigationBar
            items={navigationItems}
            value={activeNav}
            onValueChange={setActiveNav}
            showLabels="selected"
            elevation={3}
            hideOnScroll
          />
        }
        floatingActionButton={
          <FloatingActionButton
            icon={<Plus size={24} />}
            position="bottom-right"
            size="large"
            elevation={4}
            hideOnScroll
            onClick={handleFabClick}
            aria-label="Create new post"
          />
        }>
        {/* Main Content with Container Queries */}
        <div className="scaffold-content py-8">
          {/* Hero Section with Scroll Animation */}
          <section className="scroll-fade-in mb-12">
            <h1 className="mb-4 text-4xl font-bold">Welcome back, John! 👋</h1>
            <p className="text-muted-foreground text-xl">Here's what's happening with your projects today.</p>
          </section>

          {/* Stats Grid - Responsive using Container Queries */}
          <div className="scaffold-grid mb-12 grid gap-6">
            {[
              {
                icon: <TrendingUp size={24} />,
                label: "Total Revenue",
                value: "$45,231",
                change: "+20.1%",
              },
              {
                icon: <User size={24} />,
                label: "Active Users",
                value: "2,345",
                change: "+12.5%",
              },
              {
                icon: <MessageSquare size={24} />,
                label: "Messages",
                value: "156",
                change: "+8.3%",
              },
              {
                icon: <BarChart size={24} />,
                label: "Conversions",
                value: "89.2%",
                change: "+4.2%",
              },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="scroll-scale bg-card rounded-lg border p-6 transition-all hover:shadow-lg"
                style={{ animationDelay: `${i * 100}ms` }}>
                <div className="mb-4 flex items-center justify-between">
                  <div className="bg-primary/10 text-primary rounded-lg p-3">{stat.icon}</div>
                  <span className="text-sm font-medium text-green-600">{stat.change}</span>
                </div>
                <h3 className="mb-1 text-2xl font-bold">{stat.value}</h3>
                <p className="text-muted-foreground text-sm">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Activity Section */}
          <section className="scroll-reveal mb-12">
            <h2 className="mb-6 text-2xl font-bold">Recent Activity</h2>
            <div className="space-y-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="bg-card rounded-lg border p-4 transition-all hover:shadow-md">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/20 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full">
                      <User size={20} className="text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">Activity {i + 1}</p>
                      <p className="text-muted-foreground truncate text-sm">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      </p>
                      <p className="text-muted-foreground mt-1 text-xs">{i + 1} hours ago</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </Scaffold>

      {/* Modal for Creating New Post */}
      <Modal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title="Create New Post"
        description="Share your thoughts with your audience"
        size="lg">
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Title</label>
            <input
              type="text"
              placeholder="Enter post title"
              className="focus:ring-primary w-full rounded-lg border px-3 py-2 focus:ring-2 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Content</label>
            <textarea
              placeholder="What's on your mind?"
              rows={6}
              className="focus:ring-primary w-full resize-none rounded-lg border px-3 py-2 focus:ring-2 focus:outline-none"
            />
          </div>
        </div>

        <ModalFooter>
          <button
            onClick={() => setModalOpen(false)}
            className="hover:bg-accent rounded-lg px-4 py-2 text-sm font-medium transition-colors">
            Cancel
          </button>
          <button
            onClick={handleCreatePost}
            className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90">
            Create Post
          </button>
        </ModalFooter>
      </Modal>

      {/* Snackbar */}
      <Snackbar {...snackbar.snackbarProps} position="bottom-center" />
    </>
  );
}
