import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const generateStaticParams = () => [];

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-primary">404 - Page Not Found</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        The page you're looking for doesn't exist.
      </p>
      <a
        href="/"
        className="mt-8 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
      >
        Return to home
      </a>
    </div>
  );
} 