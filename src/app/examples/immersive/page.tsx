'use client';

import * as React from 'react';
import {
  Scaffold,
  AppBar,
  FloatingActionButton,
  Snackbar,
  useSnackbar,
} from '@/components/scaffold';
import {
  ArrowLeft,
  Share,
  Bookmark,
  Plus,
  Heart,
  MessageCircle,
  Eye,
  Clock,
  User,
  Tag,
  TrendingUp,
  Zap,
  Award,
  ChevronDown,
} from 'lucide-react';

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

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleBookmark = () => {
    setBookmarked(!bookmarked);
    snackbar.show(
      bookmarked ? 'Bookmark removed' : 'Article bookmarked!',
      { severity: bookmarked ? 'default' : 'success' }
    );
  };

  const toggleLike = () => {
    setLiked(!liked);
    setLikes(prev => liked ? prev - 1 : prev + 1);
    snackbar.show(
      liked ? 'Removed from favorites' : 'Added to favorites',
      { severity: liked ? 'default' : 'success' }
    );
  };

  const handleShare = () => {
    snackbar.show('Share options coming soon', { severity: 'info' });
  };

  return (
    <>
      <Scaffold
        appBar={
          <AppBar
            immersive
            collapsible
            expandedHeight={80}
            collapsedHeight={56}
            leading={
              <button
                onClick={() => window.history.back()}
                className="p-2 hover:bg-accent rounded-full transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft size={24} />
              </button>
            }
            title={
              <h1 className="text-xl font-bold truncate">
                Immersive Design Patterns
              </h1>
            }
            actions={
              <div className="flex items-center gap-1">
                <button
                  onClick={toggleBookmark}
                  className={`p-2 rounded-full transition-all ${
                    bookmarked ? 'text-amber-500 bg-amber-500/10' : 'hover:bg-accent'
                  }`}
                  aria-label="Bookmark article"
                >
                  <Bookmark
                    size={20}
                    fill={bookmarked ? 'currentColor' : 'none'}
                  />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 hover:bg-accent rounded-full transition-colors"
                  aria-label="Share article"
                >
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
            onClick={() => snackbar.show('Create new article', { severity: 'info' })}
            elevation={4}
          />
        }
      >
        <div className="relative">
          {/* Hero Section with Parallax */}
          <div
            className="relative h-[70vh] bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 flex items-center justify-center overflow-hidden"
            style={{
              transform: `translateY(${scrollProgress * 100}px)`,
            }}
          >
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
              className="relative text-center text-white p-8 max-w-4xl"
              style={{
                opacity: 1 - scrollProgress * 2,
                transform: `translateY(${scrollProgress * -50}px) scale(${1 - scrollProgress * 0.1})`,
              }}
            >
              <div className="mb-6 flex items-center justify-center gap-2">
                <Zap className="text-yellow-300" size={32} />
                <Award className="text-yellow-300" size={28} />
              </div>
              <h1 className="text-6xl font-bold mb-6 drop-shadow-lg">
                Immersive Design
              </h1>
              <p className="text-2xl mb-8 opacity-90 drop-shadow">
                Experience scroll-driven animations and transformations
              </p>
              <button
                onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/30 transition-all shadow-2xl"
              >
                <span className="font-medium">Explore Features</span>
                <ChevronDown className="animate-bounce" size={20} />
              </button>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
              <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" />
              </div>
            </div>
          </div>

          {/* Article Metadata Bar - sticks below AppBar when scrolling */}
          <div
            className="sticky bg-background/95 backdrop-blur-sm border-b transition-all duration-300"
            style={{ top: `${appBarHeight}px`, zIndex: 40 }}
          >
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto py-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${
                      liked
                        ? 'bg-red-500/10 text-red-500'
                        : 'bg-muted hover:bg-accent text-muted-foreground'
                    }`}
                  >
                    <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
                    <span className="text-sm font-medium">{likes}</span>
                  </button>
                  <button
                    onClick={() => snackbar.show('Comments coming soon', { severity: 'info' })}
                    className="flex items-center gap-2 px-3 py-1.5 bg-muted hover:bg-accent rounded-full transition-colors text-muted-foreground"
                  >
                    <MessageCircle size={16} />
                    <span className="text-sm font-medium">42</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-3xl mx-auto space-y-8">
              {/* Introduction */}
              <section>
                <h2 className="text-4xl font-bold mb-6">The Power of Immersive Design</h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  This page demonstrates the immersive AppBar feature, a powerful design pattern
                  that creates a seamless connection between your hero content and navigation.
                  As you scroll, watch the AppBar gradually become opaque with a sophisticated
                  backdrop blur effect.
                </p>
                <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-xl border">
                  <p className="text-sm leading-relaxed">
                    <strong className="text-primary">Pro Tip:</strong> The immersive mode is perfect
                    for content-heavy pages where you want to maximize screen real estate while
                    maintaining easy access to navigation controls.
                  </p>
                </div>
              </section>

              {/* Key Features */}
              <section>
                <h3 className="text-3xl font-bold mb-6 flex items-center gap-3">
                  <TrendingUp className="text-primary" size={32} />
                  Key Features
                </h3>
                <div className="grid gap-4">
                  <div className="p-6 border rounded-xl hover:shadow-lg transition-all">
                    <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                        <span className="text-blue-500 font-bold">1</span>
                      </div>
                      Immersive Mode
                    </h4>
                    <p className="text-muted-foreground">
                      The AppBar starts completely transparent, allowing your hero content to shine.
                      As users scroll, it smoothly transitions to a solid state with perfect readability.
                    </p>
                  </div>

                  <div className="p-6 border rounded-xl hover:shadow-lg transition-all">
                    <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                      <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center">
                        <span className="text-purple-500 font-bold">2</span>
                      </div>
                      Collapsible Height
                    </h4>
                    <p className="text-muted-foreground">
                      The AppBar dynamically reduces its height when scrolling down, providing more
                      vertical space for your content while keeping navigation accessible.
                    </p>
                  </div>

                  <div className="p-6 border rounded-xl hover:shadow-lg transition-all">
                    <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                      <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center">
                        <span className="text-green-500 font-bold">3</span>
                      </div>
                      Backdrop Blur
                    </h4>
                    <p className="text-muted-foreground">
                      Modern glassmorphism effect with backdrop blur ensures your navigation remains
                      readable over any content, with dynamic saturation adjustments.
                    </p>
                  </div>

                  <div className="p-6 border rounded-xl hover:shadow-lg transition-all">
                    <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                      <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center">
                        <span className="text-amber-500 font-bold">4</span>
                      </div>
                      Hide on Scroll FAB
                    </h4>
                    <p className="text-muted-foreground">
                      The Floating Action Button intelligently hides when scrolling down and reappears
                      when scrolling up, keeping the focus on your content.
                    </p>
                  </div>
                </div>
              </section>

              {/* Use Cases */}
              <section>
                <h3 className="text-3xl font-bold mb-6">Perfect Use Cases</h3>
                <p className="text-lg text-muted-foreground mb-6">
                  This pattern excels in scenarios where you want to create an immersive,
                  distraction-free reading experience:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { icon: <Tag size={20} />, title: 'Blog Posts & Articles', desc: 'Long-form content with rich media' },
                    { icon: <TrendingUp size={20} />, title: 'Product Pages', desc: 'Showcase products with hero imagery' },
                    { icon: <Award size={20} />, title: 'Portfolio Sites', desc: 'Display work with visual impact' },
                    { icon: <Eye size={20} />, title: 'Photo Galleries', desc: 'Immersive image browsing' },
                  ].map((item, i) => (
                    <div key={i} className="p-5 border rounded-lg hover:shadow-md transition-all group">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary group-hover:scale-110 transition-transform">
                          {item.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">{item.title}</h4>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Implementation */}
              <section>
                <h3 className="text-3xl font-bold mb-6">Implementation</h3>
                <p className="text-muted-foreground mb-4">
                  Creating an immersive experience is straightforward with Scaffold UI.
                  Here's the code that powers this page:
                </p>
                <div className="relative">
                  <pre className="bg-muted/50 backdrop-blur-sm p-6 rounded-xl overflow-x-auto border">
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
                    onClick={() => snackbar.show('Code copied to clipboard!', { severity: 'success' })}
                    className="absolute top-4 right-4 px-3 py-1.5 bg-primary text-primary-foreground text-sm rounded-lg hover:brightness-110 transition-all"
                  >
                    Copy
                  </button>
                </div>
              </section>

              {/* Technical Details */}
              <section>
                <h3 className="text-3xl font-bold mb-6">Technical Deep Dive</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-semibold mb-3">Performance Optimizations</h4>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      The immersive AppBar uses requestAnimationFrame to throttle scroll events,
                      ensuring smooth 60fps animations even on lower-end devices. All transforms
                      and opacity changes use GPU-accelerated CSS properties.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold mb-3">Easing Functions</h4>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      We use a cubic-bezier easing function (ease-out-quart) for natural-feeling
                      transitions. The scroll progress is calculated with careful consideration
                      for different viewport sizes and content heights.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold mb-3">Accessibility Considerations</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      The AppBar maintains proper contrast ratios throughout its transition,
                      and all interactive elements remain keyboard-accessible. Screen readers
                      receive appropriate ARIA labels for state changes.
                    </p>
                  </div>
                </div>
              </section>

              {/* Additional Content Sections */}
              {Array.from({ length: 6 }).map((_, i) => (
                <section key={i} className="p-8 border rounded-xl bg-gradient-to-br from-background to-muted/30">
                  <h3 className="text-2xl font-bold mb-4">
                    Advanced Topic {i + 1}: Dynamic Scroll Effects
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    This section demonstrates how the immersive AppBar maintains perfect readability
                    throughout the entire scroll journey. The backdrop blur intensifies gradually,
                    creating a seamless visual hierarchy that guides the reader's attention.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Notice how the FAB behavior complements the AppBar animations. When scrolling down,
                    both elements gracefully recede to maximize content visibility. When scrolling up,
                    they smoothly reappear, anticipating your need for navigation.
                  </p>
                  <div className="flex gap-2 mt-6">
                    <button
                      onClick={() => snackbar.show(`Exploring topic ${i + 1}`, { severity: 'info' })}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:brightness-110 transition-all"
                    >
                      Learn More
                    </button>
                    <button
                      onClick={() => snackbar.show('Added to reading list', { severity: 'success' })}
                      className="px-4 py-2 border rounded-lg hover:bg-accent transition-all"
                    >
                      Save for Later
                    </button>
                  </div>
                </section>
              ))}

              {/* Conclusion */}
              <section className="py-12 text-center">
                <h3 className="text-3xl font-bold mb-6">Ready to Build?</h3>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Start creating immersive experiences in your own applications.
                  The Scaffold UI library makes it easy to implement these advanced
                  patterns with minimal code.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <button
                    onClick={() => snackbar.show('Opening documentation...', { severity: 'info' })}
                    className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:brightness-110 transition-all shadow-lg"
                  >
                    View Documentation
                  </button>
                  <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="px-6 py-3 border rounded-lg hover:bg-accent transition-all"
                  >
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