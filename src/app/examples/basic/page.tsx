"use client";

import * as React from "react";
import {
  Scaffold,
  AppBar,
  Drawer,
  BottomNavigationBar,
  FloatingActionButton,
  Snackbar,
  useSnackbar,
  Modal,
  ModalFooter,
} from "@/components/scaffold";
import { useTheme } from "@/components/theme-provider";
import { Select } from "@/components/ui/select";
import {
  Menu,
  Home,
  Search,
  Bell,
  User,
  Plus,
  Settings,
  Heart,
  MessageSquare,
  Share2,
  MoreVertical,
  Edit,
  Trash2,
  Archive,
  Star,
  Bookmark,
  Download,
  Upload,
  Filter,
  TrendingUp,
  Activity,
  ShoppingCart,
} from "lucide-react";

export default function BasicExamplePage() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = React.useState(false);
  const [selectedTab, setSelectedTab] = React.useState("home");
  const [likedPosts, setLikedPosts] = React.useState<Set<number>>(new Set());
  const [bookmarkedPosts, setBookmarkedPosts] = React.useState<Set<number>>(new Set());
  const snackbar = useSnackbar();
  const { theme, setTheme } = useTheme();

  const navigationItems = [
    { key: "home", icon: <Home size={24} />, label: "Home" },
    { key: "search", icon: <Search size={24} />, label: "Search" },
    {
      key: "notifications",
      icon: <Bell size={24} />,
      label: "Notifications",
      badge: 3,
    },
    { key: "profile", icon: <User size={24} />, label: "Profile" },
  ];

  const drawerMenuItems = [
    { icon: <Home size={20} />, label: "Home", badge: null },
    { icon: <Activity size={20} />, label: "Activity", badge: "2" },
    { icon: <Star size={20} />, label: "Favorites", badge: null },
    { icon: <Archive size={20} />, label: "Archive", badge: null },
    { icon: <Settings size={20} />, label: "Settings", badge: null },
    { icon: <Bell size={20} />, label: "Notifications", badge: "5" },
  ];

  const toggleLike = (postId: number) => {
    setLikedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
        snackbar.show("Removed from likes", { severity: "default" });
      } else {
        newSet.add(postId);
        snackbar.show("Added to likes", { severity: "success" });
      }
      return newSet;
    });
  };

  const toggleBookmark = (postId: number) => {
    setBookmarkedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
        snackbar.show("Bookmark removed", { severity: "default" });
      } else {
        newSet.add(postId);
        snackbar.show("Bookmarked!", { severity: "info" });
      }
      return newSet;
    });
  };

  const handleShare = () => {
    snackbar.show("Share options coming soon", { severity: "info" });
  };

  const samplePosts = [
    {
      id: 1,
      title: "Getting Started with Scaffold UI",
      content:
        "Learn how to build beautiful, responsive applications using Scaffold UI components inspired by Flutter.",
      author: "Sarah Chen",
      time: "2 hours ago",
      likes: 42,
      comments: 12,
    },
    {
      id: 2,
      title: "Understanding AppBar Variants",
      content:
        "Explore different AppBar configurations including collapsible, immersive, and sticky variants with scroll effects.",
      author: "Mike Johnson",
      time: "5 hours ago",
      likes: 28,
      comments: 7,
    },
    {
      id: 3,
      title: "Responsive Design Patterns",
      content:
        "Master responsive layouts by automatically switching between Drawer and NavigationRail based on screen size.",
      author: "Emily Rodriguez",
      time: "1 day ago",
      likes: 65,
      comments: 19,
    },
  ];

  return (
    <>
      <Scaffold
        appBar={
          <AppBar
            elevation={2}
            leading={
              <button
                onClick={() => setDrawerOpen(true)}
                className="p-2 hover:bg-accent rounded-full transition-colors text-foreground"
                aria-label="Open menu">
                <Menu size={24} />
              </button>
            }
            title={
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold">Scaffold UI</h1>
                <span className="px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">Demo</span>
              </div>
            }
            actions={
              <div className="flex items-center gap-1">
                <button
                  onClick={() =>
                    snackbar.show("Search feature coming soon", {
                      severity: "info",
                    })
                  }
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
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg">
                    JD
                  </div>
                  <div>
                    <h3 className="font-semibold">John Doe</h3>
                    <p className="text-sm text-muted-foreground">john@example.com</p>
                  </div>
                </div>
              </div>

              {/* Drawer Menu */}
              <nav className="flex-1 p-4">
                <div className="space-y-1">
                  {drawerMenuItems.map((item) => (
                    <button
                      key={item.label}
                      className="w-full text-left px-4 py-3 rounded-lg hover:bg-accent transition-colors flex items-center gap-3 group"
                      onClick={() => {
                        snackbar.show(`Navigated to ${item.label}`);
                        setDrawerOpen(false);
                      }}>
                      <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                        {item.icon}
                      </span>
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-destructive text-destructive-foreground rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t">
                  <h4 className="px-4 text-xs font-semibold text-muted-foreground uppercase mb-2">Quick Actions</h4>
                  <div className="space-y-1">
                    <button
                      className="w-full text-left px-4 py-3 rounded-lg hover:bg-accent transition-colors flex items-center gap-3"
                      onClick={() => {
                        snackbar.show("Downloaded successfully", {
                          severity: "success",
                        });
                        setDrawerOpen(false);
                      }}>
                      <Download size={20} className="text-muted-foreground" />
                      <span>Download Data</span>
                    </button>
                    <button
                      className="w-full text-left px-4 py-3 rounded-lg hover:bg-accent transition-colors flex items-center gap-3"
                      onClick={() => {
                        setDrawerOpen(false);
                        setTimeout(() => setConfirmModalOpen(true), 300);
                      }}>
                      <Upload size={20} className="text-muted-foreground" />
                      <span>Upload Content</span>
                    </button>
                  </div>
                </div>
              </nav>

              {/* Drawer Footer */}
              <div className="p-4 border-t">
                <button
                  className="w-full px-4 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                  onClick={() => {
                    setDrawerOpen(false);
                    snackbar.show("Logged out", { severity: "info" });
                  }}>
                  Sign Out
                </button>
              </div>
            </div>
          </Drawer>
        }
        bottomNavigationBar={
          <BottomNavigationBar
            items={navigationItems}
            value={selectedTab}
            onValueChange={(value) => {
              setSelectedTab(value);
              snackbar.show(`Switched to ${value}`, { severity: "default" });
            }}
            elevation={3}
            showLabels={true}
          />
        }
        floatingActionButton={
          <FloatingActionButton
            icon={<Plus size={24} />}
            onClick={() => snackbar.show("Create new post", { severity: "info" })}
            elevation={4}
            aria-label="Create new post"
          />
        }>
        <div className="container mx-auto px-4 py-8 pb-24">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Hero Section */}
            <section className="text-center py-8">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Welcome to Scaffold UI
              </h2>
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                A comprehensive component library inspired by Flutter's Scaffold widget, bringing Material Design
                patterns to React with powerful features and seamless interactions.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  onClick={() =>
                    snackbar.show("Opening documentation...", {
                      severity: "info",
                    })
                  }
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all shadow-md hover:shadow-lg">
                  View Documentation
                </button>
                <button
                  onClick={() => window.open("https://github.com", "_blank")}
                  className="px-6 py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-primary-foreground transition-all">
                  View on GitHub
                </button>
              </div>
            </section>

            {/* Stats Section */}
            <section className="grid gap-4 md:grid-cols-3">
              <div className="p-6 border-2 border-blue-200 dark:border-blue-800 rounded-lg bg-gradient-to-br from-blue-50/80 to-white dark:from-blue-950 dark:to-blue-900/50">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="text-blue-600 dark:text-blue-400" size={24} />
                  <h4 className="font-semibold text-foreground">Growing Fast</h4>
                </div>
                <p className="text-2xl font-bold mb-1 text-foreground">10K+</p>
                <p className="text-sm text-muted-foreground">Active Users</p>
              </div>
              <div className="p-6 border-2 border-purple-200 dark:border-purple-800 rounded-lg bg-gradient-to-br from-purple-50/80 to-white dark:from-purple-950 dark:to-purple-900/50">
                <div className="flex items-center gap-3 mb-2">
                  <Star className="text-purple-600 dark:text-purple-400" size={24} />
                  <h4 className="font-semibold text-foreground">High Quality</h4>
                </div>
                <p className="text-2xl font-bold mb-1 text-foreground">4.9/5</p>
                <p className="text-sm text-muted-foreground">User Rating</p>
              </div>
              <div className="p-6 border-2 border-green-200 dark:border-green-800 rounded-lg bg-gradient-to-br from-green-50/80 to-white dark:from-green-950 dark:to-green-900/50">
                <div className="flex items-center gap-3 mb-2">
                  <Activity className="text-green-600 dark:text-green-400" size={24} />
                  <h4 className="font-semibold text-foreground">Actively Maintained</h4>
                </div>
                <p className="text-2xl font-bold mb-1 text-foreground">Weekly</p>
                <p className="text-sm text-muted-foreground">Updates</p>
              </div>
            </section>

            {/* Features Grid */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold">Core Components</h3>
                <button
                  onClick={() =>
                    snackbar.show("Filter options coming soon", {
                      severity: "info",
                    })
                  }
                  className="flex items-center gap-2 px-3 py-1.5 text-sm border rounded-lg hover:bg-accent transition-colors">
                  <Filter size={16} />
                  Filter
                </button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-6 border rounded-lg hover:shadow-lg hover:bg-accent/50 hover:border-primary/50 transition-all cursor-pointer group">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-lg text-foreground transition-colors">AppBar</h4>
                    <div className="p-2 bg-primary/15 dark:bg-primary/30 rounded-lg group-hover:bg-primary/25 dark:group-hover:bg-primary/40 transition-colors">
                      <Menu size={20} className="text-primary" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground group-hover:text-foreground/90 mb-3 transition-colors">
                    Fixed header with leading, title, and action areas. Supports collapsible and immersive modes with
                    scroll-driven animations.
                  </p>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 text-xs bg-primary/15 text-primary dark:bg-primary/30 dark:text-primary-foreground rounded font-semibold">
                      Collapsible
                    </span>
                    <span className="px-2 py-1 text-xs bg-primary/15 text-primary dark:bg-primary/30 dark:text-primary-foreground rounded font-semibold">
                      Immersive
                    </span>
                  </div>
                </div>

                <div className="p-6 border rounded-lg hover:shadow-lg hover:bg-accent/50 hover:border-purple-500/50 transition-all cursor-pointer group">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-lg text-foreground transition-colors">Drawer</h4>
                    <div className="p-2 bg-purple-100 dark:bg-purple-500/30 rounded-lg group-hover:bg-purple-200 dark:group-hover:bg-purple-500/40 transition-colors">
                      <Menu size={20} className="text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground group-hover:text-foreground/90 mb-3 transition-colors">
                    Side navigation with gesture support for swipe-to-close. Includes backdrop overlay and keyboard
                    accessibility.
                  </p>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 dark:bg-purple-500/30 dark:text-purple-300 rounded font-semibold">
                      Gestures
                    </span>
                    <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 dark:bg-purple-500/30 dark:text-purple-300 rounded font-semibold">
                      Accessible
                    </span>
                  </div>
                </div>

                <div className="p-6 border rounded-lg hover:shadow-lg hover:bg-accent/50 hover:border-blue-500/50 transition-all cursor-pointer group">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-lg text-foreground transition-colors">Bottom Navigation</h4>
                    <div className="p-2 bg-blue-100 dark:bg-blue-500/30 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-500/40 transition-colors">
                      <Home size={20} className="text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground group-hover:text-foreground/90 mb-3 transition-colors">
                    Mobile-friendly bottom navigation bar with badges, labels, and smooth transitions. Supports
                    hide-on-scroll.
                  </p>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 dark:bg-blue-500/30 dark:text-blue-300 rounded font-semibold">
                      Mobile
                    </span>
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 dark:bg-blue-500/30 dark:text-blue-300 rounded font-semibold">
                      Badges
                    </span>
                  </div>
                </div>

                <div className="p-6 border rounded-lg hover:shadow-lg hover:bg-accent/50 hover:border-green-500/50 transition-all cursor-pointer group">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-lg text-foreground transition-colors">FAB</h4>
                    <div className="p-2 bg-green-100 dark:bg-green-500/30 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-500/40 transition-colors">
                      <Plus size={20} className="text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground group-hover:text-foreground/90 mb-3 transition-colors">
                    Floating action button for primary actions. Available in multiple sizes with extended variant for
                    labels.
                  </p>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-700 dark:bg-green-500/30 dark:text-green-300 rounded font-semibold">
                      Extended
                    </span>
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-700 dark:bg-green-500/30 dark:text-green-300 rounded font-semibold">
                      Customizable
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Interactive Snackbar Demo */}
            <section className="space-y-4">
              <h3 className="text-2xl font-semibold">Interactive Snackbar</h3>
              <div className="p-6 border rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground mb-4">
                  Try different snackbar variants to see toast notifications in action:
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() =>
                      snackbar.show("This is a default message", {
                        severity: "default",
                      })
                    }
                    className="px-4 py-2 bg-foreground text-background rounded-lg hover:opacity-90 transition-all text-sm">
                    Default
                  </button>
                  <button
                    onClick={() =>
                      snackbar.show("Operation completed successfully!", {
                        severity: "success",
                      })
                    }
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all text-sm">
                    Success
                  </button>
                  <button
                    onClick={() =>
                      snackbar.show("Please review your input", {
                        severity: "warning",
                      })
                    }
                    className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all text-sm">
                    Warning
                  </button>
                  <button
                    onClick={() => snackbar.show("An error occurred", { severity: "error" })}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-sm">
                    Error
                  </button>
                  <button
                    onClick={() => snackbar.show("Did you know?", { severity: "info" })}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm">
                    Info
                  </button>
                  <button
                    onClick={() =>
                      snackbar.show("File deleted", {
                        severity: "default",
                        action: {
                          label: "Undo",
                          onClick: () =>
                            snackbar.show("Action undone", {
                              severity: "success",
                            }),
                        },
                      })
                    }
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all text-sm">
                    With Action
                  </button>
                </div>
              </div>
            </section>

            {/* Sample Posts Feed */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold">Recent Posts</h3>
                <button
                  onClick={() => snackbar.show("View all posts", { severity: "info" })}
                  className="text-sm text-primary hover:underline">
                  View All
                </button>
              </div>

              {samplePosts.map((post) => (
                <article
                  key={post.id}
                  className="p-6 border rounded-lg hover:shadow-lg hover:bg-accent/30 hover:border-primary/30 transition-all group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center text-primary-foreground font-bold">
                        {post.author[0]}
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{post.author}</h4>
                        <p className="text-xs text-muted-foreground">{post.time}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => snackbar.show("More options", { severity: "info" })}
                      className="p-2 hover:bg-accent rounded-full transition-colors text-foreground">
                      <MoreVertical size={18} />
                    </button>
                  </div>

                  <h3 className="text-lg font-semibold mb-2 text-foreground">{post.title}</h3>
                  <p className="text-muted-foreground group-hover:text-foreground/80 mb-4 transition-colors">
                    {post.content}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => toggleLike(post.id)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
                          likedPosts.has(post.id)
                            ? "bg-red-500/15 dark:bg-red-500/25 text-red-600 dark:text-red-400"
                            : "hover:bg-accent text-muted-foreground hover:text-foreground"
                        }`}>
                        <Heart size={18} fill={likedPosts.has(post.id) ? "currentColor" : "none"} />
                        <span className="text-sm font-medium">{post.likes + (likedPosts.has(post.id) ? 1 : 0)}</span>
                      </button>
                      <button
                        onClick={() => snackbar.show("View comments", { severity: "info" })}
                        className="flex items-center gap-2 px-3 py-1.5 hover:bg-accent rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                        <MessageSquare size={18} />
                        <span className="text-sm font-medium">{post.comments}</span>
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleBookmark(post.id)}
                        className={`p-2 rounded-lg transition-all ${
                          bookmarkedPosts.has(post.id)
                            ? "bg-amber-500/15 dark:bg-amber-500/25 text-amber-600 dark:text-amber-400"
                            : "hover:bg-accent text-muted-foreground hover:text-foreground"
                        }`}
                        aria-label="Bookmark">
                        <Bookmark size={18} fill={bookmarkedPosts.has(post.id) ? "currentColor" : "none"} />
                      </button>
                      <button
                        onClick={handleShare}
                        className="p-2 hover:bg-accent rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                        aria-label="Share">
                        <Share2 size={18} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </section>

            {/* Additional Content */}
            {Array.from({ length: 5 }).map((_, i) => (
              <section
                key={i}
                className="p-6 border rounded-lg hover:shadow-lg hover:bg-accent/30 hover:border-primary/30 transition-all group">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-foreground">
                  <ShoppingCart size={20} className="text-primary" />
                  Content Section {i + 1}
                </h3>
                <p className="text-muted-foreground group-hover:text-foreground/80 mb-4 transition-colors">
                  This is additional scrollable content to demonstrate the Scaffold layout behavior. The bottom
                  navigation remains fixed, and the FAB stays accessible throughout scrolling.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      snackbar.show(`Expanded section ${i + 1}`, {
                        severity: "info",
                      })
                    }
                    className="px-3 py-1.5 text-sm border rounded-lg hover:bg-accent hover:border-primary transition-all text-foreground">
                    Learn More
                  </button>
                  <button
                    onClick={() =>
                      snackbar.show("Added to collection", {
                        severity: "success",
                      })
                    }
                    className="px-3 py-1.5 text-sm border rounded-lg hover:bg-accent hover:border-primary transition-all text-foreground">
                    Add to Collection
                  </button>
                </div>
              </section>
            ))}
          </div>
        </div>
      </Scaffold>

      <Snackbar {...snackbar.snackbarProps} />

      {/* Settings Modal */}
      <Modal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title="Settings"
        description="Customize your application preferences"
        size="md">
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-2 block text-foreground">Theme</label>
            <Select
              value={theme}
              onChange={(value) => setTheme(value as "light" | "dark" | "system")}
              options={[
                { value: "light", label: "Light" },
                { value: "dark", label: "Dark" },
                { value: "system", label: "System" },
              ]}
              aria-label="Select theme"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block text-foreground">Language</label>
            <Select
              options={[
                { value: "en", label: "English" },
                { value: "zh", label: "中文" },
                { value: "ja", label: "日本語" },
                { value: "es", label: "Español" },
                { value: "fr", label: "Français" },
              ]}
              placeholder="Select language"
              aria-label="Select language"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block text-foreground">Notifications</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-primary accent-primary" />
                <span className="text-sm text-foreground">Email notifications</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-primary accent-primary" />
                <span className="text-sm text-foreground">Push notifications</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-primary accent-primary" />
                <span className="text-sm text-foreground">SMS notifications</span>
              </label>
            </div>
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
              snackbar.show("Settings saved successfully!", {
                severity: "success",
              });
            }}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all">
            Save Changes
          </button>
        </ModalFooter>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        open={confirmModalOpen}
        onOpenChange={setConfirmModalOpen}
        title="Upload Content"
        description="Are you sure you want to upload new content?"
        size="sm">
        <div className="py-4">
          <p className="text-sm text-foreground">
            This will make your content visible to all users. You can always edit or delete it later.
          </p>
        </div>

        <ModalFooter>
          <button
            onClick={() => setConfirmModalOpen(false)}
            className="px-4 py-2 border rounded-lg hover:bg-accent transition-colors text-foreground">
            Cancel
          </button>
          <button
            onClick={() => {
              setConfirmModalOpen(false);
              snackbar.show("Content uploaded successfully!", {
                severity: "success",
              });
            }}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all">
            Upload
          </button>
        </ModalFooter>
      </Modal>
    </>
  );
}
