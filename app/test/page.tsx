import SupabaseTest from '@/components/SupabaseTest';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Supabase Configuration Test</h1>
          <SupabaseTest />
        </div>
      </div>
    </div>
  );
} 