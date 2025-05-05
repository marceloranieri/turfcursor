'use client';

interface ErrorMessageProps {
  error: string | null;
}

export function ErrorMessage({ error }: ErrorMessageProps) {
  if (!error) return null;

  return (
    <div 
      className="rounded-message bg-red-100 p-3 text-sm text-red-700"
      role="alert"
      aria-live="polite"
    >
      {error}
    </div>
  );
} 