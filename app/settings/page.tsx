import AuthGuard from '@/components/auth/AuthGuard';
import SettingsContent from '@/components/settings/SettingsContent';

export const dynamic = 'force-dynamic';

export default function SettingsPage() {
  return (
    <AuthGuard>
      <SettingsContent />
    </AuthGuard>
  );
} 