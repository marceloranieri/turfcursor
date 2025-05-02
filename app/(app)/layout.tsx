import AppClientLayout from './client-layout';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppClientLayout>{children}</AppClientLayout>;
} 