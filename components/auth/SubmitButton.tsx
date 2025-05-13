'use client';

interface SubmitButtonProps {
  loading: boolean;
  disabled?: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

export function SubmitButton({
  loading,
  disabled = false,
  loadingText = 'Loading...',
  children
}: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      className="w-full rounded-message bg-accent-primary p-3 text-sm font-medium text-white hover:bg-accent-primary-dark focus:outline-none focus:ring-2 focus:ring-accent-primary/50 disabled:bg-accent-primary/70"
      aria-disabled={loading || disabled}
    >
      {loading ? loadingText : children}
    </button>
  );
} 