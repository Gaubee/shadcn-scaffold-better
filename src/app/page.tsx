import Link from "next/link";

export default function Home() {
  const examples = [
    {
      title: "Baisc Demo",
      description: "Basic demonstration of the multi-pane navigation system",
      href: "/examples/basic",
      icon: "🚂",
    },
    {
      title: "Responsive Demo",
      description: "Multiple Scaffold instances with container queries",
      href: "/examples/responsive-demo",
      icon: "📐",
    },
    {
      title: "Advanced Navigation",
      description: "History API and Navigator API integration",
      href: "/examples/advanced-navigation",
      icon: "🧭",
    },
    {
      title: "RailNavbar",
      description: "Adaptive navigation component with side and bottom layouts",
      href: "/examples/rail-navbar",
      icon: "🎯",
    },
  ];

  return (
    <main className="min-h-screen p-8 md:p-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-16 text-center">
          <h1 className="mb-4 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-5xl font-bold text-transparent md:text-6xl">
            Scaffold UI
          </h1>
          <p className="text-muted-foreground mb-8 text-xl">Flutter-inspired scaffold components for React</p>
          <p className="text-muted-foreground mx-auto max-w-2xl">
            Built with Next.js 15, Tailwind CSS v4, and shadcn/ui. Features scroll-driven animations, responsive design,
            and SSR support.
          </p>
        </div>

        <section className="mb-16">
          <h2 className="mb-8 text-center text-3xl font-bold">Examples</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {examples.map((example) => (
              <Link
                key={example.href}
                href={example.href}
                className="group hover:border-primary hover:bg-accent/50 rounded-xl border-2 p-6 transition-all duration-300 hover:shadow-lg">
                <div className="mb-4 text-4xl">{example.icon}</div>
                <h3 className="group-hover:text-foreground mb-2 text-xl font-semibold transition-colors">
                  {example.title}
                </h3>
                <p className="text-muted-foreground group-hover:text-foreground/80 text-sm">{example.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-8 text-center text-3xl font-bold">Components</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                name: "AppBar",
                desc: "Immersive, collapsible header with scroll effects",
              },
              { name: "Drawer", desc: "Side navigation with gesture support" },
              {
                name: "BottomNavigationBar",
                desc: "Mobile-friendly bottom navigation",
              },
              {
                name: "NavigationRail",
                desc: "Persistent side navigation for desktop",
              },
              {
                name: "FloatingActionButton",
                desc: "Prominent action button with hide-on-scroll",
              },
              {
                name: "Snackbar",
                desc: "Brief messages with optional actions",
              },
              { name: "Modal", desc: "Full-featured dialog component" },
              {
                name: "Scaffold",
                desc: "Main layout component integrating everything",
              },
            ].map((component) => (
              <div key={component.name} className="hover:bg-accent/50 rounded-lg border p-4 transition-colors">
                <h3 className="mb-1 font-semibold">{component.name}</h3>
                <p className="text-muted-foreground text-sm">{component.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16 text-center">
          <h2 className="mb-4 text-2xl font-bold">Installation</h2>
          <div className="mx-auto max-w-2xl text-left">
            <pre className="bg-muted overflow-x-auto rounded-lg p-4">
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
