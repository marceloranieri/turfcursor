import SupabaseTest from '../components/SupabaseTest';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Supabase Configuration Test</h1>
        <SupabaseTest />
      </div>
    </div>
  );
} 