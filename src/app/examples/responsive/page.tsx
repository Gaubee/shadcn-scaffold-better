"use client";

import * as React from "react";
import {
  Scaffold,
  AppBar,
  Drawer,
  FloatingActionButton,
  Snackbar,
  useSnackbar,
  Modal,
  ModalFooter,
} from "@/components/scaffold";
import { Select } from "@/components/ui/select";
import {
  Menu,
  Home,
  Search,
  Bell,
  User,
  Settings,
  Plus,
  Folder,
  BarChart3,
  Calendar,
  MessageSquare,
  Image,
  FileText,
  Video,
  Music,
  Zap,
  TrendingUp,
  Activity,
  Smartphone,
  Monitor,
  Tablet,
  Maximize2,
  Grid,
  List,
  Heart,
  Star,
  Download,
} from "lucide-react";

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
        appBar={
          <AppBar
            elevation={2}
            leading={
              <button
                onClick={() => setDrawerOpen(true)}
                className="p-2 hover:bg-accent rounded-full md:hidden transition-colors text-foreground"
                aria-label="Open menu">
                <Menu size={24} />
              </button>
            }
            title={
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold">File Manager</h1>
                <span className="px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full hidden sm:inline-block">
                  {deviceType}
                </span>
              </div>
            }
            actions={
              <div className="flex items-center gap-1">
                <button
                  onClick={() => snackbar.show("Search coming soon", { severity: "info" })}
                  className="p-2 hover:bg-accent rounded-full transition-colors text-foreground"
                  aria-label="Search">
                  <Search size={20} />
                </button>
                <button
                  onClick={() => setModalOpen(true)}
                  className="p-2 hover:bg-accent rounded-full transition-colors text-foreground"
                  aria-label="Settings">
                  <Settings size={20} />
                </button>
              </div>
            }
          />
        }
        drawer={
          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} gestureEnabled={true} elevation={4}>
            <div className="flex flex-col h-full">
              {/* Drawer Header */}
              <div className="p-6 border-b bg-gradient-to-br from-primary/10 to-primary/5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg">
                    FM
                  </div>
                  <div>
                    <h3 className="font-semibold">File Manager</h3>
                    <p className="text-xs text-muted-foreground">256 GB available</p>
                  </div>
                </div>
              </div>

              {/* Drawer Navigation */}
              <nav className="flex-1 p-4 overflow-y-auto">
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
                      className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${
                        selectedNav === item.key ? "bg-primary text-primary-foreground shadow-md" : "hover:bg-accent"
                      }`}>
                      {item.icon}
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
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

                <div className="mt-6 pt-6 border-t">
                  <h4 className="px-4 text-xs font-semibold text-muted-foreground uppercase mb-2">Storage</h4>
                  <div className="px-4 py-3 rounded-lg bg-muted/50">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Used</span>
                      <span className="font-medium">256 GB / 512 GB</span>
                    </div>
                    <div className="w-full h-2 bg-background rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary to-purple-600 w-1/2" />
                    </div>
                  </div>
                </div>
              </nav>

              {/* Drawer Footer */}
              <div className="p-4 border-t space-y-2">
                <button
                  onClick={() => {
                    setDrawerOpen(false);
                    snackbar.show("Upgrade feature coming soon", {
                      severity: "info",
                    });
                  }}
                  className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:brightness-110 transition-all text-sm font-medium">
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
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Responsive Info Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold">Adaptive File Manager</h2>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Window:</span>
                  <span className="font-mono font-medium">{windowWidth}px</span>
                </div>
              </div>
              <p className="text-lg text-muted-foreground mb-6">
                Experience how the layout seamlessly adapts to different screen sizes. Try resizing your browser window
                to see the navigation transform between Drawer and NavigationRail modes.
              </p>

              {/* Device Type Indicators */}
              <div className="grid gap-4 md:grid-cols-3">
                <div
                  className={`p-6 border rounded-xl transition-all ${
                    deviceType === "mobile"
                      ? "bg-blue-50 dark:bg-blue-950 border-blue-500 shadow-lg scale-105"
                      : "hover:shadow-md"
                  }`}>
                  <div className="flex items-center gap-3 mb-3">
                    <Smartphone
                      className={deviceType === "mobile" ? "text-blue-500" : "text-muted-foreground"}
                      size={24}
                    />
                    <h3 className="font-semibold">Mobile</h3>
                    {deviceType === "mobile" && (
                      <span className="ml-auto px-2 py-0.5 text-xs font-medium bg-blue-500 text-white rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">&lt; 768px - Drawer navigation with menu button</p>
                </div>

                <div
                  className={`p-6 border rounded-xl transition-all ${
                    deviceType === "tablet"
                      ? "bg-purple-50 dark:bg-purple-950 border-purple-500 shadow-lg scale-105"
                      : "hover:shadow-md"
                  }`}>
                  <div className="flex items-center gap-3 mb-3">
                    <Tablet
                      className={deviceType === "tablet" ? "text-purple-500" : "text-muted-foreground"}
                      size={24}
                    />
                    <h3 className="font-semibold">Tablet</h3>
                    {deviceType === "tablet" && (
                      <span className="ml-auto px-2 py-0.5 text-xs font-medium bg-purple-500 text-white rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">768px - 1023px - Transitioning layout</p>
                </div>

                <div
                  className={`p-6 border rounded-xl transition-all ${
                    deviceType === "desktop"
                      ? "bg-green-50 dark:bg-green-950 border-green-500 shadow-lg scale-105"
                      : "hover:shadow-md"
                  }`}>
                  <div className="flex items-center gap-3 mb-3">
                    <Monitor
                      className={deviceType === "desktop" ? "text-green-500" : "text-muted-foreground"}
                      size={24}
                    />
                    <h3 className="font-semibold">Desktop</h3>
                    {deviceType === "desktop" && (
                      <span className="ml-auto px-2 py-0.5 text-xs font-medium bg-green-500 text-white rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">≥ 1024px - NavigationRail with persistent sidebar</p>
                </div>
              </div>
            </section>

            {/* View Controls */}
            <section>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h3 className="text-2xl font-semibold capitalize">{selectedNav} Files</h3>
                  <p className="text-sm text-muted-foreground mt-1">
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
                    className={`p-2 rounded-lg transition-all ${
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
                    className={`p-2 rounded-lg transition-all ${
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
                      className="p-6 border rounded-xl hover:shadow-lg transition-all group cursor-pointer">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 bg-${item.color}-500/10 rounded-lg`}>{item.icon}</div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(item.id);
                          }}
                          className="p-2 hover:bg-accent rounded-full transition-colors opacity-0 group-hover:opacity-100"
                          aria-label="Toggle favorite">
                          <Star
                            size={18}
                            fill={favoriteItems.has(item.id) ? "currentColor" : "none"}
                            className={favoriteItems.has(item.id) ? "text-yellow-500" : "text-muted-foreground"}
                          />
                        </button>
                      </div>
                      <h4 className="font-semibold mb-2 group-hover:text-primary transition-colors">{item.title}</h4>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{item.type}</span>
                        <span>{item.size}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">Modified {item.modified}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {contentItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 border rounded-lg hover:shadow-md transition-all group cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 bg-${item.color}-500/10 rounded-lg`}>{item.icon}</div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold truncate group-hover:text-primary transition-colors">
                            {item.title}
                          </h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
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
                          className="p-2 hover:bg-accent rounded-full transition-colors"
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
                          className="p-2 hover:bg-accent rounded-full transition-colors"
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
            <section className="space-y-4 pt-8 border-t">
              <h3 className="text-2xl font-semibold flex items-center gap-2">
                <Zap className="text-primary" size={28} />
                Responsive Features
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-6 border rounded-xl hover:shadow-lg transition-all">
                  <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                    <TrendingUp className="text-blue-500" size={20} />
                    Automatic Switching
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    The Scaffold intelligently switches between Drawer and NavigationRail based on screen size,
                    providing optimal UX for each device type.
                  </p>
                </div>

                <div className="p-6 border rounded-xl hover:shadow-lg transition-all">
                  <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                    <Activity className="text-purple-500" size={20} />
                    Smooth Transitions
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Content seamlessly adapts with fluid animations when the layout changes, maintaining context and
                    user focus throughout.
                  </p>
                </div>

                <div className="p-6 border rounded-xl hover:shadow-lg transition-all">
                  <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                    <Maximize2 className="text-green-500" size={20} />
                    Consistent Design
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Navigation items remain consistent across all screen sizes, ensuring users always know where they
                    are and how to navigate.
                  </p>
                </div>

                <div className="p-6 border rounded-xl hover:shadow-lg transition-all">
                  <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                    <Settings className="text-amber-500" size={20} />
                    Customizable Breakpoint
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Fine-tune the responsive behavior by adjusting the breakpoint to match your application's specific
                    needs (default: 1024px).
                  </p>
                </div>
              </div>
            </section>

            {/* Implementation Example */}
            <section>
              <h3 className="text-2xl font-semibold mb-4">Implementation Code</h3>
              <p className="text-muted-foreground mb-4">
                Here's how to create a responsive layout with automatic Drawer/NavigationRail switching:
              </p>
              <div className="relative">
                <pre className="bg-muted/50 backdrop-blur-sm p-6 rounded-xl overflow-x-auto border text-sm">
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
                  className="absolute top-4 right-4 px-3 py-1.5 bg-primary text-primary-foreground text-sm rounded-lg hover:brightness-110 transition-all">
                  Copy
                </button>
              </div>
            </section>

            {/* Additional Info */}
            <section className="py-12 text-center border-t">
              <h3 className="text-3xl font-bold mb-6">Build Adaptive Experiences</h3>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Create applications that feel native on every device, from mobile phones to desktop workstations, with
                minimal code and maximum flexibility.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  onClick={() =>
                    snackbar.show("Documentation opening...", {
                      severity: "info",
                    })
                  }
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:brightness-110 transition-all shadow-lg">
                  View Documentation
                </button>
                <button
                  onClick={() => (window.location.href = "/examples/basic")}
                  className="px-6 py-3 border rounded-lg hover:bg-accent transition-all">
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
            <label className="text-sm font-medium mb-2 block text-foreground">View Mode</label>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`flex-1 p-3 border rounded-lg transition-all ${
                  viewMode === "grid" ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                }`}>
                <Grid className="mx-auto mb-1" size={20} />
                <span className="text-xs">Grid</span>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`flex-1 p-3 border rounded-lg transition-all ${
                  viewMode === "list" ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                }`}>
                <List className="mx-auto mb-1" size={20} />
                <span className="text-xs">List</span>
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block text-foreground">Items per Page</label>
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
            <label className="text-sm font-medium mb-2 block text-foreground">Sort By</label>
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
            className="px-4 py-2 border rounded-lg hover:bg-accent transition-colors text-foreground">
            Cancel
          </button>
          <button
            onClick={() => {
              setModalOpen(false);
              snackbar.show("Settings saved!", { severity: "success" });
            }}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all">
            Apply
          </button>
        </ModalFooter>
      </Modal>
    </>
  );
}
