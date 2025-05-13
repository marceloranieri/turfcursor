import AuthGuard from '@/components/auth/AuthGuard';
import ProfileContent from '@/components/profile/ProfileContent';

export const dynamic = 'force-dynamic';

export default function ProfilePage() {
  return (
    <AuthGuard>
      <ProfileContent />
    </AuthGuard>
  );
} 