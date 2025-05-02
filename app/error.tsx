'use client';

export default function Error() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-primary">Something went wrong!</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        We're sorry for the inconvenience.
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