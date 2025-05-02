export const dynamic = 'force-dynamic';
export const generateStaticParams = () => [];

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background-primary">
      <div className="max-w-md w-full p-6 bg-background-secondary rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Page Not Found</h1>
        <p className="text-text-secondary mb-6">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="flex space-x-4">
          <a
            href="/"
            className="flex-1 px-4 py-2 bg-accent-primary text-white rounded hover:bg-accent-primary-dark transition-colors text-center"
          >
            Go Home
          </a>
          <button
            onClick={() => window.history.back()}
            className="flex-1 px-4 py-2 bg-background-tertiary text-text-primary rounded hover:bg-background-tertiary-dark transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
} 