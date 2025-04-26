import { captureError } from './sentry';

interface EnvVar {
  name: string;
  required: boolean;
  description: string;
}

const REQUIRED_ENV_VARS: EnvVar[] = [
  {
    name: 'NEXT_PUBLIC_SUPABASE_URL',
    required: true,
    description: 'Supabase project URL',
  },
  {
    name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    required: true,
    description: 'Supabase anonymous key',
  },
  {
    name: 'NEXT_PUBLIC_SENTRY_DSN',
    required: false,
    description: 'Sentry DSN for error tracking',
  },
  {
    name: 'NEXT_PUBLIC_APP_URL',
    required: true,
    description: 'Application URL',
  },
];

export function checkEnvironmentVariables() {
  const missingVars: EnvVar[] = [];
  const invalidVars: EnvVar[] = [];

  REQUIRED_ENV_VARS.forEach((envVar) => {
    const value = process.env[envVar.name];
    
    if (!value) {
      if (envVar.required) {
        missingVars.push(envVar);
      }
    } else if (envVar.name.includes('URL') && !isValidUrl(value)) {
      invalidVars.push(envVar);
    }
  });

  if (missingVars.length > 0 || invalidVars.length > 0) {
    const error = new Error('Environment variables validation failed');
    const context = {
      missing: missingVars.map(v => v.name),
      invalid: invalidVars.map(v => v.name),
      environment: process.env.NODE_ENV,
    };

    // Log the error
    console.error('Environment variables validation failed:', context);

    // Capture in Sentry if in production
    if (process.env.NODE_ENV === 'production') {
      captureError(error, context);
    }

    // Throw in development or if critical vars are missing
    if (process.env.NODE_ENV === 'development' || missingVars.length > 0) {
      throw error;
    }
  }
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Helper to get env var with type safety
export function getEnvVar(name: string, defaultValue?: string): string {
  const value = process.env[name];
  
  if (!value && defaultValue === undefined) {
    throw new Error(`Environment variable ${name} is not set`);
  }
  
  return value || defaultValue || '';
}

// Helper to get boolean env var
export function getBooleanEnvVar(name: string, defaultValue: boolean = false): boolean {
  const value = process.env[name];
  
  if (!value) {
    return defaultValue;
  }
  
  return value.toLowerCase() === 'true';
}

// Helper to get number env var
export function getNumberEnvVar(name: string, defaultValue: number): number {
  const value = process.env[name];
  
  if (!value) {
    return defaultValue;
  }
  
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
} 