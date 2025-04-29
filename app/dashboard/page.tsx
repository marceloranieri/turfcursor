import { Metadata } from 'next';

export default function DashboardPage(): JSX.Element {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Dashboard cards will go here */}
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        {/* Charts and other content will go here */}
      </div>
    </div>
  );
} 