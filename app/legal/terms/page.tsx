export const dynamic = 'force-static';

export const metadata = {
  title: 'Terms of Service - Turf App',
  description: 'Review the Terms of Service for Turf App. Guidelines for usage, responsibilities, and privacy practices.',
  robots: { index: false, follow: false }
};

export default function TermsOfServicePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <div className="text-center max-w-2xl text-gray-700 leading-relaxed">
        <p>By using Turf App, you agree to our collection and use of information according to our Privacy Policy.</p>
        <p className="mt-4">You must be at least 16 years old to use Turf App.</p>
        <p className="mt-4">We reserve the right to modify or terminate the service for any reason, without notice.</p>
        <p className="mt-8 text-sm text-gray-500">Effective Date: April 27, 2025.</p>
      </div>
    </main>
  );
} 