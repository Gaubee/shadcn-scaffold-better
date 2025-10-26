"use client";

import {
  AppBar,
  BottomNavigationBar,
  Drawer,
  FloatingActionButton,
  Scaffold,
  Snackbar,
  useSnackbar,
} from "@/components/scaffold";
import {
  ArrowUp,
  Compass,
  Eye,
  Heart,
  Home,
  Menu,
  MousePointer2,
  Plus,
  Sparkles,
  TrendingUp,
  User,
  Zap,
} from "lucide-react";
import * as React from "react";

export default function AdvancedScrollExamplePage() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [selectedNav, setSelectedNav] = React.useState("home");
  const [scrollProgress, setScrollProgress] = React.useState(0);
  const snackbar = useSnackbar();

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      setScrollProgress((currentScroll / scrollHeight) * 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigationItems = [
    { key: "home", icon: <Home size={24} />, label: "Home" },
    { key: "explore", icon: <Compass size={24} />, label: "Explore" },
    { key: "favorites", icon: <Heart size={24} />, label: "Favorites" },
    { key: "profile", icon: <User size={24} />, label: "Profile" },
  ];

  return (
    <>
      <Scaffold
        header={
          <AppBar
            collapsible
            immersive
            expandedHeight={80}
            collapsedHeight={56}
            elevation={2}
            leading={
              <button
                onClick={() => setDrawerOpen(true)}
                className="hover:bg-accent rounded-full p-2 transition-colors"
                aria-label="Open menu">
                <Menu size={24} />
              </button>
            }
            title={
              <div className="flex items-center gap-3">
                <Sparkles className="text-primary" size={24} />
                <div>
                  <h1 className="text-xl font-bold">Scroll Animations</h1>
                  <p className="text-muted-foreground text-xs">CSS-Driven Magic</p>
                </div>
              </div>
            }
            actions={
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 hidden items-center gap-2 rounded-full px-3 py-1 sm:flex">
                  <span className="text-primary text-xs font-medium">{scrollProgress.toFixed(0)}%</span>
                </div>
              </div>
            }
          />
        }
        drawer={
          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} gestureEnabled elevation={4}>
            <div className="flex h-full flex-col">
              <div className="from-primary/10 border-b bg-gradient-to-br to-purple-500/10 p-6">
                <div className="flex items-center gap-3">
                  <div className="from-primary flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br to-purple-600">
                    <Sparkles className="text-primary-foreground" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold">Scroll Demo</h3>
                    <p className="text-muted-foreground text-xs">Web-Native Animations</p>
                  </div>
                </div>
              </div>

              <nav className="flex-1 overflow-y-auto p-4">
                <div className="space-y-1">
                  {navigationItems.map((item) => (
                    <button
                      key={item.key}
                      onClick={() => {
                        setSelectedNav(item.key);
                        setDrawerOpen(false);
                      }}
                      className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-all ${
                        selectedNav === item.key ? "bg-primary text-primary-foreground shadow-md" : "hover:bg-accent"
                      }`}>
                      {item.icon}
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </nav>

              <div className="border-t p-4">
                <button
                  onClick={() => {
                    setDrawerOpen(false);
                    snackbar.show("Documentation coming soon", {
                      severity: "info",
                    });
                  }}
                  className="bg-primary text-primary-foreground w-full rounded-lg px-4 py-2 text-sm font-medium transition-all hover:brightness-110">
                  View Documentation
                </button>
              </div>
            </div>
          </Drawer>
        }
        bottomNavigationBar={
          <BottomNavigationBar
            items={navigationItems}
            value={selectedNav}
            onValueChange={setSelectedNav}
            showLabels="selected"
            elevation={3}
            hideOnScroll
          />
        }
        floatingActionButton={
          <FloatingActionButton
            icon={<ArrowUp size={24} />}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            hideOnScroll={false}
            elevation={4}
          />
        }>
        {/* Progress Bar */}
        <div className="bg-muted/30 fixed top-0 right-0 left-0 z-50 h-1">
          <div
            className="from-primary h-full bg-gradient-to-r to-purple-600 transition-all duration-150"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        {/* Hero Section */}
        <section className="from-background via-primary/5 relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br to-purple-500/5">
          <div className="pointer-events-none absolute inset-0">
            <div className="bg-primary/10 parallax-slow absolute top-1/4 left-1/4 h-64 w-64 rounded-full blur-3xl" />
            <div className="parallax-fast absolute right-1/4 bottom-1/3 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
          </div>

          <div className="relative z-10 container mx-auto px-4 py-20 text-center">
            <div className="scroll-fade-in mx-auto max-w-4xl space-y-8">
              <h1 className="from-primary to-primary bg-gradient-to-r via-purple-600 bg-clip-text text-5xl font-bold text-transparent md:text-7xl">
                CSS Scroll-Driven Animations
              </h1>
              <p className="text-muted-foreground mx-auto max-w-2xl text-xl md:text-2xl">
                Experience buttery-smooth animations powered by native CSS, with graceful JavaScript fallbacks
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <div className="bg-primary/10 text-primary rounded-full px-6 py-3 font-medium">
                  <Zap className="mr-2 inline" size={20} />
                  60fps Performance
                </div>
                <div className="rounded-full bg-purple-500/10 px-6 py-3 font-medium text-purple-600">
                  <TrendingUp className="mr-2 inline" size={20} />
                  Progressive Enhancement
                </div>
                <div className="rounded-full bg-blue-500/10 px-6 py-3 font-medium text-blue-600">
                  <Eye className="mr-2 inline" size={20} />
                  Visually Stunning
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <MousePointer2 className="text-muted-foreground" size={32} />
          </div>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto px-4 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="scroll-fade-in mb-16 text-center">
              <h2 className="mb-4 text-4xl font-bold md:text-5xl">Web-Native Excellence</h2>
              <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
                Built with modern CSS features for maximum performance and minimal JavaScript
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Collapsible AppBar",
                  description:
                    "Header smoothly shrinks on scroll, saving valuable screen space while maintaining accessibility.",
                  color: "blue",
                  icon: <ArrowUp size={32} />,
                },
                {
                  title: "Immersive Mode",
                  description:
                    "Transparent header becomes solid with backdrop blur as you scroll, creating depth and focus.",
                  color: "purple",
                  icon: <Sparkles size={32} />,
                },
                {
                  title: "Hide on Scroll",
                  description: "Navigation bars intelligently hide when scrolling down, maximizing content visibility.",
                  color: "green",
                  icon: <Eye size={32} />,
                },
                {
                  title: "Parallax Effects",
                  description: "Background elements move at different speeds, adding depth and visual interest.",
                  color: "amber",
                  icon: <TrendingUp size={32} />,
                },
                {
                  title: "View Animations",
                  description: "Elements fade in and scale as they enter the viewport, drawing attention naturally.",
                  color: "red",
                  icon: <Zap size={32} />,
                },
                {
                  title: "Progressive Enhancement",
                  description:
                    "Modern browsers get CSS animations, older browsers get JavaScript fallbacks seamlessly.",
                  color: "cyan",
                  icon: <Plus size={32} />,
                },
              ].map((feature, index) => (
                <div key={index} className="group scroll-scale rounded-2xl border p-8 transition-all hover:shadow-2xl">
                  <div
                    className={`h-16 w-16 bg-${feature.color}-500/10 flex items-center justify-center rounded-2xl text-${feature.color}-500 mb-6 transition-transform group-hover:scale-110`}>
                    {feature.icon}
                  </div>
                  <h3 className="mb-3 text-2xl font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Technical Details */}
        <section className="bg-muted/30 py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-6xl">
              <div className="scroll-fade-in mb-16 text-center">
                <h2 className="mb-4 text-4xl font-bold md:text-5xl">How It Works</h2>
                <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
                  Leveraging cutting-edge CSS features with smart fallbacks
                </p>
              </div>

              <div className="grid gap-8 lg:grid-cols-2">
                <div className="bg-background scroll-reveal rounded-2xl border p-8">
                  <h3 className="mb-4 flex items-center gap-3 text-2xl font-bold">
                    <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                      <span className="text-primary font-bold">1</span>
                    </div>
                    CSS Scroll-Timeline API
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Modern browsers use the native CSS animation-timeline property to drive animations based on scroll
                    position:
                  </p>
                  <pre className="bg-muted/50 overflow-x-auto rounded-xl p-4 text-sm">
                    <code>{`@keyframes app-bar-collapse {
  from { height: 80px; }
  to { height: 56px; }
}

.app-bar-collapsible {
  animation: app-bar-collapse linear;
  animation-timeline: scroll();
  animation-range: 0 100px;
}`}</code>
                  </pre>
                </div>

                <div className="bg-background scroll-reveal rounded-2xl border p-8">
                  <h3 className="mb-4 flex items-center gap-3 text-2xl font-bold">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/10">
                      <span className="font-bold text-purple-600">2</span>
                    </div>
                    JavaScript Fallback
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    For browsers without CSS scroll-timeline support, we provide smooth JavaScript-driven animations:
                  </p>
                  <pre className="bg-muted/50 overflow-x-auto rounded-xl p-4 text-sm">
                    <code>{`// Feature detection
const supported =
  CSS.supports('animation-timeline: scroll()');

if (!supported) {
  // Use requestAnimationFrame for smooth fallback
  window.addEventListener('scroll', () => {
    requestAnimationFrame(updateAnimation);
  }, { passive: true });
}`}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Demo */}
        <section className="container mx-auto px-4 py-20">
          <div className="mx-auto max-w-4xl">
            <div className="scroll-fade-in mb-12 text-center">
              <h2 className="mb-4 text-4xl font-bold md:text-5xl">Try It Yourself</h2>
              <p className="text-muted-foreground text-lg">
                Scroll up and down to see the AppBar collapse, background blur, and navigation hide
              </p>
            </div>

            <div className="space-y-8">
              {[1, 2, 3, 4, 5].map((section) => (
                <div key={section} className="scroll-fade-in rounded-2xl border p-8 transition-all hover:shadow-xl">
                  <h3 className="mb-4 text-2xl font-bold">Section {section}</h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    Keep scrolling to observe how different components react to your scroll position. The AppBar at the
                    top shrinks and becomes more opaque, the bottom navigation hides when scrolling down and reappears
                    when scrolling up, and content elements fade in as they enter the viewport.
                  </p>
                  <div className="from-primary/10 to-primary/10 h-32 rounded-xl bg-gradient-to-r via-purple-500/10" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="from-primary/10 to-primary/5 bg-gradient-to-br via-purple-500/10 py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="scroll-fade-in mb-6 text-4xl font-bold md:text-5xl">Why CSS Scroll-Driven Animations?</h2>
              <div className="mt-12 grid gap-6 md:grid-cols-3">
                <div className="bg-background/80 scroll-scale rounded-2xl border p-6 backdrop-blur-sm">
                  <div className="mb-4 text-4xl">⚡</div>
                  <h3 className="mb-2 text-xl font-bold">60fps Performance</h3>
                  <p className="text-muted-foreground text-sm">Runs on GPU, smoother than JavaScript</p>
                </div>
                <div className="bg-background/80 scroll-scale rounded-2xl border p-6 backdrop-blur-sm">
                  <div className="mb-4 text-4xl">🎨</div>
                  <h3 className="mb-2 text-xl font-bold">Declarative</h3>
                  <p className="text-muted-foreground text-sm">Write less code, maintain easier</p>
                </div>
                <div className="bg-background/80 scroll-scale rounded-2xl border p-6 backdrop-blur-sm">
                  <div className="mb-4 text-4xl">📱</div>
                  <h3 className="mb-2 text-xl font-bold">Battery Friendly</h3>
                  <p className="text-muted-foreground text-sm">Lower CPU usage on mobile devices</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="container mx-auto px-4 py-20">
          <div className="scroll-fade-in mx-auto max-w-4xl text-center">
            <h2 className="mb-6 text-4xl font-bold md:text-5xl">Ready to Build?</h2>
            <p className="text-muted-foreground mb-8 text-xl">
              Start creating beautiful, performant scroll experiences today
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() =>
                  snackbar.show("Documentation opening...", {
                    severity: "info",
                  })
                }
                className="bg-primary text-primary-foreground rounded-xl px-8 py-4 text-lg font-medium shadow-lg transition-all hover:brightness-110">
                View Documentation
              </button>
              <button
                onClick={() => (window.location.href = "/examples/responsive")}
                className="hover:bg-accent rounded-xl border px-8 py-4 text-lg font-medium transition-all">
                More Examples
              </button>
            </div>
          </div>
        </section>

        {/* Spacer for scroll */}
        <div className="h-32" />
      </Scaffold>

      <Snackbar {...snackbar.snackbarProps} />
    </>
  );
}
