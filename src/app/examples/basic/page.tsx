"use client";

import {
  AppBar,
  BottomNavigationBar,
  Drawer,
  FloatingActionButton,
  Modal,
  ModalFooter,
  Scaffold,
  Snackbar,
  useSnackbar,
} from "@/components/scaffold";
import { useTheme } from "@/components/theme-provider";
import { Select } from "@/components/ui/select";
import {
  Activity,
  Archive,
  Bell,
  Bookmark,
  Download,
  Filter,
  Heart,
  Home,
  Menu,
  MessageSquare,
  MoreVertical,
  Plus,
  Search,
  Settings,
  Share2,
  ShoppingCart,
  Star,
  TrendingUp,
  Upload,
  User,
} from "lucide-react";
import * as React from "react";

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
        header={
          <AppBar
            elevation={2}
            leading={
              <button
                onClick={() => setDrawerOpen(true)}
                className="hover:bg-accent text-foreground rounded-full p-2 transition-colors"
                aria-label="Open menu">
                <Menu size={24} />
              </button>
            }
            title={
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold">Scaffold UI</h1>
                <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs font-medium">Demo</span>
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
                <div className="mb-2 flex items-center gap-3">
                  <div className="bg-primary text-primary-foreground flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold">
                    JD
                  </div>
                  <div>
                    <h3 className="font-semibold">John Doe</h3>
                    <p className="text-muted-foreground text-sm">john@example.com</p>
                  </div>
                </div>
              </div>

              {/* Drawer Menu */}
              <nav className="flex-1 p-4">
                <div className="space-y-1">
                  {drawerMenuItems.map((item) => (
                    <button
                      key={item.label}
                      className="hover:bg-accent group flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors"
                      onClick={() => {
                        snackbar.show(`Navigated to ${item.label}`);
                        setDrawerOpen(false);
                      }}>
                      <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                        {item.icon}
                      </span>
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span className="bg-destructive text-destructive-foreground rounded-full px-2 py-0.5 text-xs font-medium">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="mt-6 border-t pt-6">
                  <h4 className="text-muted-foreground mb-2 px-4 text-xs font-semibold uppercase">Quick Actions</h4>
                  <div className="space-y-1">
                    <button
                      className="hover:bg-accent flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors"
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
                      className="hover:bg-accent flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors"
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
              <div className="border-t p-4">
                <button
                  className="text-destructive hover:bg-destructive/10 w-full rounded-lg px-4 py-2 text-sm transition-colors"
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
          <div className="mx-auto max-w-4xl space-y-8">
            {/* Hero Section */}
            <section className="py-8 text-center">
              <h2 className="from-primary mb-4 bg-gradient-to-r to-purple-600 bg-clip-text text-4xl font-bold text-transparent">
                Welcome to Scaffold UI
              </h2>
              <p className="text-muted-foreground mx-auto mb-6 max-w-2xl text-lg">
                A comprehensive component library inspired by Flutter's Scaffold widget, bringing Material Design
                patterns to React with powerful features and seamless interactions.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={() =>
                    snackbar.show("Opening documentation...", {
                      severity: "info",
                    })
                  }
                  className="bg-primary text-primary-foreground rounded-lg px-6 py-3 shadow-md transition-all hover:opacity-90 hover:shadow-lg">
                  View Documentation
                </button>
                <button
                  onClick={() => window.open("https://github.com", "_blank")}
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-lg border-2 px-6 py-3 transition-all">
                  View on GitHub
                </button>
              </div>
            </section>

            {/* Stats Section */}
            <section className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border-2 border-blue-200 bg-gradient-to-br from-blue-50/80 to-white p-6 dark:border-blue-800 dark:from-blue-950 dark:to-blue-900/50">
                <div className="mb-2 flex items-center gap-3">
                  <TrendingUp className="text-blue-600 dark:text-blue-400" size={24} />
                  <h4 className="text-foreground font-semibold">Growing Fast</h4>
                </div>
                <p className="text-foreground mb-1 text-2xl font-bold">10K+</p>
                <p className="text-muted-foreground text-sm">Active Users</p>
              </div>
              <div className="rounded-lg border-2 border-purple-200 bg-gradient-to-br from-purple-50/80 to-white p-6 dark:border-purple-800 dark:from-purple-950 dark:to-purple-900/50">
                <div className="mb-2 flex items-center gap-3">
                  <Star className="text-purple-600 dark:text-purple-400" size={24} />
                  <h4 className="text-foreground font-semibold">High Quality</h4>
                </div>
                <p className="text-foreground mb-1 text-2xl font-bold">4.9/5</p>
                <p className="text-muted-foreground text-sm">User Rating</p>
              </div>
              <div className="rounded-lg border-2 border-green-200 bg-gradient-to-br from-green-50/80 to-white p-6 dark:border-green-800 dark:from-green-950 dark:to-green-900/50">
                <div className="mb-2 flex items-center gap-3">
                  <Activity className="text-green-600 dark:text-green-400" size={24} />
                  <h4 className="text-foreground font-semibold">Actively Maintained</h4>
                </div>
                <p className="text-foreground mb-1 text-2xl font-bold">Weekly</p>
                <p className="text-muted-foreground text-sm">Updates</p>
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
                  className="hover:bg-accent flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition-colors">
                  <Filter size={16} />
                  Filter
                </button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="hover:bg-accent/50 hover:border-primary/50 group cursor-pointer rounded-lg border p-6 transition-all hover:shadow-lg">
                  <div className="mb-3 flex items-start justify-between">
                    <h4 className="text-foreground text-lg font-semibold transition-colors">AppBar</h4>
                    <div className="bg-primary/15 dark:bg-primary/30 group-hover:bg-primary/25 dark:group-hover:bg-primary/40 rounded-lg p-2 transition-colors">
                      <Menu size={20} className="text-primary" />
                    </div>
                  </div>
                  <p className="text-muted-foreground group-hover:text-foreground/90 mb-3 text-sm transition-colors">
                    Fixed header with leading, title, and action areas. Supports collapsible and immersive modes with
                    scroll-driven animations.
                  </p>
                  <div className="flex gap-2">
                    <span className="bg-primary/15 text-primary dark:bg-primary/30 dark:text-primary-foreground rounded px-2 py-1 text-xs font-semibold">
                      Collapsible
                    </span>
                    <span className="bg-primary/15 text-primary dark:bg-primary/30 dark:text-primary-foreground rounded px-2 py-1 text-xs font-semibold">
                      Immersive
                    </span>
                  </div>
                </div>

                <div className="hover:bg-accent/50 group cursor-pointer rounded-lg border p-6 transition-all hover:border-purple-500/50 hover:shadow-lg">
                  <div className="mb-3 flex items-start justify-between">
                    <h4 className="text-foreground text-lg font-semibold transition-colors">Drawer</h4>
                    <div className="rounded-lg bg-purple-100 p-2 transition-colors group-hover:bg-purple-200 dark:bg-purple-500/30 dark:group-hover:bg-purple-500/40">
                      <Menu size={20} className="text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                  <p className="text-muted-foreground group-hover:text-foreground/90 mb-3 text-sm transition-colors">
                    Side navigation with gesture support for swipe-to-close. Includes backdrop overlay and keyboard
                    accessibility.
                  </p>
                  <div className="flex gap-2">
                    <span className="rounded bg-purple-100 px-2 py-1 text-xs font-semibold text-purple-700 dark:bg-purple-500/30 dark:text-purple-300">
                      Gestures
                    </span>
                    <span className="rounded bg-purple-100 px-2 py-1 text-xs font-semibold text-purple-700 dark:bg-purple-500/30 dark:text-purple-300">
                      Accessible
                    </span>
                  </div>
                </div>

                <div className="hover:bg-accent/50 group cursor-pointer rounded-lg border p-6 transition-all hover:border-blue-500/50 hover:shadow-lg">
                  <div className="mb-3 flex items-start justify-between">
                    <h4 className="text-foreground text-lg font-semibold transition-colors">Bottom Navigation</h4>
                    <div className="rounded-lg bg-blue-100 p-2 transition-colors group-hover:bg-blue-200 dark:bg-blue-500/30 dark:group-hover:bg-blue-500/40">
                      <Home size={20} className="text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <p className="text-muted-foreground group-hover:text-foreground/90 mb-3 text-sm transition-colors">
                    Mobile-friendly bottom navigation bar with badges, labels, and smooth transitions. Supports
                    hide-on-scroll.
                  </p>
                  <div className="flex gap-2">
                    <span className="rounded bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-500/30 dark:text-blue-300">
                      Mobile
                    </span>
                    <span className="rounded bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-500/30 dark:text-blue-300">
                      Badges
                    </span>
                  </div>
                </div>

                <div className="hover:bg-accent/50 group cursor-pointer rounded-lg border p-6 transition-all hover:border-green-500/50 hover:shadow-lg">
                  <div className="mb-3 flex items-start justify-between">
                    <h4 className="text-foreground text-lg font-semibold transition-colors">FAB</h4>
                    <div className="rounded-lg bg-green-100 p-2 transition-colors group-hover:bg-green-200 dark:bg-green-500/30 dark:group-hover:bg-green-500/40">
                      <Plus size={20} className="text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <p className="text-muted-foreground group-hover:text-foreground/90 mb-3 text-sm transition-colors">
                    Floating action button for primary actions. Available in multiple sizes with extended variant for
                    labels.
                  </p>
                  <div className="flex gap-2">
                    <span className="rounded bg-green-100 px-2 py-1 text-xs font-semibold text-green-700 dark:bg-green-500/30 dark:text-green-300">
                      Extended
                    </span>
                    <span className="rounded bg-green-100 px-2 py-1 text-xs font-semibold text-green-700 dark:bg-green-500/30 dark:text-green-300">
                      Customizable
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Interactive Snackbar Demo */}
            <section className="space-y-4">
              <h3 className="text-2xl font-semibold">Interactive Snackbar</h3>
              <div className="bg-muted/50 rounded-lg border p-6">
                <p className="text-muted-foreground mb-4 text-sm">
                  Try different snackbar variants to see toast notifications in action:
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() =>
                      snackbar.show("This is a default message", {
                        severity: "default",
                      })
                    }
                    className="bg-foreground text-background rounded-lg px-4 py-2 text-sm transition-all hover:opacity-90">
                    Default
                  </button>
                  <button
                    onClick={() =>
                      snackbar.show("Operation completed successfully!", {
                        severity: "success",
                      })
                    }
                    className="rounded-lg bg-green-600 px-4 py-2 text-sm text-white transition-all hover:bg-green-700">
                    Success
                  </button>
                  <button
                    onClick={() =>
                      snackbar.show("Please review your input", {
                        severity: "warning",
                      })
                    }
                    className="rounded-lg bg-amber-600 px-4 py-2 text-sm text-white transition-all hover:bg-amber-700">
                    Warning
                  </button>
                  <button
                    onClick={() => snackbar.show("An error occurred", { severity: "error" })}
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white transition-all hover:bg-red-700">
                    Error
                  </button>
                  <button
                    onClick={() => snackbar.show("Did you know?", { severity: "info" })}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition-all hover:bg-blue-700">
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
                    className="rounded-lg bg-purple-600 px-4 py-2 text-sm text-white transition-all hover:bg-purple-700">
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
                  className="text-primary text-sm hover:underline">
                  View All
                </button>
              </div>

              {samplePosts.map((post) => (
                <article
                  key={post.id}
                  className="hover:bg-accent/30 hover:border-primary/30 group rounded-lg border p-6 transition-all hover:shadow-lg">
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="from-primary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br to-purple-600 font-bold">
                        {post.author[0]}
                      </div>
                      <div>
                        <h4 className="text-foreground font-semibold">{post.author}</h4>
                        <p className="text-muted-foreground text-xs">{post.time}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => snackbar.show("More options", { severity: "info" })}
                      className="hover:bg-accent text-foreground rounded-full p-2 transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </div>

                  <h3 className="text-foreground mb-2 text-lg font-semibold">{post.title}</h3>
                  <p className="text-muted-foreground group-hover:text-foreground/80 mb-4 transition-colors">
                    {post.content}
                  </p>

                  <div className="flex items-center justify-between border-t pt-4">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => toggleLike(post.id)}
                        className={`flex items-center gap-2 rounded-lg px-3 py-1.5 transition-all ${
                          likedPosts.has(post.id)
                            ? "bg-red-500/15 text-red-600 dark:bg-red-500/25 dark:text-red-400"
                            : "hover:bg-accent text-muted-foreground hover:text-foreground"
                        }`}>
                        <Heart size={18} fill={likedPosts.has(post.id) ? "currentColor" : "none"} />
                        <span className="text-sm font-medium">{post.likes + (likedPosts.has(post.id) ? 1 : 0)}</span>
                      </button>
                      <button
                        onClick={() => snackbar.show("View comments", { severity: "info" })}
                        className="hover:bg-accent text-muted-foreground hover:text-foreground flex items-center gap-2 rounded-lg px-3 py-1.5 transition-colors">
                        <MessageSquare size={18} />
                        <span className="text-sm font-medium">{post.comments}</span>
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleBookmark(post.id)}
                        className={`rounded-lg p-2 transition-all ${
                          bookmarkedPosts.has(post.id)
                            ? "bg-amber-500/15 text-amber-600 dark:bg-amber-500/25 dark:text-amber-400"
                            : "hover:bg-accent text-muted-foreground hover:text-foreground"
                        }`}
                        aria-label="Bookmark">
                        <Bookmark size={18} fill={bookmarkedPosts.has(post.id) ? "currentColor" : "none"} />
                      </button>
                      <button
                        onClick={handleShare}
                        className="hover:bg-accent text-muted-foreground hover:text-foreground rounded-lg p-2 transition-colors"
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
                className="hover:bg-accent/30 hover:border-primary/30 group rounded-lg border p-6 transition-all hover:shadow-lg">
                <h3 className="text-foreground mb-2 flex items-center gap-2 text-lg font-semibold">
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
                    className="hover:bg-accent hover:border-primary text-foreground rounded-lg border px-3 py-1.5 text-sm transition-all">
                    Learn More
                  </button>
                  <button
                    onClick={() =>
                      snackbar.show("Added to collection", {
                        severity: "success",
                      })
                    }
                    className="hover:bg-accent hover:border-primary text-foreground rounded-lg border px-3 py-1.5 text-sm transition-all">
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
            <label className="text-foreground mb-2 block text-sm font-medium">Theme</label>
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
            <label className="text-foreground mb-2 block text-sm font-medium">Language</label>
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
            <label className="text-foreground mb-2 block text-sm font-medium">Notifications</label>
            <div className="space-y-2">
              <label className="flex cursor-pointer items-center gap-2">
                <input type="checkbox" defaultChecked className="text-primary accent-primary h-4 w-4" />
                <span className="text-foreground text-sm">Email notifications</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input type="checkbox" defaultChecked className="text-primary accent-primary h-4 w-4" />
                <span className="text-foreground text-sm">Push notifications</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input type="checkbox" className="text-primary accent-primary h-4 w-4" />
                <span className="text-foreground text-sm">SMS notifications</span>
              </label>
            </div>
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
              snackbar.show("Settings saved successfully!", {
                severity: "success",
              });
            }}
            className="bg-primary text-primary-foreground rounded-lg px-4 py-2 transition-all hover:opacity-90">
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
          <p className="text-foreground text-sm">
            This will make your content visible to all users. You can always edit or delete it later.
          </p>
        </div>

        <ModalFooter>
          <button
            onClick={() => setConfirmModalOpen(false)}
            className="hover:bg-accent text-foreground rounded-lg border px-4 py-2 transition-colors">
            Cancel
          </button>
          <button
            onClick={() => {
              setConfirmModalOpen(false);
              snackbar.show("Content uploaded successfully!", {
                severity: "success",
              });
            }}
            className="bg-primary text-primary-foreground rounded-lg px-4 py-2 transition-all hover:opacity-90">
            Upload
          </button>
        </ModalFooter>
      </Modal>
    </>
  );
}
