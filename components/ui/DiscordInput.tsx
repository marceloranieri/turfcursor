'use client';

interface DiscordInputProps {
  label?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
}

export default function DiscordInput({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false
}: DiscordInputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-[var(--text-normal)] mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full px-3 py-2 bg-[var(--background-secondary)] border ${
          error ? 'border-red-500' : 'border-[var(--border-color)]'
        } rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)] text-[var(--text-normal)]`}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
} 