'use client';

import { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordInputProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
  error?: string;
  showStrength?: boolean;
}

export function PasswordInput({
  id,
  name,
  label,
  value,
  onChange,
  required = false,
  placeholder,
  autoComplete,
  error,
  showStrength = false
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState(0);
  const [requirements, setRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  useEffect(() => {
    if (!showStrength) return;

    const newRequirements = {
      length: value.length >= 8,
      uppercase: /[A-Z]/.test(value),
      lowercase: /[a-z]/.test(value),
      number: /[0-9]/.test(value),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(value)
    };

    setRequirements(newRequirements);

    // Calculate strength (0-4)
    const strength = Object.values(newRequirements).filter(Boolean).length;
    setStrength(strength);
  }, [value, showStrength]);

  const getStrengthColor = () => {
    switch (strength) {
      case 0: return 'bg-gray-200';
      case 1: return 'bg-red-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-blue-500';
      case 4: return 'bg-green-500';
      default: return 'bg-gray-200';
    }
  };

  const getStrengthText = () => {
    switch (strength) {
      case 0: return 'Very Weak';
      case 1: return 'Weak';
      case 2: return 'Medium';
      case 3: return 'Strong';
      case 4: return 'Very Strong';
      default: return '';
    }
  };

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-text-primary">
        {label}
      </label>
      
      <div className="relative">
        <input
          id={id}
          name={name}
          type={showPassword ? 'text' : 'password'}
          required={required}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          className="w-full rounded-message border border-border bg-input p-3 text-sm focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50 pr-10"
          aria-describedby={error ? `${id}-error` : undefined}
        />
        
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {error && (
        <p id={`${id}-error`} className="text-sm text-red-600">
          {error}
        </p>
      )}

      {showStrength && value && (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full ${getStrengthColor()} transition-all duration-300`}
                style={{ width: `${(strength / 4) * 100}%` }}
              />
            </div>
            <span className="text-xs text-text-secondary">{getStrengthText()}</span>
          </div>

          <ul className="text-xs text-text-secondary space-y-1">
            <li className={`flex items-center ${requirements.length ? 'text-green-600' : ''}`}>
              {requirements.length ? '✓' : '•'} At least 8 characters
            </li>
            <li className={`flex items-center ${requirements.uppercase ? 'text-green-600' : ''}`}>
              {requirements.uppercase ? '✓' : '•'} At least one uppercase letter
            </li>
            <li className={`flex items-center ${requirements.lowercase ? 'text-green-600' : ''}`}>
              {requirements.lowercase ? '✓' : '•'} At least one lowercase letter
            </li>
            <li className={`flex items-center ${requirements.number ? 'text-green-600' : ''}`}>
              {requirements.number ? '✓' : '•'} At least one number
            </li>
            <li className={`flex items-center ${requirements.special ? 'text-green-600' : ''}`}>
              {requirements.special ? '✓' : '•'} At least one special character
            </li>
          </ul>
        </div>
      )}
    </div>
  );
} 