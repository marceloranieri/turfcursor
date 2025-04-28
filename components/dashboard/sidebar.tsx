import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Overview', href: '/dashboard' },
  { name: 'Topics', href: '/dashboard/topics' },
  { name: 'Messages', href: '/dashboard/messages' },
  { name: 'Settings', href: '/dashboard/settings' },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden border-r bg-background md:block md:w-64">
      <div className="flex h-full flex-col">
        <div className="flex-1 space-y-1 p-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group flex items-center rounded-md px-3 py-2 text-sm font-medium',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent hover:text-accent-foreground'
                )}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
} 