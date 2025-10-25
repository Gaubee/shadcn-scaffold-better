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
} from "@/components/scaffold";
import {
  Menu,
  Home,
  Compass,
  Heart,
  User,
  Plus,
  ArrowUp,
  Sparkles,
  Zap,
  TrendingUp,
  Eye,
  MousePointer2,
} from "lucide-react";

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
        appBar={
          <AppBar
            collapsible
            immersive
            expandedHeight={80}
            collapsedHeight={56}
            elevation={2}
            leading={
              <button
                onClick={() => setDrawerOpen(true)}
                className="p-2 hover:bg-accent rounded-full transition-colors"
                aria-label="Open menu">
                <Menu size={24} />
              </button>
            }
            title={
              <div className="flex items-center gap-3">
                <Sparkles className="text-primary" size={24} />
                <div>
                  <h1 className="text-xl font-bold">Scroll Animations</h1>
                  <p className="text-xs text-muted-foreground">CSS-Driven Magic</p>
                </div>
              </div>
            }
            actions={
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
                  <span className="text-xs font-medium text-primary">{scrollProgress.toFixed(0)}%</span>
                </div>
              </div>
            }
          />
        }
        drawer={
          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} gestureEnabled elevation={4}>
            <div className="flex flex-col h-full">
              <div className="p-6 border-b bg-gradient-to-br from-primary/10 to-purple-500/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center">
                    <Sparkles className="text-primary-foreground" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold">Scroll Demo</h3>
                    <p className="text-xs text-muted-foreground">Web-Native Animations</p>
                  </div>
                </div>
              </div>

              <nav className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-1">
                  {navigationItems.map((item) => (
                    <button
                      key={item.key}
                      onClick={() => {
                        setSelectedNav(item.key);
                        setDrawerOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${
                        selectedNav === item.key ? "bg-primary text-primary-foreground shadow-md" : "hover:bg-accent"
                      }`}>
                      {item.icon}
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </nav>

              <div className="p-4 border-t">
                <button
                  onClick={() => {
                    setDrawerOpen(false);
                    snackbar.show("Documentation coming soon", {
                      severity: "info",
                    });
                  }}
                  className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:brightness-110 transition-all text-sm font-medium">
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
        <div className="fixed top-0 left-0 right-0 h-1 bg-muted/30 z-50">
          <div
            className="h-full bg-gradient-to-r from-primary to-purple-600 transition-all duration-150"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-primary/5 to-purple-500/5">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl parallax-slow" />
            <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl parallax-fast" />
          </div>

          <div className="container mx-auto px-4 py-20 text-center relative z-10">
            <div className="max-w-4xl mx-auto space-y-8 scroll-fade-in">
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-purple-600 to-primary bg-clip-text text-transparent">
                CSS Scroll-Driven Animations
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                Experience buttery-smooth animations powered by native CSS, with graceful JavaScript fallbacks
              </p>
              <div className="flex flex-wrap gap-4 justify-center pt-4">
                <div className="px-6 py-3 bg-primary/10 rounded-full text-primary font-medium">
                  <Zap className="inline mr-2" size={20} />
                  60fps Performance
                </div>
                <div className="px-6 py-3 bg-purple-500/10 rounded-full text-purple-600 font-medium">
                  <TrendingUp className="inline mr-2" size={20} />
                  Progressive Enhancement
                </div>
                <div className="px-6 py-3 bg-blue-500/10 rounded-full text-blue-600 font-medium">
                  <Eye className="inline mr-2" size={20} />
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
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 scroll-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Web-Native Excellence</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
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
                <div key={index} className="p-8 border rounded-2xl hover:shadow-2xl transition-all group scroll-scale">
                  <div
                    className={`w-16 h-16 bg-${feature.color}-500/10 rounded-2xl flex items-center justify-center text-${feature.color}-500 mb-6 group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Technical Details */}
        <section className="bg-muted/30 py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16 scroll-fade-in">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Leveraging cutting-edge CSS features with smart fallbacks
                </p>
              </div>

              <div className="grid gap-8 lg:grid-cols-2">
                <div className="p-8 bg-background border rounded-2xl scroll-reveal">
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="font-bold text-primary">1</span>
                    </div>
                    CSS Scroll-Timeline API
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Modern browsers use the native CSS animation-timeline property to drive animations based on scroll
                    position:
                  </p>
                  <pre className="bg-muted/50 p-4 rounded-xl overflow-x-auto text-sm">
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

                <div className="p-8 bg-background border rounded-2xl scroll-reveal">
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-500/10 rounded-full flex items-center justify-center">
                      <span className="font-bold text-purple-600">2</span>
                    </div>
                    JavaScript Fallback
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    For browsers without CSS scroll-timeline support, we provide smooth JavaScript-driven animations:
                  </p>
                  <pre className="bg-muted/50 p-4 rounded-xl overflow-x-auto text-sm">
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
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 scroll-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Try It Yourself</h2>
              <p className="text-lg text-muted-foreground">
                Scroll up and down to see the AppBar collapse, background blur, and navigation hide
              </p>
            </div>

            <div className="space-y-8">
              {[1, 2, 3, 4, 5].map((section) => (
                <div key={section} className="p-8 border rounded-2xl scroll-fade-in hover:shadow-xl transition-all">
                  <h3 className="text-2xl font-bold mb-4">Section {section}</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Keep scrolling to observe how different components react to your scroll position. The AppBar at the
                    top shrinks and becomes more opaque, the bottom navigation hides when scrolling down and reappears
                    when scrolling up, and content elements fade in as they enter the viewport.
                  </p>
                  <div className="h-32 bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10 rounded-xl" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="bg-gradient-to-br from-primary/10 via-purple-500/10 to-primary/5 py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 scroll-fade-in">Why CSS Scroll-Driven Animations?</h2>
              <div className="grid gap-6 md:grid-cols-3 mt-12">
                <div className="p-6 bg-background/80 backdrop-blur-sm border rounded-2xl scroll-scale">
                  <div className="text-4xl mb-4">⚡</div>
                  <h3 className="text-xl font-bold mb-2">60fps Performance</h3>
                  <p className="text-sm text-muted-foreground">Runs on GPU, smoother than JavaScript</p>
                </div>
                <div className="p-6 bg-background/80 backdrop-blur-sm border rounded-2xl scroll-scale">
                  <div className="text-4xl mb-4">🎨</div>
                  <h3 className="text-xl font-bold mb-2">Declarative</h3>
                  <p className="text-sm text-muted-foreground">Write less code, maintain easier</p>
                </div>
                <div className="p-6 bg-background/80 backdrop-blur-sm border rounded-2xl scroll-scale">
                  <div className="text-4xl mb-4">📱</div>
                  <h3 className="text-xl font-bold mb-2">Battery Friendly</h3>
                  <p className="text-sm text-muted-foreground">Lower CPU usage on mobile devices</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center scroll-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Build?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Start creating beautiful, performant scroll experiences today
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() =>
                  snackbar.show("Documentation opening...", {
                    severity: "info",
                  })
                }
                className="px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:brightness-110 transition-all shadow-lg text-lg font-medium">
                View Documentation
              </button>
              <button
                onClick={() => (window.location.href = "/examples/responsive")}
                className="px-8 py-4 border rounded-xl hover:bg-accent transition-all text-lg font-medium">
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
