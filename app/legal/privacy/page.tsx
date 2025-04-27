export const dynamic = 'force-static';

export const metadata = {
  title: 'Privacy Policy - Turf App',
  description: 'Read Turf\'s Privacy Policy. We respect your privacy. Only public profile information is collected for login functionality.',
  robots: { index: false, follow: false }
};

export default function PrivacyPolicyPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <div className="text-center max-w-2xl text-gray-700 leading-relaxed">
        <p>We respect your privacy. We only collect your public profile information (name, email) to provide login functionality.</p>
        <p className="mt-4">We do not sell your data.</p>
        <p className="mt-4">You can contact us at <a href="mailto:hello@turfyeah.com" className="underline text-blue-600">hello@turfyeah.com</a> for any questions regarding your data.</p>
        <p className="mt-8 text-sm text-gray-500">Effective Date: April 27, 2025.</p>
      </div>
    </main>
  );
} 