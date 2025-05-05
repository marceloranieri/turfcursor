'use client';

interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) return null;
  
  return (
    <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-500">
      {message}
    </div>
  );
} 