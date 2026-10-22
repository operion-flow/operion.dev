import Link from 'next/link';
import home from './home.json';

const linkStyles = [
  'inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors',
  'inline-flex items-center justify-center px-6 py-3 text-base font-medium text-fd-foreground border border-fd-border rounded-lg hover:bg-fd-muted transition-colors',
];

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col justify-center text-center px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="mb-6 text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {home.title}
        </h1>
        <p className="mb-8 text-xl text-fd-muted-foreground max-w-2xl mx-auto">
          {home.tagline}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          {home.links.map((link, index) => (
            <Link key={link.href} href={link.href} className={linkStyles[index % linkStyles.length]}>
              {link.label}
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {home.features.map((feature) => (
            <div key={feature.title} className="p-6 rounded-lg border border-fd-border bg-fd-card">
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-fd-muted-foreground">{feature.text}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
