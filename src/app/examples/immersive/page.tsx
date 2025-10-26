"use client";

import { AppBar, FloatingActionButton, Scaffold, Snackbar, useSnackbar } from "@/components/scaffold";
import {
  ArrowLeft,
  Award,
  Bookmark,
  ChevronDown,
  Clock,
  Eye,
  Heart,
  MessageCircle,
  Plus,
  Share,
  Tag,
  TrendingUp,
  User,
  Zap,
} from "lucide-react";
import * as React from "react";

export default function ImmersiveExamplePage() {
  const [bookmarked, setBookmarked] = React.useState(false);
  const [liked, setLiked] = React.useState(false);
  const [likes, setLikes] = React.useState(248);
  const [scrollProgress, setScrollProgress] = React.useState(0);
  const [appBarHeight, setAppBarHeight] = React.useState(80); // Initial expanded height
  const snackbar = useSnackbar();

  // Track scroll progress for parallax effects and AppBar height
  React.useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollTop / Math.max(docHeight, 1), 1);
      setScrollProgress(progress);

      // Calculate current AppBar height (80px -> 56px over 100px scroll)
      const scrollThreshold = 100;
      const heightProgress = Math.min(scrollTop / scrollThreshold, 1);
      const expandedHeight = 80;
      const collapsedHeight = 56;
      const currentHeight = expandedHeight - (expandedHeight - collapsedHeight) * heightProgress;
      setAppBarHeight(currentHeight);
    };

    // Call immediately to set correct initial height based on current scroll position
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleBookmark = () => {
    setBookmarked(!bookmarked);
    snackbar.show(bookmarked ? "Bookmark removed" : "Article bookmarked!", {
      severity: bookmarked ? "default" : "success",
    });
  };

  const toggleLike = () => {
    setLiked(!liked);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));
    snackbar.show(liked ? "Removed from favorites" : "Added to favorites", {
      severity: liked ? "default" : "success",
    });
  };

  const handleShare = () => {
    snackbar.show("Share options coming soon", { severity: "info" });
  };

  return (
    <>
      <Scaffold
        header={
          <AppBar
            immersive
            collapsible
            expandedHeight={80}
            collapsedHeight={56}
            leading={
              <button
                onClick={() => window.history.back()}
                className="hover:bg-accent rounded-full p-2 transition-colors"
                aria-label="Go back">
                <ArrowLeft size={24} />
              </button>
            }
            title={<h1 className="truncate text-xl font-bold">Immersive Design Patterns</h1>}
            actions={
              <div className="flex items-center gap-1">
                <button
                  onClick={toggleBookmark}
                  className={`rounded-full p-2 transition-all ${
                    bookmarked ? "bg-amber-500/10 text-amber-500" : "hover:bg-accent"
                  }`}
                  aria-label="Bookmark article">
                  <Bookmark size={20} fill={bookmarked ? "currentColor" : "none"} />
                </button>
                <button
                  onClick={handleShare}
                  className="hover:bg-accent rounded-full p-2 transition-colors"
                  aria-label="Share article">
                  <Share size={20} />
                </button>
              </div>
            }
          />
        }
        floatingActionButton={
          <FloatingActionButton
            extended
            icon={<Plus size={20} />}
            label="New Article"
            hideOnScroll
            onClick={() => snackbar.show("Create new article", { severity: "info" })}
            elevation={4}
          />
        }>
        <div className="relative">
          {/* Hero Section with Parallax */}
          <div
            className="relative flex h-[70vh] items-center justify-center overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500"
            style={{
              transform: `translateY(${scrollProgress * 100}px)`,
            }}>
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-20">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `radial-gradient(circle at 20% 50%, transparent 0%, rgba(255,255,255,0.1) 100%)`,
                  transform: `scale(${1 + scrollProgress * 0.3})`,
                }}
              />
            </div>

            {/* Hero Content */}
            <div
              className="relative max-w-4xl p-8 text-center text-white"
              style={{
                opacity: 1 - scrollProgress * 2,
                transform: `translateY(${scrollProgress * -50}px) scale(${1 - scrollProgress * 0.1})`,
              }}>
              <div className="mb-6 flex items-center justify-center gap-2">
                <Zap className="text-yellow-300" size={32} />
                <Award className="text-yellow-300" size={28} />
              </div>
              <h1 className="mb-6 text-6xl font-bold drop-shadow-lg">Immersive Design</h1>
              <p className="mb-8 text-2xl opacity-90 drop-shadow">
                Experience scroll-driven animations and transformations
              </p>
              <button
                onClick={() =>
                  window.scrollTo({
                    top: window.innerHeight,
                    behavior: "smooth",
                  })
                }
                className="inline-flex items-center gap-2 rounded-full bg-white/20 px-8 py-4 text-white shadow-2xl backdrop-blur-md transition-all hover:bg-white/30">
                <span className="font-medium">Explore Features</span>
                <ChevronDown className="animate-bounce" size={20} />
              </button>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
              <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-white/50 p-2">
                <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-white" />
              </div>
            </div>
          </div>

          {/* Article Metadata Bar - sticks below AppBar when scrolling */}
          <div
            className="bg-background/95 sticky border-b backdrop-blur-sm transition-all duration-300"
            style={{ top: `${appBarHeight}px`, zIndex: 40 }}>
            <div className="container mx-auto px-4">
              <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-4 py-4">
                <div className="text-muted-foreground flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <User size={16} />
                    <span>Alex Rivera</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>8 min read</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye size={16} />
                    <span>12.5K views</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleLike}
                    className={`flex items-center gap-2 rounded-full px-3 py-1.5 transition-all ${
                      liked ? "bg-red-500/10 text-red-500" : "bg-muted hover:bg-accent text-muted-foreground"
                    }`}>
                    <Heart size={16} fill={liked ? "currentColor" : "none"} />
                    <span className="text-sm font-medium">{likes}</span>
                  </button>
                  <button
                    onClick={() =>
                      snackbar.show("Comments coming soon", {
                        severity: "info",
                      })
                    }
                    className="bg-muted hover:bg-accent text-muted-foreground flex items-center gap-2 rounded-full px-3 py-1.5 transition-colors">
                    <MessageCircle size={16} />
                    <span className="text-sm font-medium">42</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="container mx-auto px-4 py-12">
            <div className="mx-auto max-w-3xl space-y-8">
              {/* Introduction */}
              <section>
                <h2 className="mb-6 text-4xl font-bold">The Power of Immersive Design</h2>
                <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                  This page demonstrates the immersive AppBar feature, a powerful design pattern that creates a seamless
                  connection between your hero content and navigation. As you scroll, watch the AppBar gradually become
                  opaque with a sophisticated backdrop blur effect.
                </p>
                <div className="rounded-xl border bg-gradient-to-r from-blue-50 to-purple-50 p-6 dark:from-blue-950 dark:to-purple-950">
                  <p className="text-sm leading-relaxed">
                    <strong className="text-primary">Pro Tip:</strong> The immersive mode is perfect for content-heavy
                    pages where you want to maximize screen real estate while maintaining easy access to navigation
                    controls.
                  </p>
                </div>
              </section>

              {/* Key Features */}
              <section>
                <h3 className="mb-6 flex items-center gap-3 text-3xl font-bold">
                  <TrendingUp className="text-primary" size={32} />
                  Key Features
                </h3>
                <div className="grid gap-4">
                  <div className="rounded-xl border p-6 transition-all hover:shadow-lg">
                    <h4 className="mb-2 flex items-center gap-2 text-lg font-semibold">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                        <span className="font-bold text-blue-500">1</span>
                      </div>
                      Immersive Mode
                    </h4>
                    <p className="text-muted-foreground">
                      The AppBar starts completely transparent, allowing your hero content to shine. As users scroll, it
                      smoothly transitions to a solid state with perfect readability.
                    </p>
                  </div>

                  <div className="rounded-xl border p-6 transition-all hover:shadow-lg">
                    <h4 className="mb-2 flex items-center gap-2 text-lg font-semibold">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10">
                        <span className="font-bold text-purple-500">2</span>
                      </div>
                      Collapsible Height
                    </h4>
                    <p className="text-muted-foreground">
                      The AppBar dynamically reduces its height when scrolling down, providing more vertical space for
                      your content while keeping navigation accessible.
                    </p>
                  </div>

                  <div className="rounded-xl border p-6 transition-all hover:shadow-lg">
                    <h4 className="mb-2 flex items-center gap-2 text-lg font-semibold">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10">
                        <span className="font-bold text-green-500">3</span>
                      </div>
                      Backdrop Blur
                    </h4>
                    <p className="text-muted-foreground">
                      Modern glassmorphism effect with backdrop blur ensures your navigation remains readable over any
                      content, with dynamic saturation adjustments.
                    </p>
                  </div>

                  <div className="rounded-xl border p-6 transition-all hover:shadow-lg">
                    <h4 className="mb-2 flex items-center gap-2 text-lg font-semibold">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
                        <span className="font-bold text-amber-500">4</span>
                      </div>
                      Hide on Scroll FAB
                    </h4>
                    <p className="text-muted-foreground">
                      The Floating Action Button intelligently hides when scrolling down and reappears when scrolling
                      up, keeping the focus on your content.
                    </p>
                  </div>
                </div>
              </section>

              {/* Use Cases */}
              <section>
                <h3 className="mb-6 text-3xl font-bold">Perfect Use Cases</h3>
                <p className="text-muted-foreground mb-6 text-lg">
                  This pattern excels in scenarios where you want to create an immersive, distraction-free reading
                  experience:
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    {
                      icon: <Tag size={20} />,
                      title: "Blog Posts & Articles",
                      desc: "Long-form content with rich media",
                    },
                    {
                      icon: <TrendingUp size={20} />,
                      title: "Product Pages",
                      desc: "Showcase products with hero imagery",
                    },
                    {
                      icon: <Award size={20} />,
                      title: "Portfolio Sites",
                      desc: "Display work with visual impact",
                    },
                    {
                      icon: <Eye size={20} />,
                      title: "Photo Galleries",
                      desc: "Immersive image browsing",
                    },
                  ].map((item, i) => (
                    <div key={i} className="group rounded-lg border p-5 transition-all hover:shadow-md">
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 text-primary rounded-lg p-2 transition-transform group-hover:scale-110">
                          {item.icon}
                        </div>
                        <div>
                          <h4 className="mb-1 font-semibold">{item.title}</h4>
                          <p className="text-muted-foreground text-sm">{item.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Implementation */}
              <section>
                <h3 className="mb-6 text-3xl font-bold">Implementation</h3>
                <p className="text-muted-foreground mb-4">
                  Creating an immersive experience is straightforward with Scaffold UI. Here's the code that powers this
                  page:
                </p>
                <div className="relative">
                  <pre className="bg-muted/50 overflow-x-auto rounded-xl border p-6 backdrop-blur-sm">
                    <code className="text-sm">{`<AppBar
  immersive
  collapsible
  expandedHeight={80}
  collapsedHeight={56}
  leading={<BackButton />}
  title={<h1>Your Title</h1>}
  actions={<ActionButtons />}
/>

<FloatingActionButton
  extended
  icon={<Plus />}
  label="New Article"
  hideOnScroll
/>`}</code>
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

              {/* Technical Details */}
              <section>
                <h3 className="mb-6 text-3xl font-bold">Technical Deep Dive</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="mb-3 text-xl font-semibold">Performance Optimizations</h4>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      The immersive AppBar uses requestAnimationFrame to throttle scroll events, ensuring smooth 60fps
                      animations even on lower-end devices. All transforms and opacity changes use GPU-accelerated CSS
                      properties.
                    </p>
                  </div>

                  <div>
                    <h4 className="mb-3 text-xl font-semibold">Easing Functions</h4>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      We use a cubic-bezier easing function (ease-out-quart) for natural-feeling transitions. The scroll
                      progress is calculated with careful consideration for different viewport sizes and content
                      heights.
                    </p>
                  </div>

                  <div>
                    <h4 className="mb-3 text-xl font-semibold">Accessibility Considerations</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      The AppBar maintains proper contrast ratios throughout its transition, and all interactive
                      elements remain keyboard-accessible. Screen readers receive appropriate ARIA labels for state
                      changes.
                    </p>
                  </div>
                </div>
              </section>

              {/* Additional Content Sections */}
              {Array.from({ length: 6 }).map((_, i) => (
                <section key={i} className="from-background to-muted/30 rounded-xl border bg-gradient-to-br p-8">
                  <h3 className="mb-4 text-2xl font-bold">Advanced Topic {i + 1}: Dynamic Scroll Effects</h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    This section demonstrates how the immersive AppBar maintains perfect readability throughout the
                    entire scroll journey. The backdrop blur intensifies gradually, creating a seamless visual hierarchy
                    that guides the reader's attention.
                  </p>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    Notice how the FAB behavior complements the AppBar animations. When scrolling down, both elements
                    gracefully recede to maximize content visibility. When scrolling up, they smoothly reappear,
                    anticipating your need for navigation.
                  </p>
                  <div className="mt-6 flex gap-2">
                    <button
                      onClick={() =>
                        snackbar.show(`Exploring topic ${i + 1}`, {
                          severity: "info",
                        })
                      }
                      className="bg-primary text-primary-foreground rounded-lg px-4 py-2 transition-all hover:brightness-110">
                      Learn More
                    </button>
                    <button
                      onClick={() =>
                        snackbar.show("Added to reading list", {
                          severity: "success",
                        })
                      }
                      className="hover:bg-accent rounded-lg border px-4 py-2 transition-all">
                      Save for Later
                    </button>
                  </div>
                </section>
              ))}

              {/* Conclusion */}
              <section className="py-12 text-center">
                <h3 className="mb-6 text-3xl font-bold">Ready to Build?</h3>
                <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg">
                  Start creating immersive experiences in your own applications. The Scaffold UI library makes it easy
                  to implement these advanced patterns with minimal code.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <button
                    onClick={() =>
                      snackbar.show("Opening documentation...", {
                        severity: "info",
                      })
                    }
                    className="bg-primary text-primary-foreground rounded-lg px-6 py-3 shadow-lg transition-all hover:brightness-110">
                    View Documentation
                  </button>
                  <button
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className="hover:bg-accent rounded-lg border px-6 py-3 transition-all">
                    Back to Top
                  </button>
                </div>
              </section>
            </div>
          </div>
        </div>
      </Scaffold>

      <Snackbar {...snackbar.snackbarProps} />
    </>
  );
}
