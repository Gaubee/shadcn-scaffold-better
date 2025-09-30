import Link from 'next/link';

export default function Home() {
  const examples = [
    {
      title: 'Basic Example',
      description: 'Complete showcase of all Scaffold components',
      href: '/examples/basic',
      icon: '📱',
    },
    {
      title: 'Immersive AppBar',
      description: 'Scroll-driven immersive header with collapsing effect',
      href: '/examples/immersive',
      icon: '🌊',
    },
    {
      title: 'Responsive Layout',
      description: 'Automatic switching between Drawer and NavigationRail',
      href: '/examples/responsive',
      icon: '📐',
    },
    {
      title: 'Advanced Scroll Animations',
      description: 'CSS scroll-driven animations with JavaScript fallbacks',
      href: '/examples/advanced-scroll',
      icon: '✨',
    },
  ];

  return (
    <main className="min-h-screen p-8 md:p-24">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Scaffold UI
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Flutter-inspired scaffold components for React
          </p>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Built with Next.js 15, Tailwind CSS v4, and shadcn/ui. Features scroll-driven
            animations, responsive design, and SSR support.
          </p>
        </div>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Examples</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {examples.map((example) => (
              <Link
                key={example.href}
                href={example.href}
                className="group p-6 border-2 rounded-xl hover:border-primary hover:shadow-lg transition-all duration-300"
              >
                <div className="text-4xl mb-4">{example.icon}</div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {example.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {example.description}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-8 text-center">Components</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { name: 'AppBar', desc: 'Immersive, collapsible header with scroll effects' },
              { name: 'Drawer', desc: 'Side navigation with gesture support' },
              { name: 'BottomNavigationBar', desc: 'Mobile-friendly bottom navigation' },
              { name: 'NavigationRail', desc: 'Persistent side navigation for desktop' },
              { name: 'FloatingActionButton', desc: 'Prominent action button with hide-on-scroll' },
              { name: 'Snackbar', desc: 'Brief messages with optional actions' },
              { name: 'Modal', desc: 'Full-featured dialog component' },
              { name: 'Scaffold', desc: 'Main layout component integrating everything' },
            ].map((component) => (
              <div
                key={component.name}
                className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <h3 className="font-semibold mb-1">{component.name}</h3>
                <p className="text-sm text-muted-foreground">{component.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Installation</h2>
          <div className="max-w-2xl mx-auto text-left">
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code>{`# Install as shadcn/ui components
npx shadcn-ui add scaffold

# Or copy components manually from src/components/scaffold`}</code>
            </pre>
          </div>
        </section>
      </div>
    </main>
  );
}