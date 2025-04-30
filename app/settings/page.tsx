import dynamic from 'next/dynamic';

// Dynamically import the component with SSR disabled
const SettingsContent = dynamic(
  () => import('@/components/settings/SettingsContent'),
  { ssr: false }
);

export default function SettingsPage() {
  return <SettingsContent />;
} 