import React from 'react';

interface DiscordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const DiscordInput: React.FC<DiscordInputProps> = ({
  label,
  error,
  ...props
}) => {
  return (
    <div className="mb-4">
      <label className="block text-[var(--header-secondary)] text-xs font-semibold uppercase mb-2">
        {label}
      </label>
      <input
        {...props}
        className={`
          w-full px-3 py-2 rounded
          bg-[var(--input-bg)]
          text-[var(--text-normal)]
          border border-[var(--divider)]
          focus:outline-none focus:border-[var(--primary-blue)]
          placeholder-[var(--text-muted)]
          ${error ? 'border-[var(--red)]' : ''}
        `}
      />
      {error && (
        <p className="mt-1 text-xs text-[var(--red)]">
          {error}
        </p>
      )}
    </div>
  );
};

export default DiscordInput; 