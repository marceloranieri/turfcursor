'use client';

import { useAuth } from '@/lib/auth/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { IconType } from 'react-icons';

interface GuestAwareReactionButtonProps {
  icon: IconType;
  onClick: () => void;
  isActive?: boolean;
  count?: number;
  className?: string;
}

export function GuestAwareReactionButton({
  icon: Icon,
  onClick,
  isActive = false,
  count = 0,
  className,
}: GuestAwareReactionButtonProps) {
  const { user } = useAuth();
  const router = useRouter();

  const handleClick = () => {
    if (!user) {
      router.push('/login');
      return;
    }
    onClick();
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        'flex items-center gap-1 px-2 py-1 hover:bg-muted',
        isActive && 'text-primary',
        className
      )}
      onClick={handleClick}
    >
      <Icon className={cn('h-4 w-4', isActive && 'text-primary')} />
      {count > 0 && <span className="text-xs">{count}</span>}
    </Button>
  );
} 