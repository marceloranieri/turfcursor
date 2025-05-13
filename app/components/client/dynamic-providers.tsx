import dynamic from 'next/dynamic';

export const DynamicProviders = dynamic(
  () => import('./providers').then((mod) => mod.Providers),
  { ssr: false }
); 