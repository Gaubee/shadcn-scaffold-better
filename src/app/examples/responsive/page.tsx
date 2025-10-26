"use client";

import {
  AppBar,
  Drawer,
  FloatingActionButton,
  Modal,
  ModalFooter,
  Scaffold,
  Snackbar,
  useSnackbar,
} from "@/components/scaffold";
import { Select } from "@/components/ui/select";
import {
  Activity,
  BarChart3,
  Calendar,
  Download,
  FileText,
  Folder,
  Grid,
  Home,
  Image,
  List,
  Maximize2,
  Menu,
  MessageSquare,
  Monitor,
  Music,
  Plus,
  Search,
  Settings,
  Smartphone,
  Star,
  Tablet,
  TrendingUp,
  User,
  Video,
  Zap,
} from "lucide-react";
import * as React from "react";

export default function ResponsiveExamplePage() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [selectedNav, setSelectedNav] = React.useState("home");
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [favoriteItems, setFavoriteItems] = React.useState<Set<number>>(new Set());
  const [modalOpen, setModalOpen] = React.useState(false);
  const [windowWidth, setWindowWidth] = React.useState(0);
  const [itemsPerPage, setItemsPerPage] = React.useState("6");
  const [sortBy, setSortBy] = React.useState("name");
  const snackbar = useSnackbar();

  React.useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getDeviceType = () => {
    if (windowWidth < 768) return "mobile";
    if (windowWidth < 1024) return "tablet";
    return "desktop";
  };

  const navigationItems = [
    { key: "home", icon: <Home size={24} />, label: "Home" },
    {
      key: "analytics",
      icon: <BarChart3 size={24} />,
      label: "Analytics",
      badge: 2,
    },
    {
      key: "messages",
      icon: <MessageSquare size={24} />,
      label: "Messages",
      badge: 5,
    },
    { key: "calendar", icon: <Calendar size={24} />, label: "Calendar" },
    { key: "profile", icon: <User size={24} />, label: "Profile" },
  ];

  const contentItems = [
    {
      id: 1,
      icon: <FileText className="text-blue-500" />,
      title: "Project Proposal",
      type: "Document",
      size: "2.4 MB",
      modified: "2 hours ago",
      color: "blue",
    },
    {
      id: 2,
      icon: <Image className="text-purple-500" />,
      title: "Design Assets",
      type: "Image",
      size: "15.8 MB",
      modified: "5 hours ago",
      color: "purple",
    },
    {
      id: 3,
      icon: <Video className="text-red-500" />,
      title: "Tutorial Video",
      type: "Video",
      size: "125 MB",
      modified: "1 day ago",
      color: "red",
    },
    {
      id: 4,
      icon: <Music className="text-green-500" />,
      title: "Podcast Episode",
      type: "Audio",
      size: "45 MB",
      modified: "2 days ago",
      color: "green",
    },
    {
      id: 5,
      icon: <Folder className="text-yellow-500" />,
      title: "Resources",
      type: "Folder",
      size: "256 MB",
      modified: "3 days ago",
      color: "yellow",
    },
    {
      id: 6,
      icon: <FileText className="text-cyan-500" />,
      title: "Meeting Notes",
      type: "Document",
      size: "1.2 MB",
      modified: "4 days ago",
      color: "cyan",
    },
  ];

  const toggleFavorite = (id: number) => {
    setFavoriteItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
        snackbar.show("Removed from favorites", { severity: "default" });
      } else {
        newSet.add(id);
        snackbar.show("Added to favorites", { severity: "success" });
      }
      return newSet;
    });
  };

  const deviceType = getDeviceType();

  return (
    <>
      <Scaffold
        responsive
        responsiveBreakpoint={768}
        header={
          <AppBar
            elevation={2}
            leading={
              <button
                onClick={() => setDrawerOpen(true)}
                className="hover:bg-accent text-foreground rounded-full p-2 transition-colors md:hidden"
                aria-label="Open menu">
                <Menu size={24} />
              </button>
            }
            title={
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold">File Manager</h1>
                <span className="bg-primary/10 text-primary hidden rounded-full px-2 py-0.5 text-xs font-medium sm:inline-block">
                  {deviceType}
                </span>
              </div>
            }
            actions={
              <div className="flex items-center gap-1">
                <button
                  onClick={() => snackbar.show("Search coming soon", { severity: "info" })}
                  className="hover:bg-accent text-foreground rounded-full p-2 transition-colors"
                  aria-label="Search">
                  <Search size={20} />
                </button>
                <button
                  onClick={() => setModalOpen(true)}
                  className="hover:bg-accent text-foreground rounded-full p-2 transition-colors"
                  aria-label="Settings">
                  <Settings size={20} />
                </button>
              </div>
            }
          />
        }
        drawer={
          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} gestureEnabled={true} elevation={4}>
            <div className="flex h-full flex-col">
              {/* Drawer Header */}
              <div className="from-primary/10 to-primary/5 border-b bg-gradient-to-br p-6">
                <div className="flex items-center gap-3">
                  <div className="from-primary text-primary-foreground flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br to-purple-600 text-lg font-bold">
                    FM
                  </div>
                  <div>
                    <h3 className="font-semibold">File Manager</h3>
                    <p className="text-muted-foreground text-xs">256 GB available</p>
                  </div>
                </div>
              </div>

              {/* Drawer Navigation */}
              <nav className="flex-1 overflow-y-auto p-4">
                <div className="space-y-1">
                  {navigationItems.map((item) => (
                    <button
                      key={item.key}
                      onClick={() => {
                        setSelectedNav(item.key);
                        setDrawerOpen(false);
                        snackbar.show(`Switched to ${item.label}`, {
                          severity: "default",
                        });
                      }}
                      className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-all ${
                        selectedNav === item.key ? "bg-primary text-primary-foreground shadow-md" : "hover:bg-accent"
                      }`}>
                      {item.icon}
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            selectedNav === item.key
                              ? "bg-primary-foreground/20"
                              : "bg-destructive text-destructive-foreground"
                          }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="mt-6 border-t pt-6">
                  <h4 className="text-muted-foreground mb-2 px-4 text-xs font-semibold uppercase">Storage</h4>
                  <div className="bg-muted/50 rounded-lg px-4 py-3">
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="text-muted-foreground">Used</span>
                      <span className="font-medium">256 GB / 512 GB</span>
                    </div>
                    <div className="bg-background h-2 w-full overflow-hidden rounded-full">
                      <div className="from-primary h-full w-1/2 bg-gradient-to-r to-purple-600" />
                    </div>
                  </div>
                </div>
              </nav>

              {/* Drawer Footer */}
              <div className="space-y-2 border-t p-4">
                <button
                  onClick={() => {
                    setDrawerOpen(false);
                    snackbar.show("Upgrade feature coming soon", {
                      severity: "info",
                    });
                  }}
                  className="bg-primary text-primary-foreground w-full rounded-lg px-4 py-2 text-sm font-medium transition-all hover:brightness-110">
                  Upgrade Storage
                </button>
              </div>
            </div>
          </Drawer>
        }
        navigationItems={navigationItems}
        navigationValue={selectedNav}
        onNavigationChange={(value) => {
          setSelectedNav(value);
          snackbar.show(`Switched to ${navigationItems.find((i) => i.key === value)?.label}`, { severity: "default" });
        }}
        navigationShowLabels
        floatingActionButton={
          <FloatingActionButton
            icon={<Plus size={24} />}
            extended
            label="Upload"
            onClick={() => snackbar.show("Upload dialog opening...", { severity: "info" })}
            elevation={4}
          />
        }>
        <div className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-6xl space-y-8">
            {/* Responsive Info Section */}
            <section>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-3xl font-bold">Adaptive File Manager</h2>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Window:</span>
                  <span className="font-mono font-medium">{windowWidth}px</span>
                </div>
              </div>
              <p className="text-muted-foreground mb-6 text-lg">
                Experience how the layout seamlessly adapts to different screen sizes. Try resizing your browser window
                to see the navigation transform between Drawer and NavigationRail modes.
              </p>

              {/* Device Type Indicators */}
              <div className="grid gap-4 md:grid-cols-3">
                <div
                  className={`rounded-xl border p-6 transition-all ${
                    deviceType === "mobile"
                      ? "scale-105 border-blue-500 bg-blue-50 shadow-lg dark:bg-blue-950"
                      : "hover:shadow-md"
                  }`}>
                  <div className="mb-3 flex items-center gap-3">
                    <Smartphone
                      className={deviceType === "mobile" ? "text-blue-500" : "text-muted-foreground"}
                      size={24}
                    />
                    <h3 className="font-semibold">Mobile</h3>
                    {deviceType === "mobile" && (
                      <span className="ml-auto rounded-full bg-blue-500 px-2 py-0.5 text-xs font-medium text-white">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm">&lt; 768px - Drawer navigation with menu button</p>
                </div>

                <div
                  className={`rounded-xl border p-6 transition-all ${
                    deviceType === "tablet"
                      ? "scale-105 border-purple-500 bg-purple-50 shadow-lg dark:bg-purple-950"
                      : "hover:shadow-md"
                  }`}>
                  <div className="mb-3 flex items-center gap-3">
                    <Tablet
                      className={deviceType === "tablet" ? "text-purple-500" : "text-muted-foreground"}
                      size={24}
                    />
                    <h3 className="font-semibold">Tablet</h3>
                    {deviceType === "tablet" && (
                      <span className="ml-auto rounded-full bg-purple-500 px-2 py-0.5 text-xs font-medium text-white">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm">768px - 1023px - Transitioning layout</p>
                </div>

                <div
                  className={`rounded-xl border p-6 transition-all ${
                    deviceType === "desktop"
                      ? "scale-105 border-green-500 bg-green-50 shadow-lg dark:bg-green-950"
                      : "hover:shadow-md"
                  }`}>
                  <div className="mb-3 flex items-center gap-3">
                    <Monitor
                      className={deviceType === "desktop" ? "text-green-500" : "text-muted-foreground"}
                      size={24}
                    />
                    <h3 className="font-semibold">Desktop</h3>
                    {deviceType === "desktop" && (
                      <span className="ml-auto rounded-full bg-green-500 px-2 py-0.5 text-xs font-medium text-white">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm">≥ 1024px - NavigationRail with persistent sidebar</p>
                </div>
              </div>
            </section>

            {/* View Controls */}
            <section>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-semibold capitalize">{selectedNav} Files</h3>
                  <p className="text-muted-foreground mt-1 text-sm">
                    {contentItems.length} items • Last modified today
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setViewMode("grid");
                      snackbar.show("Switched to grid view", {
                        severity: "default",
                      });
                    }}
                    className={`rounded-lg p-2 transition-all ${
                      viewMode === "grid" ? "bg-primary text-primary-foreground shadow-md" : "bg-muted hover:bg-accent"
                    }`}
                    aria-label="Grid view">
                    <Grid size={20} />
                  </button>
                  <button
                    onClick={() => {
                      setViewMode("list");
                      snackbar.show("Switched to list view", {
                        severity: "default",
                      });
                    }}
                    className={`rounded-lg p-2 transition-all ${
                      viewMode === "list" ? "bg-primary text-primary-foreground shadow-md" : "bg-muted hover:bg-accent"
                    }`}
                    aria-label="List view">
                    <List size={20} />
                  </button>
                </div>
              </div>
            </section>

            {/* Content Grid/List */}
            <section>
              {viewMode === "grid" ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {contentItems.map((item) => (
                    <div
                      key={item.id}
                      className="group cursor-pointer rounded-xl border p-6 transition-all hover:shadow-lg">
                      <div className="mb-4 flex items-start justify-between">
                        <div className={`p-3 bg-${item.color}-500/10 rounded-lg`}>{item.icon}</div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(item.id);
                          }}
                          className="hover:bg-accent rounded-full p-2 opacity-0 transition-colors group-hover:opacity-100"
                          aria-label="Toggle favorite">
                          <Star
                            size={18}
                            fill={favoriteItems.has(item.id) ? "currentColor" : "none"}
                            className={favoriteItems.has(item.id) ? "text-yellow-500" : "text-muted-foreground"}
                          />
                        </button>
                      </div>
                      <h4 className="group-hover:text-primary mb-2 font-semibold transition-colors">{item.title}</h4>
                      <div className="text-muted-foreground flex items-center justify-between text-sm">
                        <span>{item.type}</span>
                        <span>{item.size}</span>
                      </div>
                      <p className="text-muted-foreground mt-2 text-xs">Modified {item.modified}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {contentItems.map((item) => (
                    <div
                      key={item.id}
                      className="group cursor-pointer rounded-lg border p-4 transition-all hover:shadow-md">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 bg-${item.color}-500/10 rounded-lg`}>{item.icon}</div>
                        <div className="min-w-0 flex-1">
                          <h4 className="group-hover:text-primary truncate font-semibold transition-colors">
                            {item.title}
                          </h4>
                          <div className="text-muted-foreground mt-1 flex items-center gap-4 text-sm">
                            <span>{item.type}</span>
                            <span>•</span>
                            <span>{item.size}</span>
                            <span>•</span>
                            <span>{item.modified}</span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(item.id);
                          }}
                          className="hover:bg-accent rounded-full p-2 transition-colors"
                          aria-label="Toggle favorite">
                          <Star
                            size={18}
                            fill={favoriteItems.has(item.id) ? "currentColor" : "none"}
                            className={favoriteItems.has(item.id) ? "text-yellow-500" : "text-muted-foreground"}
                          />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            snackbar.show("Download started", {
                              severity: "success",
                            });
                          }}
                          className="hover:bg-accent rounded-full p-2 transition-colors"
                          aria-label="Download">
                          <Download size={18} className="text-muted-foreground" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Features Section */}
            <section className="space-y-4 border-t pt-8">
              <h3 className="flex items-center gap-2 text-2xl font-semibold">
                <Zap className="text-primary" size={28} />
                Responsive Features
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border p-6 transition-all hover:shadow-lg">
                  <h4 className="mb-2 flex items-center gap-2 text-lg font-semibold">
                    <TrendingUp className="text-blue-500" size={20} />
                    Automatic Switching
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    The Scaffold intelligently switches between Drawer and NavigationRail based on screen size,
                    providing optimal UX for each device type.
                  </p>
                </div>

                <div className="rounded-xl border p-6 transition-all hover:shadow-lg">
                  <h4 className="mb-2 flex items-center gap-2 text-lg font-semibold">
                    <Activity className="text-purple-500" size={20} />
                    Smooth Transitions
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    Content seamlessly adapts with fluid animations when the layout changes, maintaining context and
                    user focus throughout.
                  </p>
                </div>

                <div className="rounded-xl border p-6 transition-all hover:shadow-lg">
                  <h4 className="mb-2 flex items-center gap-2 text-lg font-semibold">
                    <Maximize2 className="text-green-500" size={20} />
                    Consistent Design
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    Navigation items remain consistent across all screen sizes, ensuring users always know where they
                    are and how to navigate.
                  </p>
                </div>

                <div className="rounded-xl border p-6 transition-all hover:shadow-lg">
                  <h4 className="mb-2 flex items-center gap-2 text-lg font-semibold">
                    <Settings className="text-amber-500" size={20} />
                    Customizable Breakpoint
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    Fine-tune the responsive behavior by adjusting the breakpoint to match your application's specific
                    needs (default: 1024px).
                  </p>
                </div>
              </div>
            </section>

            {/* Implementation Example */}
            <section>
              <h3 className="mb-4 text-2xl font-semibold">Implementation Code</h3>
              <p className="text-muted-foreground mb-4">
                Here's how to create a responsive layout with automatic Drawer/NavigationRail switching:
              </p>
              <div className="relative">
                <pre className="bg-muted/50 overflow-x-auto rounded-xl border p-6 text-sm backdrop-blur-sm">
                  <code>{`<Scaffold
  responsive
  responsiveBreakpoint={768}
  drawer={
    <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
      {/* Drawer content */}
    </Drawer>
  }
  navigationRail={
    <NavigationRail
      items={navigationItems}
      value={selectedNav}
      onValueChange={setSelectedNav}
      showLabels
      width={120}
    />
  }
>
  {/* Your content */}
</Scaffold>`}</code>
                </pre>
                <button
                  onClick={() =>
                    snackbar.show("Code copied to clipboard!", {
                      severity: "success",
                    })
                  }
                  className="bg-primary text-primary-foreground absolute top-4 right-4 rounded-lg px-3 py-1.5 text-sm transition-all hover:brightness-110">
                  Copy
                </button>
              </div>
            </section>

            {/* Additional Info */}
            <section className="border-t py-12 text-center">
              <h3 className="mb-6 text-3xl font-bold">Build Adaptive Experiences</h3>
              <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg">
                Create applications that feel native on every device, from mobile phones to desktop workstations, with
                minimal code and maximum flexibility.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={() =>
                    snackbar.show("Documentation opening...", {
                      severity: "info",
                    })
                  }
                  className="bg-primary text-primary-foreground rounded-lg px-6 py-3 shadow-lg transition-all hover:brightness-110">
                  View Documentation
                </button>
                <button
                  onClick={() => (window.location.href = "/examples/basic")}
                  className="hover:bg-accent rounded-lg border px-6 py-3 transition-all">
                  View Basic Example
                </button>
              </div>
            </section>
          </div>
        </div>
      </Scaffold>

      <Snackbar {...snackbar.snackbarProps} />

      {/* Settings Modal */}
      <Modal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title="Display Settings"
        description="Customize how content is displayed"
        size="md">
        <div className="space-y-6">
          <div>
            <label className="text-foreground mb-2 block text-sm font-medium">View Mode</label>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`flex-1 rounded-lg border p-3 transition-all ${
                  viewMode === "grid" ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                }`}>
                <Grid className="mx-auto mb-1" size={20} />
                <span className="text-xs">Grid</span>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`flex-1 rounded-lg border p-3 transition-all ${
                  viewMode === "list" ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                }`}>
                <List className="mx-auto mb-1" size={20} />
                <span className="text-xs">List</span>
              </button>
            </div>
          </div>

          <div>
            <label className="text-foreground mb-2 block text-sm font-medium">Items per Page</label>
            <Select
              value={itemsPerPage}
              onChange={setItemsPerPage}
              options={[
                { value: "6", label: "6 items" },
                { value: "12", label: "12 items" },
                { value: "24", label: "24 items" },
                { value: "48", label: "48 items" },
              ]}
              aria-label="Select items per page"
            />
          </div>

          <div>
            <label className="text-foreground mb-2 block text-sm font-medium">Sort By</label>
            <Select
              value={sortBy}
              onChange={setSortBy}
              options={[
                { value: "name", label: "Name" },
                { value: "date", label: "Date Modified" },
                { value: "size", label: "Size" },
                { value: "type", label: "Type" },
              ]}
              aria-label="Select sort order"
            />
          </div>
        </div>

        <ModalFooter>
          <button
            onClick={() => setModalOpen(false)}
            className="hover:bg-accent text-foreground rounded-lg border px-4 py-2 transition-colors">
            Cancel
          </button>
          <button
            onClick={() => {
              setModalOpen(false);
              snackbar.show("Settings saved!", { severity: "success" });
            }}
            className="bg-primary text-primary-foreground rounded-lg px-4 py-2 transition-all hover:opacity-90">
            Apply
          </button>
        </ModalFooter>
      </Modal>
    </>
  );
}
